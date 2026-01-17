// src/middleware.ts
// Security middleware: Rate limiting + Security headers + Admin protection

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Simple in-memory rate limiter (for serverless, consider using Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMITS: Record<string, number> = {
    '/api/auth/register': 5,    // 5 registrations per minute
    '/api/auth': 20,            // 20 auth requests per minute
    '/api/orders': 10,          // 10 orders per minute
    '/api': 100,                // 100 general API requests per minute
};

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    return ip;
}

function checkRateLimit(ip: string, path: string): { allowed: boolean; remaining: number } {
    // Find matching rate limit
    let limit = RATE_LIMITS['/api']; // Default
    for (const [pattern, maxRequests] of Object.entries(RATE_LIMITS)) {
        if (path.startsWith(pattern) && pattern !== '/api') {
            limit = maxRequests;
            break;
        }
    }

    const key = `${ip}:${path.split('/').slice(0, 3).join('/')}`;
    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(key, { count: 1, timestamp: now });
        return { allowed: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: limit - record.count };
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // XSS Protection (legacy but still useful)
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy (disable unnecessary features)
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Content Security Policy (adjust as needed)
    response.headers.set('Content-Security-Policy', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' blob: https://www.google-analytics.com https://api.moysklad.ru",
        "frame-ancestors 'none'",
    ].join('; '));

    return response;
}

export async function middleware(request: NextRequest) {
    // Log incoming cookies for debugging
    console.log('🔧 Middleware - Cookies header:', request.headers.get('cookie'));

    const { pathname } = request.nextUrl;

    // Admin route protection (except login page)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        console.log('🔐 Middleware - Admin check, token:', token);

        if (!token) {
            // Not logged in - redirect to home
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (token.role !== 'ADMIN') {
            // Not admin - redirect to home
            console.log('❌ Not admin, role:', token.role);
            return NextResponse.redirect(new URL('/', request.url));
        }

        console.log('✅ Admin access granted via middleware');
    }

    // Rate limiting for API routes
    if (pathname.startsWith('/api')) {
        const ip = getClientIP(request);
        const { allowed, remaining } = checkRateLimit(ip, pathname);

        if (!allowed) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': '60',
                        'X-RateLimit-Remaining': '0',
                    },
                }
            );
        }

        // Continue with rate limit headers
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Remaining', String(remaining));
        return addSecurityHeaders(response);
    }

    // Add security headers to all responses
    const response = NextResponse.next();
    return addSecurityHeaders(response);
}

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
    ],
};

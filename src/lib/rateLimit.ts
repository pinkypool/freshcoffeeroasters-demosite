// src/lib/rateLimit.ts
// Simple in-memory rate limiting

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

interface RateLimitOptions {
    windowMs?: number; // Time window in ms (default: 15 min)
    maxRequests?: number; // Max requests per window (default: 100)
}

export function rateLimit(
    identifier: string,
    options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetIn: number } {
    const { windowMs = 15 * 60 * 1000, maxRequests = 100 } = options;
    const now = Date.now();
    const key = identifier;

    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
        entry = { count: 0, resetTime: now + windowMs };
        rateLimitStore.set(key, entry);
    }

    entry.count++;

    const remaining = Math.max(0, maxRequests - entry.count);
    const resetIn = Math.max(0, entry.resetTime - now);

    return {
        success: entry.count <= maxRequests,
        remaining,
        resetIn,
    };
}

// Preset for login attempts (strict)
export function rateLimitLogin(ip: string) {
    return rateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, maxRequests: 5 });
}

// Preset for API calls (moderate)
export function rateLimitApi(ip: string) {
    return rateLimit(`api:${ip}`, { windowMs: 60 * 1000, maxRequests: 60 });
}

// Preset for order creation (strict)
export function rateLimitOrder(userId: string) {
    return rateLimit(`order:${userId}`, { windowMs: 60 * 1000, maxRequests: 5 });
}

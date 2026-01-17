// src/app/api/user/profile/route.ts
// Demo: Return mock user profile

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findUserById } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// GET - Get current user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = findUserById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                type: user.type,
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
    }
}

// PUT - Update profile (demo: just returns success)
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone } = body;

        // Demo: Return updated data without actually saving
        console.log('[DEMO] Profile update:', { name, phone });

        return NextResponse.json({
            user: {
                id: session.user.id,
                email: session.user.email,
                name: name || session.user.name,
                phone: phone || null,
                type: session.user.type,
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

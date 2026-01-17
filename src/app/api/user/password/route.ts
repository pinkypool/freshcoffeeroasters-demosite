// src/app/api/user/password/route.ts
// Demo: Password change (just returns success)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST - Change password (demo: just returns success)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.currentPassword || !body.newPassword) {
            return NextResponse.json({ error: 'Введите текущий и новый пароль' }, { status: 400 });
        }

        // Demo: Always succeed
        console.log('[DEMO] Password change requested');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}

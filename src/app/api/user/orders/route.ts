// src/app/api/user/orders/route.ts
// Demo: Return mock orders for user

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrders } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// GET - Get user's orders
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = getOrders(session.user.id);

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json({ error: 'Failed to get orders' }, { status: 500 });
    }
}

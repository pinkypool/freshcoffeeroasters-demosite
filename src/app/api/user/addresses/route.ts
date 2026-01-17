// src/app/api/user/addresses/route.ts  
// Demo: Return mock addresses

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrders } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// GET - Get user's saved addresses
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get last order's address as saved address
        const orders = getOrders(session.user.id);
        const lastOrder = orders.find(o => o.address);

        const addresses = lastOrder ? [{
            city: lastOrder.city,
            address: lastOrder.address,
            isDefault: true,
        }] : [];

        return NextResponse.json({ addresses });
    } catch (error) {
        console.error('Get addresses error:', error);
        return NextResponse.json({ error: 'Failed to get addresses' }, { status: 500 });
    }
}

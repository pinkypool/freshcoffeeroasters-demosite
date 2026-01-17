// src/app/api/orders/route.ts
// Demo: Orders stored in memory (no database)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrders, addOrder, Order } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// Generate unique order number
function generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `FC-${dateStr}-${random}`;
}

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

// POST - Create new order (stored in memory)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();

        const {
            customerName,
            customerPhone,
            customerEmail,
            city,
            address,
            deliveryMethod,
            pickupPointId,
            comment,
            paymentMethod,
            items,
            companyId,
        } = body;

        // Validation
        if (!customerName || !customerPhone || !city || !items?.length) {
            return NextResponse.json(
                { error: 'Заполните обязательные поля' },
                { status: 400 }
            );
        }

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
        const deliveryFee = 0;
        const total = subtotal + deliveryFee;

        const orderNumber = generateOrderNumber();

        // Create order in memory
        const order: Order = {
            id: `order-${Date.now()}`,
            orderNumber,
            customerName,
            customerPhone,
            customerEmail: customerEmail || null,
            city,
            address: address || null,
            deliveryMethod,
            pickupPointId: pickupPointId || null,
            comment: comment || null,
            subtotal,
            deliveryFee,
            total,
            status: paymentMethod === 'invoice' ? 'PENDING' : 'CONFIRMED',
            paymentStatus: paymentMethod === 'robokassa' ? 'PAID' : 'PENDING',
            paymentMethod: paymentMethod || 'robokassa',
            userId: session?.user?.id || null,
            companyId: companyId || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: items.map((item: { sku: string; name: string; quantity: number; pricePerKg: number; total: number }, index: number) => ({
                id: `item-${Date.now()}-${index}`,
                productId: null,
                productSku: item.sku,
                productName: item.name,
                quantity: item.quantity,
                pricePerKg: Math.round(item.pricePerKg),
                total: Math.round(item.total),
            })),
        };

        addOrder(order);

        // Demo: Log order instead of sending to MoySklad
        console.log('[DEMO] Order created:', orderNumber);

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                total: order.total,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

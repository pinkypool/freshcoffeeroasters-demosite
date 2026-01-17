import { NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/pricing';
import { createMoySkladOrder } from '@/lib/moysklad';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, city, address, comment, items } = body;

        // Basic validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        // Server-side Pricing Validation
        // Recalculate prices to ensure no tampering
        const validatedItems = items.map((item: { sku: string; name: string; quantity: number }) => {
            const pricePerKg = calculatePrice(item.sku, item.quantity);
            return {
                sku: item.sku,
                name: item.name,
                quantity: item.quantity,
                price: pricePerKg
            };
        });

        // Calculate order total
        const orderTotal = validatedItems.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);

        // Generate order number
        const orderNumber = `FC-${Date.now().toString(36).toUpperCase()}`;

        const orderData = {
            orderNumber,
            name,
            phone,
            city,
            address,
            comment,
            items: validatedItems,
            total: orderTotal
        };

        // Send to MoySklad
        const result = await createMoySkladOrder(orderData);

        return NextResponse.json({ success: true, orderId: result.id });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// src/app/api/products/route.ts
// Public API for getting products - mock data only

import { NextResponse } from 'next/server';
import { getCachedProducts, cacheExists } from '@/lib/productCache';
import { getFormattedProducts } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// GET - Get all active products (from cache or mock data)
export async function GET() {
    try {
        // Try cache first (instant load)
        if (cacheExists()) {
            const cached = getCachedProducts();
            if (cached.length > 0) {
                return NextResponse.json({
                    products: cached,
                    count: cached.length,
                    source: 'cache'
                });
            }
        }

        // Use mock data
        const formattedProducts = getFormattedProducts();

        return NextResponse.json({
            products: formattedProducts,
            count: formattedProducts.length,
            source: 'mock'
        });

    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json({ error: 'Failed to get products' }, { status: 500 });
    }
}

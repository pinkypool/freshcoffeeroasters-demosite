// src/lib/productCache.ts
// Static product cache - updated only when admin publishes

import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'public', 'data', 'products.json');

export interface CachedProduct {
    id: string;
    slug: string;
    name: string;
    subtitle: string;
    description: string;
    image: string;
    pricePerKg: number;
    grindOptions: string[];
    flavorNotes: string[];
    flavorColors: string[]; // Colors for each note
    density: number;
    acidity: number;
    rating: number;
    reviews: number;
    badge: string | null;
    category: string;
}

// Read cached products (fast, no DB call)
export function getCachedProducts(): CachedProduct[] {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading product cache:', error);
    }
    return [];
}

// Write products to cache (called from admin publish)
export function writeCachedProducts(products: CachedProduct[]): void {
    try {
        // Ensure directory exists
        const dir = path.dirname(CACHE_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(CACHE_FILE, JSON.stringify(products, null, 2));
        console.log(`Product cache updated: ${products.length} products`);
    } catch (error) {
        console.error('Error writing product cache:', error);
        throw error;
    }
}

// Check if cache exists
export function cacheExists(): boolean {
    return fs.existsSync(CACHE_FILE);
}

// src/lib/mockData.ts
// Mock data for demo site - no database required

import bcrypt from 'bcryptjs';

// ============ TYPES ============
export interface OrderItem {
    id: string;
    productId: string | null;
    productName: string;
    productSku: string;
    quantity: number;
    pricePerKg: number;
    total: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    city: string;
    address: string | null;
    deliveryMethod: string;
    pickupPointId: string | null;
    comment: string | null;
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    userId: string | null;
    companyId: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
}
export const mockProducts = [
    {
        id: 'cff16985-8714-11f0-0a80-17b400432823',
        sku: 'brazil-alfenas',
        slug: 'brazil-alfenas',
        name: 'Кофе Fresh Бразилия Альфенас',
        subtitle: '100% Арабика',
        description: 'Мягкий бархатистый вкус. Ноты молочного шоколада и сухофруктов. Без горечи.',
        image: '/assets/products/Brazil-arabica.png',
        priceTiers: { '1': 13860, '5': 12870, '10': 11970, '25': 11000, '50': 10500 },
        flavorNotes: ['шоколад', 'сухофрукты'],
        flavorColors: ['#8B4513', '#DEB887'],
        roastLevel: 3,
        acidityLevel: 2,
        category: 'arabica',
        isActive: true,
        sortOrder: 1,
        badges: ['popular'],
    },
    {
        id: 'e19e6031-94bc-11f0-0a80-07290000db87',
        sku: 'espresso-80-20',
        slug: 'espresso-80-20',
        name: 'Кофе Fresh Эспрессо №1',
        subtitle: '80/20 Арабика/Робуста',
        description: 'Сбалансированный, плотный, кремовая текстура. Средняя крепость.',
        image: '/assets/products/Espresso-8020.png',
        priceTiers: { '1': 13020, '5': 12110, '10': 11250, '25': 10350, '50': 9870 },
        flavorNotes: ['шоколад', 'крем'],
        flavorColors: ['#8B4513', '#FFFDD0'],
        roastLevel: 4,
        acidityLevel: 2,
        category: 'espresso',
        isActive: true,
        sortOrder: 2,
        badges: ['hit'],
    },
    {
        id: '09862cb5-cea9-11f0-0a80-0376004bef9f',
        sku: 'espresso-70-30',
        slug: 'espresso-70-30',
        name: 'Кофе Fresh Эспрессо 70/30',
        subtitle: '70/30 Арабика/Робуста',
        description: 'Бодрящий, насыщенный. Нотки тёмного шоколада и ореха.',
        image: '/assets/products/Espresso-7030.png',
        priceTiers: { '1': 12390, '5': 11510, '10': 10700, '25': 9840, '50': 9380 },
        flavorNotes: ['шоколад', 'орех'],
        flavorColors: ['#5C4033', '#D2691E'],
        roastLevel: 4,
        acidityLevel: 2,
        category: 'espresso',
        isActive: true,
        sortOrder: 3,
        badges: [],
    },
    {
        id: '619471ae-cea9-11f0-0a80-0ea0004ef41a',
        sku: 'espresso-50-50',
        slug: 'espresso-50-50',
        name: 'Кофе Fresh Эспрессо 50/50',
        subtitle: '50/50 Арабика/Робуста',
        description: 'Очень крепкий, мощный, с горчинкой. Высокий кофеин.',
        image: '/assets/products/Espresso-5050.png',
        priceTiers: { '1': 11130, '5': 10350, '10': 9620, '25': 8850, '50': 8440 },
        flavorNotes: ['горький', 'насыщенный'],
        flavorColors: ['#3D2314', '#654321'],
        roastLevel: 5,
        acidityLevel: 1,
        category: 'espresso',
        isActive: true,
        sortOrder: 4,
        badges: [],
    },
    {
        id: '7821b630-cea9-11f0-0a80-037600c06ac0',
        sku: 'vending-robusta',
        slug: 'vending-robusta',
        name: 'Кофе Fresh Vending Special',
        subtitle: '100% Робуста',
        description: 'Крепкий, простой, выгодный. Для вендинговых автоматов.',
        image: '/assets/products/Vending.png',
        priceTiers: { '1': 9765, '5': 9080, '10': 8440, '25': 7760, '50': 7400 },
        flavorNotes: ['крепкий'],
        flavorColors: ['#1C1C1C'],
        roastLevel: 5,
        acidityLevel: 1,
        category: 'robusta',
        isActive: true,
        sortOrder: 5,
        badges: [],
    },
    {
        id: 'd73af5ff-ca99-11f0-0a80-10dd00045b6e',
        sku: 'toreo-dulce',
        slug: 'toreo-dulce',
        name: 'Кофе Toreo Arabica Dulce',
        subtitle: '100% Арабика',
        description: 'Мягкий классический вкус. Аналог Бразилии Альфенас.',
        image: '/assets/products/Toreo.png',
        priceTiers: { '1': 13860, '5': 12870, '10': 11970, '25': 11000, '50': 10500 },
        flavorNotes: ['мягкий', 'классика'],
        flavorColors: ['#C4A484', '#D4A574'],
        roastLevel: 3,
        acidityLevel: 2,
        category: 'arabica',
        isActive: true,
        sortOrder: 6,
        badges: ['new'],
    },
    {
        id: '6b013a5c-ceaa-11f0-0a80-0d2f004de831',
        sku: 'tasting-set',
        slug: 'tasting-set',
        name: 'Дегустационный набор Fresh Coffee',
        subtitle: '5 видов по 200г',
        description: '5 пачек по 200г (все виды, кроме Toreo). Идеально для знакомства с ассортиментом.',
        image: '/assets/products/Tasting-set.png',
        priceTiers: { '1': 10000 },
        flavorNotes: ['набор'],
        flavorColors: ['#4849E8'],
        roastLevel: 3,
        acidityLevel: 3,
        category: 'set',
        isActive: true,
        sortOrder: 7,
        badges: ['week_pick'],
    },
];

// ============ USERS ============
// Pre-hashed passwords: demo123 and admin123
const DEMO_PASSWORD_HASH = '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lLKg4pQmGy'; // demo123
const ADMIN_PASSWORD_HASH = '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lLKg4pQmGy'; // admin123

export const mockUsers = [
    {
        id: 'demo-user-001',
        email: 'demo@freshcoffeekz.com',
        passwordHash: DEMO_PASSWORD_HASH,
        name: 'Демо Пользователь',
        phone: '+7 777 123 4567',
        role: 'USER',
        type: 'RETAIL',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-06-01'),
    },
    {
        id: 'admin-user-001',
        email: 'admin@freshcoffeekz.com',
        passwordHash: ADMIN_PASSWORD_HASH,
        name: 'Администратор',
        phone: '+7 700 111 2222',
        role: 'ADMIN',
        type: 'RETAIL',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'wholesale-user-001',
        email: 'wholesale@freshcoffeekz.com',
        passwordHash: DEMO_PASSWORD_HASH,
        name: 'Оптовый Клиент',
        phone: '+7 701 999 8888',
        role: 'USER',
        type: 'WHOLESALE',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01'),
    },
];

// ============ ORDERS ============
export const mockOrders = [
    {
        id: 'order-001',
        orderNumber: 'FC-20240615-A1B2',
        customerName: 'Демо Пользователь',
        customerPhone: '+7 777 123 4567',
        customerEmail: 'demo@freshcoffeekz.com',
        city: 'Алматы',
        address: 'ул. Абая 150, офис 301',
        deliveryMethod: 'courier',
        pickupPointId: null,
        comment: 'Позвонить за час до доставки',
        subtotal: 25740,
        deliveryFee: 0,
        total: 25740,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        paymentMethod: 'robokassa',
        userId: 'demo-user-001',
        companyId: null,
        createdAt: new Date('2024-06-15T10:30:00'),
        updatedAt: new Date('2024-06-15T10:30:00'),
        items: [
            {
                id: 'item-001',
                productId: 'cff16985-8714-11f0-0a80-17b400432823',
                productName: 'Кофе Fresh Бразилия Альфенас',
                productSku: 'brazil-alfenas',
                quantity: 2,
                pricePerKg: 12870,
                total: 25740,
            },
        ],
    },
    {
        id: 'order-002',
        orderNumber: 'FC-20240620-C3D4',
        customerName: 'Демо Пользователь',
        customerPhone: '+7 777 123 4567',
        customerEmail: 'demo@freshcoffeekz.com',
        city: 'Алматы',
        address: null,
        deliveryMethod: 'teez',
        pickupPointId: 'ALM-001',
        comment: null,
        subtotal: 36330,
        deliveryFee: 0,
        total: 36330,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        paymentMethod: 'robokassa',
        userId: 'demo-user-001',
        companyId: null,
        createdAt: new Date('2024-06-20T14:45:00'),
        updatedAt: new Date('2024-06-20T14:45:00'),
        items: [
            {
                id: 'item-002',
                productId: 'e19e6031-94bc-11f0-0a80-07290000db87',
                productName: 'Кофе Fresh Эспрессо №1',
                productSku: 'espresso-80-20',
                quantity: 3,
                pricePerKg: 12110,
                total: 36330,
            },
        ],
    },
];

// ============ IN-MEMORY STORAGE ============
// For demo: store new orders in memory
const memoryOrders: Order[] = [...mockOrders as Order[]];

export function getOrders(userId?: string): Order[] {
    if (userId) {
        return memoryOrders.filter(o => o.userId === userId);
    }
    return memoryOrders;
}

export function addOrder(order: Order): Order {
    memoryOrders.push(order);
    return order;
}

export function getOrderById(id: string) {
    return memoryOrders.find(o => o.id === id || o.orderNumber === id);
}

// ============ USER HELPERS ============
export function findUserByEmail(email: string) {
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string) {
    return mockUsers.find(u => u.id === id);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ============ PRODUCT HELPERS ============
export function getFormattedProducts() {
    return mockProducts.filter(p => p.isActive).map(product => {
        const priceTiers = product.priceTiers as Record<string, number>;
        const basePrice = priceTiers['1'] || 9765;

        return {
            id: product.id,
            slug: product.slug,
            name: product.name,
            subtitle: product.subtitle,
            description: product.description,
            image: product.image,
            pricePerKg: basePrice,
            grindOptions: ['В зёрнах', 'Эспрессо', 'Турка', 'Фильтр', 'Френч-пресс'],
            flavorNotes: product.flavorNotes,
            flavorColors: product.flavorColors,
            density: product.roastLevel,
            acidity: product.acidityLevel,
            rating: 4.7,
            reviews: Math.floor(Math.random() * 100) + 50,
            badge: product.badges?.[0] || null,
        };
    });
}

export function findProductBySku(sku: string) {
    return mockProducts.find(p => p.sku === sku);
}

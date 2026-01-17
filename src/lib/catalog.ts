export interface Product {
    id: string;
    slug: string;
    name: string;
    subtitle: string; // e.g. "натуральный", "для эспрессо"
    description: string;
    image: string;
    grindOptions: string[];
    // Tasty Coffee Style Attributes
    flavorNotes: string[]; // e.g. ["грейпфрут", "тёмные ягоды", "молочный шоколад"]
    flavorColors?: string[]; // Hex colors for each flavor note
    density: number; // 1-5 scale (Плотность)
    acidity: number; // 1-5 scale (Кислотность)
    rating?: number; // e.g. 4.6
    reviews?: number; // e.g. 808
    badge?: string; // e.g. "СОРТ НЕДЕЛИ", "популярный", "новое"
    pricePerKg?: number; // From database
}

export const GRIND_OPTIONS = ['В зёрнах', 'Эспрессо', 'Турка', 'Фильтр', 'Френч-пресс'];

export const PRODUCTS: Product[] = [
    {
        id: 'cff16985-8714-11f0-0a80-17b400432823',
        slug: 'brazil-alfenas',
        name: 'Бразилия Альфенас Дульче',
        subtitle: '100% арабика',
        description: 'Сладкий кофе с нотами цитруса, карамели и миндаля.',
        image: '/assets/products/alfenas.jpg',
        grindOptions: GRIND_OPTIONS,
        flavorNotes: ['цитрус', 'карамель', 'миндаль'],
        density: 4,
        acidity: 2,
        rating: 4.8,
        reviews: 156,
        badge: 'популярный',
    },
    {
        id: 'e19e6031-94bc-11f0-0a80-07290000db87',
        slug: 'espresso-1',
        name: 'Эспрессо #1',
        subtitle: 'смесь 80/20',
        description: 'Классический эспрессо. 80% Арабика, 20% Робуста. Густая крема.',
        image: '/assets/products/espresso1.png',
        grindOptions: GRIND_OPTIONS,
        flavorNotes: ['шоколад', 'орех', 'карамель'],
        density: 5,
        acidity: 1,
        rating: 4.6,
        reviews: 89,
    },
    {
        id: '09862cb5-cea9-11f0-0a80-0376004bef9f',
        slug: 'espresso-70-30',
        name: 'Эспрессо 70/30',
        subtitle: 'смесь 70/30',
        description: 'Более крепкий эспрессо. 70% Арабика, 30% Робуста.',
        image: '/assets/products/espresso1.png',
        grindOptions: GRIND_OPTIONS,
        flavorNotes: ['тёмный шоколад', 'специи', 'табак'],
        density: 5,
        acidity: 1,
        rating: 4.5,
        reviews: 234,
        badge: 'СОРТ НЕДЕЛИ',
    },
    {
        id: '619471ae-cea9-11f0-0a80-0ea0004ef41a',
        slug: 'espresso-50-50',
        name: 'Эспрессо 50/50',
        subtitle: 'смесь 50/50',
        description: 'Интенсивный утренний кофе. 50% Арабика, 50% Робуста.',
        image: '/assets/products/espresso1.png',
        grindOptions: GRIND_OPTIONS,
        flavorNotes: ['какао', 'жареный орех', 'дым'],
        density: 5,
        acidity: 1,
        rating: 4.3,
        reviews: 67,
    },
    {
        id: '7821b630-cea9-11f0-0a80-037600c06ac0',
        slug: 'vending-robusta',
        name: 'Fresh Vending Special',
        subtitle: 'смесь 100% робусты',
        description: 'Высокое содержание кофеина. Идеально для вендинга.',
        image: '/assets/products/espresso1.png',
        grindOptions: GRIND_OPTIONS,
        flavorNotes: ['горький шоколад', 'дерево', 'земля'],
        density: 5,
        acidity: 0,
        rating: 4.1,
        reviews: 45,
    },
];

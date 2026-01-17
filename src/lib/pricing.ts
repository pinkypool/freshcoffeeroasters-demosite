export type ProductTier = 1 | 2 | 3 | 4 | 5 | 6;

export interface PricingRule {
  sku: string;
  tiers: Record<ProductTier, number>;
}

export const PRICING_TABLE: PricingRule[] = [
  {
    sku: 'BRAZIL_ALFENAS', // Applies to Toreo Arabica too
    tiers: {
      1: 13860,
      2: 13167,
      3: 12474,
      4: 11781,
      5: 11088,
      6: 10395,
    },
  },
  {
    sku: 'ESPRESSO_1',
    tiers: {
      1: 13020,
      2: 12369,
      3: 11718,
      4: 11067,
      5: 10416,
      6: 9765,
    },
  },
  {
    sku: 'ESPRESSO_70_30',
    tiers: {
      1: 12390,
      2: 11771,
      3: 11151,
      4: 10532,
      5: 9912,
      6: 9293,
    },
  },
  {
    sku: 'ESPRESSO_50_50',
    tiers: {
      1: 11130,
      2: 10574,
      3: 10017,
      4: 9461,
      5: 8904,
      6: 8348,
    },
  },
  {
    sku: 'VENDING_ROBUSTA',
    tiers: {
      1: 9765,
      2: 9277,
      3: 8789,
      4: 8300,
      5: 7812,
      6: 7324,
    },
  },
];

export const TASTING_SET_PRICE = 10000;

export function getTier(quantity: number): ProductTier {
  if (quantity >= 100) return 6;
  if (quantity >= 50) return 5;
  if (quantity >= 30) return 4;
  if (quantity >= 10) return 3;
  if (quantity >= 5) return 2;
  return 1;
}

export function calculatePrice(sku: string, quantity: number): number {
  if (sku === 'TASTING_SET') return TASTING_SET_PRICE; // Fixed price per item, usually quantity 1

  const rule = PRICING_TABLE.find((r) => r.sku === sku);
  if (!rule) {
    console.warn(`Pricing rule not found for SKU: ${sku}`);
    return 0;
  }

  const tier = getTier(quantity);
  return rule.tiers[tier];
}

export function calculateTotal(sku: string, quantity: number): number {
  const pricePerKg = calculatePrice(sku, quantity);
  return pricePerKg * quantity;
}

// Helper function to get price for a specific quantity
export function getPriceForQuantity(sku: string, quantity: number): { pricePerKg: number; total: number } {
  const pricePerKg = calculatePrice(sku, quantity);
  return {
    pricePerKg,
    total: pricePerKg * quantity,
  };
}

// Get upsell message if user is close to next tier
export function getUpsellMessage(sku: string, quantity: number): string | null {
  const tier = getTier(quantity);

  // Define thresholds for upsell
  const thresholds = [
    { tier: 1, nextQty: 5, message: 'Добавьте ещё и получите -5%!' },
    { tier: 2, nextQty: 10, message: 'До -10% осталось совсем немного!' },
    { tier: 3, nextQty: 30, message: 'Закажите 30 кг и получите -15%!' },
    { tier: 4, nextQty: 50, message: 'При 50 кг скидка -20%!' },
    { tier: 5, nextQty: 100, message: 'Максимальная скидка -25% от 100 кг!' },
  ];

  const upsell = thresholds.find(t => t.tier === tier);
  if (upsell && quantity < upsell.nextQty && quantity >= upsell.nextQty - 3) {
    return upsell.message;
  }

  return null;
}


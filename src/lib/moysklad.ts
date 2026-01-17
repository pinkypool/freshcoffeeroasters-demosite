// src/lib/moysklad.ts
// MoySklad API integration for Fresh Coffee

const MOYSKLAD_API_URL = process.env.MOYSKLAD_API_URL || 'https://api.moysklad.ru/api/remap/1.2';
const MOYSKLAD_TOKEN = process.env.MOYSKLAD_TOKEN || '';

// Product UUIDs from MoySklad - keys must match cart item SKUs
// ProductCard.tsx uses uppercase SKUs like BRAZIL_ALFENAS, ESPRESSO_1, etc.
const PRODUCT_UUID_MAP: Record<string, string> = {
  // Actual SKU values from ProductCard.tsx getSku()
  'BRAZIL_ALFENAS': 'cff16985-8714-11f0-0a80-17b400432823',
  'ESPRESSO_1': 'e19e6031-94bc-11f0-0a80-07290000db87',
  'ESPRESSO_70_30': '09862cb5-cea9-11f0-0a80-0376004bef9f',
  'ESPRESSO_50_50': '619471ae-cea9-11f0-0a80-0ea0004ef41a',
  'VENDING_ROBUSTA': '7821b630-cea9-11f0-0a80-037600c06ac0',
  // Additional products not in ProductCard skuMap yet
  'TOREO_DULCE': 'd73af5ff-ca99-11f0-0a80-10dd00045b6e',
  'TASTING_SET': '6b013a5c-ceaa-11f0-0a80-0d2f004de831',
};

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number; // Price per kg in tenge (already discounted)
}

export interface CustomerOrder {
  orderNumber: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  comment: string;
  items: OrderItem[];
  total: number;
  paymentMethod?: string; // 'robokassa' | 'invoice'
}

interface MoySkladResponse {
  success: boolean;
  id?: string;
  error?: string;
}

// Helper to make authenticated requests
async function msRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${MOYSKLAD_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${MOYSKLAD_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

// Find or create counterparty (customer)
async function findOrCreateCounterparty(name: string, phone: string, email?: string): Promise<string | null> {
  try {
    // Search by phone
    const searchResponse = await msRequest(`/entity/counterparty?filter=phone=${encodeURIComponent(phone)}`);
    if (searchResponse.ok) {
      const data = await searchResponse.json();
      if (data.rows?.length > 0) {
        return data.rows[0].meta.href;
      }
    }

    // Create new counterparty
    const createResponse = await msRequest('/entity/counterparty', {
      method: 'POST',
      body: JSON.stringify({
        name,
        phone,
        email: email || undefined,
        companyType: 'individual',
      }),
    });

    if (createResponse.ok) {
      const data = await createResponse.json();
      return data.meta.href;
    }
    return null;
  } catch (error) {
    console.error('Counterparty error:', error);
    return null;
  }
}

// Get organization
let cachedOrgHref: string | null = null;
async function getOrganization(): Promise<string | null> {
  if (cachedOrgHref) return cachedOrgHref;
  try {
    const response = await msRequest('/entity/organization');
    if (response.ok) {
      const data = await response.json();
      if (data.rows?.length > 0) {
        cachedOrgHref = data.rows[0].meta.href;
        return cachedOrgHref;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Get or create sales channel "Сайт"
let cachedChannelHref: string | null = null;
async function getSalesChannel(): Promise<string | null> {
  if (cachedChannelHref) return cachedChannelHref;
  try {
    const response = await msRequest('/entity/saleschannel');
    if (response.ok) {
      const data = await response.json();
      const siteChannel = data.rows?.find((ch: { name: string }) =>
        ch.name.toLowerCase().includes('сайт') || ch.name.toLowerCase().includes('site')
      );
      if (siteChannel) {
        cachedChannelHref = siteChannel.meta.href;
        return cachedChannelHref;
      }
    }
    // Create if not exists
    const createResponse = await msRequest('/entity/saleschannel', {
      method: 'POST',
      body: JSON.stringify({ name: 'Сайт', type: 'ECOMMERCE' }),
    });
    if (createResponse.ok) {
      const data = await createResponse.json();
      cachedChannelHref = data.meta.href;
      return cachedChannelHref;
    }
    return null;
  } catch {
    return null;
  }
}

// Base prices (Tier 1) for calculating discount
const BASE_PRICES: Record<string, number> = {
  'BRAZIL_ALFENAS': 13860,
  'ESPRESSO_1': 13020,
  'ESPRESSO_70_30': 12390,
  'ESPRESSO_50_50': 11130,
  'VENDING_ROBUSTA': 9765,
  'TOREO_DULCE': 13860,
  'TASTING_SET': 10000,
};

// Build order positions with base price and discount
function buildPositions(items: OrderItem[]): object[] {
  const positions: object[] = [];
  for (const item of items) {
    const productUuid = PRODUCT_UUID_MAP[item.sku];
    if (!productUuid) {
      console.warn(`No UUID for SKU: ${item.sku}`);
      continue;
    }

    // Get base price (tier 1) for this product
    const basePrice = BASE_PRICES[item.sku] || item.price;

    // Calculate discount percentage
    // discount = (basePrice - discountedPrice) / basePrice * 100
    let discountPercent = 0;
    if (basePrice > item.price && basePrice > 0) {
      discountPercent = Math.round(((basePrice - item.price) / basePrice) * 100);
    }

    // Price in tiyn (tenge * 100) - use BASE price, not discounted
    const basePriceInTiyn = basePrice * 100;

    positions.push({
      quantity: item.quantity,
      price: basePriceInTiyn, // Base price
      discount: discountPercent, // Discount in %
      assortment: {
        meta: {
          href: `${MOYSKLAD_API_URL}/entity/product/${productUuid}`,
          type: 'product',
          mediaType: 'application/json',
        }
      }
    });
  }
  return positions;
}

// Create customer order in MoySklad
export async function createMoySkladOrder(order: CustomerOrder): Promise<MoySkladResponse> {
  if (!MOYSKLAD_TOKEN) {
    console.warn('MoySklad token not configured');
    return { success: false, error: 'Token not configured' };
  }

  try {
    const orgHref = await getOrganization();
    if (!orgHref) return { success: false, error: 'Organization not found' };

    const counterpartyHref = await findOrCreateCounterparty(order.name, order.phone, order.email);
    if (!counterpartyHref) return { success: false, error: 'Failed to create counterparty' };

    const salesChannelHref = await getSalesChannel();
    const positions = buildPositions(order.items);
    const fullAddress = order.city + (order.address ? `, ${order.address}` : '');

    const orderPayload: Record<string, unknown> = {
      name: order.orderNumber, // Номер заказа = название
      organization: { meta: { href: orgHref, type: 'organization', mediaType: 'application/json' } },
      agent: { meta: { href: counterpartyHref, type: 'counterparty', mediaType: 'application/json' } },
      shipmentAddress: fullAddress, // Адрес доставки
      description: order.comment || undefined, // Комментарий
      positions: positions.length > 0 ? positions : undefined,
    };

    if (salesChannelHref) {
      orderPayload.salesChannel = { meta: { href: salesChannelHref, type: 'saleschannel', mediaType: 'application/json' } };
    }

    // Set status for invoice orders to "Счет на оплату"
    if (order.paymentMethod === 'invoice') {
      // Fetch available states and find "Счет на оплату"
      const statesResponse = await msRequest('/entity/customerorder/metadata');
      if (statesResponse.ok) {
        const metadata = await statesResponse.json();
        const invoiceState = metadata.states?.find((s: { name: string }) =>
          s.name.toLowerCase().includes('счет') || s.name.toLowerCase().includes('счёт')
        );
        if (invoiceState?.meta?.href) {
          orderPayload.state = { meta: { href: invoiceState.meta.href, type: 'state', mediaType: 'application/json' } };
          console.log('Setting invoice state:', invoiceState.name);
        }
      }
    }

    console.log('Creating MoySklad order:', JSON.stringify(orderPayload, null, 2));

    const response = await msRequest('/entity/customerorder', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('MoySklad order created:', data.name, data.id);
      return { success: true, id: data.id };
    } else {
      const errorText = await response.text();
      console.error('MoySklad order failed:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('MoySklad order error:', error);
    return { success: false, error: String(error) };
  }
}

// Sync order status
export async function syncOrderStatus(moyskladId: string): Promise<string | null> {
  try {
    const response = await msRequest(`/entity/customerorder/${moyskladId}`);
    if (response.ok) {
      const data = await response.json();
      return data.state?.name || null;
    }
    return null;
  } catch {
    return null;
  }
}

// Update order status in MoySklad
export async function updateMoySkladOrderStatus(moyskladId: string, statusName: string): Promise<boolean> {
  try {
    // Get available states
    const statesResponse = await msRequest('/entity/customerorder/metadata');
    if (!statesResponse.ok) return false;

    const metadata = await statesResponse.json();
    const targetState = metadata.states?.find((s: { name: string }) =>
      s.name.toLowerCase() === statusName.toLowerCase()
    );

    if (!targetState?.meta?.href) {
      console.error('State not found:', statusName);
      return false;
    }

    // Update order
    const response = await msRequest(`/entity/customerorder/${moyskladId}`, {
      method: 'PUT',
      body: JSON.stringify({
        state: { meta: { href: targetState.meta.href, type: 'state', mediaType: 'application/json' } }
      }),
    });

    if (response.ok) {
      console.log('MoySklad order status updated to:', statusName);
      return true;
    } else {
      console.error('Failed to update status:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Update status error:', error);
    return false;
  }
}

// Create incoming payment (paymentin) for order
export async function createMoySkladPayment(moyskladOrderId: string, amount: number): Promise<boolean> {
  if (!MOYSKLAD_TOKEN) return false;

  try {
    const orgHref = await getOrganization();
    if (!orgHref) return false;

    // Get order details for agent info
    const orderResponse = await msRequest(`/entity/customerorder/${moyskladOrderId}`);
    if (!orderResponse.ok) return false;

    const orderData = await orderResponse.json();

    const paymentPayload = {
      organization: { meta: { href: orgHref, type: 'organization', mediaType: 'application/json' } },
      agent: orderData.agent, // Use agent from order
      sum: amount * 100, // MoySklad expects sum in kopecks (minor units)
      operations: [{
        meta: {
          href: `${MOYSKLAD_API_URL}/entity/customerorder/${moyskladOrderId}`,
          type: 'customerorder',
          mediaType: 'application/json',
        }
      }],
    };

    console.log('Creating payment:', JSON.stringify(paymentPayload, null, 2));

    const response = await msRequest('/entity/paymentin', {
      method: 'POST',
      body: JSON.stringify(paymentPayload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('MoySklad payment created:', data.id);
      return true;
    } else {
      const errorText = await response.text();
      console.error('MoySklad payment failed:', errorText);
      return false;
    }
  } catch (error) {
    console.error('Create payment error:', error);
    return false;
  }
}

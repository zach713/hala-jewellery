import { PRODUCTS } from '../src/data/catalog.ts';
import type { CurrencyCode } from '../src/types.ts';
import { getCurrencyMeta } from '../src/utils/currency.ts';

const ALLOWED_CURRENCIES: ReadonlySet<CurrencyCode> = new Set([
  'MAD',
  'USD',
  'EUR',
  'GBP',
]);
const ALLOWED_GIFT_CARD_AMOUNTS = new Set([50, 100, 150, 200, 300]);

interface IncomingOrderItem {
  productId?: unknown;
  quantity?: unknown;
  isGiftCard?: unknown;
  priceAud?: unknown;
}

export interface OrderResult {
  status: number;
  body: Record<string, unknown>;
}

function isPrivateOrLoopbackHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === '[::1]' ||
    host === '0.0.0.0' ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }
  if (/^10\./.test(host)) return true;
  if (/^127\./.test(host)) return true;
  if (/^169\.254\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  const match172 = host.match(/^172\.(\d+)\./);
  if (match172) {
    const secondOctet = Number(match172[1]);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }
  return false;
}

function isSafeHttpsWebhookUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return false;
    if (!parsed.hostname || isPrivateOrLoopbackHost(parsed.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function getHeaderString(
  headers: Record<string, string | string[] | undefined>,
  name: string
): string {
  const value = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] ?? '';
  return typeof value === 'string' ? value : '';
}

function resolvePublicHttpsOrigin(
  headers: Record<string, string | string[] | undefined>
): string {
  const forwardedHost = getHeaderString(headers, 'x-forwarded-host');
  const hostHeader = getHeaderString(headers, 'host');
  const rawHost = (forwardedHost || hostHeader).split(',')[0].trim();

  if (
    rawHost &&
    /^[a-z0-9.-]+(:\d+)?$/i.test(rawHost) &&
    !isPrivateOrLoopbackHost(rawHost.split(':')[0])
  ) {
    return `https://${rawHost}`;
  }

  const envAppUrl = process.env.APP_URL?.trim();
  if (envAppUrl) {
    try {
      const parsed = new URL(envAppUrl);
      if (
        parsed.protocol === 'https:' &&
        !isPrivateOrLoopbackHost(parsed.hostname)
      ) {
        return parsed.origin;
      }
    } catch {
      // Ignore malformed APP_URL
    }
  }

  return 'https://www.halajewellery.store';
}

function buildHttpsImageUrl(imagePath: string, origin: string): string {
  if (!imagePath) {
    return `${origin}/hala-og.png`;
  }
  if (imagePath.startsWith('https://')) {
    return imagePath;
  }
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${origin}${normalizedPath}`;
}

function generateOrderCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 9; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function processOrder(
  rawBodyInput: unknown,
  headers: Record<string, string | string[] | undefined>
): Promise<OrderResult> {
  let parsedBody: unknown = rawBodyInput;
  if (typeof rawBodyInput === 'string') {
    try {
      parsedBody = JSON.parse(rawBodyInput);
    } catch {
      return { status: 400, body: { error: 'Invalid JSON payload' } };
    }
  }

  if (
    !parsedBody ||
    typeof parsedBody !== 'object' ||
    Array.isArray(parsedBody)
  ) {
    return { status: 400, body: { error: 'Invalid order payload' } };
  }

  const body = parsedBody as Record<string, unknown>;

  const rawName = typeof body.name === 'string' ? body.name.trim() : '';
  const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const rawCity = typeof body.city === 'string' ? body.city.trim() : '';
  const rawAddress =
    typeof body.address === 'string' ? body.address.trim() : '';
  const rawPromo =
    typeof body.promoCode === 'string'
      ? body.promoCode.trim().toUpperCase()
      : '';
  const rawCurrency =
    typeof body.currency === 'string' &&
    ALLOWED_CURRENCIES.has(body.currency as CurrencyCode)
      ? (body.currency as CurrencyCode)
      : 'MAD';

  if (!rawName || rawName.length > 150) {
    return { status: 400, body: { error: 'Valid customer name is required' } };
  }
  if (!rawPhone || rawPhone.length > 40) {
    return { status: 400, body: { error: 'Valid phone number is required' } };
  }
  if (!rawCity || rawCity.length > 100) {
    return { status: 400, body: { error: 'Valid city is required' } };
  }
  if (!rawAddress || rawAddress.length > 300) {
    return {
      status: 400,
      body: { error: 'Valid delivery address is required' },
    };
  }

  const rawItems = Array.isArray(body.items)
    ? (body.items as IncomingOrderItem[])
    : [];
  if (rawItems.length === 0 || rawItems.length > 50) {
    return {
      status: 400,
      body: { error: 'Order must contain at least one item' },
    };
  }

  const productLookup = new Map(PRODUCTS.map((p) => [p.id, p]));
  const validatedItems: {
    productId: string;
    name: string;
    priceAud: number;
    quantity: number;
    image: string;
  }[] = [];

  for (const entry of rawItems) {
    if (!entry || typeof entry !== 'object') {
      return { status: 400, body: { error: 'Invalid item entry' } };
    }

    const qty =
      typeof entry.quantity === 'number' &&
      Number.isInteger(entry.quantity) &&
      entry.quantity >= 1 &&
      entry.quantity <= 99
        ? entry.quantity
        : 0;
    if (!qty) {
      return { status: 400, body: { error: 'Invalid item quantity' } };
    }

    const productId =
      typeof entry.productId === 'string' ? entry.productId.trim() : '';

    if (entry.isGiftCard === true || productId === 'gift-card') {
      const giftAmount =
        typeof entry.priceAud === 'number' &&
        ALLOWED_GIFT_CARD_AMOUNTS.has(entry.priceAud)
          ? entry.priceAud
          : 0;
      if (!giftAmount) {
        return { status: 400, body: { error: 'Invalid gift card amount' } };
      }
      validatedItems.push({
        productId: 'gift-card',
        name: 'Hala Digital Gift Card',
        priceAud: giftAmount,
        quantity: qty,
        image: '/hala-og.png',
      });
      continue;
    }

    const catalogProduct = productLookup.get(productId);
    if (!catalogProduct) {
      return { status: 400, body: { error: 'Unknown product in order' } };
    }

    validatedItems.push({
      productId: catalogProduct.id,
      name: catalogProduct.name,
      priceAud: catalogProduct.priceAud,
      quantity: qty,
      image: catalogProduct.image,
    });
  }

  const subtotalAud = validatedItems.reduce(
    (sum, item) => sum + item.priceAud * item.quantity,
    0
  );

  const discountRate =
    rawPromo === 'HALA20' || rawPromo === 'WELCOME20'
      ? 0.2
      : rawPromo === 'HALA10' || rawPromo === 'WELCOME10'
        ? 0.1
        : 0;

  const discountAud =
    discountRate > 0 ? Number((subtotalAud * discountRate).toFixed(2)) : 0;
  const totalAud = Math.max(0, Number((subtotalAud - discountAud).toFixed(2)));

  const { rate } = getCurrencyMeta(rawCurrency);
  const total = Number((totalAud * rate).toFixed(2));
  const totalQty = validatedItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemsSummary = validatedItems
    .map((item) => `${item.name} x${item.quantity}`)
    .join(', ');

  const origin = resolvePublicHttpsOrigin(headers);
  const firstImage = validatedItems[0]?.image ?? '/hala-og.png';
  const imageUrl = buildHttpsImageUrl(firstImage, origin);

  const webhookUrl = process.env.SHEETS_WEBHOOK_URL?.trim() ?? '';
  const webhookSecret = process.env.SHEETS_WEBHOOK_SECRET ?? '';

  if (!webhookUrl || !isSafeHttpsWebhookUrl(webhookUrl)) {
    return {
      status: 502,
      body: {
        error:
          'Unable to submit your order right now because the order webhook is unavailable. Please contact us on WhatsApp to complete your order.',
      },
    };
  }

  const webhookPayload = {
    secret: webhookSecret,
    name: rawName,
    phone: rawPhone,
    city: rawCity,
    address: rawAddress,
    items: itemsSummary,
    qty: totalQty,
    total,
    image: imageUrl,
  };

  try {
    const upstreamRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });

    if (!upstreamRes.ok && upstreamRes.status !== 302) {
      return {
        status: 502,
        body: {
          error:
            'We could not record your order right now. Please contact us on WhatsApp to complete your order.',
        },
      };
    }
  } catch {
    return {
      status: 502,
      body: {
        error:
          'We could not reach the order service right now. Please contact us on WhatsApp to complete your order.',
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      orderNumber: generateOrderCode(),
      subtotalAud,
      discountAud,
      totalAud,
      total,
      qty: totalQty,
    },
  };
}

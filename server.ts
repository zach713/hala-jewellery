import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS } from './src/data/catalog.ts';
import type { CurrencyCode } from './src/types.ts';
import { getCurrencyMeta } from './src/utils/currency.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function resolvePublicHttpsOrigin(req: Request): string {
  const forwardedHostRaw = req.headers['x-forwarded-host'];
  const forwardedHost = Array.isArray(forwardedHostRaw)
    ? forwardedHostRaw[0]
    : forwardedHostRaw;
  const rawHost = (forwardedHost || req.get('host') || '').split(',')[0].trim();

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
      if (parsed.protocol === 'https:' && !isPrivateOrLoopbackHost(parsed.hostname)) {
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

async function startServer() {
  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/orders', async (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid order payload' });
      return;
    }

    const rawName = typeof body.name === 'string' ? body.name.trim() : '';
    const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const rawCity = typeof body.city === 'string' ? body.city.trim() : '';
    const rawAddress = typeof body.address === 'string' ? body.address.trim() : '';
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
      res.status(400).json({ error: 'Valid customer name is required' });
      return;
    }
    if (!rawPhone || rawPhone.length > 40) {
      res.status(400).json({ error: 'Valid phone number is required' });
      return;
    }
    if (!rawCity || rawCity.length > 100) {
      res.status(400).json({ error: 'Valid city is required' });
      return;
    }
    if (!rawAddress || rawAddress.length > 300) {
      res.status(400).json({ error: 'Valid delivery address is required' });
      return;
    }

    const rawItems = Array.isArray(body.items)
      ? (body.items as IncomingOrderItem[])
      : [];
    if (rawItems.length === 0 || rawItems.length > 50) {
      res.status(400).json({ error: 'Order must contain at least one item' });
      return;
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
        res.status(400).json({ error: 'Invalid item entry' });
        return;
      }

      const qty =
        typeof entry.quantity === 'number' &&
        Number.isInteger(entry.quantity) &&
        entry.quantity >= 1 &&
        entry.quantity <= 99
          ? entry.quantity
          : 0;
      if (!qty) {
        res.status(400).json({ error: 'Invalid item quantity' });
        return;
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
          res.status(400).json({ error: 'Invalid gift card amount' });
          return;
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
        res.status(400).json({ error: 'Unknown product in order' });
        return;
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

    const origin = resolvePublicHttpsOrigin(req);
    const firstImage = validatedItems[0]?.image ?? '/hala-og.png';
    const imageUrl = buildHttpsImageUrl(firstImage, origin);

    const webhookUrl = process.env.SHEETS_WEBHOOK_URL?.trim() ?? '';
    const webhookSecret = process.env.SHEETS_WEBHOOK_SECRET ?? '';

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

    let forwarded = false;
    if (webhookUrl && isSafeHttpsWebhookUrl(webhookUrl)) {
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
        forwarded = upstreamRes.ok || upstreamRes.status === 302;
      } catch {
        forwarded = false;
      }
    }

    res.status(200).json({
      ok: true,
      forwarded,
      orderNumber: generateOrderCode(),
      subtotalAud,
      discountAud,
      totalAud,
      total,
      qty: totalQty,
    });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api/')) {
        next();
        return;
      }
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err instanceof Error ? err.message : 'unknown error');
  process.exit(1);
});

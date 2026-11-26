import { processOrder } from '../lib/orders.ts';

interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface VercelResponse {
  setHeader(name: string, value: string | string[]): unknown;
  status(code: number): {
    json(data: unknown): void;
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const result = await processOrder(req.body, req.headers);
  res.status(result.status).json(result.body);
}

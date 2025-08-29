import { object, string, parse } from 'valibot';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

const RequestSchema = object({
  message: string(),
});

const ResponseSchema = object({
  message: string(),
});

export default async function handler(req: any, res: any) {
  const ip =
    (req.headers['x-forwarded-for'] as string) ||
    req.socket?.remoteAddress ||
    'unknown';

  const { success } = await ratelimit.limit(`node-echo:${ip}`);
  if (!success) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Missing Idempotency-Key' });
  }

  const cached = await redis.get(`idem:${idempotencyKey}`);
  if (cached) {
    return res.status(200).json(JSON.parse(cached as string));
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  let parsed;
  try {
    parsed = parse(RequestSchema, body);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const response = parse(ResponseSchema, { message: parsed.message });

  await redis.set(`idem:${idempotencyKey}`, JSON.stringify(response), {
    ex: 60 * 60,
  });

  return res.status(200).json(response);
}

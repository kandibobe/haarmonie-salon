import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

/**
 * Rate-Limiting für API-Routen (Upstash sliding window).
 * Ohne Redis: no-op (immer erlaubt) — Demo läuft auch ohne Infrastruktur.
 *
 * Pro Anwendungsfall eine eigene Instanz mit eigenem Prefix, damit die
 * Limits sich nicht gegenseitig beeinflussen.
 */
const limiters = {
  booking: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '10 m'),
        prefix: 'rl:booking',
        analytics: false,
      })
    : null,
  chat: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        prefix: 'rl:chat',
        analytics: false,
      })
    : null,
  contact: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '10 m'),
        prefix: 'rl:contact',
        analytics: false,
      })
    : null,
  adminLogin: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '15 m'),
        prefix: 'rl:adminLogin',
        analytics: false,
      })
    : null,
} as const;

export type RateLimitScope = keyof typeof limiters;

/** Liefert die Client-IP aus den üblichen Proxy-Headern (Vercel). */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? '127.0.0.1';
}

/**
 * Prüft das Limit für eine IP. Gibt { success } zurück.
 * Bei Fehlern oder fehlendem Redis: success = true (nicht blockieren).
 */
export async function checkRateLimit(
  scope: RateLimitScope,
  identifier: string
): Promise<{ success: boolean; remaining?: number }> {
  const limiter = limiters[scope];
  if (!limiter) return { success: true };
  try {
    const { success, remaining } = await limiter.limit(identifier);
    return { success, remaining };
  } catch {
    return { success: true };
  }
}

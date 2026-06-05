import { Redis } from '@upstash/redis';

/**
 * Geteilter Upstash-Redis-Client (REST).
 * Gibt null zurück, wenn keine Env-Variablen gesetzt sind, damit die Demo
 * auch ohne Infrastruktur läuft (graceful degradation).
 */
export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export const isRedisEnabled = redis !== null;

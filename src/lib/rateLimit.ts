import { headers } from "next/headers";

/**
 * Returns the caller IP suitable for use as a rate-limit key.
 * Must be called from a server action or route handler.
 */
export async function getCallerIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Upstash Redis-backed rate limiter (production)
// Falls back to in-process Map when env vars are absent (local dev).
// ---------------------------------------------------------------------------

type RateLimitResult = { allowed: boolean; remaining: number };

// --- In-process fallback (dev / staging without Redis) ---
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const MAX_ENTRIES = 5_000;
const store = new Map<string, RateLimitEntry>();

function evictExpired() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
    if (store.size <= MAX_ENTRIES) break;
  }
}

function inProcessCheck(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    if (store.size >= MAX_ENTRIES) evictExpired();
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  existing.count++;
  return { allowed: true, remaining: limit - existing.count };
}

// --- Upstash Redis sliding-window rate limiter ---
let upstashClient: import("@upstash/ratelimit").Ratelimit | null = null;

function getUpstashLimiter(limit: number, windowSeconds: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  // Lazy import to avoid loading Upstash in environments without env vars
  const { Ratelimit } = require("@upstash/ratelimit");
  const { Redis } = require("@upstash/redis");

  // Create a new limiter per distinct (limit, window) combination.
  // For simplicity we create one per call — Ratelimit is lightweight.
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
  }) as import("@upstash/ratelimit").Ratelimit;
}

/**
 * Check a rate limit for the given key.
 * Uses Upstash Redis in production (when UPSTASH_REDIS_REST_URL is set),
 * falls back to in-process Map otherwise.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const windowSeconds = Math.ceil(windowMs / 1000);
  const limiter = getUpstashLimiter(limit, windowSeconds);

  if (limiter) {
    const result = await limiter.limit(key);
    return { allowed: result.success, remaining: result.remaining };
  }

  return inProcessCheck(key, limit, windowMs);
}

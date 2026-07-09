import { NextResponse } from 'next/server';

// Sliding-window rate limiting with a distributed backend and a local fallback (#1.2).
//
// When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, counters live
// in Upstash Redis — shared across every serverless instance and durable across
// cold starts, so the limit holds under horizontal scale. When they are absent
// (local dev, or before the store is provisioned), we fall back to a per-instance
// in-memory window: an effective abuse-brake, just not a distributed guarantee.
// Any Redis error also degrades to memory so a store outage never 500s a request.
const windowMs = 60_000; // 1 minute
const store = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

/** Per-instance in-memory window — the fallback backend. */
function memoryRateLimit(key: string, maxRequests: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt, limit: maxRequests };
  }

  entry.count += 1;
  const remaining = Math.max(0, maxRequests - entry.count);
  return { allowed: entry.count <= maxRequests, remaining, resetAt: entry.resetAt, limit: maxRequests };
}

/**
 * Distributed window backed by Upstash Redis (REST). Atomic per key:
 *   INCR key            → current count in this window
 *   PEXPIRE key ms NX   → set the TTL only on the first hit of the window
 *   PTTL key            → remaining window in ms (for the reset header)
 * Returns null when the store isn't configured or the request fails, so the
 * caller transparently falls back to memory.
 */
async function upstashRateLimit(key: string, maxRequests: number): Promise<RateLimitResult | null> {
  // Accept either the native Upstash names or the Vercel/Upstash KV aliases.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url.replace(/\/+$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['PEXPIRE', key, String(windowMs), 'NX'],
        ['PTTL', key],
      ]),
      // Keep the hot path fast: a slow store must not stall the API.
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as Array<{ result?: unknown; error?: unknown }>;
    if (!Array.isArray(data) || data[0]?.error) return null;

    const count = Number(data[0]?.result ?? 0);
    if (!Number.isFinite(count) || count <= 0) return null;

    let pttl = Number(data[2]?.result ?? windowMs);
    if (!Number.isFinite(pttl) || pttl < 0) pttl = windowMs;

    const remaining = Math.max(0, maxRequests - count);
    return { allowed: count <= maxRequests, remaining, resetAt: Date.now() + pttl, limit: maxRequests };
  } catch {
    // Network/timeout/parse error → let the caller fall back to memory.
    return null;
  }
}

/**
 * Increment and evaluate the limit for `key`. Uses the distributed store when
 * configured, otherwise the in-memory window. Always resolves — never throws.
 */
export async function rateLimit(key: string, maxRequests = 30): Promise<RateLimitResult> {
  const distributed = await upstashRateLimit(key, maxRequests);
  return distributed ?? memoryRateLimit(key, maxRequests);
}

/**
 * Derive the client IP from proxy headers (Vercel sets x-forwarded-for). Used
 * to scope the rate-limit key so a single session can't be trivially reset by
 * rotating, and abuse from one IP is contained (#4.1).
 */
export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/** Standard RateLimit-* headers describing the current window (#4.1). */
export function rateLimitHeaders(r: RateLimitResult): Record<string, string> {
  return {
    'RateLimit-Limit': String(r.limit),
    'RateLimit-Remaining': String(r.remaining),
    'RateLimit-Reset': String(Math.max(0, Math.ceil((r.resetAt - Date.now()) / 1000))),
  };
}

export function rateLimitResponse(result?: RateLimitResult) {
  const headers = result ? rateLimitHeaders(result) : undefined;
  return NextResponse.json(
    { error: 'Too many requests. Please wait a moment and try again.' },
    { status: 429, headers: { ...headers, 'Retry-After': headers?.['RateLimit-Reset'] ?? '60' } }
  );
}

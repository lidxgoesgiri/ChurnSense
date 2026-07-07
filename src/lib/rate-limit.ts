import { NextResponse } from 'next/server';

// Simple in-memory sliding window. Resets on cold start, and each serverless
// instance keeps its own map — acceptable for a demo/abuse-brake, not a
// distributed guarantee. For production, migrate this to a shared store such as
// Upstash Redis keyed the same way; the call sites already pass an IP-scoped
// key so the swap is isolated to this module. (#4.1)
const windowMs = 60_000; // 1 minute
const store = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export function rateLimit(key: string, maxRequests = 30): RateLimitResult {
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

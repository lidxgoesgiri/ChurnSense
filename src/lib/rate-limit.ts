import { NextResponse } from 'next/server';

// Simple in-memory sliding window. Resets on cold start, and each serverless
// instance keeps its own map — acceptable for a demo/abuse-brake, not a
// distributed guarantee. For production use a shared store (e.g. Upstash).
const windowMs = 60_000; // 1 minute
const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests = 30
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  entry.count += 1;
  const remaining = Math.max(0, maxRequests - entry.count);
  return { allowed: entry.count <= maxRequests, remaining, resetAt: entry.resetAt };
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: 'Too many requests. Please wait a moment and try again.' },
    { status: 429 }
  );
}

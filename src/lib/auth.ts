import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const COOKIE_NAME = 'cs_session';

// HMAC secret for signing the session cookie. Validated in env.ts: required
// (≥32 chars) in production, so there is NO public fallback in a real
// deployment (#1.2). The dev-only value below is used solely when NODE_ENV is
// not production and COOKIE_SECRET is unset, keeping local login/verify
// consistent without weakening production.
const COOKIE_SECRET = env.COOKIE_SECRET ?? 'dev-only-insecure-secret-not-for-production';

const MAX_JSON_BODY = 50 * 1024; // 50KB — analytics payloads are tiny.

/** Sign a value with HMAC-SHA256 so a forged cookie can be detected. */
export function signValue(value: string): string {
  const sig = crypto
    .createHmac('sha256', COOKIE_SECRET)
    .update(value)
    .digest('hex');
  return `${value}.${sig}`;
}

/** Verify a signed value; returns the raw value or null if the signature fails. */
function verifyValue(signed: string): string | null {
  const lastDot = signed.lastIndexOf('.');
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  const sig = signed.slice(lastDot + 1);
  const expected = crypto
    .createHmac('sha256', COOKIE_SECRET)
    .update(value)
    .digest('hex');
  // Constant-time compare to avoid timing leaks; lengths must match first.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return value;
}

/**
 * Validate the session cookie and return the user email, or null if the
 * request is unauthenticated or the cookie signature is invalid/forged.
 */
export async function getSession(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const verified = verifyValue(raw);
  if (!verified) return null;
  try {
    return decodeURIComponent(verified);
  } catch {
    return null;
  }
}

/** 401 response for unauthenticated requests. */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Authentication required. Please log in first.' },
    { status: 401 }
  );
}

/**
 * Lightweight CSRF mitigation: browsers cannot set a custom header on a
 * cross-origin request without a CORS preflight the server never allows,
 * so requiring this header blocks simple form-based CSRF.
 */
export function csrfCheck(request: Request): boolean {
  return request.headers.get('x-requested-with') === 'ChurnSense';
}

/** 403 response for requests failing the CSRF header check. */
export function forbiddenResponse() {
  return NextResponse.json(
    { error: 'Invalid request origin' },
    { status: 403 }
  );
}

type ParsedBody = { data: unknown } | { error: NextResponse };

/**
 * Parse a JSON body with a HARD size ceiling. The content-length header is only
 * a fast-path reject — the real enforcement reads the raw text and measures its
 * actual byte length, so a missing or forged header cannot bypass the limit
 * (#4.3). The content-type is also required to be JSON.
 */
export async function parseJsonBody(
  request: Request,
  maxBytes: number = MAX_JSON_BODY
): Promise<ParsedBody> {
  const tooLarge = () => ({
    error: NextResponse.json(
      { error: `Request body too large. Maximum ${maxBytes} bytes.` },
      { status: 413 }
    ),
  });

  // Reject an obviously-wrong content-type on a JSON endpoint.
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType && !contentType.includes('application/json')) {
    return {
      error: NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      ),
    };
  }

  // Fast path: trust a present, over-limit header to reject early.
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > maxBytes) return tooLarge();

  // Authoritative check: measure the actual bytes regardless of the header.
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { error: NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) };
  }
  if (new TextEncoder().encode(raw).length > maxBytes) return tooLarge();

  try {
    return { data: JSON.parse(raw) };
  } catch {
    return {
      error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }
}

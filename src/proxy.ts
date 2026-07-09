import { NextResponse, type NextRequest } from 'next/server';

// Centralized authentication gate (#1.3).
//
// Every request is denied by default unless it matches an explicit public path.
// This means a newly-added API route is protected automatically — a developer
// cannot forget to add a session check. Per-route handlers still call
// getSession() for the caller's identity; this layer is the safety net that
// rejects unauthenticated traffic before it reaches them.
//
// Runs on the Edge runtime, so it re-implements HMAC verification with Web
// Crypto (Node's `crypto` and next/headers are unavailable here). The signing
// scheme mirrors src/lib/auth.ts exactly: value + '.' + hex(HMAC-SHA256).

const COOKIE_NAME = 'cs_session';

// Paths reachable WITHOUT a session cookie. Everything else requires one.
// /api/health/internal is listed here because it enforces its OWN bearer-token
// check (HEALTH_TOKEN) rather than a session — CI hits it with a token (#4.4).
const PUBLIC_PATHS = ['/', '/api/auth/login', '/api/auth/verify', '/api/health', '/api/health/internal'];

// API prefixes that must return 401 JSON (not a redirect) when unauthenticated.
const API_PREFIX = '/api';

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

async function verifySignedCookie(signed: string, secret: string): Promise<boolean> {
  const lastDot = signed.lastIndexOf('.');
  if (lastDot === -1) return false;
  const value = signed.slice(0, lastDot);
  const sig = signed.slice(lastDot + 1);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Length check then constant-time-ish compare over the hex strings.
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const secret =
    process.env.COOKIE_SECRET ?? 'dev-only-insecure-secret-not-for-production';
  const raw = request.cookies.get(COOKIE_NAME)?.value;
  const authed = raw ? await verifySignedCookie(raw, secret) : false;

  if (authed) return NextResponse.next();

  // Unauthenticated: JSON 401 for API calls, redirect to login for pages.
  if (pathname.startsWith(API_PREFIX)) {
    return NextResponse.json(
      { error: 'Authentication required. Please log in first.' },
      { status: 401 }
    );
  }
  const loginUrl = new URL('/', request.url);
  return NextResponse.redirect(loginUrl);
}

// Run on everything except Next internals and static assets. Individual public
// paths are allow-listed inside the proxy body above.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|churn.jpg|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)'],
};

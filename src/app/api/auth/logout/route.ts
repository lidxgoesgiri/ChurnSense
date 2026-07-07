import { NextResponse } from 'next/server';
import { COOKIE_NAME, csrfCheckOrigin, forbiddenResponse } from '@/lib/auth';

// POST /api/auth/logout — clear the session cookie. Origin-based CSRF guard
// (#3.2) blocks cross-origin browser calls while allowing API clients, and it
// references the single COOKIE_NAME constant so login/logout never drift (#1.4).
export async function POST(request: Request) {
  if (!csrfCheckOrigin(request)) return forbiddenResponse();
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}

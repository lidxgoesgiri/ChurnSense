import { NextResponse } from 'next/server';
import { COOKIE_NAME, csrfCheck, forbiddenResponse } from '@/lib/auth';

// POST /api/auth/logout — clear the session cookie. Guarded by the same custom
// header CSRF check as other mutating endpoints (#3.2), and referencing the
// single COOKIE_NAME constant so login/logout can never drift apart (#1.4).
export async function POST(request: Request) {
  if (!csrfCheck(request)) return forbiddenResponse();
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}

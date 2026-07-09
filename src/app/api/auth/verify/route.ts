import { NextResponse } from 'next/server';
import { issueSession, verifyEmailToken } from '@/lib/auth';

// GET /api/auth/verify?token=... — completes the magic-link sign-in (#1.1).
// Verifies the short-lived signed token, and only then issues the session cookie
// and redirects to the dashboard. An invalid/expired token bounces to the
// landing page with an error flag (no session granted).
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  const email = token ? verifyEmailToken(token) : null;

  if (!email) {
    return NextResponse.redirect(new URL('/?error=invalid_or_expired_link', request.url));
  }

  const res = NextResponse.redirect(new URL('/dashboard', request.url));
  issueSession(res, email);
  return res;
}

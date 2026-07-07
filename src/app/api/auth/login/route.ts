import { NextResponse } from 'next/server';
import { z } from 'zod';
import { COOKIE_NAME, signValue } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('A valid email is required'),
});

// Passwordless email sign-in: a valid email establishes an HMAC-signed,
// httpOnly session cookie (see COOKIE_SECRET). The session gates the dashboard;
// the cookie is cryptographically tamper-evident.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Missing or invalid fields', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const res = NextResponse.json({ success: true, email: parsed.data.email });
  res.cookies.set(COOKIE_NAME, signValue(encodeURIComponent(parsed.data.email)), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('A valid email is required'),
});

// Dummy session auth for the demo: a valid email sets an httpOnly cookie.
// No password store — this only gates the dashboard, it is not real identity.
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
  res.cookies.set('cs_session', encodeURIComponent(parsed.data.email), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

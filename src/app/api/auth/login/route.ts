import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createEmailToken, issueSession } from '@/lib/auth';
import { hasEmailProvider, sendMagicLink } from '@/lib/email';

const loginSchema = z.object({
  email: z.string().email('A valid email is required'),
});

// Magic-link verification is ON only when explicitly enabled AND a provider is
// wired up (#1.1). Left OFF by default so demo/automated flows keep the instant
// passwordless sign-in; flip AUTH_REQUIRE_VERIFICATION=true for a public launch.
function verificationRequired(): boolean {
  return process.env.AUTH_REQUIRE_VERIFICATION === 'true' && hasEmailProvider();
}

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
  const { email } = parsed.data;

  // Verified flow: prove inbox ownership before issuing a session (#1.1). We
  // email a short-lived signed link and return `pending` — no cookie yet.
  if (verificationRequired()) {
    const token = createEmailToken(email);
    const link = `${new URL(request.url).origin}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const sent = await sendMagicLink(email, link);
    if (!sent) {
      return NextResponse.json(
        { error: 'Could not send the sign-in email. Please try again shortly.' },
        { status: 502 }
      );
    }
    return NextResponse.json({
      pending: true,
      message: 'Check your inbox for a secure sign-in link.',
    });
  }

  // Instant passwordless flow (default): a valid email establishes the session.
  const res = NextResponse.json({ success: true, email });
  issueSession(res, email);
  return res;
}

// Transactional email via Resend REST (#1.1). No SDK dependency — a single
// fetch keeps the bundle small and the Edge/Node runtimes both happy. Returns
// false (never throws) when unconfigured or on failure, so callers degrade
// gracefully instead of 500-ing.

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** True when a provider is wired up (key present). */
export function hasEmailProvider(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Send a magic sign-in link to `email`. Returns whether it was accepted. */
export async function sendMagicLink(email: string, link: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  // Resend's shared onboarding sender works without a verified domain for demos;
  // override with EMAIL_FROM once a domain is configured.
  const from = process.env.EMAIL_FROM || 'ChurnSense <onboarding@resend.dev>';

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 8px">Sign in to ChurnSense</h2>
      <p style="color:#555;margin:0 0 20px">Click the button below to finish signing in. This link expires in 15 minutes.</p>
      <a href="${link}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">Open ChurnSense →</a>
      <p style="color:#999;font-size:12px;margin:20px 0 0">If you didn't request this, you can safely ignore this email.</p>
    </div>`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your ChurnSense sign-in link',
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

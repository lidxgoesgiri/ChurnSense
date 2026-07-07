import { NextResponse } from 'next/server';

// Public health probe (#4.4): returns only a coarse liveness signal. No commit
// SHA, dependency status, or connectivity details that would aid fingerprinting
// — those live behind the token-gated /api/health/internal endpoint.
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}

import { NextResponse } from 'next/server';
import { getDb, isDbConfigured } from '@/lib/db';
import { env, hasAiProvider } from '@/lib/env';
import { sql } from 'drizzle-orm';

// Internal health/diagnostics (#4.4). Exposes the deployed commit, dependency
// status, and DB connectivity — all useful to CI and operators, and all useful
// to an attacker, so it is gated behind a bearer token (HEALTH_TOKEN).
//
// When HEALTH_TOKEN is unset (e.g. local dev) the endpoint is open, matching the
// prior behaviour without leaking anything in a configured production deploy.
export async function GET(request: Request) {
  const required = env.HEALTH_TOKEN;
  if (required) {
    const auth = request.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token !== required) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let database: 'connected' | 'error' | 'not_configured' = 'not_configured';
  if (isDbConfigured()) {
    try {
      await getDb().execute(sql`SELECT 1`);
      database = 'connected';
    } catch {
      database = 'error';
    }
  }

  return NextResponse.json(
    {
      status: 'ok',
      service: 'loop-analytics',
      version: '0.1.0',
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
      database,
      aiProvider: hasAiProvider ? 'configured' : 'not_configured',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

import { NextResponse } from 'next/server';
import { getDb, isDbConfigured } from '@/lib/db';
import { hasAiProvider } from '@/lib/env';
import { sql } from 'drizzle-orm';

export async function GET() {
  // Live DB check (non-fatal): report connectivity without failing health,
  // so CI's commit-SHA gating on /api/health keeps working.
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
      service: 'churnsense',
      version: '0.1.0',
      // Vercel injects the deployed commit; lets CI gate on the exact build.
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
      database,
      aiProvider: hasAiProvider ? 'configured' : 'not_configured',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

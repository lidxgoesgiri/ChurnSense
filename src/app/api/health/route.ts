import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'churnsense',
      version: '0.1.0',
      // Vercel injects the deployed commit; lets CI gate on the exact build.
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

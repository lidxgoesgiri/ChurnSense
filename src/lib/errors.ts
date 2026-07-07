import { NextResponse } from 'next/server';

/**
 * Map an internal error to a GENERIC client response while logging the real
 * detail server-side against a correlation id (#4.5). Clients never see raw
 * database/AI-provider messages (which can leak connection strings, queries, or
 * service names); operators can match the returned `errorId` to the server log.
 *
 * Wire the console.error to a real observability sink (Sentry, Logtail, etc.)
 * in production — the shape here is deliberately drop-in for that.
 */
export function serverError(
  context: string,
  error: unknown,
  status = 500
): NextResponse {
  const errorId = randomId();
  const detail = error instanceof Error ? error.message : String(error);
  // Server-side only — never returned to the client.
  console.error(`[${context}] errorId=${errorId}: ${detail}`);
  return NextResponse.json(
    { error: 'Something went wrong. Please try again.', errorId },
    { status }
  );
}

/** Short random correlation id. Uses crypto.randomUUID when available. */
function randomId(): string {
  try {
    return crypto.randomUUID().slice(0, 8);
  } catch {
    // Fallback for runtimes without crypto.randomUUID.
    return Math.abs(Date.now() ^ (performance?.now?.() ?? 0)).toString(36).slice(0, 8);
  }
}

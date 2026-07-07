import { NextResponse } from 'next/server';
import { and, eq, asc } from 'drizzle-orm';
import { calculateSaaSMetrics, ValidationError } from '@/lib/analytics';
import { generateInsight } from '@/lib/ai-insight';
import { detectChurnTrend, type TrendResult } from '@/lib/trend';
import { projectInputSchema } from '@/lib/validation';
import { getDb, isDbConfigured } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import {
  getSession,
  unauthorizedResponse,
  csrfCheckOrigin,
  forbiddenResponse,
  parseJsonBody,
} from '@/lib/auth';
import { rateLimit, rateLimitResponse, rateLimitHeaders, clientIp } from '@/lib/rate-limit';
import { isAllowedModel, DEFAULT_MODEL } from '@/lib/models';
import { getCachedInsight, setCachedInsight } from '@/lib/insight-cache';
import { serverError } from '@/lib/errors';

// Pull THIS owner's prior churn history for the named project so the insight can
// reason about trend without mixing in other users' data (#2.2).
async function loadTrend(
  owner: string,
  projectName: string,
  currentChurn: number
): Promise<TrendResult | undefined> {
  if (!isDbConfigured()) return undefined;
  try {
    const rows = await getDb()
      .select()
      .from(projects)
      .where(and(eq(projects.ownerEmail, owner), eq(projects.projectName, projectName)))
      .orderBy(asc(projects.createdAt));
    const priorChurnRates = rows.map((r) =>
      r.totalUsers > 0 ? Number((r.churnedUsers / r.totalUsers).toFixed(4)) : 0
    );
    return detectChurnTrend(priorChurnRates, currentChurn);
  } catch {
    return undefined; // history is a bonus, never a failure mode
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  // AI calls consume paid tokens — origin-based CSRF guards against cross-origin
  // browser abuse while allowing non-browser API clients (#3.2).
  if (!csrfCheckOrigin(request)) return forbiddenResponse();

  // 40/min per session — protects against abuse while comfortably allowing
  // real usage (analyzing several projects, regenerating insights) and
  // back-to-back automated test suites that share one session.
  const rl = rateLimit(`insight:${session}:${clientIp(request)}`, 40);
  if (!rl.allowed) return rateLimitResponse(rl);
  const rlHeaders = rateLimitHeaders(rl);

  try {
    const parsedBody = await parseJsonBody(request);
    if ('error' in parsedBody) return parsedBody.error;
    const { model, ...rest } = (parsedBody.data ?? {}) as Record<string, unknown>;

    // Whitelist gateway: reject an unauthorized model rather than silently
    // swapping it — prevents model/prompt injection (Step6).
    if (model != null && model !== '' && !isAllowedModel(model)) {
      return NextResponse.json(
        { error: 'Invalid or unauthorized AI model requested' },
        { status: 400 }
      );
    }
    const validatedModel = isAllowedModel(model) ? model : DEFAULT_MODEL;
    const parsed = projectInputSchema.safeParse(rest);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing or invalid fields', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const metrics = calculateSaaSMetrics(parsed.data);
    const trend = await loadTrend(session, parsed.data.projectName, metrics.churnRate);

    // Serve a cached insight for identical input within the TTL to avoid a
    // repeat AI call (#23). The key is scoped to the owner (#3.5), so two users
    // with an identically-named project never share a cached insight, and it
    // covers every input field so changing any number yields a fresh insight.
    const cached = getCachedInsight(session, parsed.data, validatedModel);
    const insight =
      cached ??
      (await generateInsight({ project: parsed.data, metrics, trend, model: validatedModel }));
    if (!cached) {
      setCachedInsight(session, parsed.data, validatedModel, insight);
    }

    return NextResponse.json(
      {
        success: true,
        projectName: parsed.data.projectName,
        metrics,
        trend: trend ?? null,
        model: validatedModel,
        insight,
        cached: Boolean(cached),
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: rlHeaders }
    );
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return serverError('insights.POST', error);
  }
}

import { NextResponse } from 'next/server';
import { eq, asc } from 'drizzle-orm';
import { calculateSaaSMetrics, ValidationError } from '@/lib/analytics';
import { generateInsight } from '@/lib/ai-insight';
import { detectChurnTrend, type TrendResult } from '@/lib/trend';
import { projectInputSchema } from '@/lib/validation';
import { getDb, isDbConfigured } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { getSession, unauthorizedResponse, parseJsonBody } from '@/lib/auth';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { isAllowedModel, DEFAULT_MODEL } from '@/lib/models';
import { getCachedInsight, setCachedInsight } from '@/lib/insight-cache';

// Pull the project's prior churn history so the insight can reason about trend.
async function loadTrend(projectName: string, currentChurn: number): Promise<TrendResult | undefined> {
  if (!isDbConfigured()) return undefined;
  try {
    const rows = await getDb()
      .select()
      .from(projects)
      .where(eq(projects.projectName, projectName))
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

  if (!rateLimit(`insight:${session}`, 10).allowed) return rateLimitResponse();

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
    const trend = await loadTrend(parsed.data.projectName, metrics.churnRate);

    // Serve a cached insight for identical input within the TTL to avoid a
    // repeat AI call (#23). The key covers every input field, so changing any
    // number (e.g. activeUsers or monthlyRevenue) yields a fresh insight.
    const cached = getCachedInsight(parsed.data, validatedModel);
    const insight =
      cached ??
      (await generateInsight({ project: parsed.data, metrics, trend, model: validatedModel }));
    if (!cached) {
      setCachedInsight(parsed.data, validatedModel, insight);
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
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: message },
      { status: error instanceof ValidationError ? 400 : 500 }
    );
  }
}

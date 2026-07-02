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
import { validateModelId } from '@/lib/models';

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
    const validatedModel = validateModelId(model);
    const parsed = projectInputSchema.safeParse(rest);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing or invalid fields', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const metrics = calculateSaaSMetrics(parsed.data);
    const trend = await loadTrend(parsed.data.projectName, metrics.churnRate);
    const insight = await generateInsight({
      project: parsed.data,
      metrics,
      trend,
      model: validatedModel,
    });

    return NextResponse.json(
      {
        success: true,
        projectName: parsed.data.projectName,
        metrics,
        trend: trend ?? null,
        model: validatedModel,
        insight,
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

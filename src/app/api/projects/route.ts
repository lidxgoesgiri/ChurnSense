import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { getDb, isDbConfigured } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { projectInputSchema } from '@/lib/validation';
import { calculateSaaSMetrics } from '@/lib/analytics';
import type { ProjectInput } from '@/types';
import {
  getSession,
  unauthorizedResponse,
  csrfCheck,
  forbiddenResponse,
  parseJsonBody,
} from '@/lib/auth';

function dbUnavailable() {
  return NextResponse.json(
    { error: 'Database is not configured. Set DATABASE_URL to enable project persistence.' },
    { status: 503 }
  );
}

// GET /api/projects — list saved projects (most recent first) with computed metrics.
export async function GET() {
  if (!(await getSession())) return unauthorizedResponse();
  if (!isDbConfigured()) return dbUnavailable();
  try {
    const rows = await getDb().select().from(projects).orderBy(desc(projects.createdAt));
    const data = rows.map((row) => {
      const input: ProjectInput = {
        projectName: row.projectName,
        totalUsers: row.totalUsers,
        activeUsers: row.activeUsers,
        churnedUsers: row.churnedUsers,
        monthlyRevenue: Number(row.monthlyRevenue),
      };
      return { id: row.id, createdAt: row.createdAt, ...input, metrics: calculateSaaSMetrics(input) };
    });
    return NextResponse.json({ success: true, count: data.length, projects: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/projects — persist a project after validation.
export async function POST(request: Request) {
  if (!(await getSession())) return unauthorizedResponse();
  if (!csrfCheck(request)) return forbiddenResponse();
  if (!isDbConfigured()) return dbUnavailable();

  const parsedBody = await parseJsonBody(request);
  if ('error' in parsedBody) return parsedBody.error;

  const parsed = projectInputSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Missing or invalid fields', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const [row] = await getDb()
      .insert(projects)
      .values({
        projectName: parsed.data.projectName,
        totalUsers: parsed.data.totalUsers,
        activeUsers: parsed.data.activeUsers,
        churnedUsers: parsed.data.churnedUsers,
        monthlyRevenue: String(parsed.data.monthlyRevenue),
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        project: {
          id: row.id,
          createdAt: row.createdAt,
          ...parsed.data,
          metrics: calculateSaaSMetrics(parsed.data),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

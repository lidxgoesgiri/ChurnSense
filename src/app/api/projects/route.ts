import { NextResponse } from 'next/server';
import { desc, eq, sql } from 'drizzle-orm';
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

// GET /api/projects — list saved projects (most recent first) with computed
// metrics. Supports ?page= and ?limit= pagination (#15).
export async function GET(request: Request) {
  if (!(await getSession())) return unauthorizedResponse();
  if (!isDbConfigured()) return dbUnavailable();

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20', 10) || 20));
  const offset = (page - 1) * limit;

  try {
    const [{ total }] = await getDb()
      .select({ total: sql<number>`count(*)::int` })
      .from(projects);

    const rows = await getDb()
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt))
      .limit(limit)
      .offset(offset);

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

    return NextResponse.json({
      success: true,
      count: data.length,
      total,
      page,
      limit,
      hasMore: offset + data.length < total,
      projects: data,
    });
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
    // Non-blocking duplicate check: still create, but flag it (#22).
    const existing = await getDb()
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.projectName, parsed.data.projectName))
      .limit(1);

    const [row] = await getDb()
      .insert(projects)
      .values({
        projectName: parsed.data.projectName,
        totalUsers: parsed.data.totalUsers,
        activeUsers: parsed.data.activeUsers,
        churnedUsers: parsed.data.churnedUsers,
        // Store as a fixed-2 string so the numeric column round-trips cleanly (#25).
        monthlyRevenue: parsed.data.monthlyRevenue.toFixed(2),
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        ...(existing.length > 0 && {
          warning: `A project named "${parsed.data.projectName}" already exists. A new entry was created.`,
        }),
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

// DELETE /api/projects?id= — remove a saved project (#16).
export async function DELETE(request: Request) {
  if (!(await getSession())) return unauthorizedResponse();
  if (!csrfCheck(request)) return forbiddenResponse();
  if (!isDbConfigured()) return dbUnavailable();

  const id = parseInt(new URL(request.url).searchParams.get('id') ?? '', 10);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'A valid project id is required' }, { status: 400 });
  }

  try {
    const deleted = await getDb().delete(projects).where(eq(projects.id, id)).returning();
    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

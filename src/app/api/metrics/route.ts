import { NextResponse } from 'next/server';
import { calculateSaaSMetrics, ValidationError } from '@/lib/analytics';
import { projectInputSchema } from '@/lib/validation';
import { getSession, unauthorizedResponse, parseJsonBody } from '@/lib/auth';
import { serverError } from '@/lib/errors';

export async function POST(request: Request) {
  if (!(await getSession())) return unauthorizedResponse();

  try {
    const parsedBody = await parseJsonBody(request);
    if ('error' in parsedBody) return parsedBody.error;
    const parsed = projectInputSchema.safeParse(parsedBody.data);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing or invalid fields', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const report = calculateSaaSMetrics(parsed.data);

    return NextResponse.json(
      {
        success: true,
        projectName: parsed.data.projectName,
        metrics: report,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    // ValidationError carries a safe, user-facing message (400); anything else
    // is masked behind a generic response with a logged correlation id (#4.5).
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return serverError('metrics.POST', error);
  }
}

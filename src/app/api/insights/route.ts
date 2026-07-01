import { NextResponse } from 'next/server';
import { calculateSaaSMetrics } from '@/lib/analytics';
import { generateInsight } from '@/lib/ai-insight';
import { projectInputSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = projectInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing or invalid fields', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const metrics = calculateSaaSMetrics(parsed.data);
    const insight = await generateInsight({ project: parsed.data, metrics });

    return NextResponse.json(
      {
        success: true,
        projectName: parsed.data.projectName,
        metrics,
        insight,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const isValidationError = message.includes('greater than zero');
    return NextResponse.json(
      { error: message },
      { status: isValidationError ? 400 : 500 }
    );
  }
}

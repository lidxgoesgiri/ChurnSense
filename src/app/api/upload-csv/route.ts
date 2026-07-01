import { NextResponse } from 'next/server';
import { parseCSV, CsvFormatError } from '@/lib/csv-parser';
import { projectInputSchema } from '@/lib/validation';
import { calculateSaaSMetrics } from '@/lib/analytics';
import { computeAggregate, type BatchRow } from '@/lib/batch-analytics';
import type { BatchError, BatchRowResult } from '@/types';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// POST /api/upload-csv — accept a multipart CSV, validate & analyze each row,
// and return per-row metrics plus a batch aggregate.
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Expected multipart/form-data with a "file" field' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 5MB.' },
      { status: 413 }
    );
  }
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return NextResponse.json({ error: 'Only CSV files are supported' }, { status: 400 });
  }

  const text = await file.text();
  if (!text.trim()) {
    return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
  }

  let rawRows: Record<string, unknown>[];
  try {
    rawRows = parseCSV(text);
  } catch (err) {
    if (err instanceof CsvFormatError) {
      return NextResponse.json(
        { error: 'Invalid CSV format', details: err.message },
        { status: 400 }
      );
    }
    throw err;
  }

  if (rawRows.length === 0) {
    return NextResponse.json({ error: 'CSV file has no data rows' }, { status: 400 });
  }

  const rows: BatchRow[] = [];
  const results: BatchRowResult[] = [];
  const errors: BatchError[] = [];

  rawRows.forEach((raw, i) => {
    const parsed = projectInputSchema.safeParse(raw);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      errors.push({
        row: i + 1,
        error: issue ? `${issue.path.join('.') || 'row'}: ${issue.message}` : 'Invalid row',
      });
      return;
    }
    const metrics = calculateSaaSMetrics(parsed.data);
    rows.push({ input: parsed.data, metrics });
    results.push({ projectName: parsed.data.projectName, metrics });
  });

  // If nothing validated, the upload is unusable — reject it as a 400.
  if (results.length === 0) {
    return NextResponse.json(
      {
        error: 'Invalid CSV format',
        details: errors[0]?.error ?? 'No valid rows found',
        totalRows: rawRows.length,
        failedRows: errors.length,
        errors,
      },
      { status: 400 }
    );
  }

  const aggregate = computeAggregate(rows);

  return NextResponse.json(
    {
      success: true,
      totalRows: rawRows.length,
      validRows: results.length,
      failedRows: errors.length,
      errors,
      results,
      aggregate,
    },
    { status: 200 }
  );
}

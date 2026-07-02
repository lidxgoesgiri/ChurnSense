import type { SavedProject } from '@/components/projects-history';

/** Escape a CSV cell: wrap in quotes and double any inner quotes. */
function cell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HEADERS = [
  'Project Name',
  'Created At',
  'Churn Rate %',
  'Retention Rate %',
  'ARPU',
  'MRR',
  'Est. LTV',
  'Risk Status',
];

/** Build the CSV text for a set of saved projects (also unit-testable). */
export function toCsv(rows: SavedProject[]): string {
  const lines = rows.map((r) =>
    [
      cell(r.projectName),
      cell(new Date(r.createdAt).toISOString()),
      (r.metrics.churnRate * 100).toFixed(2),
      (r.metrics.retentionRate * 100).toFixed(2),
      r.metrics.arpu.toFixed(2),
      r.metrics.mrr.toFixed(2),
      r.metrics.estimatedLtv.toFixed(2),
      cell(r.metrics.riskStatus),
    ].join(',')
  );
  return [HEADERS.join(','), ...lines].join('\n');
}

/** Trigger a client-side download of the saved projects as a CSV report. */
export function exportProjectsCsv(rows: SavedProject[], filename = 'churnsense-report.csv') {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

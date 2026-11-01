'use client';

import { useState } from 'react';
import type { SavedProject } from './projects-history';
import { calculateComparisonDelta, type DeltaDirection } from '@/lib/format';

const METRICS_CONFIG = [
  {
    key: 'churnRate' as const,
    label: 'Churn Rate',
    type: 'rate' as const,
    lowerIsBetter: true,
    format: (v: number) => `${(v * 100).toFixed(1)}%`,
  },
  {
    key: 'retentionRate' as const,
    label: 'Retention Rate',
    type: 'rate' as const,
    lowerIsBetter: false,
    format: (v: number) => `${(v * 100).toFixed(1)}%`,
  },
  {
    key: 'arpu' as const,
    label: 'ARPU',
    type: 'currency' as const,
    lowerIsBetter: false,
    format: (v: number) => `$${v.toFixed(2)}`,
  },
  {
    key: 'mrr' as const,
    label: 'MRR',
    type: 'currency' as const,
    lowerIsBetter: false,
    format: (v: number) => `$${v.toFixed(2)}`,
  },
  {
    key: 'estimatedLtv' as const,
    label: 'Est. LTV',
    type: 'currency' as const,
    lowerIsBetter: false,
    format: (v: number) => `$${v.toFixed(2)}`,
  },
];

const DIRECTION_COLORS: Record<DeltaDirection, string> = {
  improved: 'text-[var(--cs-success)]',
  worse: 'text-[var(--cs-danger)]',
  neutral: 'text-[var(--cs-muted)]',
};

export function ComparisonView({ projects }: { projects: SavedProject[] }) {
  const [aId, setAId] = useState<number | null>(null);
  const [bId, setBId] = useState<number | null>(null);

  if (projects.length < 2) return null;

  const a = projects.find((p) => p.id === aId) ?? projects[0];
  const b = projects.find((p) => p.id === bId) ?? projects[1];

  return (
    <div className="workbench-panel space-y-4 p-5 sm:p-6" aria-label="Project comparison section">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--cs-border)] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--cs-text)]">
            Compare Saved Snapshots
          </h3>
          <p className="text-xs text-[var(--cs-muted)]">
            Evaluation convention: <strong>B − A</strong> (Project A is baseline, Project B is comparison target).
          </p>
        </div>
      </div>

      {/* Snapshot Selectors */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="compare-a" className="block text-xs font-semibold text-[var(--cs-text)] mb-1">
            Baseline (Snapshot A)
          </label>
          <select
            id="compare-a"
            value={a.id}
            onChange={(e) => setAId(Number(e.target.value))}
            className="input-control text-xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} · {new Date(p.createdAt).toLocaleDateString()} (#{p.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="compare-b" className="block text-xs font-semibold text-[var(--cs-text)] mb-1">
            Comparison Target (Snapshot B)
          </label>
          <select
            id="compare-b"
            value={b.id}
            onChange={(e) => setBId(Number(e.target.value))}
            className="input-control text-xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} · {new Date(p.createdAt).toLocaleDateString()} (#{p.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {a.id === b.id && (
        <div className="rounded-md border border-[var(--cs-border)] bg-[var(--cs-bg)] p-2.5 text-xs text-[var(--cs-muted)]">
          You are comparing a snapshot with itself. Select two different snapshots to see meaningful deltas.
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--cs-border)]">
        <table className="w-full text-left text-xs" aria-label="Comparison metrics table">
          <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-bg)] text-[var(--cs-muted)]">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Metric</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Baseline (A)
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Target (B)
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Delta (B − A)
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Assessment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cs-border)]">
            {METRICS_CONFIG.map((m) => {
              const va = a.metrics[m.key];
              const vb = b.metrics[m.key];
              const delta = calculateComparisonDelta(va, vb, m.type, m.lowerIsBetter);

              return (
                <tr key={m.key} className="hover:bg-[var(--cs-bg)]/40">
                  <td className="px-4 py-3 font-medium text-[var(--cs-text)]">
                    {m.label}
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-[var(--cs-text)]">
                    {va === null ? 'Not defined' : m.format(va)}
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-[var(--cs-text)]">
                    {vb === null ? 'Not defined' : m.format(vb)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-tabular font-bold ${
                      DIRECTION_COLORS[delta.direction]
                    }`}
                  >
                    {delta.display}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        DIRECTION_COLORS[delta.direction]
                      }`}
                    >
                      {delta.directionText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

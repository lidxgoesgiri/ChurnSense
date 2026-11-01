'use client';

import { useState } from 'react';
import type { SavedProject } from './projects-history';
import { calculateComparisonDelta, type DeltaDirection } from '@/lib/format';
import { ArrowDownRightIcon, ArrowUpRightIcon } from './ui/icons';
import { SpotlightCard } from './web3/spotlight-card';

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
  improved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  worse: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
  neutral: 'text-[var(--cs-muted)] bg-[var(--cs-bg)] border-[var(--cs-border)]',
};

export function ComparisonView({ projects }: { projects: SavedProject[] }) {
  const [aId, setAId] = useState<number | null>(null);
  const [bId, setBId] = useState<number | null>(null);

  if (projects.length < 2) return null;

  const a = projects.find((p) => p.id === aId) ?? projects[0];
  const b = projects.find((p) => p.id === bId) ?? projects[1];

  return (
    <SpotlightCard
      glowColor="rgba(99, 102, 241, 0.2)"
      className="p-6 sm:p-7 space-y-5"
      role="region"
      aria-label="Project comparison section"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cs-border)] pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-indigo-400">
              Snapshot Dual Audit (Delta: B − A)
            </span>
          </div>
          <h3 className="text-base font-extrabold text-[var(--cs-text)]">
            Compare Saved Snapshots
          </h3>
          <p className="font-mono text-xs text-[var(--cs-muted)]">
            Evaluation delta: <strong>B − A</strong> (Snapshot A = Baseline, Snapshot B = Comparison Target).
          </p>
        </div>
      </div>

      {/* Snapshot Selectors */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="compare-a" className="block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cs-text)]">
            Baseline (Snapshot A)
          </label>
          <select
            id="compare-a"
            value={a.id}
            onChange={(e) => setAId(Number(e.target.value))}
            className="input-glow font-mono text-xs rounded-xl"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} · {new Date(p.createdAt).toLocaleDateString()} (#SNP-{String(p.id).padStart(4, '0')})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="compare-b" className="block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cs-text)]">
            Comparison Target (Snapshot B)
          </label>
          <select
            id="compare-b"
            value={b.id}
            onChange={(e) => setBId(Number(e.target.value))}
            className="input-glow font-mono text-xs rounded-xl"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} · {new Date(p.createdAt).toLocaleDateString()} (#SNP-{String(p.id).padStart(4, '0')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delta Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)]/80">
        <table className="w-full text-left text-xs font-mono" aria-label="Comparison metrics table">
          <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-elevated)] text-[var(--cs-muted)] text-[11px] uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">METRIC</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">
                BASELINE (A)
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">
                TARGET (B)
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">
                SIGNED DELTA (B − A)
              </th>
              <th scope="col" className="px-4 py-3 text-center font-semibold">
                HEALTH VECTOR
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cs-border)]">
            {METRICS_CONFIG.map((cfg) => {
              const valA = a.metrics[cfg.key];
              const valB = b.metrics[cfg.key];
              const delta = calculateComparisonDelta(valA, valB, cfg.type, cfg.lowerIsBetter);

              return (
                <tr key={cfg.key} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-bold text-[var(--cs-text)]">
                    {cfg.label}
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-[var(--cs-muted)]">
                    {valA === null ? '—' : cfg.format(valA)}
                  </td>
                  <td className="px-4 py-3 text-right font-tabular font-bold text-[var(--cs-text)]">
                    {valB === null ? '—' : cfg.format(valB)}
                  </td>
                  <td className="px-4 py-3 text-right font-tabular font-bold">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-xs border ${
                        DIRECTION_COLORS[delta.direction]
                      }`}
                    >
                      {delta.display}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {delta.direction === 'improved' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <ArrowUpRightIcon size={13} />
                        <span>IMPROVED</span>
                      </span>
                    ) : delta.direction === 'worse' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                        <ArrowDownRightIcon size={13} />
                        <span>REGRESSED</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[var(--cs-muted)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SpotlightCard>
  );
}

'use client';

import { useState } from 'react';
import type { SavedProject } from './projects-history';

const METRICS = [
  { label: 'Churn Rate', key: 'churnRate' as const, fmt: (v: number) => `${(v * 100).toFixed(1)}%`, lowerIsBetter: true },
  { label: 'Retention', key: 'retentionRate' as const, fmt: (v: number) => `${(v * 100).toFixed(1)}%`, lowerIsBetter: false },
  { label: 'ARPU', key: 'arpu' as const, fmt: (v: number) => `$${v.toFixed(2)}`, lowerIsBetter: false },
  { label: 'MRR', key: 'mrr' as const, fmt: (v: number) => `$${v.toFixed(2)}`, lowerIsBetter: false },
  { label: 'Est. LTV', key: 'estimatedLtv' as const, fmt: (v: number) => `$${v.toFixed(2)}`, lowerIsBetter: false },
];

const fmtVal = (v: number | null, fmt: (n: number) => string): string =>
  v === null ? '∞' : fmt(v);

export function ComparisonView({ projects }: { projects: SavedProject[] }) {
  const [aId, setAId] = useState<number | null>(null);
  const [bId, setBId] = useState<number | null>(null);

  if (projects.length < 2) return null;

  const a = projects.find((p) => p.id === aId) ?? projects[0];
  const b = projects.find((p) => p.id === bId) ?? projects[1];

  return (
    <div className="glass-card anim-fade-up delay-3 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Compare projects
      </h3>

      <div className="mb-4 grid grid-cols-2 gap-3">
        {[
          { val: a.id, set: setAId, label: 'Project A' },
          { val: b.id, set: setBId, label: 'Project B' },
        ].map((sel) => (
          <label key={sel.label} className="block text-xs">
            <span className="mb-1 block text-gray-400">{sel.label}</span>
            <select
              value={sel.val}
              onChange={(e) => sel.set(Number(e.target.value))}
              aria-label={sel.label}
              className="w-full rounded-lg border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-accent dark:border-white/20"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-background">
                  {p.projectName} · {new Date(p.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {/* Colour legend for the comparison bars (#3.4). */}
      <div className="mb-3 flex items-center gap-4 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-full bg-accent" aria-hidden="true" />
          {a.projectName}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-full bg-gray-400/70 dark:bg-gray-500/70" aria-hidden="true" />
          {b.projectName}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-gray-500 dark:border-white/10">
              <th className="py-2 pr-4 font-medium">Metric</th>
              <th className="py-2 pr-4 text-right font-medium">{a.projectName}</th>
              <th className="py-2 pr-4 text-right font-medium">{b.projectName}</th>
              <th className="py-2 pr-4 text-right font-medium">Δ</th>
              <th className="w-28 py-2 font-medium">Visual</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map((m) => {
              const va = a.metrics[m.key];
              const vb = b.metrics[m.key];
              // A delta is only meaningful when both sides are numeric; an
              // undefined (∞) LTV on either side shows a dash instead (#5.2).
              const comparable = typeof va === 'number' && typeof vb === 'number';
              const diff = comparable ? va - vb : 0;
              // Colour the delta by whether A is better than B for this metric.
              const better = m.lowerIsBetter ? diff < 0 : diff > 0;
              const worse = m.lowerIsBetter ? diff > 0 : diff < 0;
              const color = diff === 0 ? 'text-gray-400' : better ? 'text-green-500' : worse ? 'text-red-500' : '';
              // Bar widths are relative to the larger of the two values so the
              // longer bar always fills the cell; a null (∞) side renders empty.
              const maxAbs = Math.max(Math.abs(va ?? 0), Math.abs(vb ?? 0)) || 1;
              const wa = va === null ? 0 : Math.round((Math.abs(va) / maxAbs) * 100);
              const wb = vb === null ? 0 : Math.round((Math.abs(vb) / maxAbs) * 100);
              return (
                <tr key={m.key} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2 pr-4 text-gray-500">{m.label}</td>
                  <td className="py-2 pr-4 text-right font-mono">{fmtVal(va, m.fmt)}</td>
                  <td className="py-2 pr-4 text-right font-mono">{fmtVal(vb, m.fmt)}</td>
                  <td className={`py-2 pr-4 text-right font-mono ${comparable ? color : 'text-gray-400'}`}>
                    {comparable ? `${diff > 0 ? '+' : ''}${m.fmt(Math.abs(diff))}` : '—'}
                  </td>
                  <td className="py-2">
                    <div
                      className="space-y-1"
                      aria-hidden="true"
                      title={`${a.projectName}: ${fmtVal(va, m.fmt)} · ${b.projectName}: ${fmtVal(vb, m.fmt)}`}
                    >
                      <div className="h-1.5 rounded-full bg-accent transition-all" style={{ width: `${wa}%` }} />
                      <div
                        className="h-1.5 rounded-full bg-gray-400/70 transition-all dark:bg-gray-500/70"
                        style={{ width: `${wb}%` }}
                      />
                    </div>
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

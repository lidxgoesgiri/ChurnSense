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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-gray-500 dark:border-white/10">
              <th className="py-2 pr-4 font-medium">Metric</th>
              <th className="py-2 pr-4 text-right font-medium">{a.projectName}</th>
              <th className="py-2 pr-4 text-right font-medium">{b.projectName}</th>
              <th className="py-2 text-right font-medium">Δ</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map((m) => {
              const va = a.metrics[m.key];
              const vb = b.metrics[m.key];
              const diff = va - vb;
              // Colour the delta by whether A is better than B for this metric.
              const better = m.lowerIsBetter ? diff < 0 : diff > 0;
              const worse = m.lowerIsBetter ? diff > 0 : diff < 0;
              const color = diff === 0 ? 'text-gray-400' : better ? 'text-green-500' : worse ? 'text-red-500' : '';
              return (
                <tr key={m.key} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2 pr-4 text-gray-500">{m.label}</td>
                  <td className="py-2 pr-4 text-right font-mono">{m.fmt(va)}</td>
                  <td className="py-2 pr-4 text-right font-mono">{m.fmt(vb)}</td>
                  <td className={`py-2 text-right font-mono ${color}`}>
                    {diff > 0 ? '+' : ''}
                    {m.fmt(Math.abs(diff))}
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

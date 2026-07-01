'use client';

import type { SavedProject } from './projects-history';

interface Props {
  projects: SavedProject[];
  loading: boolean;
}

export function RetentionTable({ projects, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 p-6 dark:border-white/15">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-gray-300/40" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-gray-300/30" />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 p-6 text-sm text-gray-400 dark:border-white/15">
        No saved projects yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Project retention data">
          <thead>
            <tr className="border-b border-black/5 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Project</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Churn</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Retention</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">ARPU</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Risk</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            {projects.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                <td className="truncate px-4 py-3 font-medium">{p.projectName}</td>
                <td className="px-4 py-3 text-right">{(p.metrics.churnRate * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right">{(p.metrics.retentionRate * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right">${p.metrics.arpu.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.metrics.riskStatus === 'High'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : p.metrics.riskStatus === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-green-500/10 text-green-600 dark:text-green-400'
                    }`}
                  >
                    {p.metrics.riskStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

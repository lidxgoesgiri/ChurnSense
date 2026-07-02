'use client';

import type { AnalyticsResult } from '@/types';

export interface SavedProject {
  id: number;
  projectName: string;
  createdAt: string;
  metrics: AnalyticsResult;
}

const RISK_DOT: Record<AnalyticsResult['riskStatus'], string> = {
  Low: 'bg-green-500',
  Medium: 'bg-amber-500',
  High: 'bg-red-500',
};

export function ProjectsHistory({
  projects,
  loading,
  onDelete,
}: {
  projects: SavedProject[];
  loading: boolean;
  onDelete?: (id: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-6 dark:border-white/15">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Saved projects
      </h3>

      {loading && <p className="text-sm text-gray-400">Loading…</p>}

      {!loading && projects.length === 0 && (
        <p className="text-sm text-gray-400">
          No saved projects yet. Calculate metrics and click “Save to history”.
        </p>
      )}

      {!loading && projects.length > 0 && (
        <ul className="divide-y divide-black/5 dark:divide-white/10">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{p.projectName}</div>
                <div className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span>{(p.metrics.churnRate * 100).toFixed(1)}% churn</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${RISK_DOT[p.metrics.riskStatus]}`} />
                  {p.metrics.riskStatus}
                </span>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    aria-label={`Delete ${p.projectName}`}
                    className="rounded-md px-1.5 text-gray-400 transition-colors hover:text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

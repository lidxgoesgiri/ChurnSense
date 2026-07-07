'use client';

import { useState } from 'react';
import type { AnalyticsResult } from '@/types';
import { timeAgo } from '@/lib/format';
import { HistoryRowSkeleton } from './skeleton';

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
  const [removingId, setRemovingId] = useState<number | null>(null);
  // Two-step delete confirmation (#6.4): the first click arms the row and shows
  // Confirm/Cancel; only an explicit confirm removes the project.
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // Play a fade-out on the row before asking the parent to delete it.
  function performDelete(id: number) {
    if (!onDelete) return;
    setConfirmId(null);
    setRemovingId(id);
    setTimeout(() => {
      onDelete(id);
      setRemovingId(null);
    }, 280);
  }

  return (
    <div className="glass-card anim-fade-up delay-5 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Saved projects
      </h3>

      {loading && (
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {[1, 2, 3].map((i) => (
            <HistoryRowSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <p className="text-sm text-gray-400">
          No saved projects yet. Calculate metrics and click “Save to history”.
        </p>
      )}

      {!loading && projects.length > 0 && (
        <ul className="divide-y divide-black/5 dark:divide-white/10">
          {projects.map((p) => (
            <li
              key={p.id}
              className={`flex items-center justify-between py-3 ${removingId === p.id ? 'anim-remove' : ''}`}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{p.projectName}</div>
                <div className="text-xs text-gray-400">{timeAgo(p.createdAt)}</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span>{(p.metrics.churnRate * 100).toFixed(1)}% churn</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${RISK_DOT[p.metrics.riskStatus]}`} />
                  {p.metrics.riskStatus}
                </span>
                {onDelete && confirmId !== p.id && (
                  <button
                    type="button"
                    onClick={() => setConfirmId(p.id)}
                    disabled={removingId === p.id}
                    aria-label={`Delete ${p.projectName}`}
                    className="rounded-md px-1.5 text-gray-400 transition-colors hover:text-red-500 disabled:opacity-50"
                  >
                    ✕
                  </button>
                )}
                {onDelete && confirmId === p.id && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Delete?</span>
                    <button
                      type="button"
                      onClick={() => performDelete(p.id)}
                      aria-label={`Confirm delete ${p.projectName}`}
                      className="rounded-md px-1.5 text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      aria-label="Cancel delete"
                      className="rounded-md px-1.5 text-xs text-gray-400 hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

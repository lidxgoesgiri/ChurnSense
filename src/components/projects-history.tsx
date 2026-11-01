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

export function ProjectsHistory({
  projects,
  loading,
  onDelete,
}: {
  projects: SavedProject[];
  loading: boolean;
  onDelete?: (id: number) => void;
}) {
  const [confirmId, setConfirmId] = useState<number | null>(null);

  if (loading && projects.length === 0) {
    return (
      <div className="workbench-panel p-5 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
          Saved Snapshots
        </h3>
        <div className="divide-y divide-[var(--cs-border)]">
          {[1, 2, 3].map((i) => (
            <HistoryRowSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="workbench-panel p-6 text-center text-xs text-[var(--cs-muted)]">
        No snapshots saved yet. Calculations with available storage will appear here automatically.
      </div>
    );
  }

  return (
    <div className="workbench-panel space-y-3 p-5 sm:p-6" aria-label="Recent snapshots history">
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
          Snapshot Activity Stream ({projects.length})
        </h3>
      </div>

      <ul className="divide-y divide-[var(--cs-border)]">
        {projects.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
            <div className="min-w-0">
              <div className="truncate font-medium text-[var(--cs-text)]">
                {p.projectName}
              </div>
              <div className="text-[11px] text-[var(--cs-muted)] font-tabular">
                {timeAgo(p.createdAt)} · {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-tabular text-[var(--cs-danger)] font-medium">
                {(p.metrics.churnRate * 100).toFixed(1)}% churn
              </span>
              <span className="font-tabular text-[var(--cs-primary)] font-medium">
                {(p.metrics.retentionRate * 100).toFixed(1)}% retention
              </span>

              {onDelete && confirmId !== p.id && (
                <button
                  type="button"
                  onClick={() => setConfirmId(p.id)}
                  aria-label={`Delete ${p.projectName}`}
                  className="rounded px-2 py-0.5 text-[11px] text-[var(--cs-muted)] hover:text-[var(--cs-danger)]"
                >
                  Delete
                </button>
              )}

              {onDelete && confirmId === p.id && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-[11px] text-[var(--cs-muted)]">Confirm?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmId(null);
                      onDelete(p.id);
                    }}
                    aria-label={`Confirm delete ${p.projectName}`}
                    className="rounded px-2 py-0.5 text-[11px] font-semibold text-[var(--cs-danger)]"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    aria-label="Cancel delete"
                    className="rounded px-2 py-0.5 text-[11px] text-[var(--cs-muted)]"
                  >
                    Cancel
                  </button>
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

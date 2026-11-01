'use client';

import { useState } from 'react';
import type { SavedProject } from './projects-history';
import { Skeleton } from './skeleton';

interface Props {
  projects: SavedProject[];
  loading: boolean;
  totalHistory?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  onDelete?: (id: number) => Promise<void> | void;
  deletingId?: number | null;
  deleteError?: string | null;
}

export function RetentionTable({
  projects,
  loading,
  totalHistory = projects.length,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  onDelete,
  deletingId = null,
  deleteError,
}: Props) {
  const [confirmId, setConfirmId] = useState<number | null>(null);

  if (loading && projects.length === 0) {
    return (
      <div className="workbench-panel p-6 space-y-3" aria-busy="true">
        <Skeleton width={180} height={18} />
        <div className="divide-y divide-[var(--cs-border)] pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-3 flex justify-between">
              <Skeleton width="30%" height={16} />
              <Skeleton width="15%" height={16} />
              <Skeleton width="15%" height={16} />
              <Skeleton width="10%" height={16} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="workbench-panel p-8 text-center space-y-2">
        <p className="text-sm font-medium text-[var(--cs-text)]">No saved snapshots yet</p>
        <p className="text-xs text-[var(--cs-muted)] max-w-sm mx-auto">
          Calculate metrics above. When the database is available, each calculation is saved as an
          immutable snapshot in this ledger.
        </p>
      </div>
    );
  }

  async function handleConfirmDelete(id: number) {
    setConfirmId(null);
    if (onDelete) {
      await onDelete(id);
    }
  }

  return (
    <div className="workbench-panel space-y-3 p-5 sm:p-6" aria-label="Saved snapshots ledger">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--cs-border)] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--cs-text)]">
            Saved Snapshots Ledger
          </h3>
          <p className="text-xs text-[var(--cs-muted)]">
            Showing <strong className="text-[var(--cs-text)]">{projects.length}</strong> of{' '}
            <strong className="text-[var(--cs-text)]">{totalHistory}</strong> loaded snapshots
          </p>
        </div>
      </div>

      {deleteError && (
        <div className="rounded-lg border border-[var(--cs-danger)]/25 bg-red-500/10 p-3 text-xs text-[var(--cs-danger)]" role="alert">
          {deleteError}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[var(--cs-border)]">
        <table className="w-full text-left text-xs" aria-label="Saved project snapshots">
          <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-bg)] text-[var(--cs-muted)]">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Project</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Churn Rate</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Retention</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">ARPU</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">MRR</th>
              <th scope="col" className="px-4 py-3 text-center font-medium">Risk</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Recorded Date</th>
              {onDelete && <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cs-border)]">
            {projects.map((p) => {
              const isDeleting = deletingId === p.id;
              const isConfirming = confirmId === p.id;

              return (
                <tr key={p.id} className="hover:bg-[var(--cs-bg)]/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--cs-text)] max-w-[140px] truncate">
                    {p.projectName}
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-[var(--cs-danger)] font-medium">
                    {(p.metrics.churnRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-[var(--cs-primary)] font-medium">
                    {(p.metrics.retentionRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-[var(--cs-text)]">
                    ${p.metrics.arpu.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-[var(--cs-text)]">
                    ${p.metrics.mrr.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                        p.metrics.riskStatus === 'High'
                          ? 'bg-red-500/10 text-[var(--cs-danger)]'
                          : p.metrics.riskStatus === 'Medium'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-500/10 text-[var(--cs-success)]'
                      }`}
                    >
                      {p.metrics.riskStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--cs-muted)] font-tabular whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  {onDelete && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isDeleting ? (
                        <span className="text-[11px] text-[var(--cs-muted)]">Deleting…</span>
                      ) : isConfirming ? (
                        <span className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(p.id)}
                            aria-label={`Confirm delete snapshot ${p.projectName}`}
                            className="rounded px-2 py-0.5 text-[11px] font-semibold text-[var(--cs-danger)] hover:bg-red-500/10"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            aria-label="Cancel delete"
                            className="rounded px-2 py-0.5 text-[11px] text-[var(--cs-muted)] hover:text-[var(--cs-text)]"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmId(p.id)}
                          aria-label={`Delete snapshot for ${p.projectName}`}
                          className="rounded px-2 py-0.5 text-[11px] text-[var(--cs-muted)] hover:text-[var(--cs-danger)] transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination / Load More Footer */}
      {hasMore && onLoadMore && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="btn-secondary min-h-[38px] px-5 py-1.5 text-xs font-medium"
          >
            {loadingMore ? 'Loading more snapshots…' : `Load more snapshots (${projects.length} of ${totalHistory})`}
          </button>
        </div>
      )}
    </div>
  );
}

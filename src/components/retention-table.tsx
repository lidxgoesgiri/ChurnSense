'use client';

import { useState } from 'react';
import type { SavedProject } from './projects-history';
import { Skeleton } from './skeleton';
import { Trash2Icon } from './ui/icons';
import { SpotlightCard } from './web3/spotlight-card';

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
      <SpotlightCard className="p-6 space-y-4" aria-busy="true">
        <Skeleton width={180} height={18} />
        <div className="divide-y divide-[var(--cs-border)] pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-3.5 flex justify-between">
              <Skeleton width="30%" height={16} />
              <Skeleton width="15%" height={16} />
              <Skeleton width="15%" height={16} />
              <Skeleton width="10%" height={16} />
            </div>
          ))}
        </div>
      </SpotlightCard>
    );
  }

  if (projects.length === 0) {
    return (
      <SpotlightCard className="p-10 text-center space-y-3 font-mono">
        <p className="text-sm font-bold text-[var(--cs-text)]">LEDGER CURRENTLY EMPTY</p>
        <p className="text-xs text-[var(--cs-muted)] max-w-md mx-auto">
          Execute calculations above. Once computed, point-in-time snapshots will be recorded
          as immutable records in this ledger.
        </p>
      </SpotlightCard>
    );
  }

  async function handleConfirmDelete(id: number) {
    setConfirmId(null);
    if (onDelete) {
      await onDelete(id);
    }
  }

  return (
    <SpotlightCard
      glowColor="rgba(16, 185, 129, 0.16)"
      className="p-6 sm:p-7 space-y-4"
      aria-label="Saved snapshots ledger"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cs-border)] pb-3.5">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-400">
            {'// IMMUTABLE PROTOCOL LEDGER'}
          </span>
          <h3 className="text-base font-extrabold text-[var(--cs-text)]">
            Saved Snapshots Ledger
          </h3>
          <p className="font-mono text-xs text-[var(--cs-muted)]">
            Displaying <strong className="text-emerald-400">{projects.length}</strong> of{' '}
            <strong className="text-[var(--cs-text)]">{totalHistory}</strong> loaded snapshot blocks
          </p>
        </div>
      </div>

      {deleteError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-400" role="alert">
          {deleteError}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)]/80">
        <table className="w-full text-left text-xs font-mono" aria-label="Saved project snapshots">
          <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-elevated)] text-[var(--cs-muted)] text-[11px] uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">BLOCK ID</th>
              <th scope="col" className="px-4 py-3 font-semibold">PROJECT IDENTIFIER</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">CHURN RATE</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">RETENTION</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">ARPU</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">MRR</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold">AUDIT TIER</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">TIMESTAMP</th>
              {onDelete && <th scope="col" className="px-4 py-3 text-right font-semibold">ACTION</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cs-border)]">
            {projects.map((p) => {
              const isDeleting = deletingId === p.id;
              const isConfirming = confirmId === p.id;

              return (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-emerald-400 font-bold whitespace-nowrap">
                    #SNP-{String(p.id).padStart(4, '0')}
                  </td>
                  <td className="px-4 py-3 font-bold text-[var(--cs-text)] max-w-[150px] truncate">
                    {p.projectName}
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-rose-500 font-bold">
                    {(p.metrics.churnRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-tabular text-emerald-400 font-bold">
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
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                        p.metrics.riskStatus === 'High'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                          : p.metrics.riskStatus === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                      }`}
                    >
                      {p.metrics.riskStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--cs-muted)] text-[11px] whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  {onDelete && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isDeleting ? (
                        <span className="text-[11px] text-[var(--cs-muted)]">PURGING…</span>
                      ) : isConfirming ? (
                        <span className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(p.id)}
                            aria-label={`Confirm delete snapshot ${p.projectName}`}
                            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/35"
                          >
                            CONFIRM
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            aria-label="Cancel delete"
                            className="rounded-lg px-2 py-1 text-[11px] text-[var(--cs-muted)] hover:text-[var(--cs-text)]"
                          >
                            CANCEL
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmId(p.id)}
                          aria-label={`Delete snapshot for ${p.projectName}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] text-[var(--cs-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2Icon size={13} />
                          <span>Purge</span>
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
            className="btn-secondary min-h-[40px] px-6 py-2 font-mono text-xs font-semibold uppercase tracking-wider rounded-xl"
          >
            {loadingMore ? 'SYNCING LEDGER…' : `LOAD NEXT SNAPSHOT BLOCK (${projects.length} OF ${totalHistory})`}
          </button>
        </div>
      )}
    </SpotlightCard>
  );
}

'use client';

import { useState } from 'react';
import type { ProjectInput } from '@/types';
import { SpotlightCard } from './web3/spotlight-card';
import { ArrowUpRightIcon } from './ui/icons';

interface Props {
  onAnalyze: (input: ProjectInput) => Promise<void> | void;
  loading: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'failed' | 'unavailable';
  saveError?: string | null;
}

export function ProjectForm({ onAnalyze, loading, saveStatus = 'idle', saveError }: Props) {
  const [projectName, setProjectName] = useState('');
  const [totalUsers, setTotalUsers] = useState('');
  const [activeUsers, setActiveUsers] = useState('');
  const [churnedUsers, setChurnedUsers] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  function validate(): string | null {
    const t = Number(totalUsers);
    const a = Number(activeUsers);
    const c = Number(churnedUsers);
    const r = Number(monthlyRevenue);

    if (!projectName.trim()) return 'Project name is required';
    if (!Number.isInteger(t) || t <= 0) return 'Total users must be a positive integer';
    if (!Number.isInteger(a) || a < 0) return 'Active users must be a non-negative integer';
    if (!Number.isInteger(c) || c < 0) return 'Churned users must be a non-negative integer';
    if (isNaN(r) || r < 0) return 'Monthly revenue must be non-negative';
    if (a + c > t) return 'Active users plus churned users cannot exceed total users';
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setClientError(null);

    const err = validate();
    if (err) {
      setClientError(err);
      return;
    }

    await onAnalyze({
      projectName: projectName.trim(),
      totalUsers: Number(totalUsers),
      activeUsers: Number(activeUsers),
      churnedUsers: Number(churnedUsers),
      monthlyRevenue: Number(monthlyRevenue),
    });
  }

  return (
    <SpotlightCard
      glowColor="rgba(16, 185, 129, 0.2)"
      className="p-6 sm:p-7"
    >
      <form onSubmit={submit} className="space-y-5" aria-label="Manual metric calculation form">
        <div className="flex items-center justify-between border-b border-[var(--cs-border)] pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Telemetry Ingestion
              </span>
            </div>
            <h2 className="text-base font-extrabold text-[var(--cs-text)]">Project Parameters</h2>
            <p className="text-xs text-[var(--cs-muted)]">
              Calculate deterministic retention, churn fraction, and LTV projections.
            </p>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
            STAGE 01
          </span>
        </div>

        {clientError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]" role="alert">
            {clientError}
          </div>
        )}

        {/* Project Name */}
        <div className="space-y-1.5">
          <label htmlFor="projectName" className="block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cs-text)]">
            Project Identifier
          </label>
          <input
            id="projectName"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
              setClientError(null);
            }}
            required
            placeholder="e.g. Acme SaaS Protocol"
            className="input-glow font-mono text-xs rounded-xl"
          />
        </div>

        {/* User Counts Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cs-text)]">User Counts</span>
            <span className="font-mono text-[10px] text-[var(--cs-muted)]">Active + Churned ≤ Total</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label htmlFor="totalUsers" className="block font-mono text-[10px] uppercase text-[var(--cs-muted)]">
                Total Users
              </label>
              <input
                id="totalUsers"
                type="number"
                min="1"
                step="1"
                value={totalUsers}
                onChange={(e) => {
                  setTotalUsers(e.target.value);
                  setClientError(null);
                }}
                required
                placeholder="1000"
                className="input-glow font-mono text-xs rounded-xl font-tabular"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="activeUsers" className="block font-mono text-[10px] uppercase text-[var(--cs-muted)]">
                Active Users
              </label>
              <input
                id="activeUsers"
                type="number"
                min="0"
                step="1"
                value={activeUsers}
                onChange={(e) => {
                  setActiveUsers(e.target.value);
                  setClientError(null);
                }}
                required
                placeholder="850"
                className="input-glow font-mono text-xs rounded-xl font-tabular"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="churnedUsers" className="block font-mono text-[10px] uppercase text-[var(--cs-muted)]">
                Churned Users
              </label>
              <input
                id="churnedUsers"
                type="number"
                min="0"
                step="1"
                value={churnedUsers}
                onChange={(e) => {
                  setChurnedUsers(e.target.value);
                  setClientError(null);
                }}
                required
                placeholder="150"
                className="input-glow font-mono text-xs rounded-xl font-tabular"
              />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="space-y-1.5">
          <label htmlFor="monthlyRevenue" className="block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cs-text)]">
            Monthly Recurring Revenue ($ USD)
          </label>
          <input
            id="monthlyRevenue"
            type="number"
            min="0"
            step="any"
            value={monthlyRevenue}
            onChange={(e) => {
              setMonthlyRevenue(e.target.value);
              setClientError(null);
            }}
            required
            placeholder="5000.00"
            className="input-glow font-mono text-xs rounded-xl font-tabular"
          />
        </div>

        {/* Persistence feedback status */}
        {saveStatus === 'failed' && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-xs text-amber-400">
            Calculation computed; auto-save to ledger failed: {saveError ?? 'Database error'}.
          </div>
        )}
        {saveStatus === 'unavailable' && (
          <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)] p-3 font-mono text-xs text-[var(--cs-muted)]">
            Persistent ledger is currently offline. Calculation active in ephemeral memory.
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          aria-label={loading ? 'Computing metrics' : 'Execute Analysis'}
          className="btn-primary min-h-[46px] w-full font-mono text-xs font-semibold tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] rounded-xl"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
              />
              COMPUTING FORMULAS…
            </span>
          ) : (
            <>
              <span>EXECUTE CALCULATION</span>
              <ArrowUpRightIcon size={15} />
            </>
          )}
        </button>
      </form>
    </SpotlightCard>
  );
}

'use client';

import { useState } from 'react';
import type { ProjectInput } from '@/types';

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
    <form onSubmit={submit} className="workbench-panel space-y-4 p-5 sm:p-6" aria-label="Manual metric calculation form">
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              {'// PROTOCOL PARAMETERS'}
            </span>
          </div>
          <h2 className="text-sm font-semibold text-[var(--cs-text)]">Project Input</h2>
          <p className="text-xs text-[var(--cs-muted)]">
            Calculate retention, churn rate, and LTV telemetry from user activity and MRR.
          </p>
        </div>
      </div>

      {clientError && (
        <div className="rounded-lg border border-[var(--cs-danger)]/25 bg-red-500/10 p-3 text-xs text-[var(--cs-danger)]" role="alert">
          {clientError}
        </div>
      )}

      {/* Project Name */}
      <div className="space-y-1.5">
        <label htmlFor="projectName" className="block text-xs font-semibold text-[var(--cs-text)]">
          Project Name
        </label>
        <input
          id="projectName"
          value={projectName}
          onChange={(e) => {
            setProjectName(e.target.value);
            setClientError(null);
          }}
          required
          placeholder="e.g. Acme SaaS"
          className="input-control"
        />
      </div>

      {/* User Counts Grid */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-[var(--cs-text)]">User Counts</div>
        <p className="text-[11px] text-[var(--cs-muted)]">Whole numbers only. Active + Churned ≤ Total.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="totalUsers" className="block text-[11px] text-[var(--cs-muted)]">
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
              placeholder="e.g. 1000"
              className="input-control font-tabular"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="activeUsers" className="block text-[11px] text-[var(--cs-muted)]">
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
              placeholder="e.g. 850"
              className="input-control font-tabular"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="churnedUsers" className="block text-[11px] text-[var(--cs-muted)]">
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
              placeholder="e.g. 150"
              className="input-control font-tabular"
            />
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="space-y-1.5">
        <label htmlFor="monthlyRevenue" className="block text-xs font-semibold text-[var(--cs-text)]">
          Monthly Revenue ($ USD)
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
          placeholder="e.g. 5000"
          className="input-control font-tabular"
        />
      </div>

      {/* Persistence feedback status */}
      {saveStatus === 'failed' && (
        <div className="rounded-md border border-amber-500/25 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300">
          Calculation succeeded, but auto-save to history failed: {saveError ?? 'Database error'}.
        </div>
      )}
      {saveStatus === 'unavailable' && (
        <div className="rounded-md border border-[var(--cs-border)] bg-[var(--cs-bg)] p-2.5 text-xs text-[var(--cs-muted)]">
          Database is currently unavailable. Your calculation is active on screen but cannot be saved.
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        aria-label={loading ? 'Calculating metrics' : 'Calculate metrics'}
        className="btn-primary min-h-[44px] w-full text-sm font-semibold"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span
              className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
              style={{ animation: 'spin-slow 0.8s linear infinite' }}
            />
            Calculating…
          </span>
        ) : (
          'Calculate metrics'
        )}
      </button>
    </form>
  );
}

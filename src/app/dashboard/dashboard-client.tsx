'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectInput } from '@/types';
import { ProjectForm } from '@/components/project-form';
import { CsvUploader } from '@/components/csv-uploader';
import { MetricsSummary } from '@/components/metrics-summary';
import { RetentionChart } from '@/components/retention-chart';
import { AIInsightCard } from '@/components/ai-insight-card';
import { AnomalyBadge } from '@/components/anomaly-badge';
import { AIChat } from '@/components/ai-chat';
import { RetentionTable } from '@/components/retention-table';
import { ComparisonView } from '@/components/comparison-view';
import { Navbar } from '@/components/navbar';
import { ErrorBoundary } from '@/components/error-boundary';
import { useCommandPalette } from '@/components/command-palette';
import { useToast } from '@/components/toast';
import { getStoredModel } from '@/lib/models';
import { exportProjectsCsv } from '@/lib/export';
import { dashboardReducer, makeInitialState } from './dashboard-reducer';
import { CheckCircle2Icon, BarChart3Icon } from '@/components/ui/icons';
import { CyberBackground, SpotlightCard } from '@/components/web3';

export function DashboardClient({ email }: { email: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(
    dashboardReducer,
    getStoredModel(),
    makeInitialState
  );

  const {
    input,
    metrics,
    insight,
    trend,
    loadingMetrics,
    loadingInsight,
    error,
    inputMode,
    aiModel,
    history,
    loadingHistory,
    loadingMoreHistory,
    historyError,
    page,
    totalHistory,
    hasMoreHistory,
    justSaved,
    saveStatus,
    saveError,
    deletingId,
    deleteError,
    dbAvailable,
  } = state;

  // Initial load of history (page 1, limit 20)
  const loadHistory = useCallback(async () => {
    dispatch({ type: 'HISTORY_LOADING' });
    try {
      const res = await fetch('/api/projects?page=1&limit=20');
      if (res.status === 503) {
        dispatch({ type: 'DB_UNAVAILABLE' });
        dispatch({ type: 'HISTORY_DONE' });
        return;
      }
      const data = await res.json();
      if (res.ok) {
        dispatch({
          type: 'HISTORY_LOADED',
          history: data.projects ?? [],
          total: data.total ?? data.projects?.length ?? 0,
          page: data.page ?? 1,
          limit: data.limit ?? 20,
          hasMore: Boolean(data.hasMore),
        });
      } else {
        dispatch({ type: 'HISTORY_ERROR', error: data.error ?? 'Failed to load history' });
      }
    } catch (err: unknown) {
      dispatch({
        type: 'HISTORY_ERROR',
        error: err instanceof Error ? err.message : 'Network error loading history',
      });
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Load next page of history
  const handleLoadMore = useCallback(async () => {
    if (loadingMoreHistory || !hasMoreHistory) return;
    dispatch({ type: 'HISTORY_MORE_START' });
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/projects?page=${nextPage}&limit=20`);
      if (res.status === 503) {
        dispatch({ type: 'DB_UNAVAILABLE' });
        dispatch({ type: 'HISTORY_MORE_ERROR', error: 'Storage unavailable' });
        return;
      }
      const data = await res.json();
      if (res.ok) {
        dispatch({
          type: 'HISTORY_MORE_LOADED',
          history: data.projects ?? [],
          total: data.total,
          page: nextPage,
          hasMore: Boolean(data.hasMore),
        });
      } else {
        dispatch({ type: 'HISTORY_MORE_ERROR', error: data.error ?? 'Failed to load more' });
        toast(data.error ?? 'Failed to load more snapshots', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load more snapshots';
      dispatch({ type: 'HISTORY_MORE_ERROR', error: msg });
      toast(msg, 'error');
    }
  }, [loadingMoreHistory, hasMoreHistory, page, toast]);

  // Handle Calculate & best-effort auto-save
  async function handleAnalyze(values: ProjectInput) {
    dispatch({ type: 'ANALYZE_START' });
    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to calculate metrics');

      dispatch({ type: 'ANALYZE_SUCCESS', input: values, metrics: data.metrics });
      toast('Metrics calculated successfully', 'success');

      // Best-effort auto-save to backend
      if (dbAvailable) {
        dispatch({ type: 'SAVE_START' });
        try {
          const saveRes = await fetch('/api/projects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'ChurnSense',
            },
            body: JSON.stringify(values),
          });

          if (saveRes.status === 503) {
            dispatch({ type: 'DB_UNAVAILABLE' });
            toast('Database unavailable: snapshot not saved', 'warning');
          } else if (saveRes.ok) {
            dispatch({ type: 'SAVED' });
            toast('Snapshot saved to history', 'success');
            await loadHistory();
          } else {
            const errData = await saveRes.json().catch(() => ({}));
            const errMsg = errData.error ?? 'Failed to save snapshot';
            dispatch({ type: 'SAVE_ERROR', error: errMsg });
            toast(`Metrics calculated; snapshot not saved (${errMsg})`, 'warning');
          }
        } catch {
          dispatch({ type: 'SAVE_ERROR', error: 'Network error saving snapshot' });
          toast('Metrics calculated; snapshot not saved due to network error', 'warning');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to calculate metrics';
      dispatch({ type: 'ANALYZE_ERROR', error: msg });
      toast(msg, 'error');
    }
  }

  // Handle AI Insight generation
  async function handleGenerate() {
    if (!input) return;
    dispatch({ type: 'INSIGHT_START' });
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'ChurnSense',
        },
        body: JSON.stringify({ ...input, model: aiModel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate insight');

      dispatch({
        type: 'INSIGHT_SUCCESS',
        metrics: data.metrics,
        insight: data.insight,
        trend: data.trend ?? null,
      });
      toast('Retention insight generated', 'info');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate insight';
      dispatch({ type: 'INSIGHT_ERROR', error: msg });
      toast(msg, 'error');
    }
  }

  // Handle Logout
  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'X-Requested-With': 'ChurnSense' },
    });
    router.push('/');
  }

  // Handle Delete Snapshot
  async function handleDelete(id: number) {
    const deletedName = history.find((p) => p.id === id)?.projectName;
    dispatch({ type: 'DELETE_START', id });

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Requested-With': 'ChurnSense' },
      });

      if (res.ok) {
        dispatch({ type: 'DELETE_SUCCESS', id });
        toast('Snapshot deleted', 'success');
        if (deletedName && deletedName === input?.projectName) {
          dispatch({ type: 'RESET_ANALYSIS' });
        }
        await loadHistory();
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error ?? 'Failed to delete snapshot';
        dispatch({ type: 'DELETE_ERROR', error: errMsg });
        toast(`Delete failed: ${errMsg}`, 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error during delete';
      dispatch({ type: 'DELETE_ERROR', error: msg });
      toast(`Delete failed: ${msg}`, 'error');
    }
  }

  // Historical churn series for sparkline
  const churnSeries =
    input && history.length
      ? history
          .filter((p) => p.projectName === input.projectName)
          .slice()
          .reverse()
          .map((p) => p.metrics.churnRate)
      : [];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const { setOpen, palette } = useCommandPalette([
    {
      id: 'analyze',
      label: 'Go to Analysis form',
      shortcut: 'G A',
      onSelect: () => scrollTo('analyze-section'),
    },
    {
      id: 'results',
      label: 'View current metrics',
      shortcut: 'G M',
      onSelect: () => scrollTo('results-section'),
    },
    {
      id: 'snapshots',
      label: 'View snapshots ledger',
      shortcut: 'G S',
      onSelect: () => scrollTo('snapshots-section'),
    },
    {
      id: 'insight',
      label: 'Go to AI insight',
      shortcut: 'G I',
      onSelect: () => scrollTo('ai-section'),
    },
    {
      id: 'export',
      label: 'Export loaded snapshots to CSV',
      shortcut: '⌘ E',
      onSelect: () => exportProjectsCsv(history, `churnsense-loaded-${history.length}-snapshots.csv`),
    },
    {
      id: 'logout',
      label: 'Sign out of ChurnSense',
      shortcut: '',
      onSelect: handleLogout,
    },
  ]);

  return (
    <ErrorBoundary>
      {palette}
      <CyberBackground intensity="subtle" showGrid showSpotlight showRetentionStreams={false} showGrowthLoops={false} />
      <Navbar
        email={email}
        onModelChange={(m) => dispatch({ type: 'SET_AI_MODEL', model: m })}
        onExport={() =>
          exportProjectsCsv(history, `churnsense-loaded-${history.length}-snapshots.csv`)
        }
        showExport={history.length > 0}
        onOpenCommands={() => setOpen(true)}
        onLogout={handleLogout}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 mx-auto w-full max-w-7xl space-y-8 p-4 outline-none sm:p-6 md:p-8"
      >
        {/* Workspace Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--cs-border)] pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              <span className="live-pulse" />
              <span>Retention Ledger Workbench</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cs-text)] sm:text-3xl">
              Retention Intelligence Dashboard
            </h1>
            <p className="text-xs font-mono text-[var(--cs-muted)] mt-1">
              OPERATOR: <strong className="text-emerald-400">{email}</strong> · IMMUTABLE SNAPSHOT WORKBENCH
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)]/80 px-3.5 py-1.5 font-mono text-xs text-[var(--cs-muted)] sm:flex items-center gap-3 backdrop-blur-md">
              <span>LEDGER: <strong className="text-[var(--cs-text)]">{totalHistory}</strong> BLOCKS</span>
              <span className="text-[var(--cs-border)]">|</span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-1.5 font-mono text-xs text-[var(--cs-muted)] hover:border-emerald-500/40 hover:text-[var(--cs-text)] transition-all shadow-sm"
            >
              <span>Commands</span>
              <kbd className="rounded border border-[var(--cs-border)] bg-[var(--cs-bg)] px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Persistence Unavailable Banner */}
        {!dbAvailable && (
          <div
            role="alert"
            className="flex items-center justify-between rounded-lg border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-200"
          >
            <div>
              <strong>Storage unavailable:</strong> The database connection is offline. You can
              still calculate metrics, run batch CSV analyses, and generate AI insights in this session.
            </div>
            <button
              type="button"
              onClick={loadHistory}
              className="ml-3 rounded border border-amber-500/30 px-2 py-1 text-xs font-semibold hover:bg-amber-500/20"
            >
              Retry connection
            </button>
          </div>
        )}

        {/* Global Error Notice */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-[var(--cs-danger)]/25 bg-red-500/10 p-3.5 text-xs text-[var(--cs-danger)]"
          >
            {error}
          </div>
        )}

        {/* WORKBENCH SECTION: Input Form Rail + Results Canvas */}
        <div id="analyze-section" className="grid gap-6 lg:grid-cols-12">
          {/* Input Rail (Left 5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            {/* Manual vs Batch Segmented Control */}
            <div
              role="group"
              aria-label="Input mode selection"
              className="flex rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)]/80 p-1 font-mono text-xs font-semibold backdrop-blur-md"
            >
              <button
                type="button"
                aria-pressed={inputMode === 'manual'}
                onClick={() => dispatch({ type: 'SET_INPUT_MODE', mode: 'manual' })}
                className={`flex-1 rounded-lg py-2 text-center transition-all ${
                  inputMode === 'manual'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-[var(--cs-muted)] hover:text-[var(--cs-text)] border border-transparent'
                }`}
              >
                TELEMETRY INPUT
              </button>
              <button
                type="button"
                aria-pressed={inputMode === 'batch'}
                onClick={() => dispatch({ type: 'SET_INPUT_MODE', mode: 'batch' })}
                className={`flex-1 rounded-lg py-2 text-center transition-all ${
                  inputMode === 'batch'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-[var(--cs-muted)] hover:text-[var(--cs-text)] border border-transparent'
                }`}
              >
                BATCH STREAM (CSV)
              </button>
            </div>

            {inputMode === 'manual' ? (
              <ProjectForm
                onAnalyze={handleAnalyze}
                loading={loadingMetrics}
                saveStatus={saveStatus}
                saveError={saveError}
              />
            ) : (
              <CsvUploader
                onSelectProject={(values) => {
                  dispatch({ type: 'SET_INPUT_MODE', mode: 'manual' });
                  handleAnalyze(values);
                  scrollTo('analyze-section');
                }}
              />
            )}
          </div>

          {/* Results Canvas (Right 7 cols) */}
          <div id="results-section" className="space-y-6 lg:col-span-7">
            {metrics ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--cs-border)] pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--cs-text)]">
                      {input?.projectName ?? 'Current Project'}
                    </span>
                    <span className="text-[var(--cs-muted)]">· Active Calculation</span>
                  </div>
                  {justSaved && dbAvailable && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--cs-primary)]/20 bg-[var(--cs-accent-surface)] px-2.5 py-0.5 text-[11px] font-mono font-medium text-[var(--cs-primary)]">
                      <CheckCircle2Icon size={12} />
                      SNAPSHOT RECORDED
                    </span>
                  )}
                </div>

                <MetricsSummary metrics={metrics} churnSeries={churnSeries} />
                {trend && <AnomalyBadge trend={trend} />}
              </div>
            ) : (
              <SpotlightCard
                glowColor="rgba(16, 185, 129, 0.15)"
                className="flex flex-col items-center justify-center p-14 text-center space-y-4"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <BarChart3Icon size={26} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--cs-text)]">
                    Awaiting Pipeline Calculation
                  </p>
                  <p className="text-xs text-[var(--cs-muted)] max-w-sm font-mono leading-relaxed">
                    Provide aggregate subscriber counts on the left to compute deterministic retention fractions, ARPU indices, and projected LTV.
                  </p>
                </div>
              </SpotlightCard>
            )}

            {/* AI Insight Card */}
            <div id="ai-section">
              <AIInsightCard
                insight={insight}
                loading={loadingInsight}
                onGenerate={handleGenerate}
                disabled={!input}
                projectName={input?.projectName}
                modelName={aiModel}
              />
            </div>
          </div>
        </div>

        {/* CHART SECTION: Single Snapshot / Multi-Snapshot Trend */}
        {input && metrics && (
          <div className="pt-2">
            <RetentionChart project={input} history={history} />
          </div>
        )}

        {/* AI CONVERSATION SECTION */}
        <div className="pt-2">
          <AIChat project={input} metrics={metrics} model={aiModel} userEmail={email} />
        </div>

        {/* SNAPSHOTS LEDGER & HISTORY */}
        <div id="snapshots-section" className="space-y-6 pt-4">
          {historyError && (
            <div className="rounded-lg border border-[var(--cs-danger)]/25 bg-red-500/10 p-3 text-xs text-[var(--cs-danger)]">
              {historyError}
            </div>
          )}

          {dbAvailable && (
            <RetentionTable
              projects={history}
              loading={loadingHistory}
              totalHistory={totalHistory}
              hasMore={hasMoreHistory}
              loadingMore={loadingMoreHistory}
              onLoadMore={handleLoadMore}
              onDelete={handleDelete}
              deletingId={deletingId}
              deleteError={deleteError}
            />
          )}

          {/* Comparison View when >= 2 snapshots are available */}
          {dbAvailable && history.length >= 2 && (
            <div className="pt-2">
              <ComparisonView projects={history} />
            </div>
          )}
        </div>
      </main>
    </ErrorBoundary>
  );
}

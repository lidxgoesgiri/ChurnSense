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
import { ProjectsHistory } from '@/components/projects-history';
import { RetentionTable } from '@/components/retention-table';
import { ThemeToggle } from '@/components/theme-toggle';
import { ErrorBoundary } from '@/components/error-boundary';
import { useCommandPalette } from '@/components/command-palette';
import { ModelSelector } from '@/components/model-selector';
import { ComparisonView } from '@/components/comparison-view';
import { getStoredModel } from '@/lib/models';
import { exportProjectsCsv } from '@/lib/export';
import { dashboardReducer, makeInitialState } from './dashboard-reducer';

export function DashboardClient({ email }: { email: string }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    dashboardReducer,
    getStoredModel(),
    makeInitialState
  );
  const {
    input, metrics, insight, trend, loadingMetrics, loadingInsight, error,
    inputMode, aiModel, history, loadingHistory, justSaved, dbAvailable,
  } = state;

  const loadHistory = useCallback(async () => {
    dispatch({ type: 'HISTORY_LOADING' });
    try {
      const res = await fetch('/api/projects');
      if (res.status === 503) {
        dispatch({ type: 'DB_UNAVAILABLE' });
        dispatch({ type: 'HISTORY_DONE' });
        return;
      }
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'HISTORY_LOADED', history: data.projects ?? [] });
      } else {
        dispatch({ type: 'HISTORY_DONE' });
      }
    } catch {
      dispatch({ type: 'HISTORY_DONE' });
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

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

      if (dbAvailable) {
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
          } else if (saveRes.ok) {
            dispatch({ type: 'SAVED' });
            await loadHistory();
          }
        } catch {
          /* saving is best-effort */
        }
      }
    } catch (err) {
      dispatch({
        type: 'ANALYZE_ERROR',
        error: err instanceof Error ? err.message : 'Failed to calculate metrics',
      });
    }
  }

  async function handleGenerate() {
    if (!input) return;
    dispatch({ type: 'INSIGHT_START' });
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch (err) {
      dispatch({
        type: 'INSIGHT_ERROR',
        error: err instanceof Error ? err.message : 'Failed to generate insight',
      });
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Requested-With': 'ChurnSense' },
      });
      if (res.ok) await loadHistory();
    } catch {
      /* best-effort */
    }
  }

  const churnSeries =
    input && history.length
      ? history
          .filter((p) => p.projectName === input.projectName)
          .slice()
          .reverse()
          .map((p) => p.metrics.churnRate)
      : [];

  // Scroll to a section by ID — helper for the command palette.
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const { palette } = useCommandPalette([
    { id: 'analyze', label: 'Analyze a project', shortcut: '', onSelect: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'insight', label: 'Generate AI insight', shortcut: '', onSelect: () => scrollTo('ai-insight') },
    { id: 'table', label: 'View retention table', shortcut: '', onSelect: () => scrollTo('retention-table') },
    { id: 'logout', label: 'Sign out', shortcut: '', onSelect: handleLogout },
  ]);

  return (
    <ErrorBoundary>
      {palette}
      <main id="main-content" className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 md:p-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ChurnSense</h1>
            <p className="truncate text-sm text-gray-400">Signed in as {email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ModelSelector onModelChange={(m) => dispatch({ type: 'SET_AI_MODEL', model: m })} />
            {history.length > 0 && (
              <button
                onClick={() => exportProjectsCsv(history)}
                aria-label="Export saved projects as CSV"
                className="rounded-lg border border-black/15 px-3 py-1.5 text-sm transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Export CSV
              </button>
            )}
            <ThemeToggle />
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="rounded-lg border border-black/15 px-3 py-1.5 text-sm transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-2 text-xs text-indigo-600 dark:text-indigo-400">
          Press <kbd className="rounded border border-current px-1 font-mono">Cmd+K</kbd> or{' '}
          <kbd className="rounded border border-current px-1 font-mono">Ctrl+K</kbd> to open the command palette.
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div id="project-form" className="space-y-3">
            <div className="inline-flex rounded-lg border border-black/10 p-0.5 text-sm dark:border-white/15">
              {(['manual', 'batch'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_INPUT_MODE', mode })}
                  className={`rounded-md px-3 py-1 capitalize transition-colors ${
                    inputMode === mode
                      ? 'bg-foreground text-background'
                      : 'text-gray-500 hover:text-foreground'
                  }`}
                >
                  {mode === 'manual' ? 'Manual' : 'Batch upload'}
                </button>
              ))}
            </div>
            {inputMode === 'manual' ? (
              <ProjectForm onAnalyze={handleAnalyze} loading={loadingMetrics} />
            ) : (
              <CsvUploader />
            )}
          </div>

          <div className="space-y-6">
            {metrics ? (
              <div className="space-y-3">
                <MetricsSummary metrics={metrics} churnSeries={churnSeries} />
                {trend && <AnomalyBadge trend={trend} />}
                {dbAvailable && justSaved && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Saved to history ✓
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-black/15 p-6 text-sm text-gray-400 dark:border-white/20">
                Enter your project data and calculate metrics to see churn,
                retention, and ARPU.
              </div>
            )}

            <div id="ai-insight">
              <AIInsightCard
                insight={insight}
                loading={loadingInsight}
                onGenerate={handleGenerate}
                disabled={!input}
              />
            </div>
          </div>
        </div>

        {input && metrics && <RetentionChart project={input} history={history} />}

        <AIChat project={input} metrics={metrics} model={aiModel} />

        <div id="retention-table">
          {dbAvailable && (
            <>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Retention data table
              </h3>
              <RetentionTable projects={history} loading={loadingHistory} />
            </>
          )}
        </div>

        {dbAvailable && history.length >= 2 && <ComparisonView projects={history} />}

        {dbAvailable && (
          <ProjectsHistory projects={history} loading={loadingHistory} onDelete={handleDelete} />
        )}
      </main>
    </ErrorBoundary>
  );
}

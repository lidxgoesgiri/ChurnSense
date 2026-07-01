'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnalyticsResult, AIInsightResult, ProjectInput } from '@/types';
import { ProjectForm } from '@/components/project-form';
import { MetricsSummary } from '@/components/metrics-summary';
import { RetentionChart } from '@/components/retention-chart';
import { AIInsightCard } from '@/components/ai-insight-card';
import { ProjectsHistory, type SavedProject } from '@/components/projects-history';

type Insight = AIInsightResult & { source?: 'ai' | 'mock' };

export function DashboardClient({ email }: { email: string }) {
  const router = useRouter();
  const [input, setInput] = useState<ProjectInput | null>(null);
  const [metrics, setMetrics] = useState<AnalyticsResult | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<SavedProject[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dbAvailable, setDbAvailable] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/projects');
      if (res.status === 503) {
        setDbAvailable(false);
        setHistory([]);
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setDbAvailable(true);
        setHistory(data.projects ?? []);
      }
    } catch {
      /* leave history as-is */
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function handleSave() {
    if (!input) return;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save project');
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  async function handleAnalyze(values: ProjectInput) {
    setError(null);
    setInsight(null);
    setLoadingMetrics(true);
    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to calculate metrics');
      setMetrics(data.metrics);
      setInput(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate metrics');
    } finally {
      setLoadingMetrics(false);
    }
  }

  async function handleGenerate() {
    if (!input) return;
    setError(null);
    setLoadingInsight(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate insight');
      setMetrics(data.metrics);
      setInsight(data.insight);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insight');
    } finally {
      setLoadingInsight(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 p-6 sm:p-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ChurnSense</h1>
          <p className="text-sm text-gray-400">Signed in as {email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-black/15 px-3 py-1.5 text-sm transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Sign out
        </button>
      </header>

      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectForm onAnalyze={handleAnalyze} loading={loadingMetrics} />

        <div className="space-y-6">
          {metrics ? (
            <div className="space-y-3">
              <MetricsSummary metrics={metrics} />
              {dbAvailable && (
                <button
                  onClick={handleSave}
                  disabled={saving || !input}
                  className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-black/5 disabled:opacity-40 dark:border-white/20 dark:hover:bg-white/10"
                >
                  {saving ? 'Saving…' : 'Save to history'}
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 p-6 text-sm text-gray-400 dark:border-white/20">
              Enter your project data and calculate metrics to see churn,
              retention, and ARPU.
            </div>
          )}

          <AIInsightCard
            insight={insight}
            loading={loadingInsight}
            onGenerate={handleGenerate}
            disabled={!input}
          />
        </div>
      </div>

      {input && metrics && <RetentionChart project={input} />}

      {dbAvailable && <ProjectsHistory projects={history} loading={loadingHistory} />}
    </main>
  );
}

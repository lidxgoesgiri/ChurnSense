'use client';

import type { AIInsightResult } from '@/types';

type Insight = AIInsightResult & { source?: 'ai' | 'mock' };

interface Props {
  insight: Insight | null;
  loading: boolean;
  onGenerate: () => void;
  disabled: boolean;
  projectName?: string;
  modelName?: string;
}

export function AIInsightCard({
  insight,
  loading,
  onGenerate,
  disabled,
  projectName,
  modelName,
}: Props) {
  return (
    <div className="workbench-panel space-y-4 p-5 sm:p-6" aria-label="AI retention insight card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--cs-border)] pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--cs-text)]">
              Retention Insight
            </h3>
            {insight && (
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${
                  insight.source === 'mock'
                    ? 'border-[var(--cs-border)] bg-[var(--cs-bg)] text-[var(--cs-muted)]'
                    : 'border-[var(--cs-primary)]/20 bg-[var(--cs-accent-surface)] text-[var(--cs-primary)]'
                }`}
              >
                {insight.source === 'mock' ? 'Rule-Based Fallback' : `AI: ${modelName ?? 'Standard'}`}
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--cs-muted)]">
            {projectName ? `Context: ${projectName}` : 'Requires active calculation'}
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled || loading}
          className="btn-primary min-h-[38px] px-4 py-1.5 text-xs font-semibold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent"
                style={{ animation: 'spin-slow 0.8s linear infinite' }}
              />
              Generating…
            </span>
          ) : insight ? (
            'Regenerate insight'
          ) : (
            'Generate insight'
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3 py-4" aria-busy="true">
          <div className="flex items-center gap-2 text-xs text-[var(--cs-muted)]">
            <span
              className="inline-block h-3 w-3 rounded-full border-2 border-[var(--cs-primary)] border-t-transparent"
              style={{ animation: 'spin-slow 0.8s linear infinite' }}
            />
            Analyzing retention metrics and evaluating recommendations…
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--cs-bg)] animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-[var(--cs-bg)] animate-pulse" />
            <div className="h-4 w-3/5 rounded bg-[var(--cs-bg)] animate-pulse" />
          </div>
        </div>
      )}

      {/* Loaded Insight Content */}
      {!loading && insight && (
        <div className="space-y-4 text-xs leading-relaxed">
          {/* Summary */}
          <div className="space-y-1">
            <div className="font-semibold uppercase tracking-wider text-[var(--cs-muted)] text-[10px]">
              Executive Summary
            </div>
            <p className="text-sm text-[var(--cs-text)] leading-relaxed">
              {insight.summary}
            </p>
          </div>

          {/* Actionable Recommendation */}
          <div className="rounded-lg border border-[var(--cs-primary)]/20 bg-[var(--cs-accent-surface)] p-4 text-[var(--cs-text)] space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-primary)]">
              Tactical Recommendation
            </div>
            <p className="text-xs leading-relaxed text-[var(--cs-text)]">
              {insight.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !insight && (
        <div className="py-6 text-center space-y-1 text-xs text-[var(--cs-muted)]">
          <p className="font-medium text-[var(--cs-text)]">No insight generated yet</p>
          <p>
            {disabled
              ? 'Calculate your project metrics first to enable AI retention evaluation.'
              : 'Click "Generate insight" to receive actionable recommendations for this project.'}
          </p>
        </div>
      )}
    </div>
  );
}

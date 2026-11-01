'use client';

import type { AIInsightResult } from '@/types';
import { SparklesIcon, ArrowUpRightIcon } from './ui/icons';
import { SpotlightCard } from './web3/spotlight-card';

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
    <SpotlightCard
      glowColor="rgba(16, 185, 129, 0.22)"
      className="p-6 sm:p-7 space-y-5"
      role="region"
      aria-label="AI retention insight card"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cs-border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <SparklesIcon className="h-3 w-3" />
            </span>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              {'// COGNITIVE INTELLIGENCE // CHURNSENSE AGENT'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 pt-0.5">
            <h3 className="text-base font-extrabold text-[var(--cs-text)]">
              Retention Strategy Blueprint
            </h3>
            {insight && (
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-semibold border ${
                  insight.source === 'mock'
                    ? 'border-[var(--cs-border)] bg-[var(--cs-bg)] text-[var(--cs-muted)]'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {insight.source === 'mock' ? 'RULE-BASED FALLBACK' : `INFERENCE // ${modelName ?? 'STANDARD'}`}
              </span>
            )}
          </div>
          <p className="font-mono text-[11px] text-[var(--cs-muted)]">
            {projectName ? `TARGET: ${projectName}` : 'Requires active calculation'}
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled || loading}
          className="btn-primary min-h-[42px] px-5 py-2 font-mono text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 rounded-xl"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
              />
              SYNTHESIZING…
            </span>
          ) : insight ? (
            <>
              <span>REGENERATE AGENT</span>
              <ArrowUpRightIcon size={14} />
            </>
          ) : (
            <>
              <span>INITIALIZE AGENT</span>
              <ArrowUpRightIcon size={14} />
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 py-5 font-mono" aria-busy="true">
          <div className="flex items-center gap-2.5 text-xs text-emerald-400">
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"
            />
            <span>Executing retention audit heuristics &amp; synthesizing strategic recommendations…</span>
          </div>
          <div className="space-y-2.5">
            <div className="h-4 w-full rounded-lg bg-emerald-500/10 animate-pulse" />
            <div className="h-4 w-4/5 rounded-lg bg-emerald-500/10 animate-pulse" />
            <div className="h-4 w-3/5 rounded-lg bg-emerald-500/10 animate-pulse" />
          </div>
        </div>
      )}

      {/* Loaded Insight Content */}
      {!loading && insight && (
        <div className="space-y-4 text-xs leading-relaxed">
          {/* Summary */}
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--cs-muted)]">
              EXECUTIVE SYNTHESIS
            </div>
            <p className="text-sm text-[var(--cs-text)] leading-relaxed font-normal">
              {insight.summary}
            </p>
          </div>

          {/* Actionable Recommendation */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TACTICAL INTERVENTION BLUEPRINT
            </div>
            <p className="text-xs leading-relaxed text-[var(--cs-text)]">
              {insight.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !insight && (
        <div className="py-8 text-center space-y-2 font-mono text-xs text-[var(--cs-muted)]">
          <p className="font-bold text-[var(--cs-text)]">Awaiting telemetry payload</p>
          <p className="text-[11px] max-w-md mx-auto">
            {disabled
              ? 'Calculate project parameters above to trigger autonomous AI retention auditing.'
              : 'Click "Initialize Agent" to execute multi-tier LLM inference against this dataset.'}
          </p>
        </div>
      )}
    </SpotlightCard>
  );
}

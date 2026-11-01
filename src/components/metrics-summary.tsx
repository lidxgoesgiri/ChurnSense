'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { AnalyticsResult } from '@/types';
import { AnimatedMetric } from './animated-metric';
import { SpotlightCard } from './web3/spotlight-card';

interface Props {
  metrics: AnalyticsResult;
  churnSeries?: number[];
}

function ChurnSparkline({ series }: { series: number[] }) {
  if (series.length < 2) return null;
  const data = series.map((v, i) => ({ i, v }));
  const rising = series[series.length - 1] > series[0];
  return (
    <div className="mt-3 h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={rising ? '#F43F5E' : '#10B981'}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricsSummary({ metrics, churnSeries = [] }: Props) {
  const isHighRisk = metrics.riskStatus === 'High';
  const isMediumRisk = metrics.riskStatus === 'Medium';

  return (
    <div className="space-y-4" aria-label="Metrics summary">
      {/* Risk Status Indicator Banner */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 backdrop-blur-xl transition-all ${
          isHighRisk
            ? 'border-rose-500/35 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
            : isMediumRisk
            ? 'border-amber-500/35 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
            : 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{
                backgroundColor: isHighRisk
                  ? '#F43F5E'
                  : isMediumRisk
                  ? '#F59E0B'
                  : '#10B981',
              }}
            />
            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{
                backgroundColor: isHighRisk
                  ? '#F43F5E'
                  : isMediumRisk
                  ? '#F59E0B'
                  : '#10B981',
              }}
            />
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--cs-text)]">
            RISK CLUSTER: {metrics.riskStatus.toUpperCase()}
          </span>
        </div>
        <span className="font-mono text-[11px] opacity-80">
          {metrics.riskStatus === 'High'
            ? 'THRESHOLD: CHURN > 15.0% (HIGH ALERT)'
            : metrics.riskStatus === 'Medium'
            ? 'THRESHOLD: CHURN > 5.0% (ACTIVE MONITOR)'
            : 'THRESHOLD: CHURN ≤ 5.0% (HEALTHY RETENTION)'}
        </span>
      </div>

      {/* Primary KPI Row: Churn Rate & Retention Rate */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Churn Rate Pod */}
        <SpotlightCard
          glowColor="rgba(244, 63, 94, 0.25)"
          className="p-6 border-rose-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
              CHURN RATE
            </span>
            <span
              className="rounded bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 font-mono text-[10px] uppercase text-rose-400 font-semibold"
              title="Formula: Churned Users ÷ Total Users (lower is better)"
            >
              [LOWER IS BETTER]
            </span>
          </div>
          <div className="mt-3 text-4xl font-extrabold font-mono tracking-tight text-rose-500 sm:text-5xl">
            <AnimatedMetric value={metrics.churnRate * 100} suffix="%" decimals={1} />
          </div>
          <p className="mt-1.5 text-xs text-[var(--cs-muted)] font-normal">
            Percentage of total subscribers lost during this evaluation snapshot.
          </p>
          {churnSeries.length >= 2 && <ChurnSparkline series={churnSeries} />}
        </SpotlightCard>

        {/* Retention Rate Pod */}
        <SpotlightCard
          glowColor="rgba(16, 185, 129, 0.25)"
          className="p-6 border-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
              RETENTION RATE
            </span>
            <span
              className="rounded bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-400 font-semibold"
              title="Formula: Active Users ÷ Total Users (higher is better)"
            >
              [HIGHER IS BETTER]
            </span>
          </div>
          <div className="mt-3 text-4xl font-extrabold font-mono tracking-tight text-emerald-400 sm:text-5xl">
            <AnimatedMetric value={metrics.retentionRate * 100} suffix="%" decimals={1} />
          </div>
          <p className="mt-1.5 text-xs text-[var(--cs-muted)] font-normal">
            Percentage of aggregate customer base actively retained and productive.
          </p>
        </SpotlightCard>
      </div>

      {/* Secondary Financial Indicators: ARPU, MRR, Est. LTV */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* ARPU */}
        <SpotlightCard glowColor="rgba(6, 182, 212, 0.2)" className="p-5">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
              ARPU
            </div>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              REVENUE/USER
            </span>
          </div>
          <div className="mt-2 font-mono text-2xl font-extrabold text-[var(--cs-text)]">
            <AnimatedMetric value={metrics.arpu} prefix="$" decimals={2} />
          </div>
          <p className="mt-1 text-[11px] text-[var(--cs-muted)]">
            Revenue ÷ Total Users
          </p>
        </SpotlightCard>

        {/* MRR */}
        <SpotlightCard glowColor="rgba(6, 182, 212, 0.2)" className="p-5">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
              MRR
            </div>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              AGGREGATE
            </span>
          </div>
          <div className="mt-2 font-mono text-2xl font-extrabold text-[var(--cs-text)]">
            <AnimatedMetric value={metrics.mrr} prefix="$" decimals={2} />
          </div>
          <p className="mt-1 text-[11px] text-[var(--cs-muted)]">
            Monthly recurring revenue
          </p>
        </SpotlightCard>

        {/* Estimated LTV */}
        <SpotlightCard glowColor="rgba(99, 102, 241, 0.2)" className="p-5">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
              EST. LTV
            </div>
            <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
              ASYMPTOTIC
            </span>
          </div>
          <div className="mt-2 font-mono text-2xl font-extrabold text-[var(--cs-text)]">
            {metrics.estimatedLtv === null ? (
              <span className="text-sm font-medium text-[var(--cs-muted)] font-mono">
                Not defined
              </span>
            ) : (
              <AnimatedMetric value={metrics.estimatedLtv} prefix="$" decimals={2} />
            )}
          </div>
          <p className="mt-1 text-[11px] text-[var(--cs-muted)]">
            {metrics.estimatedLtv === null
              ? 'Zero churn · LTV undefined'
              : 'ARPU ÷ Churn Fraction'}
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}

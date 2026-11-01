'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { AnalyticsResult } from '@/types';
import { AnimatedMetric } from './animated-metric';

interface Props {
  metrics: AnalyticsResult;
  churnSeries?: number[];
}

function ChurnSparkline({ series }: { series: number[] }) {
  if (series.length < 2) return null;
  const data = series.map((v, i) => ({ i, v }));
  const rising = series[series.length - 1] > series[0];
  return (
    <div className="mt-2 h-7 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={rising ? 'var(--cs-danger)' : 'var(--cs-success)'}
            strokeWidth={1.5}
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
      <div className="flex items-center justify-between rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: isHighRisk
                ? 'var(--cs-danger)'
                : isMediumRisk
                  ? 'var(--cs-warning)'
                  : 'var(--cs-success)',
            }}
          />
          <span className="text-xs font-semibold text-[var(--cs-text)]">
            Risk evaluation: {metrics.riskStatus} Risk
          </span>
        </div>
        <span className="text-[11px] text-[var(--cs-muted)]">
          {metrics.riskStatus === 'High'
            ? 'Churn > 15.0% threshold'
            : metrics.riskStatus === 'Medium'
              ? 'Churn > 5.0% threshold'
              : 'Churn ≤ 5.0% threshold'}
        </span>
      </div>

      {/* Primary KPI Row: Churn Rate & Retention Rate */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Churn Rate */}
        <div className="workbench-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
              Churn Rate
            </span>
            <span
              className="text-[11px] text-[var(--cs-muted)]"
              title="Formula: Churned Users ÷ Total Users (lower is better)"
            >
              Lower is better
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-[var(--cs-danger)] sm:text-4xl">
            <AnimatedMetric value={metrics.churnRate * 100} suffix="%" decimals={1} />
          </div>
          <p className="mt-1 text-xs text-[var(--cs-muted)]">
            Percentage of customers lost during this period.
          </p>
          {churnSeries.length >= 2 && <ChurnSparkline series={churnSeries} />}
        </div>

        {/* Retention Rate */}
        <div className="workbench-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
              Retention Rate
            </span>
            <span
              className="text-[11px] text-[var(--cs-muted)]"
              title="Formula: Active Users ÷ Total Users (higher is better)"
            >
              Higher is better
            </span>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-[var(--cs-primary)] sm:text-4xl">
            <AnimatedMetric value={metrics.retentionRate * 100} suffix="%" decimals={1} />
          </div>
          <p className="mt-1 text-xs text-[var(--cs-muted)]">
            Percentage of customers actively retained.
          </p>
        </div>
      </div>

      {/* Secondary Financial Indicators: ARPU, MRR, Est. LTV */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* ARPU */}
        <div className="workbench-panel p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
            ARPU
          </div>
          <div className="mt-1.5 text-xl font-bold text-[var(--cs-text)]">
            <AnimatedMetric value={metrics.arpu} prefix="$" decimals={2} />
          </div>
          <p className="mt-1 text-[11px] text-[var(--cs-muted)]">
            Revenue ÷ Total Users
          </p>
        </div>

        {/* MRR */}
        <div className="workbench-panel p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
            MRR
          </div>
          <div className="mt-1.5 text-xl font-bold text-[var(--cs-text)]">
            <AnimatedMetric value={metrics.mrr} prefix="$" decimals={2} />
          </div>
          <p className="mt-1 text-[11px] text-[var(--cs-muted)]">
            Monthly recurring revenue
          </p>
        </div>

        {/* Estimated LTV */}
        <div className="workbench-panel p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
            Estimated LTV
          </div>
          <div className="mt-1.5 text-xl font-bold text-[var(--cs-text)]">
            {metrics.estimatedLtv === null ? (
              <span className="text-sm font-medium text-[var(--cs-muted)]">
                Not defined
              </span>
            ) : (
              <AnimatedMetric value={metrics.estimatedLtv} prefix="$" decimals={2} />
            )}
          </div>
          <p className="mt-1 text-[11px] text-[var(--cs-muted)]">
            {metrics.estimatedLtv === null
              ? 'Zero churn · LTV undefined'
              : 'ARPU ÷ Churn Rate'}
          </p>
        </div>
      </div>
    </div>
  );
}

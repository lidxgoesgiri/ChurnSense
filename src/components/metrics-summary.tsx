'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { AnalyticsResult } from '@/types';
import { AnimatedMetric } from './animated-metric';

const RISK_STYLES: Record<AnalyticsResult['riskStatus'], string> = {
  Low: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  High: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

function Sparkline({ series }: { series: number[] }) {
  if (series.length < 2) return null;
  const data = series.map((v, i) => ({ i, v }));
  const rising = series[series.length - 1] >= series[0];
  return (
    <div className="mt-2 h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={rising ? '#ef4444' : '#22c55e'}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Stat({
  label,
  value,
  rawValue,
  decimals = 2,
  prefix = '',
  suffix = '',
  series,
}: {
  label: string;
  value: string;
  rawValue?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  series?: number[];
}) {
  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
      <div className="text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold" aria-label={`${label}: ${value}`}>
        {rawValue !== undefined ? (
          <AnimatedMetric value={rawValue} prefix={prefix} suffix={suffix} decimals={decimals} />
        ) : (
          value
        )}
      </div>
      {series && <Sparkline series={series} />}
    </div>
  );
}

export function MetricsSummary({
  metrics,
  churnSeries = [],
}: {
  metrics: AnalyticsResult;
  churnSeries?: number[];
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          label="Churn rate"
          value={`${(metrics.churnRate * 100).toFixed(2)}%`}
          rawValue={metrics.churnRate * 100}
          suffix="%"
          decimals={2}
          series={churnSeries.length >= 2 ? churnSeries : undefined}
        />
        <Stat
          label="Retention"
          value={`${(metrics.retentionRate * 100).toFixed(2)}%`}
          rawValue={metrics.retentionRate * 100}
          suffix="%"
          decimals={2}
        />
        <Stat
          label="ARPU"
          value={`$${metrics.arpu.toFixed(2)}`}
          rawValue={metrics.arpu}
          prefix="$"
          decimals={2}
        />
      </div>
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${RISK_STYLES[metrics.riskStatus]}`}
      >
        Risk status: {metrics.riskStatus}
      </div>
    </div>
  );
}

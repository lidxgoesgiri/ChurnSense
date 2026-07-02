'use client';

import type { Anomaly, TrendResult } from '@/lib/trend';

const LABELS: Record<Anomaly, { text: string; icon: string }> = {
  spike: { text: 'Churn anomaly — spike detected', icon: '⬆' },
  drop: { text: 'Churn anomaly — drop detected', icon: '⬇' },
  normal: { text: 'Churn in normal range', icon: '✓' },
  'insufficient-data': { text: 'Insufficient data for trend', icon: '–' },
};

const STYLES: Record<'spike' | 'drop', string> = {
  spike: 'border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400',
  drop: 'border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400',
};

export function AnomalyBadge({ trend }: { trend: TrendResult | null }) {
  if (!trend || trend.anomaly === 'normal' || trend.anomaly === 'insufficient-data') {
    return null;
  }

  const anomaly = trend.anomaly;
  const info = LABELS[anomaly];

  // Human-readable detail: how far this period deviated from the project's
  // own trailing moving average (#32).
  const detail =
    trend.deviation !== null && trend.movingAverage !== null
      ? `${trend.deviation > 0 ? '+' : ''}${(trend.deviation * 100).toFixed(1)}pp vs. ${(
          trend.movingAverage * 100
        ).toFixed(1)}% avg (${trend.points} prior period${trend.points === 1 ? '' : 's'})`
      : undefined;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${STYLES[anomaly]}`}
      title={detail}
    >
      <span>{info.icon}</span>
      <span>{info.text}</span>
      {detail && <span className="font-normal opacity-80">· {detail}</span>}
    </div>
  );
}

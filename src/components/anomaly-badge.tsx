'use client';

import type { Anomaly, TrendResult } from '@/lib/trend';

const LABELS: Record<Anomaly, { text: string; icon: string }> = {
  spike: { text: 'Churn spike detected', icon: '↑' },
  drop: { text: 'Churn drop detected', icon: '↓' },
  normal: { text: 'Churn in normal range', icon: '✓' },
  'insufficient-data': { text: 'Insufficient history for trend', icon: '–' },
};

const STYLES: Record<'spike' | 'drop', string> = {
  spike: 'border-[var(--cs-danger)]/30 bg-red-500/10 text-[var(--cs-danger)]',
  drop: 'border-[var(--cs-success)]/30 bg-emerald-500/10 text-[var(--cs-success)]',
};

export function AnomalyBadge({ trend }: { trend: TrendResult | null }) {
  if (!trend || trend.anomaly === 'normal' || trend.anomaly === 'insufficient-data') {
    return null;
  }

  const anomaly = trend.anomaly;
  const info = LABELS[anomaly];

  const detail =
    trend.deviation !== null && trend.movingAverage !== null
      ? `${trend.deviation > 0 ? '+' : ''}${(trend.deviation * 100).toFixed(1)} pp vs. ${(
          trend.movingAverage * 100
        ).toFixed(1)}% trailing avg (${trend.points} prior snapshot${trend.points === 1 ? '' : 's'})`
      : undefined;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium ${STYLES[anomaly]}`}
      title={detail}
      role="status"
    >
      <span aria-hidden="true" className="font-bold">
        {info.icon}
      </span>
      <span>{info.text}</span>
      {detail && <span className="opacity-80 font-tabular font-normal">· {detail}</span>}
    </div>
  );
}

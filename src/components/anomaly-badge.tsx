'use client';

import type { TrendResult } from '@/lib/trend';
import { TrendingUpIcon, TrendingDownIcon, ShieldCheckIcon } from './ui/icons';

const STYLES: Record<'spike' | 'drop', string> = {
  spike: 'border-[var(--cs-danger)]/40 bg-red-500/10 text-[var(--cs-danger)]',
  drop: 'border-[var(--cs-success)]/40 bg-emerald-500/10 text-[var(--cs-success)]',
};

export function AnomalyBadge({ trend }: { trend: TrendResult | null }) {
  if (!trend || trend.anomaly === 'normal' || trend.anomaly === 'insufficient-data') {
    return null;
  }

  const anomaly = trend.anomaly;

  const detail =
    trend.deviation !== null && trend.movingAverage !== null
      ? `${trend.deviation > 0 ? '+' : ''}${(trend.deviation * 100).toFixed(1)} pp vs ${(
          trend.movingAverage * 100
        ).toFixed(1)}% baseline (${trend.points} trailing snapshots)`
      : undefined;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-mono font-medium ${STYLES[anomaly]}`}
      title={detail}
      role="status"
    >
      <span aria-hidden="true" className="shrink-0">
        {anomaly === 'spike' ? (
          <TrendingUpIcon size={14} className="text-[var(--cs-danger)]" />
        ) : anomaly === 'drop' ? (
          <TrendingDownIcon size={14} className="text-[var(--cs-success)]" />
        ) : (
          <ShieldCheckIcon size={14} className="text-[var(--cs-muted)]" />
        )}
      </span>
      <span>
        {anomaly === 'spike'
          ? 'ANOMALY DETECTED: SPIKE'
          : anomaly === 'drop'
            ? 'ANOMALY DETECTED: DROP'
            : 'NORMAL RANGE'}
      </span>
      {detail && <span className="opacity-80 font-normal">· {detail}</span>}
    </div>
  );
}

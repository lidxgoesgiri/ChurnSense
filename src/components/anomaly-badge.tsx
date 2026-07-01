'use client';

import type { Anomaly } from '@/lib/trend';

const LABELS: Record<Anomaly, { text: string; icon: string }> = {
  spike: { text: 'Churn anomaly — spike detected', icon: '⬆' },
  drop: { text: 'Churn anomaly — drop detected', icon: '⬇' },
  normal: { text: 'Churn in normal range', icon: '✓' },
  'insufficient-data': { text: 'Insufficient data for trend', icon: '–' },
};

export function AnomalyBadge({ anomaly }: { anomaly: Anomaly }) {
  if (anomaly === 'normal' || anomaly === 'insufficient-data') return null;

  const info = LABELS[anomaly];
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
      <span>{info.icon}</span>
      <span>{info.text}</span>
    </div>
  );
}

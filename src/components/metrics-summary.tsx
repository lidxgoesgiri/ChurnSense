'use client';

import type { AnalyticsResult } from '@/types';

const RISK_STYLES: Record<AnalyticsResult['riskStatus'], string> = {
  Low: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  High: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
      <div className="text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export function MetricsSummary({ metrics }: { metrics: AnalyticsResult }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Churn rate" value={`${(metrics.churnRate * 100).toFixed(2)}%`} />
        <Stat label="Retention" value={`${(metrics.retentionRate * 100).toFixed(2)}%`} />
        <Stat label="ARPU" value={`$${metrics.arpu}`} />
      </div>
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${RISK_STYLES[metrics.riskStatus]}`}
      >
        Risk status: {metrics.riskStatus}
      </div>
    </div>
  );
}

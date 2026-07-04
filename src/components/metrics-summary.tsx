'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { AnalyticsResult } from '@/types';
import { AnimatedMetric } from './animated-metric';

const GRADIENTS = {
  churn: 'linear-gradient(135deg, #ef4444, #f97316)',
  retention: 'linear-gradient(135deg, #10b981, #06b6d4)',
  arpu: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  mrr: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  ltv: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
};

const RISK_STYLES: Record<AnalyticsResult['riskStatus'], { bg: string; color: string; glow: string }> = {
  Low: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', glow: 'rgba(16,185,129,0.25)' },
  Medium: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },
  High: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', glow: 'rgba(239,68,68,0.25)' },
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

function StatCard({
  label,
  icon,
  gradient,
  rawValue,
  prefix,
  suffix,
  decimals = 2,
  series,
  delay,
}: {
  label: string;
  icon: string;
  gradient: string;
  rawValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  series?: number[];
  delay: number;
}) {
  return (
    <div
      className="glass-card anim-fade-up relative overflow-hidden p-4"
      style={{ animationDelay: `${delay * 0.06}s` }}
    >
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: gradient }} />
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          {label}
        </span>
      </div>
      <div className="font-mono text-xl font-bold" aria-label={`${label}: ${prefix ?? ''}${rawValue}${suffix ?? ''}`}>
        <AnimatedMetric value={rawValue} prefix={prefix} suffix={suffix} decimals={decimals} />
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
  const risk = RISK_STYLES[metrics.riskStatus];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Churn rate"
          icon="📉"
          gradient={GRADIENTS.churn}
          rawValue={metrics.churnRate * 100}
          suffix="%"
          series={churnSeries.length >= 2 ? churnSeries : undefined}
          delay={1}
        />
        <StatCard label="Retention" icon="💪" gradient={GRADIENTS.retention} rawValue={metrics.retentionRate * 100} suffix="%" delay={2} />
        <StatCard label="ARPU" icon="💰" gradient={GRADIENTS.arpu} rawValue={metrics.arpu} prefix="$" delay={3} />
        <StatCard label="MRR" icon="📈" gradient={GRADIENTS.mrr} rawValue={metrics.mrr} prefix="$" delay={4} />
        <StatCard label="Est. LTV" icon="🏆" gradient={GRADIENTS.ltv} rawValue={metrics.estimatedLtv} prefix="$" delay={5} />
      </div>

      <div className="anim-fade-up" style={{ animationDelay: '0.36s' }}>
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold"
          style={{ background: risk.bg, color: risk.color, boxShadow: `0 0 12px ${risk.glow}` }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: risk.color }} />
          Risk status: {metrics.riskStatus}
        </span>
      </div>
    </div>
  );
}

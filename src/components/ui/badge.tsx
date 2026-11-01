import React from 'react';
import type { AnalyticsResult } from '@/types';

export interface BadgeProps {
  variant?:
    | AnalyticsResult['riskStatus']
    | 'spike'
    | 'drop'
    | 'normal'
    | 'insufficient-data'
    | 'info'
    | 'default';
  children: React.ReactNode;
  className?: string;
}

const STYLES: Record<string, string> = {
  Low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  High: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
  spike: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
  drop: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  normal: 'bg-[var(--cs-elevated)] text-[var(--cs-muted)] border border-[var(--cs-border)]',
  'insufficient-data': 'bg-[var(--cs-elevated)] text-[var(--cs-muted)] border border-[var(--cs-border)]',
  info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
  default: 'bg-[var(--cs-elevated)] text-[var(--cs-muted)] border border-[var(--cs-border)]',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-medium tracking-wide uppercase ${
        STYLES[variant] ?? STYLES.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

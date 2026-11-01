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
  Low: 'bg-[var(--cs-accent-surface)] text-[var(--cs-primary)] border border-[var(--cs-primary)]/20',
  Medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25',
  High: 'bg-red-500/10 text-[var(--cs-danger)] border border-[var(--cs-danger)]/25',
  spike: 'bg-red-500/10 text-[var(--cs-danger)] border border-[var(--cs-danger)]/25',
  drop: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25',
  normal: 'bg-[var(--cs-bg)] text-[var(--cs-muted)] border border-[var(--cs-border)]',
  'insufficient-data': 'bg-[var(--cs-bg)] text-[var(--cs-muted)] border border-[var(--cs-border)]',
  info: 'bg-[var(--cs-accent-surface)] text-[var(--cs-accent)] border border-[var(--cs-accent)]/20',
  default: 'bg-[var(--cs-bg)] text-[var(--cs-muted)] border border-[var(--cs-border)]',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium ${
        STYLES[variant] ?? STYLES.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

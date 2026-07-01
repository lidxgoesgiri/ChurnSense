import type { AnalyticsResult } from '@/types';

interface BadgeProps {
  variant?: AnalyticsResult['riskStatus'] | 'spike' | 'drop' | 'normal' | 'insufficient-data' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
}

const STYLES: Record<string, string> = {
  Low: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  High: 'bg-red-500/10 text-red-600 dark:text-red-400',
  spike: 'bg-red-500/10 text-red-600 dark:text-red-400',
  drop: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  normal: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  'insufficient-data': 'bg-gray-500/5 text-gray-400',
  info: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  default: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STYLES[variant] ?? STYLES.default} ${className}`}
    >
      {children}
    </span>
  );
}

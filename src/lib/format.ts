/** Format a number with thousands separators and fixed decimals. */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Relative "time ago" label for a timestamp (falls back to a locale date). */
export function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(date).toLocaleDateString();
}

/** Format percentage point (pp) delta from a raw fraction difference (e.g. 0.05 -> +5.0 pp). */
export function formatPercentagePoint(diffFraction: number, decimals = 1): string {
  const pp = diffFraction * 100;
  if (Math.abs(pp) < 0.00001) {
    return `${(0).toFixed(decimals)} pp`;
  }
  const sign = pp > 0 ? '+' : '-';
  return `${sign}${Math.abs(pp).toFixed(decimals)} pp`;
}

/** Format signed monetary amount (e.g. -2 -> -$2.00, +2 -> +$2.00, 0 -> $0.00). */
export function formatSignedCurrency(diff: number, decimals = 2): string {
  if (Math.abs(diff) < 0.00001) {
    return `$${(0).toFixed(decimals)}`;
  }
  const sign = diff > 0 ? '+' : '-';
  return `${sign}$${Math.abs(diff).toFixed(decimals)}`;
}

export type DeltaDirection = 'improved' | 'worse' | 'neutral';

export interface ComparisonDeltaResult {
  comparable: boolean;
  diff: number | null;
  display: string;
  direction: DeltaDirection;
  directionText: string;
}

/**
 * Compute canonical B − A comparison delta (where A is baseline and B is comparison).
 * Handles rate (in pp), currency ($), and null LTV (zero churn).
 */
export function calculateComparisonDelta(
  va: number | null,
  vb: number | null,
  type: 'rate' | 'currency',
  lowerIsBetter: boolean
): ComparisonDeltaResult {
  if (va === null || vb === null) {
    return {
      comparable: false,
      diff: null,
      display: '—',
      direction: 'neutral',
      directionText: 'Not comparable (zero churn)',
    };
  }

  // Canonical target: B − A
  const diff = vb - va;
  const isZero = Math.abs(diff) < 0.00001;

  if (isZero) {
    return {
      comparable: true,
      diff: 0,
      display: type === 'rate' ? formatPercentagePoint(0) : formatSignedCurrency(0),
      direction: 'neutral',
      directionText: 'Unchanged',
    };
  }

  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const direction: DeltaDirection = improved ? 'improved' : 'worse';
  const directionText = improved ? 'Improved' : 'Decreased';

  const display = type === 'rate' ? formatPercentagePoint(diff) : formatSignedCurrency(diff);

  return {
    comparable: true,
    diff,
    display,
    direction,
    directionText,
  };
}

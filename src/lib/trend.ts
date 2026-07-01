export type Anomaly = 'spike' | 'drop' | 'normal' | 'insufficient-data';

export interface TrendResult {
  /** How many prior data points fed the moving average. */
  points: number;
  /** Moving average of the prior churn rates (window ≤ 3), or null if none. */
  movingAverage: number | null;
  /** current churn rate − moving average, or null if no prior data. */
  deviation: number | null;
  anomaly: Anomaly;
}

/**
 * Simple moving-average anomaly detector over a project's churn-rate history.
 *
 * Replaces a purely static threshold with a comparison against the project's own
 * recent baseline: if this period's churn deviates from the trailing average by
 * more than `threshold`, it is flagged as a spike/drop. This gives the AI insight
 * layer richer, project-specific context than a single snapshot.
 */
export function detectChurnTrend(
  priorChurnRates: number[],
  currentChurnRate: number,
  opts: { window?: number; threshold?: number } = {}
): TrendResult {
  const window = opts.window ?? 3;
  const threshold = opts.threshold ?? 0.05;

  const recent = priorChurnRates.slice(-window);
  if (recent.length === 0) {
    return { points: 0, movingAverage: null, deviation: null, anomaly: 'insufficient-data' };
  }

  const ma = recent.reduce((a, b) => a + b, 0) / recent.length;
  const movingAverage = Number(ma.toFixed(4));
  const deviation = Number((currentChurnRate - ma).toFixed(4));

  let anomaly: Anomaly = 'normal';
  if (deviation > threshold) anomaly = 'spike';
  else if (deviation < -threshold) anomaly = 'drop';

  return { points: recent.length, movingAverage, deviation, anomaly };
}

import { detectChurnTrend } from '@/lib/trend';
import type { AggregateResult, AnalyticsResult, ProjectInput } from '@/types';

/** A single validated batch row: original input plus its computed metrics. */
export interface BatchRow {
  input: ProjectInput;
  metrics: AnalyticsResult;
}

const EMPTY_AGGREGATE: AggregateResult = {
  avgChurnRate: 0,
  avgRetentionRate: 0,
  avgArpu: 0,
  totalMonthlyRevenue: 0,
  highRiskProjects: 0,
  anomaliesDetected: false,
  anomalyDetails: [],
};

/**
 * Aggregate a batch of analyzed projects: averages, totals, high-risk count, and
 * cross-sectional anomaly detection. Reuses the moving-average detector from
 * `trend.ts` — for each project we compare its churn rate against the baseline
 * formed by all *other* projects in the batch and flag statistically high churn.
 */
export function computeAggregate(rows: BatchRow[]): AggregateResult {
  const n = rows.length;
  if (n === 0) return { ...EMPTY_AGGREGATE };

  const churnRates = rows.map((r) => r.metrics.churnRate);

  const avgChurnRate = Number((churnRates.reduce((a, b) => a + b, 0) / n).toFixed(4));
  const avgRetentionRate = Number(
    (rows.reduce((a, r) => a + r.metrics.retentionRate, 0) / n).toFixed(4)
  );
  const avgArpu = Number((rows.reduce((a, r) => a + r.metrics.arpu, 0) / n).toFixed(2));
  const totalMonthlyRevenue = Number(
    rows.reduce((a, r) => a + r.input.monthlyRevenue, 0).toFixed(2)
  );
  const highRiskProjects = rows.filter((r) => r.metrics.riskStatus === 'High').length;

  const anomalyDetails: string[] = [];
  rows.forEach((r, i) => {
    const others = churnRates.filter((_, j) => j !== i);
    if (others.length === 0) return;
    // Use the full peer set as the baseline window (not just the trailing 3).
    const trend = detectChurnTrend(others, r.metrics.churnRate, { window: others.length });
    if (trend.anomaly === 'spike') {
      const deltaPp = ((trend.deviation ?? 0) * 100).toFixed(1);
      anomalyDetails.push(
        `${r.input.projectName}: churn ${(r.metrics.churnRate * 100).toFixed(1)}% is ${deltaPp}pp above the batch average`
      );
    }
  });

  return {
    avgChurnRate,
    avgRetentionRate,
    avgArpu,
    totalMonthlyRevenue,
    highRiskProjects,
    anomaliesDetected: anomalyDetails.length > 0,
    anomalyDetails,
  };
}

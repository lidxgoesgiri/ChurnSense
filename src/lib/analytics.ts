import { ProjectInput, AnalyticsResult } from '@/types';

/** Thrown when input is semantically invalid (maps to HTTP 400, not 500). */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function calculateSaaSMetrics(data: ProjectInput): AnalyticsResult {
  if (data.totalUsers <= 0) {
    throw new ValidationError('Total users must be greater than zero');
  }

  const churnRate = Number((data.churnedUsers / data.totalUsers).toFixed(4));
  const retentionRate = Number((data.activeUsers / data.totalUsers).toFixed(4));
  const arpu = Number((data.monthlyRevenue / data.totalUsers).toFixed(2));

  let riskStatus: 'Low' | 'Medium' | 'High' = 'Low';
  if (churnRate > 0.15) riskStatus = 'High';
  else if (churnRate > 0.05) riskStatus = 'Medium';

  // MRR is the current monthly recurring revenue; estimated LTV projects
  // average revenue per user across their expected lifetime (1 / churn). With
  // zero churn the expected lifetime is infinite, so LTV is undefined — we
  // return null rather than a misleading 0 (#5.2).
  const mrr = Number(data.monthlyRevenue.toFixed(2));
  const estimatedLtv = churnRate > 0 ? Number((arpu / churnRate).toFixed(2)) : null;

  return { churnRate, retentionRate, arpu, riskStatus, mrr, estimatedLtv };
}
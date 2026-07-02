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

  return { churnRate, retentionRate, arpu, riskStatus };
}
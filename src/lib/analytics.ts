import { ProjectInput, AnalyticsResult } from '@/types';

export function calculateSaaSMetrics(data: ProjectInput): AnalyticsResult {
  if (data.totalUsers <= 0) {
    throw new Error('Total users must be greater than zero');
  }

  const churnRate = Number((data.churnedUsers / data.totalUsers).toFixed(4));
  const retentionRate = Number((data.activeUsers / data.totalUsers).toFixed(4));
  const arpu = Number((data.monthlyRevenue / data.totalUsers).toFixed(2));

  let riskStatus: 'Low' | 'Medium' | 'High' = 'Low';
  if (churnRate > 0.15) riskStatus = 'High';
  else if (churnRate > 0.05) riskStatus = 'Medium';

  return { churnRate, retentionRate, arpu, riskStatus };
}
export interface ProjectInput {
  projectName: string;
  totalUsers: number;
  activeUsers: number;
  churnedUsers: number;
  monthlyRevenue: number;
}

export interface AnalyticsResult {
  churnRate: number;
  retentionRate: number;
  arpu: number; // Average Revenue Per User
  riskStatus: 'Low' | 'Medium' | 'High';
}

export interface AIInsightResult {
  summary: string;
  recommendation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

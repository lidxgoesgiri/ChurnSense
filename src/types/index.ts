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
  mrr: number; // Monthly Recurring Revenue
  estimatedLtv: number; // Estimated Lifetime Value = ARPU / churnRate
}

export interface AIInsightResult {
  summary: string;
  recommendation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

// --- CSV batch upload ---

export interface BatchRowResult {
  projectName: string;
  metrics: AnalyticsResult;
}

export interface BatchError {
  /** 1-based data-row index (excludes the header row). */
  row: number;
  error: string;
}

export interface AggregateResult {
  avgChurnRate: number;
  avgRetentionRate: number;
  avgArpu: number;
  totalMonthlyRevenue: number;
  highRiskProjects: number;
  anomaliesDetected: boolean;
  anomalyDetails: string[];
}

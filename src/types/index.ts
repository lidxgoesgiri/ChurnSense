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
  // Estimated Lifetime Value = ARPU / churnRate. null when churn is zero, where
  // LTV is mathematically undefined (theoretically infinite) rather than 0 (#5.2).
  estimatedLtv: number | null;
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
  // The validated input for this row, so a batch project can be promoted into
  // the main dashboard (metrics, chart, insight, chat) without re-entry (#6.1).
  input: ProjectInput;
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

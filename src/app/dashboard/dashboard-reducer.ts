import type { AnalyticsResult, AIInsightResult, ProjectInput } from '@/types';
import type { TrendResult } from '@/lib/trend';
import type { SavedProject } from '@/components/projects-history';

export type Insight = AIInsightResult & { source?: 'ai' | 'mock' };

export interface DashboardState {
  input: ProjectInput | null;
  metrics: AnalyticsResult | null;
  insight: Insight | null;
  trend: TrendResult | null;
  loadingMetrics: boolean;
  loadingInsight: boolean;
  error: string | null;
  inputMode: 'manual' | 'batch';
  aiModel: string;
  history: SavedProject[];
  loadingHistory: boolean;
  justSaved: boolean;
  dbAvailable: boolean;
}

export type DashboardAction =
  | { type: 'SET_INPUT_MODE'; mode: 'manual' | 'batch' }
  | { type: 'SET_AI_MODEL'; model: string }
  | { type: 'ANALYZE_START' }
  | { type: 'ANALYZE_SUCCESS'; input: ProjectInput; metrics: AnalyticsResult }
  | { type: 'ANALYZE_ERROR'; error: string }
  | { type: 'SAVED' }
  | { type: 'DB_UNAVAILABLE' }
  | { type: 'INSIGHT_START' }
  | { type: 'INSIGHT_SUCCESS'; metrics: AnalyticsResult; insight: Insight; trend: TrendResult | null }
  | { type: 'INSIGHT_ERROR'; error: string }
  | { type: 'HISTORY_LOADING' }
  | { type: 'HISTORY_LOADED'; history: SavedProject[] }
  | { type: 'HISTORY_DONE' }
  | { type: 'RESET_ANALYSIS' };

export function makeInitialState(aiModel: string): DashboardState {
  return {
    input: null,
    metrics: null,
    insight: null,
    trend: null,
    loadingMetrics: false,
    loadingInsight: false,
    error: null,
    inputMode: 'manual',
    aiModel,
    history: [],
    loadingHistory: true,
    justSaved: false,
    dbAvailable: true,
  };
}

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case 'SET_INPUT_MODE':
      return { ...state, inputMode: action.mode };
    case 'SET_AI_MODEL':
      return { ...state, aiModel: action.model };
    case 'ANALYZE_START':
      return { ...state, error: null, insight: null, trend: null, justSaved: false, loadingMetrics: true };
    case 'ANALYZE_SUCCESS':
      return { ...state, input: action.input, metrics: action.metrics, loadingMetrics: false };
    case 'ANALYZE_ERROR':
      return { ...state, error: action.error, loadingMetrics: false };
    case 'SAVED':
      return { ...state, justSaved: true };
    case 'DB_UNAVAILABLE':
      return { ...state, dbAvailable: false };
    case 'INSIGHT_START':
      return { ...state, error: null, loadingInsight: true };
    case 'INSIGHT_SUCCESS':
      return { ...state, metrics: action.metrics, insight: action.insight, trend: action.trend, loadingInsight: false };
    case 'INSIGHT_ERROR':
      return { ...state, error: action.error, loadingInsight: false };
    case 'HISTORY_LOADING':
      return { ...state, loadingHistory: true };
    case 'HISTORY_LOADED':
      return { ...state, history: action.history, dbAvailable: true, loadingHistory: false };
    case 'HISTORY_DONE':
      return { ...state, loadingHistory: false };
    case 'RESET_ANALYSIS':
      return {
        ...state,
        input: null,
        metrics: null,
        insight: null,
        trend: null,
        error: null,
        justSaved: false,
      };
    default:
      return state;
  }
}

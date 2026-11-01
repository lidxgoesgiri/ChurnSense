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
  loadingMoreHistory: boolean;
  historyError: string | null;
  page: number;
  limit: number;
  totalHistory: number;
  hasMoreHistory: boolean;
  justSaved: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'failed' | 'unavailable';
  saveError: string | null;
  deletingId: number | null;
  deleteError: string | null;
  dbAvailable: boolean;
}

export type DashboardAction =
  | { type: 'SET_INPUT_MODE'; mode: 'manual' | 'batch' }
  | { type: 'SET_AI_MODEL'; model: string }
  | { type: 'ANALYZE_START' }
  | { type: 'ANALYZE_SUCCESS'; input: ProjectInput; metrics: AnalyticsResult }
  | { type: 'ANALYZE_ERROR'; error: string }
  | { type: 'SAVE_START' }
  | { type: 'SAVED' }
  | { type: 'SAVE_ERROR'; error: string }
  | { type: 'DB_UNAVAILABLE' }
  | { type: 'CLEAR_SAVE_STATUS' }
  | { type: 'INSIGHT_START' }
  | { type: 'INSIGHT_SUCCESS'; metrics: AnalyticsResult; insight: Insight; trend: TrendResult | null }
  | { type: 'INSIGHT_ERROR'; error: string }
  | { type: 'HISTORY_LOADING' }
  | {
      type: 'HISTORY_LOADED';
      history: SavedProject[];
      total?: number;
      page?: number;
      limit?: number;
      hasMore?: boolean;
    }
  | { type: 'HISTORY_ERROR'; error: string }
  | { type: 'HISTORY_DONE' }
  | { type: 'HISTORY_MORE_START' }
  | {
      type: 'HISTORY_MORE_LOADED';
      history: SavedProject[];
      total?: number;
      page?: number;
      limit?: number;
      hasMore?: boolean;
    }
  | { type: 'HISTORY_MORE_ERROR'; error: string }
  | { type: 'DELETE_START'; id: number }
  | { type: 'DELETE_SUCCESS'; id: number }
  | { type: 'DELETE_ERROR'; error: string }
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
    loadingMoreHistory: false,
    historyError: null,
    page: 1,
    limit: 20,
    totalHistory: 0,
    hasMoreHistory: false,
    justSaved: false,
    saveStatus: 'idle',
    saveError: null,
    deletingId: null,
    deleteError: null,
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
      return {
        ...state,
        error: null,
        insight: null,
        trend: null,
        justSaved: false,
        saveStatus: 'idle',
        saveError: null,
        loadingMetrics: true,
      };
    case 'ANALYZE_SUCCESS':
      return {
        ...state,
        input: action.input,
        metrics: action.metrics,
        loadingMetrics: false,
      };
    case 'ANALYZE_ERROR':
      return {
        ...state,
        error: action.error,
        loadingMetrics: false,
      };
    case 'SAVE_START':
      return {
        ...state,
        saveStatus: 'saving',
        saveError: null,
      };
    case 'SAVED':
      return {
        ...state,
        justSaved: true,
        saveStatus: 'saved',
        saveError: null,
      };
    case 'SAVE_ERROR':
      return {
        ...state,
        saveStatus: 'failed',
        saveError: action.error,
      };
    case 'DB_UNAVAILABLE':
      return {
        ...state,
        dbAvailable: false,
        saveStatus: 'unavailable',
      };
    case 'CLEAR_SAVE_STATUS':
      return {
        ...state,
        saveStatus: 'idle',
        saveError: null,
      };
    case 'INSIGHT_START':
      return { ...state, error: null, loadingInsight: true };
    case 'INSIGHT_SUCCESS':
      return {
        ...state,
        metrics: action.metrics,
        insight: action.insight,
        trend: action.trend,
        loadingInsight: false,
      };
    case 'INSIGHT_ERROR':
      return { ...state, error: action.error, loadingInsight: false };
    case 'HISTORY_LOADING':
      return {
        ...state,
        loadingHistory: true,
        historyError: null,
      };
    case 'HISTORY_LOADED': {
      const total = action.total ?? action.history.length;
      const page = action.page ?? 1;
      const limit = action.limit ?? 20;
      const hasMore = action.hasMore ?? action.history.length < total;
      return {
        ...state,
        history: action.history,
        totalHistory: total,
        page,
        limit,
        hasMoreHistory: hasMore,
        dbAvailable: true,
        loadingHistory: false,
        historyError: null,
      };
    }
    case 'HISTORY_ERROR':
      return {
        ...state,
        loadingHistory: false,
        historyError: action.error,
      };
    case 'HISTORY_DONE':
      return { ...state, loadingHistory: false };
    case 'HISTORY_MORE_START':
      return {
        ...state,
        loadingMoreHistory: true,
        historyError: null,
      };
    case 'HISTORY_MORE_LOADED': {
      // Deduplicate snapshots by id and maintain newest-first
      const existingIds = new Set(state.history.map((p) => p.id));
      const newItems = action.history.filter((p) => !existingIds.has(p.id));
      const merged = [...state.history, ...newItems];
      const total = action.total ?? state.totalHistory;
      const page = action.page ?? state.page + 1;
      const hasMore = action.hasMore ?? merged.length < total;
      return {
        ...state,
        history: merged,
        totalHistory: total,
        page,
        hasMoreHistory: hasMore,
        loadingMoreHistory: false,
        historyError: null,
      };
    }
    case 'HISTORY_MORE_ERROR':
      return {
        ...state,
        loadingMoreHistory: false,
        historyError: action.error,
      };
    case 'DELETE_START':
      return {
        ...state,
        deletingId: action.id,
        deleteError: null,
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        history: state.history.filter((p) => p.id !== action.id),
        totalHistory: Math.max(0, state.totalHistory - 1),
        deletingId: null,
        deleteError: null,
      };
    case 'DELETE_ERROR':
      return {
        ...state,
        deletingId: null,
        deleteError: action.error,
      };
    case 'RESET_ANALYSIS':
      return {
        ...state,
        input: null,
        metrics: null,
        insight: null,
        trend: null,
        error: null,
        justSaved: false,
        saveStatus: 'idle',
        saveError: null,
      };
    default:
      return state;
  }
}

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dashboardReducer, makeInitialState } from './dashboard-reducer';
import type { AnalyticsResult, ProjectInput } from '@/types';
import type { SavedProject } from '@/components/projects-history';

const mockMetrics: AnalyticsResult = {
  churnRate: 0.15,
  retentionRate: 0.85,
  arpu: 5.0,
  mrr: 5000.0,
  estimatedLtv: 33.33,
  riskStatus: 'Medium',
};

const mockProjectInput: ProjectInput = {
  projectName: 'Acme Inc',
  totalUsers: 1000,
  activeUsers: 850,
  churnedUsers: 150,
  monthlyRevenue: 5000,
};

const mockProject1: SavedProject = {
  id: 1,
  projectName: 'Project 1',
  createdAt: '2026-10-31T10:00:00.000Z',
  metrics: mockMetrics,
};

const mockProject2: SavedProject = {
  id: 2,
  projectName: 'Project 2',
  createdAt: '2026-10-31T11:00:00.000Z',
  metrics: mockMetrics,
};

describe('dashboardReducer', () => {
  it('initializes with expected defaults', () => {
    const state = makeInitialState('gpt-4o');
    assert.equal(state.aiModel, 'gpt-4o');
    assert.equal(state.loadingHistory, true);
    assert.equal(state.page, 1);
    assert.equal(state.limit, 20);
    assert.equal(state.totalHistory, 0);
    assert.equal(state.hasMoreHistory, false);
    assert.equal(state.saveStatus, 'idle');
    assert.equal(state.history.length, 0);
  });

  it('handles HISTORY_LOADED with pagination metadata', () => {
    const initial = makeInitialState('gpt-4o');
    const next = dashboardReducer(initial, {
      type: 'HISTORY_LOADED',
      history: [mockProject1],
      total: 43,
      page: 1,
      limit: 20,
      hasMore: true,
    });
    assert.equal(next.loadingHistory, false);
    assert.equal(next.history.length, 1);
    assert.equal(next.totalHistory, 43);
    assert.equal(next.page, 1);
    assert.equal(next.limit, 20);
    assert.equal(next.hasMoreHistory, true);
    assert.equal(next.historyError, null);
  });

  it('handles HISTORY_ERROR without clearing loaded history', () => {
    const initial = {
      ...makeInitialState('gpt-4o'),
      history: [mockProject1],
      loadingHistory: true,
    };
    const next = dashboardReducer(initial, {
      type: 'HISTORY_ERROR',
      error: 'Failed to fetch history',
    });
    assert.equal(next.loadingHistory, false);
    assert.equal(next.history.length, 1);
    assert.equal(next.historyError, 'Failed to fetch history');
  });

  it('handles HISTORY_MORE_LOADED with deduplication and state append', () => {
    const initial = {
      ...makeInitialState('gpt-4o'),
      history: [mockProject1],
      page: 1,
      totalHistory: 2,
      loadingMoreHistory: true,
    };
    // Include mockProject1 again (duplicate) and mockProject2 (new)
    const next = dashboardReducer(initial, {
      type: 'HISTORY_MORE_LOADED',
      history: [mockProject1, mockProject2],
      total: 2,
      page: 2,
      hasMore: false,
    });
    assert.equal(next.loadingMoreHistory, false);
    assert.equal(next.history.length, 2);
    assert.equal(next.history[0].id, 1);
    assert.equal(next.history[1].id, 2);
    assert.equal(next.page, 2);
    assert.equal(next.hasMoreHistory, false);
  });

  it('tracks separate calculate vs persistence statuses', () => {
    let state = makeInitialState('gpt-4o');

    // 1. Calculate start
    state = dashboardReducer(state, { type: 'ANALYZE_START' });
    assert.equal(state.loadingMetrics, true);
    assert.equal(state.saveStatus, 'idle');

    // 2. Calculate success
    state = dashboardReducer(state, {
      type: 'ANALYZE_SUCCESS',
      input: mockProjectInput,
      metrics: mockMetrics,
    });
    assert.equal(state.loadingMetrics, false);
    assert.deepEqual(state.metrics, mockMetrics);
    assert.equal(state.saveStatus, 'idle');

    // 3. Save fails with 500
    state = dashboardReducer(state, { type: 'SAVE_START' });
    assert.equal(state.saveStatus, 'saving');

    state = dashboardReducer(state, { type: 'SAVE_ERROR', error: 'Database timeout' });
    assert.equal(state.saveStatus, 'failed');
    assert.equal(state.saveError, 'Database timeout');
    // Metrics must remain preserved even when save fails!
    assert.deepEqual(state.metrics, mockMetrics);

    // 4. Save succeeds
    state = dashboardReducer(state, { type: 'SAVED' });
    assert.equal(state.saveStatus, 'saved');
    assert.equal(state.justSaved, true);
    assert.equal(state.saveError, null);
  });

  it('handles DELETE lifecycle: start, success, and error', () => {
    const initial = {
      ...makeInitialState('gpt-4o'),
      history: [mockProject1, mockProject2],
      totalHistory: 2,
    };

    // Start delete
    const starting = dashboardReducer(initial, { type: 'DELETE_START', id: 1 });
    assert.equal(starting.deletingId, 1);

    // Delete success
    const succeeded = dashboardReducer(starting, { type: 'DELETE_SUCCESS', id: 1 });
    assert.equal(succeeded.deletingId, null);
    assert.equal(succeeded.history.length, 1);
    assert.equal(succeeded.history[0].id, 2);
    assert.equal(succeeded.totalHistory, 1);

    // Delete error
    const failed = dashboardReducer(starting, { type: 'DELETE_ERROR', error: 'Forbidden' });
    assert.equal(failed.deletingId, null);
    assert.equal(failed.deleteError, 'Forbidden');
    assert.equal(failed.history.length, 2);
  });
});

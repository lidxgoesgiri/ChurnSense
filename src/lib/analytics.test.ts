import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSaaSMetrics, ValidationError } from './analytics';

test('computes churn, retention, arpu from counts', () => {
  const m = calculateSaaSMetrics({
    projectName: 'P',
    totalUsers: 1000,
    activeUsers: 850,
    churnedUsers: 150,
    monthlyRevenue: 5000,
  });
  assert.equal(m.churnRate, 0.15);
  assert.equal(m.retentionRate, 0.85);
  assert.equal(m.arpu, 5);
  assert.equal(m.riskStatus, 'Medium'); // 0.15 is not > 0.15
});

test('risk is High above 15% churn', () => {
  const m = calculateSaaSMetrics({
    projectName: 'P',
    totalUsers: 100,
    activeUsers: 80,
    churnedUsers: 20,
    monthlyRevenue: 100,
  });
  assert.equal(m.riskStatus, 'High');
});

test('LTV is null when churn is zero (#5.2)', () => {
  const m = calculateSaaSMetrics({
    projectName: 'P',
    totalUsers: 100,
    activeUsers: 100,
    churnedUsers: 0,
    monthlyRevenue: 1000,
  });
  assert.equal(m.churnRate, 0);
  assert.equal(m.estimatedLtv, null);
});

test('LTV computed when churn is positive', () => {
  const m = calculateSaaSMetrics({
    projectName: 'P',
    totalUsers: 100,
    activeUsers: 90,
    churnedUsers: 10,
    monthlyRevenue: 1000,
  });
  // arpu=10, churn=0.1 -> ltv=100
  assert.equal(m.estimatedLtv, 100);
});

test('throws on zero total users', () => {
  assert.throws(
    () =>
      calculateSaaSMetrics({
        projectName: 'P',
        totalUsers: 0,
        activeUsers: 0,
        churnedUsers: 0,
        monthlyRevenue: 0,
      }),
    ValidationError
  );
});

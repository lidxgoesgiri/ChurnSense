import test from 'node:test';
import assert from 'node:assert/strict';
import { projectInputSchema } from './validation';

const base = {
  projectName: 'Acme',
  totalUsers: 100,
  activeUsers: 80,
  churnedUsers: 20,
  monthlyRevenue: 1000,
};

test('accepts a consistent row', () => {
  assert.equal(projectInputSchema.safeParse(base).success, true);
});

test('rejects active + churned exceeding total (#5.1)', () => {
  const r = projectInputSchema.safeParse({
    ...base,
    activeUsers: 90,
    churnedUsers: 90, // 180 > 100
  });
  assert.equal(r.success, false);
});

test('rejects non-integer user counts', () => {
  const r = projectInputSchema.safeParse({ ...base, totalUsers: 100.5 });
  assert.equal(r.success, false);
});

test('accepts decimal revenue', () => {
  const r = projectInputSchema.safeParse({ ...base, monthlyRevenue: 1234.56 });
  assert.equal(r.success, true);
});

test('rejects activeUsers greater than total', () => {
  const r = projectInputSchema.safeParse({ ...base, activeUsers: 200, churnedUsers: 0 });
  assert.equal(r.success, false);
});

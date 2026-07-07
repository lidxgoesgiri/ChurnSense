import test from 'node:test';
import assert from 'node:assert/strict';
import { detectChurnTrend } from './trend';

test('reports insufficient-data with no history', () => {
  const r = detectChurnTrend([], 0.1);
  assert.equal(r.anomaly, 'insufficient-data');
  assert.equal(r.movingAverage, null);
});

test('flags a spike above the trailing average', () => {
  const r = detectChurnTrend([0.05, 0.05, 0.05], 0.2);
  assert.equal(r.anomaly, 'spike');
});

test('flags a drop below the trailing average', () => {
  const r = detectChurnTrend([0.2, 0.2, 0.2], 0.05);
  assert.equal(r.anomaly, 'drop');
});

test('normal when within threshold', () => {
  const r = detectChurnTrend([0.1, 0.1, 0.1], 0.11);
  assert.equal(r.anomaly, 'normal');
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPercentagePoint,
  formatSignedCurrency,
  calculateComparisonDelta,
} from './format';

describe('format comparison helpers (F5 & F6 verification)', () => {
  it('formats percentage points with explicit sign and pp suffix', () => {
    assert.equal(formatPercentagePoint(0.05), '+5.0 pp');
    assert.equal(formatPercentagePoint(-0.05), '-5.0 pp');
    assert.equal(formatPercentagePoint(0), '0.0 pp');
  });

  it('formats signed currency with sign outside dollar symbol', () => {
    assert.equal(formatSignedCurrency(2.5), '+$2.50');
    assert.equal(formatSignedCurrency(-2), '-$2.00');
    assert.equal(formatSignedCurrency(0), '$0.00');
  });

  it('F5 golden: A baseline churn 15%, B comparison 10% yields -5.0 pp (improved)', () => {
    // Churn: lower is better. Baseline A=0.15, comparison B=0.10. B - A = -0.05
    const delta = calculateComparisonDelta(0.15, 0.10, 'rate', true);
    assert.equal(delta.comparable, true);
    assert.equal(delta.display, '-5.0 pp');
    assert.equal(delta.direction, 'improved');
    assert.equal(delta.directionText, 'Improved');

    // Swap: A=0.10, B=0.15 -> +5.0 pp (worse)
    const swapped = calculateComparisonDelta(0.10, 0.15, 'rate', true);
    assert.equal(swapped.comparable, true);
    assert.equal(swapped.display, '+5.0 pp');
    assert.equal(swapped.direction, 'worse');
    assert.equal(swapped.directionText, 'Decreased');
  });

  it('F5 golden: retention rate delta (higher is better)', () => {
    // Retention: higher is better. Baseline A=0.85, comparison B=0.90 -> +5.0 pp (improved)
    const delta = calculateComparisonDelta(0.85, 0.90, 'rate', false);
    assert.equal(delta.comparable, true);
    assert.equal(delta.display, '+5.0 pp');
    assert.equal(delta.direction, 'improved');

    // Equality: A=0.85, B=0.85 -> 0.0 pp (neutral)
    const eq = calculateComparisonDelta(0.85, 0.85, 'rate', false);
    assert.equal(eq.comparable, true);
    assert.equal(eq.display, '0.0 pp');
    assert.equal(eq.direction, 'neutral');
    assert.equal(eq.directionText, 'Unchanged');
  });

  it('F6 golden: ARPU comparison delta (monetary)', () => {
    // Baseline A=$7, Comparison B=$5 -> -$2.00 (worse)
    const delta = calculateComparisonDelta(7, 5, 'currency', false);
    assert.equal(delta.comparable, true);
    assert.equal(delta.display, '-$2.00');
    assert.equal(delta.direction, 'worse');

    // Baseline A=$5, Comparison B=$7 -> +$2.00 (improved)
    const improved = calculateComparisonDelta(5, 7, 'currency', false);
    assert.equal(improved.comparable, true);
    assert.equal(improved.display, '+$2.00');
    assert.equal(improved.direction, 'improved');
  });

  it('F6 golden: null LTV is marked non-comparable rather than converting to zero', () => {
    const deltaA = calculateComparisonDelta(null, 50, 'currency', false);
    assert.equal(deltaA.comparable, false);
    assert.equal(deltaA.display, '—');
    assert.equal(deltaA.direction, 'neutral');
    assert.equal(deltaA.directionText, 'Not comparable (zero churn)');

    const deltaB = calculateComparisonDelta(50, null, 'currency', false);
    assert.equal(deltaB.comparable, false);
    assert.equal(deltaB.display, '—');

    const deltaBoth = calculateComparisonDelta(null, null, 'currency', false);
    assert.equal(deltaBoth.comparable, false);
    assert.equal(deltaBoth.display, '—');
  });
});

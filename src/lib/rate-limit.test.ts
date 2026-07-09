import test from 'node:test';
import assert from 'node:assert/strict';
import { rateLimit, rateLimitHeaders } from './rate-limit';

// With no UPSTASH_* env set, rateLimit uses the in-memory fallback window.
// Each test uses a unique key so the module-level store doesn't bleed across cases.

test('allows requests up to the limit, then blocks', async () => {
  const key = `test:allow:${process.pid}:a`;
  const first = await rateLimit(key, 3);
  assert.equal(first.allowed, true);
  assert.equal(first.remaining, 2);

  await rateLimit(key, 3); // 2nd
  const third = await rateLimit(key, 3); // 3rd — still within limit
  assert.equal(third.allowed, true);
  assert.equal(third.remaining, 0);

  const fourth = await rateLimit(key, 3); // 4th — over the limit
  assert.equal(fourth.allowed, false);
  assert.equal(fourth.remaining, 0);
});

test('separate keys have independent windows', async () => {
  const a = await rateLimit(`test:iso:${process.pid}:x`, 1);
  const b = await rateLimit(`test:iso:${process.pid}:y`, 1);
  assert.equal(a.allowed, true);
  assert.equal(b.allowed, true);
});

test('headers reflect the window state', async () => {
  const r = await rateLimit(`test:hdr:${process.pid}`, 5);
  const h = rateLimitHeaders(r);
  assert.equal(h['RateLimit-Limit'], '5');
  assert.equal(h['RateLimit-Remaining'], '4');
  assert.ok(Number(h['RateLimit-Reset']) > 0);
});

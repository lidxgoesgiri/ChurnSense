import test from 'node:test';
import assert from 'node:assert/strict';
import { csrfCheck } from './auth';

function req(headers: Record<string, string>): Request {
  return new Request('https://app.example/api/x', { method: 'POST', headers });
}

test('accepts the custom header', () => {
  assert.equal(csrfCheck(req({ 'x-requested-with': 'ChurnSense' })), true);
});

test('accepts a request with no Origin/Referer (server-to-server, #3.2)', () => {
  assert.equal(csrfCheck(req({ host: 'app.example' })), true);
});

test('accepts a same-origin browser request', () => {
  assert.equal(
    csrfCheck(req({ host: 'app.example', origin: 'https://app.example' })),
    true
  );
});

test('rejects a foreign Origin (the CSRF signature)', () => {
  assert.equal(
    csrfCheck(req({ host: 'app.example', origin: 'https://evil.test' })),
    false
  );
});

test('rejects a foreign Referer when no Origin present', () => {
  assert.equal(
    csrfCheck(req({ host: 'app.example', referer: 'https://evil.test/page' })),
    false
  );
});

test('rejects a malformed Origin', () => {
  assert.equal(csrfCheck(req({ host: 'app.example', origin: 'not-a-url' })), false);
});

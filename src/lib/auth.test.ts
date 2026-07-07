import test from 'node:test';
import assert from 'node:assert/strict';
import { csrfCheck, csrfCheckOrigin } from './auth';

function req(headers: Record<string, string>): Request {
  return new Request('https://app.example/api/x', { method: 'POST', headers });
}

// --- strict header check (projects, upload) ---

test('csrfCheck accepts the custom header', () => {
  assert.equal(csrfCheck(req({ 'x-requested-with': 'ChurnSense' })), true);
});

test('csrfCheck rejects a request without the custom header', () => {
  assert.equal(csrfCheck(req({ host: 'app.example' })), false);
});

test('csrfCheck rejects a same-origin request lacking the header', () => {
  assert.equal(
    csrfCheck(req({ host: 'app.example', origin: 'https://app.example' })),
    false
  );
});

// --- origin-based check (chat, insights, logout) ---

test('csrfCheckOrigin accepts the custom header', () => {
  assert.equal(csrfCheckOrigin(req({ 'x-requested-with': 'ChurnSense' })), true);
});

test('csrfCheckOrigin accepts a request with no Origin/Referer (server-to-server)', () => {
  assert.equal(csrfCheckOrigin(req({ host: 'app.example' })), true);
});

test('csrfCheckOrigin accepts a same-origin browser request', () => {
  assert.equal(
    csrfCheckOrigin(req({ host: 'app.example', origin: 'https://app.example' })),
    true
  );
});

test('csrfCheckOrigin rejects a foreign Origin (the CSRF signature)', () => {
  assert.equal(
    csrfCheckOrigin(req({ host: 'app.example', origin: 'https://evil.test' })),
    false
  );
});

test('csrfCheckOrigin rejects a foreign Referer when no Origin present', () => {
  assert.equal(
    csrfCheckOrigin(req({ host: 'app.example', referer: 'https://evil.test/page' })),
    false
  );
});

test('csrfCheckOrigin rejects a malformed Origin', () => {
  assert.equal(csrfCheckOrigin(req({ host: 'app.example', origin: 'not-a-url' })), false);
});

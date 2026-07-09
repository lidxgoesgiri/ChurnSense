import test from 'node:test';
import assert from 'node:assert/strict';
import { csrfCheck, csrfCheckOrigin, createEmailToken, verifyEmailToken } from './auth';

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

// --- magic-link email token (#1.1) ---

test('email token round-trips the email', () => {
  const token = createEmailToken('user@example.com');
  assert.equal(verifyEmailToken(token), 'user@example.com');
});

test('email token with a special-character address round-trips', () => {
  const token = createEmailToken('a.b+tag@sub.example.co');
  assert.equal(verifyEmailToken(token), 'a.b+tag@sub.example.co');
});

test('a tampered email token is rejected', () => {
  const token = createEmailToken('user@example.com');
  // Flip the last character of the signature.
  const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
  assert.equal(verifyEmailToken(tampered), null);
});

test('a garbage token is rejected', () => {
  assert.equal(verifyEmailToken('not-a-valid-token'), null);
  assert.equal(verifyEmailToken(''), null);
});

import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import requireTurnstile from '../middleware/turnstile.middleware.js';

const originalEnvironment = {
  AWS_LAMBDA_FUNCTION_NAME: process.env.AWS_LAMBDA_FUNCTION_NAME,
  NODE_ENV: process.env.NODE_ENV,
  TURNSTILE_HOSTNAMES: process.env.TURNSTILE_HOSTNAMES,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
};
const originalFetch = globalThis.fetch;
const originalConsoleError = console.error;

function restoreEnvironment() {
  for (const [name, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
}

afterEach(() => {
  restoreEnvironment();
  globalThis.fetch = originalFetch;
  console.error = originalConsoleError;
});

function responseRecorder() {
  return {
    body: undefined,
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function requestWithToken(token = 'valid-token') {
  return {
    body: { email: 'person@example.com', turnstileToken: token },
    get: () => undefined,
  };
}

function useProductionSettings() {
  process.env.NODE_ENV = 'production';
  delete process.env.AWS_LAMBDA_FUNCTION_NAME;
  process.env.TURNSTILE_SECRET_KEY = 'real-production-secret';
  process.env.TURNSTILE_HOSTNAMES = 'zemaverse.com,www.zemaverse.com';
}

test('rejects a request without a token', async () => {
  useProductionSettings();
  const response = responseRecorder();
  let nextCalled = false;

  await requireTurnstile('login')(
    { body: {}, get: () => undefined },
    response,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(response.statusCode, 400);
  assert.equal(nextCalled, false);
});

test('fails closed when production has no secret', async () => {
  useProductionSettings();
  delete process.env.TURNSTILE_SECRET_KEY;
  const response = responseRecorder();

  await requireTurnstile('login')(requestWithToken(), response, () => {});

  assert.equal(response.statusCode, 503);
  assert.match(response.body.message, /not configured/i);
});

test('accepts the expected action and hostname and removes the token', async () => {
  useProductionSettings();
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      action: 'register',
      hostname: 'zemaverse.com',
    }),
  });
  const request = requestWithToken();
  const response = responseRecorder();
  let nextCalled = false;

  await requireTurnstile('register')(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(request.body.turnstileToken, undefined);
  assert.equal(response.statusCode, 200);
});

test('rejects an unexpected action', async () => {
  useProductionSettings();
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      action: 'register',
      hostname: 'zemaverse.com',
    }),
  });
  const response = responseRecorder();

  await requireTurnstile('login')(requestWithToken(), response, () => {});

  assert.equal(response.statusCode, 400);
});

test('rejects an unexpected hostname', async () => {
  useProductionSettings();
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      action: 'login',
      hostname: 'attacker.example',
    }),
  });
  const response = responseRecorder();

  await requireTurnstile('login')(requestWithToken(), response, () => {});

  assert.equal(response.statusCode, 400);
});

test('returns a retryable error when Cloudflare is unavailable', async () => {
  useProductionSettings();
  console.error = () => {};
  globalThis.fetch = async () => {
    throw new Error('network unavailable');
  };
  const response = responseRecorder();

  await requireTurnstile('login')(requestWithToken(), response, () => {});

  assert.equal(response.statusCode, 503);
  assert.match(response.body.message, /temporarily unavailable/i);
});

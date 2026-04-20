// Smoke: same POST /accounts with the same Idempotency-Key collapses.
//
// First call lands 201 (created). Second call with the same key is a
// cached replay and per `internal/middleware/idempotency.go` preserves
// the original status, so it also returns 201 — with the SAME account
// id as the first response (proves cache hit, not a duplicate write).
// A second 201 with a *different* id would mean the SETNX lock was
// defeated and we have a real duplicate-write regression.
// 409 is also accepted — covers the race where the first lock is still
// held when the second call arrives (IDEMPOTENCY_IN_PROGRESS).
//
// Env:
//   BASE_URL         required
//   TEST_USER_TOKEN  required

import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, fail } from 'k6';
import http from 'k6/http';

export const options = {
  iterations: 5,
  vus: 1,
  thresholds: {
    http_req_failed: ['rate<0.02'],
    checks: ['rate>0.99'],
  },
};

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TEST_USER_TOKEN;
if (!BASE_URL || !TOKEN) {
  throw new Error('BASE_URL and TEST_USER_TOKEN are required');
}

function newBody() {
  // Minimal acceptable payload — matches openapi AccountCreate shape.
  // display_name is unique per iteration so we get a fresh row if the
  // idempotency window has expired between smoke runs.
  return JSON.stringify({
    broker_name: 'manual',
    display_name: `smoke-${uuidv4()}`,
    account_type: 'broker',
    connection_type: 'manual',
    base_currency: 'USD',
  });
}

export default function () {
  const key = uuidv4();
  const body = newBody();
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Idempotency-Key': key,
  };

  const first = http.post(`${BASE_URL}/accounts`, body, {
    headers,
    tags: { scenario: 'idempotency', call: 'first' },
  });
  const firstOk = check(first, {
    'first call 201': (r) => r.status === 201,
  });
  if (!firstOk) {
    fail(`first POST /accounts failed: status=${first.status} body=${first.body}`);
  }
  let firstId = null;
  try {
    firstId = first.json()?.account?.id ?? null;
  } catch (_) {
    /* tolerated */
  }

  const second = http.post(`${BASE_URL}/accounts`, body, {
    headers,
    tags: { scenario: 'idempotency', call: 'second' },
  });
  check(second, {
    'second call 201 replay or 409 in-progress': (r) => r.status === 201 || r.status === 409,
    'replayed account.id matches first (cache hit, not duplicate write)': (r) => {
      if (r.status !== 201) return true; // 409 has no body to compare
      try {
        return firstId && r.json()?.account?.id === firstId;
      } catch (_) {
        return false;
      }
    },
  });
}

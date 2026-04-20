// Smoke: GET /portfolio returns 200 for an authenticated test user.
//
// Asserts the read path is exercised end-to-end (Clerk JWT → auth
// middleware → handler → DB → JSON). Thresholds are conservative —
// a healthy staging should be well under these.
//
// Env:
//   BASE_URL         required
//   TEST_USER_TOKEN  required  (Clerk session JWT for the smoke user)

import { check, fail } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.02'],
    checks: ['rate>0.98'],
  },
};

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TEST_USER_TOKEN;
if (!BASE_URL || !TOKEN) {
  throw new Error('BASE_URL and TEST_USER_TOKEN are required');
}

export default function () {
  const res = http.get(`${BASE_URL}/portfolio`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    tags: { scenario: 'portfolio_read' },
  });
  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'body is JSON': (r) => {
      try {
        return r.json() !== null;
      } catch (_) {
        return false;
      }
    },
    'has canonical PortfolioSnapshot shape': (r) => {
      try {
        const body = r.json();
        // Per OpenAPI PortfolioSnapshot: total_value is nested under
        // values.base / values.display (never top-level). snapshot_date
        // is a required field, so presence proves the shape.
        return body?.snapshot_date && body.values?.base?.total_value !== undefined;
      } catch (_) {
        return false;
      }
    },
  });
  if (!ok) {
    fail(`portfolio read failed: status=${res.status} body=${res.body}`);
  }
}

// Smoke: GET /positions returns 200 + a cursor-paginated envelope.
//
// Verifies the positions list endpoint and cursor pagination shape —
// if the envelope drifts, clients (web + iOS) break silently against
// prod.
//
// Env:
//   BASE_URL         required
//   TEST_USER_TOKEN  required

import { check, fail } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<600'],
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
  const res = http.get(`${BASE_URL}/positions?limit=20`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    tags: { scenario: 'positions_read' },
  });
  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'has items array': (r) => {
      try {
        const body = r.json();
        return body && Array.isArray(body.items);
      } catch (_) {
        return false;
      }
    },
    'has next_cursor field (null or string)': (r) => {
      try {
        const body = r.json();
        if (!body) return false;
        return 'next_cursor' in body;
      } catch (_) {
        return false;
      }
    },
  });
  if (!ok) {
    fail(`positions read failed: status=${res.status} body=${res.body.substring(0, 200)}`);
  }
}

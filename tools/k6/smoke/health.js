// Smoke: /health returns 200 and {status: "ok"}.
//
// No auth, no fixtures — this is the first gate. If this fails the LB
// should not be routing traffic to the machine in the first place, but
// we still assert it as the dumbest-possible sanity probe.
//
// Env:
//   BASE_URL   required  (e.g. https://api-staging.investment-tracker.app)

import { check, fail } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL;
if (!BASE_URL) {
  throw new Error('BASE_URL env is required');
}

export default function () {
  const res = http.get(`${BASE_URL}/health`, { tags: { scenario: 'health' } });
  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'status field is ok': (r) => {
      try {
        return r.json('status') === 'ok';
      } catch (_) {
        return false;
      }
    },
  });
  if (!ok) {
    fail(`health probe failed: status=${res.status} body=${res.body}`);
  }
}

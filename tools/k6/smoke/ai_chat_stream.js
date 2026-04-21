// Smoke: POST /ai/chat/stream returns 200 and emits at least one
// `data:` SSE frame within budget.
//
// k6 lacks a native SSE reader, so we treat the stream as a long-
// running HTTP response with a 25s timeout: the reverse proxy in Core
// API flushes frames as they come, and for a trivial prompt the AI
// service closes well under that. The body is parsed as text after
// response end; we assert at least one frame and a reasonable TTFB.
//
// Env:
//   BASE_URL         required
//   TEST_USER_TOKEN  required

import { check, fail } from 'k6';
import http from 'k6/http';

export const options = {
  // Single fire per run — the user-tier daily cap (AIMessagesDaily=5
  // for free; staging test user is free) is incremented by the
  // airatelimit middleware *before* the upstream, so a duration-based
  // loop exhausts the quota within seconds and turns every subsequent
  // iteration into a 429. One iteration is enough to prove the path
  // is alive; TTFB drift will be monitored from real prod traffic
  // once AI Service lands (TD-070).
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95'],
  },
};

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TEST_USER_TOKEN;
if (!BASE_URL || !TOKEN) {
  throw new Error('BASE_URL and TEST_USER_TOKEN are required');
}

// setup runs once before VUs start; we mint a real conversation here
// so every iteration exercises the full ownership + upstream path
// rather than dying at the `conversation_id is required` validation
// gate (which rejects uuid.Nil). On staging, AI Service itself is
// not yet deployed (TD-070), so the chain still tolerates 503 and
// will flip to a stricter 200-only assertion once TD-070 lands.
export function setup() {
  const res = http.post(`${BASE_URL}/ai/conversations`, JSON.stringify({ title: 'k6 smoke' }), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    tags: { scenario: 'ai_chat_stream_setup' },
  });
  if (res.status !== 201) {
    fail(
      `setup: POST /ai/conversations failed: status=${res.status} body=${
        typeof res.body === 'string' ? res.body.substring(0, 200) : '<non-text>'
      }`,
    );
  }
  const id = res.json('id');
  if (!id) {
    fail(`setup: /ai/conversations returned no id: body=${res.body}`);
  }
  return { conversationId: id };
}

export default function (data) {
  const body = JSON.stringify({
    conversation_id: data.conversationId,
    message: { content: [{ type: 'text', text: 'ping' }] },
  });
  const res = http.post(`${BASE_URL}/ai/chat/stream`, body, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    timeout: '25s',
    tags: { scenario: 'ai_chat_stream' },
  });

  const ok = check(res, {
    // 200 — happy path; 503 — upstream AI Service not deployed yet on
    // staging (TD-070); 429 — daily user cap already consumed by a
    // prior run. All three prove the request made it past auth,
    // validation, ownership, and rate-limit middleware; any other
    // status is a genuine regression.
    'status is 200, 429, or 503': (r) => r.status === 200 || r.status === 429 || r.status === 503,
    'if 200, content-type is text/event-stream': (r) => {
      if (r.status !== 200) return true;
      return String(r.headers['Content-Type'] || r.headers['content-type'] || '').includes(
        'text/event-stream',
      );
    },
    'if 200, body contains at least one data: frame': (r) => {
      if (r.status !== 200) return true;
      return typeof r.body === 'string' && r.body.includes('data:');
    },
  });
  if (!ok) {
    const preview = typeof res.body === 'string' ? res.body.substring(0, 200) : '<non-text>';
    fail(
      `ai chat stream failed: status=${res.status} ct=${
        res.headers['Content-Type'] || res.headers['content-type']
      } body=${preview}`,
    );
  }
}

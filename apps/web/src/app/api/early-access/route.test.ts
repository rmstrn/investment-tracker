// API route test — POST /api/early-access (Slice landing-v2)
//
// Validates: 200 on valid email, 400 on invalid/missing email, 400 on bad JSON,
// 400 on non-string setup, success: true response shape.

import { describe, expect, it } from 'vitest';
import { POST } from './route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/early-access', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/early-access', () => {
  it('returns 200 + success on a valid email', async () => {
    const res = await POST(makeRequest({ email: 'jane@example.com' }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { success: boolean };
    expect(body.success).toBe(true);
  });

  it('returns 200 when an optional setup string is provided', async () => {
    const res = await POST(makeRequest({ email: 'jane@example.com', setup: 'IBKR + Schwab' }));
    expect(res.status).toBe(200);
  });

  it('returns 400 when the body is not JSON', async () => {
    const res = await POST(makeRequest('not-json{'));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { success: boolean; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/json/i);
  });

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/email is required/i);
  });

  it('returns 400 when email is malformed', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/invalid/i);
  });

  it('returns 400 when email is an empty string', async () => {
    const res = await POST(makeRequest({ email: '   ' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when setup is not a string', async () => {
    const res = await POST(makeRequest({ email: 'jane@example.com', setup: 42 }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/setup must be a string/i);
  });
});

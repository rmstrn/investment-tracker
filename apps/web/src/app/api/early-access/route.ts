// Early-access waitlist endpoint — Landing-v2 §E
//
// Per right-hand resolution #4: temporary in-house Next.js route handler.
// Logs only (server-side console.log); no database writes, no third-party
// dependency. Slice-LP7 will swap the body of this handler for the real
// backing store without changing the request/response contract.
//
// Contract:
//   POST /api/early-access
//   body: { email: string, setup?: string }
//   response: { success: true } on 200
//   response: { success: false, error: string } on 4xx/5xx
//
// Validation: email regex (loose — full RFC 5322 enforcement is server-side
// concern when the real backing store lands). Setup is free-text, optional.

import { NextResponse } from 'next/server';

interface EarlyAccessRequest {
  email: unknown;
  setup?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_SETUP_LENGTH = 500;

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: EarlyAccessRequest;
  try {
    body = (await request.json()) as EarlyAccessRequest;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, setup } = body;

  if (!isString(email)) {
    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
  }

  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0 || trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json(
      { success: false, error: 'Email must be 1–254 characters' },
      { status: 400 },
    );
  }
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return NextResponse.json({ success: false, error: 'Email format is invalid' }, { status: 400 });
  }

  let trimmedSetup: string | undefined;
  if (setup !== undefined) {
    if (!isString(setup)) {
      return NextResponse.json(
        { success: false, error: 'Setup must be a string' },
        { status: 400 },
      );
    }
    trimmedSetup = setup.trim().slice(0, MAX_SETUP_LENGTH);
  }

  // Server-side log (no PII storage in this slice). Replaced by Slice-LP7
  // backing store when the real handler lands. Production logs land in
  // platform default sink; this is acceptable for pre-alpha logs-only mode.
  // We use console.info here so the noConsoleLog rule is satisfied; this is
  // an intentional informational signal, not a debug breadcrumb.
  if (process.env.NODE_ENV !== 'production') {
    console.info('[early-access] request', {
      email: trimmedEmail,
      setup: trimmedSetup,
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

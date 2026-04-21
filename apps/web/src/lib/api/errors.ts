import type { components } from '@investment-tracker/shared-types';

export type ErrorEnvelope = components['schemas']['ErrorEnvelope'];

export interface ParsedApiError {
  code: string;
  message: string;
  requestId?: string;
}

/**
 * Best-effort extraction of a server `ErrorEnvelope` from whatever thrown
 * value TanStack surfaces. Returns null when the shape doesn't match.
 *
 * openapi-fetch throws `{error, response}` objects whose `error` is the
 * deserialised body when it was JSON — same envelope shape servers emit.
 */
export function parseApiError(err: unknown): ParsedApiError | null {
  const env = (err as { error?: ErrorEnvelope['error'] } | ErrorEnvelope | undefined) ?? undefined;
  const inner =
    (env && 'error' in env && env.error) ||
    ((err as ErrorEnvelope | undefined)?.error ?? undefined);
  if (!inner?.code || !inner.message) return null;
  return { code: inner.code, message: inner.message, requestId: inner.request_id };
}

export type MutationVerb = 'add' | 'rename' | 'remove';

/**
 * Map a mutation error to a short user-facing message. Known backend codes
 * get tailored copy; unknown errors fall back to a retry-friendly default.
 */
export function mapAccountMutationError(err: unknown, verb: MutationVerb): string {
  const parsed = parseApiError(err);
  if (parsed) {
    switch (parsed.code) {
      case 'VALIDATION_ERROR':
        return parsed.message;
      case 'IDEMPOTENCY_IN_PROGRESS':
        return 'Still processing your last request — try again in a moment.';
      case 'RATE_LIMITED':
        return 'Rate limit reached. Try again in a minute.';
    }
  }
  return `Couldn't ${verb} account. Please try again.`;
}

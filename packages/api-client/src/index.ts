import type { paths } from '@investment-tracker/shared-types';
import {
  ChartEnvelope,
  type ChartEnvelope as ChartEnvelopeType,
} from '@investment-tracker/shared-types/charts';
import createClient, { type Client, type ClientOptions, type Middleware } from 'openapi-fetch';
import type { ZodError } from 'zod';

export type InvestmentTrackerClient = Client<paths>;

/**
 * Parsed `X-RateLimit-*` headers. All fields present, or the whole value
 * absent — partial data is not useful downstream.
 */
export interface RateLimitSnapshot {
  limit: number;
  remaining: number;
  /** Unix seconds (per OpenAPI `RateLimitReset` header). */
  resetAt: number;
}

export type RateLimitHandler = (snapshot: RateLimitSnapshot) => void;

export interface CreateClientOptions extends ClientOptions {
  /**
   * A function that resolves a Clerk JWT for the current session. Called on
   * every request so the client always sends a fresh token.
   */
  getAuthToken?: () => Promise<string | null | undefined> | string | null | undefined;
  /**
   * When set, the client attaches `Idempotency-Key: <value>` to every
   * mutating request (POST/PATCH/DELETE). Typically supplied as a UUID v4
   * generated on the client.
   */
  idempotencyKeyFactory?: () => string;
  /**
   * Invoked with canonical `X-RateLimit-{Limit,Remaining,Reset}` header
   * values whenever all three are present on a response. Canonical header
   * names only — no `-Daily` variant exists on the wire.
   */
  onRateLimitHeaders?: RateLimitHandler;
}

const MUTATING_METHODS = new Set(['POST', 'PATCH', 'DELETE', 'PUT']);

/**
 * Create a typed client for the Investment Tracker API. The returned
 * `client` exposes `.GET`, `.POST`, `.PATCH`, `.DELETE` typed against the
 * generated OpenAPI paths.
 */
export function createApiClient(options: CreateClientOptions): InvestmentTrackerClient {
  const { getAuthToken, idempotencyKeyFactory, onRateLimitHeaders, ...rest } = options;
  const client = createClient<paths>(rest);

  const authMiddleware: Middleware = {
    async onRequest({ request }) {
      if (getAuthToken) {
        const token = await getAuthToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      }
      if (
        idempotencyKeyFactory &&
        MUTATING_METHODS.has(request.method.toUpperCase()) &&
        !request.headers.has('Idempotency-Key')
      ) {
        request.headers.set('Idempotency-Key', idempotencyKeyFactory());
      }
      return request;
    },
    async onResponse({ response }) {
      if (onRateLimitHeaders) {
        const snapshot = parseRateLimitHeaders(response.headers);
        if (snapshot) onRateLimitHeaders(snapshot);
      }
      return response;
    },
  };

  client.use(authMiddleware);
  return client;
}

/**
 * Extract the `X-RateLimit-*` trio from a `Headers` instance. Returns
 * `undefined` when any of the three is missing or non-numeric.
 */
export function parseRateLimitHeaders(headers: Headers): RateLimitSnapshot | undefined {
  const rawLimit = headers.get('X-RateLimit-Limit');
  const rawRemaining = headers.get('X-RateLimit-Remaining');
  const rawReset = headers.get('X-RateLimit-Reset');
  if (rawLimit == null || rawRemaining == null || rawReset == null) return undefined;
  const limit = Number.parseInt(rawLimit, 10);
  const remaining = Number.parseInt(rawRemaining, 10);
  const resetAt = Number.parseInt(rawReset, 10);
  if (!Number.isFinite(limit) || !Number.isFinite(remaining) || !Number.isFinite(resetAt)) {
    return undefined;
  }
  return { limit, remaining, resetAt };
}

/**
 * Discriminated result of `parseChartEnvelope`. On success, `data` carries
 * the parsed envelope (with defaults applied — e.g. `schemaVersion: '1.0'`).
 * On failure, `error` is the raw `ZodError` and `raw` is the original input
 * for debugging / logging.
 */
export type ParseChartResult =
  | { ok: true; data: ChartEnvelopeType }
  | { ok: false; error: ZodError; raw: unknown };

/**
 * Parse a chart envelope payload from an unknown source (typically an AI
 * agent response field).
 *
 * **This is the SOLE chart-envelope parsing entry point in the entire
 * codebase.** Renderer components consume the parsed payload and MUST NOT
 * re-validate. The single-parser invariant is enforced by a CI grep that
 * looks for direct schema-level safeParse / parse calls in production
 * code (excluding test files and this comment).
 *
 * Lane-A structural guardrails (forbidden TA overlays, target-weight, V2
 * event types) and cross-field math invariants (waterfall conservation,
 * sum-to-total) all live in the Zod schema; this function is the trust
 * boundary at the api-client layer per architect ADR §«Δ4 dual-side
 * validation» (Pydantic structural pre-emit on `apps/ai/`, Zod canonical
 * structural + math at this boundary).
 *
 * Failures do NOT throw — they return `{ ok: false, error, raw }` so
 * callers can render the §3.11 chart error state and log to monitoring.
 */
export function parseChartEnvelope(raw: unknown): ParseChartResult {
  const result = ChartEnvelope.safeParse(raw);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, error: result.error, raw };
}

export type {
  components,
  paths,
  operations,
  Account,
  Transaction,
  Position,
  PortfolioSnapshot,
  Insight,
  AIMessage,
  AIMessageContent,
  AIChatStreamEvent,
  ErrorEnvelope,
  PaginationMeta,
  User,
  Subscription,
} from '@investment-tracker/shared-types';

import type { paths } from '@investment-tracker/shared-types';
import {
  ChartEnvelope,
  type ChartEnvelope as ChartEnvelopeType,
} from '@investment-tracker/shared-types/charts';
import {
  LANE_A_VOCABULARY_VIOLATION,
  type LaneAVocabularyViolation,
  scanForbiddenVocabulary,
} from '@investment-tracker/shared-types/lane-a-vocabulary';
import createClient, { type Client, type ClientOptions, type Middleware } from 'openapi-fetch';
import { type ZodError, type ZodIssue, z } from 'zod';

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
 * Walk the parsed envelope and collect every text-string field together
 * with its dot-path. Used to drive the Lane-A vocabulary scan post-parse.
 *
 * The current schema surfaces text in `meta.title`, `meta.subtitle`,
 * `meta.alt`, `meta.source`, `meta.emptyHint`, plus per-segment / per-tile /
 * per-event labels. Rather than enumerate them, walk the parsed object
 * generically — Zod has already validated structure, so we only see strings
 * the schema permitted.
 */
function extractTextFields(value: unknown, path: string[]): { path: string; text: string }[] {
  if (typeof value === 'string') {
    return [{ path: path.join('.'), text: value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, idx) => extractTextFields(item, [...path, String(idx)]));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => extractTextFields(v, [...path, k]));
  }
  return [];
}

/**
 * Convert vocabulary violations into custom `ZodIssue`s so callers handle
 * Lane-A failures with the same `ZodError`-shaped error path as schema
 * failures. `params.code === LANE_A_VOCABULARY_VIOLATION` lets monitoring +
 * UI branch on this distinct failure mode (mirrors the
 * `WATERFALL_CONSERVATION_VIOLATION` pattern in `charts.ts`).
 */
function violationsToZodIssues(
  violations: { violation: LaneAVocabularyViolation; path: string }[],
): ZodIssue[] {
  return violations.map(({ violation, path }) => ({
    code: z.ZodIssueCode.custom,
    path: path.split('.').filter((seg) => seg.length > 0),
    message: `Lane-A vocabulary violation: «${violation.token}» (${violation.tier})`,
    params: {
      code: LANE_A_VOCABULARY_VIOLATION,
      tier: violation.tier,
      token: violation.token,
    },
  }));
}

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
 * Two-phase validation:
 * 1. Zod structural + cross-field math (`ChartEnvelope.safeParse`). Lane-A
 *    structural guardrails (forbidden TA overlays, target-weight, V2 event
 *    types) and cross-field invariants (waterfall conservation, sum-to-
 *    total) live in the schema.
 * 2. Lane-A vocabulary scan (`scanForbiddenVocabulary`) over every text
 *    field of the parsed envelope. Catches advice-tone leakage that the
 *    schema cannot see (TD-099). Brand-name whitelist runs first inside
 *    the scan so «Provedo» / «провед-» / «провёл-» do not false-positive.
 *
 * Phase 2 only runs after phase 1 succeeds — we don't scan a malformed
 * envelope. Failures from either phase return as `{ ok: false, error, raw }`
 * with a `ZodError`-shaped error so callers can render the §3.11 chart
 * error state and log to monitoring uniformly.
 *
 * Per architect ADR §«Δ4 dual-side validation»: Pydantic structural
 * pre-emit on `apps/ai/`, Zod canonical structural + math + vocabulary at
 * this boundary.
 */
export function parseChartEnvelope(raw: unknown): ParseChartResult {
  const result = ChartEnvelope.safeParse(raw);
  if (!result.success) {
    return { ok: false, error: result.error, raw };
  }

  const violations = extractTextFields(result.data, []).flatMap((field) =>
    scanForbiddenVocabulary(field.text).map((violation) => ({ violation, path: field.path })),
  );

  if (violations.length > 0) {
    const issues = violationsToZodIssues(violations);
    return { ok: false, error: new z.ZodError(issues), raw };
  }

  return { ok: true, data: result.data };
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

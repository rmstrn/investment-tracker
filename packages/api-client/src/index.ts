import type { paths } from '@investment-tracker/shared-types';
import createClient, { type Client, type ClientOptions, type Middleware } from 'openapi-fetch';

export type InvestmentTrackerClient = Client<paths>;

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
}

const MUTATING_METHODS = new Set(['POST', 'PATCH', 'DELETE', 'PUT']);

/**
 * Create a typed client for the Investment Tracker API. The returned
 * `client` exposes `.GET`, `.POST`, `.PATCH`, `.DELETE` typed against the
 * generated OpenAPI paths.
 */
export function createApiClient(options: CreateClientOptions): InvestmentTrackerClient {
  const { getAuthToken, idempotencyKeyFactory, ...rest } = options;
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
  };

  client.use(authMiddleware);
  return client;
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

import {
  type InvestmentTrackerClient,
  type RateLimitHandler,
  createApiClient,
} from '@investment-tracker/api-client';

const BROWSER_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export function getBrowserApiBaseUrl(): string {
  return BROWSER_BASE_URL;
}

/**
 * Build a typed API client for the browser. The caller supplies `getToken`
 * — usually `useAuth().getToken` from `@clerk/nextjs`. Optional
 * `onRateLimitHeaders` fires when the `X-RateLimit-*` trio appears on a
 * response (see `RateLimitProvider`).
 */
export function createBrowserApiClient(
  getToken: () => Promise<string | null>,
  onRateLimitHeaders?: RateLimitHandler,
): InvestmentTrackerClient {
  return createApiClient({
    baseUrl: BROWSER_BASE_URL,
    getAuthToken: getToken,
    idempotencyKeyFactory: () => crypto.randomUUID(),
    onRateLimitHeaders,
  });
}

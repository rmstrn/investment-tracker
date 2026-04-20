import { type InvestmentTrackerClient, createApiClient } from '@investment-tracker/api-client';

const BROWSER_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

/**
 * Build a typed API client for the browser. The caller supplies `getToken`
 * — usually `useAuth().getToken` from `@clerk/nextjs`.
 */
export function createBrowserApiClient(
  getToken: () => Promise<string | null>,
): InvestmentTrackerClient {
  return createApiClient({
    baseUrl: BROWSER_BASE_URL,
    getAuthToken: getToken,
    idempotencyKeyFactory: () => crypto.randomUUID(),
  });
}

import { auth } from '@clerk/nextjs/server';
import { type InvestmentTrackerClient, createApiClient } from '@investment-tracker/api-client';

const SERVER_BASE_URL = process.env.API_URL ?? 'http://localhost:8080';

/**
 * Build a typed API client for use inside Server Components / Route Handlers.
 * Pulls a fresh Clerk session token on every request via `auth().getToken()`.
 *
 * The factory returns a fresh client per call rather than a module-level
 * singleton because Next.js may run handlers concurrently for different
 * users in the same Node process — sharing one client risks token bleed.
 */
export async function createServerApiClient(): Promise<InvestmentTrackerClient> {
  const session = await auth();
  return createApiClient({
    baseUrl: SERVER_BASE_URL,
    getAuthToken: () => session.getToken(),
  });
}

import { auth } from '@clerk/nextjs/server';
import { type InvestmentTrackerClient, createApiClient } from '@investment-tracker/api-client';

// NOTE: `||` (not `??`) on purpose — empty-string is a common misconfigured
// value (see TD-088), and it must trigger the fallback the same way that
// `undefined` does. A falsy URL base is never useful anyway.
const SERVER_BASE_URL = process.env.API_URL || 'http://localhost:8080';

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

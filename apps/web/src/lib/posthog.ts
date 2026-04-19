/**
 * PostHog initialization placeholder.
 *
 * Real integration: install `posthog-js` and wrap the app in a provider.
 * Stub-only to reflect the product analytics layer from the observability plan.
 */

export function initPostHog(): void {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }
  // TODO: swap for `posthog-js` init once the package is installed.
  // posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, { api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST });
}

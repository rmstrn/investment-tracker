/**
 * Sentry initialization placeholder for the web app.
 *
 * Real integration: install `@sentry/nextjs` and follow the Next.js 15 guide.
 * Keeping this file as a stub so the project structure reflects the observability
 * layer described in README; wire it up in a follow-up PR once the DSN is provisioned.
 */

export function initSentry(): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // No-op when DSN is not configured (dev default).
    return;
  }
  // TODO: swap for @sentry/nextjs init once the package is installed.
  // Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: 0.1 });
}

/**
 * Canonical origin helper for SEO surfaces.
 *
 * PO-locked production canonical: `https://provedo.app` (per architect
 * ADR-7 in `docs/design/landing/D1_LANDING_ARCHITECTURE.md`).
 *
 * `metadataBase` is set in `app/layout.tsx` from this constant; per-page
 * `metadata.alternates.canonical` resolves against `metadataBase`.
 *
 * `NEXT_PUBLIC_CANONICAL_ORIGIN` env override lets staging deploys
 * (e.g. `provedo-staging.vercel.app`) emit their own canonical without
 * leaking into production index. When the env var is absent the
 * production constant wins.
 *
 * NEVER hardcode the origin elsewhere — always import {@link CANONICAL_ORIGIN}
 * or {@link canonicalUrl} so a future origin change is one edit, not a
 * grep-and-replace.
 */

const PRODUCTION_CANONICAL_ORIGIN = 'https://provedo.app';

/** Resolved canonical origin (env-aware). */
export const CANONICAL_ORIGIN: string =
  process.env.NEXT_PUBLIC_CANONICAL_ORIGIN ?? PRODUCTION_CANONICAL_ORIGIN;

/**
 * Build an absolute canonical URL for a path.
 *
 * @param path - Path beginning with '/' (root = '/').
 * @returns Absolute URL with no trailing slash on root (per Google guidance).
 *
 * @example
 *   canonicalUrl('/')              → 'https://provedo.app'
 *   canonicalUrl('/pricing')       → 'https://provedo.app/pricing'
 *   canonicalUrl('/legal/disclaimer') → 'https://provedo.app/legal/disclaimer'
 */
export function canonicalUrl(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`canonicalUrl path must start with "/", got: ${path}`);
  }
  if (path === '/') {
    return CANONICAL_ORIGIN;
  }
  return `${CANONICAL_ORIGIN}${path}`;
}

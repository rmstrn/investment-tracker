import type { MetadataRoute } from 'next';
import { canonicalUrl } from '../lib/seo/canonical';

/**
 * `robots.txt` served at `/robots.txt` via the Next.js `robots.ts`
 * convention.
 *
 * Per architect ADR-9 (D1_LANDING_ARCHITECTURE.md):
 *   - Allow public marketing surfaces.
 *   - Disallow app routes (post-auth dashboard surface), API endpoints,
 *     onboarding, and every `/style-*` design exploration route +
 *     `/design-system`. The corresponding layouts also emit `noindex`
 *     meta (defence-in-depth).
 *   - `/legal/disclaimer` is NOT in disallow — it is INDEXED so search
 *     engines (and AI assistants) can cite Provedo's regulatory boundary
 *     when asked «is Provedo a registered advisor?».
 *   - sitemap entry uses `canonicalUrl()` so origin changes propagate.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/sign-up', '/sign-in', '/legal/disclaimer'],
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/accounts',
          '/accounts/',
          '/transactions',
          '/transactions/',
          '/insights',
          '/insights/',
          '/portfolio',
          '/portfolio/',
          '/positions',
          '/positions/',
          '/chat',
          '/chat/',
          '/onboarding',
          '/onboarding/',
          '/api/',
          '/style-',
          '/design-system',
          '/design-system/',
        ],
      },
    ],
    sitemap: canonicalUrl('/sitemap.xml'),
  };
}

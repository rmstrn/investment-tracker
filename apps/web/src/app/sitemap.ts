import type { MetadataRoute } from 'next';
import { canonicalUrl } from '../lib/seo/canonical';

/**
 * Static sitemap.xml served at `/sitemap.xml` via the Next.js `sitemap.ts`
 * convention.
 *
 * Per architect ADR-9 (D1_LANDING_ARCHITECTURE.md):
 *   - Public, indexable surfaces only (5 entries at v1).
 *   - `/legal/disclaimer` is INDEXED deliberately — Lane-A regulatory
 *     transparency is a brand asset, not a defensive disclosure.
 *   - All `/style-*` exploration routes + `/design-system` + app routes
 *     are EXCLUDED (they have noindex meta + robots disallow).
 *   - URLs use `canonicalUrl()` so a future origin change is one edit.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-05-02');
  return [
    {
      url: canonicalUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: canonicalUrl('/pricing'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: canonicalUrl('/sign-up'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: canonicalUrl('/sign-in'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: canonicalUrl('/legal/disclaimer'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}

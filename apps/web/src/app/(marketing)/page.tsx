import type { Metadata } from 'next';
import { LandingShell } from './_components/LandingShell';
import { FAQ_ITEMS } from './_lib/landing-copy';
import { AISampleRow } from './_sections/AISampleRow';
import { DisclaimerStrip } from './_sections/DisclaimerStrip';
import { FAQ } from './_sections/FAQ';
import { ForWhom } from './_sections/ForWhom';
import { Hero } from './_sections/Hero';
import { LivePreview } from './_sections/LivePreview';
import { PreAlphaTruth } from './_sections/PreAlphaTruth';
import { PricingTeaser } from './_sections/PricingTeaser';
import { RealityStrip } from './_sections/RealityStrip';
import { ThreeModes } from './_sections/ThreeModes';
import { TrustLedger } from './_sections/TrustLedger';
import './_lib/landing.css';
import {
  buildBreadcrumbListSchema,
  buildFAQPageSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
  buildWebSiteSchema,
} from '../../lib/seo/json-ld';

/**
 * Provedo landing v1 — `/`.
 *
 * Per synthesis-lock (D1_LANDING_SYNTHESIS_LOCK.md), this is a single
 * page with 11 sections rendered from a locked design system (D1 lime-
 * cabin v3+v4+v5+v5.1-v5.8). All section copy is sourced from
 * `_lib/landing-copy.ts` (single source of truth across visible UI +
 * FAQPage JSON-LD).
 *
 * Architecture:
 *   - Server component, NO `await auth()` (architect ADR-3).
 *   - `force-static` enforces compile-time guarantee that this route
 *     stays statically prerendered (eligible for Vercel edge cache).
 *   - Auth state is consumed only inside <HeroCTA /> (client island,
 *     ~3kb gz Clerk SDK additional cost).
 *   - 5 schema.org JSON-LD scripts injected at the end of the body.
 *
 * Section order (synthesis-lock §1):
 *   1. Sticky shell (existing MarketingHeader from layout)
 *   2. Hero (asymmetric 8/12 + 4/12)
 *   3. Reality strip (anti-positioning)
 *   4. Live preview (D1 dashboard embed)
 *   5. Three modes (do/refuse pairs)
 *   6. AI sample row (3 chat exchanges)
 *   7. Trust ledger (structural trust signals)
 *   8. For whom (ICP A + ICP B)
 *   9. Pricing teaser
 *   10. FAQ (10 Q+A — drives FAQPage schema)
 *   11. Pre-alpha truth + closing CTA
 *   12. Lane-A disclaimer strip
 *   (footer chrome from existing MarketingFooter in layout)
 */

export const metadata: Metadata = {
  title: 'Provedo — Track investments across every brokerage',
  description:
    'Read-only multi-broker portfolio aggregator with chat-first AI insights. Observations, not instructions. Pre-alpha — free.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Provedo — Track investments across every brokerage',
    description:
      'Read-only multi-broker portfolio aggregator with chat-first AI insights. Observations, not instructions.',
    type: 'website',
    url: '/',
  },
};

/**
 * Static generation invariant — landing must be statically prerendered.
 * Removing this directive allows server-side data fetches to silently
 * convert the route to dynamic. Per architect ADR-3, that is a
 * regression for LCP and CDN cacheability.
 */
export const dynamic = 'force-static';

export default function LandingPage() {
  const organizationSchema = buildOrganizationSchema();
  const websiteSchema = buildWebSiteSchema();
  const softwareApplicationSchema = buildSoftwareApplicationSchema();
  const breadcrumbSchema = buildBreadcrumbListSchema([{ name: 'Home', path: '/' }]);
  const faqSchema = buildFAQPageSchema(FAQ_ITEMS);

  return (
    <LandingShell>
      <Hero />
      <RealityStrip />
      <LivePreview />
      <ThreeModes />
      <AISampleRow />
      <TrustLedger />
      <ForWhom />
      <PricingTeaser />
      <FAQ />
      <PreAlphaTruth />
      <DisclaimerStrip />

      {/* JSON-LD structured data — injected as static script tags so
       * search bots see them on first crawl without JS execution.
       * Per architect ADR-5: dangerouslySetInnerHTML is required because
       * Next.js's metadata API does not support JSON-LD natively at v15. */}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: server-side static JSON */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side static JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side static JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side static JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side static JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side static JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </LandingShell>
  );
}

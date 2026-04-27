# SEO Baseline Audit - Provedo Staging
**Date:** 2026-04-27
**Scope:** Technical SEO, crawlability, metadata, structured data, AI-search readiness

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 4     |
| High     | 8     |
| Medium   | 6     |
| Low / Advisory | 4 |
| **Total** | **22** |

---

## Top 3 Wins (What Is Already Good)

1. **Unique title tags and meta descriptions on both public pages.** Both  and  export a  object with distinct non-empty titles and descriptions. Minimum viable baseline is met.
2. **One H1 per public page, correctly placed.** No duplicates found on either marketing page.
3. **Security headers partially configured.**  already sets , , and .

---

## CRITICAL Findings

---
[CRITICAL] No robots.txt - staging is fully crawlable with no crawl directives
Location: apps/web/public/ (file missing)
Issue: There is no robots.txt file anywhere in the project. On staging this means Googlebot and other crawlers can index the staging environment if they discover the URL. On production the absence means no crawl-budget guidance, no sitemap pointer, and crawlers must guess the full site structure.
Fix:
  For staging - create apps/web/public/robots.txt with:
    User-agent: *
    Disallow: /

  For production - replace with:
    User-agent: *
    Allow: /
    Disallow: /dashboard
    Disallow: /accounts
    Disallow: /positions
    Disallow: /insights
    Disallow: /chat
    Disallow: /sign-in
    Disallow: /sign-up
    Disallow: /design
    Sitemap: https://provedo.ai/sitemap.xml
Effort: ~15 min
Impact: Critical - staging content leaking into Google index contaminates production signals

---

[CRITICAL] No sitemap.xml - production crawl will be undirected
Location: apps/web/src/app/ (file missing)
Issue: No sitemap.ts or sitemap.xml exists. Next.js 15 supports file-based sitemap generation at app/sitemap.ts. Without it, crawlers discover pages only by following links. /pricing is reachable from nav but any future route without strong internal links will be invisible to Googlebot.
Fix: Create apps/web/src/app/sitemap.ts:

  import type { MetadataRoute } from 'next';
  const BASE_URL = process.env.APP_URL ?? 'https://provedo.ai';
  export default function sitemap(): MetadataRoute.Sitemap {
    return [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: BASE_URL + '/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ];
  }

  Then add: Sitemap: https://provedo.ai/sitemap.xml to the production robots.txt.
Effort: ~20 min
Impact: Critical - without this, launch-day indexation depends entirely on link discovery

---

[CRITICAL] No metadataBase set - absolute OG/canonical URLs will be wrong
Location: apps/web/src/app/layout.tsx:11
Issue: The root layout exports no metadataBase. Next.js cannot resolve relative URLs for openGraph.url, canonical alternates, or structured data without it. The production env file shows APP_URL= (empty string) in .env.production.local, compounding the problem.
Fix: In apps/web/src/app/layout.tsx, update the metadata export:

  export const metadata: Metadata = {
    metadataBase: new URL(process.env.APP_URL ?? 'https://provedo.ai'),
    title: { template: '%s - Provedo', default: 'Provedo - AI-native portfolio tracker' },
    description: 'Track your investments. Ask the AI why they moved.',
  };

  Also set APP_URL=https://provedo.ai in the Vercel environment variable panel.
Effort: ~10 min
Impact: Critical - broken canonical/OG URLs cause duplicate content signals and broken social previews

---

[CRITICAL] /design route is publicly accessible with no noindex guard
Location: apps/web/src/app/design/layout.tsx and apps/web/src/app/design/page.tsx
Issue: The /design route is a design-system playground with no robots noindex, no auth guard, and no disallow directive. Its title resolves to Design - Portfolio (the placeholder product name) which will appear in search results if crawled and indexed.
Fix: Add to apps/web/src/app/design/page.tsx:

  export const metadata = {
    title: 'Design System',
    robots: { index: false, follow: false },
  };

  AND add Disallow: /design to the production robots.txt block.
Effort: ~5 min
Impact: Critical - junk indexed page with placeholder copy exposes internal tooling

---

## HIGH Findings

---

[HIGH] Root layout metadata uses placeholder product name and tagline from brand tokens
Location: apps/web/src/app/layout.tsx:11-14 and packages/design-tokens/tokens/brand.json
Issue: The root layout exports title: brand.productName which resolves to Portfolio - flagged as placeholder in brand.json itself. The tagline resolves to AI-native trader of your investments: trader is legally sensitive for a financial product and inconsistent with page-level copy using tracker. Auth pages (/sign-in, /sign-up) export no metadata and fall back to this broken root.
Fix:
  Option A (recommended): Update packages/design-tokens/tokens/brand.json productName and tagline, then rebuild tokens (pnpm build in packages/design-tokens). All consumers update automatically.
  Option B (immediate patch): Override directly in apps/web/src/app/layout.tsx:
    title: { template: '%s - Provedo', default: 'Provedo - AI-native portfolio tracker' }
    description: 'Track your investments. Ask the AI why they moved.'
Effort: ~30 min (token rebuild) or ~10 min (direct override)
Impact: High - wrong product name in index; trader copy is a liability on a financial product

---

[HIGH] No OpenGraph metadata on any page
Location: apps/web/src/app/layout.tsx, apps/web/src/app/(marketing)/page.tsx, apps/web/src/app/(marketing)/pricing/page.tsx
Issue: Zero openGraph or twitter card fields are set anywhere in the codebase. Sharing any URL on LinkedIn, X, Slack, or WhatsApp yields no preview image and falls back to scraped title text only. At launch, social sharing is the primary traffic driver for a pre-alpha product.
Fix: Add to apps/web/src/app/layout.tsx metadata object:

  openGraph: {
    type: 'website',
    siteName: 'Provedo',
    title: 'Provedo - AI-native portfolio tracker',
    description: 'Track your investments. Ask the AI why they moved.',
    url: 'https://provedo.ai',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Provedo - AI-native portfolio tracker',
    description: 'Track your investments. Ask the AI why they moved.',
    images: ['/og-default.png'],
  },

  Create apps/web/public/og-default.png (1200x630 px). Override openGraph.title and openGraph.url per-page on /pricing.
Effort: ~2 hours (OG image design + implementation)
Impact: High - all social previews are broken until this ships

---

[HIGH] No JSON-LD structured data on any page
Location: apps/web/src/app/(marketing)/page.tsx (missing entirely)
Issue: No JSON-LD blocks exist anywhere. Minimum viable: SoftwareApplication schema on /, FAQPage schema when FAQ content is added. Without structured data there is no eligibility for rich results (pricing in SERP, app knowledge panel) and AI search crawlers (Perplexity, ChatGPT Search) cannot disambiguate product identity from raw text.
Fix: Add inline component to apps/web/src/app/(marketing)/page.tsx:

  function SoftwareApplicationSchema() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Provedo',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      url: 'https://provedo.ai',
      offers: [
        { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' },
        { '@type': 'Offer', price: '8', priceCurrency: 'USD', name: 'Plus' },
        { '@type': 'Offer', price: '20', priceCurrency: 'USD', name: 'Pro' },
      ],
    };
    return (
      <script
        type=application/ld+json
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }

  Render <SoftwareApplicationSchema /> inside LandingPage() return before the sections div.
Effort: ~1 hour
Impact: High - required for rich results eligibility; AI search entity disambiguation

---

[HIGH] /sign-in and /sign-up pages export no metadata
Location: apps/web/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
         apps/web/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
Issue: Both pages have zero metadata exports. They inherit the root fallback (Portfolio title, placeholder tagline). Auth pages should always be noindexed. Clerk may render a crawlable initial HTML state before the sign-in widget hydrates.
Fix: Add to each auth page:

  import type { Metadata } from 'next';
  export const metadata: Metadata = {
    title: 'Sign in - Provedo',   // 'Create account - Provedo' for sign-up
    robots: { index: false, follow: false },
  };

Effort: ~10 min
Impact: High - noindex on auth pages is standard; placeholder title leaking to index is a brand failure

---

[HIGH] Landing page title uses old product name
Location: apps/web/src/app/(marketing)/page.tsx:8
Issue: title: 'Investment Tracker - AI-native portfolio tracker' - the old brand name is what Google will index, display in the SERP, and use to build its entity model from launch day.
Fix: title: 'Provedo - AI-native portfolio tracker'  (40 chars, under the 60-char display limit)
Effort: ~5 min
Impact: High - brand consistency in SERP from day one

---

[HIGH] Pricing page title uses old product name
Location: apps/web/src/app/(marketing)/pricing/page.tsx:7
Issue: title: 'Pricing - Investment Tracker'
Fix: title: 'Pricing - Provedo'
     description: 'Free forever for basic portfolio tracking. Plus at /mo unlocks deeper AI and daily insights. Pro at 0/mo adds tax reports and API access.'
Effort: ~5 min
Impact: High - SERP snippet shows wrong product name at launch

---

[HIGH] PricingTable tier names use h2 without a containing section structure
Location: apps/web/src/app/(marketing)/pricing/_components/PricingTable.tsx:98
Issue: Each plan card renders <h2>Free</h2>, <h2>Plus</h2>, <h2>Pro</h2> as sibling H2s on a page where the H1 is Simple pricing. Honest limits. These three plan names are sub-items within a Plans grouping, not independent top-level page sections. This distorts the document heading outline used by Google and screen readers.
Fix:
  1. Wrap the card grid in a section:
       <section aria-labelledby=pricing-plans-heading>
         <h2 id=pricing-plans-heading className=sr-only>Plans</h2>
         {/* existing card grid */}
       </section>
  2. Downgrade tier name headings inside each card from h2 to h3.
Effort: ~20 min
Impact: High - heading hierarchy affects accessibility score and Google document outline

---

[HIGH] No explicit viewport export or themeColor
Location: apps/web/src/app/layout.tsx
Issue: No Viewport export exists. No theme-color for mobile browser chrome. While Next.js injects a default viewport meta, there is no authoritative declaration to prevent future regressions from third-party libraries.
Fix: Add to apps/web/src/app/layout.tsx:

  import type { Viewport } from 'next';

  export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
  };

  Replace color values with the actual background-primary token values from the design system.
Effort: ~15 min
Impact: High - themeColor affects mobile address bar; explicit viewport prevents regressions

---

## MEDIUM Findings

---


[MEDIUM] No canonical tags declared
Location: apps/web/src/app/(marketing)/page.tsx and pricing/page.tsx
Issue: No alternates.canonical is set. Next.js does not auto-emit canonical tags. Vercel preview deploys run under different hostnames. If www and non-www both resolve, Google indexes duplicate URLs and splits ranking signals.
Fix: Landing: alternates: { canonical: chr39 + https://provedo.ai + chr39 }
Effort: ~10 min
Impact: Medium - prevents Vercel preview URL duplicate content; becomes Critical if www/non-www both resolve

---

[MEDIUM] Footer has no legal/policy links and uses old product name
Location: apps/web/src/app/(marketing)/_components/MarketingFooter.tsx
Issue: Footer contains only Pricing and Sign in links plus old product name copyright. No Privacy Policy or Terms of Service. Google quality raters penalize financial products lacking trust signals. Clerk, PostHog, and any payment processor legally require a visible Privacy Policy.
Fix: Add /privacy and /terms routes. Add links to footer. Update copyright to correct product name.
Effort: ~1 hour for stubs + content time
Impact: Medium (SEO trust signal) / Critical (legal compliance pre-launch)

---

[MEDIUM] No llms.txt - AI search engines have no curated site context
Location: apps/web/public/ (file missing)
Issue: llms.txt is the emerging standard for AI crawlers (ChatGPT Search, Perplexity, Grok). Without it, AI search engines infer context from thin page copy alone. Low effort, disproportionate signal for an AI-adjacent product.
Fix: Create apps/web/public/llms.txt with product name, description, page list, and key features in markdown.
Effort: ~15 min
Impact: Medium - AI search citation readiness

---

[MEDIUM] No favicon or web app manifest
Location: apps/web/public/ (only design-system.html exists)
Issue: No favicon.ico, favicon.svg, apple-touch-icon.png, or manifest.json. Google displays favicons in mobile SERPs - missing favicon shows a generic globe icon. Default Next.js favicon currently serves.
Fix: Export favicon.ico (32x32) and favicon.svg from Logo SVG. Export apple-touch-icon.png (180x180). Add icons metadata to layout.tsx.
Effort: ~1 hour
Impact: Medium - SERP favicon display, mobile bookmark quality

---

[MEDIUM] ThreePillars section heading is sr-only with a generic label
Location: apps/web/src/app/(marketing)/page.tsx:73-75
Issue: H2 reads Product pillars (sr-only). Pillar titles (Connect any broker, AI-explained moves, Honest insights, no churn) are rendered via CardTitle - likely a p or div, not heading elements. These keyword-rich strings are absent from the document heading outline.
Fix: Change sr-only H2 text to How it works. Verify CardTitle HTML element in packages/ui and change to h3 if it renders as a p element.
Effort: ~20 min
Impact: Medium - heading signals for featured snippet eligibility

---

[MEDIUM] Thin content - landing page is below viable word count
Location: apps/web/src/app/(marketing)/page.tsx
Issue: Total indexable copy is approximately 120 words. Competing pages for AI portfolio tracker queries have 400-800 words. Thin content limits featured snippet eligibility.
Fix: Add a 5-7 item FAQ (also enables FAQPage JSON-LD), a How it works walkthrough, or a feature comparison section.
Effort: ~2 hours engineering + content time
Impact: Medium - below minimum viable content mass for competitive queries

---

## LOW / Advisory Findings

---

[LOW] MarketingHeader Logo aria-label uses old product name
Location: apps/web/src/app/(marketing)/_components/MarketingHeader.tsx:10
Issue: aria-label value reads old product name. Screen readers announce this verbatim.
Fix: Update aria-label to: Provedo - home
Effort: ~2 min
Impact: Low (accessibility + brand consistency)

---

[LOW] Footer copyright uses old product name
Location: apps/web/src/app/(marketing)/_components/MarketingFooter.tsx:7
Issue: Copyright reads 2026 Investment Tracker.
Fix: Change to 2026 Provedo or the confirmed legal entity name from brand.json legalName.
Effort: ~2 min
Impact: Low (brand consistency)

---

[LOW] productionBrowserSourceMaps: true exposes source code publicly
Location: apps/web/next.config.ts:5
Issue: Source maps are publicly served in production. Not a direct ranking factor, but a compromised site flagged by Google Safe Browsing loses rankings immediately.
Fix: Set productionBrowserSourceMaps: false, or upload to Sentry only with hideSourceMaps: true once Sentry DSN is configured.
Effort: ~5 min
Impact: Low (security hygiene / indirect ranking protection)

---

[LOW] No Content-Security-Policy header configured
Location: apps/web/next.config.ts (headers function)
Issue: headers() sets three security headers but omits CSP. PostHog and Clerk are third-party dependencies. XSS can inject content triggering Google Safe Browsing warnings.
Fix: Add CSP header to headers() array tuned to actual third-party origins. Migrate to nonce-based script-src in a follow-up pass.
Effort: ~1 hour
Impact: Low as direct ranking factor; site compromise = ranking loss

---

## Pre-Launch Checklist (Must-Do Before Going Public)

- [ ] robots.txt: Block all crawlers on staging now. Prepare production version with correct Disallows and Sitemap pointer.
- [ ] sitemap.xml: Create apps/web/src/app/sitemap.ts covering / and /pricing.
- [ ] metadataBase: Set in root layout. Set APP_URL env var to production domain in Vercel.
- [ ] Brand name in metadata: Update all title/description exports and UI copy. Update brand tokens and rebuild, or override directly in layout.
- [ ] OpenGraph + Twitter card: Create OG default image (1200x630). Wire openGraph and twitter metadata in root layout with per-page overrides.
- [ ] noindex on /design, /sign-in, /sign-up: Add robots: { index: false, follow: false } metadata to these three pages.
- [ ] robots.txt Disallow for app routes: /dashboard, /accounts, /positions, /insights, /chat.
- [ ] Canonical tags: Add alternates.canonical to / and /pricing metadata.
- [ ] JSON-LD SoftwareApplication: Add inline schema component to landing page.
- [ ] Favicon + apple-touch-icon: Export from Logo SVG. Required for SERP favicon display and mobile bookmarking.
- [ ] Privacy Policy + Terms stub: Must exist at /privacy and /terms before any user signs up.
- [ ] Footer / header copy: Update all instances of old product name and placeholder legal entity name.
- [ ] Google Search Console: Verify production domain and submit sitemap immediately post-launch.

---

## 5-10 Prioritized Fixes for Tech-Lead Handoff

In implementation order - each step unblocks or amplifies the next:

1. Set APP_URL in Vercel production env - Unblocks metadataBase, canonical URLs, and sitemap generation. Zero code change. ~5 min.

2. Create apps/web/public/robots.txt - Two-line staging block prevents index contamination immediately. Prepare production version in same commit. ~10 min.

3. Add metadataBase + title template to apps/web/src/app/layout.tsx - Single object change. Fixes canonical URL resolution and fallback metadata for all pages without explicit exports. ~10 min.

4. Update product name in all metadata and UI copy - Files: layout.tsx (root), (marketing)/page.tsx, (marketing)/pricing/page.tsx, MarketingHeader.tsx, MarketingFooter.tsx. Grep for Investment Tracker. ~15 min total.

5. Add robots: { index: false } to /design, /sign-in, /sign-up page files. One metadata line each. ~10 min.

6. Create apps/web/src/app/sitemap.ts - New file, ~20 lines. Register Sitemap URL in robots.txt. ~20 min.

7. Add alternates.canonical to landing and pricing metadata. Two metadata objects, one field each. ~10 min.

8. Wire OpenGraph + Twitter metadata - Root layout default + per-page overrides. Engineering wiring ~30 min. OG image (1200x630) is a parallel design-track task.

9. Add JSON-LD SoftwareApplication to landing page - Inline component, no external dependencies. ~45 min.

10. Create apps/web/public/llms.txt - Static text file, 15 lines, no build step required. ~15 min.

---

Audit conducted against source code only. Live HTTP response codes, actual redirect chains, and Core Web Vitals must be verified separately using Google PageSpeed Insights against the staging URL. Search Console property verification should be deferred until the production domain is confirmed and robots.txt is updated to allow production crawling.

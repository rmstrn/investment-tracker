/**
 * Schema.org JSON-LD builders for Provedo's landing surfaces.
 *
 * Per architect ADR-5 (D1_LANDING_ARCHITECTURE.md): five hand-rolled,
 * type-safe builders. No `schema-dts` runtime dep — the schemas Provedo
 * actually emits are small enough that hand-rolled types beat the
 * package-bundle cost.
 *
 * Builders are pure server-side functions that return plain JSON-LD
 * payloads ready to serialize via `JSON.stringify()` and inject as a
 * `<script type="application/ld+json">` tag.
 *
 * The seo-specialist's REJECTED schemas (Review, AggregateRating,
 * Product-per-tier, Article, FinancialService) are NOT exposed here —
 * they're a Lane-A regulatory risk and never get an entry point.
 */

import { canonicalUrl } from './canonical';

const PROVEDO_LEGAL_NAME = 'Provedo';
const PROVEDO_DESCRIPTION =
  'Read-only multi-broker portfolio aggregator with chat-first AI insights. Observations, not instructions.';

/* ────────────────────────────────────────────────────────────────────
 * Organization schema — site-wide singleton.
 *
 * Brand-SERP disambiguation move: legal name + sameAs entries help
 * search engines tell Provedo (Lane-A finance) apart from the Spanish
 * viticulture (1926) and German home-automation iOS app sharing the
 * name. Per seo-specialist v2 §brand SERP.
 * ───────────────────────────────────────────────────────────────── */

interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  legalName: string;
  url: string;
  description: string;
  /**
   * `sameAs` cross-references reinforce entity disambiguation.
   * Add Wikidata Q-item, X handle, LinkedIn page when those land.
   * Keep absent rather than ship empty array (Google ignores empty arrays).
   */
  sameAs?: ReadonlyArray<string>;
}

export function buildOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PROVEDO_LEGAL_NAME,
    legalName: PROVEDO_LEGAL_NAME,
    url: canonicalUrl('/'),
    description: PROVEDO_DESCRIPTION,
  };
}

/* ────────────────────────────────────────────────────────────────────
 * WebSite schema — site-wide singleton.
 *
 * Provedo does NOT expose a public sitewide search endpoint, so the
 * `potentialAction` (SearchAction) is omitted. Adding it without a
 * functional handler would be misleading for crawlers.
 * ───────────────────────────────────────────────────────────────── */

interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  publisher: {
    '@type': 'Organization';
    name: string;
  };
}

export function buildWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: PROVEDO_LEGAL_NAME,
    url: canonicalUrl('/'),
    description: PROVEDO_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: PROVEDO_LEGAL_NAME,
    },
  };
}

/* ────────────────────────────────────────────────────────────────────
 * SoftwareApplication schema — landing page primary product card.
 *
 * `applicationCategory: 'FinanceApplication'` matches the seo-specialist
 * recommendation (v2 §schemas). `offers` is intentionally omitted at
 * v1: pre-alpha pricing is subject to change and asserting an Offer
 * ties us to a price commitment we shouldn't surface to search bots
 * before /pricing has its real numbers locked.
 * ───────────────────────────────────────────────────────────────── */

interface SoftwareApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: 'FinanceApplication';
  operatingSystem: string;
  url: string;
  publisher: {
    '@type': 'Organization';
    name: string;
  };
}

export function buildSoftwareApplicationSchema(): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: PROVEDO_LEGAL_NAME,
    description: PROVEDO_DESCRIPTION,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: canonicalUrl('/'),
    publisher: {
      '@type': 'Organization',
      name: PROVEDO_LEGAL_NAME,
    },
  };
}

/* ────────────────────────────────────────────────────────────────────
 * BreadcrumbList schema — per-page.
 *
 * Position is 1-indexed per schema.org spec. Provedo's nav at v1 is
 * shallow (Home → page), so most pages emit a 2-item list.
 * ───────────────────────────────────────────────────────────────── */

export interface BreadcrumbItem {
  /** Display name (visible in SERP breadcrumb trail). */
  name: string;
  /** Canonical path beginning with '/'. */
  path: string;
}

interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export function buildBreadcrumbListSchema(
  items: ReadonlyArray<BreadcrumbItem>,
): BreadcrumbListSchema {
  if (items.length === 0) {
    throw new Error('buildBreadcrumbListSchema requires at least one item');
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

/* ────────────────────────────────────────────────────────────────────
 * FAQPage schema — drives FAQ-rich-result eligibility.
 *
 * Single source of truth for both visual rendering and structured-data
 * emission: the landing's FAQ section consumes the SAME array that
 * feeds this builder. One edit point per Q+A.
 * ───────────────────────────────────────────────────────────────── */

export interface FaqItem {
  question: string;
  answer: string;
}

interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export function buildFAQPageSchema(items: ReadonlyArray<FaqItem>): FAQPageSchema {
  if (items.length === 0) {
    throw new Error('buildFAQPageSchema requires at least one Q+A pair');
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

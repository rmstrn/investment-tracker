// Provedo landing-v2 — «The Ledger That Talks» (2026-04-27 redesign).
// Replaces the entire LP6 mounting (ProvedoHeroV2, ProvedoNegationSection,
// ProvedoDemoTeasersBento, ProvedoInsightsBullets, ProvedoEditorialNarrative,
// ProvedoAggregationSection, ProvedoRepeatCTAV2). The new component tree is
// purpose-built for editorial register: 6 sections + 1 modal + reused
// header/footer/FAQ.
//
// Per spec §A.4 the retired LP6 components stay in the file tree dormant —
// not deleted in this slice. Deletion is a separate cleanup once landing-v2
// is verified shipping.
//
// Per right-hand resolution #1: ProvedoFAQ is kept post-section-6 (low cost,
// useful for SEO + skeptic readers). Q1 copy revised per resolution #8.
//
// TD-091: restore Clerk auth redirect for provedo.ai migration (production cutover).

import type { Metadata } from 'next';
import { LandingAskQuestion } from './_components/LandingAskQuestion';
import { LandingClosingCTA } from './_components/LandingClosingCTA';
import { LandingCoverage } from './_components/LandingCoverage';
import { LandingDifferentiators } from './_components/LandingDifferentiators';
import { LandingEarlyAccessModal } from './_components/LandingEarlyAccessModal';
import { LandingHero } from './_components/LandingHero';
import { LandingTrustBand } from './_components/LandingTrustBand';
import { ProvedoFAQ } from './_components/ProvedoFAQ';

// SEO meta + OG — Landing-v2 spec §A.5
// og:description aligned to «answer engine for your portfolio» positioning.
export const metadata: Metadata = {
  title: "Provedo · Notice what you'd miss across all your brokers",
  description:
    'Provedo will lead you through your portfolio — across every broker, with sources for every answer. Pre-alpha. Read-only. No advice.',
  // noindex for staging deploy — remove when migrating to provedo.ai production (TD-091)
  robots: { index: false, follow: false },
  openGraph: {
    title: "Provedo · Notice what you'd miss across all your brokers",
    description:
      'Provedo is the answer engine for your portfolio — every reply cited, nothing prescribed.',
    type: 'website',
    locale: 'en_US',
    url: 'https://provedo.ai/',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Provedo · Notice what you'd miss across all your brokers",
    description: "Notice what you'd miss across all your brokers.",
  },
};

export default function MarketingHomePage() {
  // Wave 2.6 a11y CRIT-2: use a fragment, NOT <main>. The marketing layout
  // at (marketing)/layout.tsx already provides <main id="main-content">.
  // Nesting <main> inside <main> is invalid HTML.
  return (
    <>
      {/* Section 1 — «The Ledger That Talks» two-pane editorial hero */}
      <LandingHero />

      {/* Section 2 — «Ask the question you've been Googling.»
          Static printed transcript (load-bearing per content-lead §8 risk note) */}
      <LandingAskQuestion />

      {/* Section 3 — «Every account. One conversation.»
          Wordmark grid (resolution #3 — no real broker logos pre-alpha) */}
      <LandingCoverage />

      {/* Section 4 — «The things hiding between your brokers.»
          3 differentiator cards: dividend / duplicated position / drawdown */}
      <LandingDifferentiators />

      {/* Section 5 — «Read-only. No advice. No surprises.»
          Slate-900 inverted trust band */}
      <LandingTrustBand />

      {/* Section 6 — «It only takes one question.» — closing CTA */}
      <LandingClosingCTA />

      {/* FAQ kept per right-hand resolution #1 (SEO + skeptic readers).
          Q1 copy revised per resolution #8. */}
      <ProvedoFAQ />

      {/* Modal — listens for `provedo:open-early-access` window event,
          dispatched by hero CTA, closing CTA, and header «Get started». */}
      <LandingEarlyAccessModal />
    </>
  );
}

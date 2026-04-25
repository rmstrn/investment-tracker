// Provedo landing v2 — Slice-LP2
// 10-section structure per visual spec + content v2.
// TD-091: restore Clerk auth redirect for provedo.ai migration (production cutover).
// Copy verbatim from docs/content/landing-provedo-v2.md across all sections.

import type { Metadata } from 'next';
import { ProvedoAggregationSection } from './_components/ProvedoAggregationSection';
import { ProvedoDemoTabsV2 } from './_components/ProvedoDemoTabsV2';
import { ProvedoEditorialNarrative } from './_components/ProvedoEditorialNarrative';
import { ProvedoFAQ } from './_components/ProvedoFAQ';
import { ProvedoHeroV2 } from './_components/ProvedoHeroV2';
import { ProvedoInsightsBullets } from './_components/ProvedoInsightsBullets';
import { ProvedoNegationSection } from './_components/ProvedoNegationSection';
import { ProvedoNumericProofBar } from './_components/ProvedoNumericProofBar';
import { ProvedoRepeatCTAV2 } from './_components/ProvedoRepeatCTAV2';
import { ProvedoTestimonialCards } from './_components/ProvedoTestimonialCards';

// SEO meta + OG — verbatim from content v2 §S12.
// og:description updated: drops trial mention (matches v2 dual-CTA collapse).
export const metadata: Metadata = {
  title: "Provedo · Notice what you'd miss across all your brokers",
  description:
    'Provedo holds your portfolio across every broker — answers your questions, surfaces what would slip past, shows you patterns in your past trades. With sources.',
  // noindex for staging deploy — remove when migrating to provedo.ai production (TD-091)
  robots: { index: false, follow: false },
  openGraph: {
    title: "Provedo · Notice what you'd miss across all your brokers",
    description:
      'Provedo will lead you through your portfolio — across every broker, with sources. Free forever, no card.',
    type: 'website',
    locale: 'en_US',
    url: 'https://memoro.co/',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Provedo · Notice what you'd miss across all your brokers",
    description:
      'Provedo will lead you through your portfolio — across every broker, with sources.',
  },
};

export default function MarketingHomePage() {
  return (
    <main>
      {/* S1 — Hero (stacked 3-mockup, dual CTA) */}
      <ProvedoHeroV2 />

      {/* S2 — Numeric proof bar
          TD-095 (P3): swap coverage="100s" → coverage="1000+" once tech-lead
          verifies SnapTrade + Plaid + CCXT broker coverage count */}
      <ProvedoNumericProofBar coverage="100s" />

      {/* S3 — Problem-negation positioning («This is what Provedo is not.») */}
      <ProvedoNegationSection />

      {/* S4 — Demo tabs with real inline SVG charts */}
      <ProvedoDemoTabsV2 />

      {/* S5 — Insights proof bullets (white elevated bg) */}
      <ProvedoInsightsBullets />

      {/* S6 — Editorial mid-page narrative (dark slate-900 full-bleed) */}
      <ProvedoEditorialNarrative />

      {/* S7 — Pre-alpha testimonials («Coming Q2 2026» builder quotes) */}
      <ProvedoTestimonialCards />

      {/* S8 — Aggregation marquee (broker logos)
          Using fallback copy «Hundreds of brokers» — same TD-095 trigger */}
      <ProvedoAggregationSection />

      {/* S9 — FAQ — 6 Q&A (includes trial CTA info moved from hero)
          TD-096 (P3): FAQ Q4 Plus price «$X/month» placeholder — update when
          finance-advisor confirms Plus tier price */}
      <ProvedoFAQ />

      {/* S10 — Pre-footer editorial CTA (dark slate-900 full-bleed, visual rhyme with S6) */}
      <ProvedoRepeatCTAV2 />

      {/* Footer rendered by (marketing)/layout.tsx */}
    </main>
  );
}

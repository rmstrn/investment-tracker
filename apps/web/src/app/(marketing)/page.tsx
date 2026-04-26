// Provedo landing — Slice-LP6 fresh-eyes 7-gap addressing (5 outside specialists).
// 10-section structure now minus S2 (proof bar collapsed into hero microline)
// and minus S7 testimonials (Slice-LP5-A PO directive). 8 active sections.
// TD-091: restore Clerk auth redirect for provedo.ai migration (production cutover).

import type { Metadata } from 'next';
import { ProvedoAggregationSection } from './_components/ProvedoAggregationSection';
import { ProvedoDemoTeasersBento } from './_components/ProvedoDemoTeasersBento';
import { ProvedoEditorialNarrative } from './_components/ProvedoEditorialNarrative';
import { ProvedoFAQ } from './_components/ProvedoFAQ';
import { ProvedoHeroV2 } from './_components/ProvedoHeroV2';
import { ProvedoInsightsBullets } from './_components/ProvedoInsightsBullets';
import { ProvedoNegationSection } from './_components/ProvedoNegationSection';
import { ProvedoRepeatCTAV2 } from './_components/ProvedoRepeatCTAV2';

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
      'Provedo will lead you through your portfolio — across every broker, with sources. Free tier, no card.',
    type: 'website',
    locale: 'en_US',
    url: 'https://provedo.ai/',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Provedo · Notice what you'd miss across all your brokers",
    description:
      'Provedo will lead you through your portfolio — across every broker, with sources.',
  },
};

export default function MarketingHomePage() {
  // Wave 2.6 a11y CRIT-2: use a fragment, NOT <main>. The marketing layout
  // at (marketing)/layout.tsx already provides <main id="main-content">.
  // Nesting <main> inside <main> is invalid HTML and creates two landmarks
  // of the same role, breaking SR landmark navigation
  // (WCAG 1.3.1 Info and Relationships A + 4.1.2 Name, Role, Value A).
  return (
    <>
      {/* S1 — Picture-first hero (Slice-LP5-A §K.1 + Slice-LP6 §gaps 1+2+3+5a)
          Atmosphere layer (radial gradients + bespoke synthesis-glyph SVG)
          + ChatAppShell-wrapped chat surface (no inline chart in bubble) +
          new ChatPromptPicker (4 chips, in-place replay). Slice-LP6 adds:
          (#1) category-tell eyebrow above H1, (#2) chip picker below chat
          driving CTA scroll target, (#3) mono microline replacing S2 proof
          bar, (#5a) read-only trust line above CTA cluster. */}
      <ProvedoHeroV2 />

      {/* S2 — UNMOUNTED in Slice-LP6 §gap-3 (PD + content reviews convergent:
          proof bar had 3/4 cells that were words, only 1 figure — decoration
          pretending to be substance). The single mono microline now sits
          under the hero CTA cluster (`Every major broker · Cited per answer`
          — Slice-LP6.1 dropped the leading «Read-only · » token to keep the
          italic trust line above the CTA as the single hero read-only
          mention). The component file `ProvedoNumericProofBar.tsx` stays in
          the codebase dormant for potential later restore once verified
          metrics are available (TD-095 ties broker count). */}

      {/* S3 — Problem-negation 2-card asymmetric table (Slice-LP5-BCD A1)
          Restored 2-card comparison table per PD spec §C.S3. The redundant
          h2 «This is what Provedo is not.» and the «Provedo» word eyebrow
          are dropped (PO 2026-04-27 «дважды дублируем» / «зачем перед
          этим текстом Provedo»). New eyebrow: neutral «POSITIONING». */}
      <ProvedoNegationSection />

      {/* S4 — Demo teasers bento (Slice-LP5-A §K.2)
          Replaces ProvedoDemoTabsV2's 4-tab ProductTabBar with two side-by-
          side bento teaser cards (Why? + Aggregate). Both reuse the same
          ChatAppShell chrome from §S1. ProvedoDemoTabsV2 + chart components
          (DividendCalendarAnimated, TradeTimelineAnimated, AllocationPieBar
          Animated) stay in the codebase dormant for possible reuse on a
          future expanded-demo route — see PD §K.3 for disposition. */}
      <ProvedoDemoTeasersBento />

      {/* S5 — Insights proof bullets (white elevated bg) */}
      <ProvedoInsightsBullets />

      {/* S6 — Editorial mid-page narrative (dark slate-900 full-bleed) */}
      <ProvedoEditorialNarrative />

      {/* S7 — Pre-alpha testimonials — UNMOUNTED (Slice-LP5-A PO directive)
          Component file ProvedoTestimonialCards.tsx stays in codebase but is
          no longer rendered on the landing. Section pre-loads social-proof
          expectations the product cannot back; PD §S7 recommendation HIDE
          accepted by PO 2026-04-27. */}

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
    </>
  );
}

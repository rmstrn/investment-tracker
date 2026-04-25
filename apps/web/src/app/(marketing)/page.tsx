// Provedo first-pass landing — Slice-LP1
// Clerk auth() removed for first-pass deploy compatibility (staging-only static render).
// TD-091: restore Clerk redirect on landing for provedo.ai migration (production cutover).
// Copy verbatim from docs/content/landing-provedo-v1.md v2 across all sections.

import type { Metadata } from 'next';
import { ProvedoAggregationSection } from './_components/ProvedoAggregationSection';
import { ProvedoDemoTabs } from './_components/ProvedoDemoTabs';
import { ProvedoHero } from './_components/ProvedoHero';
import { ProvedoInsightsSection } from './_components/ProvedoInsightsSection';
import { ProvedoRepeatCTA } from './_components/ProvedoRepeatCTA';

// SEO meta + OG — verbatim from §7 content v2.
// og:url uses staging deploy target (memoro.co) for first-pass per kickoff §2.3.
export const metadata: Metadata = {
  title: "Provedo · Notice what you'd miss across all your brokers",
  description:
    'Provedo holds your portfolio across every broker — answers your questions, surfaces what would slip past, shows you patterns in your past trades. With sources.',
  // noindex for staging deploy — remove when migrating to provedo.ai production
  robots: { index: false, follow: false },
  openGraph: {
    title: "Provedo · Notice what you'd miss across all your brokers",
    description:
      'Provedo will lead you through your portfolio — across every broker, with sources. Free forever, or try Plus 14 days.',
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
    <>
      <ProvedoHero />
      <ProvedoDemoTabs />
      <ProvedoInsightsSection />
      <ProvedoAggregationSection />
      <ProvedoRepeatCTA />
    </>
  );
}

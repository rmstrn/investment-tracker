import type { Metadata } from 'next';
import { AuthAwarePricingTable } from './_components/AuthAwarePricingTable';

export const metadata: Metadata = {
  title: 'Pricing — Provedo',
  description:
    'Simple pricing. Free forever for basic tracking. Paid tiers unlock deeper AI and tax reports.',
  alternates: { canonical: '/pricing' },
};

// Static generation — the pricing surface itself is identical for every
// visitor; the per-user «current plan» badge is a client-side
// personalization handled inside <AuthAwarePricingTable/>.
export const dynamic = 'force-static';

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          Simple pricing. Honest limits.
        </h1>
        <p className="mt-4 text-base text-text-secondary md:text-lg">
          Free forever for basic tracking. Upgrade when the AI and insights earn it.
        </p>
      </header>
      <div className="mt-14 md:mt-20">
        <AuthAwarePricingTable />
      </div>
      <p className="mt-10 text-center text-xs text-text-tertiary">
        Prices in USD. Taxes calculated at checkout.
      </p>
    </div>
  );
}

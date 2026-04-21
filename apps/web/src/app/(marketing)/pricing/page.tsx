import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import type { PlanTier } from './_components/PricingTable';
import { PricingTable } from './_components/PricingTable';

export const metadata: Metadata = {
  title: 'Pricing — Investment Tracker',
  description:
    'Simple pricing. Free forever for basic tracking. Paid tiers unlock deeper AI and tax reports.',
};

function isPlanTier(value: unknown): value is PlanTier {
  return value === 'free' || value === 'plus' || value === 'pro';
}

export default async function PricingPage() {
  const { userId, sessionClaims } = await auth();

  let currentPlan: PlanTier | undefined;
  if (userId) {
    const meta = (sessionClaims?.publicMetadata ?? {}) as { tier?: unknown };
    currentPlan = isPlanTier(meta.tier) ? meta.tier : 'free';
  }

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
        <PricingTable currentPlan={currentPlan} />
      </div>
      <p className="mt-10 text-center text-xs text-text-tertiary">
        Prices in USD. Taxes calculated at checkout.
      </p>
    </div>
  );
}

'use client';

import { Badge, Button, Card } from '@investment-tracker/ui';
import { Check } from 'lucide-react';
import Link from 'next/link';

export type PlanTier = 'free' | 'plus' | 'pro';

interface Tier {
  id: PlanTier;
  name: string;
  price: string;
  priceSuffix: string;
  tagline: string;
  highlight?: boolean;
}

const TIERS: ReadonlyArray<Tier> = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceSuffix: '',
    tagline: 'Track a couple of accounts and try the AI.',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$8',
    priceSuffix: '/mo',
    tagline: 'For serious tracking — full history, daily insights.',
    highlight: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$20',
    priceSuffix: '/mo',
    tagline: 'Tax reports, advanced analytics, API access.',
  },
];

interface FeatureRow {
  label: string;
  values: Record<PlanTier, string>;
}

const FEATURES: ReadonlyArray<FeatureRow> = [
  {
    label: 'Connected accounts',
    values: { free: '2', plus: '10', pro: 'Unlimited' },
  },
  {
    label: 'AI messages per day',
    values: { free: '5', plus: '100', pro: 'Unlimited' },
  },
  {
    label: 'Proactive insights',
    values: { free: 'Weekly', plus: 'Daily', pro: 'Real-time' },
  },
  {
    label: 'Tax reports',
    values: { free: '—', plus: '—', pro: 'US + DE' },
  },
  {
    label: 'API access',
    values: { free: '—', plus: '—', pro: 'Included' },
  },
];

export interface PricingTableProps {
  currentPlan?: PlanTier;
}

export function PricingTable({ currentPlan }: PricingTableProps) {
  function handleSubscribe(tier: PlanTier) {
    // Stripe wiring lands in Slice 7c (TD-057); stub surfaces the click for smoke-tests.
    console.info('TODO: Stripe checkout', tier);
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {TIERS.map((tier) => (
        <Card
          key={tier.id}
          variant="default"
          className={
            tier.highlight ? 'relative ring-2 ring-brand-500 md:-translate-y-2' : 'relative'
          }
        >
          {tier.highlight ? (
            <Badge tone="brand" className="absolute -top-3 left-1/2 -translate-x-1/2">
              Most popular
            </Badge>
          ) : null}

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">{tier.name}</h2>
            <p className="mt-1 min-h-[2.5rem] text-sm text-text-secondary">{tier.tagline}</p>

            <p className="mt-5 tabular-nums">
              <span className="text-4xl font-semibold text-text-primary">{tier.price}</span>
              <span className="ml-1 text-sm text-text-secondary">{tier.priceSuffix}</span>
            </p>

            <div className="mt-6">
              <TierCta tier={tier.id} currentPlan={currentPlan} onSubscribe={handleSubscribe} />
            </div>

            <ul className="mt-6 space-y-3 border-t border-border-subtle pt-6">
              {FEATURES.map((f) => (
                <li key={f.label} className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-text-secondary">{f.label}</span>
                  <span className="text-right font-medium text-text-primary tabular-nums">
                    {f.values[tier.id]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface TierCtaProps {
  tier: PlanTier;
  currentPlan?: PlanTier;
  onSubscribe: (tier: PlanTier) => void;
}

function TierCta({ tier, currentPlan, onSubscribe }: TierCtaProps) {
  if (currentPlan === tier) {
    return (
      <Badge
        tone="neutral"
        className="flex w-full justify-center gap-1.5 border-border-default py-1.5 text-sm"
      >
        <Check size={14} aria-hidden="true" />
        Current plan
      </Badge>
    );
  }

  if (tier === 'free') {
    return (
      <Link href="/sign-up" className="block">
        <Button variant="outline" size="md" className="w-full">
          Get started
        </Button>
      </Link>
    );
  }

  return (
    <Button variant="primary" size="md" className="w-full" onClick={() => onSubscribe(tier)}>
      Subscribe
    </Button>
  );
}

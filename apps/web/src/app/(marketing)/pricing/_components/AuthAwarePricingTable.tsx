'use client';

import { useUser } from '@clerk/nextjs';
import type { PlanTier } from './PricingTable';
import { PricingTable } from './PricingTable';

function isPlanTier(value: unknown): value is PlanTier {
  return value === 'free' || value === 'plus' || value === 'pro';
}

/**
 * Client-side wrapper that reads the signed-in user's plan tier from
 * Clerk's `publicMetadata` and forwards it to `<PricingTable/>` so the
 * matching tier renders «Current plan».
 *
 * Lifted out of the server page (`pricing/page.tsx`) so the page itself
 * can render statically — the per-user «current plan» badge is a small
 * personalization that costs zero SEO + zero FCP for anonymous traffic
 * (the dominant audience on /pricing).
 *
 * While Clerk loads (`isLoaded === false`), the table renders without a
 * highlighted current plan; that matches the anonymous default and
 * avoids a layout shift.
 */
export function AuthAwarePricingTable() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <PricingTable />;
  }

  const meta = (user.publicMetadata ?? {}) as { tier?: unknown };
  const currentPlan: PlanTier = isPlanTier(meta.tier) ? meta.tier : 'free';

  return <PricingTable currentPlan={currentPlan} />;
}

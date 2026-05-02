'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import {
  HERO_PRIMARY_CTA,
  HERO_PRIMARY_CTA_AUTHED,
  HERO_SECONDARY_CTA,
} from '../_lib/landing-copy';

/**
 * HeroCTA — the only client island on the landing.
 *
 * Per architect ADR-3 (D1_LANDING_ARCHITECTURE.md): isolate auth-state
 * boundary in a leaf client component so the rest of the landing stays
 * fully static (eligible for `force-static` + edge cache).
 *
 * - SignedOut → primary CTA goes to `/sign-up` (Clerk-credible verb).
 * - SignedIn  → primary CTA goes to `/dashboard` (familiar return path).
 * - Secondary CTA is an in-page anchor to the AI sample row (#sample),
 *   surfaced for both auth states.
 *
 * Trade-off: ~50-100ms «sign-in flash» as Clerk's session cookie hydrates;
 * acceptable per PO perf-budget priority. NO `useRouter().replace()`
 * post-auth redirect — landing belongs equally to signed-in users (link
 * sharing, comparing plans), so sticking on `/` is the correct default.
 */
export function HeroCTA() {
  return (
    <div className="landing-hero__cta-row">
      <SignedOut>
        <Link href="/sign-up" className="landing-cta landing-cta--primary">
          {HERO_PRIMARY_CTA}
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard" className="landing-cta landing-cta--primary">
          {HERO_PRIMARY_CTA_AUTHED}
        </Link>
      </SignedIn>
      <Link href="#sample" className="landing-cta landing-cta--secondary">
        {HERO_SECONDARY_CTA}
      </Link>
    </div>
  );
}

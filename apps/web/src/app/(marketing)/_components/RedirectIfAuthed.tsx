'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Client-side redirect for authenticated users on the landing page.
 *
 * The marketing landing renders as a static page (no SSR auth probe),
 * so authed users see the landing for a brief moment before this island
 * mounts and redirects them to /dashboard. The flash is acceptable —
 * static landing buys us SEO + sub-100ms FCP for anonymous traffic
 * (the dominant audience on /).
 *
 * For users who explicitly want the marketing page (e.g. linking it,
 * comparing plans), the `MarketingHeader` already exposes a Dashboard
 * affordance; this redirect targets the implicit «I'm signed in, take
 * me home» case.
 */
export function RedirectIfAuthed() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
}

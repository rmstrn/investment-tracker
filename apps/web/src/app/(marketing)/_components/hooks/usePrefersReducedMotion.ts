'use client';

// usePrefersReducedMotion — reads prefers-reduced-motion media query
// Returns true when user has requested reduced motion
// All animated components use this to skip animations entirely
// SSR-safe: defaults to false on server (animations disabled until hydration)
//
// On the client, the initial state is sourced synchronously from
// `window.matchMedia` so that a reduced-motion user sees the final state on
// first paint (no animation flash before the effect fires). Falls back to
// false during SSR.

import { useEffect, useState } from 'react';

function readInitialPreference(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
  } catch {
    return false;
  }
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(readInitialPreference);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

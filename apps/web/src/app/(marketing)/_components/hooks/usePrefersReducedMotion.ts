'use client';

// usePrefersReducedMotion — reads prefers-reduced-motion media query
// Returns true when user has requested reduced motion
// All animated components use this to skip animations entirely
// SSR-safe: defaults to false on server (animations disabled until hydration)

import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

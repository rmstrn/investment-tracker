'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe `prefers-reduced-motion` hook. Returns `false` during SSR + initial
 * mount, then subscribes to the media query and updates if the user toggles
 * the OS preference at runtime.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const onChange = (e: MediaQueryListEvent): void => {
      setPrefersReducedMotion(e.matches);
    };

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    // Safari < 14 fallback
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return prefersReducedMotion;
}

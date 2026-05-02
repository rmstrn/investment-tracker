'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe «reduced motion» hook. Returns `true` if EITHER:
 *
 *   1. OS-level `(prefers-reduced-motion: reduce)` media query matches, OR
 *   2. `documentElement.dataset.reducedMotion === 'true'` — the design-system
 *      showcase header writes this for users who can't change OS-level
 *      preference (D4 — DonutChartV2 hover + entrance kickoff).
 *
 * Returns `false` during SSR + initial render; the effect re-syncs after the
 * first paint and subscribes to both the media-query and a `MutationObserver`
 * watching `<html>`'s `data-reduced-motion` attribute.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

    const readShowcaseOverride = (): boolean => {
      if (typeof document === 'undefined') return false;
      return document.documentElement.dataset.reducedMotion === 'true';
    };

    const recompute = (): void => {
      setPrefersReducedMotion(mql.matches || readShowcaseOverride());
    };

    recompute();

    const onMqlChange = (): void => recompute();

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onMqlChange);
    } else {
      // Safari < 14 fallback
      mql.addListener(onMqlChange);
    }

    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
      observer = new MutationObserver(recompute);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-reduced-motion'],
      });
    }

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', onMqlChange);
      } else {
        mql.removeListener(onMqlChange);
      }
      observer?.disconnect();
    };
  }, []);

  return prefersReducedMotion;
}

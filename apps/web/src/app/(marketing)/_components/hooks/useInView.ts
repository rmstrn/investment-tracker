'use client';

// useInView — shared IntersectionObserver hook for scroll-triggered animations
// Used by all animated sections in v3: charts, proof bar, negation, hero typing
// Fires once (triggerOnce=true by default) — no re-trigger on scroll-up
// prefers-reduced-motion: caller checks this hook's return value to skip animation

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** Intersection threshold (0–1). Default: 0.2 */
  threshold?: number;
  /** Root margin. Default: '0px 0px -40px 0px' (slight bottom offset) */
  rootMargin?: string;
  /** Once true, won't reset to false. Default: true */
  triggerOnce?: boolean;
}

interface UseInViewReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  inView: boolean;
}

export function useInView({
  threshold = 0.2,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true,
}: UseInViewOptions = {}): UseInViewReturn {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(el);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView };
}

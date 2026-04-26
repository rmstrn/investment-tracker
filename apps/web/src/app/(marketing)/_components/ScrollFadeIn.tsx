'use client';

// ScrollFadeIn — reusable scroll-into-view fade-in wrapper (v3)
// Animates: translateY(20px)→0 + opacity 0→1 on IntersectionObserver trigger
// Respects prefers-reduced-motion: reduce (skips animation, shows content immediately)
// Used by: all sections in v3 landing for general motion polish (V3.5)
//
// Wave 2.6 a11y HIGH-2: progressive enhancement — content is rendered visible
// from SSR (opacity 1, no transform) so no-JS users + the early hydration
// phase see real content. The fade-in animation only runs once the client has
// mounted AND motion is enabled. This prevents large sections of the page
// from being invisible to crawlers + AT users + first-paint observers.

import { useEffect, useState } from 'react';
import { useInView } from './hooks/useInView';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

interface ScrollFadeInProps {
  children: React.ReactNode;
  /** Animation delay in ms. Default: 0 */
  delay?: number;
  /** Animation duration in ms. Default: 600 */
  duration?: number;
  /** Additional class names for the wrapper div */
  className?: string;
}

export function ScrollFadeIn({
  children,
  delay = 0,
  duration = 600,
  className,
}: ScrollFadeInProps): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const prefersReduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default (SSR + no-JS + reduced-motion + post-trigger): visible. Only when
  // JS hydrates AND motion is enabled AND not yet in view do we apply the
  // initial offset+transparent state from which the fade-in plays.
  const isAnimatingIn = mounted && !prefersReduced && !inView;

  const style: React.CSSProperties = isAnimatingIn
    ? {
        opacity: 0,
        transform: 'translateY(20px)',
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }
    : prefersReduced
      ? {}
      : {
          opacity: 1,
          transform: 'translateY(0)',
          transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

'use client';

// ScrollFadeIn — reusable scroll-into-view fade-in wrapper (v3)
// Animates: translateY(20px)→0 + opacity 0→1 on IntersectionObserver trigger
// Respects prefers-reduced-motion: reduce (skips animation, shows content immediately)
// Used by: all sections in v3 landing for general motion polish (V3.5)

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

  const style: React.CSSProperties = prefersReduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

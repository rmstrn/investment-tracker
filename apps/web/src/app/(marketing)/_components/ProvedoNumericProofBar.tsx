'use client';

// ProvedoNumericProofBar — §S2 numeric proof bar (v3)
// V3.4: count-up animation on scroll-into-view
// Patch A: cell #3 swapped from «$0/month / free forever» → «100% / Lane A — information not advice»
//          cell #1: «100s of brokers and exchanges» (pre-verification fallback)
//          cell #2: «Every observation cited»
// Accessibility: <section><dl><dt><dd>, AAA contrast verified
// TD-095: swap coverage="100s" → coverage="1000+" once tech-lead verifies coverage

import { useEffect, useRef, useState } from 'react';
import { useInView } from './hooks/useInView';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

interface ProvedoNumericProofBarProps {
  /** Broker count copy — '100s' (fallback) or '1000+' (post-verification) */
  coverage?: '100s' | '1000+';
}

interface AnimatedNumberProps {
  target: number;
  suffix?: string;
  prefix?: string;
  animate: boolean;
  prefersReduced: boolean;
  duration?: number;
}

function AnimatedNumber({
  target,
  suffix = '',
  prefix = '',
  animate,
  prefersReduced,
  duration = 1000,
}: AnimatedNumberProps): React.ReactElement {
  const [value, setValue] = useState(prefersReduced ? target : 0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animate) return;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    startRef.current = null;

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, target, duration, prefersReduced]);

  return (
    <span>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export function ProvedoNumericProofBar({
  coverage = '100s',
}: ProvedoNumericProofBarProps): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      aria-label="Proof points"
      style={{
        backgroundColor: 'var(--provedo-bg-muted)',
        borderTop: '1px solid var(--provedo-border-subtle)',
        borderBottom: '1px solid var(--provedo-border-subtle)',
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <dl
          className="flex flex-col divide-y md:flex-row md:divide-x md:divide-y-0"
          style={{ '--tw-divide-color': 'var(--provedo-border-subtle)' } as React.CSSProperties}
        >
          {/* Cell 1 — Broker coverage (Patch A) */}
          <div className="flex flex-col items-center py-8 text-center first:pt-0 last:pb-0 md:flex-1 md:px-8 md:py-0 md:first:pt-0 md:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{
                fontFamily: 'var(--provedo-font-mono)',
                fontWeight: 500,
                fontSize: 'clamp(2.5rem, 1.8rem + 2vw, 3.5rem)',
                color: 'var(--provedo-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '8px',
              }}
            >
              {coverage === '100s' ? '100s' : '1000+'}
            </dd>
            <dt
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 500,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--provedo-text-secondary)',
                marginBottom: '4px',
              }}
            >
              brokers and exchanges
            </dt>
            <dd
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 400,
                fontSize: '13px',
                color: 'var(--provedo-text-muted)',
              }}
            >
              {coverage === '100s' ? 'every major one' : 'in one place'}
            </dd>
          </div>

          {/* Cell 2 — Every observation cited */}
          <div className="flex flex-col items-center py-8 text-center first:pt-0 last:pb-0 md:flex-1 md:px-8 md:py-0 md:first:pt-0 md:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{
                fontFamily: 'var(--provedo-font-mono)',
                fontWeight: 500,
                fontSize: 'clamp(2.5rem, 1.8rem + 2vw, 3.5rem)',
                color: 'var(--provedo-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '8px',
                opacity: inView || prefersReduced ? 1 : 0,
                transition: prefersReduced ? 'none' : 'opacity 400ms ease 200ms',
              }}
            >
              Every
            </dd>
            <dt
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 500,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--provedo-text-secondary)',
                marginBottom: '4px',
              }}
            >
              observation cited
            </dt>
            <dd
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 400,
                fontSize: '13px',
                color: 'var(--provedo-text-muted)',
              }}
            >
              with sources inline
            </dd>
          </div>

          {/* Cell 3 — Lane A: 100% information, not advice (Patch A) */}
          <div className="flex flex-col items-center py-8 text-center first:pt-0 last:pb-0 md:flex-1 md:px-8 md:py-0 md:first:pt-0 md:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{
                fontFamily: 'var(--provedo-font-mono)',
                fontWeight: 500,
                fontSize: 'clamp(2.5rem, 1.8rem + 2vw, 3.5rem)',
                color: 'var(--provedo-accent)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '8px',
              }}
            >
              <AnimatedNumber
                target={100}
                suffix="%"
                animate={inView}
                prefersReduced={prefersReduced}
                duration={1000}
              />
            </dd>
            <dt
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 500,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--provedo-text-secondary)',
                marginBottom: '4px',
              }}
            >
              Lane A — information not advice
            </dt>
            <dd
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 400,
                fontSize: '13px',
                color: 'var(--provedo-text-muted)',
              }}
            >
              no robo-advisor, no brokerage
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

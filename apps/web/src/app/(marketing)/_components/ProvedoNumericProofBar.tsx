'use client';

// ProvedoNumericProofBar — §S2 numeric proof bar (v3.2)
// V3.4: count-up animation on scroll-into-view
// V3.2 patches:
//   - 4-cell layout (was 3) — adds time-anchor cell #3 «5 min / a week / the whole habit»
//   - Cell #4 eyebrow «Lane A — information not advice» → «information not advice» (PD spec)
//   - Audience-whisper micro-line below cells: «For investors who hold across more than one broker.»
//   - max-w-4xl → max-w-5xl for 4-cell breathing room (PD spec)
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

// Per-breakpoint big-number font-size clamp (PD spec V1, slightly tighter for 4-cell layout)
const BIG_NUMBER_CLAMP = 'clamp(2.25rem, 1.6rem + 1.6vw, 3.25rem)';

// Shared cell typography (PD spec V1)
const CELL_BIG_STYLE: React.CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: BIG_NUMBER_CLAMP,
  letterSpacing: '-0.02em',
  lineHeight: 1,
  marginBottom: '8px',
};

const CELL_EYEBROW_STYLE: React.CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 500,
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--provedo-text-secondary)',
  marginBottom: '4px',
};

const CELL_SUB_STYLE: React.CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '13px',
  color: 'var(--provedo-text-muted)',
};

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
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <dl
          className="flex flex-col divide-y lg:flex-row lg:divide-x lg:divide-y-0"
          style={
            {
              '--tw-divide-color': 'var(--provedo-border-subtle)',
            } as React.CSSProperties
          }
        >
          {/* Cell 1 — Broker coverage */}
          <div className="flex flex-col items-center px-2 py-8 text-center first:pt-0 last:pb-0 lg:flex-1 lg:px-6 lg:py-0 lg:first:pt-0 lg:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-text-primary)' }}
            >
              {coverage === '100s' ? '100s' : '1000+'}
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>brokers and exchanges</dt>
            <dd style={CELL_SUB_STYLE}>
              {coverage === '100s' ? 'every major one' : 'in one place'}
            </dd>
          </div>

          {/* Cell 2 — Every observation cited */}
          <div className="flex flex-col items-center px-2 py-8 text-center first:pt-0 last:pb-0 lg:flex-1 lg:px-6 lg:py-0 lg:first:pt-0 lg:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{
                ...CELL_BIG_STYLE,
                color: 'var(--provedo-text-primary)',
                opacity: inView || prefersReduced ? 1 : 0,
                transition: prefersReduced ? 'none' : 'opacity 400ms ease 200ms',
              }}
            >
              Every
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>observation cited</dt>
            <dd style={CELL_SUB_STYLE}>with sources inline</dd>
          </div>

          {/* Cell 3 — Time anchor «5 min / a week» (v3.2 NEW)
              Static token, no count-up (PD spec — count-up reads gimmicky on time-anchor) */}
          <div className="flex flex-col items-center px-2 py-8 text-center first:pt-0 last:pb-0 lg:flex-1 lg:px-6 lg:py-0 lg:first:pt-0 lg:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{
                ...CELL_BIG_STYLE,
                color: 'var(--provedo-text-primary)',
                opacity: inView || prefersReduced ? 1 : 0,
                transition: prefersReduced ? 'none' : 'opacity 400ms ease 200ms',
              }}
            >
              5 min
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>a week</dt>
            <dd style={CELL_SUB_STYLE}>the whole habit</dd>
          </div>

          {/* Cell 4 — Information, not advice (Patch A — v3.2: «Lane A —» prefix dropped) */}
          <div className="flex flex-col items-center px-2 py-8 text-center first:pt-0 last:pb-0 lg:flex-1 lg:px-6 lg:py-0 lg:first:pt-0 lg:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-accent)' }}
            >
              <AnimatedNumber
                target={100}
                suffix="%"
                animate={inView}
                prefersReduced={prefersReduced}
                duration={1000}
              />
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>information not advice</dt>
            <dd style={CELL_SUB_STYLE}>no robo-advisor, no brokerage</dd>
          </div>
        </dl>

        {/* Audience-whisper — v3.2 (PD spec V2: proof-bar small-print placement) */}
        <p
          className="mx-auto mt-8 px-4 text-center md:mt-8"
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: 1.55,
            color: 'var(--provedo-text-tertiary)',
            maxWidth: '480px',
          }}
        >
          For investors who hold across more than one broker.
        </p>
      </div>
    </section>
  );
}

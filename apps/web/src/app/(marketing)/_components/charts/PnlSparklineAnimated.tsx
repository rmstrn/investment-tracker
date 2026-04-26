'use client';

// PnlSparklineAnimated — Tab 1 «Why?» animated SVG chart (v3 → Slice-LP3.3)
// Animation: stroke-dashoffset line draw on IntersectionObserver trigger
// Slice-LP3.3 chart upgrade Proposal B:
//   - Line stroke promoted from slate-700 1.5px → brand teal 2px
//   - Filled-area gradient teal at 12% opacity (was border-subtle ramp)
//   - End label lifted to 20pt JBM-mono (the headline number on this chart)
//   - Motion budget compressed to 600ms total entrance (was 2.6s)
//     · 0–500ms: line draw
//     · 500–700ms: dots + emphasis labels appear together
//     · 600–900ms: end-label fade-in (overlaps tail of dot reveal)
// Fallback: prefers-reduced-motion → static (no animation, same visual)
// Accessibility: role="img" + descriptive aria-label (WCAG 2.2 AA)

import { useEffect, useId, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// 30-day P&L path — viewBox 0 0 280 120
// y=28 baseline (0%), y=100 bottom (~-5%)
const LINE_POINTS =
  '0,28 10,30 19,26 29,24 38,28 48,30 58,28 67,36 77,52 86,64 96,68 106,66 115,60 125,56 134,52 144,54 154,64 163,76 173,88 182,92 192,88 202,84 211,82 221,80 230,80 240,78 250,80 259,82 269,82 279,82';

// Approximate total path length for a polyline with these points
// Calculated: sum of segment distances ≈ 470px
const PATH_LENGTH = 470;

type AnimPhase = 'idle' | 'drawing' | 'emphasis' | 'done';

export function PnlSparklineAnimated(): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const prefersReduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<AnimPhase>('idle');
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const gradientId = useId();

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setPhase('done');
      return;
    }

    // Compressed sequence — 600ms total entrance budget per Slice-LP3.3 audit:
    // drawing (0ms, 500ms transition) → emphasis (500ms) → done (600ms)
    setPhase('drawing');

    const t1 = setTimeout(() => setPhase('emphasis'), 500);
    const t2 = setTimeout(() => setPhase('done'), 600);
    timerRefs.current = [t1, t2];

    return () => timerRefs.current.forEach(clearTimeout);
  }, [inView, prefersReduced]);

  const showEmphasis = phase === 'emphasis' || phase === 'done';
  const showLabel = phase === 'emphasis' || phase === 'done';

  return (
    <div ref={ref} style={{ marginTop: '12px' }}>
      <svg
        viewBox="0 0 280 120"
        width="100%"
        height="120"
        role="img"
        aria-label="Monthly P&L line chart: portfolio down 4.2%, with AAPL drop on day 8 and TSLA drop on day 19"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            {/* Brand teal at 12% opacity — Slice-LP3.3 §A */}
            <stop offset="0%" stopColor="var(--provedo-accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--provedo-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 0% baseline dashed */}
        <line
          x1="0"
          y1="28"
          x2="280"
          y2="28"
          stroke="var(--provedo-border-subtle)"
          strokeWidth="1"
          strokeDasharray="2,3"
        />

        {/* Gradient fill — fades in alongside the line draw, so it tracks the
            line's progress visually rather than popping in after */}
        <polyline
          fill={`url(#${gradientId})`}
          stroke="none"
          points={`0,120 ${LINE_POINTS} 279,120`}
          style={{
            opacity: phase === 'idle' && !prefersReduced ? 0 : 1,
            transition: prefersReduced ? 'none' : 'opacity 500ms ease',
          }}
        />

        {/* Animated P&L line — brand teal 2px (was slate-700 1.5px) */}
        <polyline
          fill="none"
          stroke="var(--provedo-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={LINE_POINTS}
          style={
            prefersReduced
              ? {}
              : {
                  strokeDasharray: PATH_LENGTH,
                  strokeDashoffset: phase === 'idle' ? PATH_LENGTH : 0,
                  transition:
                    phase === 'drawing'
                      ? 'stroke-dashoffset 500ms cubic-bezier(0.16,1,0.3,1)'
                      : 'none',
                }
          }
        />

        {/* AAPL emphasis dot — appears together with TSLA at the end of line draw */}
        <circle
          cx="77"
          cy="52"
          r="4"
          fill="var(--provedo-negative)"
          style={{
            opacity: showEmphasis || prefersReduced ? 1 : 0,
            transform: showEmphasis || prefersReduced ? 'scale(1)' : 'scale(0)',
            transformOrigin: '77px 52px',
            transition: prefersReduced
              ? 'none'
              : 'opacity 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
        <text
          x="77"
          y="44"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
          textAnchor="middle"
          fontWeight="500"
          style={{
            opacity: showEmphasis || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 200ms ease',
          }}
        >
          AAPL
        </text>

        {/* TSLA emphasis dot — same trigger as AAPL (no stagger) */}
        <circle
          cx="182"
          cy="92"
          r="4"
          fill="var(--provedo-negative)"
          style={{
            opacity: showEmphasis || prefersReduced ? 1 : 0,
            transform: showEmphasis || prefersReduced ? 'scale(1)' : 'scale(0)',
            transformOrigin: '182px 92px',
            transition: prefersReduced
              ? 'none'
              : 'opacity 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
        <text
          x="182"
          y="84"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
          textAnchor="middle"
          fontWeight="500"
          style={{
            opacity: showEmphasis || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 200ms ease',
          }}
        >
          TSLA
        </text>

        {/* −4.2% end label — 20pt headline numeral (Slice-LP3.3 §A) */}
        <text
          x="276"
          y="100"
          fontSize="20"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-negative)"
          textAnchor="end"
          fontWeight="600"
          style={{
            opacity: showLabel || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 300ms ease 100ms',
          }}
        >
          −4.2%
        </text>

        {/* X-axis labels — lifted to 11pt floor */}
        <text
          x="0"
          y="116"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
        >
          Jan 1
        </text>
        <text
          x="240"
          y="116"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
          textAnchor="end"
        >
          Jan 30
        </text>
      </svg>
    </div>
  );
}

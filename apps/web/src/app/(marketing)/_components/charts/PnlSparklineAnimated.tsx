'use client';

// PnlSparklineAnimated — Tab 1 «Why?» animated SVG chart (v3)
// Animation: stroke-dashoffset line draw on IntersectionObserver trigger (1.5s ease-out)
// Two emphasis dots pulse ×2 after line completes; −4.2% label fades in last
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

type AnimPhase = 'idle' | 'drawing' | 'dots' | 'label' | 'done';

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

    // Phase sequence: drawing (0ms) → dots (1600ms) → label (2000ms) → done (2600ms)
    setPhase('drawing');

    const t1 = setTimeout(() => setPhase('dots'), 1600);
    const t2 = setTimeout(() => setPhase('label'), 2000);
    const t3 = setTimeout(() => setPhase('done'), 2600);
    timerRefs.current = [t1, t2, t3];

    return () => timerRefs.current.forEach(clearTimeout);
  }, [inView, prefersReduced]);

  const showDots = phase === 'dots' || phase === 'label' || phase === 'done';
  const showLabel = phase === 'label' || phase === 'done';

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
            <stop offset="0%" stopColor="var(--provedo-border-subtle)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--provedo-border-subtle)" stopOpacity="0" />
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

        {/* Gradient fill — visible once line drawn */}
        {(showDots || prefersReduced) && (
          <polyline
            fill={`url(#${gradientId})`}
            stroke="none"
            points={`0,120 ${LINE_POINTS} 279,120`}
            style={{
              opacity: showDots ? 1 : 0,
              transition: 'opacity 400ms ease',
            }}
          />
        )}

        {/* Animated P&L line */}
        <polyline
          fill="none"
          stroke="var(--provedo-text-secondary)"
          strokeWidth="1.5"
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
                      ? 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)'
                      : 'none',
                }
          }
        />

        {/* AAPL emphasis dot — pulses when visible */}
        <circle
          cx="77"
          cy="52"
          r="4"
          fill="var(--provedo-negative)"
          style={{
            opacity: showDots || prefersReduced ? 1 : 0,
            transform: showDots || prefersReduced ? 'scale(1)' : 'scale(0)',
            transformOrigin: '77px 52px',
            transition: prefersReduced
              ? 'none'
              : 'opacity 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
        <text
          x="77"
          y="46"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
          textAnchor="middle"
          style={{
            opacity: showDots || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 200ms ease 100ms',
          }}
        >
          AAPL
        </text>

        {/* TSLA emphasis dot — appears 200ms after AAPL */}
        <circle
          cx="182"
          cy="92"
          r="4"
          fill="var(--provedo-negative)"
          style={{
            opacity: showDots || prefersReduced ? 1 : 0,
            transform: showDots || prefersReduced ? 'scale(1)' : 'scale(0)',
            transformOrigin: '182px 92px',
            transition: prefersReduced
              ? 'none'
              : 'opacity 200ms ease 200ms, transform 200ms cubic-bezier(0.34,1.56,0.64,1) 200ms',
          }}
        />
        <text
          x="182"
          y="86"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
          textAnchor="middle"
          style={{
            opacity: showDots || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 200ms ease 300ms',
          }}
        >
          TSLA
        </text>

        {/* −4.2% label — fades in last */}
        <text
          x="276"
          y="90"
          fontSize="11"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-negative)"
          textAnchor="end"
          fontWeight="500"
          style={{
            opacity: showLabel || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 400ms ease',
          }}
        >
          −4.2%
        </text>

        {/* X-axis labels */}
        <text
          x="0"
          y="114"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
        >
          Jan 1
        </text>
        <text
          x="240"
          y="114"
          fontSize="9"
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

'use client';

// AllocationPieBarAnimated — Tab 4 «Aggregate» animated donut + stacked bar (v3)
// Animation: pie slices expand with stroke-dasharray arc animation (stagger 200ms/slice)
//            stacked bars grow from left (stagger), labels fade in last
// Fallback: prefers-reduced-motion → static immediately
// Accessibility: role="img" + aria-label + visible data table fallback

import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Slice {
  label: string;
  pct: number;
  color: string;
}

const SLICES: ReadonlyArray<Slice> = [
  { label: 'Tech', pct: 58, color: 'var(--provedo-accent)' },
  { label: 'Financials', pct: 18, color: 'var(--provedo-text-secondary)' },
  { label: 'Healthcare', pct: 14, color: 'var(--provedo-text-tertiary)' },
  { label: 'Other', pct: 10, color: 'var(--provedo-border-default)' },
] as const;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

const CX = 70;
const CY = 70;
const OUTER_R = 60;
const INNER_R = 36;
const STROKE_W = OUTER_R - INNER_R;

// Full circumference for stroke-dasharray animation
const CIRCUMFERENCE = 2 * Math.PI * ((OUTER_R + INNER_R) / 2);

const ibkrPositions = [
  { label: 'AAPL', w: 54, color: 'var(--provedo-accent-active)' },
  { label: 'MSFT', w: 35, color: 'var(--provedo-accent)' },
  { label: 'NVDA', w: 31, color: 'var(--provedo-accent-hover)' },
] as const;

const schwabPositions = [
  { label: 'GOOG', w: 22, color: 'var(--provedo-accent-light)' },
  { label: 'AMZN', w: 16, color: 'var(--provedo-border-default)' },
] as const;

export function AllocationPieBarAnimated(): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.25 });
  const prefersReduced = usePrefersReducedMotion();
  const [visibleSlices, setVisibleSlices] = useState(0);
  const [barsVisible, setBarsVisible] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setVisibleSlices(SLICES.length);
      setBarsVisible(true);
      setLabelsVisible(true);
      return;
    }

    // Slices appear one by one: 0ms, 200ms, 400ms, 600ms
    const sliceTimers = SLICES.map((_, i) => setTimeout(() => setVisibleSlices(i + 1), i * 200));
    // Bars grow from left after all slices: 800ms
    const t4 = setTimeout(() => setBarsVisible(true), 800);
    // Labels fade in last: 1100ms
    const t5 = setTimeout(() => setLabelsVisible(true), 1100);
    timerRefs.current = [...sliceTimers, t4, t5];

    return () => timerRefs.current.forEach(clearTimeout);
  }, [inView, prefersReduced]);

  // Build arc paths
  let cumulativePct = 0;
  const arcs = SLICES.map((slice, i) => {
    const startAngle = cumulativePct * 3.6;
    cumulativePct += slice.pct;
    const endAngle = cumulativePct * 3.6;
    const arcLen = (slice.pct / 100) * CIRCUMFERENCE;
    const isVisible = prefersReduced || visibleSlices > i;
    return { ...slice, startAngle, endAngle, arcLen, isVisible };
  });

  return (
    <div ref={ref} style={{ marginTop: '12px' }}>
      <svg
        viewBox="0 0 280 150"
        width="100%"
        height="150"
        role="img"
        aria-label="Allocation across IBKR and Schwab: Tech 58% (AAPL $14k, MSFT $9k, NVDA $8k on IBKR; GOOG $3k, AMZN $2k on Schwab), Financials 18%, Healthcare 14%, Other 10%. Total $231k."
        style={{ display: 'block' }}
      >
        {/* Donut arcs — animated per-slice */}
        {arcs.map((arc) => (
          <path
            key={arc.label}
            d={arcPath(CX, CY, (OUTER_R + INNER_R) / 2, arc.startAngle, arc.endAngle)}
            fill="none"
            stroke={arc.color}
            strokeWidth={STROKE_W}
            strokeLinecap="butt"
            style={
              prefersReduced
                ? {}
                : {
                    strokeDasharray: `${arc.arcLen} ${CIRCUMFERENCE}`,
                    strokeDashoffset: arc.isVisible ? 0 : arc.arcLen,
                    transition: arc.isVisible
                      ? 'stroke-dashoffset 400ms cubic-bezier(0.16,1,0.3,1)'
                      : 'none',
                  }
            }
          />
        ))}

        {/* Center label */}
        <text
          x={CX}
          y={CY - 6}
          fontSize="13"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-primary)"
          textAnchor="middle"
          fontWeight="500"
          style={{
            opacity: labelsVisible || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 300ms ease',
          }}
        >
          $231k
        </text>
        <text
          x={CX}
          y={CY + 8}
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
          textAnchor="middle"
          style={{
            opacity: labelsVisible || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 300ms ease',
          }}
        >
          total
        </text>

        {/* Slice labels */}
        {[
          { label: 'Tech 58%', y: 22, color: 'var(--provedo-accent)', fw: '500' },
          { label: 'Fin. 18%', y: 36, color: 'var(--provedo-text-secondary)', fw: 'normal' },
          { label: 'Health 14%', y: 50, color: 'var(--provedo-text-tertiary)', fw: 'normal' },
          { label: 'Other 10%', y: 64, color: 'var(--provedo-border-default)', fw: 'normal' },
        ].map((l) => (
          <text
            key={l.label}
            x="140"
            y={l.y}
            fontSize="9"
            fontFamily="var(--provedo-font-mono)"
            fill={l.color}
            fontWeight={l.fw}
            style={{
              opacity: labelsVisible || prefersReduced ? 1 : 0,
              transition: prefersReduced ? 'none' : 'opacity 300ms ease',
            }}
          >
            {l.label}
          </text>
        ))}

        {/* Stacked bars header */}
        <text
          x="140"
          y="86"
          fontSize="10"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
          fontWeight="500"
          style={{
            opacity: barsVisible || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 200ms ease',
          }}
        >
          By broker
        </text>

        {/* IBKR row label */}
        <text
          x="140"
          y="100"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
          style={{
            opacity: barsVisible || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 200ms ease',
          }}
        >
          IBKR
        </text>

        {/* IBKR bars — grow from left */}
        {(() => {
          let x = 170;
          return ibkrPositions.map((pos, i) => {
            const rect = (
              <g key={pos.label}>
                <rect
                  x={x}
                  y="92"
                  width={barsVisible || prefersReduced ? pos.w : 0}
                  height="11"
                  rx="1"
                  fill={pos.color}
                  style={{
                    transition: prefersReduced
                      ? 'none'
                      : `width 300ms cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`,
                  }}
                />
                <text
                  x={x + pos.w / 2}
                  y="101"
                  fontSize="7"
                  fontFamily="var(--provedo-font-mono)"
                  fill="white"
                  textAnchor="middle"
                  style={{
                    opacity: labelsVisible || prefersReduced ? 1 : 0,
                    transition: prefersReduced ? 'none' : 'opacity 200ms ease',
                  }}
                >
                  {pos.label}
                </text>
              </g>
            );
            x += pos.w + 1;
            return rect;
          });
        })()}

        {/* Schwab row label */}
        <text
          x="140"
          y="116"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
          style={{
            opacity: barsVisible || prefersReduced ? 1 : 0,
            transition: prefersReduced ? 'none' : 'opacity 200ms ease 100ms',
          }}
        >
          Schwab
        </text>

        {/* Schwab bars */}
        {(() => {
          let x = 170;
          return schwabPositions.map((pos, i) => {
            const rect = (
              <g key={pos.label}>
                <rect
                  x={x}
                  y="108"
                  width={barsVisible || prefersReduced ? pos.w : 0}
                  height="11"
                  rx="1"
                  fill={pos.color}
                  style={{
                    transition: prefersReduced
                      ? 'none'
                      : `width 300ms cubic-bezier(0.16,1,0.3,1) ${100 + i * 80}ms`,
                  }}
                />
                <text
                  x={x + pos.w / 2}
                  y="117"
                  fontSize="7"
                  fontFamily="var(--provedo-font-mono)"
                  fill="white"
                  textAnchor="middle"
                  style={{
                    opacity: labelsVisible || prefersReduced ? 1 : 0,
                    transition: prefersReduced ? 'none' : 'opacity 200ms ease 100ms',
                  }}
                >
                  {pos.label}
                </text>
              </g>
            );
            x += pos.w + 1;
            return rect;
          });
        })()}
      </svg>

      {/* Visible data table — WCAG */}
      <p
        style={{
          fontSize: '10px',
          fontFamily: 'var(--provedo-font-mono)',
          color: 'var(--provedo-text-tertiary)',
          marginTop: '4px',
          lineHeight: '1.4',
        }}
        aria-label="Allocation breakdown"
      >
        Tech 58% · Financials 18% · Healthcare 14% · Other 10%
      </p>
    </div>
  );
}

'use client';

// TradeTimelineAnimated — Tab 3 «Patterns» animated trade timeline (v3)
// Animation: 3 sell points appear sequentially (300ms stagger), then recovery marks,
//            then dotted connectors, then «no judgment, no advice» text fades last
// Fallback: prefers-reduced-motion → static (all visible)
// Lane A: «no judgment, no advice» disclaim — load-bearing copy
// Accessibility: role="img" + aria-label + <details> fallback table

import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const AXIS_Y = 60;
const SVG_W = 280;
const SVG_H = 120;

const SELL_POINTS: ReadonlyArray<{
  month: string;
  xSell: number;
  xAfter: number;
  label: string;
}> = [
  { month: 'Feb', xSell: 24, xAfter: 66, label: 'Sell Feb · Recovery Apr' },
  { month: 'Jun', xSell: 118, xAfter: 160, label: 'Sell Jun · Recovery Aug' },
  { month: 'Sep', xSell: 189, xAfter: 231, label: 'Sell Sep · Recovery Nov' },
] as const;

const MONTH_LABELS = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] as const;
const MONTH_LABEL_XS = [0, 47, 94, 142, 189, 236] as const;

type AnimPhase = 'idle' | 'sells' | 'recoveries' | 'connectors' | 'disclaim' | 'done';

export function TradeTimelineAnimated(): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const prefersReduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<AnimPhase>('idle');
  const [visibleSells, setVisibleSells] = useState(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setPhase('done');
      setVisibleSells(SELL_POINTS.length);
      return;
    }

    // Sequence:
    // 0ms: sell 1 appears
    // 300ms: sell 2
    // 600ms: sell 3
    // 900ms: phase=recoveries
    // 1200ms: phase=connectors
    // 1600ms: phase=disclaim/done
    const t0 = setTimeout(() => setVisibleSells(1), 0);
    const t1 = setTimeout(() => setVisibleSells(2), 300);
    const t2 = setTimeout(() => setVisibleSells(3), 600);
    const t3 = setTimeout(() => setPhase('recoveries'), 900);
    const t4 = setTimeout(() => setPhase('connectors'), 1200);
    const t5 = setTimeout(() => setPhase('done'), 1600);
    timerRefs.current = [t0, t1, t2, t3, t4, t5];

    return () => timerRefs.current.forEach(clearTimeout);
  }, [inView, prefersReduced]);

  const showRecoveries = phase === 'recoveries' || phase === 'connectors' || phase === 'done';
  const showConnectors = phase === 'connectors' || phase === 'done';
  const showDisclaim = phase === 'done';

  return (
    <div ref={ref} style={{ marginTop: '12px' }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        height={SVG_H}
        role="img"
        aria-label="Trade timeline: 3 Apple sell points marked at Feb, Jun, Sep. 8-week-after recovery points trail each sell. Provedo notices — no judgment, no advice."
        style={{ display: 'block' }}
      >
        {/* Horizontal axis */}
        <line
          x1="0"
          y1={AXIS_Y}
          x2={SVG_W}
          y2={AXIS_Y}
          stroke="var(--provedo-border-default)"
          strokeWidth="1"
        />

        {/* Dotted connectors — appear in connectors phase */}
        {SELL_POINTS.map((sp, i) => (
          <line
            key={`conn-${sp.month}`}
            x1={sp.xSell}
            y1={AXIS_Y}
            x2={sp.xAfter}
            y2={AXIS_Y}
            stroke="var(--provedo-border-default)"
            strokeWidth="1"
            strokeDasharray="3,3"
            style={{
              opacity: showConnectors || prefersReduced ? 1 : 0,
              transition: prefersReduced ? 'none' : `opacity 200ms ease ${i * 100}ms`,
            }}
          />
        ))}

        {/* Sell-point triangles — stagger by index */}
        {SELL_POINTS.map((sp, i) => {
          const visible = prefersReduced || visibleSells > i;
          return (
            <g key={`sell-${sp.month}`}>
              <polygon
                points={`${sp.xSell - 5},${AXIS_Y - 12} ${sp.xSell + 5},${AXIS_Y - 12} ${sp.xSell},${AXIS_Y - 2}`}
                fill="var(--provedo-negative)"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: `${sp.xSell}px ${AXIS_Y}px`,
                  transition: prefersReduced
                    ? 'none'
                    : 'opacity 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
              <text
                x={sp.xSell}
                y={AXIS_Y - 16}
                fontSize="9"
                fontFamily="var(--provedo-font-mono)"
                fill="var(--provedo-negative)"
                textAnchor="middle"
                fontWeight="500"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: prefersReduced ? 'none' : 'opacity 200ms ease 100ms',
                }}
              >
                {sp.month}
              </text>
            </g>
          );
        })}

        {/* 8-week-after recovery circles — appear in recoveries phase with stagger */}
        {SELL_POINTS.map((sp, i) => (
          <circle
            key={`after-${sp.month}`}
            cx={sp.xAfter}
            cy={AXIS_Y}
            r="5"
            fill="none"
            stroke="var(--provedo-accent)"
            strokeWidth="1.5"
            style={{
              opacity: showRecoveries || prefersReduced ? 1 : 0,
              transform: showRecoveries || prefersReduced ? 'scale(1)' : 'scale(0)',
              transformOrigin: `${sp.xAfter}px ${AXIS_Y}px`,
              transition: prefersReduced
                ? 'none'
                : `opacity 200ms ease ${i * 100}ms, transform 250ms cubic-bezier(0.34,1.56,0.64,1) ${i * 100}ms`,
            }}
          />
        ))}

        {/* Month axis labels */}
        {MONTH_LABELS.map((m, i) => {
          const xPos = MONTH_LABEL_XS[i] ?? 0;
          return (
            <text
              key={m}
              x={xPos}
              y={AXIS_Y + 16}
              fontSize="9"
              fontFamily="var(--provedo-font-mono)"
              fill="var(--provedo-text-tertiary)"
            >
              {m}
            </text>
          );
        })}

        {/* Legend */}
        <g transform={`translate(0,${SVG_H - 14})`}>
          <polygon points="0,8 6,8 3,0" fill="var(--provedo-negative)" />
          <text
            x="10"
            y="8"
            fontSize="8"
            fontFamily="var(--provedo-font-mono)"
            fill="var(--provedo-text-tertiary)"
          >
            sell point
          </text>
          <circle cx="70" cy="4" r="3" fill="none" stroke="var(--provedo-accent)" strokeWidth="1" />
          <text
            x="77"
            y="8"
            fontSize="8"
            fontFamily="var(--provedo-font-mono)"
            fill="var(--provedo-text-tertiary)"
          >
            +8 weeks
          </text>
        </g>
      </svg>

      {/* «no judgment, no advice» disclaim — load-bearing copy, fades in last */}
      <p
        style={{
          fontSize: '10px',
          fontFamily: 'var(--provedo-font-mono)',
          color: 'var(--provedo-text-tertiary)',
          marginTop: '6px',
          opacity: showDisclaim || prefersReduced ? 1 : 0,
          transition: prefersReduced ? 'none' : 'opacity 400ms ease',
        }}
      >
        Provedo notices — no judgment, no advice.
      </p>

      {/* Accessible fallback table */}
      <details style={{ marginTop: '6px' }}>
        <summary
          style={{
            fontSize: '9px',
            fontFamily: 'var(--provedo-font-mono)',
            color: 'var(--provedo-text-tertiary)',
            cursor: 'pointer',
          }}
        >
          View data table
        </summary>
        <table
          style={{
            fontSize: '9px',
            fontFamily: 'var(--provedo-font-mono)',
            color: 'var(--provedo-text-tertiary)',
            borderCollapse: 'collapse',
            marginTop: '4px',
          }}
        >
          <caption style={{ display: 'none' }}>Apple sell points and 8-week recovery marks</caption>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingRight: '8px' }}>Sell month</th>
              <th style={{ textAlign: 'left' }}>Recovery (+8w)</th>
            </tr>
          </thead>
          <tbody>
            {SELL_POINTS.map((sp) => {
              const parts = sp.label.split('·');
              const sellPart = parts[0]?.trim() ?? '';
              const recoveryPart = parts[1]?.trim() ?? '';
              return (
                <tr key={sp.month}>
                  <td style={{ paddingRight: '8px' }}>{sellPart}</td>
                  <td>{recoveryPart}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </div>
  );
}

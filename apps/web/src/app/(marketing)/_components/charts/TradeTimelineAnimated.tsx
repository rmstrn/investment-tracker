'use client';

// TradeTimelineAnimated — Tab 3 «Patterns» animated trade timeline (v3.1 → Slice-LP3.3)
// Animation: all sell points + recovery marks + connectors fade in simultaneously
//            (legal patch 2026-04-26 / commit 8cb509b: simultaneous presentation
//            eliminates narrative-causation framing «if you hadn't sold...»),
//            then «no judgment, no advice» disclaim fades last.
//            **The simultaneous-animation legal patch MUST NOT be undone.**
// Slice-LP3.3 chart upgrade Proposal B §D: typography polish only —
//   - All text lifted to 11pt floor (was 8-9pt)
//   - Visual vocabulary, animation sequencing, timing budget unchanged
// Fallback: prefers-reduced-motion → static (all visible)
// Lane A: «no judgment, no advice» disclaim — load-bearing copy
// Accessibility: role="img" + aria-label + <details> fallback table

import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const AXIS_Y = 60;
const SVG_W = 280;
const SVG_H = 124;

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

export function TradeTimelineAnimated(): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const prefersReduced = usePrefersReducedMotion();
  const [marksRevealed, setMarksRevealed] = useState(false);
  const [disclaimVisible, setDisclaimVisible] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setMarksRevealed(true);
      setDisclaimVisible(true);
      return;
    }
    // Simultaneous trigger of all marks at 0ms — locked from commit 8cb59f finance/legal
    // patch. Disclaim fades at 600ms — total entrance ≤ 600ms (within audit budget).
    const t1 = setTimeout(() => setMarksRevealed(true), 0);
    const t2 = setTimeout(() => setDisclaimVisible(true), 600);
    timerRefs.current = [t1, t2];
    return () => timerRefs.current.forEach(clearTimeout);
  }, [inView, prefersReduced]);

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

        {/* Dotted connectors — appear simultaneously with all marks */}
        {SELL_POINTS.map((sp) => (
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
              opacity: marksRevealed || prefersReduced ? 1 : 0,
              transition: prefersReduced ? 'none' : 'opacity 200ms ease',
            }}
          />
        ))}

        {/* Sell-point triangles — all appear simultaneously */}
        {SELL_POINTS.map((sp) => {
          const visible = prefersReduced || marksRevealed;
          return (
            <g key={`sell-${sp.month}`}>
              <polygon
                points={`${sp.xSell - 6},${AXIS_Y - 14} ${sp.xSell + 6},${AXIS_Y - 14} ${sp.xSell},${AXIS_Y - 2}`}
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
                y={AXIS_Y - 18}
                fontSize="11"
                fontFamily="var(--provedo-font-mono)"
                fill="var(--provedo-negative)"
                textAnchor="middle"
                fontWeight="600"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: prefersReduced ? 'none' : 'opacity 200ms ease',
                }}
              >
                {sp.month}
              </text>
            </g>
          );
        })}

        {/* 8-week-after recovery circles — appear simultaneously with sells */}
        {SELL_POINTS.map((sp) => (
          <circle
            key={`after-${sp.month}`}
            cx={sp.xAfter}
            cy={AXIS_Y}
            r="5"
            fill="none"
            stroke="var(--provedo-accent)"
            strokeWidth="1.5"
            style={{
              opacity: marksRevealed || prefersReduced ? 1 : 0,
              transform: marksRevealed || prefersReduced ? 'scale(1)' : 'scale(0)',
              transformOrigin: `${sp.xAfter}px ${AXIS_Y}px`,
              transition: prefersReduced
                ? 'none'
                : 'opacity 200ms ease, transform 250ms cubic-bezier(0.34,1.56,0.64,1)',
            }}
          />
        ))}

        {/* Month axis labels — 11pt floor */}
        {MONTH_LABELS.map((m, i) => {
          const xPos = MONTH_LABEL_XS[i] ?? 0;
          return (
            <text
              key={m}
              x={xPos}
              y={AXIS_Y + 18}
              fontSize="11"
              fontFamily="var(--provedo-font-mono)"
              fill="var(--provedo-text-tertiary)"
            >
              {m}
            </text>
          );
        })}

        {/* Legend — 11pt floor */}
        <g transform={`translate(0,${SVG_H - 12})`}>
          <polygon points="0,10 8,10 4,0" fill="var(--provedo-negative)" />
          <text
            x="13"
            y="10"
            fontSize="11"
            fontFamily="var(--provedo-font-mono)"
            fill="var(--provedo-text-tertiary)"
          >
            sell point
          </text>
          <circle
            cx="92"
            cy="5"
            r="4"
            fill="none"
            stroke="var(--provedo-accent)"
            strokeWidth="1.5"
          />
          <text
            x="100"
            y="10"
            fontSize="11"
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
          fontSize: '11px',
          fontFamily: 'var(--provedo-font-mono)',
          color: 'var(--provedo-text-tertiary)',
          marginTop: '6px',
          opacity: disclaimVisible || prefersReduced ? 1 : 0,
          transition: prefersReduced ? 'none' : 'opacity 400ms ease',
        }}
      >
        Provedo notices — no judgment, no advice.
      </p>

      {/* Accessible fallback table */}
      <details style={{ marginTop: '6px' }}>
        <summary
          style={{
            fontSize: '11px',
            fontFamily: 'var(--provedo-font-mono)',
            color: 'var(--provedo-text-tertiary)',
            cursor: 'pointer',
          }}
        >
          View data table
        </summary>
        <table
          style={{
            fontSize: '11px',
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

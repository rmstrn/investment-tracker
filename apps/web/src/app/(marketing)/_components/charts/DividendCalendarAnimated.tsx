'use client';

// DividendCalendarAnimated — Tab 2 «Dividends» animated calendar (v3 → Slice-LP3.3)
// Animation: empty grid fades in, then dividend dots appear sequentially (compressed)
// Slice-LP3.3 chart upgrade Proposal B §C polish:
//   - Borders 0.5px → 1px (visible at every DPR)
//   - Ticker label floor 8pt → 11pt
//   - Month gap 8 → 24px
//   - DROP counter animation — render «$312» instantly at 16pt
//   - Compress motion budget from 1.8s → ≤600ms total
//     · 0–250ms: grid fade-in
//     · 250–550ms: 3 dots reveal simultaneously (no per-dot stagger)
// Fallback: prefers-reduced-motion → static, all visible immediately
// Accessibility: role="img" + aria-label + visible caption (WCAG color-not-only)

import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface DividendEvent {
  month: string;
  day: number;
  ticker: string;
  amount: string;
  col: number;
  row: number;
  value: number; // numeric for sum reference (no longer animated)
}

const DIVIDEND_EVENTS: ReadonlyArray<DividendEvent> = [
  { month: 'Sep', day: 14, ticker: 'KO', amount: '$87', col: 6, row: 1, value: 87 },
  { month: 'Oct', day: 7, ticker: 'VZ', amount: '$74', col: 0, row: 0, value: 74 },
  { month: 'Nov', day: 19, ticker: 'MSFT', amount: '$61', col: 2, row: 2, value: 61 },
] as const;

const MONTHS = ['Sep', 'Oct', 'Nov'] as const;
const CELL_W = 28;
const CELL_H = 24;
const MONTH_GAP = 24; // was 8 — Slice-LP3.3 §C
const DAYS = 7;
const WEEKS = 4;
const MONTH_W = DAYS * CELL_W; // 196
const TOTAL_W = MONTHS.length * MONTH_W + (MONTHS.length - 1) * MONTH_GAP; // 636

interface GridCell {
  weekIdx: number;
  dayIdx: number;
  cellKey: string;
}

function buildGridCells(): ReadonlyArray<GridCell> {
  const cells: GridCell[] = [];
  for (let weekIdx = 0; weekIdx < WEEKS; weekIdx++) {
    for (let dayIdx = 0; dayIdx < DAYS; dayIdx++) {
      cells.push({ weekIdx, dayIdx, cellKey: `w${weekIdx}d${dayIdx}` });
    }
  }
  return cells;
}

const GRID_CELLS = buildGridCells();
const TOTAL_DIVIDENDS = 312;

export function DividendCalendarAnimated(): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.25 });
  const prefersReduced = usePrefersReducedMotion();
  const [gridVisible, setGridVisible] = useState(false);
  const [dotsVisible, setDotsVisible] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setGridVisible(true);
      setDotsVisible(true);
      return;
    }

    // Compressed sequence — 600ms total entrance budget per Slice-LP3.3 audit:
    // grid fade-in (0–250ms) → 3 dots simultaneous (250ms trigger, 300ms transition)
    const t0 = setTimeout(() => setGridVisible(true), 0);
    const t1 = setTimeout(() => setDotsVisible(true), 250);
    timerRefs.current = [t0, t1];

    return () => timerRefs.current.forEach(clearTimeout);
  }, [inView, prefersReduced]);

  return (
    <div ref={ref} style={{ marginTop: '12px' }}>
      {/* Static counter — 16pt headline numeral, no count-up animation
          (Slice-LP3.3 §C: 3× motion budget reduction came from dropping the rAF tick) */}
      <p
        style={{
          fontFamily: 'var(--provedo-font-mono)',
          fontSize: '16px',
          color: 'var(--provedo-positive)',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        ${TOTAL_DIVIDENDS} expected this quarter
      </p>

      <svg
        viewBox={`0 0 ${TOTAL_W} ${WEEKS * CELL_H + 28}`}
        width="100%"
        height="120"
        role="img"
        aria-label="Dividend calendar: KO ex-div Sept 14 ($87), VZ ex-div Oct 7 ($74), MSFT ex-div Nov 19 ($61). Three smaller payments after."
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: 'block',
          opacity: gridVisible || prefersReduced ? 1 : 0,
          transition: prefersReduced ? 'none' : 'opacity 250ms ease',
        }}
      >
        {MONTHS.map((month, mIdx) => {
          const offsetX = mIdx * (MONTH_W + MONTH_GAP);

          return (
            <g key={month} transform={`translate(${offsetX},0)`}>
              {/* Month label — 11pt floor */}
              <text
                x={MONTH_W / 2}
                y="14"
                fontSize="11"
                fontFamily="var(--provedo-font-mono)"
                fill="var(--provedo-text-muted)"
                textAnchor="middle"
                fontWeight="500"
              >
                {month}
              </text>

              {GRID_CELLS.map(({ weekIdx, dayIdx, cellKey }) => {
                const x = dayIdx * CELL_W;
                const y = weekIdx * CELL_H + 18;

                const event = DIVIDEND_EVENTS.find(
                  (e) => e.month === month && e.col === dayIdx && e.row === weekIdx,
                );
                const isDotVisible = event !== null && (dotsVisible || prefersReduced);

                return (
                  <g key={`${month}-${cellKey}`}>
                    <rect
                      x={x + 1}
                      y={y + 1}
                      width={CELL_W - 2}
                      height={CELL_H - 2}
                      rx="3"
                      fill={
                        isDotVisible || prefersReduced
                          ? 'var(--provedo-accent-subtle)'
                          : 'transparent'
                      }
                      stroke="var(--provedo-border-subtle)"
                      strokeWidth="1"
                      style={{
                        transition: prefersReduced ? 'none' : 'fill 200ms ease',
                      }}
                    />
                    {event && (
                      <>
                        <circle
                          cx={x + CELL_W / 2}
                          cy={y + CELL_H / 2}
                          r="4"
                          fill="var(--provedo-accent)"
                          style={{
                            opacity: isDotVisible || prefersReduced ? 1 : 0,
                            transform: isDotVisible || prefersReduced ? 'scale(1)' : 'scale(0)',
                            transformOrigin: `${x + CELL_W / 2}px ${y + CELL_H / 2}px`,
                            transition: prefersReduced
                              ? 'none'
                              : 'opacity 200ms ease, transform 250ms cubic-bezier(0.34,1.56,0.64,1)',
                          }}
                        />
                        <text
                          x={x + CELL_W / 2}
                          y={y + CELL_H + 12}
                          fontSize="11"
                          fontFamily="var(--provedo-font-mono)"
                          fill="var(--provedo-accent)"
                          textAnchor="middle"
                          fontWeight="600"
                          style={{
                            opacity: isDotVisible || prefersReduced ? 1 : 0,
                            transition: prefersReduced ? 'none' : 'opacity 200ms ease 50ms',
                          }}
                        >
                          {event.ticker} {event.amount}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Visible caption — WCAG. Carries the data when the SVG compresses on mobile. */}
      <p
        style={{
          fontSize: '11px',
          fontFamily: 'var(--provedo-font-mono)',
          color: 'var(--provedo-text-tertiary)',
          marginTop: '6px',
          lineHeight: '1.5',
        }}
      >
        KO Sept 14 ($87) · VZ Oct 7 ($74) · MSFT Nov 19 ($61)
      </p>
    </div>
  );
}

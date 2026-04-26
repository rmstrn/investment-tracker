'use client';

// DividendCalendarAnimated — Tab 2 «Dividends» animated calendar (v3)
// Animation: empty grid fades in, then dividend dots appear sequentially (200ms stagger)
// Counter animates from $0 → $312 after dots appear
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
  value: number; // numeric for counter
}

const DIVIDEND_EVENTS: ReadonlyArray<DividendEvent> = [
  { month: 'Sep', day: 14, ticker: 'KO', amount: '$87', col: 6, row: 1, value: 87 },
  { month: 'Oct', day: 7, ticker: 'VZ', amount: '$74', col: 0, row: 0, value: 74 },
  { month: 'Nov', day: 19, ticker: 'MSFT', amount: '$61', col: 2, row: 2, value: 61 },
] as const;

const MONTHS = ['Sep', 'Oct', 'Nov'] as const;
const CELL_W = 28;
const CELL_H = 24;
const MONTH_GAP = 8;
const DAYS = 7;
const WEEKS = 4;
const MONTH_W = DAYS * CELL_W; // 196
const TOTAL_W = MONTHS.length * MONTH_W + (MONTHS.length - 1) * MONTH_GAP; // 604

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
  const [visibleDots, setVisibleDots] = useState(0); // 0, 1, 2, 3
  const [counter, setCounter] = useState(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setGridVisible(true);
      setVisibleDots(DIVIDEND_EVENTS.length);
      setCounter(TOTAL_DIVIDENDS);
      return;
    }

    // Sequence: grid fades in (0ms) → dot 1 (400ms) → dot 2 (600ms) → dot 3 (800ms) → counter (1000ms)
    const t0 = setTimeout(() => setGridVisible(true), 0);
    const t1 = setTimeout(() => setVisibleDots(1), 400);
    const t2 = setTimeout(() => setVisibleDots(2), 600);
    const t3 = setTimeout(() => setVisibleDots(3), 800);
    const t4 = setTimeout(() => {
      // Animate counter 0 → 312 over 800ms
      const start = performance.now();
      const duration = 800;

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - (1 - progress) ** 3;
        setCounter(Math.round(eased * TOTAL_DIVIDENDS));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 1000);

    timerRefs.current = [t0, t1, t2, t3, t4];

    return () => {
      timerRefs.current.forEach(clearTimeout);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, prefersReduced]);

  return (
    <div ref={ref} style={{ marginTop: '12px' }}>
      {/* Counter */}
      <p
        style={{
          fontFamily: 'var(--provedo-font-mono)',
          fontSize: '11px',
          color: 'var(--provedo-positive)',
          fontWeight: 500,
          marginBottom: '8px',
          opacity: visibleDots > 0 || prefersReduced ? 1 : 0,
          transition: prefersReduced ? 'none' : 'opacity 300ms ease',
        }}
      >
        ${counter} expected this quarter
      </p>

      <svg
        viewBox={`0 0 ${TOTAL_W} ${WEEKS * CELL_H + 20}`}
        width="100%"
        height="120"
        role="img"
        aria-label="Dividend calendar: KO ex-div Sept 14 ($87), VZ ex-div Oct 7 ($74), MSFT ex-div Nov 19 ($61). Three smaller payments after."
        style={{
          display: 'block',
          opacity: gridVisible || prefersReduced ? 1 : 0,
          transition: prefersReduced ? 'none' : 'opacity 300ms ease',
        }}
      >
        {MONTHS.map((month, mIdx) => {
          const offsetX = mIdx * (MONTH_W + MONTH_GAP);

          return (
            <g key={month} transform={`translate(${offsetX},0)`}>
              {/* Month label */}
              <text
                x={MONTH_W / 2}
                y="12"
                fontSize="10"
                fontFamily="var(--provedo-font-mono)"
                fill="var(--provedo-text-muted)"
                textAnchor="middle"
                fontWeight="500"
              >
                {month}
              </text>

              {GRID_CELLS.map(({ weekIdx, dayIdx, cellKey }) => {
                const x = dayIdx * CELL_W;
                const y = weekIdx * CELL_H + 16;

                const eventIdx = DIVIDEND_EVENTS.findIndex(
                  (e) => e.month === month && e.col === dayIdx && e.row === weekIdx,
                );
                const event = eventIdx >= 0 ? DIVIDEND_EVENTS[eventIdx] : null;
                const isDotVisible = event !== null && visibleDots > eventIdx;

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
                      strokeWidth="0.5"
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
                              : 'opacity 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
                          }}
                        />
                        <text
                          x={x + CELL_W / 2}
                          y={y + CELL_H + 12}
                          fontSize="8"
                          fontFamily="var(--provedo-font-mono)"
                          fill="var(--provedo-accent)"
                          textAnchor="middle"
                          fontWeight="500"
                          style={{
                            opacity: isDotVisible || prefersReduced ? 1 : 0,
                            transition: prefersReduced ? 'none' : 'opacity 200ms ease 100ms',
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

      {/* Visible caption — WCAG */}
      <p
        style={{
          fontSize: '10px',
          fontFamily: 'var(--provedo-font-mono)',
          color: 'var(--provedo-text-tertiary)',
          marginTop: '4px',
          lineHeight: '1.4',
        }}
      >
        KO Sept 14 ($87) · VZ Oct 7 ($74) · MSFT Nov 19 ($61)
      </p>
    </div>
  );
}

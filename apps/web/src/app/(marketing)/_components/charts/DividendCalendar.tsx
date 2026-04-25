// DividendCalendar — Tab 2 «Dividends» inline SVG calendar grid
// Spec: visual spec §2.2 — 3-month strip (Sep/Oct/Nov), ex-div dates marked
// Accessibility: role="img" + aria-label + visible caption table (WCAG color-not-only)
// Colors: CSS variables only
// Performance: stateless pure component

interface DividendEvent {
  month: string;
  day: number;
  ticker: string;
  amount: string;
  col: number; // 0-based day-of-week column within the 4-week strip
  row: number; // 0-based week row
}

const DIVIDEND_EVENTS: ReadonlyArray<DividendEvent> = [
  { month: 'Sep', day: 14, ticker: 'KO', amount: '$87', col: 6, row: 1 },
  { month: 'Oct', day: 7, ticker: 'VZ', amount: '$74', col: 0, row: 0 },
  { month: 'Nov', day: 19, ticker: 'MSFT', amount: '$61', col: 2, row: 2 },
] as const;

const MONTHS = ['Sep', 'Oct', 'Nov'] as const;

const CELL_W = 28;
const CELL_H = 24;
const MONTH_GAP = 8;
const DAYS = 7;
const WEEKS = 4;
const MONTH_W = DAYS * CELL_W; // 196
const TOTAL_W = MONTHS.length * MONTH_W + (MONTHS.length - 1) * MONTH_GAP; // 604

// Pre-build stable cell keys — avoids noArrayIndexKey lint rule
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

export function DividendCalendar(): React.ReactElement {
  return (
    <div style={{ marginTop: '12px' }}>
      {/* Main SVG calendar */}
      <svg
        viewBox={`0 0 ${TOTAL_W} ${WEEKS * CELL_H + 20}`}
        width="100%"
        height="120"
        role="img"
        aria-label="Dividend calendar: KO ex-div Sept 14 ($87), VZ ex-div Oct 7 ($74), MSFT ex-div Nov 19 ($61). Three smaller payments after."
        style={{ display: 'block' }}
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

              {/* Grid cells — pre-built stable keys */}
              {GRID_CELLS.map(({ weekIdx, dayIdx, cellKey }) => {
                const x = dayIdx * CELL_W;
                const y = weekIdx * CELL_H + 16;

                const event = DIVIDEND_EVENTS.find(
                  (e) => e.month === month && e.col === dayIdx && e.row === weekIdx,
                );

                return (
                  <g key={`${month}-${cellKey}`}>
                    <rect
                      x={x + 1}
                      y={y + 1}
                      width={CELL_W - 2}
                      height={CELL_H - 2}
                      rx="3"
                      fill={event ? 'var(--provedo-accent-subtle)' : 'transparent'}
                      stroke="var(--provedo-border-subtle)"
                      strokeWidth="0.5"
                    />
                    {event && (
                      <>
                        {/* Teal dot center */}
                        <circle
                          cx={x + CELL_W / 2}
                          cy={y + CELL_H / 2}
                          r="4"
                          fill="var(--provedo-accent)"
                        />
                        {/* Ticker label below dot */}
                        <text
                          x={x + CELL_W / 2}
                          y={y + CELL_H + 12}
                          fontSize="8"
                          fontFamily="var(--provedo-font-mono)"
                          fill="var(--provedo-accent)"
                          textAnchor="middle"
                          fontWeight="500"
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

      {/* Visible caption — WCAG: color not only indicator */}
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

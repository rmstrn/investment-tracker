// DividendCalendar — Tab 2 «Dividends» inline SVG calendar grid
// Spec: visual spec §2.2 — 3-month strip (Sep/Oct/Nov), ex-div dates marked
// Slice-LP3.3 chart upgrade Proposal B §C polish:
//   - Cell borders 0.5px → 1px (visible at every DPR)
//   - Ticker label floor 8pt → 11pt
//   - Month gap 8 → 24px
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
const MONTH_GAP = 24; // was 8 — Slice-LP3.3 §C: visible gap between months
const DAYS = 7;
const WEEKS = 4;
const MONTH_W = DAYS * CELL_W; // 196
const TOTAL_W = MONTHS.length * MONTH_W + (MONTHS.length - 1) * MONTH_GAP; // 636

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
      {/* Static counter — lifted to 16pt headline numeral (no animation per Proposal B §C) */}
      <p
        style={{
          fontFamily: 'var(--provedo-font-mono)',
          fontSize: '16px',
          color: 'var(--provedo-positive)',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        $312 expected this quarter
      </p>

      {/* Main SVG calendar */}
      <svg
        viewBox={`0 0 ${TOTAL_W} ${WEEKS * CELL_H + 28}`}
        width="100%"
        height="120"
        role="img"
        aria-label="Dividend calendar: KO ex-div Sept 14 ($87), VZ ex-div Oct 7 ($74), MSFT ex-div Nov 19 ($61). Three smaller payments after."
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {MONTHS.map((month, mIdx) => {
          const offsetX = mIdx * (MONTH_W + MONTH_GAP);

          return (
            <g key={month} transform={`translate(${offsetX},0)`}>
              {/* Month label — lifted to 11pt floor */}
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

              {/* Grid cells — pre-built stable keys */}
              {GRID_CELLS.map(({ weekIdx, dayIdx, cellKey }) => {
                const x = dayIdx * CELL_W;
                const y = weekIdx * CELL_H + 18;

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
                      strokeWidth="1"
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
                        {/* Ticker label below dot — 11pt floor */}
                        <text
                          x={x + CELL_W / 2}
                          y={y + CELL_H + 12}
                          fontSize="11"
                          fontFamily="var(--provedo-font-mono)"
                          fill="var(--provedo-accent)"
                          textAnchor="middle"
                          fontWeight="600"
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

      {/* Visible caption — WCAG: color not only indicator. Mobile-friendly stack also
          relies on this caption for the <md viewport where the SVG compresses */}
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

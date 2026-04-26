// TradeTimeline — Tab 3 «Patterns» inline SVG trade timeline
// Spec: visual spec §2.3 — 12-month axis, 3 sell-points + 8-week-after marks
// Slice-LP3.3 chart upgrade Proposal B §D: typography polish only
//   - All text lifted to 11pt floor (was 8-9pt)
//   - Visual vocabulary unchanged — preserves v3.1 finance/legal patch
// Accessibility: role="img" + aria-label + <details> fallback table
// Colors: CSS variables only — no hardcoded hex
// Lane A: observational only — no advice, no prescriptive annotations

const AXIS_Y = 60;
const SVG_W = 280;
const SVG_H = 124;

// 3 sell-points with their 8-week-after marks
// x coordinates derived from month positions (Jan=0, Dec=260 → step=260/11≈23.6)
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

export function TradeTimeline(): React.ReactElement {
  return (
    <div style={{ marginTop: '12px' }}>
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

        {/* Dotted connectors from sell to 8-week-after */}
        {SELL_POINTS.map((sp) => (
          <line
            key={sp.month}
            x1={sp.xSell}
            y1={AXIS_Y}
            x2={sp.xAfter}
            y2={AXIS_Y}
            stroke="var(--provedo-border-default)"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}

        {/* Sell-point triangles (downward — ▽) */}
        {SELL_POINTS.map((sp) => (
          <polygon
            key={`sell-${sp.month}`}
            points={`${sp.xSell - 6},${AXIS_Y - 14} ${sp.xSell + 6},${AXIS_Y - 14} ${sp.xSell},${AXIS_Y - 2}`}
            fill="var(--provedo-negative)"
          />
        ))}

        {/* Sell labels — 11pt floor */}
        {SELL_POINTS.map((sp) => (
          <text
            key={`label-${sp.month}`}
            x={sp.xSell}
            y={AXIS_Y - 18}
            fontSize="11"
            fontFamily="var(--provedo-font-mono)"
            fill="var(--provedo-negative)"
            textAnchor="middle"
            fontWeight="600"
          >
            {sp.month}
          </text>
        ))}

        {/* 8-week-after circles */}
        {SELL_POINTS.map((sp) => (
          <circle
            key={`after-${sp.month}`}
            cx={sp.xAfter}
            cy={AXIS_Y}
            r="5"
            fill="none"
            stroke="var(--provedo-accent)"
            strokeWidth="1.5"
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

        {/* Legend — 11pt floor (was 8pt) */}
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

      {/* Accessible fallback table via <details> */}
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

// AllocationPieBar — Tab 4 «Aggregate» inline SVG donut + stacked bar
// Spec: visual spec §2.4 — donut (4 slices) + per-broker stacked bar
// Accessibility: role="img" + aria-label + visible data table fallback (mandatory WCAG)
// Colors: CSS variables only
// Performance: stateless pure component — no JS interactivity

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

// Donut geometry helpers
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
const INNER_R = 36; // 60% inner radius

export function AllocationPieBar(): React.ReactElement {
  // Build donut arcs
  let cumulativePct = 0;
  const arcs = SLICES.map((slice) => {
    const startAngle = cumulativePct * 3.6;
    cumulativePct += slice.pct;
    const endAngle = cumulativePct * 3.6;
    return { ...slice, startAngle, endAngle };
  });

  // Stacked bar data
  // IBKR: AAPL 14k, MSFT 9k, NVDA 8k = 31k total; Schwab: GOOG 3k, AMZN 2k = 5k
  // Display widths proportional relative to 36k total

  const ibkrPositions = [
    { label: 'AAPL', w: 54, color: 'var(--provedo-accent-active)' },
    { label: 'MSFT', w: 35, color: 'var(--provedo-accent)' },
    { label: 'NVDA', w: 31, color: 'var(--provedo-accent-hover)' },
  ] as const;
  const schwabPositions = [
    { label: 'GOOG', w: 22, color: 'var(--provedo-accent-light)' },
    { label: 'AMZN', w: 16, color: 'var(--provedo-border-default)' },
  ] as const;

  return (
    <div style={{ marginTop: '12px' }}>
      <svg
        viewBox="0 0 280 150"
        width="100%"
        height="150"
        role="img"
        aria-label="Allocation across IBKR and Schwab: Tech 58% (AAPL $14k, MSFT $9k, NVDA $8k on IBKR; GOOG $3k, AMZN $2k on Schwab), Financials 18%, Healthcare 14%, Other 10%. Total $231k."
        style={{ display: 'block' }}
      >
        {/* Donut arcs */}
        {arcs.map((arc) => (
          <path
            key={arc.label}
            d={arcPath(CX, CY, OUTER_R, arc.startAngle, arc.endAngle)}
            fill="none"
            stroke={arc.color}
            strokeWidth={OUTER_R - INNER_R}
            strokeLinecap="butt"
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
        >
          total
        </text>

        {/* Slice labels outside donut */}
        <text
          x="140"
          y="22"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-accent)"
          fontWeight="500"
        >
          Tech 58%
        </text>
        <text
          x="140"
          y="36"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
        >
          Fin. 18%
        </text>
        <text
          x="140"
          y="50"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
        >
          Health 14%
        </text>
        <text
          x="140"
          y="64"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-border-default)"
        >
          Other 10%
        </text>

        {/* Stacked bars — per-broker breakdown */}
        <text
          x="140"
          y="86"
          fontSize="10"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-tertiary)"
          fontWeight="500"
        >
          By broker
        </text>

        {/* IBKR row */}
        <text
          x="140"
          y="100"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
        >
          IBKR
        </text>
        {(() => {
          let x = 170;
          return ibkrPositions.map((pos) => {
            const rect = (
              <g key={pos.label}>
                <rect x={x} y="92" width={pos.w} height="11" rx="1" fill={pos.color} />
                <text
                  x={x + pos.w / 2}
                  y="101"
                  fontSize="7"
                  fontFamily="var(--provedo-font-mono)"
                  fill="white"
                  textAnchor="middle"
                >
                  {pos.label}
                </text>
              </g>
            );
            x += pos.w + 1;
            return rect;
          });
        })()}

        {/* Schwab row */}
        <text
          x="140"
          y="116"
          fontSize="9"
          fontFamily="var(--provedo-font-mono)"
          fill="var(--provedo-text-secondary)"
        >
          Schwab
        </text>
        {(() => {
          let x = 170;
          return schwabPositions.map((pos) => {
            const rect = (
              <g key={pos.label}>
                <rect x={x} y="108" width={pos.w} height="11" rx="1" fill={pos.color} />
                <text
                  x={x + pos.w / 2}
                  y="117"
                  fontSize="7"
                  fontFamily="var(--provedo-font-mono)"
                  fill="white"
                  textAnchor="middle"
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

      {/* Mandatory visible data table — WCAG: color not only indicator */}
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

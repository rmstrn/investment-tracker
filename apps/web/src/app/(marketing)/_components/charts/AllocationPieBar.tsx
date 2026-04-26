// AllocationPieBar — Tab 4 «Aggregate» — REBUILT as 2-cell bento (Slice-LP3.3 §B)
// Spec: Slice-LP3.3 chart upgrade Proposal B §B —
//   - DROP packed donut+stacked-bar combo (was 280×150 with 26 items / 0.62 items/px²)
//   - Cell A (left): standalone donut, larger, with breathing room. Center «$231k» 22pt.
//     Slice labels OUTSIDE donut, each on its own row with $-amount inline.
//   - Cell B (right): broker-table card. 3 rows, brand-voice approved exact phrasing
//     («IBKR · $186k across 5 positions» — verbatim from brand-voice review §3.3).
//   - DROP stacked bars entirely + DROP --provedo-accent-light (undefined token).
// Lane A: pure observation tokens — no advice, no recommendation register.
// Accessibility: each card has its own role="img" + aria-label. Mandatory data caption.
// Colors: CSS variables only.

interface Slice {
  label: string;
  pct: number;
  amount: string;
  color: string;
}

const SLICES: ReadonlyArray<Slice> = [
  { label: 'Tech', pct: 58, amount: '$134k', color: 'var(--provedo-accent)' },
  { label: 'Financials', pct: 18, amount: '$42k', color: 'var(--provedo-accent-hover)' },
  { label: 'Healthcare', pct: 14, amount: '$32k', color: 'var(--provedo-text-secondary)' },
  { label: 'Other', pct: 10, amount: '$23k', color: 'var(--provedo-border-default)' },
] as const;

// Brand-voice approved exact phrasing (review §3.3) — DO NOT paraphrase.
// «across N positions» pattern foreclosed the «is this a dashboard or a sentence?» ambiguity.
interface BrokerRow {
  name: string;
  amount: string;
  positions: number;
}

const BROKER_ROWS: ReadonlyArray<BrokerRow> = [
  { name: 'IBKR', amount: '$186k', positions: 5 },
  { name: 'Schwab', amount: '$94k', positions: 8 },
  { name: 'Coinbase', amount: '$32k', positions: 12 },
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

// Donut — larger center + breathing room. viewBox 0 0 160 160; r=64 outer, r=44 inner.
const CX = 80;
const CY = 80;
const OUTER_R = 64;
const INNER_R = 44;
const ARC_R = (OUTER_R + INNER_R) / 2;
const STROKE_W = OUTER_R - INNER_R;

interface ArcSlice extends Slice {
  startAngle: number;
  endAngle: number;
}

function buildArcs(slices: ReadonlyArray<Slice>): ReadonlyArray<ArcSlice> {
  let cumulativePct = 0;
  return slices.map((slice) => {
    const startAngle = cumulativePct * 3.6;
    cumulativePct += slice.pct;
    const endAngle = cumulativePct * 3.6;
    return { ...slice, startAngle, endAngle };
  });
}

export function AllocationPieBar(): React.ReactElement {
  const arcs = buildArcs(SLICES);

  return (
    <div style={{ marginTop: '12px' }}>
      {/* Bento: 2 cells. Stacks below md (chat bubble ~340px → cells stack); 2-col above. */}
      <div
        style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: '1fr',
        }}
        className="allocation-bento"
      >
        {/* CELL A — Donut card */}
        <div
          style={{
            backgroundColor: 'var(--provedo-bg-elevated)',
            border: '1px solid var(--provedo-border-subtle)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--provedo-font-mono)',
              fontSize: '11px',
              color: 'var(--provedo-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: 0,
            }}
          >
            By sector
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <svg
              viewBox="0 0 160 160"
              width="140"
              height="140"
              role="img"
              aria-label="Sector allocation: Tech 58% ($134k), Financials 18% ($42k), Healthcare 14% ($32k), Other 10% ($23k). Total $231k."
              style={{ flexShrink: 0 }}
            >
              {arcs.map((arc) => (
                <path
                  key={arc.label}
                  d={arcPath(CX, CY, ARC_R, arc.startAngle, arc.endAngle)}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={STROKE_W}
                  strokeLinecap="butt"
                />
              ))}
              {/* Center: $231k at 22pt — the chart's primary observation */}
              <text
                x={CX}
                y={CY - 2}
                fontSize="22"
                fontFamily="var(--provedo-font-mono)"
                fill="var(--provedo-text-primary)"
                textAnchor="middle"
                fontWeight="600"
              >
                $231k
              </text>
              <text
                x={CX}
                y={CY + 16}
                fontSize="11"
                fontFamily="var(--provedo-font-mono)"
                fill="var(--provedo-text-tertiary)"
                textAnchor="middle"
              >
                total
              </text>
            </svg>

            {/* Slice legend — one row per slice, $-amount inline (review §3.3) */}
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontFamily: 'var(--provedo-font-mono)',
                fontSize: '12px',
                color: 'var(--provedo-text-secondary)',
                minWidth: '140px',
              }}
            >
              {SLICES.map((s) => (
                <li
                  key={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      backgroundColor: s.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1 }}>
                    {s.label} {s.pct}% · {s.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CELL B — Broker table card */}
        <div
          style={{
            backgroundColor: 'var(--provedo-bg-elevated)',
            border: '1px solid var(--provedo-border-subtle)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--provedo-font-mono)',
              fontSize: '11px',
              color: 'var(--provedo-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: 0,
            }}
          >
            By broker
          </p>
          <ul
            aria-label="Allocation by broker"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {BROKER_ROWS.map((row) => (
              <li
                key={row.name}
                style={{
                  fontFamily: 'var(--provedo-font-mono)',
                  fontSize: '14px',
                  color: 'var(--provedo-text-primary)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Brand-voice approved verbatim phrasing (review §3.3 — DO NOT paraphrase):
                    «IBKR · $186k across 5 positions» */}
                <span style={{ fontWeight: 600 }}>{row.name}</span>
                <span aria-hidden="true" style={{ color: 'var(--provedo-text-tertiary)' }}>
                  ·
                </span>
                <span style={{ fontWeight: 600, color: 'var(--provedo-accent-hover)' }}>
                  {row.amount}
                </span>
                <span style={{ color: 'var(--provedo-text-secondary)' }}>
                  across {row.positions} positions
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory visible data caption — WCAG: color-not-only.
          Carries the data when JS or CSS is unavailable. */}
      <p
        style={{
          fontSize: '11px',
          fontFamily: 'var(--provedo-font-mono)',
          color: 'var(--provedo-text-tertiary)',
          marginTop: '8px',
          lineHeight: '1.5',
        }}
        aria-label="Allocation breakdown"
      >
        Tech 58% · Financials 18% · Healthcare 14% · Other 10%
      </p>

      {/* Responsive: switch to 2-column above 640px container width. We can't use
          a media query here (no CSS module), so we attach a class and rely on a
          shared global rule. The default single-column stack stays mobile-friendly. */}
      <style>{`
        @media (min-width: 640px) {
          .allocation-bento {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

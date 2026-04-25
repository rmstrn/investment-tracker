// PnlSparkline — Tab 1 «Why?» inline SVG chart
// Spec: visual spec §2.1 — 30-day P&L with AAPL/TSLA emphasis points
// Accessibility: role="img" + descriptive aria-label (WCAG 2.2 AA)
// Colors: CSS variables only — no hardcoded hex
// Performance: stateless, no hooks, no JS interactivity

export function PnlSparkline(): React.ReactElement {
  // 30-day P&L path — down trend with two sharp drops (AAPL day 8, TSLA day 19)
  // viewBox 0 0 280 120; y-axis: 20=top (+1%), 100=bottom (-5%); 0%=baseline y=28
  // Each x-step = 280/29 ≈ 9.66px per day
  const linePoints =
    '0,28 10,30 19,26 29,24 38,28 48,30 58,28 67,36 77,52 86,64 96,68 106,66 115,60 125,56 134,52 144,54 154,64 163,76 173,88 182,92 192,88 202,84 211,82 221,80 230,80 240,78 250,80 259,82 269,82 279,82';

  return (
    <svg
      viewBox="0 0 280 120"
      width="100%"
      height="120"
      role="img"
      aria-label="Monthly P&L line chart: portfolio down 4.2%, with AAPL drop on day 8 and TSLA drop on day 19"
      style={{ marginTop: '12px', display: 'block' }}
    >
      {/* 0% baseline dashed */}
      <line
        x1="0"
        y1="28"
        x2="280"
        y2="28"
        stroke="var(--provedo-border-subtle)"
        strokeWidth="1"
        strokeDasharray="2,3"
      />

      {/* P&L line */}
      <polyline
        fill="none"
        stroke="var(--provedo-text-secondary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePoints}
      />

      {/* Gradient fill under line */}
      <defs>
        <linearGradient id="pnl-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--provedo-border-subtle)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--provedo-border-subtle)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="url(#pnl-fill)" stroke="none" points={`0,120 ${linePoints} 279,120`} />

      {/* AAPL drop emphasis — day 8 ≈ x=77 */}
      <circle cx="77" cy="52" r="4" fill="var(--provedo-negative)" />
      <text
        x="77"
        y="46"
        fontSize="9"
        fontFamily="var(--provedo-font-mono)"
        fill="var(--provedo-text-tertiary)"
        textAnchor="middle"
      >
        AAPL
      </text>

      {/* TSLA drop emphasis — day 19 ≈ x=182 */}
      <circle cx="182" cy="92" r="4" fill="var(--provedo-negative)" />
      <text
        x="182"
        y="86"
        fontSize="9"
        fontFamily="var(--provedo-font-mono)"
        fill="var(--provedo-text-tertiary)"
        textAnchor="middle"
      >
        TSLA
      </text>

      {/* End label −4.2% */}
      <text
        x="276"
        y="90"
        fontSize="11"
        fontFamily="var(--provedo-font-mono)"
        fill="var(--provedo-negative)"
        textAnchor="end"
        fontWeight="500"
      >
        −4.2%
      </text>

      {/* X-axis labels */}
      <text
        x="0"
        y="114"
        fontSize="9"
        fontFamily="var(--provedo-font-mono)"
        fill="var(--provedo-text-tertiary)"
      >
        Jan 1
      </text>
      <text
        x="240"
        y="114"
        fontSize="9"
        fontFamily="var(--provedo-font-mono)"
        fill="var(--provedo-text-tertiary)"
        textAnchor="end"
      >
        Jan 30
      </text>
    </svg>
  );
}

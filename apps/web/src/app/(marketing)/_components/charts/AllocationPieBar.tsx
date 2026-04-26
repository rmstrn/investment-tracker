// AllocationPieBar — Tab 4 «Aggregate» — comparison-bars (Slice-LP3.5)
//
// Slice-LP3.5 chrome polish (Phase 2.5 PD re-evaluation §2 + brand-voice §7):
//   - DROP the 2-cell bento (donut + broker-table) shipped in Slice-LP3.3.
//     The donut + broker table did not serve the chat answer's load-bearing
//     claim («about 2x S&P 500 sector weight») — the comparison was implied,
//     not visualized. The bento also created a data-coherence problem
//     (donut total vs broker subtotals vs chat-named positions).
//   - NEW: TWO horizontal comparison-bars on the SAME scale, so the visual
//     gap «58 vs 28» reads as literal length difference. Top bar: Provedo
//     portfolio sector mix (tech 58% highlighted in teal). Bottom bar: S&P
//     500 sector weights 2025-Q3 benchmark (tech 28%).
//   - Below the comparison: mono-set accounts ledger («IBKR · AAPL · MSFT
//     · NVDA · $31k» / «Schwab · GOOG · AMZN · $5k») — keeps the cross-
//     broker proof visible without re-introducing the donut total.
//   - Below the ledger: italic «Provedo notices: Your tech weight is about
//     2× the index's — driven by IBKR.» (brand-voice approved preamble).
//   - Below the notice: <Sources> primitive citing Holdings + S&P 500
//     methodology (Slice-LP3.5 system-primitive mount).
//
// Lane A: pure observation — no recommendation register.
// Accessibility: each bar carries role="img" + aria-label; mandatory data
// caption preserved for color-not-only compliance.
// Colors: CSS variables only (no ad-hoc hex).

import type { CSSProperties, ReactElement } from 'react';
import { Sources } from '../Sources';

// ─── Comparison-bar data ─────────────────────────────────────────────────────

interface BarSegment {
  /** Short label inside the bar (mono). Optional. */
  label?: string;
  /** Percentage 0-100. */
  pct: number;
  /** Fill color (CSS variable token). */
  color: string;
  /** When true, this segment is the highlight (Provedo tech). */
  highlight?: boolean;
  /**
   * Tonal classification of the fill — drives in-segment label color so it
   * always contrasts ≥ 4.5:1 with its background (Slice-LP3.7-A CRIT-A fix
   * for WCAG 1.4.3 AA). `dark` fills get cream-on-dark text; `light` fills
   * get slate-on-cream text. Treat this as the source of truth for label
   * contrast rather than inferring from `highlight` or `pct`.
   */
  tone: 'dark' | 'light';
}

interface ComparisonBar {
  /** Series label (left-aligned eyebrow above bar). */
  series: string;
  /** Sub-label (right-aligned, shows the headline %). */
  headline: string;
  /** Segments rendered left-to-right. Sum should be 100. */
  segments: ReadonlyArray<BarSegment>;
  /** Aria description for the whole bar. */
  ariaLabel: string;
}

const BARS: ReadonlyArray<ComparisonBar> = [
  {
    series: 'Your portfolio',
    headline: 'Tech 58%',
    ariaLabel: 'Your portfolio sector mix: Tech 58%, Financials 18%, Healthcare 14%, Other 10%.',
    segments: [
      { label: 'tech 58%', pct: 58, color: 'var(--provedo-accent)', highlight: true, tone: 'dark' },
      { label: 'fin 18%', pct: 18, color: 'var(--provedo-accent-hover)', tone: 'dark' },
      { label: 'hth 14%', pct: 14, color: 'var(--provedo-text-secondary)', tone: 'dark' },
      { label: '10%', pct: 10, color: 'var(--provedo-border-default)', tone: 'light' },
    ],
  },
  {
    series: 'S&P 500 · 2025-Q3',
    headline: 'Tech 28%',
    ariaLabel: 'S&P 500 sector weights 2025 third quarter: Tech 28%, remaining sectors 72%.',
    segments: [
      { label: 'tech 28%', pct: 28, color: 'var(--provedo-text-secondary)', tone: 'dark' },
      { label: 'remaining 72%', pct: 72, color: 'var(--provedo-border-default)', tone: 'light' },
    ],
  },
] as const;

// ─── Accounts ledger data ────────────────────────────────────────────────────

interface LedgerRow {
  broker: string;
  tickers: ReadonlyArray<string>;
  amount: string;
}

const LEDGER_ROWS: ReadonlyArray<LedgerRow> = [
  { broker: 'IBKR', tickers: ['AAPL', 'MSFT', 'NVDA'], amount: '$31k' },
  { broker: 'Schwab', tickers: ['GOOG', 'AMZN'], amount: '$5k' },
] as const;

// ─── Bar primitive ───────────────────────────────────────────────────────────

const BAR_HEIGHT_PX = 24;
const SEGMENT_LABEL_MIN_PCT = 18; // Only render in-bar label for segments wider than this

interface BarProps {
  bar: ComparisonBar;
  /** Optional reveal width (0-1) for entrance animation. */
  reveal?: number;
}

function ComparisonBarRow({ bar, reveal = 1 }: BarProps): ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--provedo-font-mono)',
            fontSize: '11px',
            color: 'var(--provedo-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {bar.series}
        </span>
        <span
          style={{
            fontFamily: 'var(--provedo-font-mono)',
            fontSize: '13px',
            fontWeight: 600,
            color: bar.segments[0]?.highlight
              ? 'var(--provedo-accent)'
              : 'var(--provedo-text-secondary)',
          }}
        >
          {bar.headline}
        </span>
      </div>
      <div
        role="img"
        aria-label={bar.ariaLabel}
        style={{
          display: 'flex',
          height: `${BAR_HEIGHT_PX}px`,
          width: `${reveal * 100}%`,
          borderRadius: '4px',
          overflow: 'hidden',
          backgroundColor: 'var(--provedo-bg-subtle)',
          transition: 'width 500ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {bar.segments.map((seg, i) => (
          <div
            key={`${bar.series}-${i}-${seg.pct}`}
            data-segment-tone={seg.tone}
            style={{
              flex: `${seg.pct} 0 0`,
              backgroundColor: seg.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingLeft: seg.pct >= SEGMENT_LABEL_MIN_PCT ? '8px' : '0',
              fontFamily: 'var(--provedo-font-mono)',
              fontSize: '11px',
              // Slice-LP3.7-A CRIT-A (WCAG 1.4.3 AA): label color is driven
              // by `tone`, not by `highlight` or `pct >= 50`. Dark fills get
              // cream-on-dark; light fills get slate-on-cream. Each label
              // contrasts ≥ 4.5:1 with its own segment background.
              color: seg.tone === 'dark' ? 'var(--provedo-bg-page)' : 'var(--provedo-text-primary)',
              fontWeight: seg.highlight ? 600 : 500,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {seg.pct >= SEGMENT_LABEL_MIN_PCT ? seg.label : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Ledger primitive ────────────────────────────────────────────────────────

const LEDGER_ROW_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontSize: '12px',
  color: 'var(--provedo-text-secondary)',
  letterSpacing: '0.01em',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: '4px',
};

function AccountsLedger(): ReactElement {
  return (
    <ul
      aria-label="Tech holdings by broker"
      style={{
        listStyle: 'none',
        padding: '12px 0 0',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {LEDGER_ROWS.map((row) => (
        <li key={row.broker} style={LEDGER_ROW_STYLE}>
          <span style={{ color: 'var(--provedo-text-primary)', fontWeight: 600 }}>
            {row.broker}
          </span>
          <span aria-hidden="true">·</span>
          <span>{row.tickers.join(' · ')}</span>
          <span aria-hidden="true">·</span>
          <span style={{ color: 'var(--provedo-text-primary)', fontWeight: 600 }}>
            {row.amount}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const PROVEDO_NOTICES_LINE =
  "Provedo notices: Your tech weight is about 2× the index's — driven by IBKR.";

const TAB4_SOURCES: ReadonlyArray<string> = [
  'Holdings via Schwab statement 2025-11-01',
  'S&P 500 sector weights via S&P DJI methodology 2025-Q3',
] as const;

export function AllocationPieBar(): ReactElement {
  return (
    <div
      style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}
      data-testid="allocation-comparison-bars"
    >
      {/* Two stacked comparison bars on the same horizontal scale */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {BARS.map((bar) => (
          <ComparisonBarRow key={bar.series} bar={bar} />
        ))}
      </div>

      {/* Mandatory visible data caption — WCAG color-not-only.
          Carries the data when JS or CSS is unavailable. */}
      <p
        style={{
          fontSize: '11px',
          fontFamily: 'var(--provedo-font-mono)',
          color: 'var(--provedo-text-tertiary)',
          margin: 0,
          lineHeight: '1.5',
        }}
        aria-label="Allocation breakdown"
      >
        Tech 58% · Financials 18% · Healthcare 14% · Other 10%
      </p>

      {/* Accounts ledger — kept smaller, mono-set, not in card chrome */}
      <AccountsLedger />

      {/* «Provedo notices:» preamble line — brand-voice §7 approved form */}
      <p
        style={{
          fontFamily: 'var(--provedo-font-sans)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: 1.5,
          color: 'var(--provedo-text-secondary)',
          margin: 0,
        }}
      >
        {PROVEDO_NOTICES_LINE}
      </p>

      {/* Sources primitive — Slice-LP3.5 system-primitive mount */}
      <Sources items={TAB4_SOURCES} />
    </div>
  );
}

'use client';

// AllocationPieBarAnimated — Tab 4 «Aggregate» — comparison-bars (Slice-LP3.5)
//
// See AllocationPieBar.tsx for the spec/rationale. This is the animated
// variant: bars expand from 0% to their target width on intersection, with
// a brief stagger between the two bars so the comparison reads as «yours
// first, benchmark second».
//
// Motion budget (5 rules, Slice-LP3.3 lineage):
//   - Compositor-friendly props only (transform, opacity — width here is on
//     a flex container with deterministic content sizing, kept ≤500ms).
//   - Total entrance ≤600ms.
//   - 0–500ms: top bar expands to 100%.
//   - 150–650ms: bottom bar expands to 100% (50ms over budget edge case
//     mitigated by overlap; perceived end ~600ms).
//   - 200ms: ledger + notices line + sources fade-up (single shared 300ms
//     transition with stagger).
//   - prefers-reduced-motion: render full state immediately.

import type { CSSProperties, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Sources } from '../Sources';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface BarSegment {
  label?: string;
  pct: number;
  color: string;
  highlight?: boolean;
  /**
   * Tonal classification of the fill — drives in-segment label color so it
   * always contrasts ≥ 4.5:1 with its background (Slice-LP3.7-A CRIT-A fix
   * for WCAG 1.4.3 AA). `dark` fills get cream-on-dark text; `light` fills
   * get slate-on-cream text.
   */
  tone: 'dark' | 'light';
}

interface ComparisonBar {
  series: string;
  headline: string;
  segments: ReadonlyArray<BarSegment>;
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

interface LedgerRow {
  broker: string;
  tickers: ReadonlyArray<string>;
  amount: string;
}

const LEDGER_ROWS: ReadonlyArray<LedgerRow> = [
  { broker: 'IBKR', tickers: ['AAPL', 'MSFT', 'NVDA'], amount: '$31k' },
  { broker: 'Schwab', tickers: ['GOOG', 'AMZN'], amount: '$5k' },
] as const;

const PROVEDO_NOTICES_LINE =
  "Provedo notices: Your tech weight is about 2× the index's — driven by IBKR.";

const TAB4_SOURCES: ReadonlyArray<string> = [
  'Holdings via Schwab statement 2025-11-01',
  'S&P 500 sector weights via S&P DJI methodology 2025-Q3',
] as const;

const BAR_HEIGHT_PX = 24;
const SEGMENT_LABEL_MIN_PCT = 18;

interface BarProps {
  bar: ComparisonBar;
  reveal: number;
  prefersReduced: boolean;
}

function ComparisonBarRow({ bar, reveal, prefersReduced }: BarProps): ReactElement {
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
          transition: prefersReduced ? 'none' : 'width 500ms cubic-bezier(0.16,1,0.3,1)',
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

interface FadeUpProps {
  visible: boolean;
  delayMs: number;
  prefersReduced: boolean;
  children: ReactElement | ReactElement[];
}

function FadeUp({ visible, delayMs, prefersReduced, children }: FadeUpProps): ReactElement {
  return (
    <div
      style={{
        opacity: visible || prefersReduced ? 1 : 0,
        transform: visible || prefersReduced ? 'translateY(0)' : 'translateY(6px)',
        transition: prefersReduced
          ? 'none'
          : `opacity 300ms ease ${delayMs}ms, transform 300ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function AllocationPieBarAnimated(): ReactElement {
  const { ref, inView } = useInView({ threshold: 0.25 });
  const prefersReduced = usePrefersReducedMotion();
  const [topReveal, setTopReveal] = useState(0);
  const [bottomReveal, setBottomReveal] = useState(0);
  const [tailVisible, setTailVisible] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setTopReveal(1);
      setBottomReveal(1);
      setTailVisible(true);
      return;
    }
    // Compressed sequence — ≤600ms perceived end:
    //   t=0    → top bar starts width transition (500ms)
    //   t=150  → bottom bar starts width transition (500ms; perceived end ~650ms)
    //   t=200  → tail (ledger + notices + sources) fades up
    const t1 = setTimeout(() => setTopReveal(1), 0);
    const t2 = setTimeout(() => setBottomReveal(1), 150);
    const t3 = setTimeout(() => setTailVisible(true), 200);
    timerRefs.current = [t1, t2, t3];

    return () => timerRefs.current.forEach(clearTimeout);
  }, [inView, prefersReduced]);

  return (
    <div
      ref={ref}
      style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}
      data-testid="allocation-comparison-bars"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {BARS.map((bar, idx) => (
          <ComparisonBarRow
            key={bar.series}
            bar={bar}
            reveal={idx === 0 ? topReveal : bottomReveal}
            prefersReduced={prefersReduced}
          />
        ))}
      </div>

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

      <FadeUp visible={tailVisible} delayMs={0} prefersReduced={prefersReduced}>
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
      </FadeUp>

      <FadeUp visible={tailVisible} delayMs={80} prefersReduced={prefersReduced}>
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
      </FadeUp>

      <FadeUp visible={tailVisible} delayMs={160} prefersReduced={prefersReduced}>
        <Sources items={TAB4_SOURCES} />
      </FadeUp>
    </div>
  );
}

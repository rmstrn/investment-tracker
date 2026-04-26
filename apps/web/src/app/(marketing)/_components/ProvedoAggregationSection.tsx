'use client';

// ProvedoAggregationSection — §S8 broker marquee restored
// (Slice-LP5-BCD A4, per PD spec §C.S8)
//
// Bold direction (PD spec §C.S8):
//   PO directly: «идея с каруселью была лучше». Restore the marquee but
//   build it as a TWO-ROW OPPOSING-DIRECTION marquee with broker WORDMARKS
//   in mono pills (slate-100 bg, hairline border, rounded-full). Top row
//   scrolls left-to-right; bottom row scrolls right-to-left at slow speed
//   (~40s per loop). On hover the row pauses. Reduced-motion fallback:
//   marquee freezes; the pills stack into a static wrap grid.
//
// Edge fades on left + right hide the raw start/end of the loop.
//
// Implementation:
//   - Pure CSS keyframes — `transform: translateX(-50%)` on a track that
//     contains the broker list duplicated 2× to create a seamless loop.
//   - `will-change: transform` declared on the track only; removed by the
//     browser when not animating (marquee is the section's only kinetic
//     beat — the rest of the page is calm).
//   - Compositor-friendly: only `transform`, no layout-bound props.
//   - prefers-reduced-motion: rows render statically with the SAME pill
//     visual chrome but no animation; the wrap grid pattern handles the
//     extra rows.

import type { CSSProperties, ReactElement } from 'react';
import { ScrollFadeIn } from './ScrollFadeIn';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

const BROKERS: ReadonlyArray<{ label: string; abbr: string }> = [
  { label: 'Interactive Brokers', abbr: 'IBKR' },
  { label: 'Charles Schwab', abbr: 'Schwab' },
  { label: 'Fidelity', abbr: 'Fidelity' },
  { label: 'Coinbase', abbr: 'Coinbase' },
  { label: 'Robinhood', abbr: 'Robinhood' },
  { label: 'E*TRADE', abbr: 'E*TRADE' },
  { label: 'Trading212', abbr: 'T212' },
  { label: 'Questrade', abbr: 'Questrade' },
  { label: 'Wealthsimple', abbr: 'Wealth' },
  { label: 'Binance', abbr: 'Binance' },
  { label: 'Kraken', abbr: 'Kraken' },
  { label: 'Hargreaves Lansdown', abbr: 'HL' },
] as const;

// Display rows — split into two halves so each row has visual variety.
const ROW_1 = BROKERS.slice(0, 6);
const ROW_2 = BROKERS.slice(6, 12);

// Per-pill styling. We render full broker names (label) so each pill carries
// a meaningful word, not an abbreviation — better visual density per PD spec.
const PILL_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: '14px',
  letterSpacing: '0.01em',
  color: 'var(--provedo-text-secondary)',
  backgroundColor: 'var(--provedo-bg-elevated)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--provedo-border-subtle)',
  borderRadius: '9999px',
  padding: '8px 16px',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

interface BrokerPillsTrackProps {
  brokers: ReadonlyArray<{ label: string; abbr: string }>;
  /** «ltr» = scrolls right-to-left (visual movement is leftward); «rtl» = the
   *  inverse. Animation runs in CSS keyframes named accordingly. */
  direction: 'ltr' | 'rtl';
}

function BrokerPillsTrack({ brokers, direction }: BrokerPillsTrackProps): ReactElement {
  // Duplicate the row so translateX(-50%) loops seamlessly without a visible
  // jump at the loop boundary.
  const items = [...brokers, ...brokers];
  const animationName = direction === 'ltr' ? 'provedo-marquee-ltr' : 'provedo-marquee-rtl';

  return (
    <div
      data-testid={`broker-marquee-track-${direction}`}
      className="provedo-marquee-track"
      style={{
        display: 'flex',
        gap: '12px',
        width: 'max-content',
        animation: `${animationName} 50s linear infinite`,
        willChange: 'transform',
      }}
    >
      {items.map((b, idx) => (
        <span
          // The duplicate set carries `aria-hidden` so SR users hear the
          // broker list once, not twice.
          key={`${b.abbr}-${idx}`}
          aria-hidden={idx >= brokers.length ? 'true' : undefined}
          style={PILL_STYLE}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}

// Static fallback (prefers-reduced-motion + no-JS): the same pills wrapped in
// a flex-wrap grid so all brokers are visible without motion.
function StaticBrokerWrap(): ReactElement {
  return (
    <ul
      data-testid="broker-typeset-list"
      aria-label="Supported brokers and exchanges"
      className="flex flex-wrap justify-center gap-3"
      style={{ listStyle: 'none', padding: 0, margin: 0 }}
    >
      {BROKERS.map((b) => (
        <li key={b.abbr} aria-label={b.label} style={PILL_STYLE}>
          {b.label}
        </li>
      ))}
    </ul>
  );
}

export function ProvedoAggregationSection(): ReactElement {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="aggregation-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-page)' }}
    >
      {/* Inline keyframes — kept local so the marquee CSS does not leak into
          a global stylesheet. `transform: translateX(-50%)` loops the
          duplicated track seamlessly.
          Hover pauses the animation per PD spec («pause on hover»). */}
      <style>{`
        @keyframes provedo-marquee-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes provedo-marquee-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .provedo-marquee-row:hover .provedo-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .provedo-marquee-track {
            animation: none !important;
          }
        }
      `}</style>

      <ScrollFadeIn>
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="aggregation-heading"
            className="text-2xl font-semibold tracking-tight md:text-4xl"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            One chat holds everything.
          </h2>
          <p
            className="mt-4 text-base leading-relaxed md:text-lg"
            style={{ color: 'var(--provedo-text-secondary)' }}
          >
            Hundreds of brokers and exchanges, in one place — Provedo reads them all.
          </p>
        </div>
      </ScrollFadeIn>

      {/* Marquee or static fallback. Both render the same pill chrome so the
          visual language reads consistently regardless of motion preference. */}
      <ScrollFadeIn>
        <div
          data-testid="broker-marquee-container"
          className="mx-auto mt-12 md:mt-16"
          style={{
            maxWidth: '1280px',
            position: 'relative',
            // Edge fades — left + right 64px gradient masks fade to bg-page
            // so the marquee doesn't visibly start/end at the viewport edges.
            maskImage:
              'linear-gradient(to right, transparent 0%, black 64px, black calc(100% - 64px), transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 64px, black calc(100% - 64px), transparent 100%)',
            overflow: 'hidden',
          }}
          aria-label="Supported brokers and exchanges"
        >
          {prefersReduced ? (
            <StaticBrokerWrap />
          ) : (
            <div className="flex flex-col gap-4">
              {/* Row 1 — scrolls right-to-left */}
              <div className="provedo-marquee-row">
                <BrokerPillsTrack brokers={ROW_1} direction="ltr" />
              </div>
              {/* Row 2 — scrolls left-to-right (opposing direction) */}
              <div className="provedo-marquee-row">
                <BrokerPillsTrack brokers={ROW_2} direction="rtl" />
              </div>
            </div>
          )}
        </div>

        <p
          className="mt-6 text-center"
          style={{
            fontFamily: 'var(--provedo-font-mono)',
            fontSize: '13px',
            color: 'var(--provedo-text-tertiary)',
            fontStyle: 'italic',
          }}
          data-testid="broker-list-tail"
        >
          — and growing
        </p>
      </ScrollFadeIn>
    </section>
  );
}

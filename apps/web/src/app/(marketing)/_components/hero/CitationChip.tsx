'use client';

// CitationChip — Slice-LP3.6 §4 typographic primitive
//
// Replaces the retired L3 BrokerPieMockup. Carries the «every observation is
// sourced» promise as typographic claim, grounded in the SAME brokers the L1
// receipt's Sources line cites — the chip closes the receipt by naming where
// Provedo pulls from. PD reeval §1.3 documented that the orphan donut at 0.6
// opacity (hidden mobile) was the third-weakest place to carry the multi-
// broker signal; a typographic chip is stronger because it composes with the
// receipt instead of standing alone as a chart widget.
//
// Data-coherence (PD §10.1 open Q1 — option B):
//   IBKR · Schwab — 2 brokers
//   Coinbase appears in the retired pie but NEVER in the chat answer. Using
//   only IBKR + Schwab matches the chat's verbatim sources line («holdings
//   via Schwab statement») and the AAPL/TSLA/«26 other positions» implication
//   that ties to IBKR + Schwab. Page-level coherence: every chat surface that
//   names brokers names exactly these two (Tab 4 «How much tech am I holding
//   across IBKR + Schwab?»; the broader «1000+ brokers» scope is carried by
//   the §S2 proof bar and §S8 typeset list, not by this chip).
//
// Animation (PD §4.3):
//   - 240ms opacity 0→1 + translateY(4px → 0)
//   - Fires when the receipt completes typing (parent passes `isComplete`)
//   - 120ms delay so the chip lands just AFTER the L1 sources-line settles —
//     reinforces the «sources are explained by where they came from» reading
//   - Replays on intersection re-entry (parent resets `isComplete` to false
//     when ChatMockup transitions back to a non-done phase)
//   - Static under prefers-reduced-motion
//
// Lucide audit (PD §10.3): Layers3 is exported by lucide-react@0.468 as an
// alias of Layers. The icon is 3 path elements (~250 bytes raw). Inlining
// the SVG keeps the bundle delta favorable (avoids pulling the lucide barrel
// for one icon — even with tree-shaking the wrapper helper costs ~0.3 kB).
//
// A11y: presentational, not interactive. Icon is aria-hidden. The chip text
// is read in full as part of the receipt's <footer> per spec §6.1.

import type { ReactElement } from 'react';

interface CitationChipProps {
  /** True once the L1 ChatMockup typing sequence has completed. Drives the
   *  240ms entrance animation. Reset to false on intersection re-entry. */
  isComplete: boolean;
  /** Skip the entrance animation. */
  prefersReduced: boolean;
  /** Optional className for layout (margin, alignment). */
  className?: string;
}

const ENTRANCE_DELAY_MS = 120;
const ENTRANCE_DURATION_MS = 240;

function Layers3Icon(): ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </svg>
  );
}

export function CitationChip({
  isComplete,
  prefersReduced,
  className,
}: CitationChipProps): ReactElement {
  const shouldAnimate = !prefersReduced;
  const isVisible = isComplete || prefersReduced;

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--provedo-bg-elevated)',
    borderColor: 'var(--provedo-border-subtle)',
    color: 'var(--provedo-text-tertiary)',
    // Compositor-friendly entrance — opacity + translateY only.
    opacity: shouldAnimate ? (isVisible ? 1 : 0) : 1,
    transform: shouldAnimate ? (isVisible ? 'translateY(0)' : 'translateY(4px)') : 'translateY(0)',
    transition: shouldAnimate
      ? `opacity ${ENTRANCE_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) ${ENTRANCE_DELAY_MS}ms,` +
        ` transform ${ENTRANCE_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) ${ENTRANCE_DELAY_MS}ms`
      : 'none',
  };

  return (
    <footer aria-label="Sources" className={className}>
      <span
        data-testid="hero-citation-chip"
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
        style={containerStyle}
      >
        <Layers3Icon />
        <span
          style={{
            fontFamily: 'var(--provedo-font-mono)',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--provedo-text-secondary)',
          }}
        >
          IBKR · Schwab
        </span>
        <span
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontSize: '12px',
            fontWeight: 400,
            color: 'var(--provedo-text-tertiary)',
          }}
        >
          — 2 brokers
        </span>
      </span>
    </footer>
  );
}

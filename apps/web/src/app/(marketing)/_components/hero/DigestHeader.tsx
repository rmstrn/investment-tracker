// DigestHeader — Slice-LP3.6 §3 typographic primitive
//
// Replaces the retired L2 InsightFeedMockup. Carries the brand promise of
// «continuous observation cadence» as a header for the receipt below — not as
// a competing product surface (which is how the orphan feed read in user
// audits per PD reeval §0 Finding 3).
//
// Voice (PD spec §3.1, brand-voice scope):
//   - Eyebrow «THIS WEEK» — small-caps, tertiary, 11px
//   - Tagline «3 observations across your portfolio» — secondary, 14px sans
//   - Numeral «3» in JBM-mono — composition signature ties the header to the
//     receipt below (every numeric token in the receipt is mono-set)
//
// Animation: NONE on initial render (PD §3.3) — header sets the frame BEFORE
// the receipt's typing animation starts, so it must already be visible. Sage
// register also forbids decorative header animation.
//
// A11y: real readable content (NOT aria-hidden). Renders inside the receipt-
// system <aside> as a <header> child so screen-readers read it as part of the
// receipt's introduction.

import type { ReactElement } from 'react';

interface DigestHeaderProps {
  /** Optional className for layout (margin, max-width). */
  className?: string;
}

export function DigestHeader({ className }: DigestHeaderProps): ReactElement {
  return (
    <header data-testid="hero-digest-header" className={className}>
      <p
        className="text-[11px] font-medium uppercase"
        style={{
          color: 'var(--provedo-text-tertiary)',
          letterSpacing: '0.16em',
          margin: 0,
        }}
      >
        This week
      </p>
      <p
        className="mt-1 text-sm leading-snug"
        style={{
          color: 'var(--provedo-text-secondary)',
          fontFamily: 'var(--provedo-font-sans)',
          fontWeight: 400,
          margin: '4px 0 0 0',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--provedo-font-mono)',
            fontWeight: 500,
            color: 'var(--provedo-text-primary)',
          }}
        >
          3
        </span>{' '}
        observations across your portfolio
      </p>
    </header>
  );
}

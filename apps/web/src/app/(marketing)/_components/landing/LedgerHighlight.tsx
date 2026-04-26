'use client';

// LedgerHighlight — Landing-v2 §C.1
//
// Wraps the highlighted value in a ledger row (e.g. `+4.2pp`) and renders the
// pen-mark underline beneath it. The underline animation timing is owned by
// the parent (LandingHero) which passes `active` once the hero load timeline
// reaches t=1.7s.

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { PenMarkUnderline } from './PenMarkUnderline';

interface LedgerHighlightProps {
  children: ReactNode;
  /** true triggers the draw-in animation. Owned by the hero's load timeline. */
  active: boolean;
  /** Skip animation under reduced motion. */
  prefersReduced?: boolean;
}

export function LedgerHighlight({
  children,
  active,
  prefersReduced = false,
}: LedgerHighlightProps): ReactElement {
  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    paddingBottom: '2px',
  };

  return (
    <span data-testid="ledger-highlight" style={wrapperStyle}>
      {children}
      <PenMarkUnderline active={active} prefersReduced={prefersReduced} />
    </span>
  );
}

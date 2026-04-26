'use client';

// PenMarkUnderline — Landing-v2 §C.4
//
// A reusable animated underline that draws left-to-right. Used on the `+4.2pp`
// value in the ledger drift row. Implementation: an absolute-positioned
// <span> sibling beneath the parent's text content, animated via clip-path
// (compositor-friendly).
//
// Reduced-motion: clip-path collapses to inset(0 0 0 0) immediately; no
// transition — the underline is rendered fully drawn from first paint.

import type { CSSProperties, ReactElement } from 'react';

interface PenMarkUnderlineProps {
  /** true triggers the draw-in animation (left → right) */
  active: boolean;
  /** default 360 — the spec's hero choreography duration */
  durationMs?: number;
  /** default teal-600 token */
  color?: string;
  /** default 1.5 — line thickness */
  thickness?: number;
  /** caller-controlled — bypass animation entirely */
  prefersReduced?: boolean;
}

export function PenMarkUnderline({
  active,
  durationMs = 360,
  color = 'var(--provedo-accent)',
  thickness = 1.5,
  prefersReduced = false,
}: PenMarkUnderlineProps): ReactElement {
  // When the user has reduced-motion on OR the parent has not yet fired the
  // active flag, we still render the underline — but we hide it under reduced
  // mode by clamping to fully visible immediately if active, fully invisible
  // otherwise. Reduced-motion never sees the draw transition.
  const shouldShow = active;
  const transitionValue = prefersReduced
    ? 'none'
    : `clip-path ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;

  const style: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '-2px',
    height: `${thickness}px`,
    backgroundColor: color,
    pointerEvents: 'none',
    clipPath: shouldShow ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
    transition: transitionValue,
    willChange: prefersReduced ? 'auto' : 'clip-path',
  };

  return <span aria-hidden="true" data-testid="pen-mark-underline" style={style} />;
}

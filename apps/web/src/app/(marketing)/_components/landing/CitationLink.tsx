'use client';

// CitationLink — Landing-v2 §C.2
//
// Inline superscript chip linking a conversation message to a ledger row.
// Hover/focus syncs with the parent two-pane state via callbacks; click smooth-
// scrolls to the ledger anchor target.
//
// Visual: small superscript `¹` rendered before (or in place of) the inline
// number. Color: teal-600. Active state (isActive=true): teal-700 + faint
// underline draw beneath (140ms).
//
// A11y: real <a href="#anchor"> element. Tab brings focus, Enter navigates.

import type { CSSProperties, KeyboardEvent, ReactElement } from 'react';

interface CitationLinkProps {
  /** Numeric label rendered inside the chip — typically 1, 2, 3... */
  index: number;
  /** Anchor target id (without leading #) for the ledger row. */
  targetId: string;
  /** True when the linked ledger row is currently hovered/focused. */
  isActive?: boolean;
  /** Hover-in / focus handler — bubbles up to LandingHero. */
  onActivate?: () => void;
  /** Hover-out / blur handler. */
  onDeactivate?: () => void;
  /** Skip the underline draw transition under reduced motion. */
  prefersReduced?: boolean;
}

export function CitationLink({
  index,
  targetId,
  isActive = false,
  onActivate,
  onDeactivate,
  prefersReduced = false,
}: CitationLinkProps): ReactElement {
  const color = isActive ? 'var(--provedo-accent-hover)' : 'var(--provedo-accent)';

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Smooth-scroll the target into view (within the hero or up the page on
    // mobile stacked layout). Falls back to default anchor jump if smooth
    // scroll is unsupported or reduced motion is on.
    if (typeof document === 'undefined') return;
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'center',
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLAnchorElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const target = typeof document !== 'undefined' ? document.getElementById(targetId) : null;
      if (target) {
        target.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    }
  }

  const style: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    fontFamily: 'var(--provedo-font-sans)',
    fontWeight: 600,
    fontSize: '11px',
    lineHeight: 1,
    color,
    verticalAlign: 'super',
    textDecoration: 'none',
    marginRight: '1px',
    cursor: 'pointer',
    transition: prefersReduced ? 'none' : 'color 140ms ease-out',
    outlineOffset: '2px',
  };

  const underlineStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '-1px',
    height: '1px',
    backgroundColor: color,
    transformOrigin: 'left',
    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
    transition: prefersReduced ? 'none' : 'transform 140ms ease-out',
    pointerEvents: 'none',
  };

  return (
    <a
      href={`#${targetId}`}
      data-testid={`citation-link-${index}`}
      data-citation-target={targetId}
      data-citation-active={isActive ? 'true' : 'false'}
      aria-label={`Citation ${index} — jump to ledger entry`}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      {index}
      <span aria-hidden="true" style={underlineStyle} />
    </a>
  );
}

// DifferentiatorCard — Landing-v2 §B.4
//
// Single 3-card primitive used by LandingDifferentiators. Each card carries
// a numeral (`01`, `02`, `03`), a header, and a body. Hover lift retained
// even under reduced motion (compositor-friendly transform).
//
// Numeral color: var(--provedo-accent) (teal-600) — the only spot of accent
// inside the card.

import type { CSSProperties, ReactElement } from 'react';

interface DifferentiatorCardProps {
  numeral: string;
  header: string;
  body: string;
}

const CARD_STYLE: CSSProperties = {
  backgroundColor: 'var(--provedo-bg-elevated)',
  border: '1px solid var(--provedo-border-subtle)',
  borderRadius: '8px',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  transition: 'transform 180ms ease-out, border-color 180ms ease-out',
};

const NUMERAL_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: '14px',
  letterSpacing: '0.04em',
  color: 'var(--provedo-accent)',
  margin: 0,
};

const HEADER_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 600,
  fontSize: '22px',
  lineHeight: 1.25,
  letterSpacing: '-0.01em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
};

const BODY_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '15px',
  lineHeight: 1.6,
  color: 'var(--provedo-text-secondary)',
  margin: 0,
};

export function DifferentiatorCard({
  numeral,
  header,
  body,
}: DifferentiatorCardProps): ReactElement {
  return (
    <article
      data-testid={`differentiator-card-${numeral}`}
      className="differentiator-card"
      style={CARD_STYLE}
    >
      <style>{`
        .differentiator-card:hover {
          transform: translateY(-2px);
          border-color: #CBD5E1 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .differentiator-card { transition: border-color 180ms ease-out !important; }
          .differentiator-card:hover { transform: none; }
        }
      `}</style>
      <span aria-hidden="true" style={NUMERAL_STYLE}>
        {numeral}
      </span>
      <h3 style={HEADER_STYLE}>{header}</h3>
      <p style={BODY_STYLE}>{body}</p>
    </article>
  );
}

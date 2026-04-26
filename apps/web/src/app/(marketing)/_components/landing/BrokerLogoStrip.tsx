// BrokerLogoStrip — Landing-v2 §B.3
//
// Per right-hand resolution #3, broker logos render as styled wordmark TEXT
// (Inter Medium 14px, slate-400 default) — NOT real SVG logos. This avoids
// any third-party trademark exposure pre-alpha. Real logo SVGs can swap in
// later via a single asset PR; the layout is identical.
//
// Server component — no interactivity except CSS hover (color shift slate-400
// → slate-900). Hover transition 180ms ease-out.

import type { CSSProperties, ReactElement } from 'react';

export interface BrokerWordmark {
  name: string;
  href?: string;
}

interface BrokerLogoStripProps {
  wordmarks: ReadonlyArray<BrokerWordmark>;
  className?: string;
}

const GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '12px',
  width: '100%',
};

const CELL_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '52px',
  backgroundColor: 'var(--provedo-bg-elevated)',
  border: '1px solid var(--provedo-border-subtle)',
  borderRadius: '6px',
  textDecoration: 'none',
  transition: 'border-color 180ms ease-out, color 180ms ease-out',
};

const TEXT_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 500,
  fontSize: '14px',
  letterSpacing: '-0.005em',
  color: '#94A3B8',
  transition: 'color 180ms ease-out',
};

export function BrokerLogoStrip({ wordmarks, className }: BrokerLogoStripProps): ReactElement {
  return (
    <div
      data-testid="broker-logo-strip"
      className={`broker-logo-strip ${className ?? ''}`}
      style={GRID_STYLE}
    >
      <style>{`
        .broker-logo-strip > .broker-cell:hover {
          border-color: #CBD5E1 !important;
        }
        .broker-logo-strip > .broker-cell:hover > .broker-text {
          color: var(--provedo-text-primary) !important;
        }
        .broker-logo-strip > .broker-cell:focus-visible {
          outline: 2px solid var(--provedo-accent);
          outline-offset: 2px;
        }
        @media (max-width: 480px) {
          .broker-logo-strip { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
      `}</style>
      {wordmarks.map((mark) => {
        const Tag = mark.href ? 'a' : 'div';
        return (
          <Tag
            key={mark.name}
            className="broker-cell"
            data-testid={`broker-cell-${mark.name.toLowerCase().replace(/\W+/g, '-')}`}
            href={mark.href}
            aria-label={mark.href ? `${mark.name} integration` : undefined}
            style={CELL_STYLE}
          >
            <span className="broker-text" style={TEXT_STYLE}>
              {mark.name}
            </span>
          </Tag>
        );
      })}
    </div>
  );
}

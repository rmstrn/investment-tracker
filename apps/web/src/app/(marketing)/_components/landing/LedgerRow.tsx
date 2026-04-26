'use client';

// LedgerRow — Landing-v2 §C.1
//
// A single typeset row inside the Ledger card. Layout:
//   [account label · context tag] ............................ [value]
//
// Tabular numerals on the value column so digits align across rows.
// When `highlight` is true and `citationId` is provided, the row exposes
// hover/focus that bubbles to the parent (LandingHero) via the activation
// callbacks for the two-pane citation cross-link.

import type { CSSProperties, ReactElement, ReactNode } from 'react';

export interface LedgerRowData {
  id: string;
  label: string;
  context?: string;
  value: string;
  highlight?: boolean;
  citationId?: string;
  trailingGlyph?: string;
  bold?: boolean;
}

interface LedgerRowProps {
  row: LedgerRowData;
  /** id consumed by CitationLink anchor target — when row.citationId is set. */
  anchorId?: string;
  /** True when the citation chip linked to this row is active (hover sync). */
  isCitationActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  /** Render slot for the highlighted value (wraps `value` with PenMark). */
  valueRender?: (value: string) => ReactNode;
}

export function LedgerRow({
  row,
  anchorId,
  isCitationActive = false,
  onActivate,
  onDeactivate,
  valueRender,
}: LedgerRowProps): ReactElement {
  const rowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'baseline',
    gap: '12px',
    padding: '8px 0',
    backgroundColor: isCitationActive ? 'rgba(13, 148, 136, 0.06)' : 'transparent',
    transition: 'background-color 180ms ease-out',
    borderRadius: '4px',
    paddingLeft: isCitationActive ? '8px' : '0',
    paddingRight: isCitationActive ? '8px' : '0',
    marginLeft: isCitationActive ? '-8px' : '0',
    marginRight: isCitationActive ? '-8px' : '0',
  };

  const labelStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    fontFamily: 'var(--provedo-font-sans)',
    fontWeight: row.bold ? 600 : 500,
    fontSize: '14px',
    lineHeight: 1.5,
    letterSpacing: '-0.005em',
    color: 'var(--provedo-text-primary)',
  };

  const contextStyle: CSSProperties = {
    fontFamily: 'var(--provedo-font-mono)',
    fontWeight: 400,
    fontSize: '11px',
    lineHeight: 1.5,
    letterSpacing: '0.04em',
    color: 'var(--provedo-text-tertiary)',
  };

  const valueStyle: CSSProperties = {
    fontFamily: 'var(--provedo-font-mono)',
    fontWeight: row.bold ? 600 : 500,
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'var(--provedo-text-primary)',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      id={anchorId}
      data-testid={`ledger-row-${row.id}`}
      data-row-active={isCitationActive ? 'true' : 'false'}
      style={rowStyle}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      tabIndex={row.citationId ? 0 : undefined}
    >
      <span style={labelStyle}>
        <span>{row.label}</span>
        {row.context && (
          <span style={contextStyle} aria-hidden="true">
            · {row.context}
          </span>
        )}
      </span>
      <span style={valueStyle}>
        {valueRender ? valueRender(row.value) : row.value}
        {row.trailingGlyph && (
          <span style={{ marginLeft: '8px', color: 'var(--provedo-text-tertiary)' }}>
            {row.trailingGlyph}
          </span>
        )}
      </span>
    </div>
  );
}

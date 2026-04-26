'use client';

// Ledger — Landing-v2 §C.1
//
// Left pane of the «Ledger That Talks» hero. Visual register: typeset ledger
// card, NOT a SaaS dashboard. Closer to a printed quarterly statement than a
// financial chart panel.
//
// Includes 3 account rows + divider + total row + 3 observation rows. The
// "Top drift" row carries a citation anchor (`ledger-row-nvda`) and the pen-
// mark underline on its value (`+4.2pp`).

import type { CSSProperties, ReactElement } from 'react';
import { LedgerHighlight } from './LedgerHighlight';
import { LedgerRow, type LedgerRowData } from './LedgerRow';

const ACCOUNT_ROWS: ReadonlyArray<LedgerRowData> = [
  { id: 'ibkr', label: 'IBKR', context: 'US', value: '$312,000' },
  { id: 't212', label: 'Trading 212', context: 'EU', value: '€84,000' },
  { id: 'krak', label: 'Kraken', context: 'Crypto', value: '$19,000' },
];

const TOTAL_ROW: LedgerRowData = {
  id: 'total',
  label: 'Total',
  value: '$431,000',
  bold: true,
};

const OBSERVATION_ROWS: ReadonlyArray<LedgerRowData> = [
  {
    id: 'drift',
    label: 'Top drift',
    context: 'NVDA',
    value: '+4.2pp',
    highlight: true,
    citationId: 'cite-nvda-1',
    trailingGlyph: '◐',
  },
  { id: 'div', label: 'Dividends', context: 'Apr 28', value: '$312' },
  { id: 'fx', label: 'Currency exposure', value: '71% USD' },
];

interface LedgerProps {
  /** True once the hero load timeline reaches t=1.7s — triggers the pen-mark draw. */
  penMarkActive: boolean;
  /** Active citation id from the parent's two-pane shared state. */
  activeCitationId: string | null;
  /** Called when the drift row gains hover/focus. */
  onCitationActivate: (id: string) => void;
  /** Called when the drift row loses hover/focus. */
  onCitationDeactivate: () => void;
  prefersReduced?: boolean;
}

const CARD_STYLE: CSSProperties = {
  position: 'relative',
  backgroundColor: 'var(--provedo-bg-elevated)',
  border: '1px solid var(--provedo-border-subtle)',
  borderRadius: '8px',
  padding: '28px',
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
  zIndex: 1,
};

const CARD_LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 400,
  fontSize: '11px',
  letterSpacing: '0.04em',
  color: '#94A3B8',
  margin: 0,
  marginBottom: '16px',
  lineHeight: 1.4,
};

const DIVIDER_STYLE: CSSProperties = {
  height: '1px',
  backgroundColor: 'var(--provedo-border-subtle)',
  margin: '8px 0',
};

const SEPARATOR_STYLE: CSSProperties = {
  height: '1px',
  backgroundColor: 'var(--provedo-border-subtle)',
  margin: '16px 0',
  opacity: 0.6,
};

export function Ledger({
  penMarkActive,
  activeCitationId,
  onCitationActivate,
  onCitationDeactivate,
  prefersReduced = false,
}: LedgerProps): ReactElement {
  return (
    <aside aria-label="Sample portfolio ledger" data-testid="ledger-card" style={CARD_STYLE}>
      <p style={CARD_LABEL_STYLE}>portfolio.ledger</p>

      {ACCOUNT_ROWS.map((row) => (
        <LedgerRow key={row.id} row={row} />
      ))}

      <div style={DIVIDER_STYLE} aria-hidden="true" />

      <LedgerRow row={TOTAL_ROW} />

      <div style={SEPARATOR_STYLE} aria-hidden="true" />

      {OBSERVATION_ROWS.map((row) => {
        const isHighlighted = row.highlight === true;
        const anchorId = row.citationId ? 'ledger-row-nvda' : undefined;
        const isActive = isHighlighted && activeCitationId === row.citationId;
        return (
          <LedgerRow
            key={row.id}
            row={row}
            anchorId={anchorId}
            isCitationActive={isActive}
            onActivate={
              isHighlighted && row.citationId
                ? () => onCitationActivate(row.citationId as string)
                : undefined
            }
            onDeactivate={isHighlighted ? onCitationDeactivate : undefined}
            valueRender={
              isHighlighted
                ? (value) => (
                    <LedgerHighlight active={penMarkActive} prefersReduced={prefersReduced}>
                      {value}
                    </LedgerHighlight>
                  )
                : undefined
            }
          />
        );
      })}
    </aside>
  );
}

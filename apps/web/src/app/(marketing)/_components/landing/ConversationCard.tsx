'use client';

// ConversationCard — Landing-v2 §C.2
//
// Right pane of the «Ledger That Talks» hero. Minimal-chrome chat surface,
// purpose-built for editorial register. NOT the existing ChatAppShell (which
// has 48px header + status pill + 120px outer halo — too «SaaS app»).
//
// Layout:
//   [conversation label]
//   ↳ user question
//   Provedo answer (with inline ¹ citation chip on +4.2pp)
//   ── Sources ──
//   Source line

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { Sources } from '../Sources';

interface ConversationCardProps {
  /** Lowercase mono label, e.g. `conversation`. Default: `conversation`. */
  label?: string;
  /** Source line items (e.g. `IBKR · positions · today`). */
  sources: ReadonlyArray<string>;
  children: ReactNode;
  className?: string;
}

const CARD_STYLE: CSSProperties = {
  position: 'relative',
  backgroundColor: 'var(--provedo-bg-elevated)',
  border: '1px solid var(--provedo-border-subtle)',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 400,
  fontSize: '11px',
  letterSpacing: '0.04em',
  color: '#94A3B8',
  margin: 0,
  marginBottom: '0',
  lineHeight: 1.4,
};

export function ConversationCard({
  label = 'conversation',
  sources,
  children,
  className,
}: ConversationCardProps): ReactElement {
  return (
    <aside
      aria-label="Sample Provedo conversation"
      data-testid="conversation-card"
      className={className}
      style={CARD_STYLE}
    >
      <p style={LABEL_STYLE}>{label}</p>
      {children}
      <Sources items={sources} />
    </aside>
  );
}

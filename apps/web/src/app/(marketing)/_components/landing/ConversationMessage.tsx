'use client';

// ConversationMessage — Landing-v2 §C.2
//
// A single message inside the ConversationCard. Two variants:
//   - user: JBM Mono with `↳` prefix, secondary slate
//   - provedo: Inter, primary slate, supports inline children with citation
//     chips
//
// Provedo answers carry aria-live=polite so SR users hear the streamed text
// once on first render. The user message is plain (no live region — static).

import type { CSSProperties, ReactElement, ReactNode } from 'react';

interface ConversationMessageProps {
  variant: 'user' | 'provedo';
  children: ReactNode;
  /** Optional className for layout. */
  className?: string;
  /** When true and variant=provedo, surfaces an aria-live=polite region. */
  isLive?: boolean;
}

const USER_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: 1.55,
  color: 'var(--provedo-text-secondary)',
  margin: 0,
  whiteSpace: 'pre-wrap',
};

const PROVEDO_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.6,
  letterSpacing: '-0.005em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
  whiteSpace: 'pre-wrap',
};

export function ConversationMessage({
  variant,
  children,
  className,
  isLive = false,
}: ConversationMessageProps): ReactElement {
  const style = variant === 'user' ? USER_STYLE : PROVEDO_STYLE;
  const ariaProps = variant === 'provedo' && isLive ? { 'aria-live': 'polite' as const } : {};

  if (variant === 'user') {
    return (
      <p data-testid="conversation-message-user" className={className} style={style}>
        <span aria-hidden="true">↳ </span>
        {children}
      </p>
    );
  }

  return (
    <p
      data-testid="conversation-message-provedo"
      className={className}
      style={style}
      {...ariaProps}
    >
      {children}
    </p>
  );
}

'use client';

// ChatAppShell — Slice-LP5-A §K.1.b shared chrome primitive
//
// The picture-first hero + the S4 two-teaser bento both render Provedo's
// answer surface as a floating chat-application card. This module owns the
// shared chrome (header bar with avatar + status pill, message-area slot,
// optional sources/footer slot, three-layer drop shadow + 120px outer
// teal-glow ambient halo, layout-shift min-height lock).
//
// PD spec §D.1 + §K.1.b reference points:
//   - 48px header bar with «◉ Provedo · live» pattern
//   - Teal avatar disk with «P» mark
//   - Bordered rounded card (border-subtle, rounded-2xl)
//   - Three-layer drop shadow + mandatory 120px outer teal-glow halo
//     (was opt-in at 80px in §D.1; §K.1.b mandates the stronger glow so
//     the shell visually «sits in» the hero atmosphere)
//   - Min-height lock: 440px desktop / 400px mobile for the hero variant;
//     ~440px aligned baselines for the S4 teasers
//
// A11y:
//   - <article aria-label="..."> wrapper carrying caller-provided label
//   - Header bar carries semantic <header> with status announced via <span>
//     visually + aria-label on the live dot (so SR users hear «status: live»)
//   - Message area is a slot — caller controls aria-live and content roles
//
// Not exported from this file: the chat content (user bubble, response bubble,
// typing dots, mono-token pills). Those are caller-owned so the hero and the
// teaser variants can shape their own message bodies while sharing the chrome.

import type { CSSProperties, ReactElement, ReactNode } from 'react';

interface ChatAppShellProps {
  /** Header title text rendered next to the avatar (e.g. «Provedo», «Why?»). */
  headerTitle: string;
  /** Required aria-label for the outer <article> wrapper. */
  ariaLabel: string;
  /** Status pill text (default: «live»). */
  statusLabel?: string;
  /** Min-height lock for the inner message area (CSS string). */
  messageMinHeight?: string;
  /** Optional className for layout (margin, max-width). */
  className?: string;
  /** Body slot — user bubble + Provedo response. */
  children: ReactNode;
}

// Shell chrome — three-layer drop shadow + mandatory 120px outer teal halo.
// Layered shadows render compositor-friendly (no DOM nodes, no scroll handlers).
const SHELL_BOX_SHADOW = [
  '0 1px 2px rgba(15, 23, 42, 0.04)',
  '0 8px 24px rgba(15, 23, 42, 0.08)',
  '0 24px 48px rgba(15, 23, 42, 0.06)',
  '0 0 120px rgba(13, 148, 136, 0.08)',
].join(', ');

const HEADER_HEIGHT_PX = 48;

function StatusDot({ label }: { label: string }): ReactElement {
  return (
    <span
      data-testid="chat-app-shell-status-pill"
      className="inline-flex items-center gap-1.5"
      style={{
        fontFamily: 'var(--provedo-font-sans)',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--provedo-text-tertiary)',
        letterSpacing: '0.01em',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '9999px',
          backgroundColor: 'var(--provedo-positive)',
          boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.12)',
          display: 'inline-block',
        }}
      />
      <span aria-label={`status: ${label}`}>{label}</span>
    </span>
  );
}

function AvatarDisc(): ReactElement {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center"
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '9999px',
        backgroundColor: 'var(--provedo-accent)',
        color: '#FFFFFF',
        fontFamily: 'var(--provedo-font-sans)',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.01em',
        flexShrink: 0,
      }}
    >
      P
    </span>
  );
}

export function ChatAppShell({
  headerTitle,
  ariaLabel,
  statusLabel = 'live',
  messageMinHeight,
  className,
  children,
}: ChatAppShellProps): ReactElement {
  const shellStyle: CSSProperties = {
    backgroundColor: 'var(--provedo-bg-elevated)',
    borderColor: 'var(--provedo-border-subtle)',
    boxShadow: SHELL_BOX_SHADOW,
  };

  const headerStyle: CSSProperties = {
    height: `${HEADER_HEIGHT_PX}px`,
    borderBottom: '1px solid var(--provedo-border-subtle)',
    backgroundColor: 'var(--provedo-bg-elevated)',
  };

  const messageAreaStyle: CSSProperties = messageMinHeight ? { minHeight: messageMinHeight } : {};

  return (
    <article
      aria-label={ariaLabel}
      data-testid="chat-app-shell"
      className={`overflow-hidden rounded-2xl border ${className ?? ''}`}
      style={shellStyle}
    >
      <header
        data-testid="chat-app-shell-header"
        className="flex items-center justify-between gap-3 px-4"
        style={headerStyle}
      >
        <div className="flex items-center gap-2.5">
          <AvatarDisc />
          <span
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--provedo-text-primary)',
              letterSpacing: '-0.005em',
            }}
          >
            {headerTitle}
          </span>
        </div>
        <StatusDot label={statusLabel} />
      </header>

      <div
        data-testid="chat-app-shell-body"
        className="px-4 py-4 md:px-5 md:py-5"
        style={messageAreaStyle}
      >
        {children}
      </div>
    </article>
  );
}

'use client';

// TypingDots — Slice-LP5-A §K.1.a + §D.4 typing indicator
//
// Renders 3 slate-400 dots (6px each) with a 1.2s wave animation. Bridges
// the user-pause → response-streaming transition so the chat surface never
// «freezes» between bubbles. Static under prefers-reduced-motion.
//
// Compositor-friendly: animates `transform: translateY` + `opacity` only.
// Each dot offsets its keyframe by 200ms so the wave reads as a smooth ripple
// rather than three independent blinkers.
//
// A11y: aria-hidden — the live region on the response bubble announces
// progress to SR users; the dots are visual chrome only. Keeping them out of
// the SR announcement avoids the «typing typing typing typing» loop that
// happens when an aria-live region polls a decorative animation.

import type { CSSProperties, ReactElement } from 'react';

interface TypingDotsProps {
  /** Skip the wave animation (renders 3 static dots at rest). */
  prefersReduced: boolean;
  /** Optional className for layout (margin, alignment). */
  className?: string;
}

const DOT_SIZE_PX = 6;
const DOT_GAP_PX = 4;

// Single keyframe stylesheet — injected once at module scope. The wave moves
// each dot up by 4px at the apex, then back to baseline; opacity drops
// halfway so the dots read as «pulsing».
const KEYFRAMES_CSS = `
@keyframes provedo-typing-wave {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30%           { transform: translateY(-4px); opacity: 1; }
}
`;

function Dot({
  delayMs,
  prefersReduced,
}: { delayMs: number; prefersReduced: boolean }): ReactElement {
  const style: CSSProperties = {
    display: 'inline-block',
    width: `${DOT_SIZE_PX}px`,
    height: `${DOT_SIZE_PX}px`,
    borderRadius: '9999px',
    backgroundColor: 'var(--provedo-border-default)',
    animation: prefersReduced
      ? 'none'
      : `provedo-typing-wave 1.2s ease-in-out ${delayMs}ms infinite`,
  };
  return <span aria-hidden="true" style={style} />;
}

export function TypingDots({ prefersReduced, className }: TypingDotsProps): ReactElement {
  return (
    <span
      data-testid="hero-typing-dots"
      aria-hidden="true"
      className={`inline-flex items-center ${className ?? ''}`}
      style={{ gap: `${DOT_GAP_PX}px`, lineHeight: 0 }}
    >
      <style>{KEYFRAMES_CSS}</style>
      <Dot delayMs={0} prefersReduced={prefersReduced} />
      <Dot delayMs={200} prefersReduced={prefersReduced} />
      <Dot delayMs={400} prefersReduced={prefersReduced} />
    </span>
  );
}

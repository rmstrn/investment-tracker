'use client';

// ProvedoEditorialNarrative — §S6 dark editorial atmosphere upgrade
// (Slice-LP5-BCD A3, per PD spec §C.S6)
//
// Bold direction (PD spec §C.S6):
//   The dark editorial section is the page's chance for visual maximalism
//   but shipped text-only on flat slate-900 with one teal accent on the
//   closer. Add ATMOSPHERE: a subtle teal radial-glow anchored bottom-
//   right + a noise()-grain SVG texture overlay at ~2% alpha + an oversized
//   decorative «Q» quotation glyph anchored behind the body text in
//   slate-800 (almost-invisible) acting as editorial chrome.
//
//   The closing line «You hold the assets. Provedo holds the context.»
//   gets a typographic upgrade: split onto two visual lines with the
//   second line indented (editorial print convention), bumped to a larger
//   font-size, and the teal-on-«Provedo holds the context» becomes a soft
//   gradient (background-clip: text) — ONE word-cluster gradient,
//   Stripe-pattern. Both lines preserved verbatim (PO copy lock).
//
// Accessibility: WCAG AAA contrast (#FAFAF7 on slate-900 = 19.3:1) preserved.
// Decorative «Q» + noise overlay are aria-hidden + pointer-events:none — they
// add atmosphere without polluting the SR landmark output.

import type { CSSProperties } from 'react';
import { Sources } from './Sources';
import { useInView } from './hooks/useInView';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

// Decorative atmosphere layers — all aria-hidden, pointer-events:none.
const NOISE_OVERLAY_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  opacity: 0.025,
  zIndex: 0,
  // Inline SVG noise via data URI — no extra HTTP request, ~0.2kB gz.
  // feTurbulence baseFrequency ≈ 0.9 produces fine grain.
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
  backgroundSize: '180px 180px',
};

const RADIAL_GLOW_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  backgroundImage:
    'radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.12) 0%, transparent 50%)',
};

const DECORATIVE_GLYPH_STYLE: CSSProperties = {
  position: 'absolute',
  top: '-40px',
  right: '-30px',
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: 'clamp(180px, 30vw, 320px)',
  lineHeight: 1,
  color: '#1E293B',
  opacity: 0.5,
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: 0,
};

export function ProvedoEditorialNarrative(): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const prefersReduced = usePrefersReducedMotion();

  const bodyStyle = (delay: number): React.CSSProperties =>
    prefersReduced
      ? {}
      : {
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 800ms ease ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        };

  return (
    <section
      ref={ref}
      aria-labelledby="editorial-heading"
      style={{
        backgroundColor: '#0F172A',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(6rem, 4rem + 5vw, 10rem)',
        paddingBottom: 'clamp(6rem, 4rem + 5vw, 10rem)',
      }}
    >
      {/* Atmosphere layers (PD spec §C.S6) — all decorative, behind content */}
      <div data-testid="editorial-radial-glow" aria-hidden="true" style={RADIAL_GLOW_STYLE} />
      <div data-testid="editorial-noise-overlay" aria-hidden="true" style={NOISE_OVERLAY_STYLE} />
      <span
        data-testid="editorial-decorative-glyph"
        aria-hidden="true"
        style={DECORATIVE_GLYPH_STYLE}
      >
        &ldquo;
      </span>

      <div className="relative mx-auto px-4" style={{ maxWidth: '768px', zIndex: 1 }}>
        {/* Header — scale 0.98→1 on view */}
        <h2
          id="editorial-heading"
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontWeight: 500,
            fontSize: 'clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem)',
            color: '#FAFAF7',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: '48px',
            ...(prefersReduced
              ? {}
              : {
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'scale(1) translateY(0)' : 'scale(0.98) translateY(16px)',
                  transition: 'opacity 800ms ease, transform 800ms cubic-bezier(0.16,1,0.3,1)',
                }),
          }}
        >
          One place. One feed. One chat.
        </h2>

        {/* Body */}
        <div style={{ maxWidth: '60ch' }}>
          <p
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontWeight: 400,
              fontSize: 'clamp(1.125rem, 1rem + 0.6vw, 1.375rem)',
              color: '#CBD5E1',
              lineHeight: 1.6,
              marginBottom: '24px',
              ...bodyStyle(100),
            }}
          >
            Your portfolio lives in seven places. Your dividends arrive in three inboxes. The
            reasons you bought NVDA in 2023 are in a group chat you can&apos;t find.
          </p>

          <p
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontWeight: 400,
              fontSize: 'clamp(1.125rem, 1rem + 0.6vw, 1.375rem)',
              color: '#CBD5E1',
              lineHeight: 1.6,
              ...bodyStyle(200),
            }}
          >
            Provedo holds it in one place. Reads every broker. Notices what would slip past — a
            dividend coming, a drawdown forming, a concentration creeping up. Shows patterns in your
            past trades with sources for every answer.
          </p>
        </div>

        {/* Closing brand-world line — PO lock candidate #2.
            Typographic upgrade per PD §C.S6: bumped to ~40px, two-line split,
            second line indented + gradient-on-text via background-clip.
            Both lines preserved verbatim (legal lock — PO copy lock). */}
        <div
          data-testid="editorial-closer"
          style={{
            marginTop: '64px',
            fontFamily: 'var(--provedo-font-sans)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)',
            lineHeight: 1.25,
            ...(prefersReduced
              ? {}
              : {
                  opacity: inView ? 1 : 0,
                  transition: 'opacity 800ms ease 400ms',
                }),
          }}
        >
          <p style={{ color: '#FAFAF7', margin: 0 }}>You hold the assets.</p>
          <p
            data-testid="editorial-closer-gradient-line"
            style={{
              margin: 0,
              marginTop: '4px',
              paddingLeft: 'clamp(16px, 4vw, 48px)',
              backgroundImage: 'linear-gradient(90deg, #14B8A6 0%, #2DD4BF 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              // Fallback color in case background-clip:text is not supported.
              WebkitTextFillColor: 'transparent',
            }}
          >
            Provedo holds the context.
          </p>
        </div>

        {/* Sources mount (Slice-LP3.5) — drops CD's specific cohort-N citations
            per brand-voice REJECT §6.3 (manifestos do not cite their own JTBD
            interview sample sizes — performative-Sage anti-pattern). Carries
            the source-anchor signal in restrained form. */}
        <div
          style={{
            marginTop: '32px',
            maxWidth: '60ch',
            ...(prefersReduced
              ? {}
              : {
                  opacity: inView ? 1 : 0,
                  transition: 'opacity 800ms ease 600ms',
                }),
          }}
        >
          <Sources
            theme="dark"
            items={['Pre-alpha JTBD interviews 2026-Q1', 'ICP cohort signals']}
          />
        </div>
      </div>
    </section>
  );
}

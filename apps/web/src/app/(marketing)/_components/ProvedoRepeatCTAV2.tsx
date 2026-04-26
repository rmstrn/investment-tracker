'use client';

// ProvedoRepeatCTAV2 — §S10 pre-footer editorial CTA — atmosphere upgrade
// (Slice-LP5-BCD B2, per PD spec §C.S10)
//
// Bold direction (PD spec §C.S10):
//   PO: «две максимально тупые секции одна за другой» — the S10 dark CTA +
//   footer waitlist box read as two ask-the-product CTAs back-to-back. The
//   waitlist box is dropped from the footer (see B3 below). S10 is now the
//   page's last visual + conversion moment. Apply the SAME atmosphere
//   treatment as §S6 — radial-glow + noise overlay + decorative arrow
//   glyph — so the two dark editorial sections rhyme visually. Keep the
//   primary CTA (Ask Provedo) with a subtle ambient teal glow.
//
// Headline upgrade per PD §C.S10: split «Open Provedo when you're ready.»
// onto two visual lines with the second line italic + indented (matches
// the §S6 closer treatment for visual rhyme). Both lines preserved verbatim.
//
// Accessibility: WCAG AA — teal-500 on slate-900 = 5.81:1 (preserved).

import type { CSSProperties } from 'react';
import { ProvedoButton, ProvedoNavLink } from './ProvedoButton';
import { ScrollFadeIn } from './ScrollFadeIn';

// Atmosphere layers — visual rhyme with §S6.
const NOISE_OVERLAY_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  opacity: 0.025,
  zIndex: 0,
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

const DECORATIVE_ARROW_STYLE: CSSProperties = {
  position: 'absolute',
  top: '40px',
  right: 'clamp(-20px, 4vw, 80px)',
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: 'clamp(160px, 22vw, 260px)',
  lineHeight: 1,
  color: '#1E293B',
  opacity: 0.4,
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: 0,
  transform: 'rotate(20deg)',
};

export function ProvedoRepeatCTAV2(): React.ReactElement {
  return (
    <section
      aria-labelledby="cta-v2-heading"
      className="px-4 text-center"
      style={{
        backgroundColor: '#0F172A',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'clamp(5rem, 4rem + 4vw, 7rem)',
        paddingBottom: 'clamp(5rem, 4rem + 4vw, 7rem)',
      }}
    >
      {/* Atmosphere layers — visual rhyme with §S6 editorial */}
      <div data-testid="cta-radial-glow" aria-hidden="true" style={RADIAL_GLOW_STYLE} />
      <div data-testid="cta-noise-overlay" aria-hidden="true" style={NOISE_OVERLAY_STYLE} />
      <span data-testid="cta-decorative-arrow" aria-hidden="true" style={DECORATIVE_ARROW_STYLE}>
        &#x2198;
      </span>

      <div className="relative mx-auto max-w-2xl" style={{ zIndex: 1 }}>
        <ScrollFadeIn>
          {/* Header — split onto two visual lines, second line italic + indented
              (visual rhyme with the §S6 closer per PD §C.S10).
              Both lines preserved verbatim. */}
          <h2
            id="cta-v2-heading"
            data-testid="cta-headline"
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontWeight: 500,
              fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)',
              color: '#FAFAF7',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '32px',
            }}
          >
            <span style={{ display: 'block' }}>Open Provedo</span>
            <span
              data-testid="cta-headline-italic-line"
              style={{
                display: 'block',
                marginTop: '4px',
                paddingLeft: 'clamp(16px, 4vw, 48px)',
                fontStyle: 'italic',
                color: '#E2E8F0',
              }}
            >
              when you&apos;re ready.
            </span>
          </h2>

          {/* Primary CTA — with subtle ambient teal glow per PD §C.S10
              («small, not Robinhood-flashy»). The glow sits OUTSIDE the
              button (box-shadow), not inside the button click target. */}
          <div
            data-testid="cta-button-glow-wrapper"
            style={{
              display: 'inline-block',
              borderRadius: '12px',
              boxShadow: '0 0 40px rgba(13, 148, 136, 0.18)',
            }}
          >
            <ProvedoButton
              href="#demo"
              variant="primary"
              size="lg"
              style={{
                backgroundColor: '#14B8A6',
                color: '#FFFFFF',
              }}
            >
              Ask Provedo
            </ProvedoButton>
          </div>

          {/* Small-print — kept verbatim. */}
          <p className="mt-6 text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
            No card. 50 free questions a month.{' '}
            <ProvedoNavLink
              href="/pricing"
              className="text-xs underline-offset-2 hover:underline"
              colorFrom="#94A3B8"
              colorTo="#2DD4BF"
            >
              Or see Plus pricing →
            </ProvedoNavLink>
          </p>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

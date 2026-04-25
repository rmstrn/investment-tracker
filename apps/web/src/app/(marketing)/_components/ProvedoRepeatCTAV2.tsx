'use client';

// ProvedoRepeatCTAV2 — §S9 pre-footer editorial CTA (v3)
// V3.5: scroll fade-in on content block
// Spec: visual spec §6.4 — dark editorial slate-900, visual rhyme with S6
// Copy: verbatim §S9 («Open Provedo when you're ready.»)
// Accessibility: WCAG AA — teal-500 on slate-900 = 5.81:1

import { ProvedoButton, ProvedoNavLink } from './ProvedoButton';
import { ScrollFadeIn } from './ScrollFadeIn';

export function ProvedoRepeatCTAV2(): React.ReactElement {
  return (
    <section
      aria-labelledby="cta-v2-heading"
      className="px-4 text-center"
      style={{
        backgroundColor: '#0F172A',
        paddingTop: 'clamp(5rem, 4rem + 4vw, 7rem)',
        paddingBottom: 'clamp(5rem, 4rem + 4vw, 7rem)',
      }}
    >
      <div className="mx-auto max-w-2xl">
        <ScrollFadeIn>
          {/* Header */}
          <h2
            id="cta-v2-heading"
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
            Open Provedo when you&apos;re ready.
          </h2>

          {/* Primary CTA */}
          <div>
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

          {/* Secondary text-link */}
          <div className="mt-4">
            <ProvedoNavLink
              href="/sign-up"
              className="text-sm font-medium"
              colorFrom="#94A3B8"
              colorTo="#2DD4BF"
            >
              Or start free forever
            </ProvedoNavLink>
          </div>

          {/* Small-print */}
          <p className="mt-4 text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
            No card. 50 free messages a month, free always.{' '}
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

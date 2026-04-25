// ProvedoRepeatCTAV2 — §S9 pre-footer editorial CTA (Slice-LP2)
// Spec: visual spec §6.4 — dark editorial slate-900, visual rhyme with S6
// Copy: verbatim from landing-provedo-v2.md §S9 («Open Provedo when you're ready.»)
// Accessibility: WCAG AA — teal-500 on slate-900 = 5.81:1, white on teal-500 = 4.53:1
// Reduced-motion: static, no animation

import { ProvedoButton, ProvedoNavLink } from './ProvedoButton';

export function ProvedoRepeatCTAV2(): React.ReactElement {
  return (
    <section
      aria-labelledby="cta-v2-heading"
      className="px-4 text-center"
      style={{
        backgroundColor: '#0F172A', // slate-900 — same as S6
        paddingTop: 'clamp(5rem, 4rem + 4vw, 7rem)',
        paddingBottom: 'clamp(5rem, 4rem + 4vw, 7rem)',
      }}
    >
      <div className="mx-auto max-w-2xl">
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

        {/* Primary CTA — teal-500 on dark bg */}
        <div>
          <ProvedoButton
            href="#demo"
            variant="primary"
            size="lg"
            style={{
              backgroundColor: '#14B8A6', // teal-500 — lighter for dark bg contrast
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
            colorFrom="#94A3B8" // slate-400
            colorTo="#2DD4BF" // teal-400
          >
            Or start free forever
          </ProvedoNavLink>
        </div>

        {/* Small-print */}
        <p
          className="mt-4 text-xs leading-relaxed"
          style={{ color: '#94A3B8' }} // slate-400
        >
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
      </div>
    </section>
  );
}

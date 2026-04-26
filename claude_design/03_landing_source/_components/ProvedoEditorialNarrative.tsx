'use client';

// ProvedoEditorialNarrative — §S6 dark editorial full-bleed section (v3)
// V3.5: scroll-into-view fade-in, slower timing for dark editorial sections (800ms)
// V3.6: copy trimmed ~30% — paragraph 2 shortened, paragraph 3 consolidated
// Spec: visual spec §4 — slate-900 full-bleed, oversized Inter typography
// PO lock: closing line = candidate #2 «You hold the assets. Provedo holds the context.»
// Accessibility: WCAG AAA contrast (#FAFAF7 on slate-900 = 19.3:1)

import { useInView } from './hooks/useInView';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

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
        paddingTop: 'clamp(6rem, 4rem + 5vw, 10rem)',
        paddingBottom: 'clamp(6rem, 4rem + 5vw, 10rem)',
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: '768px' }}>
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

        {/* Body — V3.6 trimmed */}
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

        {/* Closing brand-world line — PO lock candidate #2 */}
        <p
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2rem)',
            lineHeight: 1.3,
            marginTop: '56px',
            ...(prefersReduced
              ? {}
              : {
                  opacity: inView ? 1 : 0,
                  transition: 'opacity 800ms ease 400ms',
                }),
          }}
        >
          <span style={{ color: '#FAFAF7' }}>You hold the assets. </span>
          <span style={{ color: '#2DD4BF' }}>Provedo holds the context.</span>
        </p>
      </div>
    </section>
  );
}

// ProvedoEditorialNarrative — §S6 dark editorial full-bleed section (Slice-LP2)
// Spec: visual spec §4 — slate-900 full-bleed, oversized Inter typography
// Copy: verbatim from landing-provedo-v2.md §S6
// PO lock: closing line = candidate #2 «You hold the assets. Provedo holds the context.»
// Accessibility: WCAG AAA contrast (#FAFAF7 on slate-900 = 19.3:1)
// Reduced-motion: static, no entrance animation
// Design: pure type-led — no mockups, no icons, no decorations

export function ProvedoEditorialNarrative(): React.ReactElement {
  return (
    <section
      aria-labelledby="editorial-heading"
      style={{
        backgroundColor: '#0F172A', // slate-900 — var(--provedo-bg-inverse)
        paddingTop: 'clamp(6rem, 4rem + 5vw, 10rem)',
        paddingBottom: 'clamp(6rem, 4rem + 5vw, 10rem)',
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: '768px' }}>
        {/* Header */}
        <h2
          id="editorial-heading"
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontWeight: 500,
            fontSize: 'clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem)',
            color: '#FAFAF7', // var(--provedo-text-inverse)
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: '48px',
          }}
        >
          One brain. One feed. One chat.
        </h2>

        {/* Body paragraphs */}
        <div style={{ maxWidth: '60ch' }}>
          <p
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontWeight: 400,
              fontSize: 'clamp(1.125rem, 1rem + 0.6vw, 1.375rem)',
              color: '#CBD5E1', // slate-300
              lineHeight: 1.6,
              marginBottom: '24px',
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
              marginBottom: '24px',
            }}
          >
            Provedo holds it in one place. Reads what you own across every broker. Notices what
            would slip past — a dividend coming, a drawdown forming, a concentration creeping up.
            Shows you patterns in your past trades — what you did, when, what came next.
          </p>

          <p
            style={{
              fontFamily: 'var(--provedo-font-sans)',
              fontWeight: 400,
              fontSize: 'clamp(1.125rem, 1rem + 0.6vw, 1.375rem)',
              color: '#CBD5E1',
              lineHeight: 1.6,
            }}
          >
            Across chat, weekly insights, and pattern-reads on your trades. On your real positions.
            With sources for every answer.
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
          }}
        >
          <span style={{ color: '#FAFAF7' }}>You hold the assets. </span>
          <span style={{ color: '#2DD4BF' }}>Provedo holds the context.</span>
        </p>
      </div>
    </section>
  );
}

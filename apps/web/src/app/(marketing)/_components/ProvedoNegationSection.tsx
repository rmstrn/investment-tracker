// ProvedoNegationSection — §S3 problem-negation positioning (Slice-LP2)
// Spec: visual spec §6.1 — type-led, center-aligned, no mockup
// Copy: verbatim from landing-provedo-v2.md §S3
// Accessibility: <section><h2> + <p>, AAA contrast on #FAFAF7
// Lane A: explicit disclaimer register — «not a robo-advisor / will not tell you what to buy»

export function ProvedoNegationSection(): React.ReactElement {
  return (
    <section
      aria-labelledby="negation-heading"
      className="px-4"
      style={{
        backgroundColor: 'var(--provedo-bg-page)',
        paddingTop: 'clamp(5rem, 4rem + 4vw, 7rem)',
        paddingBottom: 'clamp(5rem, 4rem + 4vw, 7rem)',
      }}
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* Optional wordmark above heading */}
        <p
          className="mb-6 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--provedo-accent)' }}
          aria-hidden="true"
        >
          Provedo
        </p>

        {/* Three negation lines */}
        <h2
          id="negation-heading"
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontWeight: 500,
            fontSize: 'clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)',
            color: 'var(--provedo-text-primary)',
            lineHeight: 1.4,
            marginBottom: '32px',
          }}
        >
          This is what Provedo is{' '}
          <strong style={{ fontWeight: 600, color: 'var(--provedo-text-secondary)' }}>not</strong>.
          <br />
          <br />
          Provedo is{' '}
          <strong style={{ fontWeight: 600, color: 'var(--provedo-text-secondary)' }}>not</strong> a
          robo-advisor.
          <br />
          Provedo is{' '}
          <strong style={{ fontWeight: 600, color: 'var(--provedo-text-secondary)' }}>not</strong> a
          brokerage.
          <br />
          Provedo will{' '}
          <strong style={{ fontWeight: 600, color: 'var(--provedo-text-secondary)' }}>not</strong>{' '}
          tell you what to buy.
        </h2>

        {/* Affirmation closer */}
        <p
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontWeight: 400,
            fontSize: '18px',
            color: 'var(--provedo-text-secondary)',
            lineHeight: 1.6,
            maxWidth: '60ch',
            margin: '0 auto',
          }}
        >
          What Provedo does: holds your portfolio across every broker, answers what you ask,
          surfaces what you&apos;d miss. With sources for every observation.
        </p>
      </div>
    </section>
  );
}

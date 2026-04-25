// ProvedoNumericProofBar — §S2 numeric proof bar (Slice-LP2)
// Spec: visual spec §3 — 3 cells, mono numbers, semantic dl structure
// Accessibility: <section><dl><dt><dd>>, AAA contrast verified
// TD-095: swap "100s" → "1000+" once tech-lead verifies SnapTrade/Plaid/CCXT coverage

interface ProvedoNumericProofBarProps {
  /** Broker count copy — "100s" (fallback) or "1000+" (post-verification) */
  coverage?: '100s' | '1000+';
}

interface ProofCell {
  number: string;
  label: string;
  sublabel: string;
}

function buildCells(coverage: '100s' | '1000+'): ReadonlyArray<ProofCell> {
  return [
    {
      number: coverage,
      label: 'brokers and exchanges',
      sublabel: coverage === '100s' ? 'every major one' : 'in one place',
    },
    {
      number: 'Every',
      label: 'observation cited',
      sublabel: 'with sources inline',
    },
    {
      number: '$0/month',
      label: 'free forever',
      sublabel: 'no card required',
    },
  ] as const;
}

export function ProvedoNumericProofBar({
  coverage = '100s',
}: ProvedoNumericProofBarProps): React.ReactElement {
  const cells = buildCells(coverage);

  return (
    <section
      aria-label="Proof points"
      style={{
        backgroundColor: 'var(--provedo-bg-muted)',
        borderTop: '1px solid var(--provedo-border-subtle)',
        borderBottom: '1px solid var(--provedo-border-subtle)',
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <dl
          className="flex flex-col divide-y md:flex-row md:divide-x md:divide-y-0"
          style={{ '--tw-divide-color': 'var(--provedo-border-subtle)' } as React.CSSProperties}
        >
          {cells.map((cell) => (
            <div
              key={cell.label}
              className="flex flex-col items-center py-8 text-center first:pt-0 last:pb-0 md:flex-1 md:px-8 md:py-0 md:first:pt-0 md:last:pb-0"
            >
              <dd
                className="leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--provedo-font-mono)',
                  fontWeight: 500,
                  fontSize: 'clamp(2.5rem, 1.8rem + 2vw, 3.5rem)',
                  color: 'var(--provedo-text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                {cell.number}
              </dd>
              <dt
                style={{
                  fontFamily: 'var(--provedo-font-sans)',
                  fontWeight: 500,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--provedo-text-secondary)',
                  marginBottom: '4px',
                }}
              >
                {cell.label}
              </dt>
              <dd
                style={{
                  fontFamily: 'var(--provedo-font-sans)',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: 'var(--provedo-text-muted)',
                }}
              >
                {cell.sublabel}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

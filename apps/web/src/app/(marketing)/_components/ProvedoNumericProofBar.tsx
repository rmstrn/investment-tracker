'use client';

// ProvedoNumericProofBar — §S2 numeric proof bar (Slice-LP3.5)
//
// Slice-LP3.5 chrome polish (PD re-evaluation §3.3 + brand-voice §4):
//   - Move «information, not advice» from Cell IV body to italic footer line
//     BELOW the proof-bar cells. Lane A signal stays present, no longer
//     occupies a peer cell.
//   - Replace freed Cell IV with epistemic-claim «Sources / for every answer»
//     (NOT «<2s» — brand-voice REJECT as Hero/Outlaw perf-marketing register
//     + Lane A side-door).
//   - Audience-whisper italic line stays SEPARATE from the disclaimer
//     (brand-voice REJECT-WITH-EDIT on combined run-on).
//
// Earlier history (v3.x):
//   - 4-cell layout (was 3) — adds time-anchor cell #3 «5 min / a week / the whole habit»
//   - Audience-whisper micro-line below cells per PD spec V2
//   - max-w-4xl → max-w-5xl for 4-cell breathing room (PD spec)
//
// Slice-LP3.7-A: align Cell I copy with §S8 header «Hundreds of brokers and
// exchanges». Was «100s» (mono-numeric register) — read as inconsistent one
// viewport apart from §S8 «Hundreds» (sans-narrative register). Both surfaces
// now use «Hundreds» until TD-095 lands the verified «1000+» upgrade.
//
// Accessibility: <section><dl><dt><dd>, AAA contrast verified.
// TD-095: swap coverage="Hundreds" → coverage="1000+" once tech-lead verifies coverage.

interface ProvedoNumericProofBarProps {
  /** Broker count copy — 'Hundreds' (fallback) or '1000+' (post-verification) */
  coverage?: 'Hundreds' | '1000+';
}

// Per-breakpoint big-number font-size clamp (PD spec V1, slightly tighter for 4-cell layout)
const BIG_NUMBER_CLAMP = 'clamp(2.25rem, 1.6rem + 1.6vw, 3.25rem)';

// Shared cell typography (PD spec V1)
const CELL_BIG_STYLE: React.CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: BIG_NUMBER_CLAMP,
  letterSpacing: '-0.02em',
  lineHeight: 1,
  marginBottom: '8px',
};

const CELL_EYEBROW_STYLE: React.CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 500,
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--provedo-text-secondary)',
  marginBottom: '4px',
};

const CELL_SUB_STYLE: React.CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '13px',
  color: 'var(--provedo-text-muted)',
};

export function ProvedoNumericProofBar({
  coverage = 'Hundreds',
}: ProvedoNumericProofBarProps): React.ReactElement {
  // Wave 2.6 a11y HIGH-2: text-only cells render visible from SSR with no
  // opacity fade. Slice-LP3.5: Cell IV count-up dropped (cell now carries
  // static «Sources / for every answer» — epistemic claim, not numeric).

  return (
    <section
      aria-label="Proof points"
      style={{
        backgroundColor: 'var(--provedo-bg-muted)',
        borderTop: '1px solid var(--provedo-border-subtle)',
        borderBottom: '1px solid var(--provedo-border-subtle)',
      }}
    >
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <dl
          className="flex flex-col divide-y lg:flex-row lg:divide-x lg:divide-y-0"
          style={
            {
              '--tw-divide-color': 'var(--provedo-border-subtle)',
            } as React.CSSProperties
          }
        >
          {/* Cell 1 — Broker coverage */}
          <div className="flex flex-col items-center px-2 py-8 text-center first:pt-0 last:pb-0 lg:flex-1 lg:px-6 lg:py-0 lg:first:pt-0 lg:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-text-primary)' }}
            >
              {coverage === 'Hundreds' ? 'Hundreds' : '1000+'}
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>brokers and exchanges</dt>
            <dd style={CELL_SUB_STYLE}>
              {coverage === 'Hundreds' ? 'every major one' : 'in one place'}
            </dd>
          </div>

          {/* Cell 2 — Every observation cited
              Wave 2.6 HIGH-2: opacity fade dropped — text content always visible. */}
          <div className="flex flex-col items-center px-2 py-8 text-center first:pt-0 last:pb-0 lg:flex-1 lg:px-6 lg:py-0 lg:first:pt-0 lg:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-text-primary)' }}
            >
              Every
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>observation cited</dt>
            <dd style={CELL_SUB_STYLE}>with sources inline</dd>
          </div>

          {/* Cell 3 — Time anchor «5 min / a week» (v3.2 NEW)
              Static token, no count-up (PD spec — count-up reads gimmicky on time-anchor)
              Wave 2.6 HIGH-2: opacity fade dropped — text content always visible. */}
          <div className="flex flex-col items-center px-2 py-8 text-center first:pt-0 last:pb-0 lg:flex-1 lg:px-6 lg:py-0 lg:first:pt-0 lg:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-text-primary)' }}
            >
              5 min
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>a week</dt>
            <dd style={CELL_SUB_STYLE}>the whole habit</dd>
          </div>

          {/* Cell 4 — Sources / for every answer (Slice-LP3.5)
              Replaces the «100% / information not advice» count-up cell. The
              disclaimer moves to the italic footer line below the proof bar
              (still visually present, no longer occupies a peer cell). The
              freed cell now carries the epistemic claim that anchors
              Provedo's load-bearing trust signal. */}
          <div className="flex flex-col items-center px-2 py-8 text-center first:pt-0 last:pb-0 lg:flex-1 lg:px-6 lg:py-0 lg:first:pt-0 lg:last:pb-0">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-accent)' }}
            >
              Sources
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>for every answer</dt>
            <dd style={CELL_SUB_STYLE}>cited inline, dated, traceable</dd>
          </div>
        </dl>

        {/* Disclaimer footer — Slice-LP3.5 (replaces Cell IV body).
            Single italic line, plain text, max-width matched to audience-whisper
            below. Stays SEPARATE from the audience-whisper line per brand-voice
            REJECT-WITH-EDIT on combined run-on. */}
        <p
          className="mx-auto mt-8 px-4 text-center"
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: 1.55,
            color: 'var(--provedo-text-tertiary)',
            maxWidth: '480px',
          }}
          data-testid="proof-bar-disclaimer-footer"
        >
          Information, not advice.
        </p>

        {/* Audience-whisper — v3.2 (PD spec V2: proof-bar small-print placement).
            Kept SEPARATE from the disclaimer footer per brand-voice REJECT-WITH-EDIT. */}
        <p
          className="mx-auto mt-3 px-4 text-center"
          style={{
            fontFamily: 'var(--provedo-font-sans)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: 1.55,
            color: 'var(--provedo-text-tertiary)',
            maxWidth: '480px',
          }}
        >
          For investors who hold across more than one broker.
        </p>
      </div>
    </section>
  );
}

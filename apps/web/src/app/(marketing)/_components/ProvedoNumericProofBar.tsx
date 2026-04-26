'use client';

// ProvedoNumericProofBar — §S2 numeric proof bar (Slice-LP5-A §C.S2 bento)
//
// Slice-LP5-A bento conversion (PD spec §C.S2):
//   - Replace the divide-x flat strip with a 4-cell CSS grid bento.
//   - Cell #4 «Sources / for every answer» becomes the HERO cell — teal-tinted
//     bg (rgba(13,148,136,0.04)) + teal-200 hairline border. Visually pulls.
//   - The other three cells sit on warm-bg-muted with subtle hairline borders
//     and a shared rounded-lg + 1px border treatment.
//   - Big-number color discipline: Cell #4 number stays slate-900 (the accent
//     moved to the cell-bg, not the number); the «for every answer» eyebrow
//     stays teal-600.
//   - Hover states on all 4 cells: subtle border deepens 150ms ease.
//   - Drop the in-section divide-y / divide-x dividers (PO «скучные»).
//
// Preserved from prior shipped state:
//   - All copy verbatim (Hundreds / brokers and exchanges; Every / observation
//     cited; 5 min / a week / the whole habit; Sources / for every answer).
//   - ARIA: <section><dl><dt><dd> + role="region" via aria-label.
//   - Disclaimer footer «Information, not advice.» as italic line below the
//     bento. Audience-whisper line stays SEPARATE from the disclaimer per the
//     prior brand-voice REJECT-WITH-EDIT (combined run-on rejected).
//   - TD-095 swap: coverage="Hundreds" (default) ↔ coverage="1000+".
//
// What's NOT in this slice:
//   - PD spec §C.S2 also recommended moving the audience-whisper to the §S1
//     hero. We KEEP both in this section for now — that move is part of the
//     §S1 hero microcopy reshuffle which lives in Slice-LP5-B alongside the
//     other small-print rearrangements. Until then both lines stay here so we
//     do not lose the audience signal mid-slice.

import type { CSSProperties, ReactElement, ReactNode } from 'react';

interface ProvedoNumericProofBarProps {
  /** Broker count copy — 'Hundreds' (fallback) or '1000+' (post-verification) */
  coverage?: 'Hundreds' | '1000+';
}

// Per-breakpoint big-number font-size clamp. Slightly tighter for bento cells.
const BIG_NUMBER_CLAMP = 'clamp(2.25rem, 1.6rem + 1.6vw, 3.25rem)';

const CELL_BIG_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: BIG_NUMBER_CLAMP,
  letterSpacing: '-0.02em',
  lineHeight: 1,
  marginBottom: '8px',
};

const CELL_EYEBROW_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 500,
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--provedo-text-secondary)',
  marginBottom: '4px',
};

const CELL_SUB_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '13px',
  color: 'var(--provedo-text-muted)',
};

// ─── Bento cell primitive ──────────────────────────────────────────────────

interface BentoCellProps {
  /** When true, applies the teal-tinted hero treatment (cell #4 only). */
  isHero?: boolean;
  /** Optional data-testid for cell-targeted assertions. */
  testId?: string;
  children: ReactNode;
}

const CELL_BASE_CLASSES =
  'flex flex-col items-center rounded-lg border p-6 text-center transition-colors duration-150';

function BentoCell({ isHero = false, testId, children }: BentoCellProps): ReactElement {
  // Inline style so the hero cell carries its teal-tinted bg + teal-200
  // hairline. Both treatments stay within the Provedo palette — no new
  // color families introduced.
  const cellStyle: CSSProperties = isHero
    ? {
        backgroundColor: 'rgba(13, 148, 136, 0.04)',
        borderColor: 'rgba(13, 148, 136, 0.25)',
      }
    : {
        backgroundColor: 'var(--provedo-bg-muted)',
        borderColor: 'var(--provedo-border-subtle)',
      };

  // Hover deepens the border one notch. Inline handlers keep us off a
  // tailwind-arbitrary-value escape hatch and match the existing
  // ProvedoButton hover pattern.
  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>): void {
    e.currentTarget.style.borderColor = isHero
      ? 'rgba(13, 148, 136, 0.45)'
      : 'var(--provedo-border-default)';
  }
  function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>): void {
    e.currentTarget.style.borderColor = isHero
      ? 'rgba(13, 148, 136, 0.25)'
      : 'var(--provedo-border-subtle)';
  }

  return (
    <div
      data-testid={testId}
      className={CELL_BASE_CLASSES}
      style={cellStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// ─── Section composer ──────────────────────────────────────────────────────

export function ProvedoNumericProofBar({
  coverage = 'Hundreds',
}: ProvedoNumericProofBarProps): ReactElement {
  return (
    <section
      aria-label="Proof points"
      style={{
        backgroundColor: 'var(--provedo-bg-page)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <dl
          data-testid="proof-bar-bento-grid"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {/* Cell 1 — Broker coverage */}
          <BentoCell testId="proof-bar-cell-coverage">
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
          </BentoCell>

          {/* Cell 2 — Every observation cited */}
          <BentoCell testId="proof-bar-cell-cited">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-text-primary)' }}
            >
              Every
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>observation cited</dt>
            <dd style={CELL_SUB_STYLE}>with sources inline</dd>
          </BentoCell>

          {/* Cell 3 — Time anchor «5 min / a week» */}
          <BentoCell testId="proof-bar-cell-time">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-text-primary)' }}
            >
              5 min
            </dd>
            <dt style={CELL_EYEBROW_STYLE}>a week</dt>
            <dd style={CELL_SUB_STYLE}>the whole habit</dd>
          </BentoCell>

          {/* Cell 4 — HERO «Sources / for every answer» (teal-tinted bento card)
              The number stays slate-900 (PD §C.S2: accent moved to cell-bg, NOT
              the number). The eyebrow «for every answer» keeps the teal accent. */}
          <BentoCell isHero testId="proof-bar-cell-sources-hero">
            <dd
              className="leading-none tracking-tight"
              style={{ ...CELL_BIG_STYLE, color: 'var(--provedo-text-primary)' }}
            >
              Sources
            </dd>
            <dt style={{ ...CELL_EYEBROW_STYLE, color: 'var(--provedo-accent)' }}>
              for every answer
            </dt>
            <dd style={CELL_SUB_STYLE}>cited inline, dated, traceable</dd>
          </BentoCell>
        </dl>

        {/* Slice-LP5-BCD C3 + C4: BOTH the «Information, not advice.» disclaimer
            footer AND the «For investors who hold across more than one broker.»
            audience-whisper line are dropped from the proof bar.
            - C3: «Information, not advice.» retains its single load-bearing
              mount in the footer Layer-1 disclaimer (legal-required there).
              Repeating in proof-bar duplicated the disclaim mid-page (PO
              2026-04-27: «обязательно везде упоминать?»).
            - C4: audience-whisper narrowed the ICP unnecessarily — the product
              still works for one-broker users; the marketing wedge stays
              implicit (PO 2026-04-27: «а у кого один брокер, не наши клиенты?»). */}
      </div>
    </section>
  );
}

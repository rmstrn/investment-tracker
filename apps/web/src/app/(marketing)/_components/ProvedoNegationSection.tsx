'use client';

// ProvedoNegationSection — §S3 problem-negation typeset (Slice-LP3.5)
//
// Typographic refactor (PD re-evaluation §3.2 + brand-voice §5):
//   - DROP lucide icons + red Xs + green checks (over-decorated typographic
//     moment).
//   - SINGLE COLUMN (not 2-column — pros/cons sales register risk).
//   - «What Provedo is not» heading, three em-dash bullets in slate-500.
//     Brand-voice EDIT: «Does not» (declarative-Sage) NOT «Won't» (chatty).
//   - Mirrored «What Provedo is» heading, three plus-sign bullets in slate-900,
//     bullet glyphs in teal. Brand-voice REJECT «citer» — replaced with
//     «source-keeper».
//
// Lane A: explicit disclaimer register — the negation row is the load-bearing
// «we are not advice» surface on the page.
// Accessibility: aria-labelledby h2; bullet glyphs aria-hidden so the SR reads
// the sentence cleanly without «em-dash» / «plus».

import type { CSSProperties, ReactElement } from 'react';
import { ScrollFadeIn } from './ScrollFadeIn';

interface NegationItem {
  noun: string;
  predicate: string;
}

const IS_NOT_ITEMS: ReadonlyArray<NegationItem> = [
  { noun: 'A robo-advisor.', predicate: 'Does not move money for you.' },
  { noun: 'A brokerage.', predicate: 'Does not execute trades.' },
  { noun: 'Advice.', predicate: 'Does not tell you what to buy.' },
] as const;

const IS_ITEMS: ReadonlyArray<NegationItem> = [
  { noun: 'A reader.', predicate: 'Holds your holdings across every broker.' },
  { noun: 'A noticer.', predicate: 'Surfaces what would slip past.' },
  { noun: 'A source-keeper.', predicate: 'Every observation tied to a source.' },
] as const;

const COLUMN_HEADING_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--provedo-text-tertiary)',
  margin: 0,
  marginBottom: '16px',
};

const ITEM_LIST_STYLE: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const ITEM_ROW_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '17px',
  lineHeight: 1.5,
  display: 'flex',
  alignItems: 'baseline',
  gap: '10px',
};

interface BlockProps {
  heading: string;
  items: ReadonlyArray<NegationItem>;
  /** Bullet glyph («—» for negation, «+» for affirmation). */
  glyph: string;
  /** Glyph color (CSS var). */
  glyphColor: string;
  /** Predicate text color (CSS var). */
  predicateColor: string;
  /** Noun text weight. */
  nounWeight: 400 | 500 | 600;
  /** Noun text color (CSS var). */
  nounColor: string;
}

function NegationBlock({
  heading,
  items,
  glyph,
  glyphColor,
  predicateColor,
  nounWeight,
  nounColor,
}: BlockProps): ReactElement {
  return (
    <div>
      <p style={COLUMN_HEADING_STYLE}>{heading}</p>
      <ul style={ITEM_LIST_STYLE}>
        {items.map((item) => (
          <li key={item.noun} style={ITEM_ROW_STYLE}>
            <span
              aria-hidden="true"
              style={{
                color: glyphColor,
                fontFamily: 'var(--provedo-font-mono)',
                fontWeight: 600,
                fontSize: '17px',
                flexShrink: 0,
                width: '14px',
              }}
            >
              {glyph}
            </span>
            <span>
              <span style={{ color: nounColor, fontWeight: nounWeight }}>{item.noun}</span>{' '}
              <span style={{ color: predicateColor }}>{item.predicate}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProvedoNegationSection(): ReactElement {
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
      <div className="mx-auto" style={{ maxWidth: '640px' }}>
        {/* Section header */}
        <ScrollFadeIn>
          <div className="mb-12 text-center md:mb-14">
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--provedo-accent)' }}
              aria-hidden="true"
            >
              Provedo
            </p>
            <h2
              id="negation-heading"
              style={{
                fontFamily: 'var(--provedo-font-sans)',
                fontWeight: 500,
                fontSize: 'clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)',
                color: 'var(--provedo-text-primary)',
                lineHeight: 1.3,
              }}
            >
              This is what Provedo is not.
            </h2>
          </div>
        </ScrollFadeIn>

        {/* «What Provedo is not» — single-column typeset */}
        <ScrollFadeIn>
          <div className="mb-12">
            <NegationBlock
              heading="What Provedo is not"
              items={IS_NOT_ITEMS}
              glyph="—"
              glyphColor="var(--provedo-text-tertiary)"
              predicateColor="var(--provedo-text-muted)"
              nounWeight={500}
              nounColor="var(--provedo-text-secondary)"
            />
          </div>
        </ScrollFadeIn>

        {/* «What Provedo is» — mirror, single-column, plus-sign bullets in teal */}
        <ScrollFadeIn delay={150}>
          <div>
            <NegationBlock
              heading="What Provedo is"
              items={IS_ITEMS}
              glyph="+"
              glyphColor="var(--provedo-accent)"
              predicateColor="var(--provedo-text-secondary)"
              nounWeight={600}
              nounColor="var(--provedo-text-primary)"
            />
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

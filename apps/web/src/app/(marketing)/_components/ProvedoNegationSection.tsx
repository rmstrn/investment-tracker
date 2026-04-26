'use client';

// ProvedoNegationSection — §S3 problem-negation 2-card asymmetric table
// (Slice-LP5-BCD A1, restored from PD spec §C.S3)
//
// Bold direction (PD spec §C.S3):
//   Restore the 2-column comparison-table format, but craft it as a bento
//   card pair with INTENTIONAL VISUAL CONTRAST — the asymmetry IS the
//   message. Left card («What Provedo is not») reads quieter (slate flat
//   background, em-dash bullets in slate-tertiary). Right card («What
//   Provedo is») reads richer + lifted with a teal-tinted shadow on cream
//   bg, plus-sign bullets in teal-accent. Both cards speak together — no
//   centered h2 needed. A small «POSITIONING» eyebrow seats the section.
//
// PO drops carried in this slice:
//   - The redundant section sub-header «This is what Provedo is not.» is
//     gone (PO 2026-04-27: «дважды дублируем»). The negation cards already
//     carry the «is not» heading; repeating it in an h2 above duplicated.
//   - The «Provedo» eyebrow above the section is gone (PO 2026-04-27:
//     «зачем перед этим текстом Provedo»). The new eyebrow is the neutral
//     «POSITIONING» — establishes the beat without word-repetition.
//
// Mobile: positive card («What Provedo is») renders FIRST per PD §C.S3 —
//         positive-led on small screens reads cleaner; the negation reads
//         as supporting context, not an opening statement.
//
// Lane A: explicit disclaimer register — the negation row is the load-bearing
//   «we are not advice» surface on the page.
// Accessibility: section is aria-labelledby the new eyebrow span; bullet
//   glyphs aria-hidden so the SR reads the sentence cleanly without
//   «em-dash» / «plus».

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
  marginBottom: '20px',
};

const ITEM_LIST_STYLE: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
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

interface NegationCardProps {
  /** Card heading (renders as a small mono uppercase eyebrow inside the card). */
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
  /** Card background (flat slate vs lifted cream + teal-tinted shadow). */
  cardStyle: CSSProperties;
  /** data-testid for asymmetric-card assertions. */
  testId: string;
}

function NegationCard({
  heading,
  items,
  glyph,
  glyphColor,
  predicateColor,
  nounWeight,
  nounColor,
  cardStyle,
  testId,
}: NegationCardProps): ReactElement {
  return (
    <div data-testid={testId} style={cardStyle}>
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

// Card chrome — the asymmetric depth IS the message. Left card sits flat on
// slate-muted, right card lifts off the page with a teal-tinted shadow.
const IS_NOT_CARD_STYLE: CSSProperties = {
  backgroundColor: 'var(--provedo-bg-muted)',
  border: '1px solid var(--provedo-border-subtle)',
  borderRadius: '16px',
  padding: '32px',
  height: '100%',
};

const IS_CARD_STYLE: CSSProperties = {
  backgroundColor: 'var(--provedo-bg-elevated)',
  border: '1px solid var(--provedo-border-subtle)',
  borderRadius: '16px',
  padding: '32px',
  height: '100%',
  // Teal-tinted layered shadow — the asymmetric depth signal per PD §C.S3.
  boxShadow:
    '0 8px 24px rgba(13, 148, 136, 0.08), 0 2px 4px rgba(13, 148, 136, 0.04), 0 0 0 1px rgba(13, 148, 136, 0.04)',
};

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
      <div className="mx-auto" style={{ maxWidth: '960px' }}>
        {/* Section eyebrow — replaces the dropped «Provedo» word + the
            redundant «This is what Provedo is not.» h2. The two cards below
            speak together; the eyebrow only seats the beat. */}
        <ScrollFadeIn>
          <div className="mb-10 text-center md:mb-12">
            <h2
              id="negation-heading"
              data-testid="negation-eyebrow"
              style={{
                fontFamily: 'var(--provedo-font-mono)',
                fontWeight: 500,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--provedo-accent)',
                margin: 0,
              }}
            >
              Positioning
            </h2>
          </div>
        </ScrollFadeIn>

        {/* 2-card asymmetric grid. Mobile order: «What Provedo is» FIRST
            (positive-led on small screens). Desktop order: «is not» left,
            «is» right. We use grid-flow-row + order classes to reverse only
            on mobile — md+ uses the natural order. */}
        <ScrollFadeIn>
          <div
            data-testid="negation-cards-grid"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
          >
            <div className="order-2 md:order-1">
              <NegationCard
                testId="negation-card-not"
                heading="What Provedo is not"
                items={IS_NOT_ITEMS}
                glyph="—"
                glyphColor="var(--provedo-text-tertiary)"
                predicateColor="var(--provedo-text-muted)"
                nounWeight={500}
                nounColor="var(--provedo-text-secondary)"
                cardStyle={IS_NOT_CARD_STYLE}
              />
            </div>
            <div className="order-1 md:order-2">
              <NegationCard
                testId="negation-card-is"
                heading="What Provedo is"
                items={IS_ITEMS}
                glyph="+"
                glyphColor="var(--provedo-accent)"
                predicateColor="var(--provedo-text-secondary)"
                nounWeight={600}
                nounColor="var(--provedo-text-primary)"
                cardStyle={IS_CARD_STYLE}
              />
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}

// LandingDifferentiators — Landing-v2 §B.4 «The things hiding between your brokers.»
//
// Server component. Three DifferentiatorCards in equal-width grid (desktop),
// stacked on mobile. Per content-lead doc §4 Section 4 (the brief explicitly
// says «USE THIS for copy»), the cards are: dividend, duplicated position,
// drawdown — NOT the brief's reconciliation/concentration/pattern triplet.
//
// Each card body is observation-coded — never advice.

import type { CSSProperties, ReactElement } from 'react';
import { DifferentiatorCard } from './landing/DifferentiatorCard';

const EYEBROW = "WHAT YOU'D MISS";
const H2 = 'The things hiding between your brokers.';
const BODY_INTRO = 'Three things Provedo notices that almost nobody catches manually:';

const CARDS = [
  {
    numeral: '01',
    header: "Dividend you didn't know was coming.",
    body: 'Provedo flags upcoming distributions across every account, before the ex-date.',
  },
  {
    numeral: '02',
    header: "Position you're holding twice.",
    body: "When the same exposure shows up in your IBKR account and your robo-advisor, you'll see it.",
  },
  {
    numeral: '03',
    header: "Drawdown you'd only notice in April.",
    body: 'Cross-account drawdowns surface as they happen — not when you finally sit down with a spreadsheet.',
  },
] as const;

const SECTION_STYLE: CSSProperties = {
  padding: '96px 24px',
  backgroundColor: 'var(--provedo-bg-page)',
};

const CONTAINER_STYLE: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
};

const EYEBROW_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: '12px',
  letterSpacing: '0.18em',
  color: 'var(--provedo-text-tertiary)',
  margin: 0,
  marginBottom: '20px',
};

const H2_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 600,
  fontSize: 'clamp(28px, 3.8vw, 40px)',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
  textWrap: 'balance',
  maxWidth: '24ch',
};

const BODY_INTRO_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.6,
  color: 'var(--provedo-text-secondary)',
  margin: 0,
  marginTop: '20px',
  marginBottom: '40px',
  maxWidth: '60ch',
};

export function LandingDifferentiators(): ReactElement {
  return (
    <section
      aria-labelledby="differentiators-heading"
      data-testid="landing-differentiators"
      style={SECTION_STYLE}
    >
      <div style={CONTAINER_STYLE}>
        <p style={EYEBROW_STYLE}>{EYEBROW}</p>
        <h2 id="differentiators-heading" style={H2_STYLE}>
          {H2}
        </h2>
        <p style={BODY_INTRO_STYLE}>{BODY_INTRO}</p>

        <div className="differentiators-grid" data-testid="differentiators-grid">
          <style>{`
            .differentiators-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
            }
            @media (min-width: 768px) {
              .differentiators-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
              .differentiators-grid > :nth-child(3) {
                grid-column: 1 / -1;
              }
            }
            @media (min-width: 1024px) {
              .differentiators-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
              .differentiators-grid > :nth-child(3) {
                grid-column: auto;
              }
            }
          `}</style>
          {CARDS.map((card) => (
            <DifferentiatorCard
              key={card.numeral}
              numeral={card.numeral}
              header={card.header}
              body={card.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

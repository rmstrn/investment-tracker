// LandingTrustBand — Landing-v2 §B.5 «Read-only. No advice. No surprises.»
//
// Server component. Slate-900 inverted full-bleed band. Three trust statements
// in 3-column grid. The dark band is a visual rhythm break from the cream
// sections — reads as «weight», the page slows down to make a serious
// commitment.
//
// Contrast verified WCAG AAA per spec §B.5 a11y notes.

import type { CSSProperties, ReactElement } from 'react';

const EYEBROW = 'THE BOUNDARY';
const H2 = 'Read-only. No advice. No surprises.';

const ITEMS = [
  {
    head: 'READ-ONLY ACCESS.',
    body: 'Provedo can see your positions. It cannot move them.',
  },
  {
    head: 'ANALYSIS, NOT ADVICE.',
    body: "We explain what's in your portfolio. We don't tell you what to do with it.",
  },
  {
    head: 'YOUR DATA STAYS YOURS.',
    body: 'We never sell it. We never share it. You can delete everything in one click.',
  },
] as const;

const SECTION_STYLE: CSSProperties = {
  padding: '96px 24px',
  backgroundColor: '#0F172A',
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
  color: 'rgba(45, 212, 191, 0.85)',
  margin: 0,
  marginBottom: '20px',
};

const H2_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 600,
  fontSize: 'clamp(28px, 3.8vw, 40px)',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  color: '#F8FAFC',
  margin: 0,
  marginBottom: '56px',
  textWrap: 'balance',
};

const ITEM_HEAD_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 500,
  fontSize: '13px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(45, 212, 191, 0.85)',
  margin: 0,
  marginBottom: '12px',
};

const ITEM_BODY_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.65,
  color: 'rgba(226, 232, 240, 0.92)',
  margin: 0,
};

export function LandingTrustBand(): ReactElement {
  return (
    <section
      aria-labelledby="trust-band-heading"
      data-testid="landing-trust-band"
      style={SECTION_STYLE}
    >
      <div style={CONTAINER_STYLE}>
        <p style={EYEBROW_STYLE}>{EYEBROW}</p>
        <h2 id="trust-band-heading" style={H2_STYLE}>
          {H2}
        </h2>

        <div className="trust-band-grid">
          <style>{`
            .trust-band-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 32px;
            }
            @media (min-width: 1024px) {
              .trust-band-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 48px;
              }
            }
          `}</style>
          {ITEMS.map((item) => (
            <div
              key={item.head}
              data-testid={`trust-item-${item.head.toLowerCase().replace(/\W+/g, '-')}`}
            >
              <p style={ITEM_HEAD_STYLE}>{item.head}</p>
              <p style={ITEM_BODY_STYLE}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

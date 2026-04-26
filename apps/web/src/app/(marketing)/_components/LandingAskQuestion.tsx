// LandingAskQuestion — Landing-v2 §B.2 «Ask the question you've been Googling.»
//
// Server component (no animation state). Static printed transcript with three
// inline citation chips and a Sources line. The transcript IS the proof — per
// content-lead doc §8 risk note, this section is load-bearing for the page.
//
// Citation chips here are static superscript spans (not interactive) — the
// section-2 transcript reads as a printed page, not a live demo. The hero
// already sells «live»; section 2 sells «specificity».

import type { CSSProperties, ReactElement } from 'react';
import { Sources } from './Sources';

const EYEBROW = 'THE EARNER';
const H2 = "Ask the question you've been Googling.";
const BODY_1 =
  'Provedo reads every position across every broker you connect — Schwab, IBKR, Binance, Revolut, the lot — and answers in plain language with the source numbers cited.';
const BODY_2 = 'Not a dashboard you have to interpret. A conversation you can finish.';
const CAPTION =
  'Every answer cites the position, the broker, and the date. You can verify in two clicks.';

const TRANSCRIPT_USER = 'How concentrated am I in tech right now?';

const SOURCES_ITEMS = [
  'Schwab statement · 2026-04-26',
  'IBKR positions · today',
  'Fidelity 401k · 2026-04-25',
];

const SECTION_STYLE: CSSProperties = {
  padding: '96px 24px',
  backgroundColor: 'var(--provedo-bg-page)',
};

const CONTAINER_STYLE: CSSProperties = {
  maxWidth: '880px',
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
  fontSize: 'clamp(28px, 4vw, 44px)',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
  textWrap: 'balance',
};

const BODY_1_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: 1.6,
  color: 'var(--provedo-text-secondary)',
  margin: 0,
  marginTop: '24px',
  maxWidth: '64ch',
};

const BODY_2_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 500,
  fontStyle: 'italic',
  fontSize: '18px',
  lineHeight: 1.6,
  color: 'var(--provedo-text-primary)',
  margin: 0,
  marginTop: '16px',
  maxWidth: '64ch',
};

const CARD_STYLE: CSSProperties = {
  marginTop: '40px',
  backgroundColor: 'var(--provedo-bg-elevated)',
  border: '1px solid var(--provedo-border-subtle)',
  borderRadius: '8px',
  padding: '32px',
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const USER_MSG_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-mono)',
  fontWeight: 400,
  fontSize: '15px',
  lineHeight: 1.55,
  color: 'var(--provedo-text-secondary)',
  margin: 0,
};

const PROVEDO_MSG_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.65,
  letterSpacing: '-0.005em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
};

const CITATION_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 600,
  fontSize: '11px',
  color: 'var(--provedo-accent)',
  verticalAlign: 'super',
  marginRight: '1px',
};

const CAPTION_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: 1.55,
  color: 'var(--provedo-text-tertiary)',
  margin: 0,
  marginTop: '24px',
  textAlign: 'center',
};

function StaticCitation({ index }: { index: number }): ReactElement {
  // Decorative marker rendered as a styled span (visually superscript).
  // We avoid the native <sup> element here so we can mark it aria-hidden
  // without tripping the «aria-hidden on focusable element» linter rule.
  // The screen-reader trail flows naturally through the surrounding
  // sentence + the Sources line below.
  return (
    <span style={CITATION_STYLE} aria-hidden="true">
      {index}
    </span>
  );
}

export function LandingAskQuestion(): ReactElement {
  return (
    <section
      aria-labelledby="ask-question-heading"
      data-testid="landing-ask-question"
      style={SECTION_STYLE}
    >
      <div style={CONTAINER_STYLE}>
        <p style={EYEBROW_STYLE}>{EYEBROW}</p>
        <h2 id="ask-question-heading" style={H2_STYLE}>
          {H2}
        </h2>
        <p style={BODY_1_STYLE}>{BODY_1}</p>
        <p style={BODY_2_STYLE}>{BODY_2}</p>

        <figure style={CARD_STYLE} aria-label="Sample concentration analysis transcript">
          <p style={USER_MSG_STYLE} data-testid="ask-question-user">
            <span aria-hidden="true">↳ </span>
            {TRANSCRIPT_USER}
          </p>
          <p style={PROVEDO_MSG_STYLE} data-testid="ask-question-answer">
            Across all 4 of your accounts, tech sits at 41.2% of total holdings —{' '}
            <StaticCitation index={1} />
            AAPL 9.4%, <StaticCitation index={2} />
            NVDA 7.8%, <StaticCitation index={3} />
            GOOGL 6.1%, MSFT 5.6%, plus QQQ exposure of 12.3% (Schwab + Fidelity combined). Your
            stated target was 30% tech.
          </p>
          <Sources items={SOURCES_ITEMS} />
        </figure>

        <p style={CAPTION_STYLE}>{CAPTION}</p>
      </div>
    </section>
  );
}

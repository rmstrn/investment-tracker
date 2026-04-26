'use client';

// LandingClosingCTA — Landing-v2 §B.6 «It only takes one question.»
//
// Centered single-column closer. Same `Get early access` CTA as the hero;
// dispatches the same window event so the modal opens identically.
//
// Static — no scroll-triggered animation. The section reads «landed» after
// the page's narrative has run its course.

import type { CSSProperties, ReactElement } from 'react';
import { dispatchOpenEarlyAccess } from './LandingEarlyAccessModal';
import { ProvedoButton } from './ProvedoButton';

const H2 = 'It only takes one question.';
const SUB =
  'Get early access. Ask Provedo anything about your portfolio. See if the answer is worth keeping around.';
const CTA_LABEL = 'Get early access';
const MICROCOPY =
  "Pre-alpha. We're letting people in slowly. Tell us about your setup and we'll be in touch.";

const SECTION_STYLE: CSSProperties = {
  padding: '120px 24px',
  backgroundColor: 'var(--provedo-bg-page)',
};

const CONTAINER_STYLE: CSSProperties = {
  maxWidth: '720px',
  margin: '0 auto',
  textAlign: 'center',
};

const H2_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 600,
  fontSize: 'clamp(32px, 5vw, 56px)',
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
  textWrap: 'balance',
};

const SUB_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: 'clamp(16px, 1.6vw, 18px)',
  lineHeight: 1.6,
  color: 'var(--provedo-text-secondary)',
  margin: 0,
  marginTop: '24px',
};

const MICROCOPY_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: 1.55,
  color: 'var(--provedo-text-tertiary)',
  margin: 0,
  marginTop: '24px',
};

export function LandingClosingCTA(): ReactElement {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    dispatchOpenEarlyAccess();
  }

  return (
    <section
      id="waitlist"
      aria-labelledby="closing-heading"
      data-testid="landing-closing-cta"
      style={SECTION_STYLE}
    >
      <div style={CONTAINER_STYLE}>
        <h2 id="closing-heading" style={H2_STYLE}>
          {H2}
        </h2>
        <p style={SUB_STYLE}>{SUB}</p>
        <div style={{ marginTop: '40px' }}>
          <ProvedoButton
            href="#early-access"
            variant="primary"
            size="lg"
            data-testid="closing-cta"
            onClick={handleClick}
          >
            {CTA_LABEL} <span aria-hidden="true">→</span>
          </ProvedoButton>
        </div>
        <p style={MICROCOPY_STYLE}>{MICROCOPY}</p>
      </div>
    </section>
  );
}

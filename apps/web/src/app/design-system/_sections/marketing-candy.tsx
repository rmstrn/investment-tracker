'use client';

import { PaintDrip } from '@investment-tracker/ui';

import { DsSection } from '../_components/SectionHead';

/**
 * §Marketing-candy — Phase 3a hero showcase.
 *
 * Demonstrates the candy register end-to-end: ink-deep mini-header,
 * candy-pink hero with Bagel chunky lowercase H1 + tilted mustard chip +
 * ink-on-orange CTA + secondary link, paint-drip transitioning candy-pink →
 * candy-mustard, candy-mustard "How it works" block with 3 candy-bordered
 * cards, paint-drip mustard → ink, and a black trust-strip footer.
 *
 * The whole section opts into the candy semantic cascade by setting
 * `data-surface="candy"` on its outer wrapper. Tokens flow from there.
 *
 * Mascot illustration deliberately left as a labelled placeholder div
 * sized to the right side of the hero — PO will plug a mascot in later.
 *
 * Per `docs/design/PROVEDO_DESIGN_SYSTEM_v2.md` §6 Surface system, §7
 * Component primitives, §10 Cross-surface routing rule.
 */
export function MarketingCandySection() {
  return (
    <DsSection
      title="Marketing register — candy hero"
      meta="ink header · pink hero · drip · mustard · drip · ink trust"
    >
      <div data-surface="candy" className="mc-frame">
        <MiniHeader />
        <PinkHero />
        <PaintDrip
          variant="soft"
          from="var(--bg-pink, #F7A1C9)"
          to="var(--drip-mustard, #C99A1F)"
        />
        <MustardHowItWorks />
        <PaintDrip
          variant="uneven"
          from="var(--bg-mustard, #F4CC4A)"
          to="var(--color-ink-v2-deep, #1C1B26)"
        />
        <TrustStrip />
      </div>
    </DsSection>
  );
}

/**
 * Mini-header strip — ink-deep with white nav text. Renders inline (not
 * actually sticky) for the showcase context.
 */
function MiniHeader() {
  return (
    <header className="mc-header" aria-label="Marketing nav (showcase)">
      <span className="mc-wordmark">provedo</span>
      <nav className="mc-nav" aria-label="Primary">
        <a href="#marketing-candy" className="mc-nav__link">
          product
        </a>
        <a href="#marketing-candy" className="mc-nav__link">
          pricing
        </a>
        <a href="#marketing-candy" className="mc-nav__link">
          about
        </a>
      </nav>
      <a href="#marketing-candy" className="mc-pill" role="button">
        sign in
      </a>
    </header>
  );
}

/**
 * Candy-pink hero — Bagel chunky lowercase headline with one word in a
 * tilted mustard chip, Manrope sub-line, ink-on-orange CTA with hard 5px
 * ink shadow, secondary text link, mascot placeholder on the right.
 */
function PinkHero() {
  return (
    <section className="mc-hero" aria-labelledby="mc-hero-h1">
      <div className="mc-hero__copy">
        <h1 id="mc-hero-h1" className="mc-hero__display">
          let&apos;s
          <span className="mc-chip" aria-hidden="true">
            run
          </span>
          your portfolio.
        </h1>
        <p className="mc-hero__sub">
          One quiet view across every broker. No casino confetti. No grey dashboard pretending to be
          a Bloomberg terminal.
        </p>
        <div className="mc-hero__cta-row">
          <a href="#marketing-candy" className="mc-cta-primary" role="button">
            start free
          </a>
          <a href="#marketing-candy" className="mc-cta-link">
            see how it works →
          </a>
        </div>
      </div>
      <div className="mc-hero__mascot" aria-hidden="true">
        [mascot tbd]
      </div>
    </section>
  );
}

/**
 * Candy-mustard "How it works" — 3 candy-bordered cards reusing the
 * Phase-2 Card variant tokens (2px ink border + hard 4/4 shadow, paper-card
 * surface, Bagel display heading inside).
 */
function MustardHowItWorks() {
  const steps: ReadonlyArray<{ title: string; copy: string; index: string }> = [
    {
      index: '01',
      title: 'connect',
      copy: 'Plug in IBKR, Binance, and your bank in under 90 seconds. Read-only by default.',
    },
    {
      index: '02',
      title: 'unify',
      copy: 'We pull every position into one view. Cross-broker concentration becomes obvious.',
    },
    {
      index: '03',
      title: 'decide',
      copy: 'Drift alerts, correlation creep, the position you forgot. Quiet signal, not noise.',
    },
  ];

  return (
    <section className="mc-mustard" aria-labelledby="mc-mustard-h2">
      <h2 id="mc-mustard-h2" className="mc-mustard__display">
        how it works.
      </h2>
      <div className="mc-mustard__grid" role="list">
        {steps.map((step) => (
          <article key={step.index} className="mc-step v2-card v2-card--candy" role="listitem">
            <p className="mc-step__index">{step.index}</p>
            <h3 className="mc-step__title">{step.title}</h3>
            <p className="mc-step__copy">{step.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Trust-strip footer — ink-deep band with parchment text. Three short
 * proof-points.
 */
function TrustStrip() {
  const proofs: ReadonlyArray<string> = ['Bank-level encryption', 'No trading fees', 'SEC-aware'];
  return (
    <footer className="mc-trust" aria-label="Trust signals">
      <ul className="mc-trust__list">
        {proofs.map((proof, i) => (
          <li key={proof} className="mc-trust__item">
            {proof}
            {i < proofs.length - 1 ? <span aria-hidden="true"> · </span> : null}
          </li>
        ))}
      </ul>
    </footer>
  );
}

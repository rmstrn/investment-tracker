// LandingCoverage — Landing-v2 §B.3 «Every account. One conversation.»
//
// Server component. Two-column on desktop: text left, BrokerLogoStrip right.
// Background is muted-cream (slightly warmer than page bg) to provide visual
// rhythm break from hero/section-2 cream.
//
// Per right-hand resolution #2: copy uses «Hundreds of institutions» as
// fallback (TD-095 still open for verified count of «Over 1,000»).

import type { CSSProperties, ReactElement } from 'react';
import { BrokerLogoStrip, type BrokerWordmark } from './landing/BrokerLogoStrip';

const EYEBROW = 'COVERAGE';
const H2 = 'Every account. One conversation.';
const BODY_1 =
  'US brokerages, European banks, crypto exchanges, on-chain wallets. If you hold something there, Provedo can read it.';
const BODY_2 = 'Hundreds of institutions supported. Read-only. We never get keys that move money.';
const SEE_FULL = 'See full institution list →';

// Order: Schwab, Fidelity, IBKR, Vanguard, Robinhood, E*TRADE, Trading 212,
// Revolut, Coinbase, Binance, Kraken, Ledger
const WORDMARKS: ReadonlyArray<BrokerWordmark> = [
  { name: 'Schwab' },
  { name: 'Fidelity' },
  { name: 'IBKR' },
  { name: 'Vanguard' },
  { name: 'Robinhood' },
  { name: 'E*TRADE' },
  { name: 'Trading 212' },
  { name: 'Revolut' },
  { name: 'Coinbase' },
  { name: 'Binance' },
  { name: 'Kraken' },
  { name: 'Ledger' },
];

const SECTION_STYLE: CSSProperties = {
  padding: '96px 24px',
  backgroundColor: 'var(--provedo-bg-muted)',
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
  fontSize: 'clamp(28px, 3.5vw, 36px)',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  color: 'var(--provedo-text-primary)',
  margin: 0,
  textWrap: 'balance',
};

const BODY_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.65,
  color: 'var(--provedo-text-secondary)',
  margin: 0,
  marginTop: '20px',
  maxWidth: '40ch',
};

const SEE_FULL_STYLE: CSSProperties = {
  fontFamily: 'var(--provedo-font-sans)',
  fontWeight: 500,
  fontSize: '14px',
  color: 'var(--provedo-accent)',
  textDecoration: 'none',
  marginTop: '24px',
  display: 'inline-block',
};

export function LandingCoverage(): ReactElement {
  return (
    <section
      aria-labelledby="coverage-heading"
      data-testid="landing-coverage"
      style={SECTION_STYLE}
    >
      <div style={CONTAINER_STYLE}>
        <div className="coverage-grid" data-testid="coverage-grid">
          <style>{`
            .coverage-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 48px;
              align-items: start;
            }
            @media (min-width: 1024px) {
              .coverage-grid {
                grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
                gap: 72px;
              }
            }
          `}</style>

          <div>
            <p style={EYEBROW_STYLE}>{EYEBROW}</p>
            <h2 id="coverage-heading" style={H2_STYLE}>
              {H2}
            </h2>
            <p style={BODY_STYLE}>{BODY_1}</p>
            <p style={BODY_STYLE}>{BODY_2}</p>
          </div>

          <div>
            <BrokerLogoStrip wordmarks={WORDMARKS} />
            <a href="#waitlist" style={SEE_FULL_STYLE} data-testid="coverage-see-full">
              {SEE_FULL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

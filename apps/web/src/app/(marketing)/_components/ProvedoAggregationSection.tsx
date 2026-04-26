// ProvedoAggregationSection — §S8 broker list (Slice-LP3.5)
//
// Slice-LP3.5 chrome polish (PD re-evaluation §3.5 + brand-voice §8):
//   - DROP the keyframe marquee animation entirely (Linear-changelog pattern
//     is calmer and more honest than animated scroll, which asks the reader
//     to wait-and-watch for proof).
//   - Replace with a static 3-column mono list of broker abbreviations.
//   - Closing line: «— and growing» (brand-voice EDIT — NOT «100s more»,
//     which would conflict with proof-bar Cell I «100s»).
//
// Reduces the page motion budget (was the most kinetic surface). No
// animation here at all by design.

import type { ReactElement } from 'react';
import { ScrollFadeIn } from './ScrollFadeIn';

const BROKERS: ReadonlyArray<{ label: string; abbr: string }> = [
  { label: 'Interactive Brokers', abbr: 'IBKR' },
  { label: 'Charles Schwab', abbr: 'Schwab' },
  { label: 'Fidelity', abbr: 'Fidelity' },
  { label: 'Coinbase', abbr: 'Coinbase' },
  { label: 'Robinhood', abbr: 'Robinhood' },
  { label: 'E*TRADE', abbr: 'E*TRADE' },
  { label: 'Trading212', abbr: 'T212' },
  { label: 'Questrade', abbr: 'Questrade' },
  { label: 'Wealthsimple', abbr: 'Wealth' },
  { label: 'Binance', abbr: 'Binance' },
  { label: 'Kraken', abbr: 'Kraken' },
  { label: 'Hargreaves Lansdown', abbr: 'HL' },
] as const;

export function ProvedoAggregationSection(): ReactElement {
  return (
    <section
      aria-labelledby="aggregation-heading"
      className="px-4 py-16 md:py-24"
      style={{ backgroundColor: 'var(--provedo-bg-page)' }}
    >
      <ScrollFadeIn>
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="aggregation-heading"
            className="text-2xl font-semibold tracking-tight md:text-4xl"
            style={{ color: 'var(--provedo-text-primary)' }}
          >
            One chat holds everything.
          </h2>
          <p
            className="mt-4 text-base leading-relaxed md:text-lg"
            style={{ color: 'var(--provedo-text-secondary)' }}
          >
            Hundreds of brokers and exchanges, in one place — Provedo reads them all.
          </p>
        </div>
      </ScrollFadeIn>

      {/* Static typeset list — replaces v3 marquee animation */}
      <ScrollFadeIn delay={120}>
        <div
          className="mx-auto mt-12 md:mt-16"
          style={{ maxWidth: '640px' }}
          data-testid="broker-typeset-list"
        >
          <ul
            aria-label="Supported brokers and exchanges"
            className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontFamily: 'var(--provedo-font-mono)',
              fontSize: '13px',
              color: 'var(--provedo-text-secondary)',
              letterSpacing: '0.01em',
            }}
          >
            {BROKERS.map((b) => (
              <li key={b.abbr} aria-label={b.label}>
                {b.abbr}
              </li>
            ))}
          </ul>

          <p
            className="mt-6 text-center"
            style={{
              fontFamily: 'var(--provedo-font-mono)',
              fontSize: '13px',
              color: 'var(--provedo-text-tertiary)',
              fontStyle: 'italic',
            }}
            data-testid="broker-list-tail"
          >
            — and growing
          </p>
        </div>
      </ScrollFadeIn>
    </section>
  );
}

'use client';

// ProvedoAggregationSection — §S8 broker marquee (v3)
// V3.5: scroll-into-view fade-in for header + sub
// Uses fallback copy «Hundreds of brokers and exchanges» per TD-095 (1000+ needs tech-lead verify)
// CSS-only infinite-scroll marquee with prefers-reduced-motion respected

const BROKER_PLACEHOLDERS: ReadonlyArray<{ label: string; abbr: string }> = [
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

import { ScrollFadeIn } from './ScrollFadeIn';

function BrokerCard({ label, abbr }: { label: string; abbr: string }) {
  return (
    <div
      className="flex h-12 w-28 flex-shrink-0 items-center justify-center rounded-lg border"
      style={{
        borderColor: 'var(--provedo-border-subtle)',
        backgroundColor: 'var(--provedo-bg-elevated)',
      }}
      aria-label={label}
      role="img"
    >
      <span
        className="text-xs font-medium tracking-tight"
        style={{ color: 'var(--provedo-text-tertiary)' }}
      >
        {abbr}
      </span>
    </div>
  );
}

export function ProvedoAggregationSection() {
  return (
    <section
      aria-labelledby="aggregation-heading"
      className="overflow-hidden px-4 py-16 md:py-24"
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

      {/* Marquee */}
      <div className="relative mt-12 md:mt-16" aria-label="Supported brokers and exchanges">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
          style={{
            background: 'linear-gradient(to right, var(--provedo-bg-page), transparent)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
          style={{
            background: 'linear-gradient(to left, var(--provedo-bg-page), transparent)',
          }}
        />

        <div className="overflow-hidden">
          <div
            className="flex gap-4 provedo-marquee"
            style={
              {
                width: 'max-content',
                animation: 'provedo-scroll 30s linear infinite',
              } as React.CSSProperties
            }
          >
            {[...BROKER_PLACEHOLDERS, ...BROKER_PLACEHOLDERS].map((broker, i) => (
              <BrokerCard key={`${broker.abbr}-${i}`} label={broker.label} abbr={broker.abbr} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes provedo-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .provedo-marquee {
            animation: none !important;
            flex-wrap: wrap;
            justify-content: center;
            width: auto !important;
          }
        }
      `}</style>
    </section>
  );
}

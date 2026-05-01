'use client';

import { DsRow, DsSection } from '../_components/SectionHead';

/**
 * §Cards — Design System v2 Phase 2.
 *
 * Per `docs/design/PROVEDO_DESIGN_SYSTEM_v2.md` §7.3 (Card — three variants).
 * The single Card primitive of v1 splits into three explicit, route-bound
 * surface variants:
 *
 *   1. candy-bordered — paper-card bg + 2px ink border + hard 4/4 ink shadow.
 *      Lives on candy-pink or candy-mustard fields. Bagel display heading
 *      inside. Marketing-only.
 *
 *   2. paper-inset — paper-card bg + warm-soft shadow + Manrope only. Default
 *      app-interior surface (portfolio cards, charts, settings).
 *
 *   3. ink-ticker — ink-deep bg + mustard accent strip + tabular-num mono
 *      numerals. Highest-emphasis surface inside the app: live ticker,
 *      summary band, "watching" indicators.
 *
 * Each variant gets one feature card so reviewers can hover and feel the
 * gesture. The candy-bordered card sits inside a `[data-surface="candy"]`
 * field so it earns the candy-pink background that demonstrates how the
 * 2px ink border keeps it legible.
 */

export interface CardsSectionProps {
  variant: 'light' | 'dark';
}

export function CardsSection({ variant }: CardsSectionProps) {
  return (
    <DsSection
      title="Card"
      meta={
        variant === 'light'
          ? 'candy-bordered · paper-inset · ink-ticker'
          : '3 variants × surface contracts'
      }
    >
      <DsRow label="candy-bordered — marketing on candy field (Bagel display + ink border)">
        <div className="v2-candy-field" data-surface="candy">
          <article className="v2-card v2-card--candy" aria-labelledby="ds-v2-candy-card-title">
            <h4 id="ds-v2-candy-card-title" className="v2-card__display">
              Notice what you&apos;d miss.
            </h4>
            <p className="v2-card__body">
              Provedo surfaces patterns hidden across your brokers — concentration drift,
              correlation creep, the position you forgot you doubled.
            </p>
          </article>
        </div>
      </DsRow>

      <DsRow label="paper-inset — app interior default (warm-soft shadow, Manrope only)">
        <div
          className="v2-card-pair"
          // Constrain so cards don't stretch to the full page width — the
          // hover gesture reads better at card-shaped proportions.
          style={{ maxWidth: 720 }}
        >
          <article className="v2-card v2-card--paper" aria-labelledby="ds-v2-paper-card-1-title">
            <h4 id="ds-v2-paper-card-1-title" className="v2-card__heading">
              IBKR · LYNX
            </h4>
            <p
              className="v2-card__heading"
              style={{
                fontFamily: 'var(--font-family-mono, ui-monospace, monospace)',
                fontVariantNumeric: 'tabular-nums',
                fontSize: 28,
                letterSpacing: '-0.01em',
              }}
            >
              $184,210
            </p>
            <p className="v2-card__body">+2.4% week · 12 positions</p>
          </article>
          <article className="v2-card v2-card--paper" aria-labelledby="ds-v2-paper-card-2-title">
            <h4 id="ds-v2-paper-card-2-title" className="v2-card__heading">
              BINANCE
            </h4>
            <p
              className="v2-card__heading"
              style={{
                fontFamily: 'var(--font-family-mono, ui-monospace, monospace)',
                fontVariantNumeric: 'tabular-nums',
                fontSize: 28,
                letterSpacing: '-0.01em',
              }}
            >
              $42,180
            </p>
            <p
              className="v2-card__body"
              style={{ color: 'var(--color-signal-orange-deep, #C76A22)', fontWeight: 600 }}
            >
              −5.8% week · 7 positions
            </p>
          </article>
        </div>
      </DsRow>

      <DsRow label="ink-ticker — high-emphasis app strip (mustard accent, mono numerals)">
        <article
          className="v2-card v2-card--ink"
          aria-labelledby="ds-v2-ink-card-title"
          style={{ maxWidth: 480 }}
        >
          <p
            id="ds-v2-ink-card-title"
            className="v2-state-cell__label"
            style={{ color: 'var(--color-candy-mustard, #F4CC4A)' }}
          >
            LIVE · NVDA
          </p>
          <p className="v2-card__numeral">$144.27</p>
          <p className="v2-card__body">
            Combined exposure across 3 of your accounts: 18% — concentrated more than it looks
            broker-by-broker.
          </p>
        </article>
      </DsRow>
    </DsSection>
  );
}

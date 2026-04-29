'use client';

import { Search } from 'lucide-react';
import { DsRow, DsSection } from '../_components/SectionHead';

/**
 * §Cards — portfolio · insight · empty cards in product context.
 *
 * Static reference renders three cards in a 3-col grid: two portfolio cards
 * (broker name + amount + delta + pulse indicator) and one insight card
 * (eyebrow + tagline + supporting copy). Below them sits a single empty card.
 *
 * Real Provedo copy:
 *   - IBKR · LYNX · $184,210 · +2.4% week · 12 positions
 *   - BINANCE · $42,180 · −5.8% week · 7 positions (warn pulse)
 *   - INSIGHT · 02 — «A pattern across accounts.»
 *   - Empty card: «No insights yet. Connect your first broker…»
 *
 * Card surfaces use `.showcase-pf-card` / `.showcase-insight-card` /
 * `.showcase-empty-card` from `_styles/showcase.css` so they match the static
 * reference visual contract (paper-feel, var(--shadow-card), 18px radius).
 */

export interface CardsSectionProps {
  variant: 'light' | 'dark';
}

export function CardsSection({ variant }: CardsSectionProps) {
  return (
    <DsSection
      title="Cards"
      meta={variant === 'light' ? 'portfolio · insight · empty' : 'all 3 types'}
    >
      <DsRow>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 14,
          }}
        >
          <article className="showcase-pf-card">
            <div className="showcase-pf-card__row">
              <div>
                <p className="showcase-pf-card__broker">IBKR · LYNX</p>
                <p className="showcase-pf-card__amount">$184,210</p>
                <p className="showcase-pf-card__tiny">+2.4% week · 12 positions</p>
              </div>
              <span className="showcase-pulse" aria-hidden />
            </div>
          </article>
          <article className="showcase-pf-card">
            <div className="showcase-pf-card__row">
              <div>
                <p className="showcase-pf-card__broker">BINANCE</p>
                <p className="showcase-pf-card__amount">$42,180</p>
                <p
                  className="showcase-pf-card__tiny"
                  style={{ color: 'var(--ink)', fontWeight: 600 }}
                >
                  −5.8% week · 7 positions
                </p>
              </div>
              <span className="showcase-pulse showcase-pulse--warn" aria-hidden />
            </div>
          </article>
          <article className="showcase-insight-card">
            <p className="showcase-insight-card__eyebrow">INSIGHT · 02</p>
            <h4 className="showcase-insight-card__head">
              A pattern <strong>across</strong> accounts.
            </h4>
            <p className="showcase-insight-card__body">
              NVDA appears in 3 of your accounts. Combined exposure 18% — concentrated more than it
              looks broker-by-broker.
            </p>
          </article>
        </div>
      </DsRow>

      <DsRow>
        <div style={{ maxWidth: 420 }}>
          <article className="showcase-empty-card">
            <div className="showcase-empty-card__icon" aria-hidden>
              <Search size={22} aria-hidden strokeWidth={1.6} />
            </div>
            <h4>No insights yet.</h4>
            <p>Connect your first broker and Provedo will surface patterns within a minute.</p>
          </article>
        </div>
      </DsRow>
    </DsSection>
  );
}

import { RecordRail } from '../../style-d1/_components/RecordRail';
import { HeroCTA } from '../_components/HeroCTA';
import { HERO_DISCLAIMER_CHIP, HERO_EYEBROW, HERO_H1, HERO_SUB } from '../_lib/landing-copy';

/**
 * Section 1 — Hero (asymmetric 8/12 + 4/12).
 *
 * Per synthesis-lock §3 + product-designer v2 §4:
 *   - Left (8/12) — type-only: eyebrow + H1 + sub + CTAs + chip row.
 *   - Right (4/12) — Read-tier pronounced surface (`bg-card-elevated`
 *     + emboss + Record Rail) showing real broker-aggregated $847,290
 *     numeral with sourced datestamp.
 *   - Hover-NO-OP holds on both halves.
 *   - 8/12 + 4/12 collapses to single-column at ≤1024px.
 *
 * The right plate is a STATIC mini-version of the live preview slab
 * below — single sample number, datestamp, lime-hairline Record Rail.
 * The full live D1 dashboard renders in §4 «Live preview».
 */
export function Hero() {
  return (
    <header className="landing-hero" aria-labelledby="landing-hero-h1">
      <div className="landing-hero__type">
        <p className="landing-section__eyebrow">{HERO_EYEBROW}</p>
        <h1 id="landing-hero-h1" className="landing-hero__h1">
          {HERO_H1}
        </h1>
        <p className="landing-hero__sub">{HERO_SUB}</p>

        <HeroCTA />

        <div className="landing-hero__chip-row" aria-hidden="false">
          <span className="landing-chip">
            <span className="landing-chip__dot" aria-hidden />
            read-only
          </span>
          <span className="landing-chip">
            <span className="landing-chip__dot" aria-hidden />
            no trades
          </span>
          <span className="landing-chip" title={HERO_DISCLAIMER_CHIP}>
            {HERO_DISCLAIMER_CHIP}
          </span>
        </div>
      </div>

      <aside className="landing-hero__plate" aria-label="Sample portfolio numeral">
        <RecordRail label="LEDGER · MAY 02 · 17:42" />
        <p className="landing-hero__plate-label">Portfolio value</p>
        <p className="landing-hero__plate-num">$847,290</p>
        <p className="landing-hero__plate-meta">
          Across 4 brokers · 18 holdings · sourced 2026-05-02
        </p>
      </aside>
    </header>
  );
}

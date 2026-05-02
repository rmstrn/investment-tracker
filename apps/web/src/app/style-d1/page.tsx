import { EmbeddedDashboardSlab } from './_components/EmbeddedDashboardSlab';

/**
 * `/style-d1` — «Lime Cabin» canonical preview.
 *
 * Marketing strip + dashboard slab. Per architect ADR-4 (landing v1
 * D1_LANDING_ARCHITECTURE.md), the dashboard interior was extracted to
 * `<EmbeddedDashboardSlab>` so the landing surface (`/`) and this
 * canonical preview consume the same source of truth — design tweaks
 * here land on landing automatically.
 *
 * This route renders `variant="full"` (welcome eyebrow + filter chips +
 * disclosure strip + nav). The landing surface renders
 * `variant="landing"` (KPI band + 3-col grid only — no chrome).
 *
 * Direction (unchanged from prior iteration):
 *   - Deep cool-violet canvas, lime as «look here», fully-rounded pill
 *     vocabulary, AND the Provedo Record Rail (signature element)
 *     headering every persistent data zone AND replacing the chat-row
 *     form factor for AI insights.
 *   - One KPI card highlighted lime at a time (drift observation per
 *     spec §7 — the «most-actionable metric» rule).
 *   - Five sample AI insights (past-tense, source-attributed, no
 *     advisory language) render as Record Rail entries.
 *   - Persistent disclaimer chip in nav. Footer Lane-A disclosure
 *     stays as defence in depth.
 *   - All money numerals via `.d1-num` (Geist Mono tabular).
 */

const HERO_EYEBROW = 'PROVEDO · POSITION';
const HERO_HEADLINE = 'Your portfolio, on the record. Lime where it matters.';
const HERO_SUB = 'Read-only across every broker. Dividends dated. Drift noted. Nothing prescribed.';
const HERO_CTA = 'See the dashboard';

export default function StyleD1Page() {
  return (
    <div className="d1-page">
      <div className="d1-shell">
        {/* ── Marketing strip (above the dashboard, ≤280px tall) ─────── */}
        <header className="d1-marketing" aria-labelledby="d1-hero-heading">
          <div>
            <p className="d1-eyebrow">{HERO_EYEBROW}</p>
            <h1 id="d1-hero-heading" className="d1-headline">
              {HERO_HEADLINE}
            </h1>
            <p className="d1-sub">{HERO_SUB}</p>
          </div>
          <div>
            <a href="#dashboard" className="d1-cta">
              <span>{HERO_CTA}</span>
              <span aria-hidden>↓</span>
            </a>
          </div>
        </header>

        {/* ── Dashboard surface (the hero) ───────────────────────────── */}
        <div id="dashboard">
          <EmbeddedDashboardSlab variant="full" />
        </div>
      </div>
    </div>
  );
}

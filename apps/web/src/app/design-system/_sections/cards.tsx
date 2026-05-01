import { ArrowUpRight, ChartBar, Plus, Wallet } from 'lucide-react';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';
import { RecordRail } from '../_components/RecordRail';

/**
 * §Cards — KPI card variants.
 *
 * All variants share the 24px radius, 132/160px min-height, and the
 * hover-lift (`translateY(-2px)` + 8px shadow). One lime fill at a time
 * — by rule §7 of the D1 spec.
 *
 * Variants:
 *  - default dark (Mono numeral on bg-card)
 *  - lime-highlighted («look here», ink numerals on lime — fix #1 tone)
 *  - error (post-fix-pass, edge-cases §3 amber hairline)
 *  - empty (no lime fill; lime icon-chip; «connect a broker»)
 */

export function CardsSection() {
  return (
    <DsSection
      id="cards"
      eyebrow="06 · Cards"
      title="KPI cards"
      lede="The Provedo dashboard reads through the KPI band. One lime fill per view (the «look here» card), never two. The error and empty variants below are post-fix-pass additions for edge-cases §2 and §3."
    >
      <DsRow label="DEFAULT · LIME · ERROR · EMPTY">
        <RecordRail label="LEDGER" />
        <div className="ds-grid-2">
          {/* Default */}
          <article className="d1-kpi d1-kpi--portfolio">
            <header className="d1-kpi__head">
              <span className="d1-kpi__icon-chip" aria-hidden>
                <Wallet size={16} />
              </span>
              <p className="d1-kpi__label">Portfolio value</p>
              <span className="d1-kpi__ext" aria-hidden>
                <ArrowUpRight size={16} />
              </span>
            </header>
            <p className="d1-kpi__num">$847,290</p>
            <p className="d1-kpi__delta">+12.4% MTD · synced just now</p>
          </article>

          {/* Lime — drift framing post fix #1 */}
          <article className="d1-kpi d1-kpi--lime">
            <header className="d1-kpi__head">
              <span className="d1-kpi__icon-chip" aria-hidden>
                <ChartBar size={16} />
              </span>
              <p className="d1-kpi__label">Drift · MSFT</p>
              <span className="d1-kpi__ext" aria-hidden>
                <ArrowUpRight size={16} />
              </span>
            </header>
            <p className="d1-kpi__num">12.0%</p>
            <p className="d1-kpi__delta">vs your 9% cap, set Mar 11</p>
          </article>

          {/* Error — broker disconnected (edge-cases §3) */}
          <article className="d1-kpi d1-kpi--error">
            <header className="d1-kpi__head">
              <span
                className="d1-kpi__icon-chip"
                aria-hidden
                style={{ color: 'var(--d1-notification-amber)' }}
              >
                <ChartBar size={16} />
              </span>
              <p className="d1-kpi__label">MSFT · sync error</p>
            </header>
            <p className="d1-kpi__num">—</p>
            <p className="d1-kpi__delta">Last successful sync: 2h ago. Retry to refresh.</p>
          </article>

          {/* Empty — connect a broker (edge-cases §2) */}
          <article className="d1-kpi d1-kpi--empty">
            <header className="d1-kpi__head">
              <span className="d1-kpi__icon-chip" aria-hidden>
                <Plus size={16} />
              </span>
              <p className="d1-kpi__label">Connect a broker</p>
            </header>
            <p className="d1-kpi__num">$0</p>
            <p className="d1-kpi__delta">No accounts connected — IBKR / Schwab / Fidelity</p>
          </article>
        </div>
      </DsRow>

      <DsCallout heading="One lime card per view">
        Lime fill is reserved for the most-actionable observation on a given page — drift &gt;
        tax-lot &gt; dividend event &gt; portfolio value. If nothing is observable (empty
        portfolio), the rule falls through and no card receives the lime fill.
      </DsCallout>
    </DsSection>
  );
}

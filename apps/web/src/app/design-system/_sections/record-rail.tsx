import { ChartBar, Wallet } from 'lucide-react';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';
import { RecordRail } from '../_components/RecordRail';

/**
 * §Record Rail — the Provedo-signature element.
 *
 * Both modes (structural + entry), all 4 placement contexts from PD spec
 * §«Travel showcase» (dashboard hero · KPI cluster · chart panel · AI
 * insight feed), plus the documented anti-patterns. The rail is the
 * single visual primitive that anchors the «on the record, by date»
 * metaphor and travels to every persistent data zone.
 */

export function RecordRailSection() {
  return (
    <DsSection
      id="record-rail"
      eyebrow="10 · Record Rail"
      title="The Provedo Record Rail"
      lede="6×2px lime tick `▮` + 4px gap + Geist Mono 11px datestamp + 8px gap + 1px lime hairline at 30% opacity. One primitive, two modes, every data zone."
    >
      <DsRow label="ANATOMY — TWO MODES">
        <div className="ds-grid-2">
          <div className="ds-callout">
            <p className="ds-callout__heading">Structural · zone header</p>
            <RecordRail label="LEDGER" />
            <p style={{ margin: 0, fontSize: 12, color: 'var(--d1-text-muted)' }}>
              Above every persistent data zone. Datestamp slot carries the uppercase section name
              (LEDGER / ALLOCATION DRIFT / INSIGHTS / DISCLOSURE). Wrapper is `role="presentation"`;
              section heading carries semantics.
            </p>
          </div>
          <div className="ds-callout">
            <p className="ds-callout__heading">Entry · AI-insight chrome</p>
            <RecordRail label="MAY 01 · 09:14" mode="entry" dateTime="2026-05-01T09:14:00Z" />
            <p style={{ margin: 0, fontSize: 12, color: 'var(--d1-text-muted)' }}>
              Replaces the avatar / byline / chat-row form factor entirely. Datestamp goes inside
              `&lt;time datetime=&quot;…&quot;&gt;` for screen readers and future i18n.
            </p>
          </div>
        </div>
      </DsRow>

      <DsRow label="PLACEMENT 1 — DASHBOARD HERO">
        <div
          style={{
            background: 'var(--d1-bg-card)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--d1-border-hairline)',
          }}
        >
          <RecordRail label="LEDGER" />
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}
          >
            <article className="d1-kpi">
              <header className="d1-kpi__head">
                <span className="d1-kpi__icon-chip" aria-hidden>
                  <Wallet size={14} />
                </span>
                <p className="d1-kpi__label">Portfolio</p>
              </header>
              <p className="d1-kpi__num">$847,290</p>
            </article>
            <article className="d1-kpi">
              <header className="d1-kpi__head">
                <span className="d1-kpi__icon-chip" aria-hidden>
                  <ChartBar size={14} />
                </span>
                <p className="d1-kpi__label">Dividends YTD</p>
              </header>
              <p className="d1-kpi__num">$3,200</p>
            </article>
            <article className="d1-kpi d1-kpi--lime">
              <header className="d1-kpi__head">
                <span className="d1-kpi__icon-chip" aria-hidden>
                  <ChartBar size={14} />
                </span>
                <p className="d1-kpi__label">Drift · MSFT</p>
              </header>
              <p className="d1-kpi__num">12.0%</p>
            </article>
          </div>
        </div>
      </DsRow>

      <DsRow label="PLACEMENT 2 — KPI CLUSTER">
        <div
          style={{
            background: 'var(--d1-bg-card)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--d1-border-hairline)',
          }}
        >
          <RecordRail label="ALLOCATION DRIFT" />
          <p style={{ margin: 0, fontSize: 13, color: 'var(--d1-text-muted)' }}>
            Single rail above the band; the lime KPI carries the «look here» signal. The rail
            provides ledger context without competing.
          </p>
        </div>
      </DsRow>

      <DsRow label="PLACEMENT 3 — CHART PANEL HEADER">
        <div
          style={{
            background: 'var(--d1-bg-card)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--d1-border-hairline)',
          }}
        >
          <header
            className="d1-panel__head"
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <RecordRail label="ALLOCATION DRIFT · SYNCED 2H AGO" />
            <div className="d1-segmented" role="tablist" aria-label="Period">
              <button
                type="button"
                className="d1-segmented__btn d1-segmented__btn--active"
                role="tab"
                aria-selected="true"
              >
                Monthly
              </button>
              <button type="button" className="d1-segmented__btn" role="tab" aria-selected="false">
                Annually
              </button>
            </div>
          </header>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--d1-text-muted)' }}>
            Rail replaces the previous icon-chip + title pattern. The right-side segmented control
            sits on the same baseline.
          </p>
        </div>
      </DsRow>

      <DsRow label="PLACEMENT 4 — AI INSIGHT FEED">
        <div
          style={{
            background: 'var(--d1-bg-card)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--d1-border-hairline)',
          }}
        >
          <RecordRail label="INSIGHTS" />
          <ul className="d1-insights">
            <li className="d1-insight">
              <RecordRail label="MAY 01 · 09:14" mode="entry" dateTime="2026-05-01T09:14:00Z" />
              <p className="d1-insight__body">
                Q1 win was 71% FX tailwind, not stock-picking. EUR/USD did the heavy lifting.
              </p>
            </li>
            <li className="d1-insight">
              <RecordRail label="APR 30" mode="entry" dateTime="2026-04-30T16:20:00Z" />
              <p className="d1-insight__body">
                MSFT crossed 12% of portfolio. Last drift observation was 8 weeks ago at 9%.
              </p>
            </li>
          </ul>
        </div>
      </DsRow>

      <DsRow label="STATES — DEFAULT · HOVER (entry only) · FOCUS · ACTIVE">
        <div className="ds-grid-2">
          <div className="ds-callout">
            <p className="ds-callout__heading">Default</p>
            <RecordRail label="DEFAULT STATE" />
          </div>
          <div className="ds-callout">
            <p className="ds-callout__heading">Hover (entry mode only)</p>
            <RecordRail label="MAY 01 · 09:14" mode="entry" dateTime="2026-05-01T09:14:00Z" />
            <p style={{ margin: 0, fontSize: 12, color: 'var(--d1-text-muted)' }}>
              Hairline lifts 30% → 60%, datestamp text-muted → text-primary, 180ms ease-out. The
              tick stays constant — it is the «this is recorded» mark.
            </p>
          </div>
        </div>
      </DsRow>

      <DsRow label="ANTI-PATTERNS">
        <div className="ds-grid-2">
          <DsCallout heading="Don’t multiply per row">
            One insight = one rail. If the body wraps to multiple lines, the rail does not repeat.
          </DsCallout>
          <DsCallout heading="Don’t use above the lime KPI card">
            Lime hairline on lime fill = invisible. The lime KPI is itself the «look here» signal;
            it doesn’t need a rail.
          </DsCallout>
          <DsCallout heading="Don’t animate the tick">
            Hover/focus animate the hairline opacity. The tick should feel printed, fixed,
            immovable.
          </DsCallout>
          <DsCallout heading="Don’t use as a divider between cards">
            Cards already separate visually. The rail goes inside the card, at the top, not between
            cards.
          </DsCallout>
        </div>
      </DsRow>
    </DsSection>
  );
}

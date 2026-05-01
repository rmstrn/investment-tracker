import { BAR_DRIFT_FIXTURE, BAR_FIXTURE, BarVisx } from '@investment-tracker/ui/charts';
import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Charts — D3 chart restyle (Phase 2 in progress).
 *
 * Phase 2 dispatch order: BarVisx → SparklineVisx → LineVisx → AreaVisx →
 * DonutVisx → CalendarVisx → StackedBarVisx → TreemapVisx → WaterfallVisx
 * (simplest → most complex). This commit lands chart 1 of 9 — BarVisx.
 *
 * Restyle strategy: BarVisx reads its own legacy CSS variables. Rather
 * than rewrite the component, we re-map those variables to D3 tokens at
 * panel scope inside `_styles/dossier.css` (see `.ds-chart-card--bar*`
 * selectors). BarVisx code stays unchanged; the dossier panel chrome
 * supplies the token bindings.
 *
 * Two BarVisx panels demonstrate the two semantic registers:
 *   1. Monthly P&L (BAR_FIXTURE) — positive bars in embossed surface-1,
 *      negative bars in terracotta `--d3-down`. Anatomy default.
 *   2. Allocation drift (BAR_DRIFT_FIXTURE) — out-of-band positive bars
 *      in bordeaux `--d3-accent-secondary` (highlight), out-of-band
 *      negative in terracotta, in-band bars in ink-mute @ 0.55 opacity.
 *
 * `EmbossedSwatch` lives here (NOT inside BarVisx) per dispatch rule:
 * inline SVG `<defs><pattern>` is the legend vocabulary — Safari iOS
 * perf trap on CSS `background-image` documented in kickoff §4.1 / §9
 * risk #6.
 *
 * Charts 2-9 remain placeholder shells until Phase 2 dispatches them
 * sequentially.
 */

interface ChartShell {
  readonly id: string;
  readonly title: string;
  readonly note: string;
}

const PENDING_SHELLS: readonly ChartShell[] = [
  {
    id: 'sparkline',
    title: 'SparklineVisx',
    note: 'Endpoint dot in sage / terracotta — direction at the endpoint only, never as line fill.',
  },
  {
    id: 'line',
    title: 'LineVisx',
    note: 'Default line in ink 1.5px. Highlighted series in bordeaux. Hairline reference band.',
  },
  {
    id: 'area',
    title: 'AreaVisx',
    note: 'Linear gradient bordeaux 12% → 0% at axis. Single-series hero accent.',
  },
  {
    id: 'donut',
    title: 'DonutVisx',
    note: '5-segment neutral palette, optional bordeaux highlight. Center label in JetBrains Mono 28px.',
  },
  {
    id: 'calendar',
    title: 'CalendarVisx',
    note: 'Cell ramp — chartreuse-cream saturation 0/18/42/72/100 over surface-1.',
  },
  {
    id: 'stacked-bar',
    title: 'StackedBarVisx',
    note: 'Series 1–5 from D3 chart palette. 1px canvas gap between adjacent stacks.',
  },
  {
    id: 'treemap',
    title: 'TreemapVisx',
    note: 'Surface-1 neutral → sage / terracotta. Bordeaux NEVER on treemap (semantic clash).',
  },
  {
    id: 'waterfall',
    title: 'WaterfallVisx',
    note: 'Sage rises, terracotta falls, ink ivory neutrals. 1px embossed line via inline SVG <defs>.',
  },
];

/**
 * Embossed-bar legend swatch — inline SVG `<defs><pattern>` so the
 * vocabulary stays demonstrably inline-pattern-based (NOT CSS bg-image,
 * which is a Safari iOS perf trap per kickoff §4.1). 5° rotation keeps
 * stripes legible at small heights; pattern colors hand-picked from D3
 * tokens — `--d3-surface-2` ground with `--d3-surface-1` stripes for the
 * subtle warm-graphite contrast that reads as «embossed».
 *
 * Lives at module scope (not inside BarVisx) per dispatch hard-rule #5.
 */
function EmbossedSwatch() {
  return (
    <svg width={36} height={18} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="ds-chart-emboss"
          patternUnits="userSpaceOnUse"
          width={8}
          height={8}
          patternTransform="rotate(50)"
        >
          <rect width={8} height={8} fill="#26221e" />
          <line x1={0} y1={0} x2={0} y2={8} stroke="#1e1b18" strokeWidth={3} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={36} height={18} rx={6} ry={6} fill="url(#ds-chart-emboss)" />
    </svg>
  );
}

export function ChartsSection() {
  return (
    <SectionShell
      id="charts"
      title="Charts"
      meta="1 OF 9 RESTYLED · 8 PENDING"
      description="Chart cards inherit the surface-2 + elev-2 + 1px hairline contract from KPI cards. Phase 2 ports nine visx components into the D3 dialect by re-mapping candy-era CSS variables at panel scope — components stay unchanged, the panel chrome supplies the token bindings."
    >
      <DsRow label="BarVisx — D3 dialect (chart 1 of 9)">
        <div className="ds-chart-bar-row">
          {/* P&L panel — embossed surface-1 positives, terracotta negatives. */}
          <article
            className="ds-chart-card ds-chart-card--filled ds-chart-card--bar ds-chart-card--bar-pl"
            aria-labelledby="chart-bar-pl-title"
          >
            <header className="ds-chart-card__head">
              <h3 id="chart-bar-pl-title" className="ds-chart-card__title">
                Monthly P&amp;L
              </h3>
              <span className="ds-chart-card__phase">Realised</span>
            </header>
            <div className="ds-chart-card__chart">
              <BarVisx payload={BAR_FIXTURE} width={420} height={240} />
            </div>
            <p className="ds-chart-card__caption">
              Positive months render as embossed surface-1 over surface-2; negative months pick up
              terracotta. No bordeaux — that&apos;s reserved for the drift panel&apos;s highlight
              band.
            </p>
          </article>

          {/* Drift panel — bordeaux highlight outside band, ink-mute inside band. */}
          <article
            className="ds-chart-card ds-chart-card--filled ds-chart-card--bar ds-chart-card--bar-drift"
            aria-labelledby="chart-bar-drift-title"
          >
            <header className="ds-chart-card__head">
              <h3 id="chart-bar-drift-title" className="ds-chart-card__title">
                Allocation drift
              </h3>
              <span className="ds-chart-card__phase">Δ since 01-01</span>
            </header>
            <div className="ds-chart-card__chart">
              <BarVisx payload={BAR_DRIFT_FIXTURE} width={420} height={240} />
            </div>
            <div className="ds-emboss-legend" aria-label="Drift legend">
              <EmbossedSwatch />
              <span className="ds-emboss-legend__label">Out-of-band · bordeaux highlight</span>
              <span className="ds-emboss-legend__value">±2pp</span>
            </div>
          </article>
        </div>
      </DsRow>

      <DsRow label="Pending charts (Phase 2 sequential dispatch)">
        <div className="ds-chart-grid">
          {PENDING_SHELLS.map((shell) => (
            <article key={shell.id} className="ds-chart-card">
              <header className="ds-chart-card__head">
                <h3 className="ds-chart-card__title">{shell.title}</h3>
                <span className="ds-chart-card__phase">Phase 2</span>
              </header>
              <div className="ds-chart-card__skeleton" aria-label="Chart placeholder">
                Phase 2 fills this
              </div>
              <p className="ds-chart-card__caption">{shell.note}</p>
            </article>
          ))}
        </div>
      </DsRow>
    </SectionShell>
  );
}

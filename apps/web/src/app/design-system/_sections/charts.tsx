import { DsRow, SectionShell } from '../_components/SectionShell';

/**
 * §Charts — D3 chart placeholder shells (Phase 1 — Phase 2 fills these).
 *
 * Per KICKOFF §2.5 sequencing decision: Phase 1 ships with placeholder
 * shells matching the chart-card chrome (surface-2 + elev-2 + 1px hairline
 * + sculpted head) but with a dashed-border skeleton tile inside marked
 * «Phase 2 fills this». Phase 2 will dispatch nine sequential
 * `frontend-engineer` runs, one per chart type, in this order:
 *
 *   BarVisx → SparklineVisx → LineVisx → AreaVisx → DonutVisx →
 *   CalendarVisx → StackedBarVisx → TreemapVisx → WaterfallVisx
 *
 * The placeholder cards demonstrate the chart-card surface contract that
 * Phase 2 must respect: title (Inter 13/500) + caption (Mono 10 ink-mute)
 * + body region (surface-1 inside surface-2). Phase 2 swaps the skeleton
 * for the actual visx mount.
 */

interface ChartShell {
  readonly id: string;
  readonly title: string;
  readonly note: string;
}

const SHELLS: readonly ChartShell[] = [
  {
    id: 'bar',
    title: 'BarVisx',
    note: 'Drift fixture — bordeaux highlight bar, hairline grid, JetBrains Mono axis.',
  },
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

export function ChartsSection() {
  return (
    <SectionShell
      id="charts"
      title="Charts"
      meta="9 PLACEHOLDERS · PHASE 2 FILLS"
      description="Chart cards inherit the surface-2 + elev-2 + 1px hairline contract from KPI cards. Phase 1 ships the chrome; Phase 2 dispatches nine sequential restyles. Each chart card here pre-shapes the body region Phase 2 must respect."
    >
      <DsRow label="9-chart suite — D3 dialect placeholders">
        <div className="ds-chart-grid">
          {SHELLS.map((shell) => (
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

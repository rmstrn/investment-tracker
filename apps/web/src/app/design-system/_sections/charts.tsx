import type { SparklinePayload } from '@investment-tracker/shared-types/charts';
import {
  BAR_DRIFT_FIXTURE,
  BAR_FIXTURE,
  BarVisx,
  ChartCard,
  ChartSkeleton,
  LINE_FIXTURE,
  LineVisx,
  SPARKLINE_FIXTURE,
  SparklineVisx,
} from '@investment-tracker/ui/charts';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';
import { RecordRail } from '../_components/RecordRail';

/**
 * §Charts — Phase 2 charts 1 + 2 + 3 of 9: BarVisx + SparklineVisx +
 * LineVisx in D1 «Lime Cabin» dialect.
 *
 * Per KICKOFF §4.1: BarVisx (Bars) + SparklineVisx + LineVisx (Lines)
 * ship here with the D1 chart-panel chrome (rail-headed, NOT
 * title-headed). The remaining 6 chart kinds stay as `ChartSkeleton`
 * placeholder shells until subsequent restyle dispatches (Area → Donut
 * → Calendar → StackedBar → Treemap → Waterfall).
 *
 * Token strategy (KICKOFF §4.2 — route-local aliases): chart-* aliases
 * are emitted in `_styles/lime-cabin.css` mapping to D1 tokens, AND the
 * `.d1-chart-panel` wrapper supplies a CSS-var override scope that
 * remaps the candy-register tokens (`--cta-fill`, `--text-on-candy`,
 * `--bg-cream`, `--accent-deep`, `--cta-shadow`, `--card`,
 * `--card-highlight`, `--font-family-{display,body,mono}`) onto D1
 * tokens. The chart components themselves are unchanged — their
 * existing `var(--cta-fill, …)` references resolve to D1 colours under
 * `[data-theme="lime-cabin"]`.
 *
 * For SparklineVisx specifically: the base wrapper points the
 * line/endpoint stroke at purple; per-trend modifiers
 * `.d1-chart-panel--spark-{up|down|flat}` re-remap the candy vars to
 * lime/purple/muted respectively, so the trend semantic survives the
 * candy → D1 token translation without editing SparklineVisx.tsx.
 *
 * For LineVisx specifically: same wrap-and-override pattern with two
 * dialect modifiers `.d1-chart-panel--line-{default|highlighted}` —
 * default points the candy `--cta-fill` / `--accent` at
 * `--d1-text-primary` (white-on-dark, the data IS the data); highlighted
 * points them at `--d1-accent-lime` (the «look here» line, only ONE per
 * chart per KICKOFF §4.1 lime discipline). The line stroke, focus circle
 * on hover, and end-numeral accent dot share colour by implementation —
 * this is the D1 simplification («the line IS the data treatment»).
 *
 * Hatched-stripe vocabulary is carried by the inline `<HatchedSwatch>`
 * SVG `<defs><pattern>` (8px pitch, lime at 35% opacity over
 * `#26272c`, 45° rotate). NEVER CSS background-image — Safari iOS perf
 * trap (D1 spec §9 risk #6, KICKOFF §4.1).
 */

/* ────────────────────────────────────────────────────────────────────── */
/* Placeholder catalogue — kinds 3-9 stay as ChartSkeleton shells.        */
/* ────────────────────────────────────────────────────────────────────── */

interface ChartShellProps {
  rail: string;
  title: string;
  subtitle: string;
  kind: 'area' | 'donut' | 'calendar' | 'stacked-bar' | 'treemap' | 'waterfall';
}

const PLACEHOLDER_SHELLS: ReadonlyArray<ChartShellProps> = [
  { rail: 'CUMULATIVE P&L', title: 'AreaVisx', subtitle: 'Year to date', kind: 'area' },
  {
    rail: 'ALLOCATION BY SECTOR',
    title: 'DonutVisx',
    subtitle: '5 sectors · $226K total',
    kind: 'donut',
  },
  {
    rail: 'DIVIDEND CALENDAR',
    title: 'CalendarVisx',
    subtitle: 'April 2026 · 6 weeks',
    kind: 'calendar',
  },
  {
    rail: 'BROKER CONTRIBUTION',
    title: 'StackedBarVisx',
    subtitle: 'Last 6 months · 3 brokers',
    kind: 'stacked-bar',
  },
  {
    rail: 'CONCENTRATION',
    title: 'TreemapVisx',
    subtitle: 'Tile size = weight · color = today’s change',
    kind: 'treemap',
  },
  {
    rail: 'WHERE VALUE CAME FROM',
    title: 'WaterfallVisx',
    subtitle: 'YTD · 2026-01-01 to 2026-04-30',
    kind: 'waterfall',
  },
];

/* ────────────────────────────────────────────────────────────────────── */
/* Sparkline trend variants — derived inline from SPARKLINE_FIXTURE.      */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * `SPARKLINE_FIXTURE` ships with `trend: 'up'`. To showcase the three
 * D1 trend semantics (lime / purple / muted — KICKOFF §4.1) on the
 * design-system page, we derive `down` and `flat` variants in-place so
 * the live SparklineVisx component renders all three colour states
 * without needing new fixtures in the shared `_shared/fixtures.ts`
 * module (those are owned by the chart subsystem, not the showcase).
 */
const SPARKLINE_DOWN_FIXTURE: SparklinePayload = {
  ...SPARKLINE_FIXTURE,
  meta: { title: 'Position · 7d (down)' },
  data: [...SPARKLINE_FIXTURE.data].reverse().map((row, i) => ({
    x: SPARKLINE_FIXTURE.data[i]?.x ?? row.x,
    y: row.y,
  })),
  trend: 'down',
};

const SPARKLINE_FLAT_FIXTURE: SparklinePayload = {
  ...SPARKLINE_FIXTURE,
  meta: { title: 'Position · 7d (flat)' },
  data: SPARKLINE_FIXTURE.data.map((row) => ({ x: row.x, y: 222000 })),
  trend: 'flat',
};

/* ────────────────────────────────────────────────────────────────────── */
/* Hatched-stripe legend swatch — inline SVG <defs> <pattern>.            */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Static hatched-stripe legend swatch (KICKOFF §4.1, mirrors
 * `style-d1/page.tsx` `HatchedSwatch`). Inline SVG `<defs>` `<pattern>`
 * — NOT CSS background-image (Safari iOS perf trap, D1 spec §9 risk #6).
 *
 * The pattern id is suffixed so multiple swatches on the same page
 * cannot collide.
 */
function HatchedSwatch({ id }: { id: string }) {
  const patternId = `lc-hatch-${id}`;
  return (
    <svg width={32} height={16} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={8}
          height={8}
          patternTransform="rotate(45)"
        >
          <rect width={8} height={8} fill="#26272c" />
          <line x1={0} y1={0} x2={0} y2={8} stroke="#d6f26b" strokeOpacity={0.35} strokeWidth={3} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={32} height={16} rx={4} ry={4} fill={`url(#${patternId})`} />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Section                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export function ChartsSection() {
  return (
    <DsSection
      id="charts"
      eyebrow="13 · Charts"
      title="9 chart kinds in D1 dialect"
      lede="Chart panels in D1 are rail-headed, not title-headed. BarVisx + SparklineVisx + LineVisx ship in the D1 dialect (Phase 2 charts 1-3 of 9): hatched lime stripes for default bars, solid purple for highlighted/negative, in-band drift bars at neutral 0.55 opacity; sparklines carry trend through colour — lime up, purple down, muted flat; line charts default to white-on-dark, with one optional lime «look here» line per chart. The other 6 kinds remain placeholder shells until subsequent restyle dispatches."
    >
      <DsRow label="BARVISX · MONTHLY P&amp;L (BAR_FIXTURE)">
        <article className="d1-chart-panel" aria-labelledby="chart-pnl-title">
          <header className="d1-chart-panel__head">
            <RecordRail label="ALLOCATION DRIFT" />
          </header>
          <h3 id="chart-pnl-title" className="sr-only">
            Monthly P&amp;L
          </h3>
          <div className="d1-chart-panel__body">
            <BarVisx payload={BAR_FIXTURE} width={520} height={260} />
            <p className="d1-chart-panel__caption">
              Default bars use solid purple as the «look here» highlight; in-band drift bars sit at
              neutral 0.55 opacity. Negative values flip downward with a top-rounded path. Tooltips
              and axis labels render Geist Mono with `tnum + ss01`.
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="BARVISX · ALLOCATION DRIFT (BAR_DRIFT_FIXTURE)">
        <article className="d1-chart-panel" aria-labelledby="chart-drift-title">
          <header className="d1-chart-panel__head">
            <RecordRail label="DRIFT VS TARGET" />
          </header>
          <h3 id="chart-drift-title" className="sr-only">
            Drift vs target
          </h3>
          <div className="d1-chart-panel__body">
            <BarVisx payload={BAR_DRIFT_FIXTURE} width={520} height={260} />
            {/* Inline SVG <defs> <pattern> hatched legend — the
             * defining reference vocabulary, demonstrably inline-pattern-
             * based (NOT CSS background-image; Safari iOS perf trap). */}
            <div className="d1-hatch-legend" aria-label="Drift legend">
              <HatchedSwatch id="drift" />
              <span className="d1-hatch-legend__label">Apr · drift</span>
              <span className="d1-hatch-legend__value">±2pp band</span>
            </div>
          </div>
        </article>
      </DsRow>

      <DsCallout heading="Hatched-stripe vocabulary (KICKOFF §4.1)">
        The hatched lime-stripe pattern is the D1 chart vocabulary for the «data treatment» lime
        category: 8px pitch, lime at 35% opacity over `#26272c`, 45° rotate. Inline SVG
        `&lt;defs&gt;&lt;pattern&gt;` — never CSS `background-image` (Safari iOS perf trap, D1 spec
        §9 risk #6). Phase 2 charts 3-9 (Line → Waterfall) follow.
      </DsCallout>

      <DsRow label="SPARKLINEVISX · INLINE TREND (SPARKLINE_FIXTURE)">
        <article
          className="d1-chart-panel d1-chart-panel--spark-up"
          aria-labelledby="chart-spark-title"
        >
          <header className="d1-chart-panel__head">
            <RecordRail label="PORTFOLIO · 7D" />
          </header>
          <h3 id="chart-spark-title" className="sr-only">
            Portfolio value · last 7 days
          </h3>
          <div className="d1-chart-panel__body d1-chart-panel__body--spark">
            <SparklineVisx payload={SPARKLINE_FIXTURE} width={520} height={120} />
            <p className="d1-chart-panel__caption">
              Trend-up sparklines render in lime at 200×64. The line stroke and endpoint dot share
              colour by implementation; at sparkline scale the endpoint is tightly coupled to the
              line, so the trend semantic carries through both. End-numeral renders Geist Mono with
              `tnum + ss01`; reduced-motion locks the entrance at full draw.
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="SPARKLINEVISX · TREND SEMANTICS (LIME ↑ · PURPLE ↓ · MUTED →)">
        <article className="d1-chart-panel" aria-labelledby="chart-spark-multi-title">
          <header className="d1-chart-panel__head">
            <RecordRail label="POSITIONS · 7D" />
          </header>
          <h3 id="chart-spark-multi-title" className="sr-only">
            Position sparkline trend states
          </h3>
          <div className="d1-chart-panel__body d1-chart-panel__body--spark">
            <div className="d1-spark-row">
              <div
                className="d1-spark-cell d1-chart-panel d1-chart-panel--spark-up"
                style={{ background: 'transparent', border: 0, padding: 0 }}
              >
                <p className="d1-spark-cell__label">Up · lime</p>
                <SparklineVisx payload={SPARKLINE_FIXTURE} width={220} height={64} />
              </div>
              <div
                className="d1-spark-cell d1-chart-panel d1-chart-panel--spark-down"
                style={{ background: 'transparent', border: 0, padding: 0 }}
              >
                <p className="d1-spark-cell__label">Down · purple</p>
                <SparklineVisx payload={SPARKLINE_DOWN_FIXTURE} width={220} height={64} />
              </div>
              <div
                className="d1-spark-cell d1-chart-panel d1-chart-panel--spark-flat"
                style={{ background: 'transparent', border: 0, padding: 0 }}
              >
                <p className="d1-spark-cell__label">Flat · muted</p>
                <SparklineVisx payload={SPARKLINE_FLAT_FIXTURE} width={220} height={64} />
              </div>
            </div>
            <p className="d1-chart-panel__caption">
              Three sparklines, one per trend state. Per-trend modifier classes
              (`.d1-chart-panel--spark-up|down|flat`) re-remap the candy stroke vars onto D1 lime /
              purple / muted without editing SparklineVisx. Each cell is wrapped to scope its own
              CSS-var override; backgrounds and borders are stripped so the cells read as siblings,
              not nested cards.
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="LINEVISX · PORTFOLIO VALUE · DEFAULT (LINE_FIXTURE)">
        <article
          className="d1-chart-panel d1-chart-panel--line-default"
          aria-labelledby="chart-line-default-title"
        >
          <header className="d1-chart-panel__head">
            <RecordRail label="PORTFOLIO VALUE" />
          </header>
          <h3 id="chart-line-default-title" className="sr-only">
            Portfolio value · last 30 days · default state
          </h3>
          <div className="d1-chart-panel__body">
            <LineVisx payload={LINE_FIXTURE} width={520} height={260} />
            <p className="d1-chart-panel__caption">
              Default lines render in `--d1-text-primary` (white) on the dark canvas — the data IS
              the data, not a brand element. Y gridlines at 0.08 stroke-opacity, axis labels in
              Geist Mono `--d1-text-muted`, end-numeral in Mono with `tnum + ss01`. The hover
              guide-line (dashed) and end-point dot share the line colour.
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="LINEVISX · PORTFOLIO VALUE · HIGHLIGHTED (LINE_FIXTURE)">
        <article
          className="d1-chart-panel d1-chart-panel--line-highlighted"
          aria-labelledby="chart-line-highlight-title"
        >
          <header className="d1-chart-panel__head">
            <RecordRail label="PORTFOLIO VALUE · «LOOK HERE»" />
          </header>
          <h3 id="chart-line-highlight-title" className="sr-only">
            Portfolio value · last 30 days · highlighted state
          </h3>
          <div className="d1-chart-panel__body">
            <LineVisx payload={LINE_FIXTURE} width={520} height={260} />
            <p className="d1-chart-panel__caption">
              Highlighted lines render in `--d1-accent-lime` — only ONE per chart (KICKOFF §4.1 lime
              discipline). Same fixture as the default panel above, demonstrating the dialect
              switch: a comparison or hero series gets lime; baseline / cohort series stay white.
              The line, hover focus circle, and end-numeral accent dot all share the lime colour by
              implementation — the line IS the data treatment.
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="6 PLACEHOLDER SHELLS · PHASE 2 IN PROGRESS">
        <div className="ds-grid-2">
          {PLACEHOLDER_SHELLS.map((s) => (
            <div
              key={s.title}
              style={{
                background: 'var(--d1-bg-card)',
                borderRadius: 24,
                padding: 20,
                border: '1px solid var(--d1-border-hairline)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <RecordRail label={s.rail} />
              <ChartCard
                eyebrow={s.title}
                title={s.title}
                subtitle={s.subtitle}
                style={{
                  background: 'transparent',
                  boxShadow: 'none',
                  padding: 0,
                  borderRadius: 0,
                }}
              >
                <div style={{ minHeight: 180 }}>
                  <ChartSkeleton kind={s.kind} />
                </div>
              </ChartCard>
            </div>
          ))}
        </div>
      </DsRow>
    </DsSection>
  );
}

import type { DonutChartPayload, SparklinePayload } from '@investment-tracker/shared-types/charts';
import {
  AREA_FIXTURE,
  AreaVisx,
  BAR_DRIFT_FIXTURE,
  BAR_FIXTURE,
  BarVisx,
  CALENDAR_FIXTURE,
  CalendarVisx,
  ChartCard,
  ChartSkeleton,
  DONUT_FIXTURE,
  DonutVisx,
  LINE_FIXTURE,
  LineVisx,
  SPARKLINE_FIXTURE,
  SparklineVisx,
} from '@investment-tracker/ui/charts';
import { DsCallout, DsRow, DsSection } from '../_components/DsSection';
import { RecordRail } from '../_components/RecordRail';

/**
 * §Charts — Phase 2 charts 1-6 of 9: BarVisx + SparklineVisx + LineVisx
 * + AreaVisx + DonutVisx + CalendarVisx in D1 «Lime Cabin» dialect.
 *
 * Per KICKOFF §4.1: BarVisx (Bars) + SparklineVisx + LineVisx + AreaVisx
 * (Lines) + DonutVisx + CalendarVisx (Heatmap) ship here with the D1
 * chart-panel chrome (rail-headed, NOT title-headed). The remaining 3
 * chart kinds stay as `ChartSkeleton` placeholder shells until subsequent
 * restyle dispatches (StackedBar → Treemap → Waterfall).
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
 * For AreaVisx specifically: the gradient `<stop>` colours, the line
 * stroke, and the hover focus dot fill all bind to `var(--cta-fill, ...)`.
 * The single dialect modifier `.d1-chart-panel--area-default` re-remaps
 * the candy stroke + accent vars onto `--d1-accent-lime` so the linear
 * gradient (top-stop @0.3 alpha → bottom-stop @0 alpha — component-
 * hardcoded, accepted deviation from KICKOFF's 18% spec), the line
 * stroke, and the hover dot all resolve to lime by implementation. The
 * lime-saturation gradient mirrors the heatmap's lime-saturation pattern
 * as the D1 chart vocabulary for cumulative trends — area IS the «look
 * here» surface (KICKOFF §4.1 area anatomy + lime-discipline §7.5
 * «data treatment» category).
 *
 * For DonutVisx specifically: per-segment colour resolution path —
 * **Path B** in the engineer's investigation. DonutVisx falls back to
 * `CANDY_PALETTE = var(--chart-categorical-1..5)` for unset segments,
 * but those vars are NOT aliased in our route-local lime-cabin.css
 * (only `--chart-series-*` is). The schema (`DonutChartPayload.segments
 * [*].color`) DOES allow per-segment colour strings, so we supply D1
 * vars directly in the inline-derived showcase fixtures. This bypasses
 * the chart-categorical alias gap entirely and gives strict spec
 * adherence to the lime-saturation order from KICKOFF §4.1
 * (`bg-card-soft → text-muted → border-strong → lime@40% → lime solid`,
 * mirroring the heatmap saturation gradient). The optional purple
 * highlight is demonstrated via direct fixture override on the largest
 * segment (no `meta.highlightKey` field exists on the schema; the
 * runtime outcome described in the kickoff is identical to a colour
 * override). The `.d1-chart-panel--donut` modifier additionally tames
 * the candy hard ink-shadow drop (component renders each slice path
 * twice — shadow + fill — and the shadow inherits `--text-on-candy`
 * which the base wrapper points at white; the modifier re-points it at
 * `--d1-bg-page` so the 2px shadow sliver disappears into the canvas
 * and segments read as crisp ink shapes). Centre headline + eyebrow
 * styling is restored via structure-stable child selectors (Geist Mono
 * 32px tabular for the numeral, Geist Sans uppercase muted for the
 * eyebrow).
 *
 * For CalendarVisx specifically: per-event colour resolution path —
 * **Path A** (alias remap via wrapper modifier). The `DividendEvent` /
 * `CorpActionEvent` schemas are `.strict()` and do NOT permit a per-
 * event `color` field, so Path B (per-event colour in the fixture) is
 * closed. `eventChipColor()` in CalendarVisx hardcodes status → CSS var
 * (received → `--bg-mustard`, scheduled → `--cta-fill`, corp_action
 * diamond → `--text-on-candy`); the today ring binds to `--candy-pink`
 * with `--bg-pink` fallback. The base `.d1-chart-panel` wrapper already
 * remaps `--cta-fill` → purple (correct default for highlighted bars but
 * wrong for scheduled chips — the spec wants lime saturation level 2).
 * The `.d1-chart-panel--calendar` modifier re-points `--bg-mustard` →
 * lime solid (received = lime L4), `--cta-fill` → lime @40% (scheduled
 * = lime L2), and `--candy-pink` / `--bg-pink` → lime (today ring = the
 * D1 «you are here» signal). Corp-action diamonds resolve via the base
 * wrapper's `--text-on-candy` → white-on-dark mapping, which lands them
 * as a near-purple-but-actually-white ink-shape on the dark canvas; the
 * spec's «corp_action → purple» semantic is approximated structurally
 * (diamond shape + dark-bg legibility). The candy hard ink-shadow drop
 * on event-bearing cells is suppressed via a structure-stable selector
 * (`[data-cell-iso] > rect[fill-opacity]` — only the shadow rect carries
 * a `fill-opacity` attribute), retiring the candy treatment per KICKOFF
 * §4.1. The candy tooltip box-shadow + heavy border are tamed with
 * `!important` overrides (cascade tradeoff for inline-styled DOM —
 * KICKOFF §7.10).
 *
 * Hatched-stripe vocabulary is carried by the inline `<HatchedSwatch>`
 * SVG `<defs><pattern>` (8px pitch, lime at 35% opacity over
 * `#26272c`, 45° rotate). NEVER CSS background-image — Safari iOS perf
 * trap (D1 spec §9 risk #6, KICKOFF §4.1).
 */

/* ────────────────────────────────────────────────────────────────────── */
/* Placeholder catalogue — kinds 7-9 stay as ChartSkeleton shells.        */
/* ────────────────────────────────────────────────────────────────────── */

interface ChartShellProps {
  rail: string;
  title: string;
  subtitle: string;
  kind: 'stacked-bar' | 'treemap' | 'waterfall';
}

const PLACEHOLDER_SHELLS: ReadonlyArray<ChartShellProps> = [
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
/* Donut fixtures — D1 lime-saturation order via per-segment color.       */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * `DONUT_FIXTURE` ships with no per-segment colours, falling back to
 * DonutVisx's `CANDY_PALETTE` (`var(--chart-categorical-1..5)`). The
 * candy `--chart-categorical-*` family is NOT aliased in our route-local
 * lime-cabin.css — only `--chart-series-*` is. KICKOFF §4.1 spec calls
 * for a strict lime-saturation order:
 *
 *   bg-card-soft → text-muted → border-strong → lime@40% → lime solid
 *
 * mirroring the heatmap saturation gradient. The schema permits
 * per-segment colour strings (`segments[*].color: string optional`), so
 * we override the colour list directly. Sort discipline: the fixture is
 * already descending by value (Tech $92.5K → Other $17.99K). The
 * heaviest segment maps to the most-saturated lime ('look here'), the
 * lightest to the lowest-saturation card-soft — biggest = brightest =
 * the eye lands there first.
 */
const D1_DONUT_PALETTE = [
  'var(--d1-accent-lime)', // 0 — heaviest segment, lime solid
  'rgba(214, 242, 107, 0.4)', // 1 — lime @ 40%
  'var(--d1-border-strong)', // 2 — neutral hairline strong
  'var(--d1-text-muted)', // 3 — neutral mid
  'var(--d1-bg-card-soft)', // 4 — lightest segment, lowest saturation
] as const;

const DONUT_FIXTURE_D1: DonutChartPayload = {
  ...DONUT_FIXTURE,
  segments: DONUT_FIXTURE.segments.map((s, i) => ({
    ...s,
    color: D1_DONUT_PALETTE[i] ?? D1_DONUT_PALETTE[D1_DONUT_PALETTE.length - 1],
  })),
};

/**
 * Purple-highlight variant. KICKOFF §4.1: «ONE optional highlighted
 * segment in `--d1-accent-purple` (when `payload.meta.highlightKey`
 * set)». The schema doesn't expose `highlightKey` (verified — the
 * `DonutChartPayload` `meta` is `ChartMeta + MetaFinancialAggregate`
 * only). The runtime outcome the kickoff describes is identical to a
 * direct colour override, so we demonstrate the highlighted-segment
 * dialect by overriding the heaviest segment's colour to purple — same
 * "look here" semantic, different signal colour.
 */
const DONUT_FIXTURE_D1_HIGHLIGHTED: DonutChartPayload = {
  ...DONUT_FIXTURE,
  meta: {
    ...DONUT_FIXTURE.meta,
    title: 'Allocation by sector · Tech highlighted',
    subtitle: '5 sectors · Tech flagged for re-balance review',
  },
  segments: DONUT_FIXTURE.segments.map((s, i) => ({
    ...s,
    color:
      i === 0
        ? 'var(--d1-accent-purple)'
        : (D1_DONUT_PALETTE[i] ?? D1_DONUT_PALETTE[D1_DONUT_PALETTE.length - 1]),
  })),
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
      lede="Chart panels in D1 are rail-headed, not title-headed. BarVisx + SparklineVisx + LineVisx + AreaVisx + DonutVisx + CalendarVisx ship in the D1 dialect (Phase 2 charts 1-6 of 9): hatched lime stripes for default bars, solid purple for highlighted/negative, in-band drift bars at neutral 0.55 opacity; sparklines carry trend through colour — lime up, purple down, muted flat; line charts default to white-on-dark, with one optional lime «look here» line per chart; areas render as a lime-saturation gradient mirroring the heatmap pattern; donuts run a 5-step lime-saturation order with optional purple highlight; the dividend calendar pushes status semantics through chip colour — received lime solid, scheduled lime @40%, corp-action diamond ink — with the today ring promoted to lime as the «you are here» signal. The other 3 kinds remain placeholder shells until subsequent restyle dispatches."
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

      <DsRow label="AREAVISX · CUMULATIVE P&amp;L (AREA_FIXTURE)">
        <article
          className="d1-chart-panel d1-chart-panel--area-default"
          aria-labelledby="chart-area-title"
        >
          <header className="d1-chart-panel__head">
            <RecordRail label="CUMULATIVE P&amp;L" />
          </header>
          <h3 id="chart-area-title" className="sr-only">
            Cumulative P&amp;L · year to date
          </h3>
          <div className="d1-chart-panel__body">
            <AreaVisx payload={AREA_FIXTURE} width={520} height={260} />
            <p className="d1-chart-panel__caption">
              The area fill renders as a lime-saturation gradient — `--d1-accent-lime` from 30%
              opacity at the top to 0% at the axis (component-hardcoded, KICKOFF spec calls for 18%
              top — accepted deviation). The gradient mirrors the heatmap's lime-saturation
              vocabulary as the D1 chart treatment for cumulative trends. Line stroke and hover dot
              share the lime colour by implementation — the area IS the data treatment. Y gridlines
              at 0.08 stroke-opacity, axis labels in Geist Mono `--d1-text-muted`. Reduced motion
              locks the entrance at full reveal.
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="DONUTVISX · ALLOCATION BY SECTOR · LIME SATURATION ORDER (DONUT_FIXTURE)">
        <article
          className="d1-chart-panel d1-chart-panel--donut"
          aria-labelledby="chart-donut-default-title"
        >
          <header className="d1-chart-panel__head">
            <RecordRail label="ALLOCATION BY SECTOR" />
          </header>
          <h3 id="chart-donut-default-title" className="sr-only">
            Allocation by sector · default state
          </h3>
          <div className="d1-chart-panel__body">
            <DonutVisx payload={DONUT_FIXTURE_D1} size={240} centerEyebrow="Portfolio" />
            <p className="d1-chart-panel__caption">
              Per-segment colours supplied through the fixture (Path B: schema permits
              `segments[*].color`; the candy `--chart-categorical-*` aliases are not in scope here,
              so we override directly). Five-step lime-saturation order — heaviest segment lands on
              `--d1-accent-lime` solid, lightest on `--d1-bg-card-soft` — mirrors the heatmap
              saturation gradient. Centre numeral renders Geist Mono 32px tabular with `tnum + ss01
              + lnum`. The candy hard ink-shadow drop is tamed via the `.d1-chart-panel--donut`
              modifier (re-points `--text-on-candy` at `--d1-bg-page` so the 2px shadow sliver
              disappears into the canvas).
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="DONUTVISX · ALLOCATION BY SECTOR · «LOOK HERE» (PURPLE HIGHLIGHT)">
        <article
          className="d1-chart-panel d1-chart-panel--donut"
          aria-labelledby="chart-donut-highlighted-title"
        >
          <header className="d1-chart-panel__head">
            <RecordRail label="ALLOCATION · TECH FLAGGED" />
          </header>
          <h3 id="chart-donut-highlighted-title" className="sr-only">
            Allocation by sector · Tech segment highlighted
          </h3>
          <div className="d1-chart-panel__body">
            <DonutVisx
              payload={DONUT_FIXTURE_D1_HIGHLIGHTED}
              size={240}
              centerEyebrow="Portfolio"
            />
            <p className="d1-chart-panel__caption">
              Optional purple-highlight dialect (KICKOFF §4.1: «ONE optional highlighted segment in
              `--d1-accent-purple` when `payload.meta.highlightKey` set»). The schema doesn't expose
              `highlightKey` natively — the runtime outcome is identical to a per-segment colour
              override, which is what we render here on the heaviest segment («Tech»). Used when a
              single sector trips a re-balance threshold; the rest of the saturation order stays put
              so the highlight reads against a neutral field, not a competing lime.
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="CALENDARVISX · DIVIDEND CALENDAR (CALENDAR_FIXTURE)">
        <article
          className="d1-chart-panel d1-chart-panel--calendar"
          aria-labelledby="chart-calendar-title"
        >
          <header className="d1-chart-panel__head">
            <RecordRail label="DIVIDEND CALENDAR · APR 2026" />
          </header>
          <h3 id="chart-calendar-title" className="sr-only">
            Dividend calendar · April 2026
          </h3>
          <div className="d1-chart-panel__body">
            {/* `today` is pinned inside the fixture period so the lime
             * «you are here» ring is visible in the showcase regardless
             * of wall-clock date drift. The component pins to day 15
             * automatically when wall-clock falls outside the period —
             * we set `today` explicitly to make that contract visible at
             * read-time. */}
            <CalendarVisx payload={CALENDAR_FIXTURE} today={new Date('2026-04-15')} />
            <p className="d1-chart-panel__caption">
              Status semantics carry through chip colour (Path A — alias remap, since the event
              schemas are `.strict()` and forbid per-event colour overrides): received lands on
              `--d1-accent-lime` solid (saturation L4), scheduled on `rgba(214, 242, 107, 0.4)`
              (saturation L2), corp-action diamonds on the dark ink shape against the cell. The
              today ring is promoted from the candy hot-pink to lime — the D1 «you are here» signal.
              The candy hard ink-shadow drop on event-bearing cells is suppressed via the
              `[data-cell-iso] &gt; rect[fill-opacity]` selector (only the shadow rect carries that
              attribute), retiring the candy treatment per KICKOFF §4.1. Tooltip box-shadow + heavy
              border are softened to D1 elevation language via `!important` overrides — the cascade
              tradeoff for inline-styled DOM, documented in lime-cabin.css.
            </p>
          </div>
        </article>
      </DsRow>

      <DsRow label="3 PLACEHOLDER SHELLS · PHASE 2 IN PROGRESS">
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

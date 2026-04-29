/**
 * Chart token bridge.
 *
 * All chart colors are CSS custom properties resolved at paint time. Recharts
 * primitives accept stroke/fill as strings; we pass `var(--chart-series-N)`
 * verbatim, so light/dark theme switching via `<html data-theme="...">` flips
 * series colors without React re-render. See architect ADR §«Theme + locale
 * + units» and CHARTS_SPEC §2.5.
 *
 * The `--chart-series-N` (1..12), `--chart-grid*`, `--chart-tooltip-*`,
 * `--chart-axis-label`, and `--chart-cursor` custom properties are emitted
 * by `@investment-tracker/design-tokens` as part of the build (see
 * `tokens/semantic/{light,dark}.json` chart-series + chart-* + shadow.chart-*).
 *
 * v1.2 (2026-04-29): palette extended 7 → 12 hues via the «editorial library»
 * extension (ochre, aubergine, cobalt-ink, dusty mauve, clay tan). All
 * extensions are CHART-ONLY — they MUST NOT surface on UI buttons, text, or
 * borders. The 7 → 12 expansion is documented in
 * `docs/design/CHARTS_SPEC.md` §2.7.
 */

/**
 * Twelve-hue series palette. Index by `series[i].color = SERIES_VARS[i % 12]`.
 *
 * - 1-3: anchor identity (jade · bronze · ink). Reuse system palette.
 * - 4-7: family extensions (mid-jade, graphite, soft-bronze, deep-jade).
 * - 8-12: editorial library — chart-only paper-warm extras.
 */
export const SERIES_VARS = [
  'var(--chart-series-1)',
  'var(--chart-series-2)',
  'var(--chart-series-3)',
  'var(--chart-series-4)',
  'var(--chart-series-5)',
  'var(--chart-series-6)',
  'var(--chart-series-7)',
  'var(--chart-series-8)',
  'var(--chart-series-9)',
  'var(--chart-series-10)',
  'var(--chart-series-11)',
  'var(--chart-series-12)',
] as const;

/** Cross-cutting chart tokens. Token names map 1:1 to CSS custom properties. */
export const CHART_TOKENS = {
  axisLabel: 'var(--chart-axis-label)',
  gridLine: 'var(--chart-grid)',
  gridLineStrong: 'var(--chart-grid-strong)',
  tooltipBg: 'var(--chart-tooltip-bg)',
  tooltipBorder: 'var(--chart-tooltip-border)',
  tooltipShadow: 'var(--chart-tooltip-shadow)',
  cursor: 'var(--chart-cursor)',
  /** Treemap positive change tile fill. */
  treemapPositive: 'var(--chart-series-1)',
  /** Treemap negative change tile fill. */
  treemapNegative: 'var(--chart-series-2)',
  /** Treemap neutral tile fill. */
  treemapNeutral: 'var(--chart-series-5)',
  /** Calendar status palette (CHARTS_SPEC §2.6). */
  calendarReceived: 'var(--accent, var(--chart-series-1))',
  calendarScheduled: 'var(--chart-series-4)',
  calendarAnnounced: 'var(--chart-series-7)',
  calendarCorpAction: 'var(--terra, var(--chart-series-2))',
  /**
   * Neumorphism shadow tokens (v1.2, 2026-04-29). Apply via inline-style or
   * SVG `filter` attribute on chart elements. Token sources are
   * `--shadow-chart-card`, `--shadow-chart-bar-emboss`, `--shadow-chart-line-emboss`
   * emitted by design-tokens.
   */
  cardShadow:
    'var(--shadow-chart-card, 5px 5px 14px rgba(140, 100, 55, 0.16), -3px -3px 10px rgba(255, 250, 240, 0.62), inset 1px 1px 0 rgba(255, 255, 255, 0.55), inset 0 -1px 0 rgba(20, 20, 20, 0.04))',
  barEmbossFilter:
    'var(--shadow-chart-bar-emboss, drop-shadow(0 1px 1.5px rgba(20, 20, 20, 0.10)) drop-shadow(0 0.5px 0 rgba(255, 250, 240, 0.55)))',
  lineEmbossFilter:
    'var(--shadow-chart-line-emboss, drop-shadow(0 1px 1px rgba(20, 20, 20, 0.10)))',
} as const;

/**
 * Chart radius tokens (v1.2 — neumorphism «round more» pass).
 *
 * - `chartCardRadius`: 22px ChartCard outer radius (was 18px).
 * - `tooltipRadius`: 12px tooltip radius (was 14 — kept consistent at 12).
 * - `BAR_RADIUS_TOP`: top-only bar radii [10, 10, 0, 0] (was [6, 6, 0, 0]).
 * - `BAR_RADIUS_STACK_TOP`: top stacked-bar segment radii [8, 8, 0, 0]
 *   (was [4, 4, 0, 0]).
 */
export const CHART_RADII = {
  chartCardRadius: 22,
  tooltipRadius: 12,
} as const;

/** Recharts `animationDuration` baseline; 600ms feels intentional, not loud. */
export const CHART_ANIMATION_MS = 600;

/**
 * Deterministic donut slice color order (CHARTS_SPEC §4.4). Donut slices are
 * indexed against this sequence so multi-instance allocation donuts on the
 * same view share a stable color identity per category position.
 */
export const DONUT_ORDER = SERIES_VARS;

/**
 * Treemap positive/negative/neutral lookup. Threshold ±0.5% per CHARTS_SPEC
 * §4.10 (single-channel-degrade neutral band).
 */
export function colorForTreemapChange(changePct: number | undefined): string {
  if (typeof changePct !== 'number' || Number.isNaN(changePct)) {
    return CHART_TOKENS.treemapNeutral;
  }
  if (changePct >= 0.5) return CHART_TOKENS.treemapPositive;
  if (changePct <= -0.5) return CHART_TOKENS.treemapNegative;
  return CHART_TOKENS.treemapNeutral;
}

/**
 * Treemap label ink picker — guarantees WCAG 1.4.3 AA contrast (≥4.5:1) for
 * 10-11px tile labels in both light and dark themes.
 *
 * Positive tiles use the deep-green `--chart-series-1` (#2d5f4e light /
 * #4a8775 dark) which is dark enough that white ink passes ≥4.5:1 in both
 * themes. Negative tiles (#a04a3d / #bd6a55) and neutral tiles (#7a7a7a /
 * #b5b5b5) sit in a mid-luminance band where white ink falls to ~3.3-4.0:1.
 * Near-black ink (`#0a0a0a`) on those mid-tones gives ≥5:1 in both themes.
 *
 * The ink colors are intentionally theme-INVARIANT (not `var(--color-text-*)`)
 * because the tile fill doesn't flip aggressively across themes — the chosen
 * inks pass against both light- and dark-theme tile fills.
 */
export function inkForTreemapChange(changePct: number | undefined): string {
  if (typeof changePct !== 'number' || Number.isNaN(changePct)) {
    return '#0a0a0a';
  }
  if (changePct >= 0.5) return '#ffffff';
  return '#0a0a0a';
}

/**
 * Whether a treemap tile is large enough to render its label inline. Below
 * this size the renderer suppresses inline labels to avoid clipped text;
 * the screen-reader `<ChartDataTable>` always carries the full ticker list.
 */
export function labelOnTile(rect: { width: number; height: number }): boolean {
  return rect.width >= 56 && rect.height >= 28;
}

/* ─── Backwards-compat re-exports (kept for old call sites) ──────────────── */

/**
 * @deprecated Use `SERIES_VARS`. Retained as a value alias so existing
 * imports of `SERIES_PALETTE` continue to compile during migration.
 */
export const SERIES_PALETTE = SERIES_VARS;

/**
 * @deprecated Use `CHART_TOKENS`. Maps the legacy field names onto the new
 * tokens. Existing call sites in `apps/web/src/app/dashboard/...` rely on
 * this shape; remove after consumers migrate.
 */
export const CHART_COLORS = {
  axisLabel: CHART_TOKENS.axisLabel,
  gridLine: CHART_TOKENS.gridLine,
  tooltipBg: CHART_TOKENS.tooltipBg,
  tooltipBorder: CHART_TOKENS.tooltipBorder,
  areaStroke: SERIES_VARS[0],
  areaFillId: 'portfolio-area-fill',
  gain: SERIES_VARS[0],
  loss: SERIES_VARS[1],
} as const;

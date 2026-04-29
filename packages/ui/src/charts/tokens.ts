/**
 * Chart token bridge.
 *
 * All chart colors are CSS custom properties resolved at paint time. Recharts
 * primitives accept stroke/fill as strings; we pass `var(--chart-series-N)`
 * verbatim, so light/dark theme switching via `<html data-theme="...">` flips
 * series colors without React re-render. See architect ADR §«Theme + locale
 * + units» and CHARTS_SPEC §2.5.
 *
 * The `--chart-series-N`, `--chart-grid`, `--chart-tooltip-*`, and
 * `--chart-cursor` custom properties are declared in `apps/web/src/app/globals.css`
 * (light defaults on `:root`; dark overrides on `.dark, [data-theme="dark"]`).
 */

/** Seven-hue series palette. Index by `series[i].color = SERIES_VARS[i % 7]`. */
export const SERIES_VARS = [
  'var(--chart-series-1)',
  'var(--chart-series-2)',
  'var(--chart-series-3)',
  'var(--chart-series-4)',
  'var(--chart-series-5)',
  'var(--chart-series-6)',
  'var(--chart-series-7)',
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

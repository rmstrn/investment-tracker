/**
 * Barrel export for `primitives/svg/*`.
 *
 * Public API surface for Layer 2 (React SVG primitives) of the custom chart
 * primitives layer. Per aggregate decision #2 («Hybrid declarative + imperative
 * escape hatch»), these primitives accept data + scaled coordinates and render
 * SVG fragments. No state machines. No chart-kind logic. Composable.
 *
 * Layer 3 (chart-kind wrappers — LineChart, AreaChart, etc.) lives one
 * directory up and consumes from here. Math utilities live in `../math/`.
 */

/* ─── A11y baseline ──────────────────────────────────────────────────── */
export {
  ChartFrame,
  type ChartFrameProps,
  type KeyboardNav,
  type LiveRegionMode,
  type SeriesEncoding,
} from './ChartFrame';

/* ─── Axes + grid ────────────────────────────────────────────────────── */
export {
  GridLines,
  type GridLinesProps,
  type GridLinesOrientation,
} from './GridLines';
export {
  AxisTicksHTML,
  type AxisTicksHTMLProps,
  type AxisTick,
  type AxisOrientation,
} from './AxisTicksHTML';
export {
  Axis,
  type AxisProps,
  type AxisTickInput,
  type AxisEdgeOrientation,
} from './Axis';

/* ─── Gradient definitions ───────────────────────────────────────────── */
export {
  AreaGradientDef,
  type AreaGradientDefProps,
  useAreaGradient,
  type AreaGradientDefOptions,
  type AreaGradientHandle,
} from './AreaGradientDef';

/* ─── Path primitives ────────────────────────────────────────────────── */
export { LinePath, type LinePathProps } from './LinePath';
export { AreaPath, type AreaPathProps } from './AreaPath';

/* ─── Animation hooks ────────────────────────────────────────────────── */
export {
  useStrokeDashoffset,
  type UseStrokeDashoffsetOptions,
  type StrokeDashoffsetState,
} from './useStrokeDashoffset';
export {
  useAnimatedNumber,
  type UseAnimatedNumberOptions,
} from './useAnimatedNumber';

/* ─── Floating overlays ──────────────────────────────────────────────── */
export { Tooltip, type TooltipProps } from './Tooltip';

/* ─── Brand glyph (re-export from icons package) ─────────────────────── */
export { CitationGlyph, ProvedoMark, type CitationGlyphProps } from '../../../icons/CitationGlyph';

/* ─── Re-export the existing visually-hidden transcript ──────────────── */
export { ChartDataTable } from '../../_shared/ChartDataTable';

/* ─── Re-export shared a11y / motion hooks ───────────────────────────── */
export { useChartKeyboardNav } from '../../_shared/useChartKeyboardNav';
export { useReducedMotion } from '../../_shared/useReducedMotion';
export { CHART_FOCUS_RING_CLASS } from '../../_shared/a11y';

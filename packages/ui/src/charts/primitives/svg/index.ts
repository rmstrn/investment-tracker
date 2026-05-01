/**
 * Barrel export for `primitives/svg/*`.
 *
 * Phase E1 (visx-candy migration) trimmed every V2-specific primitive
 * (Axis, GridLines, CartesianFrame, ReferenceLine, AxisTicksHTML,
 * LinePath, AreaPath, AreaGradientDef, Tooltip, useStrokeDashoffset,
 * useAnimatedNumber). Only `<ChartFrame>` survives as the a11y baseline
 * shared with the visx surface.
 */

/* ─── A11y baseline ──────────────────────────────────────────────────── */
export {
  ChartFrame,
  type ChartFrameProps,
  type KeyboardNav,
  type LiveRegionMode,
  type SeriesEncoding,
} from './ChartFrame';

/* ─── Brand glyph (re-export from icons package) ─────────────────────── */
export { CitationGlyph, ProvedoMark, type CitationGlyphProps } from '../../../icons/CitationGlyph';

/* ─── Re-export the existing visually-hidden transcript ──────────────── */
export { ChartDataTable } from '../../_shared/ChartDataTable';

/* ─── Re-export shared a11y / motion hooks ───────────────────────────── */
export { useChartKeyboardNav } from '../../_shared/useChartKeyboardNav';
export { useReducedMotion } from '../../_shared/useReducedMotion';
export { CHART_FOCUS_RING_CLASS } from '../../_shared/a11y';

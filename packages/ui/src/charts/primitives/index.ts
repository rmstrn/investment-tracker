/**
 * Top-level barrel for `charts/primitives/*`.
 *
 * Re-exports both Layer 1 (math: pure functions, zero React) and Layer 2
 * (svg: composable React primitives). Layer 3 (chart-kind wrappers like
 * LineChart / DonutChart) lives one directory up and consumes from here.
 *
 * Public API contract: consumers import from a SINGLE entrypoint —
 *
 *   import { ChartFrame, linearScale, LinePath } from '@investment-tracker/ui/charts/primitives';
 *
 * Per aggregate decision #2 (\"generators return strings, React owns
 * <path>\"), the math layer never imports React and the svg layer never
 * touches d3 directly — math is the wrapper.
 */

export * from './math';
export * from './svg';

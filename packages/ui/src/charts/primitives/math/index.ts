/**
 * Barrel export for `primitives/math/*`.
 *
 * Public API surface for Layer 1 (math) of the custom SVG chart primitives
 * layer. All d3-* implementations live behind these ports — consumers MUST
 * NOT import `d3-scale` / `d3-shape` / `d3-hierarchy` directly.
 */

export type { Scale, BandScale, LinearScaleOptions, TimeScaleOptions, BandScaleOptions } from './scale';
export { linearScale, timeScale, bandScale } from './scale';

export type { CurveKind, LinePoint, LinePathOptions, AreaPoint, AreaPathOptions, ArcPathOptions } from './path';
export { linePath, areaPath, arcPath } from './path';

export type { TreemapItem, TreemapTile, SquarifyOptions } from './treemap';
export { squarify } from './treemap';

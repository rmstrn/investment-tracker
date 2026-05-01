/**
 * Barrel export for `primitives/math/*`.
 *
 * Phase E1 (visx-candy migration) trimmed scale.ts + path.ts; the only
 * surviving math primitive is the `squarify` treemap layout used by tests
 * + visx documentation references. Phase E2 may retire this folder
 * entirely.
 */

export type { TreemapItem, TreemapTile, SquarifyOptions } from './treemap';
export { squarify } from './treemap';

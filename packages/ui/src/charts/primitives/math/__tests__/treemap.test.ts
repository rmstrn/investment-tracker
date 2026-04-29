/**
 * Vitest unit tests for squarify (d3-hierarchy.treemap wrapper).
 *
 * Tests confirm:
 *   1. Tiles fill the container (sum of areas ≈ width × height when no padding).
 *   2. No tile overlaps another (axis-aligned-rectangle non-intersection).
 *   3. Larger value → larger area (relative ordering preserved).
 *   4. Tile order matches input order (one tile per item, by id).
 */

import { describe, expect, it } from 'vitest';

import { squarify } from '../treemap';
import type { TreemapItem, TreemapTile } from '../treemap';

function area(tile: TreemapTile): number {
  return tile.width * tile.height;
}

function rectsOverlap(a: TreemapTile, b: TreemapTile): boolean {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

describe('squarify', () => {
  it('returns empty array for empty input', async () => {
    const tiles = await squarify([], { width: 100, height: 100 });
    expect(tiles).toEqual([]);
  });

  it('fills the container — sum of areas ≈ width × height (no padding)', async () => {
    const items: TreemapItem[] = [
      { id: 'A', value: 50 },
      { id: 'B', value: 30 },
      { id: 'C', value: 20 },
    ];
    const tiles = await squarify(items, { width: 400, height: 200 });
    const total = tiles.reduce((sum, tile) => sum + area(tile), 0);
    expect(total).toBeCloseTo(400 * 200, 0);
  });

  it('produces non-overlapping tiles', async () => {
    const items: TreemapItem[] = [
      { id: 'A', value: 50 },
      { id: 'B', value: 30 },
      { id: 'C', value: 20 },
      { id: 'D', value: 15 },
      { id: 'E', value: 10 },
    ];
    const tiles = await squarify(items, { width: 600, height: 400 });
    for (let i = 0; i < tiles.length; i += 1) {
      for (let j = i + 1; j < tiles.length; j += 1) {
        const a = tiles[i];
        const b = tiles[j];
        if (a && b) {
          expect(rectsOverlap(a, b)).toBe(false);
        }
      }
    }
  });

  it('preserves relative-ordering: larger value → larger area', async () => {
    const items: TreemapItem[] = [
      { id: 'big', value: 80 },
      { id: 'mid', value: 15 },
      { id: 'small', value: 5 },
    ];
    const tiles = await squarify(items, { width: 400, height: 300 });
    const byId = new Map(tiles.map((tile) => [tile.id, tile]));
    const big = byId.get('big');
    const mid = byId.get('mid');
    const small = byId.get('small');
    expect(big).toBeDefined();
    expect(mid).toBeDefined();
    expect(small).toBeDefined();
    if (big && mid && small) {
      expect(area(big)).toBeGreaterThan(area(mid));
      expect(area(mid)).toBeGreaterThan(area(small));
    }
  });

  it('returns one tile per input item, with matching ids', async () => {
    const items: TreemapItem[] = [
      { id: 'alpha', value: 10 },
      { id: 'beta', value: 20 },
      { id: 'gamma', value: 30 },
    ];
    const tiles = await squarify(items, { width: 300, height: 200 });
    expect(tiles).toHaveLength(3);
    const ids = tiles.map((tile) => tile.id).sort();
    expect(ids).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('produces tiles entirely within the container bounds', async () => {
    const items: TreemapItem[] = [
      { id: 'A', value: 50 },
      { id: 'B', value: 30 },
      { id: 'C', value: 20 },
    ];
    const width = 500;
    const height = 300;
    const tiles = await squarify(items, { width, height });
    for (const tile of tiles) {
      expect(tile.x).toBeGreaterThanOrEqual(0);
      expect(tile.y).toBeGreaterThanOrEqual(0);
      expect(tile.x + tile.width).toBeLessThanOrEqual(width + 1e-9);
      expect(tile.y + tile.height).toBeLessThanOrEqual(height + 1e-9);
    }
  });

  it('respects padding option (tiles get smaller)', async () => {
    const items: TreemapItem[] = [
      { id: 'A', value: 50 },
      { id: 'B', value: 50 },
    ];
    const noPadding = await squarify(items, { width: 200, height: 200, padding: 0 });
    const padded = await squarify(items, { width: 200, height: 200, padding: 10 });
    const noPaddingArea = noPadding.reduce((sum, tile) => sum + area(tile), 0);
    const paddedArea = padded.reduce((sum, tile) => sum + area(tile), 0);
    expect(paddedArea).toBeLessThan(noPaddingArea);
  });

  it('handles single item — fills entire container', async () => {
    const tiles = await squarify([{ id: 'only', value: 100 }], { width: 200, height: 100 });
    expect(tiles).toHaveLength(1);
    const tile = tiles[0];
    expect(tile).toBeDefined();
    if (tile) {
      expect(tile.id).toBe('only');
      expect(tile.x).toBe(0);
      expect(tile.y).toBe(0);
      expect(tile.width).toBeCloseTo(200, 6);
      expect(tile.height).toBeCloseTo(100, 6);
    }
  });
});

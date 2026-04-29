/**
 * Treemap squarify wrapper — d3-hierarchy.treemap with dynamic import.
 *
 * Layer 1 / Phase α.1. Per aggregate decision: «d3-hierarchy.treemap ~3kb gz
 * — don't reinvent squarified». Per FE-engineer review: lazy import so the
 * cost is only paid when a treemap actually renders.
 *
 * Pattern §6 from the static reference: «Treemap = flat <rect> siblings,
 * pre-computed via squarify. NOT nested SVG. Easier to animate / focus-trap
 * / reason about». This module produces those flat rectangles; React `<rect>`
 * rendering lives in Layer 2 (α.2).
 *
 * NO React in this file. Pure functions only — but `squarify` is async
 * because it dynamically imports d3-hierarchy.
 */

/* ────────────────────────────────────────────────────────────────────── */
/* Public types                                                            */
/* ────────────────────────────────────────────────────────────────────── */

export interface TreemapItem {
  readonly id: string;
  readonly value: number;
}

export interface TreemapTile {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface SquarifyOptions {
  readonly width: number;
  readonly height: number;
  /** Inner padding between tiles (default 0). */
  readonly padding?: number;
}

/* ────────────────────────────────────────────────────────────────────── */
/* squarify — async, dynamic-import boundary                               */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Partition `items` into non-overlapping rectangles filling a `width × height`
 * container, using d3-hierarchy's squarified treemap algorithm.
 *
 * Returns one tile per input item, in the same order as the input. Sum of
 * tile areas equals `width × height` minus padding (within floating-point
 * tolerance) when no item value is zero.
 *
 * @example
 * ```ts
 * const tiles = await squarify(
 *   [{ id: 'A', value: 50 }, { id: 'B', value: 30 }, { id: 'C', value: 20 }],
 *   { width: 400, height: 200 }
 * );
 * ```
 */
export async function squarify(
  items: readonly TreemapItem[],
  options: SquarifyOptions,
): Promise<readonly TreemapTile[]> {
  if (items.length === 0) {
    return [];
  }
  const { width, height, padding = 0 } = options;

  // Lazy import — d3-hierarchy only loads when a treemap actually renders.
  const { hierarchy, treemap } = await import('d3-hierarchy');

  type Datum = { readonly id: string; readonly value: number; readonly children?: undefined };

  const root = hierarchy<Datum>(
    {
      id: '__root__',
      value: 0,
      // d3-hierarchy uses `children` to discover descendants; we cast through
      // the recursive shape so the root contains our items as leaves.
      children: items.map((item) => ({ id: item.id, value: item.value })) as unknown as undefined,
    },
    // Children accessor — d3 calls this for every node; our items have no
    // grandchildren so we return `undefined` for leaves.
    (datum) => (datum.id === '__root__' ? (items as unknown as readonly Datum[]) : undefined),
  ).sum((datum) => (datum.id === '__root__' ? 0 : datum.value));

  const layout = treemap<Datum>().size([width, height]).padding(padding).round(false);

  // `treemap(root)` mutates the input AND returns a HierarchyRectangularNode
  // typed view exposing x0/y0/x1/y1 on every descendant; we use the typed
  // return value to keep `noUncheckedIndexedAccess` strictness satisfied.
  const rectangularRoot = layout(root);

  // `.leaves()` returns one node per input item, preserving order.
  return rectangularRoot.leaves().map((leaf) => ({
    id: leaf.data.id,
    x: leaf.x0,
    y: leaf.y0,
    width: Math.max(0, leaf.x1 - leaf.x0),
    height: Math.max(0, leaf.y1 - leaf.y0),
  }));
}

'use client';

/**
 * TreemapVisx — visx-powered candy-themed concentration treemap (POC).
 *
 * Phase B of the visx-candy migration (PD spec
 * `CHARTS_VISX_CANDY_SPEC.md` §8). Sits next to `Treemap.tsx` (Recharts)
 * so PO can compare side-by-side at `/design-system#charts-visx`.
 *
 * Library boundary:
 *   - `treemap` + `hierarchy` from `d3-hierarchy` (already a UI dep,
 *     used elsewhere via `primitives/math/treemap.ts`). We re-use the
 *     squarify algorithm directly here in synchronous form because the
 *     visx component is itself imported by the showcase as a leaf.
 *   - No `@visx/hierarchy` — d3-hierarchy is sufficient and already
 *     installed; adding another package for the same algorithm is dead
 *     weight (Rule 6 — no extra dependencies).
 *
 * Visual signatures (PD §8):
 *   - Tile sizes proportional to weight; tile colour indicates today's
 *     change (signal-orange ↑, accent-deep ↓, cream neutral ≤1%).
 *   - 2px hard ink shadow on the *bottom + right edges only* of each
 *     tile — creates the «paper-pressed pile of tiles» feel rather than
 *     a flat heatmap. Rendered as two stroked `<path>` elements per
 *     tile (right edge + bottom edge), NOT four-sided drop-shadow.
 *   - Largest tile carries Bagel ticker + Manrope mono-uppercase weight.
 *     Smaller tiles get progressively shorter labels.
 *   - Hover-lift `(-2,-2)` with shadow staying anchored — same pattern
 *     as `DonutVisx` / `BarVisx`.
 *   - Entrance: tiles fade-in + scale 0.96→1.0 staggered by size
 *     (largest first), 720ms total via spring-soft easing. Reduced
 *     motion → instant paint.
 *
 * a11y: ChartFrame-equivalent `role="img"` + ChartDataTable shadow.
 * Each tile is `role="button"` with full ticker + weight + Δ in its
 * label; size is also encoded in the label so colour-blind users still
 * get the full picture.
 */

import type { TreemapPayload } from '@investment-tracker/shared-types/charts';
import { hierarchy, treemap as d3Treemap } from 'd3-hierarchy';
import { type CSSProperties, useEffect, useId, useMemo, useState } from 'react';
import { CHART_FOCUS_RING_CLASS } from '../_shared/a11y';
import { ChartDataTable } from '../_shared/ChartDataTable';
import { useReducedMotion } from '../_shared/useReducedMotion';

/* ────────────────────────────────────────────────────────────────────── */
/* Types                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

export interface TreemapVisxProps {
  payload: TreemapPayload;
  width?: number;
  height?: number;
  className?: string;
}

interface ResolvedTile {
  readonly key: string;
  readonly ticker: string;
  readonly weightPct: number;
  readonly dailyChangePct: number | undefined;
  readonly isOther: boolean;
  readonly itemCount: number | undefined;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** Original tile-array index — used for the entrance stagger order
   *  (largest first, so we sort after layout but keep this for keys). */
  readonly originalIndex: number;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Constants                                                               */
/* ────────────────────────────────────────────────────────────────────── */

const SHADOW_OFFSET_PX = 2;
const HOVER_LIFT_PX = 2;

const HOVER_TRANSITION =
  'transform 220ms var(--motion-easing-spring-soft, cubic-bezier(0.34, 1.56, 0.64, 1))';

const ENTRANCE_DURATION_MS = 720;
const ENTRANCE_STAGGER_MS = 40;

/** spring-soft cubic-bezier approximation (matches Donut/Bar). */
function easeSpringSoft(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = 1.70158;
  const t1 = t - 1;
  return t1 * t1 * ((s + 1) * t1 + s) + 1;
}

/** Colour-by-Δ rule per PD §8: ↑>1% signal-orange; ↓>1% deep-terracotta;
 *  |Δ|≤1% cream-neutral. */
function colorForDelta(delta: number | undefined): string {
  if (typeof delta !== 'number' || Math.abs(delta) <= 1) {
    return 'var(--bg-cream, #FFF8E7)';
  }
  return delta > 0
    ? 'var(--cta-fill, var(--accent, #F08A3C))'
    : 'var(--accent-deep, var(--cta-shadow, #C9601E))';
}

/** Foreground ink for tile labels — high-mag tiles get on-color ink,
 *  cream-neutral tiles get the standard candy ink at 0.55 alpha. */
function labelInkForDelta(delta: number | undefined): {
  fill: string;
  opacity: number;
} {
  if (typeof delta !== 'number' || Math.abs(delta) <= 1) {
    return { fill: 'var(--text-on-candy, #1C1B26)', opacity: 0.55 };
  }
  // Saturated tiles: ink stays on the deep side for legibility on both
  // signal-orange and accent-deep backgrounds (both warm → ink sits
  // comfortably with high contrast).
  return { fill: 'var(--text-on-candy, #1C1B26)', opacity: 1 };
}

const TILE_LABEL_TICKER_STYLE: CSSProperties = {
  fontFamily: "var(--font-family-display, 'Bagel Fat One', sans-serif)",
  fontWeight: 400,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '-0.01em',
};

const TILE_LABEL_WEIGHT_STYLE: CSSProperties = {
  fontFamily:
    "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
};

const TOOLTIP_STYLE: CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  background: 'var(--bg-cream, var(--card, #FFF8E7))',
  color: 'var(--text-on-candy, var(--ink, #1C1B26))',
  border: '1.5px solid var(--text-on-candy, #1C1B26)',
  borderRadius: 8,
  padding: '6px 10px',
  fontFamily: "var(--font-family-body, 'Manrope', system-ui, sans-serif)",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  boxShadow: '5px 5px 0 0 var(--text-on-candy, #1C1B26)',
  transform: 'translate(-50%, -100%)',
  zIndex: 2,
};

const TOOLTIP_LABEL_STYLE: CSSProperties = {
  fontFamily:
    "var(--font-family-mono, 'Geist Mono', ui-monospace, SFMono-Regular, monospace)",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 500,
  opacity: 0.7,
  marginBottom: 2,
};

const TOOLTIP_DELTA_STYLE: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  opacity: 0.7,
  marginTop: 2,
};

/* ────────────────────────────────────────────────────────────────────── */
/* Layout — synchronous d3-hierarchy treemap                              */
/* ────────────────────────────────────────────────────────────────────── */

interface LayoutInput {
  readonly key: string;
  readonly value: number;
}

interface LayoutOutput {
  readonly key: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

function layoutTiles(
  items: readonly LayoutInput[],
  width: number,
  height: number,
  padding: number,
): readonly LayoutOutput[] {
  if (items.length === 0 || width <= 0 || height <= 0) return [];
  type Datum = { readonly key: string; readonly value: number };
  const root = hierarchy<Datum>(
    {
      key: '__root__',
      value: 0,
    },
    (datum) =>
      datum.key === '__root__' ? (items as unknown as readonly Datum[]) : undefined,
  ).sum((d) => (d.key === '__root__' ? 0 : d.value));
  const layout = d3Treemap<Datum>().size([width, height]).padding(padding).round(true);
  const rect = layout(root);
  return rect.leaves().map((leaf) => ({
    key: leaf.data.key,
    x: leaf.x0,
    y: leaf.y0,
    w: Math.max(0, leaf.x1 - leaf.x0),
    h: Math.max(0, leaf.y1 - leaf.y0),
  }));
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function TreemapVisx({
  payload,
  width = 360,
  height = 280,
  className,
}: TreemapVisxProps) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  // Entrance progress ms (RAF-driven, capped).
  const [entranceMs, setEntranceMs] = useState<number>(
    prefersReducedMotion ? Number.POSITIVE_INFINITY : 0,
  );
  useEffect(() => {
    if (prefersReducedMotion) {
      setEntranceMs(Number.POSITIVE_INFINITY);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number): void => {
      const elapsed = now - t0;
      setEntranceMs(elapsed);
      const ceiling =
        ENTRANCE_DURATION_MS +
        ENTRANCE_STAGGER_MS * Math.max(0, payload.tiles.length - 1) +
        80;
      if (elapsed < ceiling) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, payload.tiles.length]);

  const tiles: readonly ResolvedTile[] = useMemo(() => {
    const items = payload.tiles.map((t) => ({ key: t.key, value: t.weightPct }));
    const rects = layoutTiles(items, width, height, 2);
    const byKey = new Map(rects.map((r) => [r.key, r] as const));
    return payload.tiles.map((t, i) => {
      const r = byKey.get(t.key) ?? { x: 0, y: 0, w: 0, h: 0 };
      return {
        key: t.key,
        ticker: t.ticker,
        weightPct: t.weightPct,
        dailyChangePct: t.dailyChangePct,
        isOther: t.isOther,
        itemCount: t.itemCount,
        x: r.x,
        y: r.y,
        w: r.w,
        h: r.h,
        originalIndex: i,
      };
    });
  }, [payload.tiles, width, height]);

  // Stagger order: largest first.
  const stagger = useMemo(() => {
    const sorted = [...tiles].sort((a, b) => b.weightPct - a.weightPct);
    const order = new Map<string, number>();
    sorted.forEach((t, i) => order.set(t.key, i));
    return order;
  }, [tiles]);

  const hoverTile = hoverKey ? tiles.find((t) => t.key === hoverKey) : null;

  const ariaLabelText = payload.meta.alt ?? payload.meta.title;

  return (
    <div
      role="img"
      aria-label={ariaLabelText}
      aria-describedby={dataTableId}
      data-testid="chart-treemap-visx"
      data-chart-backend="visx"
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%', position: 'relative' }}
      onMouseLeave={() => setHoverKey(null)}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        focusable="false"
        style={{ overflow: 'visible', maxWidth: '100%', height: 'auto' }}
      >
        {tiles.map((t) => {
          const order = stagger.get(t.key) ?? 0;
          const segStart = order * ENTRANCE_STAGGER_MS;
          const localElapsed = entranceMs - segStart;
          const rawProgress =
            localElapsed <= 0
              ? 0
              : localElapsed >= ENTRANCE_DURATION_MS
                ? 1
                : localElapsed / ENTRANCE_DURATION_MS;
          const progress = easeSpringSoft(rawProgress);
          // Entrance: opacity 0→1, scale 0.96→1 (anchored to tile center).
          const opacity = progress;
          const scale = 0.96 + 0.04 * progress;
          const cx = t.x + t.w / 2;
          const cy = t.y + t.h / 2;

          const isHover = hoverKey === t.key;
          const liftX = isHover && !prefersReducedMotion ? -HOVER_LIFT_PX : 0;
          const liftY = isHover && !prefersReducedMotion ? -HOVER_LIFT_PX : 0;

          const fill = colorForDelta(t.dailyChangePct);
          const ink = labelInkForDelta(t.dailyChangePct);

          // Label decisions by tile size (PD §8 progressive disclosure).
          // Largest tile gets Bagel ticker (chunky); medium gets Manrope
          // ticker; small/tiny gets nothing (tooltip-only).
          const minLabelDim = Math.min(t.w, t.h);
          const showBagel = minLabelDim >= 90 && t.w >= 110;
          const showTicker = !showBagel && minLabelDim >= 44;
          const showWeight = minLabelDim >= 60 && !t.isOther;

          // Bottom + right edge ink — the «pile of tiles» signature.
          // Single path: M (right-top) → V (right-bottom + offset) →
          // H (left-bottom + offset). Two stroked lines, joined at the
          // corner so the ink reads continuous (PD §8).
          const edgePath = `M ${t.x + t.w} ${t.y} L ${t.x + t.w + SHADOW_OFFSET_PX} ${t.y + SHADOW_OFFSET_PX} L ${t.x + t.w + SHADOW_OFFSET_PX} ${t.y + t.h + SHADOW_OFFSET_PX} L ${t.x + SHADOW_OFFSET_PX} ${t.y + t.h + SHADOW_OFFSET_PX} L ${t.x} ${t.y + t.h}`;

          const transform = `translate(${liftX} ${liftY}) translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`;

          const deltaLabel =
            typeof t.dailyChangePct === 'number'
              ? `${t.dailyChangePct >= 0 ? '+' : ''}${t.dailyChangePct.toFixed(1)}%`
              : null;

          return (
            <g
              key={t.key}
              data-tile-key={t.key}
              data-active={isHover || undefined}
              onMouseEnter={() => setHoverKey(t.key)}
              onMouseLeave={() => setHoverKey(null)}
              style={{
                transform,
                transformBox: 'view-box',
                transformOrigin: '0 0',
                transition: prefersReducedMotion ? undefined : HOVER_TRANSITION,
                opacity,
                cursor: 'pointer',
              }}
            >
              {/* Bottom + right edge ink — paper-pressed pile signature */}
              <path
                d={edgePath}
                fill="var(--text-on-candy, #1C1B26)"
                fillOpacity={0.85}
                aria-hidden="true"
              />
              {/* Tile fill */}
              <rect
                x={t.x}
                y={t.y}
                width={t.w}
                height={t.h}
                fill={fill}
                stroke="var(--text-on-candy, #1C1B26)"
                strokeOpacity={0.85}
                strokeWidth={1}
              />
              {/* Hatched overlay for «Other» tile (PD §8 edge case) */}
              {t.isOther ? (
                <rect
                  x={t.x}
                  y={t.y}
                  width={t.w}
                  height={t.h}
                  fill="url(#treemap-hatch)"
                  pointerEvents="none"
                />
              ) : null}
              {/* Labels — progressive disclosure by tile size */}
              {showBagel ? (
                <>
                  <text
                    x={t.x + 12}
                    y={t.y + 28}
                    style={{
                      ...TILE_LABEL_TICKER_STYLE,
                      fontSize: 22,
                      fill: ink.fill,
                      fillOpacity: ink.opacity,
                    }}
                    aria-hidden="true"
                  >
                    {t.ticker}
                  </text>
                  {showWeight ? (
                    <text
                      x={t.x + 12}
                      y={t.y + 44}
                      style={{
                        ...TILE_LABEL_WEIGHT_STYLE,
                        fill: ink.fill,
                        fillOpacity: ink.opacity * 0.85,
                      }}
                      aria-hidden="true"
                    >
                      {`${t.weightPct.toFixed(1)}%`}
                    </text>
                  ) : null}
                </>
              ) : showTicker ? (
                <text
                  x={t.x + 8}
                  y={t.y + 18}
                  style={{
                    ...TILE_LABEL_WEIGHT_STYLE,
                    fontSize: 11,
                    fill: ink.fill,
                    fillOpacity: ink.opacity,
                  }}
                  aria-hidden="true"
                >
                  {t.isOther ? 'OTHER' : t.ticker}
                </text>
              ) : null}
              {/* Per-tile a11y label — visually hidden, screen-readers
                  pull this via the parent ChartDataTable. */}
              <title>
                {t.isOther
                  ? `Other (${t.itemCount ?? 0} positions), ${t.weightPct.toFixed(1)}%`
                  : `${t.ticker}, ${t.weightPct.toFixed(1)}% weight${
                      deltaLabel ? `, ${deltaLabel} today` : ''
                    }`}
              </title>
            </g>
          );
        })}
        {/* Hatched pattern for the «Other» tile */}
        <defs>
          <pattern
            id="treemap-hatch"
            patternUnits="userSpaceOnUse"
            width={6}
            height={6}
            patternTransform="rotate(45)"
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={6}
              stroke="var(--text-on-candy, #1C1B26)"
              strokeOpacity={0.18}
              strokeWidth={1.5}
            />
          </pattern>
        </defs>
      </svg>

      {hoverTile ? (
        <div
          role="tooltip"
          aria-hidden="true"
          style={{
            ...TOOLTIP_STYLE,
            left: `${((hoverTile.x + hoverTile.w / 2) / width) * 100}%`,
            top: hoverTile.y - 8,
          }}
        >
          <div style={TOOLTIP_LABEL_STYLE}>
            {hoverTile.isOther ? 'OTHER' : hoverTile.ticker}
          </div>
          <div>
            {hoverTile.isOther
              ? `${hoverTile.itemCount ?? 0} positions · ${hoverTile.weightPct.toFixed(1)}%`
              : `${hoverTile.weightPct.toFixed(1)}% weight`}
          </div>
          {typeof hoverTile.dailyChangePct === 'number' ? (
            <div style={TOOLTIP_DELTA_STYLE}>
              {`${hoverTile.dailyChangePct >= 0 ? '+' : ''}${hoverTile.dailyChangePct.toFixed(2)}% today`}
            </div>
          ) : null}
        </div>
      ) : null}

      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}

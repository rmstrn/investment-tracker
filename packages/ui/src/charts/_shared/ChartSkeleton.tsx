/**
 * Per-kind loading skeleton (CHARTS_SPEC §3.10).
 *
 * v1.3 redesign (PO feedback 2026-04-29 — «отвратительно»). Each kind paints
 * its own SVG geometry hint that previews the actual chart layout, with
 * neumorphic paper-feel:
 *   - Subtle inset background (paper-press) instead of flat shimmer
 *   - Linear gradient fills for shape primitives so they read as «raised»
 *   - Higher-fidelity geometries — calendar shows 6×7 + day-numbers, donut
 *     shows real segments, treemap shows realistic mosaic, etc.
 *   - Smooth shimmer via `animate-pulse` (Tailwind motion-safe variant
 *     auto-disables under prefers-reduced-motion).
 *   - Geist Mono ghost text (axis-tick stand-ins) at 8px so the kind reads
 *     even before the data arrives.
 *
 * Primitives use `currentColor` so they inherit the `text-background-
 * tertiary` shimmer colour. Geometry is enriched (more rects / lines) to
 * hint at structure, but kept low contrast so the shimmer reads as «not
 * yet ready», not «broken chart».
 */

import type { CSSProperties, ReactElement } from 'react';
import { cn } from '../../lib/cn';
import type { ChartKind } from '../types';

interface ChartSkeletonProps {
  kind: ChartKind;
  /** Override container height. Defaults vary by kind. */
  height?: number;
  /** Pass-through for layout. */
  className?: string;
}

const DEFAULT_HEIGHT: Record<ChartKind, number> = {
  line: 220,
  area: 220,
  bar: 180,
  'stacked-bar': 220,
  donut: 200,
  sparkline: 64,
  calendar: 240,
  treemap: 320,
  waterfall: 300,
  candlestick: 300,
};

/**
 * Tailwind shimmer wrapper. Mirrors `<Skeleton>` so visual rhythm stays
 * consistent across the rest of the app. Wrapper also paints a subtle
 * inset «paper-press» surface so the skeleton reads as a depressed slab
 * waiting to be filled — not a flat grey rectangle.
 */
const SHIMMER_CLASSES = 'text-background-tertiary motion-safe:animate-pulse';

const PAPER_INSET_STYLE: CSSProperties = {
  background:
    'linear-gradient(180deg, var(--inset, rgba(20, 20, 20, 0.04)) 0%, transparent 100%)',
  borderRadius: 8,
};

/**
 * Shared SVG `<defs>` block — vertical gradient that fades the geometry
 * primitive from full `currentColor` at the top to 30% alpha at the
 * baseline. Gives skeletons depth instead of flat fill.
 */
function GradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity={0.85} />
        <stop offset="100%" stopColor="currentColor" stopOpacity={0.45} />
      </linearGradient>
    </defs>
  );
}

/**
 * Single 5-segment wave path used by line + area + sparkline. Y values are
 * pre-computed for a 100×40 viewbox so the shape reads cleanly at any aspect
 * ratio when the SVG is set to `preserveAspectRatio="none"`.
 */
const WAVE_PATH = 'M0 26 L20 18 L40 30 L60 12 L80 22 L100 8';

function LineSkeleton() {
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Line chart loading</title>
      {/* Y-axis tick stand-ins (left rail) — foreshadows the 68px gutter. */}
      {[6, 14, 22, 30].map((y) => (
        <rect key={`ytick-${y}`} x={1} y={y - 1.5} width={6} height={3} rx={0.5} fill="currentColor" opacity={0.35} />
      ))}
      {/* 4 dashed gridlines at the same rhythm as the real chart. */}
      {[8, 16, 24, 32].map((y) => (
        <line
          key={y}
          x1={9}
          x2={100}
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeDasharray="3 5"
          opacity={0.45}
        />
      ))}
      <path d={WAVE_PATH} fill="none" stroke="currentColor" strokeWidth={1.75} opacity={0.85} strokeLinecap="round" strokeLinejoin="round" />
      {/* Active-dot at the rightmost point — hints the data-driven endpoint. */}
      <circle cx={100} cy={8} r={1.5} fill="currentColor" opacity={0.85} />
    </svg>
  );
}

function AreaSkeleton() {
  const gradId = 'sk-area-grad';
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Area chart loading</title>
      <GradientDefs id={gradId} />
      {/* Y-axis tick stand-ins. */}
      {[6, 14, 22, 30].map((y) => (
        <rect key={`ytick-${y}`} x={1} y={y - 1.5} width={6} height={3} rx={0.5} fill="currentColor" opacity={0.35} />
      ))}
      {[8, 16, 24, 32].map((y) => (
        <line
          key={y}
          x1={9}
          x2={100}
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeDasharray="3 5"
          opacity={0.45}
        />
      ))}
      {/* Filled area uses gradient fade — reads as a real area chart shape. */}
      <path d={`${WAVE_PATH} L100 40 L0 40 Z`} fill={`url(#${gradId})`} stroke="none" />
      <path d={WAVE_PATH} fill="none" stroke="currentColor" strokeWidth={1.75} opacity={0.85} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarSkeleton() {
  // 6 vertical bars with varying heights; staircase rhythm.
  const bars = [
    { x: 9, h: 24 },
    { x: 23, h: 32 },
    { x: 37, h: 18 },
    { x: 51, h: 36 },
    { x: 65, h: 14 },
    { x: 79, h: 28 },
  ];
  const gradId = 'sk-bar-grad';
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Bar chart loading</title>
      <GradientDefs id={gradId} />
      {/* Left-rail y-axis tick stand-ins. */}
      {[6, 14, 22, 30].map((y) => (
        <rect key={`ytick-${y}`} x={1} y={y - 1.5} width={6} height={3} rx={0.5} fill="currentColor" opacity={0.35} />
      ))}
      {/* 3 dashed gridlines at chart rhythm. */}
      {[10, 20, 30].map((y) => (
        <line key={y} x1={9} x2={100} y1={y} y2={y} stroke="currentColor" strokeWidth={0.5} strokeDasharray="3 5" opacity={0.4} />
      ))}
      {/* Baseline (axis substitute). */}
      <line x1={9} x2={100} y1={38} y2={38} stroke="currentColor" strokeWidth={0.7} opacity={0.55} />
      {bars.map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={38 - b.h}
          width={11}
          height={b.h}
          rx={2}
          ry={2}
          fill={`url(#${gradId})`}
        />
      ))}
      {/* X-axis tick stand-ins (one per bar). */}
      {bars.map((b) => (
        <rect key={`xtick-${b.x}`} x={b.x + 2} y={39} width={7} height={1.2} rx={0.5} fill="currentColor" opacity={0.4} />
      ))}
    </svg>
  );
}

function StackedBarSkeleton() {
  // 5 vertical multi-segment bars. Each bar splits into 3 segments via opacity
  // bands so the stacked structure reads at-a-glance.
  const bars = [
    { x: 11, segs: [10, 12, 8] },
    { x: 28, segs: [14, 10, 6] },
    { x: 45, segs: [8, 16, 12] },
    { x: 62, segs: [12, 8, 14] },
    { x: 79, segs: [10, 14, 10] },
  ];
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Stacked bar chart loading</title>
      {[6, 14, 22, 30].map((y) => (
        <rect key={`ytick-${y}`} x={1} y={y - 1.5} width={6} height={3} rx={0.5} fill="currentColor" opacity={0.35} />
      ))}
      {[10, 20, 30].map((y) => (
        <line key={y} x1={9} x2={100} y1={y} y2={y} stroke="currentColor" strokeWidth={0.5} strokeDasharray="3 5" opacity={0.4} />
      ))}
      <line x1={9} x2={100} y1={38} y2={38} stroke="currentColor" strokeWidth={0.7} opacity={0.55} />
      {bars.map((b) => {
        let yCursor = 38;
        return b.segs.map((segH, i) => {
          yCursor -= segH;
          // 3 segments → opacity 0.78 / 0.55 / 0.36 stacked bottom-to-top.
          const op = i === 0 ? 0.78 : i === 1 ? 0.55 : 0.36;
          // Top segment gets rounded corners to match real chart radius.
          const isTop = i === b.segs.length - 1;
          return (
            <rect
              key={`${b.x}-${i}`}
              x={b.x}
              y={yCursor}
              width={13}
              height={segH}
              rx={isTop ? 2 : 0}
              ry={isTop ? 2 : 0}
              fill="currentColor"
              opacity={op}
            />
          );
        });
      })}
    </svg>
  );
}

function DonutSkeleton() {
  // Real-segment donut: 5 arcs at 40 / 24 / 17 / 11 / 8 % proportions
  // (mirrors the static reference's allocation distribution). Each arc
  // is a `<circle>` with `stroke-dasharray` lengths summing to 2πr ≈ 88.
  // Each arc gets a slightly different opacity so the «5 sectors» reads
  // even through the shimmer.
  const r = 14;
  const circ = 2 * Math.PI * r; // ≈ 87.96
  // Proportions sum to 100 → arc lengths.
  const segs = [40, 24, 17, 11, 8].map((pct) => (pct / 100) * circ);
  let offset = 0;
  return (
    <svg
      viewBox="0 0 40 40"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>Donut chart loading</title>
      <g transform="rotate(-90 20 20)">
        {segs.map((segLen, i) => {
          // 2px gap between segments — matches the real donut's --card stroke.
          const gap = 0.4;
          const dasharray = `${Math.max(0, segLen - gap)} ${circ}`;
          const op = [0.85, 0.7, 0.55, 0.42, 0.32][i] ?? 0.4;
          const dashOffset = -offset;
          offset += segLen;
          return (
            <circle
              key={i}
              cx={20}
              cy={20}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={5}
              strokeDasharray={dasharray}
              strokeDashoffset={dashOffset}
              opacity={op}
            />
          );
        })}
      </g>
      {/* Inner-hole inset suggestion — a faint ring at the inner edge for the
          paper-cut feel. */}
      <circle cx={20} cy={20} r={11} fill="none" stroke="currentColor" strokeWidth={0.3} opacity={0.35} />
    </svg>
  );
}

function SparklineSkeleton() {
  // Short single wave, no axes, no gridlines (per CHARTS_SPEC §4.5).
  return (
    <svg
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Sparkline loading</title>
      <path
        d="M0 14 L20 8 L40 12 L60 6 L80 10 L100 4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        opacity={0.85}
      />
    </svg>
  );
}

function CalendarSkeleton() {
  // 5-row × 7-col grid of date cells with day-number ghost stripes.
  const rows = 5;
  const cols = 7;
  // Reserve 5 viewBox units for weekday header strip at the top.
  const headerH = 5;
  const gridH = 40 - headerH;
  const cellW = 100 / cols;
  const cellH = gridH / rows;
  // Out-of-month cells (first row first 2 + last row last 3) — fainter.
  const isOut = (r: number, c: number) =>
    (r === 0 && c < 2) || (r === rows - 1 && c >= cols - 3);
  // A handful of cells get an «event pill» ghost — fixed positions so the
  // skeleton hints at the dividend-pill layout without random churn.
  const eventCells = new Set(['1-3', '1-5', '2-2', '3-4', '3-6']);
  const cells: { x: number; y: number; r: number; c: number }[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push({ x: c * cellW, y: headerH + r * cellH, r, c });
    }
  }
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Calendar loading</title>
      {/* Weekday header strip — 7 small mono-text stand-ins. */}
      {Array.from({ length: cols }).map((_, c) => (
        <rect
          key={`hdr-${c}`}
          x={c * cellW + cellW * 0.25}
          y={1}
          width={cellW * 0.5}
          height={1.6}
          rx={0.4}
          fill="currentColor"
          opacity={0.4}
        />
      ))}
      {cells.map((cell) => {
        const out = isOut(cell.r, cell.c);
        const hasEvent = eventCells.has(`${cell.r}-${cell.c}`);
        return (
          <g key={`${cell.x}-${cell.y}`}>
            <rect
              x={cell.x + 0.4}
              y={cell.y + 0.4}
              width={cellW - 0.8}
              height={cellH - 0.8}
              rx={0.8}
              fill={out ? 'transparent' : 'currentColor'}
              opacity={out ? 0 : 0.32}
            />
            {/* Day-number stand-in (top-left of cell). */}
            <rect
              x={cell.x + 1.2}
              y={cell.y + 1.2}
              width={1.8}
              height={1.4}
              rx={0.3}
              fill="currentColor"
              opacity={out ? 0.18 : 0.55}
            />
            {/* Event pill stand-in. */}
            {hasEvent && !out ? (
              <rect
                x={cell.x + 1.2}
                y={cell.y + cellH - 2.6}
                width={cellW - 2.4}
                height={1.6}
                rx={0.4}
                fill="currentColor"
                opacity={0.7}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function TreemapSkeleton() {
  // 7-tile mosaic mirroring the real fixture's NVDA/MSFT/AAPL/GOOGL/BRK.B/
  // JNJ/XOM/Other layout. Each tile gets a different opacity to hint at
  // the magnitude-based fill modulation.
  const tiles = [
    { x: 0.5, y: 0.5, w: 42, h: 22, op: 0.78 }, // NVDA — biggest, most saturated
    { x: 43, y: 0.5, w: 34, h: 13, op: 0.6 }, // MSFT
    { x: 77.5, y: 0.5, w: 22, h: 13, op: 0.55 }, // AAPL
    { x: 43, y: 14, w: 21, h: 9, op: 0.5 }, // GOOGL
    { x: 64.5, y: 14, w: 18, h: 9, op: 0.36 }, // BRK.B
    { x: 83, y: 14, w: 16.5, h: 9, op: 0.32 }, // JNJ
    { x: 0.5, y: 23.5, w: 20, h: 16, op: 0.78 }, // XOM
    { x: 21, y: 23.5, w: 78.5, h: 16, op: 0.45 }, // OTHER
  ];
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Treemap loading</title>
      {tiles.map((t, i) => (
        <g key={i}>
          <rect
            x={t.x}
            y={t.y}
            width={t.w}
            height={t.h}
            fill="currentColor"
            opacity={t.op}
            stroke="var(--card, #fff)"
            strokeWidth={0.5}
          />
          {/* Cream rim highlight at top — neumorphic raised feel. */}
          {t.w >= 12 && t.h >= 6 ? (
            <rect
              x={t.x + 0.4}
              y={t.y + 0.4}
              width={Math.max(0, t.w - 0.8)}
              height={Math.max(0, t.h - 0.8)}
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth={0.4}
            />
          ) : null}
          {/* Ticker stand-in (top-left). */}
          {t.w >= 14 && t.h >= 7 ? (
            <rect x={t.x + 1.2} y={t.y + 1.4} width={6} height={1.4} rx={0.3} fill="currentColor" opacity={0.85} />
          ) : null}
          {/* Pct stand-in. */}
          {t.w >= 14 && t.h >= 11 ? (
            <rect x={t.x + 1.2} y={t.y + 4} width={9} height={1} rx={0.3} fill="currentColor" opacity={0.55} />
          ) : null}
        </g>
      ))}
    </svg>
  );
}

function WaterfallSkeleton() {
  // Floating-baseline staircase mirroring the redesigned waterfall:
  // 5 steps total — start pillar (slim, ink) → 3 floating deltas → end pillar.
  // Anchors are slim (4 wide) and tall, flow bars are wider (12) and shorter,
  // matching the new anchor-vs-flow visual hierarchy.
  const flows: { x: number; y: number; h: number }[] = [
    { x: 22, y: 14, h: 10 },
    { x: 40, y: 18, h: 6 },
    { x: 58, y: 11, h: 9 },
  ];
  const anchors: { x: number; y: number; h: number }[] = [
    { x: 8, y: 12, h: 26 },
    { x: 78, y: 8, h: 30 },
  ];
  // Connector points: top of each bar in left-to-right order.
  const connectorPoints: { x1: number; y1: number; x2: number; y2: number }[] = [
    { x1: 14, y1: 12, x2: 22, y2: 14 },
    { x1: 34, y1: 14, x2: 40, y2: 18 },
    { x1: 52, y1: 18, x2: 58, y2: 11 },
    { x1: 70, y1: 11, x2: 78, y2: 8 },
  ];
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Waterfall loading</title>
      {[10, 20, 30].map((y) => (
        <line key={y} x1={0} x2={100} y1={y} y2={y} stroke="currentColor" strokeWidth={0.4} strokeDasharray="3 5" opacity={0.35} />
      ))}
      <line x1={0} x2={100} y1={38} y2={38} stroke="currentColor" strokeWidth={0.5} opacity={0.45} />
      {/* Anchor pillars (slim ink columns). */}
      {anchors.map((a) => (
        <rect key={`a-${a.x}`} x={a.x} y={a.y} width={6} height={a.h} rx={1} fill="currentColor" opacity={0.78} />
      ))}
      {/* Flow bars (wider, lighter). */}
      {flows.map((f) => (
        <rect key={`f-${f.x}`} x={f.x} y={f.y} width={12} height={f.h} rx={1.2} fill="currentColor" opacity={0.55} />
      ))}
      {/* Step-after connector dashes between top edges. */}
      {connectorPoints.map((c, i) => (
        <line
          // biome-ignore lint/suspicious/noArrayIndexKey: positional skeleton connector.
          key={`conn-${i}`}
          x1={c.x1}
          y1={c.y1}
          x2={c.x2}
          y2={c.y2}
          stroke="currentColor"
          strokeWidth={0.4}
          strokeDasharray="1.5 2"
          opacity={0.5}
        />
      ))}
    </svg>
  );
}

function CandlestickSkeleton() {
  // 5 OHLC bars: thin wick + thicker body.
  const bars = [
    { x: 10, wickTop: 4, wickBottom: 30, bodyTop: 10, bodyBottom: 22 },
    { x: 28, wickTop: 8, wickBottom: 34, bodyTop: 14, bodyBottom: 28 },
    { x: 46, wickTop: 6, wickBottom: 28, bodyTop: 12, bodyBottom: 22 },
    { x: 64, wickTop: 12, wickBottom: 32, bodyTop: 16, bodyBottom: 26 },
    { x: 82, wickTop: 4, wickBottom: 24, bodyTop: 8, bodyBottom: 18 },
  ];
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <title>Candlestick chart loading</title>
      {bars.map((b) => (
        <g key={b.x}>
          <line
            x1={b.x + 4}
            x2={b.x + 4}
            y1={b.wickTop}
            y2={b.wickBottom}
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.7}
          />
          <rect
            x={b.x}
            y={b.bodyTop}
            width={8}
            height={b.bodyBottom - b.bodyTop}
            fill="currentColor"
            opacity={0.7}
          />
        </g>
      ))}
    </svg>
  );
}

const KIND_RENDERERS: Record<ChartKind, () => ReactElement> = {
  line: LineSkeleton,
  area: AreaSkeleton,
  bar: BarSkeleton,
  'stacked-bar': StackedBarSkeleton,
  donut: DonutSkeleton,
  sparkline: SparklineSkeleton,
  calendar: CalendarSkeleton,
  treemap: TreemapSkeleton,
  waterfall: WaterfallSkeleton,
  candlestick: CandlestickSkeleton,
};

export function ChartSkeleton({ kind, height, className }: ChartSkeletonProps) {
  const h = height ?? DEFAULT_HEIGHT[kind];
  const Renderer = KIND_RENDERERS[kind];
  return (
    <div
      data-testid={`chart-skeleton-${kind}`}
      role="status"
      aria-label={`${kind} chart loading`}
      className={cn(SHIMMER_CLASSES, className)}
      style={{ width: '100%', height: h, ...PAPER_INSET_STYLE }}
    >
      <Renderer />
    </div>
  );
}

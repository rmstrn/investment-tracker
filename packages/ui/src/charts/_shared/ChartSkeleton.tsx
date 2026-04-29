/**
 * Per-kind loading skeleton (CHARTS_SPEC §3.10).
 *
 * Each kind paints its own SVG geometry hint that foreshadows the chart layout
 * — a 5-segment wave for line/area, a staircase for bar, a ring for donut, and
 * so on. Geometry primitives use `currentColor` so they inherit the
 * `text-background-tertiary` shimmer surface. The wrapping `<div>` carries the
 * `animate-pulse` shimmer (matching the existing `<Skeleton>` primitive), and
 * `prefers-reduced-motion` is respected globally via Tailwind's `motion-reduce`
 * variant on `animate-pulse` (no JS toggle needed — Tailwind v4 emits the
 * `@media (prefers-reduced-motion: reduce)` guard automatically).
 */

import type { ReactElement } from 'react';
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
 * consistent across the rest of the app.
 */
const SHIMMER_CLASSES = 'text-background-tertiary motion-safe:animate-pulse';

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
      {/* 5 hairline gridlines, dashed — foreshadows the gridline rhythm. */}
      {[8, 16, 24, 32].map((y) => (
        <line
          key={y}
          x1={0}
          x2={100}
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeDasharray="1.5 2"
          opacity={0.4}
        />
      ))}
      <path d={WAVE_PATH} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.85} />
    </svg>
  );
}

function AreaSkeleton() {
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
      {[8, 16, 24, 32].map((y) => (
        <line
          key={y}
          x1={0}
          x2={100}
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeDasharray="1.5 2"
          opacity={0.4}
        />
      ))}
      {/* Filled area under the same wave + closing baseline. */}
      <path d={`${WAVE_PATH} L100 40 L0 40 Z`} fill="currentColor" opacity={0.35} stroke="none" />
      <path d={WAVE_PATH} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.85} />
    </svg>
  );
}

function BarSkeleton() {
  // 6 vertical bars with varying heights; staircase rhythm.
  const bars = [
    { x: 4, h: 24 },
    { x: 20, h: 32 },
    { x: 36, h: 18 },
    { x: 52, h: 36 },
    { x: 68, h: 14 },
    { x: 84, h: 28 },
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
      <title>Bar chart loading</title>
      <line x1={0} x2={100} y1={38} y2={38} stroke="currentColor" strokeWidth={0.5} opacity={0.5} />
      {bars.map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={38 - b.h}
          width={12}
          height={b.h}
          rx={1}
          fill="currentColor"
          opacity={0.7}
        />
      ))}
    </svg>
  );
}

function StackedBarSkeleton() {
  // 5 vertical multi-segment bars. Each bar splits into 3 segments via opacity
  // bands so the stacked structure reads at-a-glance.
  const bars = [
    { x: 6, segs: [10, 12, 8] },
    { x: 24, segs: [14, 10, 6] },
    { x: 42, segs: [8, 16, 12] },
    { x: 60, segs: [12, 8, 14] },
    { x: 78, segs: [10, 14, 10] },
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
      <line x1={0} x2={100} y1={38} y2={38} stroke="currentColor" strokeWidth={0.5} opacity={0.5} />
      {bars.map((b) => {
        let yCursor = 38;
        return b.segs.map((segH, i) => {
          yCursor -= segH;
          // 3 segments → opacity 0.85 / 0.6 / 0.4 stacked bottom-to-top.
          const op = i === 0 ? 0.85 : i === 1 ? 0.6 : 0.4;
          return (
            <rect
              key={`${b.x}-${i}`}
              x={b.x}
              y={yCursor}
              width={14}
              height={segH}
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
      {/* Outer ring */}
      <circle
        cx={20}
        cy={20}
        r={14}
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        opacity={0.5}
      />
      {/* 4 sector indicators — small ticks around the ring at 12/3/6/9 o'clock. */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + Math.cos(rad) * 12;
        const y1 = 20 + Math.sin(rad) * 12;
        const x2 = 20 + Math.cos(rad) * 16;
        const y2 = 20 + Math.sin(rad) * 16;
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={1.5}
            opacity={0.85}
          />
        );
      })}
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
  // 4-row × 7-col grid of date cells with hairline gaps.
  const rows = 4;
  const cols = 7;
  const cellW = 100 / cols;
  const cellH = 40 / rows;
  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push({ x: c * cellW, y: r * cellH });
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
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x + 0.5}
          y={cell.y + 0.5}
          width={cellW - 1}
          height={cellH - 1}
          rx={0.6}
          fill="currentColor"
          opacity={0.45}
        />
      ))}
    </svg>
  );
}

function TreemapSkeleton() {
  // 4-tile mosaic: large left tile + 3 stacked right tiles.
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
      <rect x={0.5} y={0.5} width={59} height={39} fill="currentColor" opacity={0.65} />
      <rect x={60.5} y={0.5} width={39} height={18} fill="currentColor" opacity={0.5} />
      <rect x={60.5} y={19.5} width={20} height={20} fill="currentColor" opacity={0.45} />
      <rect x={81} y={19.5} width={18.5} height={20} fill="currentColor" opacity={0.4} />
    </svg>
  );
}

function WaterfallSkeleton() {
  // Floating-baseline staircase: 5 steps, each anchored to the running balance
  // of the previous step. start anchor → up → down → up → end anchor.
  const steps: { x: number; y: number; h: number; anchor?: boolean }[] = [
    { x: 4, y: 12, h: 26, anchor: true }, // start anchor (full-height)
    { x: 22, y: 8, h: 14 }, // floating up
    { x: 40, y: 14, h: 10 }, // floating down
    { x: 58, y: 6, h: 12 }, // floating up
    { x: 76, y: 6, h: 32, anchor: true }, // end anchor
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
      <line x1={0} x2={100} y1={38} y2={38} stroke="currentColor" strokeWidth={0.5} opacity={0.4} />
      {steps.map((s) => (
        <rect
          key={s.x}
          x={s.x}
          y={s.y}
          width={14}
          height={s.h}
          fill="currentColor"
          opacity={s.anchor ? 0.8 : 0.55}
        />
      ))}
      {/* Connector hairlines between adjacent step tops (foreshadows §4.11). */}
      {steps.slice(0, -1).map((s, i) => {
        const next = steps[i + 1];
        if (!next) return null;
        const startY = s.y;
        return (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: positional skeleton connector.
            key={`conn-${i}`}
            x1={s.x + 14}
            x2={next.x}
            y1={startY}
            y2={startY}
            stroke="currentColor"
            strokeWidth={0.5}
            opacity={0.4}
            strokeDasharray="1 1.5"
          />
        );
      })}
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
      style={{ width: '100%', height: h }}
    >
      <Renderer />
    </div>
  );
}

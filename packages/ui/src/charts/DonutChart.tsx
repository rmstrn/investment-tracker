'use client';

/**
 * DonutChart (V1 — Recharts bridge backend) — typed payload renderer.
 *
 * Reads `DonutChartPayload` from `@investment-tracker/shared-types/charts`.
 * Δ1 sum-to-total invariant lives at the envelope level (Zod), so the
 * renderer just renders. 60% inner radius per CHARTS_SPEC §4.4; legend
 * placement varies by viewport.
 *
 * V1↔V2 visual delta — DELIBERATE (DONUT-V2 kickoff D5 + ADR design call 5).
 * V1 (this file) = Recharts bridge backend that stays alive until TD-115
 * dispatcher-sunset gate fires (≥3 V2 charts in production + 2 weeks of zero
 * hydration regressions). The following V2 features are NOT back-ported here:
 *   • Per-slice radial gradient «свет изнутри» (V1 keeps flat fill).
 *   • `cornerRadius` (V1 stays at `0` — the rounded corner is a V2-only
 *     cue that the new backend is active. Both visuals are valid; this is
 *     a deliberate signal, not a regression).
 *   • By-magnitude descending entrance stagger (V1 keeps Recharts default).
 *   • Bisector hover translation (V1 keeps the 1.02× scale via `activeShape`).
 * D5 trim: hairline outline reduced from 2px → 1px + `vectorEffect="non-scaling-stroke"`
 * to match V2 anatomy (so V1 renders next to V2 don't read as broken). Cross-ref
 * TD-118 (V1↔V2 stagger + cornerRadius delta documented), TD-115 (sunset gate).
 */

import type { DonutChartPayload } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import { ChartDataTable } from './_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS } from './tokens';

/**
 * Active-slice renderer (CHARTS_SPEC §3.7).
 *
 * Scales the slice 1.02× outward (≈+4px on outer radius for our 220px size)
 * and overlays a 4px `var(--accent-glow)` rim ring just outside the slice.
 * Reduced-motion path skips the scale and only paints the glow ring. Recharts
 * passes the standard sector geometry props through `activeShape`'s argument.
 */
interface ActiveShapeProps {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
}

function makeActiveShape(prefersReducedMotion: boolean) {
  return function ActiveShape(props: ActiveShapeProps) {
    const {
      cx = 0,
      cy = 0,
      innerRadius = 0,
      outerRadius = 0,
      startAngle = 0,
      endAngle = 0,
      fill,
    } = props;
    // Spec: 1.02× scale outward. For our 220px donut (outerR ≈ 106px) that's
    // ~+2.1px; we use +4px for crisper paper-feel separation per static ref.
    const expanded = prefersReducedMotion ? outerRadius : outerRadius + 4;
    return (
      <g>
        {/* 4px glow rim — sits just outside the (possibly scaled) outer edge. */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={expanded}
          outerRadius={expanded + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill="var(--accent-glow)"
          stroke="none"
        />
        {/* Active slice itself, optionally scaled. */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={expanded}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none"
        />
      </g>
    );
  };
}

export interface DonutChartProps {
  payload: DonutChartPayload;
  size?: number;
  /** Custom center label override; falls back to `payload.centerLabel` or sum. */
  centerLabel?: ReactNode;
  className?: string;
}

export function DonutChart({ payload, size = 220, centerLabel, className }: DonutChartProps) {
  const dataTableId = useId();
  const tooltip = buildTooltipProps();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.segments.length, onIndexChange);

  // Recharts 3.x dropped explicit `activeIndex` on `<Pie>`; the library now
  // drives `activeShape` internally from its hover/tooltip state. We keep the
  // local `hoverIndex` purely so other parts of the renderer (e.g. tooltip
  // suppression in tests) can observe pointer state without round-tripping
  // through Recharts.
  void hoverIndex;
  const activeShapeRenderer = makeActiveShape(prefersReducedMotion);

  const outerR = size / 2 - 4;
  const innerR = outerR * 0.6;
  const fmtValue = (n: number) => formatValue(n, payload.format, payload.currency);

  // Neumorphism inner-hole inset shadow id (v1.2). The inset shadow gives
  // the donut hole the «cut out of paper» feel — paper around it is raised,
  // hole is depressed. We render a `<circle>` masked overlay below the SVG
  // because Recharts doesn't allow injecting `<defs>` directly under the
  // `<Pie>` group without a custom shape prop. The overlay sits as an
  // absolutely-positioned div with its own SVG; cheap and theme-flippable.
  const innerHoleId = `donut-inner-hole-${dataTableId.replace(/[^a-z0-9]/gi, '')}`;

  /**
   * Donut palette refresh (PO feedback 2026-04-29) — the prior `DONUT_ORDER`
   * (which equals `SERIES_VARS` in source order) put two adjacent forest-jade
   * derivatives next to each other for sector allocation, which made the
   * outline-vs-fill distinction read as muddy. We pick a perceptually-distinct
   * subset for sector-allocation context: deep-jade · ink · ochre/cobalt-ink
   * (series-9/10) · soft bronze · graphite. Mix is intentionally cool-warm-
   * neutral interleaved so adjacent slices never share a hue family.
   *
   * Falls back to per-segment `s.color` when the agent supplies one (allows
   * AI-generated payloads to override). Mod-12 wraps to the full extended
   * palette for >5-segment cases.
   */
  const ALLOCATION_PALETTE = [
    'var(--chart-series-1)', // forest-jade
    'var(--chart-series-3)', // ink (high contrast anchor)
    'var(--chart-series-9)', // ochre (editorial extension)
    'var(--chart-series-6)', // soft bronze
    'var(--chart-series-10)', // aubergine / cobalt-ink
    'var(--chart-series-5)', // graphite
    'var(--chart-series-11)', // dusty mauve
    'var(--chart-series-4)', // mid-jade
    'var(--chart-series-2)', // bronze
    'var(--chart-series-12)', // clay tan
    'var(--chart-series-7)', // deep-jade
    'var(--chart-series-8)', // 8th editorial extension
  ];

  const segments = payload.segments.map((s, i) => ({
    ...s,
    color: s.color ?? ALLOCATION_PALETTE[i % ALLOCATION_PALETTE.length],
  }));

  const center =
    centerLabel ??
    (payload.centerLabel ? (
      <div className="font-mono text-sm font-semibold tabular-nums">{payload.centerLabel}</div>
    ) : null);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-donut"
      data-chart-backend="recharts"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/*
         * PO feedback (2026-04-29) — donut layout «поехал полностью» fix.
         *
         * Root cause: the prior renderer placed the Recharts `<Legend>` inside
         * the same ResponsiveContainer. Recharts allocates legend real-estate
         * by squeezing the Pie's plot area, which shifted the donut center
         * away from the SVG's geometric centre. Our overlay SVG (outer +
         * inner ring) assumed the donut sat at `(size/2, size/2)` — when it
         * shifted left/up the rings drifted off the actual coloured slices.
         *
         * Fix: render the Pie alone in its own square ResponsiveContainer;
         * legend and centre-label live as siblings outside the chart's
         * coordinate space. This guarantees the Pie stays geometrically
         * centred on `(size/2, size/2)` so the overlay rings hit the right
         * radii. The chart-level legend below is also styled with fewer
         * Recharts internals — wrapped in a flex-column to match the right-
         * rail editorial layout we want anyway.
         */}
        <ResponsiveContainer width={size} height={size}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={innerR}
              outerRadius={outerR}
              stroke="var(--card)"
              // D5 trim: hairline 2px → 1px to match V2 anatomy. V1 keeps
              // `cornerRadius` at 0 (deliberate V1↔V2 delta — see file header
              // + TD-118).
              strokeWidth={1}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={CHART_ANIMATION_MS}
              animationEasing="ease-out"
              activeShape={activeShapeRenderer}
              onMouseEnter={(_, i) => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {segments.map((s) => (
                // D5 trim: 1px hairline to match V2 anatomy. Recharts `<Cell>`
                // strokeWidth wins over the parent `<Pie>` stroke prop.
                // `vectorEffect="non-scaling-stroke"` keeps the hairline crisp
                // on retina + during Recharts' internal scale transforms.
                <Cell
                  key={s.key}
                  fill={s.color}
                  stroke="var(--card)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltip.contentStyle}
              labelStyle={tooltip.labelStyle}
              itemStyle={tooltip.itemStyle}
              separator={tooltip.separator}
              formatter={(v) => fmtValue(Number(v))}
            />
          </PieChart>
        </ResponsiveContainer>
        {/*
         * Outline-vs-fill alignment (PO feedback): the overlay rings are now
         * drawn at the EXACT Pie radii. Pie has `stroke=var(--card) width=2`
         * which paints inset+outset of the radius, so the visible coloured
         * edge sits at `outerR ± 1` and `innerR ± 1`. We therefore draw the
         * outline rim at `outerR + 1` (the cream stroke's outer edge) and
         * the inner-hole shadow at `innerR - 1`. Pointer-events disabled so
         * overlay never interferes with hover / tooltip.
         */}
        <svg
          aria-hidden="true"
          width={size}
          height={size}
          className="pointer-events-none absolute inset-0"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id={innerHoleId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
              <feOffset dx="0" dy="0.6" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.45" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer ring — sits exactly at the Pie's cream-stroke outer edge. */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={outerR + 1}
            fill="none"
            stroke="var(--border-subtle, rgba(20, 20, 20, 0.06))"
            strokeWidth={1}
          />
          {/* Inner-hole inset shadow — sits exactly at Pie's inner cream-stroke edge. */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={innerR - 1}
            fill="none"
            stroke="var(--chart-grid-strong, rgba(20, 20, 20, 0.10))"
            strokeWidth={1}
            filter={`url(#${innerHoleId})`}
          />
        </svg>
        {center ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {center}
          </div>
        ) : null}
      </div>
      {/* Legend — rendered as a sibling so it does NOT push the donut off-centre. */}
      <ul
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
        style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}
      >
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 9,
                height: 9,
                borderRadius: 999,
                background: s.color,
              }}
            />
            <span className="font-medium">{s.label}</span>
          </li>
        ))}
      </ul>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}

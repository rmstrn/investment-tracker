'use client';

/**
 * BarChartV2 — primitives-backed bar renderer under editorial-still-life form.
 *
 * Phase β.1.4 of the chart-primitives migration. Behind feature flag
 * `NEXT_PUBLIC_PROVEDO_CHART_BACKEND=primitives`. When the flag flips, the
 * barrel `@investment-tracker/ui/charts#BarChart` resolves to this file.
 *
 * Spec: docs/superpowers/specs/2026-04-30-bar-chart-v2-design.md
 *
 * Visual register: editorial-still-life (PD-locked):
 *   - Linear-gradient fill, orientation-aware (top→bottom vertical;
 *     left→right horizontal)
 *   - Single hue slot 1 (cocoa) default
 *   - colorBySign=true → slot 1 (positive) + slot 4 wine (negative)
 *   - Hover scale 1.06 + paper-press shadow via useHoverScale (12px threshold)
 *   - All 4 corners r=6 (full pebble form)
 *   - Embossed-groove reference line (NOT dashed)
 *   - Drift caption upgraded to paper-press block
 *
 * Architecture: ChartFrame > children( svg > defs(filter, gradients) >
 * CartesianFrame > GridLines + bars + ReferenceLine + Axis(x) + Axis(y) ).
 * ChartFrame owns role=img + label derivation + ChartDataTable + live region;
 * BarChartV2 contributes the SVG primitives + drift caption.
 */

import type { BarChartPayload } from '@investment-tracker/shared-types/charts';
import { type CSSProperties, useCallback, useId, useMemo, useState } from 'react';
import { ChartFrame } from './primitives/svg/ChartFrame';
import { Axis } from './primitives/svg/Axis';
import { CartesianFrame } from './primitives/svg/CartesianFrame';
import { ReferenceLine } from './primitives/svg/ReferenceLine';
import { GridLines } from './primitives/svg/GridLines';
import { bandScale, linearScale } from './primitives/math/scale';
import { EditorialBevelFilter } from './_shared/filters';
import { useThemeMode } from './_shared/useThemeMode';
import { useReducedMotion } from './_shared/useReducedMotion';
import { useHoverScale } from './_shared/useHoverScale';
import { formatValue, formatXAxis } from './_shared/formatters';
import { CHART_ANIMATION_MS } from './tokens';

export interface BarChartV2Props {
  payload: BarChartPayload;
  height?: number;
  className?: string;
}

const DEFAULT_HEIGHT = 180;
const DEFAULT_WIDTH = 480;
const MARGIN = { top: 8, right: 8, bottom: 28, left: 56 } as const;
const BAR_CORNER_RADIUS = 6;
const BAR_PADDING = 0.18;
const TICK_COUNT = 5;

const DRIFT_CAPTION_TEXT =
  'Drift = change in weight from the prior date to the current date, driven by price moves and any trades. Provedo describes drift; it does not mark drift as good/bad or recommend rebalancing.';

const HOVER_SHADOW =
  'var(--shadow-chart-slice-hover, drop-shadow(0 1.5px 2px rgba(20, 20, 20, 0.12)) drop-shadow(0 0 4px var(--accent-glow, rgba(190, 150, 90, 0.55))))';

/**
 * Drift detection — fragile substring match on `meta.subtitle`. Mirrors V1
 * behaviour (TD-096) so the V1↔V2 dispatch swap stays semantically identical
 * across the feature-flag boundary.
 */
function isDriftBar(payload: BarChartPayload): boolean {
  return Boolean(payload.meta.subtitle?.toLowerCase().includes('drift'));
}

/** Cap corner radius so no rect rounds past geometric feasibility. */
function effectiveCornerRadius(barWidth: number, barHeight: number): number {
  const safeMin = Math.max(0, Math.min(barWidth, barHeight));
  return Math.min(BAR_CORNER_RADIUS, safeMin / 2);
}

interface ResolvedBar {
  readonly key: string;
  readonly index: number;
  readonly slot: 1 | 4;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export function BarChartV2({
  payload,
  height = DEFAULT_HEIGHT,
  className,
}: BarChartV2Props) {
  const idScope = useId().replace(/[^a-z0-9]/gi, '');
  const themeMode = useThemeMode();
  const prefersReducedMotion = useReducedMotion();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIdx(next), []);

  const isHorizontal = payload.orientation === 'horizontal';

  const fmtValue = useCallback(
    (n: number) => formatValue(n, payload.yAxis.format, payload.yAxis.currency),
    [payload.yAxis.format, payload.yAxis.currency],
  );
  const fmtCategory = useCallback(
    (v: string | number) => formatXAxis(v, payload.xAxis.format),
    [payload.xAxis.format],
  );

  const svgWidth = DEFAULT_WIDTH;
  const innerWidth = svgWidth - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const categoryDomain = useMemo(
    () => payload.data.map((d) => String(d.x)),
    [payload.data],
  );

  // Value extent — pad zero into the domain so the reference line / sign-
  // colour split has a stable origin. Equal-min-max guard avoids a zero-domain
  // crash on flat-line payloads.
  const valueExtent = useMemo<[number, number]>(() => {
    if (payload.data.length === 0) return [0, 1];
    const ys = payload.data.map((d) => d.y);
    const min = Math.min(...ys, 0);
    const max = Math.max(...ys, 0);
    if (min === max) return [min, min + 1];
    return [min, max];
  }, [payload.data]);

  const categoryScale = useMemo(
    () =>
      bandScale({
        domain: categoryDomain,
        range: isHorizontal ? [0, innerHeight] : [0, innerWidth],
        padding: BAR_PADDING,
      }),
    [categoryDomain, isHorizontal, innerHeight, innerWidth],
  );

  const valueScale = useMemo(
    () =>
      linearScale({
        domain: valueExtent,
        range: isHorizontal ? [0, innerWidth] : [innerHeight, 0],
      }),
    [valueExtent, isHorizontal, innerWidth, innerHeight],
  );

  const usedSlots: ReadonlyArray<1 | 4> = payload.colorBySign ? [1, 4] : [1];

  // Pre-compute bar geometry. Vertical: x=catPos, y=min(zero,value),
  // height=|value-zero|. Horizontal: y=catPos, x=min(zero,value),
  // width=|value-zero|. Width/height of the band-perpendicular axis is
  // `categoryScale.bandwidth()` (METHOD call — see scale.ts).
  const bars = useMemo<readonly ResolvedBar[]>(() => {
    const bw = categoryScale.bandwidth();
    return payload.data.map<ResolvedBar>((d, i) => {
      const slot: 1 | 4 = payload.colorBySign && d.y < 0 ? 4 : 1;
      const catPos = categoryScale.toPixel(String(d.x));
      const valuePosZero = valueScale.toPixel(0);
      const valuePosY = valueScale.toPixel(d.y);

      if (isHorizontal) {
        return {
          key: String(d.x),
          index: i,
          slot,
          x: Math.min(valuePosZero, valuePosY),
          y: catPos,
          width: Math.abs(valuePosY - valuePosZero),
          height: bw,
        };
      }
      return {
        key: String(d.x),
        index: i,
        slot,
        x: catPos,
        y: Math.min(valuePosZero, valuePosY),
        width: bw,
        height: Math.abs(valuePosY - valuePosZero),
      };
    });
  }, [payload.data, payload.colorBySign, categoryScale, valueScale, isHorizontal]);

  // Gridline positions — perpendicular to the value axis. We compute pixel
  // positions by mapping `valueScale.ticks()` through `toPixel` (Scale<number>
  // — `ticks(count)` returns `readonly number[]` here, no narrowing needed).
  const gridPositions = useMemo<readonly number[]>(() => {
    const numericTicks = valueScale.ticks(TICK_COUNT) as readonly number[];
    return numericTicks.map((v) => valueScale.toPixel(v));
  }, [valueScale]);

  // Axis ticks — caller is responsible for label formatting per Axis.tsx
  // contract. Category axis preserves payload order; value axis uses the same
  // tick set as the gridlines for visual alignment.
  const categoryTicks = useMemo(
    () => categoryDomain.map((c) => ({ value: c, label: String(fmtCategory(c)) })),
    [categoryDomain, fmtCategory],
  );

  const valueTicks = useMemo(() => {
    const numericTicks = valueScale.ticks(TICK_COUNT) as readonly number[];
    return numericTicks.map((v) => ({ value: v, label: fmtValue(v) }));
  }, [valueScale, fmtValue]);

  const referencePosition = valueScale.toPixel(0);

  return (
    <ChartFrame
      payload={payload}
      width={svgWidth}
      height={height}
      testId="chart-bar"
      className={className}
      keyboardNav={{ dataLength: payload.data.length, onIndexChange }}
    >
      <div
        data-chart-backend="primitives"
        data-active-index={activeIdx ?? undefined}
        style={{ width: '100%', height: '100%' }}
      >
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${svgWidth} ${height}`}
          aria-hidden="true"
          focusable="false"
          style={{ overflow: 'visible' }}
        >
          <EditorialBevelFilter id={`bar-bevel-${idScope}`} theme={themeMode} />
          <defs>
            {usedSlots.map((slot) => (
              <linearGradient
                key={slot}
                id={`bar-grad-${slot}-${idScope}`}
                x1="0"
                y1="0"
                x2={isHorizontal ? '1' : '0'}
                y2={isHorizontal ? '0' : '1'}
              >
                <stop
                  offset="0%"
                  stopColor={`var(--chart-categorical-${slot}-top)`}
                />
                <stop
                  offset="100%"
                  stopColor={`var(--chart-categorical-${slot}-bottom)`}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianFrame width={svgWidth} height={height} margin={MARGIN}>
            {() => (
              <>
                <GridLines
                  orientation={isHorizontal ? 'vertical' : 'horizontal'}
                  positions={gridPositions}
                  length={isHorizontal ? innerHeight : innerWidth}
                />
                <g filter={`url(#bar-bevel-${idScope})`}>
                  {bars.map((b) => {
                    const isHovered =
                      hoverIdx === b.index || activeIdx === b.index;
                    const minDim = Math.min(b.width, b.height);
                    const r = effectiveCornerRadius(b.width, b.height);
                    return (
                      <BarRect
                        key={b.key}
                        index={b.index}
                        slot={b.slot}
                        x={b.x}
                        y={b.y}
                        width={b.width}
                        height={b.height}
                        cornerRadius={r}
                        idScope={idScope}
                        hovered={isHovered}
                        minDim={minDim}
                        prefersReducedMotion={prefersReducedMotion}
                        onMouseEnter={() => setHoverIdx(b.index)}
                        onMouseLeave={() => setHoverIdx(null)}
                        onFocus={() => setActiveIdx(b.index)}
                      />
                    );
                  })}
                </g>
                {payload.referenceLine ? (
                  <ReferenceLine
                    orientation={isHorizontal ? 'vertical' : 'horizontal'}
                    position={referencePosition}
                    innerWidth={innerWidth}
                    innerHeight={innerHeight}
                    label={
                      payload.referenceLine.label
                        ? { text: payload.referenceLine.label, align: 'end' }
                        : undefined
                    }
                  />
                ) : null}
                <Axis
                  orientation={isHorizontal ? 'left' : 'bottom'}
                  scale={categoryScale}
                  innerWidth={innerWidth}
                  innerHeight={innerHeight}
                  transform={
                    isHorizontal ? undefined : `translate(0,${innerHeight})`
                  }
                  ticks={categoryTicks}
                />
                <Axis
                  orientation={isHorizontal ? 'bottom' : 'left'}
                  scale={valueScale}
                  innerWidth={innerWidth}
                  innerHeight={innerHeight}
                  hideBaseline
                  transform={
                    isHorizontal ? `translate(0,${innerHeight})` : undefined
                  }
                  ticks={valueTicks}
                />
              </>
            )}
          </CartesianFrame>
        </svg>
        {isDriftBar(payload) ? <DriftCaption /> : null}
      </div>
    </ChartFrame>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* BarRect — single bar with hover scale + paper-press shadow              */
/* ────────────────────────────────────────────────────────────────────── */

interface BarRectProps {
  index: number;
  slot: 1 | 4;
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius: number;
  idScope: string;
  hovered: boolean;
  minDim: number;
  prefersReducedMotion: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
}

function BarRect({
  index,
  slot,
  x,
  y,
  width,
  height,
  cornerRadius,
  idScope,
  hovered,
  minDim,
  prefersReducedMotion,
  onMouseEnter,
  onMouseLeave,
  onFocus,
}: BarRectProps) {
  const { scale, enabled: scaleEnabled } = useHoverScale(minDim);
  const hoverTransform =
    hovered && scaleEnabled && scale > 1 ? `scale(${scale})` : undefined;
  const transition = prefersReducedMotion
    ? undefined
    : `transform ${CHART_ANIMATION_MS}ms ease-out, filter ${CHART_ANIMATION_MS}ms ease-out`;

  const style: CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transform: hoverTransform,
    filter: hovered ? HOVER_SHADOW : undefined,
    transition,
    cursor: 'pointer',
  };

  return (
    <rect
      data-testid="chart-bar-rect"
      data-bar-index={index}
      data-bar-slot={slot}
      data-active={hovered || undefined}
      x={x}
      y={y}
      width={width}
      height={height}
      rx={cornerRadius}
      ry={cornerRadius}
      fill={`url(#bar-grad-${slot}-${idScope})`}
      stroke="var(--card, #FFFFFF)"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* DriftCaption — paper-press block beneath the chart                      */
/* ────────────────────────────────────────────────────────────────────── */

const DRIFT_CAPTION_HEADER_STYLE: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: 10,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontVariantCaps: 'small-caps',
  color: 'var(--color-text-secondary)',
  marginBottom: 4,
};

const DRIFT_CAPTION_DIVIDER_STYLE: CSSProperties = {
  marginTop: 12,
  paddingTop: 12,
  borderTop: '1px solid var(--ink-shadow-soft, rgba(20, 20, 20, 0.18))',
  boxShadow: 'inset 0 1px 0 var(--card-highlight, rgba(255, 255, 255, 0.55))',
};

function DriftCaption() {
  return (
    <div
      data-testid="chart-bar-drift-caption"
      style={DRIFT_CAPTION_DIVIDER_STYLE}
    >
      <div style={DRIFT_CAPTION_HEADER_STYLE}>Drift</div>
      <p
        style={{
          fontSize: 12,
          lineHeight: 1.5,
          color: 'var(--color-text-secondary)',
        }}
      >
        {DRIFT_CAPTION_TEXT}
      </p>
    </div>
  );
}

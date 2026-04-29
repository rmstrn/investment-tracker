'use client';

/**
 * SparklineV2 — pure custom-primitives port of `<Sparkline>`.
 *
 * Phase β.1.2 of the chart-primitives migration. Behind feature flag
 * `NEXT_PUBLIC_PROVEDO_CHART_BACKEND=primitives`. When the flag flips, the
 * barrel `@investment-tracker/ui/charts#Sparkline` resolves to this file.
 *
 * Per aggregate decisions (R2 2026-04-29):
 *   - decision #2 «hybrid declarative + imperative» — caller composes JSX
 *     with `<LinePath>` from primitives/svg
 *   - decision #3 «no framer-motion» — animation via `useStrokeDashoffset`
 *   - plugin-architect Pattern 7 «Sparkline = intentionally aliased
 *     (60×20 viewBox stretched). Stretch IS the aesthetic. Don't
 *     vector-correct.» — we render with `preserveAspectRatio="none"`.
 *
 * No axes, no tooltip, no legend, no gridlines. Single-series only.
 * Schema-restricted to a single time series with 2..120 points. Same
 * `standalone` opt-in as V1: default is non-focusable + aria-hidden; opt-in
 * adds `<ChartFrame>`-style a11y baseline.
 */

import type { SparklinePayload } from '@investment-tracker/shared-types/charts';
import { useId } from 'react';
import { ChartDataTable } from './_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { useReducedMotion } from './_shared/useReducedMotion';
import { LinePath } from './primitives/svg/LinePath';
import { CHART_ANIMATION_MS, SERIES_VARS } from './tokens';

/* ────────────────────────────────────────────────────────────────────── */
/* Constants — Pattern 7 sizes                                             */
/* ────────────────────────────────────────────────────────────────────── */

/** Internal SVG canvas — stretch IS the aesthetic. */
const SPARK_VIEWBOX_W = 60;
const SPARK_VIEWBOX_H = 20;
const SPARK_PAD = 1.5; // half-stroke clearance — avoids clipping the round-cap.

export interface SparklineV2Props {
  payload: SparklinePayload;
  height?: number;
  width?: number;
  className?: string;
  /**
   * Opt-in to focusable + arrow-key nav when the sparkline is the primary
   * data surface (no adjacent number). Defaults to `false` per CHARTS_SPEC
   * §4.5: SVG is aria-hidden and not in the tab order.
   */
  standalone?: boolean;
}

/* ────────────────────────────────────────────────────────────────────── */
/* Component                                                               */
/* ────────────────────────────────────────────────────────────────────── */

export function SparklineV2({
  payload,
  height = 32,
  width,
  className,
  standalone = false,
}: SparklineV2Props) {
  const dataTableId = useId();
  const prefersReducedMotion = useReducedMotion();

  const { data } = payload;
  const last = data[data.length - 1]?.y ?? 0;
  const first = data[0]?.y ?? 0;

  // Trend: payload.trend takes precedence; fall back to last/first sign.
  const trend =
    payload.trend ??
    (Math.abs((last / first || 1) - 1) < 0.005 ? 'flat' : last >= first ? 'up' : 'down');

  const stroke =
    trend === 'down' ? SERIES_VARS[1] : trend === 'flat' ? SERIES_VARS[4] : SERIES_VARS[0];

  // Pre-scaled points in the 60×20 viewBox. Per Pattern 7, we DO NOT
  // vector-correct; preserveAspectRatio="none" stretches arbitrarily on the
  // host element and that aliasing is the intended aesthetic.
  const points = projectToViewBox(data);

  const ariaLabel = payload.meta.alt ?? `${payload.meta.title} sparkline (${trend})`;
  const hostA11yProps = standalone
    ? {
        role: 'img' as const,
        'aria-label': ariaLabel,
        'aria-describedby': dataTableId,
        tabIndex: 0,
      }
    : {
        'aria-hidden': true as const,
      };

  return (
    <div
      // biome-ignore lint/a11y/noNoninteractiveTabindex: standalone sparkline opts into keyboard focus per CHARTS_SPEC §4.5 exception.
      {...hostA11yProps}
      data-testid="chart-sparkline"
      data-chart-backend="primitives"
      data-trend={trend}
      className={
        standalone
          ? `${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`
          : (className ?? undefined)
      }
      style={{ width: width ?? '100%', height, display: 'inline-block', lineHeight: 0 }}
    >
      <svg
        // Stretch the 60×20 viewBox to fit the host. Plugin-architect Pattern 7
        // — «intentionally aliased» — the slight horizontal squeeze on wide
        // hosts is the look we want.
        viewBox={`0 0 ${SPARK_VIEWBOX_W} ${SPARK_VIEWBOX_H}`}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        // Sparkline is purely decorative when not standalone — host owns
        // a11y. role/aria-label suppressed inside the svg.
        aria-hidden="true"
        focusable="false"
      >
        {payload.filled ? (
          <SparklineFill
            points={points}
            colorVar={stroke}
            reduced={prefersReducedMotion}
            durationMs={CHART_ANIMATION_MS}
          />
        ) : null}
        <LinePath
          points={points}
          colorVar={stroke}
          strokeWidth={1.5}
          curve="monotone-x"
          animateOnMount={!prefersReducedMotion}
          reducedMotion={prefersReducedMotion}
          animationDurationMs={CHART_ANIMATION_MS}
        />
      </svg>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

interface XYPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Project payload points into the 60×20 sparkline viewBox.
 *
 * X is index-spaced (TimePoint.x is a string ISO date in our contract — we
 * use the array index for monotonic spacing; the tiny aliasing this
 * introduces is welcome per Pattern 7).
 * Y is min-max normalized into `[SPARK_PAD, SPARK_VIEWBOX_H - SPARK_PAD]`.
 */
function projectToViewBox(data: SparklinePayload['data']): readonly XYPoint[] {
  if (data.length === 0) return [];
  const ys = data.map((d) => d.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const range = maxY - minY || 1; // guard flat-line div-by-zero.

  const usableW = SPARK_VIEWBOX_W - SPARK_PAD * 2;
  const usableH = SPARK_VIEWBOX_H - SPARK_PAD * 2;
  const xStep = data.length > 1 ? usableW / (data.length - 1) : 0;

  return data.map((d, i) => ({
    x: SPARK_PAD + i * xStep,
    // Invert: payload Y up = visual Y small (SVG y-axis points down).
    y: SPARK_PAD + usableH - ((d.y - minY) / range) * usableH,
  }));
}

/* ────────────────────────────────────────────────────────────────────── */
/* SparklineFill — filled-area variant for `payload.filled === true`        */
/* ────────────────────────────────────────────────────────────────────── */

interface SparklineFillProps {
  points: readonly XYPoint[];
  colorVar: string;
  reduced: boolean;
  durationMs: number;
}

/**
 * Filled gradient under the line for `payload.filled === true`. Single-series
 * sparkline doesn't justify a full `<AreaGradientDef>` lifecycle — we use a
 * scoped `<linearGradient>` with `useId()` to avoid clashes between multiple
 * sparklines on the same page.
 */
function SparklineFill({ points, colorVar, reduced, durationMs }: SparklineFillProps) {
  const gradientId = useId();
  if (points.length === 0) return null;

  // Build closed area: line through points + return-to-baseline + close.
  const top = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');
  const baseY = SPARK_VIEWBOX_H - SPARK_PAD;
  const lastX = points[points.length - 1]?.x ?? SPARK_VIEWBOX_W - SPARK_PAD;
  const firstX = points[0]?.x ?? SPARK_PAD;
  const d = `${top} L${lastX.toFixed(2)},${baseY.toFixed(2)} L${firstX.toFixed(2)},${baseY.toFixed(2)} Z`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorVar} stopOpacity={0.32} />
          <stop offset="100%" stopColor={colorVar} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill={`url(#${gradientId})`}
        // Sparkline fade-in: opacity tween via CSS — calmer than draw-in.
        // Reduced motion → instant.
        style={
          reduced
            ? undefined
            : {
                animation: `sparkline-fade ${durationMs}ms ease-out both`,
              }
        }
      />
      {/* Inline keyframes — scoped per-mount via useId in animation name not
          required; the `both` fill-mode + same-origin animation is idempotent
          across multiple sparklines. */}
      <style>{`@keyframes sparkline-fade { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </>
  );
}

'use client';

/**
 * Waterfall — composed bar chart with floating-baseline geometry (T2 lazy).
 *
 * Reads `WaterfallPayload` from `@investment-tracker/shared-types/charts`.
 * Conservation invariant `startValue + Σ non-anchor deltas === endValue`
 * is enforced at the envelope level (architect Δ2 — block-merge severity);
 * renderer just renders.
 *
 * The mandatory descriptive caption per CHARTS_SPEC §4.11 + finance audit
 * C6 is BAKED — not driven by payload — so Lane-A wording stays stable.
 *
 * Helper `computeWaterfallSteps` is exported as a named export so QA can
 * unit-test the floating-baseline math separately.
 */

import type { WaterfallPayload, WaterfallStep } from '@investment-tracker/shared-types/charts';
import { useCallback, useId, useRef, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartDataTable } from './_shared/ChartDataTable';
import { CHART_FOCUS_RING_CLASS } from './_shared/a11y';
import { buildTooltipProps } from './_shared/buildTooltipProps';
import { formatValue } from './_shared/formatters';
import { useChartKeyboardNav } from './_shared/useChartKeyboardNav';
import { useReducedMotion } from './_shared/useReducedMotion';
import { CHART_ANIMATION_MS, CHART_TOKENS, SERIES_VARS } from './tokens';

export interface WaterfallProps {
  payload: WaterfallPayload;
  height?: number;
  className?: string;
}

export interface WaterfallVisualStep {
  key: string;
  label: string;
  componentType: WaterfallStep['componentType'];
  /** Bar floor value (lower edge). */
  base: number;
  /** Absolute bar height (visual span). */
  span: number;
  /** Original signed delta for tooltip. */
  delta: number;
  isAnchor: boolean;
}

/**
 * Floating-baseline waterfall transform.
 *
 * Per PO feedback (2026-04-29): anchors no longer span [0, value] — that
 * made them dominate the chart and crush the flow bars. Anchor `base` is
 * left at the start/end value with `span=0`; the renderer paints anchors
 * via a dedicated `<ReferenceLine>`-style marker (`anchorMarker` field)
 * rather than as a stacked-bar segment. Flow steps keep the floating-
 * baseline geometry: `base` = lower edge, `span` = absolute delta.
 *
 * `anchorMarker` carries the y-value where the marker should sit so the
 * renderer can drop a thicker bar / reference dot at the correct height
 * within the constrained y-domain.
 */
export function computeWaterfallSteps(payload: WaterfallPayload): WaterfallVisualStep[] {
  const result: WaterfallVisualStep[] = [];
  let running = payload.startValue;

  for (const step of payload.steps) {
    if (step.componentType === 'start') {
      result.push({
        key: step.key,
        label: step.label,
        componentType: 'start',
        // Anchor as a small marker bar at running balance — span=0 so the
        // stacked-bar invisible-base trick yields nothing here; the renderer
        // paints anchors via a dedicated tall thin column overlay below.
        base: payload.startValue,
        span: 0,
        delta: payload.startValue,
        isAnchor: true,
      });
      continue;
    }
    if (step.componentType === 'end') {
      result.push({
        key: step.key,
        label: step.label,
        componentType: 'end',
        base: payload.endValue,
        span: 0,
        delta: payload.endValue,
        isAnchor: true,
      });
      continue;
    }

    const next = running + step.deltaAbs;
    const base = step.deltaAbs >= 0 ? running : next;
    const span = Math.abs(step.deltaAbs);
    result.push({
      key: step.key,
      label: step.label,
      componentType: step.componentType,
      base,
      span,
      delta: step.deltaAbs,
      isAnchor: false,
    });
    running = next;
  }

  return result;
}

const WATERFALL_CAPTION =
  'Decomposes change in portfolio value into mechanical components: cash you added, gains your positions made, dividends and interest received, FX effects. Does not predict future contributions.';

function colorForStep(step: WaterfallVisualStep): string {
  // Anchors use ink (series-3); flow bars use jade for positive, terra for
  // negative. Visual distinction comes from the per-cell `fillOpacity`
  // computed below — anchors render at 0.78 so the ink reads as «column /
  // pillar», flow bars at 1.0 so the deltas pop against the cream paper.
  if (step.isAnchor) return SERIES_VARS[2];
  if (step.delta >= 0) return SERIES_VARS[0];
  return SERIES_VARS[1];
}

/**
 * Compute visible y-domain for the waterfall.
 *
 * PO feedback (2026-04-29): start + end anchors at full value (220K + 243K)
 * dominated the chart and crushed the flow bars (10K, -2K, …) into 1-3px
 * slivers. Tighten the y-domain to `[min(running)*0.95, max(running)*1.02]`
 * — the running balance sweeps a much narrower range than [0, max], so the
 * floating-baseline flow bars get proportionally more screen real estate
 * while the anchors remain readable as full-column markers from the
 * baseline of the visible window.
 *
 * Mirrors the static reference (apps/web/public/design-system.html §charts)
 * which uses a constrained visual range: anchors do NOT start at 0, they
 * start at the bottom of the visible plot area.
 */
function computeWaterfallDomain(payload: WaterfallPayload): [number, number] {
  let running = payload.startValue;
  const visited = [payload.startValue, payload.endValue];
  for (const step of payload.steps) {
    if (step.componentType === 'start' || step.componentType === 'end') continue;
    running += step.deltaAbs;
    visited.push(running);
  }
  const lo = Math.min(...visited);
  const hi = Math.max(...visited);
  const span = hi - lo;
  // Anchor with 5% headroom below + 2% above so anchors don't touch chart edges.
  return [Math.floor(lo - span * 0.08), Math.ceil(hi + span * 0.05)];
}

export function Waterfall({ payload, height = 300, className }: WaterfallProps) {
  const dataTableId = useId();
  const tooltip = buildTooltipProps();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const onIndexChange = useCallback((next: number) => setActiveIndex(next), []);
  useChartKeyboardNav(containerRef, payload.steps.length, onIndexChange);

  const fmtValue = (n: number) => formatValue(n, 'currency-compact', payload.currency);
  const visual = computeWaterfallSteps(payload);
  const [domainLo, domainHi] = computeWaterfallDomain(payload);

  // Recharts stacked-bar trick: a transparent «base» bar lifts the visible
  // «span» bar to its floating baseline. Per PO feedback (2026-04-29) anchors
  // no longer use this trick — they get a dedicated `anchor` field that
  // spans [domainLo, anchorValue] in a separate <Bar> stack so they render
  // as full-column ink markers without stacking inside the flow band.
  //
  // Per data-point fields:
  //   - `base`        : floating baseline lift for flow bars (transparent)
  //   - `span`        : visible flow delta (jade / terra)
  //   - `anchorBase`  : domainLo lift for anchor columns (transparent)
  //   - `anchorSpan`  : anchorValue - domainLo (visible ink column)
  //   - `connectorY`  : y-coord of running-balance line at this step
  //
  // Anchors and flows live in the same chart but stack independently; the
  // invisible base in each stack does the lifting.
  let runningBal = payload.startValue;
  const data = visual.map((s, i) => {
    let connectorY: number | null = null;
    if (s.isAnchor && s.componentType === 'start') {
      connectorY = payload.startValue;
      runningBal = payload.startValue;
    } else if (s.isAnchor && s.componentType === 'end') {
      connectorY = payload.endValue;
    } else {
      // For flow steps, connector lives at the START of the bar (running
      // balance before this step's delta is applied).
      connectorY = runningBal;
      runningBal = runningBal + s.delta;
    }
    void i;
    return {
      label: s.label,
      base: s.isAnchor ? 0 : s.base,
      span: s.isAnchor ? 0 : s.span,
      anchorBase: s.isAnchor ? domainLo : 0,
      anchorSpan: s.isAnchor ? s.delta - domainLo : 0,
      delta: s.delta,
      isAnchor: s.isAnchor,
      componentType: s.componentType,
      connectorY,
    };
  });

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={payload.meta.alt ?? payload.meta.title}
      aria-describedby={dataTableId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: chart container needs keyboard focus for arrow-key navigation per CHARTS_SPEC §7.4 a11y baseline.
      tabIndex={0}
      data-testid="chart-waterfall"
      data-active-index={activeIndex ?? undefined}
      className={`${CHART_FOCUS_RING_CLASS}${className ? ` ${className}` : ''}`}
      style={{ width: '100%' }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_TOKENS.gridLine} strokeDasharray="2 4" />
          <XAxis
            dataKey="label"
            tick={{ fill: CHART_TOKENS.axisLabel, fontSize: 10 }}
            stroke={CHART_TOKENS.gridLine}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: CHART_TOKENS.axisLabel, fontSize: 11 }}
            stroke={CHART_TOKENS.gridLine}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => fmtValue(Number(v))}
            // Constrained domain (PO feedback 2026-04-29): anchors no longer
            // span [0, value] which would crush flow bars. Domain spans
            // [min(running)*0.92, max(running)*1.05] so flow deltas get
            // proportionally more screen real estate while anchors remain
            // readable as full-column markers from the visible baseline.
            domain={[domainLo, domainHi]}
            width={68}
            tickMargin={4}
          />
          <Tooltip
            contentStyle={tooltip.contentStyle}
            labelStyle={tooltip.labelStyle}
            itemStyle={tooltip.itemStyle}
            cursor={{ fill: 'var(--chart-grid)' }}
            separator={tooltip.separator}
            formatter={(value, _name, item) => {
              const dataItem = item?.payload as { delta?: number } | undefined;
              const v = typeof dataItem?.delta === 'number' ? dataItem.delta : Number(value);
              return fmtValue(v);
            }}
          />
          {/* Anchor stack: invisible base lifts ink columns from domainLo. */}
          <Bar dataKey="anchorBase" stackId="anchor" fill="transparent" isAnimationActive={false} />
          <Bar
            dataKey="anchorSpan"
            stackId="anchor"
            isAnimationActive={!prefersReducedMotion}
            animationDuration={CHART_ANIMATION_MS}
            // Anchors render as a slim ink pillar — narrower than flow bars so
            // they read as «column markers» rather than competing flow steps.
            // `barSize` 28 (vs ~auto for flows) gives the visual hierarchy.
            barSize={28}
            radius={[6, 6, 0, 0]}
            fill={SERIES_VARS[2]}
            fillOpacity={0.78}
          >
            {visual.map((s) => (
              <Cell
                key={`anchor-${s.key}`}
                fill={s.isAnchor ? SERIES_VARS[2] : 'transparent'}
                fillOpacity={s.isAnchor ? 0.78 : 0}
              />
            ))}
          </Bar>
          {/* Flow stack: invisible base lifts visible span to floating baseline. */}
          <Bar dataKey="base" stackId="wf" fill="transparent" isAnimationActive={false} />
          <Bar
            dataKey="span"
            stackId="wf"
            isAnimationActive={!prefersReducedMotion}
            animationDuration={CHART_ANIMATION_MS}
            radius={6}
          >
            {visual.map((s) => (
              <Cell key={s.key} fill={colorForStep(s)} />
            ))}
          </Bar>
          {/* Connector dashed line — traces running balance through every step.
              Per PO feedback (2026-04-29): without connectors, the eye has
              nothing to follow between flow bars + anchors. The line is the
              same dotted-3-5 weight as gridlines so it reads as «structural
              guide» rather than a competing data series. */}
          <Line
            type="stepAfter"
            dataKey="connectorY"
            stroke={CHART_TOKENS.gridLineStrong}
            strokeDasharray="3 5"
            strokeWidth={1.25}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p data-testid="chart-waterfall-caption" className="mt-3 text-xs text-text-secondary">
        {WATERFALL_CAPTION}
      </p>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}

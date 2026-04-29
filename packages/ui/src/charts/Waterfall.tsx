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
 * Anchor bars (`start` / `end`) sit on zero with full height = absolute
 * value. Non-anchor steps float between the running balance before and
 * after their delta. Negative deltas float DOWN from the prior balance.
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
        base: 0,
        span: payload.startValue,
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
        base: 0,
        span: payload.endValue,
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
  if (step.isAnchor) return SERIES_VARS[2];
  if (step.delta >= 0) return SERIES_VARS[0];
  return SERIES_VARS[1];
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

  // Recharts stacked-bar trick: a transparent "base" bar lifts the visible
  // "span" bar to its floating baseline. Anchors put base=0 and span=value
  // so they read full-height.
  const data = visual.map((s) => ({
    label: s.label,
    base: s.base,
    span: s.span,
    delta: s.delta,
    isAnchor: s.isAnchor,
    componentType: s.componentType,
  }));

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
            width={64}
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
          {/* Invisible base lifts the visible span to its floating baseline. */}
          <Bar dataKey="base" stackId="wf" fill="transparent" isAnimationActive={false} />
          <Bar
            dataKey="span"
            stackId="wf"
            isAnimationActive={!prefersReducedMotion}
            animationDuration={CHART_ANIMATION_MS}
            radius={2}
          >
            {visual.map((s) => (
              <Cell key={s.key} fill={colorForStep(s)} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      <p data-testid="chart-waterfall-caption" className="mt-3 text-xs text-text-secondary">
        {WATERFALL_CAPTION}
      </p>
      <ChartDataTable payload={payload} id={dataTableId} />
    </div>
  );
}

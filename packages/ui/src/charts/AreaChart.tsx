'use client';

import {
  Area,
  CartesianGrid,
  AreaChart as ReAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_ANIMATION_MS, CHART_COLORS } from './tokens';

export interface AreaChartDatum {
  x: string | number;
  y: number;
}

export interface AreaChartProps {
  data: ReadonlyArray<AreaChartDatum>;
  height?: number;
  formatValue?: (n: number) => string;
  formatTick?: (v: string | number) => string;
  /** Show X axis ticks. Default false (mini sparkline mode). */
  showXAxis?: boolean;
  /** Show Y axis ticks. Default false. */
  showYAxis?: boolean;
  /** Disable draw-in animation. */
  animate?: boolean;
  'aria-label'?: string;
}

/**
 * AreaChart — smooth-curve line with a violet gradient fill. Brief §6.5.
 * Defaults produce a 120px sparkline; pass axis flags for detail views.
 */
export function AreaChart({
  data,
  height = 120,
  formatValue,
  formatTick,
  showXAxis = false,
  showYAxis = false,
  animate = true,
  'aria-label': ariaLabel,
}: AreaChartProps) {
  const fmt = formatValue ?? ((n) => n.toLocaleString());
  const gradientId = CHART_COLORS.areaFillId;
  return (
    <div role="img" aria-label={ariaLabel ?? 'Area chart'} className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReAreaChart data={[...data]} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.areaStroke} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.areaStroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showXAxis || showYAxis ? (
            <CartesianGrid vertical={false} stroke={CHART_COLORS.gridLine} strokeDasharray="0" />
          ) : null}
          {showXAxis ? (
            <XAxis
              dataKey="x"
              tick={{ fill: CHART_COLORS.axisLabel, fontSize: 11 }}
              stroke={CHART_COLORS.gridLine}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatTick ? (v) => formatTick(v) : undefined}
              minTickGap={24}
            />
          ) : null}
          {showYAxis ? (
            <YAxis
              tick={{ fill: CHART_COLORS.axisLabel, fontSize: 11 }}
              stroke={CHART_COLORS.gridLine}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => fmt(Number(v))}
              width={52}
            />
          ) : null}
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.tooltipBg,
              border: `1px solid ${CHART_COLORS.tooltipBorder}`,
              borderRadius: 12,
              fontSize: 12,
              boxShadow: 'var(--shadow-md)',
              padding: '8px 12px',
            }}
            labelStyle={{ color: CHART_COLORS.axisLabel, fontSize: 11, marginBottom: 2 }}
            itemStyle={{ color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}
            formatter={(v) => fmt(Number(v))}
            cursor={{ stroke: CHART_COLORS.gridLine, strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke={CHART_COLORS.areaStroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={animate}
            animationDuration={CHART_ANIMATION_MS}
            animationEasing="ease-out"
          />
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

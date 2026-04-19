'use client';

import {
  Bar,
  CartesianGrid,
  Cell,
  BarChart as ReBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_ANIMATION_MS, CHART_COLORS } from './tokens';

export interface BarChartDatum {
  x: string | number;
  y: number;
}

export interface BarChartProps {
  data: ReadonlyArray<BarChartDatum>;
  height?: number;
  formatValue?: (n: number) => string;
  formatTick?: (v: string | number) => string;
  /** Color bars by sign: positive=gain, negative=loss. */
  colorBySign?: boolean;
  animate?: boolean;
  'aria-label'?: string;
}

/**
 * BarChart — transactions-by-month, sector breakdown. Brief §6.5.
 */
export function BarChart({
  data,
  height = 180,
  formatValue,
  formatTick,
  colorBySign,
  animate = true,
  'aria-label': ariaLabel,
}: BarChartProps) {
  const fmt = formatValue ?? ((n) => n.toLocaleString());
  return (
    <div role="img" aria-label={ariaLabel ?? 'Bar chart'} className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={[...data]} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.gridLine} />
          <XAxis
            dataKey="x"
            tick={{ fill: CHART_COLORS.axisLabel, fontSize: 11 }}
            stroke={CHART_COLORS.gridLine}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatTick ? (v) => formatTick(v) : undefined}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.axisLabel, fontSize: 11 }}
            stroke={CHART_COLORS.gridLine}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => fmt(Number(v))}
            width={52}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-background-secondary)' }}
            contentStyle={{
              background: CHART_COLORS.tooltipBg,
              border: `1px solid ${CHART_COLORS.tooltipBorder}`,
              borderRadius: 12,
              fontSize: 12,
              boxShadow: 'var(--shadow-md)',
              padding: '8px 12px',
            }}
            labelStyle={{ color: CHART_COLORS.axisLabel, fontSize: 11 }}
            itemStyle={{ color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}
            formatter={(v) => fmt(Number(v))}
          />
          <Bar
            dataKey="y"
            radius={[4, 4, 0, 0]}
            isAnimationActive={animate}
            animationDuration={CHART_ANIMATION_MS}
            fill={CHART_COLORS.areaStroke}
          >
            {colorBySign
              ? data.map((d, i) => (
                  <Cell key={i} fill={d.y >= 0 ? CHART_COLORS.gain : CHART_COLORS.loss} />
                ))
              : null}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

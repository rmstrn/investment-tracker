'use client';

import type { ReactNode } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_ANIMATION_MS, CHART_COLORS, SERIES_PALETTE } from './tokens';

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: ReadonlyArray<DonutSlice>;
  size?: number;
  /** Inner radius ratio of outer. Brief §6.5: 60%. */
  innerRatio?: number;
  centerLabel?: ReactNode;
  formatValue?: (n: number) => string;
  animate?: boolean;
  'aria-label'?: string;
}

/**
 * DonutChart — allocation donut. Brief §6.5. 2° padding, 60% inner radius.
 */
export function DonutChart({
  data,
  size = 200,
  innerRatio = 0.6,
  centerLabel,
  formatValue,
  animate = true,
  'aria-label': ariaLabel,
}: DonutChartProps) {
  const outerR = size / 2 - 4;
  const innerR = outerR * innerRatio;
  const fmt = formatValue ?? ((n) => n.toLocaleString());

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? 'Allocation donut'}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={[...data]}
            dataKey="value"
            nameKey="label"
            innerRadius={innerR}
            outerRadius={outerR}
            paddingAngle={2}
            strokeWidth={0}
            isAnimationActive={animate}
            animationDuration={CHART_ANIMATION_MS}
          >
            {data.map((d, i) => (
              <Cell key={d.key} fill={d.color ?? SERIES_PALETTE[i % SERIES_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
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
        </PieChart>
      </ResponsiveContainer>
      {centerLabel ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerLabel}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Per-kind loading skeleton (CHARTS_SPEC §3.10).
 *
 * Reuses the existing `<Skeleton>` shimmer primitive with shapes tuned to
 * each chart kind. Default `height` matches `<ResponsiveContainer>` defaults
 * from §3.1 unless caller overrides.
 */

import { Skeleton } from '../../primitives/Skeleton';
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

export function ChartSkeleton({ kind, height, className }: ChartSkeletonProps) {
  const h = height ?? DEFAULT_HEIGHT[kind];
  return (
    <div
      data-testid={`chart-skeleton-${kind}`}
      role="status"
      aria-label={`${kind} chart loading`}
      className={className}
      style={{ width: '100%', height: h }}
    >
      <Skeleton style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

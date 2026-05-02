'use client';

import { Card, SegmentedControl, Skeleton } from '@investment-tracker/ui';
import { type AreaChartPayload, AreaVisx } from '@investment-tracker/ui/charts';
import { useState } from 'react';
import { useMarketHistory } from '../../hooks/useMarketHistory';
import type { MarketHistoryResponse, Position } from '../../lib/api/positions';
import { type PeriodUi, mapPeriodUiToApi } from '../../lib/period';

const PERIOD_OPTIONS: ReadonlyArray<{ value: PeriodUi; label: string }> = [
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: 'All', label: 'All' },
];

const DEFAULT_PERIOD: PeriodUi = '1M';

export interface PositionPriceChartProps {
  position: Position;
}

export function PositionPriceChart({ position }: PositionPriceChartProps) {
  const [period, setPeriod] = useState<PeriodUi>(DEFAULT_PERIOD);
  const query = useMarketHistory({
    symbol: position.symbol,
    asset_type: position.asset_type,
    period: mapPeriodUiToApi(period),
  });

  return (
    <PositionPriceChartView
      symbol={position.symbol}
      period={period}
      onPeriodChange={setPeriod}
      data={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
    />
  );
}

export interface PositionPriceChartViewProps {
  symbol: string;
  period: PeriodUi;
  onPeriodChange: (period: PeriodUi) => void;
  data?: MarketHistoryResponse;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Pure presentation — separated from the TanStack Query bridge so smoke
 * tests can exercise render paths (loading, error, empty, chart) without a
 * QueryClient provider or Clerk session.
 */
export function PositionPriceChartView({
  symbol,
  period,
  onPeriodChange,
  data,
  isLoading,
  isError,
}: PositionPriceChartViewProps) {
  const points = (data?.points ?? []).map((p) => ({
    x: p.time,
    y: Number(p.close),
  }));

  const chartPayload: AreaChartPayload | null = data
    ? {
        kind: 'area',
        meta: {
          title: `${symbol} price`,
          subtitle: `Close prices · ${period}`,
          alt: `${symbol} price chart for ${period}`,
        },
        xAxis: { format: 'date-day', label: 'Date' },
        yAxis: { format: 'currency-compact', currency: data.currency, label: 'Close' },
        series: [{ key: 'y', label: 'Close' }],
        // MultiSeriesPoint uses `.catchall(z.number())` so its inferred type
        // tightens `[k: string]: number` and rejects literal `x: string`.
        // Runtime shape is correct; the cast is the established workaround
        // (matching `_shared/fixtures.ts` `asMultiSeries` helper in @ui/charts).
        data: points as unknown as AreaChartPayload['data'],
        stacked: false,
        interpolation: 'monotone',
      }
    : null;

  return (
    <Card variant="elevated">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-text-primary">Price history</div>
          <div className="text-xs text-text-tertiary">Close prices for {symbol}</div>
        </div>
        <SegmentedControl
          size="sm"
          options={PERIOD_OPTIONS}
          value={period}
          onChange={onPeriodChange}
          label="Select chart period"
        />
      </div>
      {isError ? (
        <div className="py-8 text-center text-sm text-state-negative-default">
          Unable to load price history.
        </div>
      ) : isLoading || !data ? (
        <output aria-busy="true" aria-label="Loading price history" className="block">
          <Skeleton className="h-60 w-full" />
        </output>
      ) : !chartPayload || points.length === 0 ? (
        <div className="py-8 text-center text-sm text-text-tertiary">
          No price data available for this range.
        </div>
      ) : (
        <AreaVisx payload={chartPayload} height={240} />
      )}
    </Card>
  );
}

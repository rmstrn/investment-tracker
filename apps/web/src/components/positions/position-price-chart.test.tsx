import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { MarketHistoryResponse } from '../../lib/api/positions';
import { PositionPriceChartView } from './position-price-chart';

function makeResponse(overrides: Partial<MarketHistoryResponse> = {}): MarketHistoryResponse {
  return {
    symbol: 'AAPL',
    asset_type: 'stock',
    currency: 'USD',
    interval: '1d',
    points: [
      {
        time: '2026-04-15T00:00:00Z',
        open: '150.00',
        high: '152.50',
        low: '149.00',
        close: '151.20',
        volume: '10000000',
      },
      {
        time: '2026-04-16T00:00:00Z',
        open: '151.20',
        high: '153.80',
        low: '150.90',
        close: '153.00',
        volume: '12500000',
      },
    ],
    ...overrides,
  };
}

describe('PositionPriceChartView', () => {
  it('renders a skeleton while loading', () => {
    render(
      <PositionPriceChartView
        symbol="AAPL"
        period="1M"
        onPeriodChange={vi.fn()}
        isLoading
        isError={false}
      />,
    );
    expect(screen.getByRole('status', { name: /loading price history/i })).toBeInTheDocument();
  });

  it('renders an error message on fetch failure', () => {
    render(
      <PositionPriceChartView
        symbol="AAPL"
        period="1M"
        onPeriodChange={vi.fn()}
        isLoading={false}
        isError
      />,
    );
    expect(screen.getByText(/unable to load price history/i)).toBeInTheDocument();
  });

  it('renders the chart surface when data is present', () => {
    render(
      <PositionPriceChartView
        symbol="AAPL"
        period="1M"
        onPeriodChange={vi.fn()}
        isLoading={false}
        isError={false}
        data={makeResponse()}
      />,
    );
    // `AreaChart` wraps content in a `role="img"` surface with the label we
    // pass through — this is an intentionally cheap check; deep Recharts
    // assertions are pointless in a smoke test.
    expect(screen.getByRole('img', { name: /aapl price chart for 1m/i })).toBeInTheDocument();
  });

  it('renders empty state when data has no points', () => {
    render(
      <PositionPriceChartView
        symbol="AAPL"
        period="1M"
        onPeriodChange={vi.fn()}
        isLoading={false}
        isError={false}
        data={makeResponse({ points: [] })}
      />,
    );
    expect(screen.getByText(/no price data available/i)).toBeInTheDocument();
  });
});

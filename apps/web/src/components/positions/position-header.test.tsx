import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Position } from '../../lib/api/positions';
import { PositionHeader } from './position-header';

function makePosition(overrides: Partial<Position> = {}): Position {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    account_id: '22222222-2222-2222-2222-222222222222',
    symbol: 'AAPL',
    asset_type: 'stock',
    quantity: '10',
    avg_cost: '150.00',
    currency: 'USD',
    values: {
      base: { currency: 'USD', total_value: '1800.00', total_cost: '1500.00' },
      display: {
        currency: 'USD',
        total_value: '1800.00',
        total_cost: '1500.00',
        fx_rate: '1',
        fx_date: '2026-04-20',
      },
    },
    pnl_absolute: { base: '300.00', display: '300.00' },
    pnl_percent: 0.2,
    last_calculated_at: '2026-04-20T12:00:00Z',
    ...overrides,
  };
}

describe('PositionHeader', () => {
  it('renders symbol, asset type and final value on initial mount (no count-up animation visible)', () => {
    render(<PositionHeader position={makePosition()} />);
    expect(screen.getByRole('heading', { name: 'AAPL' })).toBeInTheDocument();
    expect(screen.getByText('stock')).toBeInTheDocument();
    // CountUpNumber seeded with `from === value` so the first paint carries
    // the final formatted value — guard against regressions to `from = 0`.
    expect(screen.getByText('$1,800.00')).toBeInTheDocument();
  });

  it('renders positive P&L pill with both absolute and percent labels', () => {
    render(<PositionHeader position={makePosition()} />);
    expect(screen.getByText('+$300.00')).toBeInTheDocument();
    expect(screen.getByText('(+20.00%)')).toBeInTheDocument();
  });

  it('renders negative P&L pill', () => {
    render(
      <PositionHeader
        position={makePosition({
          pnl_absolute: { base: '-75.00', display: '-75.00' },
          pnl_percent: -0.04,
        })}
      />,
    );
    expect(screen.getByText('-$75.00')).toBeInTheDocument();
    expect(screen.getByText('(-4.00%)')).toBeInTheDocument();
  });

  it('renders em-dash for absent P&L', () => {
    render(
      <PositionHeader
        position={makePosition({ pnl_absolute: undefined, pnl_percent: undefined })}
      />,
    );
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Position } from '../../lib/api/positions';
import { PositionsRow } from './positions-row';

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

function renderRow(position: Position) {
  return render(
    <table>
      <tbody>
        <PositionsRow position={position} />
      </tbody>
    </table>,
  );
}

describe('PositionsRow', () => {
  it('renders gain variant with positive percent', () => {
    renderRow(makePosition());
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('$1,800.00')).toBeInTheDocument();
    expect(screen.getByText('(+20.00%)')).toBeInTheDocument();
  });

  it('renders loss variant with negative percent', () => {
    renderRow(
      makePosition({
        pnl_absolute: { base: '-150.00', display: '-150.00' },
        pnl_percent: -0.09,
      }),
    );
    expect(screen.getByText('(-9.00%)')).toBeInTheDocument();
  });

  it('renders em-dash for absent pnl', () => {
    renderRow(makePosition({ pnl_absolute: undefined, pnl_percent: undefined }));
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('derives percent locally when pnl_absolute is present but pnl_percent is missing', () => {
    renderRow(
      makePosition({
        pnl_absolute: { base: '100.00', display: '100.00' },
        pnl_percent: undefined,
      }),
    );
    // abs=100, total_value=1800 → basis=1700 → 100/1700 ≈ 5.88%
    expect(screen.getByText('(+5.88%)')).toBeInTheDocument();
  });
});

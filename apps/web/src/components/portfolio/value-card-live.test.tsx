import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PortfolioSnapshot } from '../../hooks/usePortfolio';
import { PortfolioValueCardView } from './value-card-live';

function makeSnapshot(overrides: Partial<PortfolioSnapshot> = {}): PortfolioSnapshot {
  return {
    snapshot_date: '2026-04-20',
    values: {
      base: { currency: 'USD', total_value: '10000.00', total_cost: '9879.50' },
      display: {
        currency: 'USD',
        total_value: '10000.00',
        total_cost: '9879.50',
        fx_rate: '1',
        fx_date: '2026-04-20',
      },
    },
    pnl_absolute: { base: '120.50', display: '120.50' },
    pnl_percent: 0.0122,
    allocation: {},
    by_asset_type: {},
    by_currency: {},
    ...overrides,
  };
}

describe('PortfolioValueCardView', () => {
  it('renders gain variant with positive percent', () => {
    render(<PortfolioValueCardView snapshot={makeSnapshot()} />);
    expect(screen.getByText('Total portfolio')).toBeInTheDocument();
    expect(screen.getByText('$10,000.00')).toBeInTheDocument();
    expect(screen.getByText('(+1.22%)')).toBeInTheDocument();
  });

  it('renders loss variant with negative percent', () => {
    render(
      <PortfolioValueCardView
        snapshot={makeSnapshot({
          pnl_absolute: { base: '-345.10', display: '-345.10' },
          pnl_percent: -0.0337,
        })}
      />,
    );
    expect(screen.getByText('(-3.37%)')).toBeInTheDocument();
  });

  it('shows empty state for zero portfolio value', () => {
    render(
      <PortfolioValueCardView
        snapshot={makeSnapshot({
          values: {
            base: { currency: 'USD', total_value: '0', total_cost: '0' },
            display: {
              currency: 'USD',
              total_value: '0',
              total_cost: '0',
              fx_rate: '1',
              fx_date: '2026-04-20',
            },
          },
        })}
      />,
    );
    expect(screen.getByText('No portfolio data yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect your first account/i })).toBeDisabled();
  });
});

/**
 * Chart components smoke tests.
 *
 * Per kickoff Phase 8 — instantiate each of the 10 MVP chart components
 * with its CHARTS_SPEC §5.3 example payload, assert no throw, and snapshot
 * the visually-hidden <ChartDataTable> output. Detailed unit tests
 * (formatters edge cases, Zod-rejection contract, computeWaterfallSteps
 * arithmetic) are owned by the QA kickoff.
 */

import { render } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it } from 'vitest';

import {
  AREA_FIXTURE,
  AreaChart,
  BAR_FIXTURE,
  BarChart,
  CALENDAR_FIXTURE,
  CANDLESTICK_FIXTURE,
  Calendar,
  DONUT_FIXTURE,
  DonutChart,
  LINE_FIXTURE,
  LineChart,
  SPARKLINE_FIXTURE,
  STACKED_BAR_FIXTURE,
  Sparkline,
  TREEMAP_FIXTURE,
  Treemap,
  WATERFALL_FIXTURE,
} from './index';
import { LazyCandlestick, LazyStackedBar, LazyWaterfall } from './lazy';
import { computeWaterfallSteps } from './lazy';

describe('chart smoke instantiation', () => {
  it('renders LineChart without throwing', () => {
    const { container, getByTestId } = render(<LineChart payload={LINE_FIXTURE} />);
    expect(container).toBeTruthy();
    expect(getByTestId('chart-line')).toBeInTheDocument();
    expect(getByTestId('chart-data-table-line')).toMatchSnapshot();
  });

  it('renders AreaChart without throwing', () => {
    const { getByTestId } = render(<AreaChart payload={AREA_FIXTURE} />);
    expect(getByTestId('chart-area')).toBeInTheDocument();
    expect(getByTestId('chart-data-table-area')).toMatchSnapshot();
  });

  it('renders BarChart without throwing', () => {
    const { getByTestId } = render(<BarChart payload={BAR_FIXTURE} />);
    expect(getByTestId('chart-bar')).toBeInTheDocument();
    expect(getByTestId('chart-data-table-bar')).toMatchSnapshot();
  });

  it('renders DonutChart without throwing', () => {
    const { getByTestId } = render(<DonutChart payload={DONUT_FIXTURE} />);
    expect(getByTestId('chart-donut')).toBeInTheDocument();
    expect(getByTestId('chart-data-table-donut')).toMatchSnapshot();
  });

  it('renders Sparkline without throwing', () => {
    const { getByTestId } = render(<Sparkline payload={SPARKLINE_FIXTURE} />);
    expect(getByTestId('chart-sparkline')).toBeInTheDocument();
    expect(getByTestId('chart-data-table-sparkline')).toMatchSnapshot();
  });

  it('renders Calendar without throwing', () => {
    const { getByTestId } = render(<Calendar payload={CALENDAR_FIXTURE} />);
    expect(getByTestId('chart-calendar')).toBeInTheDocument();
    expect(getByTestId('chart-data-table-calendar')).toMatchSnapshot();
  });

  it('renders Treemap without throwing', () => {
    const { getByTestId } = render(<Treemap payload={TREEMAP_FIXTURE} />);
    expect(getByTestId('chart-treemap')).toBeInTheDocument();
    expect(getByTestId('chart-data-table-treemap')).toMatchSnapshot();
  });

  it('renders LazyStackedBar inside Suspense without throwing', async () => {
    const { findByTestId } = render(
      <Suspense fallback={<div data-testid="loading" />}>
        <LazyStackedBar payload={STACKED_BAR_FIXTURE} />
      </Suspense>,
    );
    const dataTable = await findByTestId('chart-data-table-stacked-bar');
    expect(dataTable).toMatchSnapshot();
  });

  it('renders LazyWaterfall inside Suspense without throwing', async () => {
    const { findByTestId } = render(
      <Suspense fallback={<div data-testid="loading" />}>
        <LazyWaterfall payload={WATERFALL_FIXTURE} />
      </Suspense>,
    );
    const dataTable = await findByTestId('chart-data-table-waterfall');
    expect(dataTable).toMatchSnapshot();
  });

  it('renders LazyCandlestick inside Suspense without throwing', async () => {
    const { findByTestId } = render(
      <Suspense fallback={<div data-testid="loading" />}>
        <LazyCandlestick payload={CANDLESTICK_FIXTURE} />
      </Suspense>,
    );
    const dataTable = await findByTestId('chart-data-table-candlestick');
    expect(dataTable).toMatchSnapshot();
  });
});

describe('Bar drift caption (finance audit B-2)', () => {
  it('renders the FINRA descriptive caption when meta.subtitle contains "drift"', () => {
    const drift = {
      ...BAR_FIXTURE,
      meta: { ...BAR_FIXTURE.meta, subtitle: 'Drift since 2026-01-01 · top 5' },
    };
    const { getByTestId } = render(<BarChart payload={drift} />);
    expect(getByTestId('chart-bar-drift-caption')).toBeInTheDocument();
  });

  it('omits the drift caption when subtitle does not mention drift', () => {
    const { queryByTestId } = render(<BarChart payload={BAR_FIXTURE} />);
    expect(queryByTestId('chart-bar-drift-caption')).toBeNull();
  });
});

describe('Treemap captions', () => {
  it('renders the mandatory FINRA descriptive caption', () => {
    const { getByTestId } = render(<Treemap payload={TREEMAP_FIXTURE} />);
    expect(getByTestId('chart-treemap-caption').textContent).toMatch(/FINRA/);
  });

  it('renders the cross-currency basis caption (T-8)', () => {
    const { getByTestId } = render(<Treemap payload={TREEMAP_FIXTURE} />);
    expect(getByTestId('chart-treemap-caption').textContent).toMatch(/base currency/);
  });
});

describe('Waterfall conservation transform', () => {
  it('exposes computeWaterfallSteps with expected anchor + body shape', () => {
    const steps = computeWaterfallSteps(WATERFALL_FIXTURE);
    expect(steps).toHaveLength(WATERFALL_FIXTURE.steps.length);
    const first = steps[0];
    const last = steps[steps.length - 1];
    expect(first?.componentType).toBe('start');
    expect(first?.isAnchor).toBe(true);
    expect(last?.componentType).toBe('end');
    expect(last?.isAnchor).toBe(true);
  });

  it('renders the mandatory descriptive caption', async () => {
    const { findByTestId } = render(
      <Suspense fallback={<div />}>
        <LazyWaterfall payload={WATERFALL_FIXTURE} />
      </Suspense>,
    );
    const caption = await findByTestId('chart-waterfall-caption');
    expect(caption.textContent).toMatch(/Decomposes change in portfolio value/);
  });
});

describe('LineChart series-7 dark-mode auto-swap (CHARTS_SPEC §2.3)', () => {
  it('does not throw when a solo series-7 line is rendered in dark mode', () => {
    document.documentElement.dataset.theme = 'dark';
    try {
      const payload = {
        ...LINE_FIXTURE,
        series: [{ key: 'y', label: 'Total', color: 'var(--chart-series-7)' }],
      };
      const { getByTestId } = render(<LineChart payload={payload} />);
      expect(getByTestId('chart-line')).toBeInTheDocument();
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });
});

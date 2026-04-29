/**
 * Vitest tests for `<ChartFrame>` — the required a11y baseline primitive.
 *
 * Coverage targets:
 *   - role=img + non-empty aria-label derivation (override → meta.alt → title → kind)
 *   - aria-describedby points to the visually-hidden ChartDataTable
 *   - focus-ring class applied; tabIndex 0 by default
 *   - opt-out (`keyboardNav={false}`) flips tabIndex to -1
 *   - aria-live polite region present by default
 *   - liveRegion="off" suppresses the status region
 *   - empty `ariaLabel` override falls through to meta-derived label
 *   - empty meta.title + missing meta.alt falls through to synthetic kind label
 */

import type {
  LineChartPayload,
  MultiSeriesPoint,
} from '@investment-tracker/shared-types/charts';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartFrame } from '../ChartFrame';
import { checkAccessibleChart } from '../test-utils/toBeAccessibleChart';

function asMultiSeries<T extends Record<string, string | number>>(rows: T[]): MultiSeriesPoint[] {
  return rows as unknown as MultiSeriesPoint[];
}

function buildLinePayload(overrides: Partial<LineChartPayload['meta']> = {}): LineChartPayload {
  return {
    kind: 'line',
    meta: {
      title: 'Portfolio value',
      ...overrides,
    },
    xAxis: { format: 'date-day', label: 'Date' },
    yAxis: { format: 'currency', currency: 'USD', label: 'Value' },
    interpolation: 'linear',
    series: [{ key: 'value', label: 'Value' }],
    data: asMultiSeries([
      { x: '2026-01-01', value: 100 },
      { x: '2026-01-02', value: 120 },
    ]),
  };
}

describe('<ChartFrame>', () => {
  it('renders role=img with aria-label derived from meta.title', () => {
    const payload = buildLinePayload();
    render(
      <ChartFrame width={400} height={200} payload={payload}>
        <svg />
      </ChartFrame>,
    );
    const node = screen.getByRole('img');
    expect(node.getAttribute('aria-label')).toBe('Portfolio value');
  });

  it('prefers meta.alt over meta.title', () => {
    const payload = buildLinePayload({ alt: 'Q4 returns by region, ascending' });
    render(
      <ChartFrame width={400} height={200} payload={payload}>
        <svg />
      </ChartFrame>,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe(
      'Q4 returns by region, ascending',
    );
  });

  it('explicit ariaLabel override wins over meta', () => {
    const payload = buildLinePayload({ alt: 'agent prose' });
    render(
      <ChartFrame width={400} height={200} payload={payload} ariaLabel="Operator override">
        <svg />
      </ChartFrame>,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Operator override');
  });

  it('empty / whitespace-only override falls through to derivation', () => {
    const payload = buildLinePayload();
    render(
      <ChartFrame width={400} height={200} payload={payload} ariaLabel="   ">
        <svg />
      </ChartFrame>,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Portfolio value');
  });

  it('synthetic last-resort label when alt + title both empty', () => {
    const payload = buildLinePayload({ title: '   ' });
    render(
      <ChartFrame width={400} height={200} payload={payload}>
        <svg />
      </ChartFrame>,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('line chart');
  });

  it('aria-describedby points to visually-hidden ChartDataTable', () => {
    const payload = buildLinePayload();
    render(
      <ChartFrame width={400} height={200} payload={payload}>
        <svg />
      </ChartFrame>,
    );
    const node = screen.getByRole('img');
    const describedBy = node.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const transcript = describedBy ? document.getElementById(describedBy) : null;
    expect(transcript).not.toBeNull();
    expect(transcript?.classList.contains('sr-only')).toBe(true);
  });

  it('applies focus-visible ring class + tabIndex 0 by default', () => {
    const payload = buildLinePayload();
    render(
      <ChartFrame width={400} height={200} payload={payload}>
        <svg />
      </ChartFrame>,
    );
    const node = screen.getByRole('img');
    expect(node.getAttribute('class') ?? '').toContain('focus-visible:ring-');
    expect(node.getAttribute('tabindex')).toBe('0');
  });

  it('opt-out keyboardNav={false} flips tabIndex to -1', () => {
    const payload = buildLinePayload();
    render(
      <ChartFrame width={400} height={200} payload={payload} keyboardNav={false}>
        <svg />
      </ChartFrame>,
    );
    expect(screen.getByRole('img').getAttribute('tabindex')).toBe('-1');
  });

  it('renders aria-live polite status region by default', () => {
    const payload = buildLinePayload();
    render(
      <ChartFrame width={400} height={200} payload={payload}>
        <svg />
      </ChartFrame>,
    );
    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('aria-atomic')).toBe('true');
    expect(status.classList.contains('sr-only')).toBe(true);
  });

  it('liveRegion="off" suppresses the status region', () => {
    const payload = buildLinePayload();
    render(
      <ChartFrame width={400} height={200} payload={payload} liveRegion="off">
        <svg />
      </ChartFrame>,
    );
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('exposes data-chart-kind + data-series-encoding on the outer wrapper', () => {
    const payload = buildLinePayload();
    const { container } = render(
      <ChartFrame
        width={400}
        height={200}
        payload={payload}
        seriesEncoding="color-plus-shape"
        testId="chart-line"
      >
        <svg />
      </ChartFrame>,
    );
    const outer = container.querySelector('[data-testid="chart-line"]');
    expect(outer).not.toBeNull();
    expect(outer?.getAttribute('data-chart-kind')).toBe('line');
    expect(outer?.getAttribute('data-series-encoding')).toBe('color-plus-shape');
  });

  it('passes the structural a11y baseline check', () => {
    const payload = buildLinePayload();
    const { container } = render(
      <ChartFrame width={400} height={200} payload={payload}>
        <svg />
      </ChartFrame>,
    );
    const result = checkAccessibleChart(container);
    expect(result.ok).toBe(true);
  });
});

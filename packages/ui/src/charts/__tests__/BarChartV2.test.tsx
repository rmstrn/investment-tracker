/**
 * Vitest tests for `<BarChartV2>` — primitives-backed bar renderer (β.1.4).
 *
 * Coverage (Task 6 of the BarChartV2 plan):
 *   - Host carries `data-chart-backend="primitives"`.
 *   - One `<rect data-testid="chart-bar-rect">` per data point.
 *   - `<EditorialBevelFilter>` id matched by the bar-group `filter` attr.
 *   - `<linearGradient>` slot count: 1 when `colorBySign=false`, 2 when
 *     `colorBySign=true` AND payload contains both signs.
 *   - Per-bar `data-bar-slot` reflects sign mapping (positive→1, negative→4)
 *     when `colorBySign=true`; uniformly 1 when `colorBySign=false`.
 *   - No `<radialGradient>` (editorial register uses linear-only).
 *   - Drift caption rendered iff `meta.subtitle` includes `'drift'`.
 *   - `<ReferenceLine>` rendered iff `payload.referenceLine` present.
 *   - Empty `data: []` does not throw.
 *   - A11y baseline: role=img + aria-label derived via ChartFrame.
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { BarChartPayload } from '@investment-tracker/shared-types/charts';
import { BAR_FIXTURE, BAR_DRIFT_FIXTURE } from '../_shared/fixtures';
import { BarChartV2 } from '../BarChartV2';

function buildPayload(overrides: Partial<BarChartPayload> = {}): BarChartPayload {
  return { ...BAR_FIXTURE, ...overrides };
}

describe('<BarChartV2>', () => {
  it('renders host with data-chart-backend="primitives"', () => {
    const { container } = render(<BarChartV2 payload={buildPayload()} />);
    const host = container.querySelector('[data-chart-backend="primitives"]');
    expect(host).not.toBeNull();
  });

  it('renders one <rect data-testid="chart-bar-rect"> per data point', () => {
    const payload = buildPayload();
    const { container } = render(<BarChartV2 payload={payload} />);
    const rects = container.querySelectorAll('[data-testid="chart-bar-rect"]');
    expect(rects).toHaveLength(payload.data.length);
  });

  it('renders <EditorialBevelFilter> with id matched by slice container filter attr', () => {
    const { container } = render(<BarChartV2 payload={buildPayload()} />);
    const filter = container.querySelector('filter[id^="bar-bevel-"]');
    expect(filter).not.toBeNull();
    const filterId = filter?.getAttribute('id');
    expect(filterId).toBeTruthy();
    const wrappedG = container.querySelector(`g[filter="url(#${filterId})"]`);
    expect(wrappedG).not.toBeNull();
  });

  it('renders <linearGradient> for slot 1 only when colorBySign=false', () => {
    const { container } = render(
      <BarChartV2 payload={buildPayload({ colorBySign: false })} />,
    );
    const gradients = container.querySelectorAll('linearGradient[id^="bar-grad-"]');
    expect(gradients).toHaveLength(1);
    expect(gradients[0]?.getAttribute('id')).toMatch(/^bar-grad-1-/);
  });

  it('renders <linearGradient> for slots 1 and 4 when colorBySign=true', () => {
    const mixed = buildPayload({
      colorBySign: true,
      data: [
        { x: 'a', y: 10 },
        { x: 'b', y: -5 },
        { x: 'c', y: 3 },
      ],
    });
    const { container } = render(<BarChartV2 payload={mixed} />);
    const gradients = container.querySelectorAll('linearGradient[id^="bar-grad-"]');
    expect(gradients).toHaveLength(2);
    const ids = Array.from(gradients).map((g) => g.getAttribute('id'));
    expect(ids.some((id) => id?.match(/^bar-grad-1-/))).toBe(true);
    expect(ids.some((id) => id?.match(/^bar-grad-4-/))).toBe(true);
  });

  it('positive bars use slot 1, negative bars use slot 4 (colorBySign=true)', () => {
    const mixed = buildPayload({
      colorBySign: true,
      data: [
        { x: 'pos', y: 10 },
        { x: 'neg', y: -5 },
      ],
    });
    const { container } = render(<BarChartV2 payload={mixed} />);
    const rects = container.querySelectorAll('[data-testid="chart-bar-rect"]');
    expect(rects[0]?.getAttribute('data-bar-slot')).toBe('1');
    expect(rects[1]?.getAttribute('data-bar-slot')).toBe('4');
  });

  it('all bars use slot 1 when colorBySign=false', () => {
    const mixed = buildPayload({
      colorBySign: false,
      data: [
        { x: 'a', y: 10 },
        { x: 'b', y: -5 },
      ],
    });
    const { container } = render(<BarChartV2 payload={mixed} />);
    const rects = container.querySelectorAll('[data-testid="chart-bar-rect"]');
    expect(rects[0]?.getAttribute('data-bar-slot')).toBe('1');
    expect(rects[1]?.getAttribute('data-bar-slot')).toBe('1');
  });

  it('does NOT render <radialGradient>', () => {
    const { container } = render(<BarChartV2 payload={buildPayload()} />);
    expect(container.querySelectorAll('radialGradient')).toHaveLength(0);
  });

  it('renders drift caption when meta.subtitle includes "drift"', () => {
    const { container } = render(<BarChartV2 payload={BAR_DRIFT_FIXTURE} />);
    const caption = container.querySelector('[data-testid="chart-bar-drift-caption"]');
    expect(caption).not.toBeNull();
    expect(caption?.textContent).toContain('Drift');
  });

  it('omits drift caption when meta.subtitle does not include "drift"', () => {
    const { container } = render(<BarChartV2 payload={buildPayload()} />);
    const caption = container.querySelector('[data-testid="chart-bar-drift-caption"]');
    expect(caption).toBeNull();
  });

  it('renders ReferenceLine when payload.referenceLine present', () => {
    const withRef = buildPayload({
      referenceLine: { axis: 'zero', label: 'BASELINE' },
    });
    const { container } = render(<BarChartV2 payload={withRef} />);
    const refLine = container.querySelector('[data-testid="reference-line"]');
    expect(refLine).not.toBeNull();
  });

  it('omits ReferenceLine when payload.referenceLine missing', () => {
    const { container } = render(
      <BarChartV2 payload={buildPayload({ referenceLine: undefined })} />,
    );
    const refLine = container.querySelector('[data-testid="reference-line"]');
    expect(refLine).toBeNull();
  });

  it('renders empty <data: []> without throwing', () => {
    expect(() =>
      render(<BarChartV2 payload={buildPayload({ data: [] })} />),
    ).not.toThrow();
  });

  it('a11y baseline: role=img on host (via ChartFrame), aria-label derived from meta.title', () => {
    const payload = buildPayload({
      meta: { title: 'Sector allocation' },
    });
    const { container } = render(<BarChartV2 payload={payload} />);
    const role = container.querySelector('[role="img"]');
    expect(role).not.toBeNull();
    expect(role?.getAttribute('aria-label')).toContain('Sector allocation');
  });
});

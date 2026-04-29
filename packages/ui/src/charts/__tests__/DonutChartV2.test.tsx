/**
 * Vitest tests for `<DonutChartV2>` — primitives-backed donut (β.1.3).
 *
 * Coverage:
 *   - Default render path uses the fast circle-stroke ring (5×<circle>).
 *   - cornerRadius > 0 switches to the rounded <path> path.
 *   - Semi-circle range (startAngleRadians: 0, endAngleRadians: π) renders
 *     all sectors and exposes data-half-circle attribute.
 *   - Sector count matches payload.segments.length.
 *   - Each sector carries data-segment-key matching the payload.
 *   - Center label (single-token) renders just the headline.
 *   - Center label (multi-token) splits into headline + eyebrow.
 *   - Legend renders one chip per segment.
 *   - role=img + aria-label + aria-describedby + tabIndex=0 + focus-ring
 *     class — the manual a11y baseline (V2 doesn't wrap in ChartFrame to
 *     preserve the V1 API but mirrors all required attributes).
 *   - ChartDataTable transcript present with .sr-only.
 */

import { DONUT_FIXTURE } from '../_shared/fixtures';
import type { DonutChartPayload } from '@investment-tracker/shared-types/charts';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DonutChartV2 } from '../DonutChartV2';

function buildDonutPayload(overrides: Partial<DonutChartPayload> = {}): DonutChartPayload {
  return { ...DONUT_FIXTURE, ...overrides };
}

describe('<DonutChartV2>', () => {
  it('default render uses the fast circle-stroke ring path', () => {
    const { getByTestId, queryByTestId } = render(<DonutChartV2 payload={DONUT_FIXTURE} />);
    expect(getByTestId('donut-fast-ring')).not.toBeNull();
    expect(queryByTestId('donut-rounded-path')).toBeNull();
  });

  it('cornerRadius > 0 switches to the rounded <path> path', () => {
    const { getByTestId, queryByTestId } = render(
      <DonutChartV2 payload={DONUT_FIXTURE} cornerRadius={6} />,
    );
    expect(getByTestId('donut-rounded-path')).not.toBeNull();
    expect(queryByTestId('donut-fast-ring')).toBeNull();
  });

  it('renders one sector per payload segment', () => {
    const { container } = render(<DonutChartV2 payload={DONUT_FIXTURE} />);
    const sectors = container.querySelectorAll('[data-testid="donut-sector"]');
    expect(sectors.length).toBe(DONUT_FIXTURE.segments.length);
  });

  it('each sector has data-segment-key matching the payload', () => {
    const { container } = render(<DonutChartV2 payload={DONUT_FIXTURE} />);
    const keys = Array.from(container.querySelectorAll('[data-testid="donut-sector"]')).map(
      (el) => el.getAttribute('data-segment-key'),
    );
    expect(keys).toEqual(DONUT_FIXTURE.segments.map((s) => s.key));
  });

  it('semi-circle (start=0, end=π) renders all sectors and flags data-half-circle', () => {
    const { container, getByTestId } = render(
      <DonutChartV2
        payload={DONUT_FIXTURE}
        startAngleRadians={0}
        endAngleRadians={Math.PI}
      />,
    );
    const host = getByTestId('chart-donut');
    expect(host.getAttribute('data-half-circle')).toBe('true');
    const sectors = container.querySelectorAll('[data-testid="donut-sector"]');
    expect(sectors.length).toBe(DONUT_FIXTURE.segments.length);
  });

  it('cornerRadius + semi-circle compose without throwing', () => {
    const { container } = render(
      <DonutChartV2
        payload={DONUT_FIXTURE}
        startAngleRadians={0}
        endAngleRadians={Math.PI}
        cornerRadius={4}
      />,
    );
    const sectors = container.querySelectorAll('[data-testid="donut-sector"]');
    expect(sectors.length).toBe(DONUT_FIXTURE.segments.length);
  });

  it('center label single-token renders headline only', () => {
    const payload = buildDonutPayload({ centerLabel: '$226K' });
    const { container } = render(<DonutChartV2 payload={payload} />);
    expect(container.textContent).toContain('$226K');
  });

  it('center label multi-token splits into headline + eyebrow', () => {
    const payload = buildDonutPayload({ centerLabel: '$226K Total' });
    const { container } = render(<DonutChartV2 payload={payload} />);
    expect(container.textContent).toContain('$226K');
    expect(container.textContent).toContain('Total');
  });

  it('renders one legend chip per segment', () => {
    const { container } = render(<DonutChartV2 payload={DONUT_FIXTURE} />);
    const legendItems = container.querySelectorAll('ul > li');
    expect(legendItems.length).toBe(DONUT_FIXTURE.segments.length);
  });

  it('a11y baseline — role=img + aria-label + aria-describedby + tabIndex=0 + focus-ring', () => {
    const { getByTestId, container } = render(<DonutChartV2 payload={DONUT_FIXTURE} />);
    const host = getByTestId('chart-donut');
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBeTruthy();
    expect(host.getAttribute('tabindex')).toBe('0');
    const className = host.getAttribute('class') ?? '';
    expect(className).toContain('focus-visible:ring-');

    const describedBy = host.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const transcript = container.querySelector(`#${describedBy}`);
    expect(transcript?.classList.contains('sr-only')).toBe(true);
  });

  it('labelPosition="outside" renders without the centre block', () => {
    const payload = buildDonutPayload({ centerLabel: '$226K' });
    const { container } = render(
      <DonutChartV2 payload={payload} labelPosition="outside" />,
    );
    // Centre block carries the inset-0 absolute layout class — verify absent.
    const inner = container.querySelector('.absolute.inset-0.flex.flex-col');
    expect(inner).toBeNull();
  });

  it('data-chart-backend marks the primitives implementation', () => {
    const { getByTestId } = render(<DonutChartV2 payload={DONUT_FIXTURE} />);
    expect(getByTestId('chart-donut').getAttribute('data-chart-backend')).toBe('primitives');
  });
});

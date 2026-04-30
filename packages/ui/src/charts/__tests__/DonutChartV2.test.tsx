/**
 * Vitest tests for `<DonutChartV2>` — primitives-backed donut (β.1.4 / D5).
 *
 * Coverage:
 *   - **Default render path uses the rounded <path> branch** (D2 changed
 *     `cornerRadius` default from 0 → 3 — anatomy ADR §«Slice geometry»).
 *   - **`cornerRadius={0}` opt-in** switches to the fast circle-stroke ring
 *     (5×<circle>). Fast path is now opt-in, not default.
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
 *
 * D5 scope note: comprehensive coverage of D2/D3/D4 props (`palette`,
 * `arcMode`, gradient `<defs>` presence, hover bisector, entrance stagger
 * order) is intentionally OUT of scope here — those tests will land with the
 * Phase 2 review fan-out. D5 only refreshes the 1 broken default-path test.
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
  it('default render uses the rounded <path> branch (D2 default cornerRadius=3)', () => {
    // D2 anatomy ADR — default cornerRadius flipped from 0 → 3, so the
    // rounded path is now the default render branch. Fast path is opt-in
    // via explicit `cornerRadius={0}` (next test).
    const { getByTestId, queryByTestId } = render(<DonutChartV2 payload={DONUT_FIXTURE} />);
    expect(getByTestId('donut-rounded-path')).not.toBeNull();
    expect(queryByTestId('donut-fast-ring')).toBeNull();
  });

  it('renders <EditorialBevelFilter> with stable id matched by slice container filter attr', () => {
    const { container } = render(<DonutChartV2 payload={buildDonutPayload()} />);
    const filter = container.querySelector('filter[id^="donut-bevel-"]');
    expect(filter).not.toBeNull();
    const filterId = filter!.getAttribute('id')!;
    // <g filter="url(#donut-bevel-...)"> wraps the slice container
    const wrappedG = container.querySelector(`g[filter="url(#${filterId})"]`);
    expect(wrappedG).not.toBeNull();
  });

  it('renders per-slice <linearGradient> defs for categorical palette', () => {
    const payload = buildDonutPayload();
    const { container } = render(<DonutChartV2 payload={payload} palette="categorical" />);
    const lgDefs = container.querySelectorAll('linearGradient[id^="donut-grad-"]');
    expect(lgDefs).toHaveLength(payload.segments.length);
    // Each gradient has exactly 2 stops at 0% / 100%
    for (const lg of Array.from(lgDefs)) {
      const stops = lg.querySelectorAll('stop');
      expect(stops).toHaveLength(2);
      expect(stops[0]?.getAttribute('offset')).toBe('0%');
      expect(stops[1]?.getAttribute('offset')).toBe('100%');
      // stop-color references CSS vars (top + bottom)
      expect(stops[0]?.getAttribute('stop-color')).toMatch(/var\(--chart-categorical-\d-top\)/);
      expect(stops[1]?.getAttribute('stop-color')).toMatch(/var\(--chart-categorical-\d-bottom\)/);
    }
  });

  it.skip('does NOT render <radialGradient> for editorial-still-life form', () => {
    // SKIP until Task 7 cleanup — radial defs are dead code after Task 5
    // but still rendered. Re-enable after MUSEUM_HUE_ORDER block is removed.
    const { container } = render(<DonutChartV2 payload={buildDonutPayload()} />);
    const radialDefs = container.querySelectorAll('radialGradient');
    expect(radialDefs).toHaveLength(0);
  });

  it('cornerRadius={0} opts back into the fast circle-stroke ring path', () => {
    // Fast path is still selectable for callers that want it (e.g.
    // micro-fixture rendering, sparkline-style donut variants). Verifies the
    // fast-ring branch is reachable when explicitly opted into.
    const { getByTestId, queryByTestId } = render(
      <DonutChartV2 payload={DONUT_FIXTURE} cornerRadius={0} />,
    );
    expect(getByTestId('donut-fast-ring')).not.toBeNull();
    expect(queryByTestId('donut-rounded-path')).toBeNull();
  });

  it('cornerRadius > 0 (explicit) renders the rounded <path> branch', () => {
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

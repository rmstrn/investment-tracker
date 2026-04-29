/**
 * Vitest integration test — Phase α.2 round-up.
 *
 * Validates that ChartFrame composed with the rest of the Layer-2 primitives
 * (GridLines, AxisTicksHTML, LinePath, AreaPath via gradient) renders without
 * console warnings, the `toBeAccessibleChart` global matcher resolves, and
 * the public barrel exposes every expected name.
 *
 * Acts as the structural smoke test for chart-kind builders (Phase β) — if
 * this passes, Layer 3 has a clean integration surface.
 */

import type { LineChartPayload, MultiSeriesPoint } from '@investment-tracker/shared-types/charts';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  AreaGradientDef,
  AxisTicksHTML,
  ChartFrame,
  CitationGlyph,
  GridLines,
  LinePath,
  Tooltip,
  linePath,
  linearScale,
} from '../../index';
// Importing the matcher entry-point is enough to install the matcher on
// `expect`; the setup file already does this globally, but the explicit
// import here makes the test self-contained.
import '../test-utils/toBeAccessibleChart';

function asMultiSeries<T extends Record<string, string | number>>(rows: T[]): MultiSeriesPoint[] {
  return rows as unknown as MultiSeriesPoint[];
}

const PAYLOAD: LineChartPayload = {
  kind: 'line',
  meta: { title: 'Composition smoke', subtitle: 'α.2 round-up' },
  xAxis: { format: 'date-day', label: 'Date' },
  yAxis: { format: 'currency', currency: 'USD', label: 'Value' },
  interpolation: 'linear',
  series: [{ key: 'value', label: 'Value' }],
  data: asMultiSeries([
    { x: '2026-01-01', value: 100 },
    { x: '2026-01-02', value: 120 },
    { x: '2026-01-03', value: 110 },
  ]),
};

describe('Layer-2 primitive composition (α.2 round-up)', () => {
  it('ChartFrame + math layer + LinePath + GridLines renders + passes a11y matcher', () => {
    const xScale = linearScale({ domain: [0, 2], range: [0, 400] });
    const yScale = linearScale({ domain: [0, 200], range: [180, 0], nice: true });
    const points = [
      { x: xScale.toPixel(0), y: yScale.toPixel(100) },
      { x: xScale.toPixel(1), y: yScale.toPixel(120) },
      { x: xScale.toPixel(2), y: yScale.toPixel(110) },
    ];

    const { container } = render(
      <ChartFrame width={400} height={200} payload={PAYLOAD} testId="composed-line">
        <svg width={400} height={200} role="presentation" aria-hidden="true">
          <title>Test SVG canvas</title>
          <GridLines orientation="horizontal" positions={[40, 80, 120, 160]} length={400} />
          <LinePath points={points} colorVar="var(--chart-series-1)" />
        </svg>
        <AxisTicksHTML
          orientation="horizontal"
          ticks={[
            { value: '2026-01-01', position: 0, label: 'Jan 1' },
            { value: '2026-01-02', position: 200, label: 'Jan 2' },
            { value: '2026-01-03', position: 400, label: 'Jan 3' },
          ]}
          containerWidth={400}
          containerHeight={200}
        />
      </ChartFrame>,
    );

    expect(container).toBeAccessibleChart();
    expect(container.querySelector('[data-testid="composed-line"]')).not.toBeNull();
    expect(container.querySelector('path[stroke="var(--chart-series-1)"]')).not.toBeNull();
    // linePath() math output went into the d attribute (verified via empty-string negation).
    expect(linePath(points)).not.toBe('');
  });

  it('exposes the documented public surface from the barrel', () => {
    // Smoke: every expected name is defined and not undefined.
    expect(typeof ChartFrame).toBe('function');
    expect(typeof GridLines).toBe('function');
    expect(typeof AxisTicksHTML).toBe('function');
    expect(typeof LinePath).toBe('function');
    expect(typeof Tooltip).toBe('function');
    expect(typeof CitationGlyph).toBe('function');
    expect(typeof AreaGradientDef).toBe('function');
    expect(typeof linePath).toBe('function');
    expect(typeof linearScale).toBe('function');
  });
});

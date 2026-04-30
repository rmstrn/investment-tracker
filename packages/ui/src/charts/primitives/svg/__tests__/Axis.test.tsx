/**
 * Vitest tests for `<Axis>` primitive.
 *
 * Verifies:
 *   - default render emits a `<g data-testid="axis">` with a baseline `<line>`
 *   - `hideBaseline` prop suppresses the baseline `<line>`
 *   - one `<text data-testid="axis-tick-label">` per provided tick, with the
 *     tick's `label` field as text content
 *   - `transform` prop is forwarded to the wrapping `<g>` so caller can
 *     position the axis group inside the chart inner-rect
 *
 * Per spec docs/superpowers/specs/2026-04-30-bar-chart-v2-design.md §3.4 +
 * §5.2: one component handles all four axis orientations (bottom / left /
 * top / right) — type narrowing on `orientation` literal switches tick
 * positioning + label anchoring branches inside.
 */

import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { linearScale } from '../../math/scale';
import { Axis } from '../Axis';

function renderInSvg(node: ReactElement) {
  return render(
    <svg width={400} height={200} role="img" aria-label="Test SVG canvas">
      <title>Test SVG canvas</title>
      {node}
    </svg>,
  );
}

describe('<Axis>', () => {
  const mockScale = linearScale({ domain: [0, 100], range: [0, 200] });

  it('renders <g> with optional baseline <line>', () => {
    const { container } = renderInSvg(
      <Axis
        orientation="bottom"
        scale={mockScale}
        innerWidth={200}
        innerHeight={100}
        ticks={[
          { value: 0, label: '0' },
          { value: 50, label: '50' },
          { value: 100, label: '100' },
        ]}
      />,
    );
    const g = container.querySelector('g[data-testid="axis"]');
    expect(g).not.toBeNull();
    expect(g?.querySelector('line[data-testid="axis-baseline"]')).not.toBeNull();
  });

  it('hideBaseline=true suppresses baseline', () => {
    const { container } = renderInSvg(
      <Axis
        orientation="bottom"
        scale={mockScale}
        hideBaseline
        innerWidth={200}
        innerHeight={100}
        ticks={[{ value: 50, label: '50' }]}
      />,
    );
    const g = container.querySelector('g[data-testid="axis"]');
    expect(g?.querySelector('line[data-testid="axis-baseline"]')).toBeNull();
  });

  it('renders one <text> per tick with label', () => {
    const { container } = renderInSvg(
      <Axis
        orientation="bottom"
        scale={mockScale}
        innerWidth={200}
        innerHeight={100}
        ticks={[
          { value: 0, label: '0' },
          { value: 100, label: '100' },
        ]}
      />,
    );
    const labels = container.querySelectorAll('text[data-testid="axis-tick-label"]');
    expect(labels).toHaveLength(2);
    expect(labels[0]?.textContent).toBe('0');
    expect(labels[1]?.textContent).toBe('100');
  });

  it('applies transform prop to <g>', () => {
    const { container } = renderInSvg(
      <Axis
        orientation="left"
        scale={mockScale}
        transform="translate(50,0)"
        innerWidth={200}
        innerHeight={100}
        ticks={[]}
      />,
    );
    const g = container.querySelector('g[data-testid="axis"]');
    expect(g?.getAttribute('transform')).toBe('translate(50,0)');
  });
});

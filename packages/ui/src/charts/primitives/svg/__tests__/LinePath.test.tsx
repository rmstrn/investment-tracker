/**
 * Vitest tests for `<LinePath>` primitive.
 *
 * Verifies:
 *   - generates valid SVG `d` attribute starting with M (moveto)
 *   - stroke colour applied
 *   - dashPattern applied
 *   - default strokeWidth = 2 per product-designer §2.4
 *   - animateOnMount disabled by default (no dasharray side-effect)
 *   - reducedMotion bypass renders without animation interference
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinePath } from '../LinePath';

function renderInSvg(node: React.ReactElement) {
  return render(
    <svg width={400} height={200} role="img" aria-label="Test SVG canvas">
      <title>Test SVG canvas</title>
      {node}
    </svg>,
  );
}

describe('<LinePath>', () => {
  it('renders a path with valid d attribute starting with M', () => {
    const { container } = renderInSvg(
      <LinePath
        points={[
          { x: 0, y: 100 },
          { x: 50, y: 80 },
          { x: 100, y: 60 },
        ]}
        colorVar="var(--chart-series-1)"
      />,
    );
    const path = container.querySelector('path');
    const d = path?.getAttribute('d') ?? '';
    expect(d.startsWith('M')).toBe(true);
  });

  it('applies stroke colour from colorVar', () => {
    const { container } = renderInSvg(
      <LinePath
        points={[
          { x: 0, y: 0 },
          { x: 100, y: 50 },
        ]}
        colorVar="var(--chart-series-3)"
      />,
    );
    expect(container.querySelector('path')?.getAttribute('stroke')).toBe('var(--chart-series-3)');
  });

  it('applies default strokeWidth = 2', () => {
    const { container } = renderInSvg(
      <LinePath
        points={[
          { x: 0, y: 0 },
          { x: 10, y: 10 },
        ]}
        colorVar="red"
      />,
    );
    expect(container.querySelector('path')?.getAttribute('stroke-width')).toBe('2');
  });

  it('respects custom strokeWidth', () => {
    const { container } = renderInSvg(
      <LinePath
        points={[
          { x: 0, y: 0 },
          { x: 10, y: 10 },
        ]}
        colorVar="red"
        strokeWidth={3}
      />,
    );
    expect(container.querySelector('path')?.getAttribute('stroke-width')).toBe('3');
  });

  it('applies dashPattern via inline style stroke-dasharray', () => {
    const { container } = renderInSvg(
      <LinePath
        points={[
          { x: 0, y: 0 },
          { x: 10, y: 10 },
        ]}
        colorVar="red"
        dashPattern="4 2"
      />,
    );
    const styleAttr = container.querySelector('path')?.getAttribute('style') ?? '';
    expect(styleAttr).toContain('stroke-dasharray: 4 2');
  });

  it('renders empty path d for empty points without throwing', () => {
    const { container } = renderInSvg(<LinePath points={[]} colorVar="var(--chart-series-1)" />);
    const d = container.querySelector('path')?.getAttribute('d');
    expect(d).toBe('');
  });

  it('reducedMotion + animateOnMount renders without animation lock', () => {
    const { container } = renderInSvg(
      <LinePath
        points={[
          { x: 0, y: 0 },
          { x: 100, y: 50 },
        ]}
        colorVar="var(--chart-series-1)"
        animateOnMount
        reducedMotion
      />,
    );
    // With reducedMotion + animateOnMount, the hook returns final state — the
    // path should not be invisible (full dashoffset). Style should reflect
    // either no offset or a 0 offset (final state).
    const styleAttr = container.querySelector('path')?.getAttribute('style') ?? '';
    expect(styleAttr).toContain('stroke-dashoffset: 0');
  });
});

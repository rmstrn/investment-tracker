/**
 * Vitest tests for `<AreaPath>` primitive.
 *
 * Verifies:
 *   - renders <path> with d attribute (math layer integration)
 *   - fill resolves to url(#gradientId)
 *   - stroke is `none` when no strokeColorVar passed
 *   - stroke threads through when strokeColorVar provided
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AreaPath } from '../AreaPath';

function renderInSvg(node: React.ReactElement) {
  return render(<svg width={400} height={200}>{node}</svg>);
}

describe('<AreaPath>', () => {
  it('renders <path> with d attribute starting with M', () => {
    const { container } = renderInSvg(
      <AreaPath
        points={[
          { x: 0, y0: 100, y1: 60 },
          { x: 50, y0: 100, y1: 40 },
          { x: 100, y0: 100, y1: 80 },
        ]}
        gradientId="grad-1"
      />,
    );
    const d = container.querySelector('path')?.getAttribute('d') ?? '';
    expect(d.startsWith('M')).toBe(true);
  });

  it('fill references gradient by id', () => {
    const { container } = renderInSvg(
      <AreaPath
        points={[
          { x: 0, y0: 100, y1: 60 },
          { x: 50, y0: 100, y1: 40 },
        ]}
        gradientId="my-grad-id"
      />,
    );
    expect(container.querySelector('path')?.getAttribute('fill')).toBe('url(#my-grad-id)');
  });

  it('stroke="none" when no strokeColorVar passed', () => {
    const { container } = renderInSvg(
      <AreaPath
        points={[{ x: 0, y0: 100, y1: 60 }, { x: 50, y0: 100, y1: 40 }]}
        gradientId="g"
      />,
    );
    expect(container.querySelector('path')?.getAttribute('stroke')).toBe('none');
  });

  it('threads strokeColorVar when provided', () => {
    const { container } = renderInSvg(
      <AreaPath
        points={[{ x: 0, y0: 100, y1: 60 }, { x: 50, y0: 100, y1: 40 }]}
        gradientId="g"
        strokeColorVar="var(--chart-series-2)"
      />,
    );
    const path = container.querySelector('path');
    expect(path?.getAttribute('stroke')).toBe('var(--chart-series-2)');
    expect(path?.getAttribute('stroke-width')).toBe('2');
  });

  it('renders empty path for empty points without throwing', () => {
    const { container } = renderInSvg(
      <AreaPath points={[]} gradientId="g" />,
    );
    expect(container.querySelector('path')?.getAttribute('d')).toBe('');
  });
});

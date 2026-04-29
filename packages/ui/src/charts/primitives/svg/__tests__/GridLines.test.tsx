/**
 * Vitest tests for `<GridLines>` primitive.
 *
 * Verifies:
 *   - correct `<line>` element count
 *   - default dash pattern `"2 4"` per static reference
 *   - horizontal vs vertical orientation produces correct coordinates
 *   - `zeroAxisAt` swaps the matched line to solid `var(--text-2)`
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GridLines } from '../GridLines';

function renderInSvg(node: React.ReactElement) {
  return render(<svg width={400} height={200}>{node}</svg>);
}

describe('<GridLines>', () => {
  it('renders one <line> per position', () => {
    const { container } = renderInSvg(
      <GridLines orientation="horizontal" positions={[10, 20, 30, 40]} length={400} />,
    );
    expect(container.querySelectorAll('line').length).toBe(4);
  });

  it('applies default dash pattern "2 4"', () => {
    const { container } = renderInSvg(
      <GridLines orientation="horizontal" positions={[50]} length={400} />,
    );
    const line = container.querySelector('line');
    expect(line?.getAttribute('stroke-dasharray')).toBe('2 4');
  });

  it('respects custom dash pattern', () => {
    const { container } = renderInSvg(
      <GridLines orientation="horizontal" positions={[50]} length={400} dash="3 5" />,
    );
    expect(container.querySelector('line')?.getAttribute('stroke-dasharray')).toBe('3 5');
  });

  it('renders horizontal lines with x1=0, x2=length, y1=y2=position', () => {
    const { container } = renderInSvg(
      <GridLines orientation="horizontal" positions={[42]} length={400} />,
    );
    const line = container.querySelector('line');
    expect(line?.getAttribute('x1')).toBe('0');
    expect(line?.getAttribute('x2')).toBe('400');
    expect(line?.getAttribute('y1')).toBe('42');
    expect(line?.getAttribute('y2')).toBe('42');
  });

  it('renders vertical lines with y1=0, y2=length, x1=x2=position', () => {
    const { container } = renderInSvg(
      <GridLines orientation="vertical" positions={[33]} length={200} />,
    );
    const line = container.querySelector('line');
    expect(line?.getAttribute('x1')).toBe('33');
    expect(line?.getAttribute('x2')).toBe('33');
    expect(line?.getAttribute('y1')).toBe('0');
    expect(line?.getAttribute('y2')).toBe('200');
  });

  it('zeroAxisAt swaps the matched line to solid (no dash)', () => {
    const { container } = renderInSvg(
      <GridLines
        orientation="horizontal"
        positions={[10, 100, 200]}
        length={400}
        zeroAxisAt={100}
      />,
    );
    const lines = container.querySelectorAll('line');
    expect(lines[0]?.getAttribute('stroke-dasharray')).toBe('2 4');
    expect(lines[1]?.getAttribute('stroke-dasharray')).toBeNull();
    expect(lines[2]?.getAttribute('stroke-dasharray')).toBe('2 4');
  });

  it('marks <g> wrapper aria-hidden', () => {
    const { container } = renderInSvg(
      <GridLines orientation="horizontal" positions={[10]} length={400} />,
    );
    const g = container.querySelector('g[aria-hidden="true"]');
    expect(g).not.toBeNull();
  });
});

/**
 * Vitest tests for `<AxisTicksHTML>` primitive.
 *
 * Verifies:
 *   - one `<span>` per tick
 *   - tick labels rendered correctly
 *   - Geist Mono `tnum` + `cv11` font features applied
 *   - horizontal orientation positions on `left` axis
 *   - vertical orientation positions on `top` axis
 *   - aria-hidden on container (axis is decorative; transcript is the source)
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AxisTicksHTML } from '../AxisTicksHTML';

describe('<AxisTicksHTML>', () => {
  it('renders one span per tick with correct label', () => {
    const { container } = render(
      <AxisTicksHTML
        orientation="horizontal"
        ticks={[
          { value: 'Jan', position: 10, label: 'Jan' },
          { value: 'Feb', position: 50, label: 'Feb' },
          { value: 'Mar', position: 100, label: 'Mar' },
        ]}
        containerWidth={400}
        containerHeight={200}
      />,
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(3);
    expect(spans[0]?.textContent).toBe('Jan');
    expect(spans[1]?.textContent).toBe('Feb');
    expect(spans[2]?.textContent).toBe('Mar');
  });

  it('applies tabular-nums + cv11 font features for Geist Mono', () => {
    const { container } = render(
      <AxisTicksHTML
        orientation="horizontal"
        ticks={[{ value: 1, position: 10, label: '1' }]}
        containerWidth={400}
        containerHeight={200}
      />,
    );
    const span = container.querySelector('span');
    const features = span?.getAttribute('style') ?? '';
    expect(features).toContain('tnum');
    expect(features).toContain('cv11');
  });

  it('horizontal orientation places ticks at left=position', () => {
    const { container } = render(
      <AxisTicksHTML
        orientation="horizontal"
        ticks={[{ value: 'A', position: 142, label: 'A' }]}
        containerWidth={400}
        containerHeight={200}
      />,
    );
    const span = container.querySelector('span');
    expect(span?.getAttribute('style')).toContain('left: 142px');
  });

  it('vertical orientation places ticks at top=position', () => {
    const { container } = render(
      <AxisTicksHTML
        orientation="vertical"
        ticks={[{ value: 'B', position: 88, label: 'B' }]}
        containerWidth={400}
        containerHeight={200}
      />,
    );
    const span = container.querySelector('span');
    expect(span?.getAttribute('style')).toContain('top: 88px');
  });

  it('marks container aria-hidden=true', () => {
    const { container } = render(
      <AxisTicksHTML
        orientation="horizontal"
        ticks={[{ value: 1, position: 10, label: '1' }]}
        containerWidth={400}
        containerHeight={200}
      />,
    );
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).not.toBeNull();
  });

  it('exposes data-axis-orientation for QA selectors', () => {
    const { container } = render(
      <AxisTicksHTML
        orientation="vertical"
        ticks={[{ value: 0, position: 0, label: '0' }]}
        containerWidth={400}
        containerHeight={200}
      />,
    );
    expect(container.querySelector('[data-axis-orientation="vertical"]')).not.toBeNull();
  });
});

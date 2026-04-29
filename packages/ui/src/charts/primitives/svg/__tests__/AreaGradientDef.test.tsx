/**
 * Vitest tests for `<AreaGradientDef>` + `useAreaGradient` hook.
 *
 * Verifies:
 *   - declarative form renders <linearGradient> with 2 stops
 *   - top stop opacity defaults to 0.30 (atom D)
 *   - bottom stop opacity defaults to 0
 *   - colorVar threads through both stops
 *   - hook returns a stable, unique gradient id per call
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AreaGradientDef, useAreaGradient } from '../AreaGradientDef';

describe('<AreaGradientDef>', () => {
  it('renders linearGradient with two stops', () => {
    const { container } = render(
      <svg role="img" aria-label="Test SVG canvas">
        <title>Test SVG canvas</title>
        <AreaGradientDef id="grad-test" colorVar="var(--chart-series-1)" />
      </svg>,
    );
    const gradient = container.querySelector('linearGradient');
    expect(gradient).not.toBeNull();
    expect(gradient?.getAttribute('id')).toBe('grad-test');
    expect(gradient?.querySelectorAll('stop').length).toBe(2);
  });

  it('applies default top opacity 0.30 and bottom opacity 0', () => {
    const { container } = render(
      <svg role="img" aria-label="Test SVG canvas">
        <title>Test SVG canvas</title>
        <AreaGradientDef id="g" colorVar="var(--chart-series-1)" />
      </svg>,
    );
    const stops = container.querySelectorAll('stop');
    expect(stops[0]?.getAttribute('stop-opacity')).toBe('0.3');
    expect(stops[1]?.getAttribute('stop-opacity')).toBe('0');
  });

  it('respects custom topOpacity / bottomOpacity', () => {
    const { container } = render(
      <svg role="img" aria-label="Test SVG canvas">
        <title>Test SVG canvas</title>
        <AreaGradientDef
          id="g2"
          colorVar="var(--chart-series-2)"
          topOpacity={0.6}
          bottomOpacity={0.1}
        />
      </svg>,
    );
    const stops = container.querySelectorAll('stop');
    expect(stops[0]?.getAttribute('stop-opacity')).toBe('0.6');
    expect(stops[1]?.getAttribute('stop-opacity')).toBe('0.1');
  });

  it('threads colorVar to both stops', () => {
    const { container } = render(
      <svg role="img" aria-label="Test SVG canvas">
        <title>Test SVG canvas</title>
        <AreaGradientDef id="g3" colorVar="var(--accent)" />
      </svg>,
    );
    const stops = container.querySelectorAll('stop');
    expect(stops[0]?.getAttribute('stop-color')).toBe('var(--accent)');
    expect(stops[1]?.getAttribute('stop-color')).toBe('var(--accent)');
  });
});

describe('useAreaGradient', () => {
  it('returns a stable, unique gradient id', () => {
    function Probe() {
      const { gradientId, def } = useAreaGradient({ colorVar: 'var(--accent)' });
      return (
        <svg role="img" aria-label="Test SVG canvas">
          <title>Test SVG canvas</title>
          {def}
          <rect data-testid="probe" data-grad-id={gradientId} />
        </svg>
      );
    }
    const { container } = render(<Probe />);
    const probe = container.querySelector('[data-testid="probe"]');
    const gradientId = probe?.getAttribute('data-grad-id') ?? '';
    expect(gradientId).toMatch(/^area-grad-/);
    // The gradient definition should reference the same id.
    const gradient = container.querySelector('linearGradient');
    expect(gradient?.getAttribute('id')).toBe(gradientId);
  });

  it('produces distinct gradient ids across multiple instances', () => {
    function Multi() {
      const a = useAreaGradient({ colorVar: 'var(--chart-series-1)' });
      const b = useAreaGradient({ colorVar: 'var(--chart-series-2)' });
      return (
        <svg role="img" aria-label="Test SVG canvas">
          <title>Test SVG canvas</title>
          {a.def}
          {b.def}
          <rect data-testid="a" data-id={a.gradientId} />
          <rect data-testid="b" data-id={b.gradientId} />
        </svg>
      );
    }
    const { container } = render(<Multi />);
    const aId = container.querySelector('[data-testid="a"]')?.getAttribute('data-id');
    const bId = container.querySelector('[data-testid="b"]')?.getAttribute('data-id');
    expect(aId).not.toBe(bId);
  });
});

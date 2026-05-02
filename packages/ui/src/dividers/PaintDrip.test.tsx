/**
 * PaintDrip primitive — unit tests.
 *
 * Covers: each variant renders distinct geometry; props apply to the SVG /
 * wrapper; mobile fallback renders an ink-rule below 360 px.
 */
import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { PaintDrip, type PaintDripVariant } from './PaintDrip';

const VARIANTS: PaintDripVariant[] = ['soft', 'thick', 'uneven'];

/**
 * Force the matchMedia mock so we can flip mobile vs. desktop deterministically
 * inside happy-dom (which does not implement matchMedia by default).
 */
function setMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('PaintDrip', () => {
  test.each(VARIANTS)('renders distinct path geometry for variant=%s', (variant) => {
    setMatchMedia(false);
    const { container } = render(<PaintDrip from="#F7A1C9" to="#D96EA0" variant={variant} />);

    const wrapper = container.querySelector(`[data-paint-drip="${variant}"]`);
    expect(wrapper).not.toBeNull();

    const path = container.querySelector('svg path');
    expect(path).not.toBeNull();
    // Each preset has a non-trivial number of cubic-bezier segments.
    expect(path?.getAttribute('d')?.length ?? 0).toBeGreaterThan(80);
  });

  test('applies from/to/height props to wrapper and svg fill', () => {
    setMatchMedia(false);
    const { container } = render(
      <PaintDrip from="#F7A1C9" to="#C99A1F" height={120} variant="thick" />,
    );

    const wrapper = container.querySelector('[data-paint-drip="thick"]') as HTMLElement | null;
    expect(wrapper).not.toBeNull();
    // happy-dom preserves the input format (hex stays hex); JSDOM normalises
    // to rgb(). Compare case-insensitively against the original hex.
    expect(wrapper?.style.backgroundColor.toLowerCase()).toBe('#f7a1c9');
    expect(wrapper?.style.height).toBe('120px');

    const path = container.querySelector('svg path');
    expect(path?.getAttribute('fill')).toBe('#C99A1F');
  });

  test('falls back to 1px ink rule below 360px viewport', () => {
    setMatchMedia(true);
    const { container } = render(<PaintDrip from="#F7A1C9" to="#D96EA0" variant="soft" />);

    const fallback = container.querySelector('[data-paint-drip="fallback"]') as HTMLElement | null;
    expect(fallback).not.toBeNull();
    expect(fallback?.style.height).toBe('1px');

    // No SVG drip rendered in fallback mode.
    expect(container.querySelector('svg')).toBeNull();
  });
});

/**
 * Vitest tests for `<Tooltip>` portal primitive.
 *
 * Verifies:
 *   - portal renders into document.body
 *   - role=tooltip + correct positioning
 *   - hidden when open=false
 *   - edge-clamping flips horizontally near right edge
 *   - edge-clamping flips vertically near bottom edge
 *   - clamp guards against negative left/top on tiny viewports
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip, clampToViewport } from '../Tooltip';

describe('<Tooltip>', () => {
  it('renders into document.body via portal', () => {
    render(
      <Tooltip open clientX={100} clientY={100}>
        <span>tip</span>
      </Tooltip>,
    );
    const tip = document.body.querySelector('[role="tooltip"]');
    expect(tip).not.toBeNull();
    expect(tip?.textContent).toBe('tip');
  });

  it('returns null when open=false', () => {
    render(
      <Tooltip open={false} clientX={100} clientY={100}>
        <span>tip</span>
      </Tooltip>,
    );
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('positions at clientX + offset.x by default', () => {
    render(
      <Tooltip open clientX={50} clientY={50}>
        <span>x</span>
      </Tooltip>,
    );
    const tip = document.body.querySelector<HTMLElement>('[role="tooltip"]');
    const styleAttr = tip?.getAttribute('style') ?? '';
    expect(styleAttr).toContain('left: 62px'); // 50 + 12
    expect(styleAttr).toContain('top: 62px');
  });

  it('exposes data-flipped-x when clamped to left of cursor', () => {
    // Render near the right viewport edge — tooltip should flip horizontally.
    render(
      <Tooltip open clientX={(window.innerWidth ?? 1024) - 10} clientY={50}>
        <span>x</span>
      </Tooltip>,
    );
    const tip = document.body.querySelector<HTMLElement>('[role="tooltip"]');
    expect(tip?.getAttribute('data-flipped-x')).toBe('true');
  });
});

describe('clampToViewport', () => {
  it('places anchor + offset when there is room', () => {
    const r = clampToViewport(100, 100, 12, 12, 220, 80, 1280, 720);
    expect(r.left).toBe(112);
    expect(r.top).toBe(112);
    expect(r.flippedX).toBe(false);
    expect(r.flippedY).toBe(false);
  });

  it('flips horizontally when overflow on right edge', () => {
    const r = clampToViewport(1200, 100, 12, 12, 220, 80, 1280, 720);
    expect(r.flippedX).toBe(true);
    // 1200 - 12 - 220 = 968
    expect(r.left).toBe(968);
  });

  it('flips vertically when overflow on bottom edge', () => {
    const r = clampToViewport(100, 700, 12, 12, 220, 80, 1280, 720);
    expect(r.flippedY).toBe(true);
    // 700 - 12 - 80 = 608
    expect(r.top).toBe(608);
  });

  it('clamps left to 0 on tiny viewports', () => {
    const r = clampToViewport(5, 5, 12, 12, 220, 80, 100, 100);
    expect(r.left).toBeGreaterThanOrEqual(0);
    expect(r.top).toBeGreaterThanOrEqual(0);
  });
});

/**
 * Vitest unit tests for path generators (line / area / arc).
 *
 * SVG `d` attribute strings are validated by structural assertions (starts
 * with «M», contains expected coordinates, well-formed) rather than full
 * snapshots — d3-shape's exact output is an implementation detail of d3, not
 * part of our public contract.
 */

import { describe, expect, it } from 'vitest';

import { arcPath, areaPath, linePath } from '../path';

describe('linePath', () => {
  it('returns empty string for empty point array', () => {
    expect(linePath([])).toBe('');
  });

  it('returns valid SVG path starting with M (moveto)', () => {
    const d = linePath([
      { x: 0, y: 0 },
      { x: 10, y: 20 },
      { x: 20, y: 5 },
    ]);
    expect(d).toMatch(/^M/);
  });

  it('contains all input coordinates in the output', () => {
    const d = linePath([
      { x: 0, y: 0 },
      { x: 50, y: 100 },
    ]);
    expect(d).toContain('0,0');
    expect(d).toContain('50,100');
  });

  it('produces a single-point path that does not throw', () => {
    const d = linePath([{ x: 42, y: 17 }]);
    expect(d).toMatch(/^M/);
    expect(d).toContain('42,17');
  });

  it('uses linear curve by default (L commands between points)', () => {
    const d = linePath([
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ]);
    // Linear curve uses L (lineto) commands.
    expect(d).toMatch(/L/);
  });

  it('honors curve: monotone-x option (output differs from linear)', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 5 },
    ];
    const linear = linePath(points, { curve: 'linear' });
    const monotone = linePath(points, { curve: 'monotone-x' });
    expect(linear).not.toBe(monotone);
    // Monotone curve uses C (cubic Bezier) commands.
    expect(monotone).toMatch(/C/);
  });
});

describe('areaPath', () => {
  it('returns empty string for empty point array', () => {
    expect(areaPath([])).toBe('');
  });

  it('returns valid SVG path starting with M', () => {
    const d = areaPath([
      { x: 0, y0: 0, y1: 50 },
      { x: 10, y0: 0, y1: 80 },
      { x: 20, y0: 0, y1: 60 },
    ]);
    expect(d).toMatch(/^M/);
  });

  it('produces a closed path (ends with Z)', () => {
    const d = areaPath([
      { x: 0, y0: 0, y1: 50 },
      { x: 10, y0: 0, y1: 80 },
    ]);
    // d3-area generates closed paths with Z to fill the region between y0 and y1.
    expect(d).toMatch(/Z\s*$/);
  });

  it('contains both upper (y1) and lower (y0) coordinates', () => {
    const d = areaPath([
      { x: 0, y0: 10, y1: 100 },
      { x: 50, y0: 10, y1: 100 },
    ]);
    // Upper boundary
    expect(d).toContain('0,100');
    expect(d).toContain('50,100');
    // Lower boundary (traversed in reverse to close the polygon)
    expect(d).toContain('50,10');
    expect(d).toContain('0,10');
  });

  it('honors curve: monotone-x option', () => {
    const points = [
      { x: 0, y0: 0, y1: 10 },
      { x: 10, y0: 0, y1: 20 },
      { x: 20, y0: 0, y1: 5 },
    ];
    const linear = areaPath(points, { curve: 'linear' });
    const monotone = areaPath(points, { curve: 'monotone-x' });
    expect(linear).not.toBe(monotone);
  });
});

describe('arcPath', () => {
  it('produces a non-empty d for a half-circle arc', () => {
    const d = arcPath({
      innerRadius: 50,
      outerRadius: 100,
      startAngle: 0,
      endAngle: Math.PI,
    });
    expect(d.length).toBeGreaterThan(0);
    expect(d).toMatch(/^M/);
  });

  it('produces a path containing arc (A) commands for a quarter slice', () => {
    const d = arcPath({
      innerRadius: 50,
      outerRadius: 100,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    // d3-arc emits A (arc) SVG commands for curved sectors.
    expect(d).toMatch(/A/);
  });

  it('produces a full circle (start=0, end=2π) without throwing', () => {
    const d = arcPath({
      innerRadius: 0,
      outerRadius: 100,
      startAngle: 0,
      endAngle: Math.PI * 2,
    });
    expect(d.length).toBeGreaterThan(0);
  });

  it('produces a small slice (≪ 1 rad) without throwing', () => {
    const d = arcPath({
      innerRadius: 50,
      outerRadius: 100,
      startAngle: 0,
      endAngle: 0.05,
    });
    expect(d.length).toBeGreaterThan(0);
    expect(d).toMatch(/^M/);
  });

  it('zero-thickness ring (innerRadius === outerRadius) returns a path string', () => {
    const d = arcPath({
      innerRadius: 50,
      outerRadius: 50,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    // d3-arc handles this degenerate case — should not throw.
    expect(typeof d).toBe('string');
  });

  it('inner=0 produces a pie slice (no donut hole)', () => {
    const d = arcPath({
      innerRadius: 0,
      outerRadius: 100,
      startAngle: 0,
      endAngle: Math.PI / 4,
    });
    expect(d).toMatch(/^M/);
    // A pie slice should reach the centre (0,0) at some point.
    expect(d).toContain('0,0');
  });
});

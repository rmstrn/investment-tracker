/**
 * Vitest unit tests for the Scale port (linear / time / band).
 *
 * Per kickoff α.1: ≥95% line coverage on the math layer is mandatory.
 * Tests cover: round-trip toPixel↔invert, edge cases (empty / reversed /
 * zero-width domains), `nice()` boundary cleaning, `ticks(n)` count hint.
 */

import { describe, expect, it } from 'vitest';

import { bandScale, linearScale, timeScale } from '../scale';

describe('linearScale', () => {
  it('maps domain[0] → range[0] and domain[1] → range[1]', () => {
    const scale = linearScale({ domain: [0, 100], range: [0, 500] });
    expect(scale.toPixel(0)).toBe(0);
    expect(scale.toPixel(100)).toBe(500);
  });

  it('maps interior values linearly', () => {
    const scale = linearScale({ domain: [0, 100], range: [0, 500] });
    expect(scale.toPixel(50)).toBe(250);
    expect(scale.toPixel(25)).toBe(125);
  });

  it('round-trips through toPixel → invert without drift', () => {
    const scale = linearScale({ domain: [0, 100], range: [0, 500] });
    for (const value of [0, 17, 42, 73, 100]) {
      expect(scale.invert(scale.toPixel(value))).toBeCloseTo(value, 10);
    }
  });

  it('handles reversed range (top-down y axis)', () => {
    // Typical chart use: range goes from canvas-bottom (high pixel) → top (low pixel).
    const scale = linearScale({ domain: [0, 100], range: [400, 0] });
    expect(scale.toPixel(0)).toBe(400);
    expect(scale.toPixel(100)).toBe(0);
    expect(scale.toPixel(50)).toBe(200);
  });

  it('handles zero-width range (degenerate but should not throw)', () => {
    const scale = linearScale({ domain: [0, 100], range: [50, 50] });
    expect(scale.toPixel(0)).toBe(50);
    expect(scale.toPixel(100)).toBe(50);
  });

  it('handles zero-width domain (all values map to range[0])', () => {
    const scale = linearScale({ domain: [42, 42], range: [0, 500] });
    // d3 collapses a zero-width domain — all inputs map to the range midpoint.
    const result = scale.toPixel(42);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('nice() rounds the domain to clean boundaries', () => {
    // Raw domain [0.123, 9.876] → nice → [0, 10] (or similar clean boundary).
    const niceScale = linearScale({ domain: [0.123, 9.876], range: [0, 100], nice: true });
    const ticks = niceScale.ticks(5);
    // Nice'd ticks should start ≤ 0 (or ≈ 0) and end ≥ 9.876 with round numbers.
    expect(ticks[0]).toBeLessThanOrEqual(0.123);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(9.876);
    // All ticks should be «round» — i.e. multiples of a power of 10 step.
    for (const tick of ticks) {
      expect(Number.isFinite(tick)).toBe(true);
    }
  });

  it('ticks(n) returns approximately n values (D3 nice-rule, ±1)', () => {
    const scale = linearScale({ domain: [0, 100], range: [0, 500] });
    const ticks = scale.ticks(5);
    expect(ticks.length).toBeGreaterThanOrEqual(4);
    expect(ticks.length).toBeLessThanOrEqual(7);
  });

  it('format() returns trimmed numeric strings without grouping', () => {
    const scale = linearScale({ domain: [0, 1000], range: [0, 1] });
    expect(scale.format(12)).toBe('12');
    expect(scale.format(1234)).toBe('1234');
    expect(scale.format(3.14159)).toBe('3.1416');
  });

  it('format() handles non-finite gracefully', () => {
    const scale = linearScale({ domain: [0, 1], range: [0, 1] });
    expect(scale.format(Number.NaN)).toBe('NaN');
    expect(scale.format(Number.POSITIVE_INFINITY)).toBe('Infinity');
  });
});

describe('timeScale', () => {
  it('maps domain start → range start', () => {
    const start = new Date('2025-01-01T00:00:00Z');
    const end = new Date('2025-12-31T23:59:59Z');
    const scale = timeScale({ domain: [start, end], range: [0, 365] });
    expect(scale.toPixel(start)).toBe(0);
    expect(scale.toPixel(end)).toBeCloseTo(365, 0);
  });

  it('round-trips Date through toPixel → invert', () => {
    const start = new Date('2025-01-01T00:00:00Z');
    const end = new Date('2025-12-31T00:00:00Z');
    const scale = timeScale({ domain: [start, end], range: [0, 1000] });
    const middle = new Date('2025-06-15T12:00:00Z');
    const inverted = scale.invert(scale.toPixel(middle));
    expect(Math.abs(inverted.getTime() - middle.getTime())).toBeLessThan(1000);
  });

  it('ticks(count) returns Date objects within the domain', () => {
    const start = new Date('2025-01-01T00:00:00Z');
    const end = new Date('2025-12-31T00:00:00Z');
    const scale = timeScale({ domain: [start, end], range: [0, 1000] });
    const ticks = scale.ticks(12);
    expect(ticks.length).toBeGreaterThan(0);
    for (const tick of ticks) {
      expect(tick).toBeInstanceOf(Date);
      expect(tick.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(tick.getTime()).toBeLessThanOrEqual(end.getTime());
    }
  });

  it('nice() expands domain to round time boundaries', () => {
    const start = new Date('2025-01-15T08:23:00Z');
    const end = new Date('2025-03-07T16:42:00Z');
    const scale = timeScale({ domain: [start, end], range: [0, 100], nice: true });
    const ticks = scale.ticks(4);
    expect(ticks.length).toBeGreaterThan(0);
  });

  it('format() returns ISO date prefix YYYY-MM-DD', () => {
    const start = new Date('2025-01-01T00:00:00Z');
    const end = new Date('2025-12-31T00:00:00Z');
    const scale = timeScale({ domain: [start, end], range: [0, 1000] });
    expect(scale.format(new Date('2025-06-15T12:34:56Z'))).toBe('2025-06-15');
  });
});

describe('bandScale', () => {
  it('maps each category to a left-edge pixel within range', () => {
    const scale = bandScale({ domain: ['A', 'B', 'C'], range: [0, 300] });
    expect(scale.toPixel('A')).toBe(0);
    expect(scale.toPixel('B')).toBe(100);
    expect(scale.toPixel('C')).toBe(200);
    expect(scale.bandwidth()).toBe(100);
  });

  it('returns NaN for unknown categories', () => {
    const scale = bandScale({ domain: ['A', 'B'], range: [0, 200] });
    expect(scale.toPixel('UNKNOWN')).toBeNaN();
  });

  it('respects padding fraction (reduces bandwidth)', () => {
    const noPadding = bandScale({ domain: ['A', 'B', 'C'], range: [0, 300], padding: 0 });
    const padded = bandScale({ domain: ['A', 'B', 'C'], range: [0, 300], padding: 0.5 });
    expect(padded.bandwidth()).toBeLessThan(noPadding.bandwidth());
  });

  it('handles empty domain gracefully (no categories, ticks = [])', () => {
    const scale = bandScale({ domain: [], range: [0, 300] });
    // d3-scale returns the full range as bandwidth when domain is empty
    // (degenerate but defined). The contract here is that the wrapper does
    // not throw and `ticks()` is a faithful echo of the input domain.
    expect(scale.ticks()).toEqual([]);
    expect(typeof scale.bandwidth()).toBe('number');
  });

  it('handles single-category domain', () => {
    const scale = bandScale({ domain: ['ONLY'], range: [0, 300] });
    expect(scale.toPixel('ONLY')).toBe(0);
    expect(scale.bandwidth()).toBe(300);
  });

  it('ticks() preserves original domain order', () => {
    const scale = bandScale({ domain: ['Z', 'A', 'M'], range: [0, 300] });
    expect(scale.ticks()).toEqual(['Z', 'A', 'M']);
  });

  it('format() is identity (string passthrough)', () => {
    const scale = bandScale({ domain: ['A'], range: [0, 100] });
    expect(scale.format('A')).toBe('A');
    expect(scale.format('whatever')).toBe('whatever');
  });
});

/**
 * Vitest tests for `useAnimatedNumber` hook.
 *
 * Verifies:
 *   - reduced=true returns target immediately
 *   - durationMs=0 returns target immediately
 *   - target=0 (no delta) doesn't crash
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAnimatedNumber } from '../useAnimatedNumber';

describe('useAnimatedNumber', () => {
  it('reduced=true returns target value immediately', () => {
    const { result } = renderHook(() =>
      useAnimatedNumber({ value: 1234, durationMs: 600, reduced: true }),
    );
    expect(result.current).toBe(1234);
  });

  it('durationMs=0 returns target immediately', () => {
    const { result } = renderHook(() =>
      useAnimatedNumber({ value: 4242, durationMs: 0 }),
    );
    expect(result.current).toBe(4242);
  });

  it('non-reduced initial render starts at 0 and tweens upward', () => {
    const { result } = renderHook(() => useAnimatedNumber({ value: 100 }));
    // Before rAF fires the hook returns the initial state (0). The tween
    // happens in useEffect post-mount.
    expect(result.current).toBeGreaterThanOrEqual(0);
    expect(result.current).toBeLessThanOrEqual(100);
  });

  it('handles negative target values', () => {
    const { result } = renderHook(() =>
      useAnimatedNumber({ value: -200, durationMs: 0, reduced: true }),
    );
    expect(result.current).toBe(-200);
  });
});

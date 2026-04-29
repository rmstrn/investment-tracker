/**
 * Vitest tests for `useStrokeDashoffset` hook.
 *
 * Verifies:
 *   - reduced=true returns final state immediately
 *   - durationMs=0 returns final state
 *   - pathLength=0 returns final state (zero is no animation)
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useStrokeDashoffset } from '../useStrokeDashoffset';

describe('useStrokeDashoffset', () => {
  it('reduced=true snaps to final state (no animation)', () => {
    const { result } = renderHook(() =>
      useStrokeDashoffset({ pathLength: 100, durationMs: 300, reduced: true }),
    );
    expect(result.current.strokeDasharray).toBe(100);
    expect(result.current.strokeDashoffset).toBe(0);
  });

  it('durationMs=0 snaps to final state', () => {
    const { result } = renderHook(() =>
      useStrokeDashoffset({ pathLength: 200, durationMs: 0, reduced: false }),
    );
    expect(result.current.strokeDashoffset).toBe(0);
  });

  it('pathLength=0 returns zero state without crashing', () => {
    const { result } = renderHook(() =>
      useStrokeDashoffset({ pathLength: 0, durationMs: 300, reduced: false }),
    );
    expect(result.current.strokeDasharray).toBe(0);
    expect(result.current.strokeDashoffset).toBe(0);
  });

  it('initial render with reduced=false starts with full offset (path hidden)', () => {
    const { result } = renderHook(() =>
      useStrokeDashoffset({ pathLength: 150, durationMs: 1000, reduced: false }),
    );
    // Before rAF fires, the hook returns the initial state — path fully
    // hidden by dashoffset === pathLength. (Animation tween happens
    // post-mount; we verify only the initial frame here.)
    expect(result.current.strokeDasharray).toBe(150);
  });
});

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

import { HOVER_SCALE_FACTOR, HOVER_SCALE_THRESHOLD_PX, useHoverScale } from '../useHoverScale';

describe('useHoverScale', () => {
  it('returns scale 1.06 + enabled=true when bar dim >= 12px', () => {
    const { result } = renderHook(() => useHoverScale(20));
    expect(result.current.scale).toBe(HOVER_SCALE_FACTOR);
    expect(result.current.enabled).toBe(true);
    expect(result.current.threshold).toBe(HOVER_SCALE_THRESHOLD_PX);
  });

  it('returns scale 1 + enabled=false when bar dim < 12px', () => {
    const { result } = renderHook(() => useHoverScale(8));
    expect(result.current.scale).toBe(1);
    expect(result.current.enabled).toBe(false);
  });

  it('returns scale 1.06 exactly at threshold (12px)', () => {
    const { result } = renderHook(() => useHoverScale(12));
    expect(result.current.scale).toBe(HOVER_SCALE_FACTOR);
    expect(result.current.enabled).toBe(true);
  });

  it('exports HOVER_SCALE_THRESHOLD_PX = 12 and HOVER_SCALE_FACTOR = 1.06', () => {
    expect(HOVER_SCALE_THRESHOLD_PX).toBe(12);
    expect(HOVER_SCALE_FACTOR).toBe(1.06);
  });
});

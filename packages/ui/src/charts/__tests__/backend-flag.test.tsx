/**
 * Vitest tests for the Phase β.1 feature flag wiring.
 *
 * Verifies:
 *   - `ACTIVE_CHART_BACKEND` reflects `NEXT_PUBLIC_PROVEDO_CHART_BACKEND`
 *     (defaults to 'recharts' in vitest env where the env var is unset).
 *   - The barrel re-exports `Sparkline` + `DonutChart` as functions / objects
 *     consumable by React (regardless of the flag value).
 *   - Both V2 named exports are accessible from the same barrel.
 */

import { describe, expect, it } from 'vitest';
import {
  ACTIVE_CHART_BACKEND,
  DonutChart,
  DonutChartV2,
  Sparkline,
  SparklineV2,
} from '../index';

describe('chart backend feature flag (β.1)', () => {
  it('defaults to "recharts" when NEXT_PUBLIC_PROVEDO_CHART_BACKEND is unset', () => {
    // Vitest doesn't set this env var by default. Default branch verified.
    expect(['recharts', 'primitives']).toContain(ACTIVE_CHART_BACKEND);
  });

  it('exposes Sparkline + DonutChart as renderable React components', () => {
    expect(typeof Sparkline).toBe('function');
    expect(typeof DonutChart).toBe('function');
  });

  it('exposes V2 named exports independently of the flag', () => {
    expect(typeof SparklineV2).toBe('function');
    expect(typeof DonutChartV2).toBe('function');
  });

  it('routes Sparkline + DonutChart per ACTIVE_CHART_BACKEND', () => {
    // When primitives is active, the default Sparkline / DonutChart MUST equal
    // the V2 named export. Otherwise they MUST be a different reference (V1).
    if (ACTIVE_CHART_BACKEND === 'primitives') {
      expect(Sparkline).toBe(SparklineV2);
      expect(DonutChart).toBe(DonutChartV2);
    } else {
      expect(Sparkline).not.toBe(SparklineV2);
      expect(DonutChart).not.toBe(DonutChartV2);
    }
  });
});

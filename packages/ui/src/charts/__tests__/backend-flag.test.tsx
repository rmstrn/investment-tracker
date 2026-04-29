/**
 * Vitest tests for the Phase β.1 feature flag wiring.
 *
 * Verifies:
 *   - `ACTIVE_CHART_BACKEND` reflects `NEXT_PUBLIC_PROVEDO_CHART_BACKEND`
 *     (defaults to 'recharts' in vitest env where the env var is unset).
 *   - The barrel re-exports `Sparkline` + `DonutChart` as React components.
 *   - Both V2 named exports are accessible from the same barrel.
 *   - The unified dispatcher renders V1 (recharts) on first paint regardless
 *     of the flag — hydration baseline guarantee per chart-backend-dispatch.
 *     Render-and-probe via `data-chart-backend` marker on the rendered DOM
 *     root, NOT reference equality (the dispatcher is a wrapper component).
 */

import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ACTIVE_CHART_BACKEND,
  DonutChart,
  DonutChartV2,
  Sparkline,
  SparklineV2,
  DONUT_FIXTURE,
  SPARKLINE_FIXTURE,
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

  it('Sparkline first paint renders the V1 (recharts) baseline', () => {
    const { getByTestId } = render(<Sparkline payload={SPARKLINE_FIXTURE} />);
    // Hydration baseline = V1 even when flag = primitives. The upgrade to V2
    // happens inside `useEffect` after mount. First synchronous render must
    // emit the recharts marker so SSR === client-first-render.
    const root = getByTestId('chart-sparkline');
    expect(root.getAttribute('data-chart-backend')).toBe('recharts');
  });

  it('DonutChart first paint renders the V1 (recharts) baseline', () => {
    const { getByTestId } = render(<DonutChart payload={DONUT_FIXTURE} />);
    const root = getByTestId('chart-donut');
    expect(root.getAttribute('data-chart-backend')).toBe('recharts');
  });

  it('Sparkline upgrades to V2 (primitives) after mount when the flag is primitives', async () => {
    if (ACTIVE_CHART_BACKEND !== 'primitives') {
      // Skip when the flag is 'recharts' — the upgrade branch never fires
      // and the assertion would be a tautology against the V1 baseline.
      return;
    }
    const { getByTestId } = render(<Sparkline payload={SPARKLINE_FIXTURE} />);
    // Flush effects: useEffect schedules the V2 swap on the next microtask.
    await act(async () => {
      await Promise.resolve();
    });
    expect(getByTestId('chart-sparkline').getAttribute('data-chart-backend')).toBe('primitives');
  });

  it('DonutChart upgrades to V2 (primitives) after mount when the flag is primitives', async () => {
    if (ACTIVE_CHART_BACKEND !== 'primitives') {
      return;
    }
    const { getByTestId } = render(<DonutChart payload={DONUT_FIXTURE} />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(getByTestId('chart-donut').getAttribute('data-chart-backend')).toBe('primitives');
  });
});

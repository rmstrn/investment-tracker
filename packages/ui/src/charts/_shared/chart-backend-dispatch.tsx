'use client';

/**
 * SSR-safe V1/V2 chart backend dispatcher + active-backend resolver.
 *
 * Workspace-package boundary makes `process.env.NEXT_PUBLIC_*` resolve
 * asymmetrically across the server / client bundle (see commentary in
 * `packages/ui/src/charts/index.ts`). To eliminate the resulting React
 * hydration mismatch, the dispatcher renders V1 on the server and first
 * client paint (deterministic baseline), then upgrades to V2 after mount
 * if the runtime flag resolves to `'primitives'`.
 *
 * Cost: one re-render on first paint when the flag = primitives. No cost
 * when flag = recharts (the upgrade branch never fires).
 *
 * V1 + V2 share the same `*Props` type contract; the dispatcher does not
 * narrow or alter props.
 *
 * ────────────────────────────────────────────────────────────────────
 * `getActiveBackend()` — single source of truth
 * ────────────────────────────────────────────────────────────────────
 * `getActiveBackend()` is the canonical resolver for the chart-backend
 * flag. It reads `process.env.NEXT_PUBLIC_PROVEDO_CHART_BACKEND` ONCE at
 * module-evaluation time and caches the value as a module-level constant.
 * Every other module in `@investment-tracker/ui/charts` delegates to it
 * (the barrel's `ACTIVE_CHART_BACKEND` const + the dispatcher's render
 * gate). Closes TD-117.
 *
 * Per-consumer cache (NOT global):
 * The workspace-package boundary means each consumer (apps/web, Vitest
 * unit tests, future Storybook, future mobile bundle) gets its own
 * module instance, so the cache is per-consumer. Each consumer is
 * responsible for echoing the env var into its own bundle config:
 *
 *   - apps/web        — `next.config.ts` `env:` block (already wired).
 *   - Vitest          — `setup.ts` should `process.env.NEXT_PUBLIC_PROVEDO_CHART_BACKEND ??= 'recharts'`.
 *   - Storybook       — `preview.tsx` should set the env var before charts render.
 *   - Mobile bundle   — bundler config must inline `NEXT_PUBLIC_*` symmetrically.
 *
 * See `docs/design/CHARTS_SPEC.md` §3.13 for the full consumer-setup matrix.
 */

import { useEffect, useState, type ComponentType } from 'react';

export type ChartBackend = 'recharts' | 'primitives';

/**
 * Read the env var once at module-eval time. The optional chain on
 * `process.env` defends against non-Node runtimes (e.g. browser bundle
 * pre-Turbopack-inline). The narrow `=== 'primitives'` test rejects any
 * unexpected value and falls back to the safe default.
 */
const ACTIVE_BACKEND: ChartBackend = (() => {
  const raw =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PROVEDO_CHART_BACKEND) || 'recharts';
  return raw === 'primitives' ? 'primitives' : 'recharts';
})();

/**
 * Returns the active chart backend resolved from
 * `NEXT_PUBLIC_PROVEDO_CHART_BACKEND` at module-evaluation time.
 *
 * Per-consumer cached — each workspace-package consumer instance has its
 * own cached read. Within a consumer, every call returns the same value;
 * mutating `process.env` after module load does NOT change the result.
 *
 * Render paths must NOT call this directly — go through
 * `makeBackendDispatch` which handles the SSR / first-paint baseline.
 * `getActiveBackend` is for: tests, dev tooling, the barrel's
 * `ACTIVE_CHART_BACKEND` re-export, and the dispatcher's post-mount swap.
 */
export function getActiveBackend(): ChartBackend {
  return ACTIVE_BACKEND;
}

/**
 * Build a dispatcher component for a (V1, V2) pair. The returned component
 * is a normal React function component — `'use client'` already applied at
 * the file boundary, so it can sit anywhere V1/V2 themselves can sit.
 *
 * Generic shape:
 *   - `P1` = V1 prop type (legacy / Recharts implementation).
 *   - `P2 extends P1` = V2 prop type (primitives implementation; superset of P1).
 *
 * The dispatcher's public surface is `ComponentType<P2>` so consumers can
 * pass V2-only optional props (`cornerRadius`, `startAngleRadians`, etc.)
 * through the unified export. V1 receives those extras at runtime but
 * destructures only its known fields, so the unknown props are silently
 * dropped — Liskov-safe by construction.
 *
 * `displayName` propagates so React DevTools + error stack traces stay
 * legible.
 */
export function makeBackendDispatch<P1 extends object, P2 extends P1>(
  V1: ComponentType<P1>,
  V2: ComponentType<P2>,
  displayName: string,
): ComponentType<P2> {
  function ChartBackendDispatch(props: P2) {
    // Hydration baseline = V1. Mirrors what SSR renders when the workspace
    // package falls back to 'recharts'. After mount, we re-read the env
    // (which on the client is pinned by `next.config.ts` env block) and
    // upgrade to V2 if the flag is 'primitives'.
    const [usePrimitives, setUsePrimitives] = useState(false);

    useEffect(() => {
      if (getActiveBackend() === 'primitives') {
        setUsePrimitives(true);
      }
    }, []);

    if (usePrimitives) {
      return <V2 {...props} />;
    }
    // V1 accepts P1; P2 IS-A P1 by the generic constraint, so P2 props
    // are structurally assignable to P1. Extras (e.g. `cornerRadius`) are
    // ignored by V1's destructure at runtime.
    return <V1 {...props} />;
  }

  ChartBackendDispatch.displayName = `ChartBackendDispatch(${displayName})`;
  return ChartBackendDispatch;
}

'use client';

/**
 * SSR-safe V1/V2 chart backend dispatcher.
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
 */

import { useEffect, useState, type ComponentType } from 'react';

function readBackend(): 'recharts' | 'primitives' {
  // `process.env` is non-nullable in `@types/node`; we only need the
  // `typeof process !== 'undefined'` guard for non-Node runtimes
  // (e.g. browser bundle pre-Turbopack-inline). The optional chain on
  // `process.env` was dead-typed and confused readers.
  const raw =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PROVEDO_CHART_BACKEND) ||
    'recharts';
  return raw === 'primitives' ? 'primitives' : 'recharts';
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
      if (readBackend() === 'primitives') {
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

'use client';

import type { RateLimitSnapshot } from '@investment-tracker/api-client';
import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

interface RateLimitContextValue {
  snapshot: RateLimitSnapshot | null;
  setSnapshot: (snapshot: RateLimitSnapshot) => void;
}

const Ctx = createContext<RateLimitContextValue | null>(null);

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshotState] = useState<RateLimitSnapshot | null>(null);
  const setSnapshot = useCallback((next: RateLimitSnapshot) => {
    // Only accept monotonically-decreasing remaining within the same window;
    // responses from the cache can race and undo a more-recent update.
    setSnapshotState((prev) => {
      if (!prev) return next;
      if (next.resetAt !== prev.resetAt) return next;
      if (next.remaining <= prev.remaining) return next;
      return prev;
    });
  }, []);
  const value = useMemo(() => ({ snapshot, setSnapshot }), [snapshot, setSnapshot]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Read the most recent `X-RateLimit-*` snapshot surfaced by the API
 * client. Returns `{snapshot: null, setSnapshot}` outside a provider so
 * UI code degrades to "no limit data yet" without throwing — the chat
 * surface must render at startup before any request has completed.
 */
export function useRateLimit(): RateLimitContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) return { snapshot: null, setSnapshot: noop };
  return ctx;
}

function noop(): void {
  // swallow
}

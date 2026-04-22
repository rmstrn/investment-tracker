'use client';

import { useCallback, useEffect, useState } from 'react';

const SESSION_KEY = 'insights.dismissed.v1';

function readFromSession(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed as string[]);
  } catch {
    // sessionStorage unavailable or corrupt — return empty set
  }
  return new Set();
}

function writeToSession(ids: Set<string>): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...ids]));
  } catch {
    // sessionStorage unavailable — best-effort, no throw
  }
}

export interface UseLocalDismissedInsightsResult {
  dismiss: (id: string) => void;
  isDismissed: (id: string) => boolean;
  reset: () => void;
}

/**
 * Tracks locally dismissed insight IDs in React state, mirrored to
 * `sessionStorage` so they persist across re-renders but reset on page
 * reload (keeping backend unaware — that's Slice 6b).
 *
 * Hydration-safe: sessionStorage read happens only in `useEffect`.
 */
export function useLocalDismissedInsights(): UseLocalDismissedInsightsResult {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Hydrate from sessionStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setDismissed(readFromSession());
  }, []);

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      writeToSession(next);
      return next;
    });
  }, []);

  const isDismissed = useCallback((id: string) => dismissed.has(id), [dismissed]);

  const reset = useCallback(() => {
    setDismissed(new Set());
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // best-effort
    }
  }, []);

  return { dismiss, isDismissed, reset };
}

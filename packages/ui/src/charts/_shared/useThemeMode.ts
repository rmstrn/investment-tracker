/**
 * useThemeMode — thin hook reading the active theme from `<html>`.
 *
 * Reads BOTH conventions present in the codebase:
 *   - `document.documentElement.dataset.theme === 'dark'` (data-theme ADR)
 *   - `document.documentElement.classList.contains('dark')` (legacy class)
 *
 * Re-renders subscribers via a `MutationObserver` watching `<html>`'s `class`
 * + `data-theme` attributes. Safe under SSR (returns `'light'` on the server +
 * during hydration; flips after the first paint on the client).
 *
 * Used by chart primitives that pre-render both light and dark gradient sets
 * in `<defs>` and toggle which set is active (e.g. `DonutChartV2` per
 * `DONUT_GRADIENT_v2_draft.md` Option A — `userSpaceOnUse` requires hex
 * values, so theme-aware re-rendering is needed instead of plain CSS vars).
 */

import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export function readThemeMode(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  const html = document.documentElement;
  const isDark = html.classList.contains('dark') || html.dataset.theme === 'dark';
  return isDark ? 'dark' : 'light';
}

export function useThemeMode(): ThemeMode {
  // SSR-safe: server + first client render return `'light'`; after mount the
  // effect resyncs to the actual document state. Accept a 1-frame light flash
  // on dark-theme cold-load (kickoff §«Risks» item 1).
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;

    setMode(readThemeMode());

    const observer = new MutationObserver(() => setMode(readThemeMode()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return mode;
}

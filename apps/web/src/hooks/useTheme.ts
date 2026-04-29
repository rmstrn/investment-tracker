'use client';

import { useCallback, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY, type Theme } from '../lib/theme';

/**
 * Read + write the active theme (`data-theme` on <html>).
 *
 * Intended for the future theme-toggle UI (out-of-phase for DSM-V1 α).
 * Subscribes to `prefers-color-scheme` changes when no user override is set.
 *
 * Returns:
 *   - `theme`     — current resolved theme ("light" | "dark"); `null` until mount
 *                   to avoid SSR/CSR mismatch
 *   - `setTheme`  — set explicit user override (persists to localStorage)
 *   - `clearTheme`— remove the override and fall back to system preference
 */
export function useTheme(): {
  theme: Theme | null;
  setTheme: (next: Theme) => void;
  clearTheme: () => void;
} {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const initial = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setThemeState(initial);

    // If the user has not set an explicit override, follow system preference live.
    if (window.matchMedia) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = (event: MediaQueryListEvent) => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          return;
        }
        const next: Theme = event.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        setThemeState(next);
      };
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }

    return undefined;
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore — private browsing / quota
    }
    setThemeState(next);
  }, []);

  const clearTheme = useCallback(() => {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      // ignore
    }
    const next: Theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    document.documentElement.setAttribute('data-theme', next);
    setThemeState(next);
  }, []);

  return { theme, setTheme, clearTheme };
}

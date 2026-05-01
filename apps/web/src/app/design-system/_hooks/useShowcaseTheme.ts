'use client';

import { useEffect, useState } from 'react';

export type ShowcaseTheme = 'light' | 'dark';

/**
 * Read the global showcase theme written by `ShowcaseHeader` to
 * `<html data-theme>` and stay in sync as the user toggles.
 *
 * The header sets:
 *   - `documentElement.dataset.theme = 'light' | 'dark'`
 *   - `documentElement.classList.toggle('dark', isDark)`
 *
 * This hook subscribes via `MutationObserver` so any consumer component
 * can derive a `variant` prop without prop-drilling from the header or
 * lifting toggle state into a Context.
 *
 * SSR / first-paint safety: defaults to `'light'` until the effect runs,
 * matching the default `<html>` state. Avoids hydration mismatches because
 * the value only changes inside `useEffect`.
 */
export function useShowcaseTheme(): ShowcaseTheme {
  const [theme, setTheme] = useState<ShowcaseTheme>('light');

  useEffect(() => {
    const root = document.documentElement;

    const read = (): ShowcaseTheme => {
      const isDark = root.classList.contains('dark') || root.dataset.theme === 'dark';
      return isDark ? 'dark' : 'light';
    };

    setTheme(read());

    const observer = new MutationObserver(() => {
      setTheme(read());
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}

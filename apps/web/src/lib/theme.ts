/**
 * Theme — light / dark mechanism (Provedo design system v1.1 §11.4).
 *
 * Strategy: `data-theme="light"` / `data-theme="dark"` on `<html>`.
 * Resolution order on first paint:
 *   1. localStorage `theme` (user override; values: "light" | "dark")
 *   2. system preference via `prefers-color-scheme`
 *   3. fallback default: "light"
 *
 * SSR no-flicker: `THEME_INIT_SCRIPT` runs synchronously inside <head> before
 * React hydrates, so the correct `data-theme` is applied before first paint.
 *
 * Theme-toggle UI is intentionally out-of-scope for this phase — only the
 * mechanism + hook are exposed.
 */

export const THEME_STORAGE_KEY = 'theme';

export type Theme = 'light' | 'dark';

/**
 * Inline script source applied in <head>. Runs synchronously before
 * React hydration. Wrapped in IIFE; no external deps.
 */
export const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();`;

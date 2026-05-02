import { Geist, Geist_Mono } from 'next/font/google';

/**
 * D1 — «Lime Cabin» fonts.
 *
 * Faithful translation of the Pinterest reference. Single-family bet:
 * Geist Sans + Geist Mono — both Vercel/OFL on Google Fonts, both
 * variable. Total payload budget ~62 kb gzipped (Latin subset, WOFF2):
 *
 *  - Geist Sans (variable)   → display + UI body (400/500/600)
 *  - Geist Mono (variable)   → ALL money figures, percentages, dates,
 *                              tickers, kbd-chips, axis ticks (400/500)
 *
 * Loading discipline (per D1-faithful.md §4):
 *   - Preload Geist Sans (above-the-fold welcome name + nav).
 *   - Geist Mono `display: 'swap'` — system mono fallback is
 *     `ui-monospace, SFMono-Regular, Menlo` which renders identically
 *     enough on tabular numerals to avoid layout shift.
 *   - `font-feature-settings: "tnum" 1` applied at the route root in CSS.
 *
 * Variables prefixed `--font-d1-*` so they cannot collide with R-series
 * or other D-series routes loaded in the same dev session.
 */

export const geistD1 = Geist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-d1-sans',
});

export const geistMonoD1 = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-d1-mono',
});

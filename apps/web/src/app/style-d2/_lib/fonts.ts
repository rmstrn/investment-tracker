import { Inter } from 'next/font/google';

/**
 * D2 — «Daylight Provedo» fonts.
 *
 * Light-mode translation of the Pinterest reference. Single-family bet:
 * Inter Variable on Google Fonts (OFL). Total payload budget ~52 kb
 * gzipped (Latin subset, WOFF2). The bet (per D2-light-variant.md §4)
 * is single-family discipline on cream — light fintech dashboards that
 * reach for a serif pair to feel «editorial» end up looking like a
 * legal firm. Provedo is operational, not editorial.
 *
 *  - Inter (variable)   → display + UI + numerals (all surfaces)
 *
 * Loading discipline (per D2 §4):
 *   - Preload Inter (above-the-fold welcome name + nav).
 *   - `font-feature-settings: "tnum" 1` applied at the route root in CSS,
 *     so every numeral path renders tabular by default.
 *
 * Variables prefixed `--font-d2-*` so they cannot collide with R-series
 * or other D-series routes loaded in the same dev session.
 */

export const interD2 = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-d2-sans',
});

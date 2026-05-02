import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';

/**
 * D3 — «Private Dossier» fonts.
 *
 * Luxe (Mercury × Hermès) translation of the Pinterest reference. Three
 * families, all OFL on Google Fonts, all variable. Total payload budget
 * ~78 kb gzipped (Latin subset, WOFF2):
 *
 *  - Fraunces (variable, opsz axis)   → display only — welcome name (opsz 56),
 *                                       KPI numeral (opsz 44), drilldown H2.
 *                                       FORBIDDEN in body / chip / button /
 *                                       axis / tooltip. This is the single
 *                                       most important discipline rule for D3.
 *  - Inter (variable)                 → all UI body, labels, chips, buttons,
 *                                       AI message body, eyebrow, sub-copy
 *  - JetBrains Mono (variable)        → axis ticks, tooltip values, KPI delta
 *                                       line, AI absolute-time bylines only
 *
 * Loading discipline (per D3-luxe-variant.md §4 + KICKOFF §3):
 *   - Preload Inter (above-the-fold body weight) + Fraunces (welcome name).
 *   - JetBrains Mono `display: 'swap'` — system mono fallback
 *     (`ui-monospace, SFMono-Regular, Menlo`) is identical enough on
 *     tabular numerals to avoid layout shift.
 *
 * Variables prefixed `--font-d3-*` so they cannot collide with the
 * R-series or other D-series routes loaded in the same dev session.
 */

export const frauncesD3 = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  preload: true,
  variable: '--font-d3-display',
});

export const interD3 = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-d3-sans',
});

export const jetbrainsMonoD3 = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-d3-mono',
});

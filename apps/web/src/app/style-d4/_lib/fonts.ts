import { Inter, JetBrains_Mono } from 'next/font/google';

/**
 * D4 — «Provedo Console» fonts.
 *
 * Linear app interior × the Pinterest reference's lime/purple. Two
 * families, both OFL on Google Fonts, both variable. Total payload
 * budget ~60 kb gzipped (Latin subset, WOFF2):
 *
 *  - Inter (variable)               → all UI body, nav, welcome name,
 *                                     buttons, AI message body, labels,
 *                                     filter chips, table primary cells,
 *                                     `⌘K` palette result text.
 *  - JetBrains Mono (variable)      → ALL money figures, percentages,
 *                                     tickers, kbd-chips, table numeric
 *                                     cells, axis ticks. STRICT allow-list
 *                                     (numerals / kbd / tickers ONLY).
 *
 * Why JetBrains Mono and not Geist Mono: per spec §4, Geist Mono's
 * slash-zero reads as cosplay-y at table density (32px row height).
 * JetBrains Mono ships a subtler `0` (no slash by default) and a slightly
 * warmer rhythm at 12-13px where density bites hardest.
 *
 * Loading discipline (per D4 spec §4 + KICKOFF §3):
 *   - Preload Inter (above-the-fold welcome name + dense KPI labels).
 *   - JetBrains Mono `display: 'swap'` — system mono fallback
 *     (`ui-monospace, SFMono-Regular, Menlo`) is identical enough on
 *     tabular numerals to avoid layout shift in the dense holdings table.
 *   - `font-feature-settings: "tnum" 1` applied at the route root in CSS.
 *
 * Variables prefixed `--font-d4-*` so they cannot collide with R-series
 * or other D-series routes loaded in the same dev session.
 */

export const interD4 = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-d4-sans',
});

export const jetbrainsMonoD4 = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-d4-mono',
});

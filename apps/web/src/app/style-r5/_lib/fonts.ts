import { Fraunces, Inter } from 'next/font/google';

/**
 * R5 — «Atelier» fonts.
 *
 * Modern luxe / sculpted / aspirational stance. Two families, both OFL on
 * Google Fonts, both variable, total payload budget ~62 kb gzipped (Latin
 * subset, WOFF2):
 *
 *  - Fraunces (variable, opsz axis)        → display / headline (≥48px only)
 *  - Inter (variable, wght axis)           → body / UI / numerals (tabular)
 *
 * Single-axis discipline per spec §4: no third family, no italic display, no
 * all-caps decoration. The serif is for narrative and identity; the sans is
 * for the truth (tabular numerals on every money figure).
 *
 * Loading discipline (per R5-modern-luxe.md §4 + KICKOFF §2):
 *   - Preload Fraunces (display weight) + Inter (body weight) — these carry
 *     the above-the-fold typography (headline + sub + CTA + AI card body).
 *   - `display: 'swap'` everywhere, never 'block', so we never FOIT.
 *
 * Variables prefixed `--font-r5-*` so they cannot collide with style-r1|r2|r3|r4
 * or any other comparison route loaded in the same dev session.
 */

export const frauncesR5 = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  preload: true,
  variable: '--font-r5-display',
});

export const interR5 = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-r5-body',
});

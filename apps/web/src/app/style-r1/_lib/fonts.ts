import { Fraunces, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';

/**
 * R1 — «The Ledger Quarterly» fonts.
 *
 * Editorial / type-led broadsheet stance. Three families, all OFL on Google
 * Fonts, all variable, total payload budget ≤ 90 kb (Latin-subset, WOFF2):
 *
 *  - Fraunces (variable, opsz + wght axes)  → display / masthead
 *  - Source Serif 4 (variable, wght axis)   → body / running text
 *  - JetBrains Mono (variable, wght axis)   → numerals / money / kbd / footnote
 *
 * Loading discipline (per R1-editorial-type-led.md §4):
 *   - Preload above-the-fold only — Fraunces (display weight) +
 *     Source Serif 4 (body weight). JetBrains Mono is NOT preloaded; it
 *     swaps in over a system mono fallback so figures stay tabular even
 *     pre-hydration.
 *   - `display: 'swap'` everywhere, never 'block', so we never FOIT.
 *
 * Variables are prefixed `--font-r1-*` so they cannot collide with the
 * other comparison routes loaded in the same dev session.
 */

export const frauncesR1 = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  preload: true,
  variable: '--font-r1-display',
});

export const sourceSerifR1 = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
  variable: '--font-r1-body',
});

export const jetbrainsMonoR1 = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-r1-mono',
});

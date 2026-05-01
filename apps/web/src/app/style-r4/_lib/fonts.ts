import { Fraunces, Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';

/**
 * R4 — «The Archivist's Study» fonts.
 *
 * Expressive / illustrated / character-led stance. Four families, all OFL on
 * Google Fonts, all variable, total payload budget ~88 kb gzipped (Latin
 * subset, WOFF2):
 *
 *  - Fraunces (variable, opsz axis)        → display / headline / italic captions
 *  - Inter (variable, wght axis)           → body / sub / disclosure
 *  - JetBrains Mono (variable, wght axis)  → ALL money / numerals / dates
 *  - Inter Tight (variable, wght axis)     → AI byline / section labels (small caps)
 *
 * Loading discipline (per R4-expressive-illustrated.md §4 + KICKOFF §2):
 *   - Preload Fraunces (display weight) + Inter (body weight) — these carry
 *     the above-the-fold typography.
 *   - JetBrains Mono + Inter Tight: `display: 'swap'`, `preload: false` —
 *     they swap in over system fallbacks; the vault card and AI byline are
 *     below the hero fold.
 *   - `display: 'swap'` everywhere, never 'block', so we never FOIT.
 *
 * Variables prefixed `--font-r4-*` so they cannot collide with style-r1|r2|r3
 * or any other comparison route loaded in the same dev session.
 */

export const frauncesR4 = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
  variable: '--font-r4-display',
});

export const interR4 = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-r4-body',
});

export const jetbrainsMonoR4 = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-r4-mono',
});

export const interTightR4 = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-r4-label',
});

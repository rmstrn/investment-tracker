import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';

/**
 * R2 — «Long Room» fonts.
 *
 * Calm / restrained / spa stance — Aesop × Stripe Press × Cereal magazine.
 * Three families, all OFL on Google Fonts, all variable, total payload
 * budget ~58 kb gzipped (Latin-subset, WOFF2):
 *
 *  - Fraunces (variable, opsz axis)         → display + section heads + AI body
 *  - Inter (variable)                       → running UI text + sub + meta
 *  - JetBrains Mono (variable)              → numerals / money figures (tabular)
 *
 * Loading discipline (per R2-calm-restrained.md §4):
 *   - Preload above-the-fold only — Fraunces (display weight) + Inter (400).
 *     JetBrains Mono is NOT preloaded; it swaps in over a system mono
 *     fallback so figures stay tabular pre-hydration.
 *   - `display: 'swap'` everywhere — never FOIT in a calm, quiet brand.
 *
 * Variables prefixed `--font-r2-*` so they cannot collide with other
 * comparison routes loaded in the same dev session.
 */

export const frauncesR2 = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  preload: true,
  variable: '--font-r2-display',
});

export const interR2 = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-r2-body',
});

export const jetbrainsMonoR2 = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-r2-mono',
});

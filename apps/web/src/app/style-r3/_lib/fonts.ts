import { Geist, Geist_Mono } from 'next/font/google';

/**
 * R3 — «POSITION» fonts.
 *
 * Power-user / terminal stance — Linear × Raycast × Vercel × Bloomberg-spirit.
 * Two families, both Vercel/OFL on Google Fonts, both variable. Total payload
 * budget ~60 kb gzipped (Latin subset, WOFF2):
 *
 *  - Geist (variable)        → display + UI body (400/500/600)
 *  - Geist Mono (variable)   → ALL money figures, percentages, dates,
 *                              tickers, identifiers, kbd-chips (400/500)
 *
 * Loading discipline (per R3-power-user-terminal.md §4):
 *   - Preload: Geist 500 + Geist Mono 500 only (above-the-fold weights).
 *   - `display: 'swap'` on both — never FOIT in a tool brand.
 *   - System fallback: -apple-system / ui-monospace.
 *
 * Variables prefixed `--font-r3-*` so they cannot collide with comparison
 * routes loaded in the same dev session.
 */

export const geistR3 = Geist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-r3-sans',
});

export const geistMonoR3 = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-r3-mono',
});

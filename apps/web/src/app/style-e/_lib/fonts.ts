import {
  Anton,
  IBM_Plex_Mono,
  Old_Standard_TT,
  Permanent_Marker,
  Special_Elite,
} from 'next/font/google';

/**
 * Style E — Pasted Ledger / Cut-Paste fonts.
 *
 * Per `E-cut-paste.md`: collage typography is the defining move. Three
 * display fonts clash on purpose, plus a typewriter-monospace body, plus
 * a Sharpie-marker accent. Trust guardrail 1 keeps the clash off money
 * numerals — those stay in Plex Mono dead-clean.
 *
 * - Anton (OFL) → Display A (heavyweight condensed sans, tabloid).
 * - Old Standard TT (OFL) → Display B (didone serif, old-broadsheet column).
 * - Special Elite (OFL) → Display C (typewriter-with-toner-bleed) + AI sticky-note.
 * - IBM Plex Mono (OFL) → body + tabular figures.
 * - Permanent Marker (Apache 2.0) → Sharpie callouts, ≤6 words at a time.
 *
 * Variables namespaced (`--font-e-*`).
 */

export const antonE = Anton({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-e-anton',
});

export const oldStandardE = Old_Standard_TT({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-e-old',
});

export const specialEliteE = Special_Elite({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-e-elite',
});

export const plexMonoE = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-e-mono',
});

export const permanentMarkerE = Permanent_Marker({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-e-marker',
});

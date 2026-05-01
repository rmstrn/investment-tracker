import { Caveat, DM_Serif_Display, Inter } from 'next/font/google';

/**
 * Style C — Pressroom Riso fonts.
 *
 * The spec calls for «Redaction» (a degraded display serif designed for
 * low-DPI reproduction). Redaction is OFL but not on Google Fonts and
 * adding it would require a bespoke `@font-face` host. For the
 * comparison route we substitute **DM Serif Display** (OFL, on Google
 * Fonts via `next/font/google`). DM Serif Display preserves the heavy
 * editorial register and the wedge-serif silhouette; the «ink absorbed
 * into paper» texture is emulated via the misregister-halo pseudo-
 * element pattern (the actual signature gesture for this direction).
 *
 * - DM Serif Display (OFL) → display headlines.
 * - Inter (OFL) → body + UI + tabular money figures.
 * - Caveat (OFL) → marginalia / pencil annotations / AI voice.
 *
 * Variables are namespaced (`--font-c-*`) so they don't collide with the
 * other comparison routes loaded in parallel.
 */

export const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-c-display',
});

export const interC = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-c-body',
});

export const caveatC = Caveat({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-c-pencil',
});

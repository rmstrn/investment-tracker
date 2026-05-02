import { Inter, Source_Serif_4 } from 'next/font/google';

/**
 * Style B — Hearth Intelligence fonts.
 *
 * - Inter (variable, OFL): display + body. We pull a wide weight range so
 *   the headline weight-oscillation gesture (500 → 580 → 500) animates
 *   smoothly through the variable axis.
 * - Source Serif 4 italic (OFL): the single editorial italic word in the
 *   hero — used SPARINGLY per the spec.
 *
 * The variable name `--font-source-serif-b` namespaces this from Style A's
 * `--font-source-serif` so two fonts can co-exist on parallel routes.
 */

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  axes: ['opsz'],
});

export const sourceSerifB = Source_Serif_4({
  weight: ['400'],
  style: ['italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif-b',
});

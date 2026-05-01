import { Bagel_Fat_One, Caveat, Manrope } from 'next/font/google';

/**
 * v2 Design System fonts — Latin only, OFL-licensed Google Fonts.
 *
 * Bagel Fat One: marketing display only (single weight 400 — the only one shipped).
 * Manrope: body + UI across both registers (variable, we use 400/500/600/700).
 * Caveat: handwritten accent for marketing micro-moments.
 *
 * `display: swap` → fast text render, fallback shown until font loads.
 * Latin subset only → no Cyrillic; v2 marketing register is EN-only per spec.
 *
 * Exposed as CSS variables (--font-bagel / --font-manrope / --font-caveat) so
 * the design-system layout can wire them onto the body class without breaking
 * the upstream layout's GeistSans/GeistMono setup.
 */

export const bagelFatOne = Bagel_Fat_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bagel',
});

export const manrope = Manrope({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const caveat = Caveat({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

import { Bowlby_One, Caveat, Inter, Source_Serif_4 } from 'next/font/google';

/**
 * Style C — Pressroom Riso fonts (polished per `C-deep-visual.md`).
 *
 * The deep spec swaps display from DM Serif Display → **Bowlby One**, the
 * single-weight slab-poster face that holds wood-cut weight at 200pt without
 * thinning. Source Serif 4 is added for italic pull-quotes (Bowlby has no
 * italic). Inter remains the body / numerals workhorse. Caveat remains the
 * pencil-marginalia voice.
 *
 * - Bowlby One (OFL) → display / supergraphic / mast-head wordmark.
 * - Source Serif 4 (OFL) → italic pull-quote, by-line italic small caps.
 * - Inter (OFL) → body + UI + tabular money figures (numerals stay clean).
 * - Caveat (OFL) → AI marginalia (bylined, datestamped, ≤ 28ch).
 *
 * Variables namespaced (`--font-c-*`) so they cannot collide with the other
 * comparison routes loaded in parallel.
 */

export const bowlbyOneC = Bowlby_One({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-c-display',
});

export const sourceSerifC = Source_Serif_4({
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-c-serif',
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

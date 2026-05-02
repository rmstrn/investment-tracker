import { IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google';

/**
 * Style A — Slow Ledger fonts.
 *
 * - Source Serif 4 (Adobe, OFL): editorial display + italic CTA in-text link.
 * - IBM Plex Mono (OFL): rubrics (UPPERCASE, tracked +0.16em).
 * - Body uses the global GeistSans variable already wired in root layout.
 *
 * Latin only. `display: swap` for fast first paint with a metric fallback.
 */

export const sourceSerif = Source_Serif_4({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
});

export const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
});

import { IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google';

/**
 * Style D — Salmon Quarterly fonts.
 *
 * Per `D-salmon-quarterly.md`: Source Serif 4 carries display + body (the
 * all-serif broadsheet move that differentiates this register from every
 * shadcn-default product). IBM Plex Mono handles tabular financial figures.
 *
 * NO accent script. The AI is an editorial column WRITER, not a marginalia
 * annotator (per spec §6).
 *
 * - Source Serif 4 (OFL) → display + body (italic for stand-firsts).
 * - IBM Plex Mono (OFL) → tabular figures, datelines, ticker codes.
 *
 * Variables namespaced (`--font-d-*`).
 */

export const sourceSerifD = Source_Serif_4({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-d-serif',
});

export const plexMonoD = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-d-mono',
});

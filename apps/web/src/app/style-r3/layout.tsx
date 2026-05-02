import type { ReactNode } from 'react';
import { geistMonoR3, geistR3 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-r3` — «POSITION» (power-user / terminal / Linear × Raycast spirit).
 *
 * Route-local theme + fonts scoped under `[data-style="r3"]` so the rest of
 * the app remains untouched. Spec: `R3-power-user-terminal.md`.
 *
 * Two font families, both Vercel/OFL on Google Fonts, both variable, total
 * payload budget ~60 kb gzipped (Latin subset, WOFF2):
 *
 *   - Geist (variable)        → display + UI body (400/500/600)
 *   - Geist Mono (variable)   → ALL money figures, percentages, dates,
 *                               tickers, identifiers, kbd-chips (400/500)
 *
 * The defining choice: every numeral, ticker, date, and keyboard chip
 * renders in Geist Mono. Numerals as a typographic event.
 */
export const metadata = {
  title: 'Style R3 · POSITION',
  description: 'Power-user / terminal direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleR3Layout({ children }: { children: ReactNode }) {
  const fontVars = `${geistR3.variable} ${geistMonoR3.variable}`;
  return (
    <div data-style="r3" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

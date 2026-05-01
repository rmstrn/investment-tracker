import type { ReactNode } from 'react';
import { frauncesR4, interR4, interTightR4, jetbrainsMonoR4 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-r4` — «The Archivist's Study» (expressive / illustrated / character-led).
 *
 * Route-local theme + fonts scoped under `[data-style="r4"]` so the rest of
 * the app remains untouched. Spec: `R4-expressive-illustrated.md`.
 *
 * Four font families, all OFL on Google Fonts, all variable, total payload
 * budget ~88 kb gzipped (Latin subset, WOFF2):
 *
 *   - Fraunces (display + opsz axis)         → headline + italic captions
 *   - Inter (variable wght)                  → body / sub / disclosure
 *   - JetBrains Mono (numerals)              → ALL money, all dates, all percents
 *   - Inter Tight (variable wght)            → AI byline + section labels (small caps)
 *
 * Defining choice: illustration HOSTS, data is the VAULT — and they never
 * touch each other. The hero illustration sits upper-right; the vault card
 * below the fold has hard 1px hairlines and zero illustration nearby.
 */
export const metadata = {
  title: "Style R4 · The Archivist's Study",
  description: 'Expressive / illustrated direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleR4Layout({ children }: { children: ReactNode }) {
  const fontVars = `${frauncesR4.variable} ${interR4.variable} ${jetbrainsMonoR4.variable} ${interTightR4.variable}`;
  return (
    <div data-style="r4" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

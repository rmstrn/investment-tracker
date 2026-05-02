import type { ReactNode } from 'react';
import { frauncesR1, jetbrainsMonoR1, sourceSerifR1 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-r1` — «The Ledger Quarterly» (editorial / type-led broadsheet).
 *
 * Route-local theme + fonts scoped under `[data-style="r1"]` so the rest of
 * the app remains untouched. Spec: `R1-editorial-type-led.md`.
 *
 * Three font families, all OFL on Google Fonts, all variable, total payload
 * budget ≤ 90 kb gzipped (Latin subset, WOFF2):
 *
 *   - Fraunces (display + opsz axis)         → masthead + headline + drop-cap
 *   - Source Serif 4 (body + italic)         → running text + lead paragraph
 *   - JetBrains Mono (numerals + footnotes)  → all money, all dates, all kbd
 */
export const metadata = {
  title: 'Style R1 · The Ledger Quarterly',
  description: 'Editorial / type-led broadsheet direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleR1Layout({ children }: { children: ReactNode }) {
  const fontVars = `${frauncesR1.variable} ${sourceSerifR1.variable} ${jetbrainsMonoR1.variable}`;
  return (
    <div data-style="r1" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

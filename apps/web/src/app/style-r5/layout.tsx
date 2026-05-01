import type { ReactNode } from 'react';
import { frauncesR5, interR5 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-r5` — «Atelier» (modern luxe / sculpted / aspirational).
 *
 * Route-local theme + fonts scoped under `[data-style="r5"]` so the rest of
 * the app remains untouched. Spec: `R5-modern-luxe.md`.
 *
 * Two font families, both OFL on Google Fonts, both variable, total payload
 * budget ~62 kb gzipped (Latin subset, WOFF2):
 *
 *   - Fraunces (display + opsz axis)         → headline + section titles (≥48px)
 *   - Inter (variable wght)                  → body / sub / labels / ALL numerals
 *
 * Defining choice: light-bias luxe with sculpted depth reserved for what matters.
 * Brass appears at most twice per viewport (CTA fill + AI byline dot) — never
 * on numerals, never as chart fill. Money figures are always Inter tabular at
 * `--r5-ink` AAA contrast — never Fraunces, never brass.
 */
export const metadata = {
  title: 'Style R5 · Atelier',
  description: 'Modern luxe / sculpted direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleR5Layout({ children }: { children: ReactNode }) {
  const fontVars = `${frauncesR5.variable} ${interR5.variable}`;
  return (
    <div data-style="r5" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

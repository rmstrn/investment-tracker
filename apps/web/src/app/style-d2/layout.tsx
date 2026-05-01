import type { ReactNode } from 'react';
import { interD2 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-d2` — «Daylight Provedo» (light-mode pinterest-ref variant).
 *
 * Route-local theme + fonts scoped under `[data-style="d2"]` so the rest
 * of the app remains untouched. Spec: `D2-light-variant.md`.
 *
 * One font family, OFL on Google Fonts, variable, total payload budget
 * ~52 kb gzipped (Latin subset, WOFF2):
 *
 *   - Inter (variable)   → display + UI body + numerals (single-family)
 *
 * The defining choice (per D2 §4): single-family discipline on cream.
 * Inter 700 tabular carries the money figures (AAA 17.8:1 on paper-deep);
 * Inter 500/600 carry the UI; no serif anywhere — Provedo is operational,
 * not editorial.
 */
export const metadata = {
  title: 'Style D2 · Daylight Provedo',
  description: 'Light-mode pinterest-ref dashboard direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleD2Layout({ children }: { children: ReactNode }) {
  return (
    <div data-style="d2" className={`${interD2.variable} min-h-screen`}>
      {children}
    </div>
  );
}

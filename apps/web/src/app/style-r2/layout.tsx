import type { ReactNode } from 'react';
import { frauncesR2, interR2, jetbrainsMonoR2 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-r2` — «Long Room» (calm / restrained / spa).
 *
 * Route-local theme + fonts scoped under `[data-style="r2"]` so the rest of
 * the app remains untouched. Spec: `R2-calm-restrained.md`.
 *
 * Three font families, all OFL on Google Fonts, all variable, total payload
 * budget ~58 kb gzipped (Latin subset, WOFF2):
 *
 *   - Fraunces (display + opsz axis)         → headline + AI body
 *   - Inter (variable)                        → running UI + sub + meta
 *   - JetBrains Mono (numerals only)          → all money, all dates, all kbd
 */
export const metadata = {
  title: 'Style R2 · Long Room',
  description: 'Calm / restrained / spa direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleR2Layout({ children }: { children: ReactNode }) {
  const fontVars = `${frauncesR2.variable} ${interR2.variable} ${jetbrainsMonoR2.variable}`;
  return (
    <div data-style="r2" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

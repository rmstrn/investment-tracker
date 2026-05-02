import type { ReactNode } from 'react';
import { geistD1, geistMonoD1 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-d1` — «Lime Cabin» (faithful pinterest-ref translation).
 *
 * Route-local theme + fonts scoped under `[data-style="d1"]` so the rest
 * of the app remains untouched. Spec: `D1-faithful.md`.
 *
 * Two font families, both Vercel/OFL on Google Fonts, both variable, total
 * payload budget ~62 kb gzipped (Latin subset, WOFF2):
 *
 *   - Geist Sans (variable)   → display + UI body (400/500/600)
 *   - Geist Mono (variable)   → ALL money figures, percentages, dates,
 *                               tickers, kbd-chips, axis ticks (400/500)
 *
 * The defining choice (per D1 §4): every numeral renders in Geist Mono
 * with tabular figures + ink-on-lime AAA contrast on the highlighted
 * KPI card and primary-text-on-card AAA contrast everywhere else.
 */
export const metadata = {
  title: 'Style D1 · Lime Cabin',
  description: 'Faithful pinterest-ref dashboard direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleD1Layout({ children }: { children: ReactNode }) {
  const fontVars = `${geistD1.variable} ${geistMonoD1.variable}`;
  return (
    <div data-style="d1" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

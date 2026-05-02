import type { ReactNode } from 'react';
import { frauncesD3, interD3, jetbrainsMonoD3 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-d3` — «Private Dossier» (luxe Mercury × Hermès translation).
 *
 * Route-local theme + fonts scoped under `[data-style="d3"]` so the rest
 * of the app remains untouched. Spec: `D3-luxe-variant.md`.
 *
 * Three font families, all OFL on Google Fonts, all variable. Total
 * payload budget ~78 kb gzipped (Latin subset, WOFF2):
 *
 *   - Fraunces (variable, opsz axis)   → display only on three surfaces:
 *                                        welcome name (opsz 56), KPI numeral
 *                                        (opsz 44), drilldown H2. Forbidden
 *                                        in body / chip / button / axis /
 *                                        tooltip — Fraunces opsz axis is
 *                                        the editorial moment, not the
 *                                        workhorse. Lock to ≤3 surfaces.
 *   - Inter (variable)                 → all UI body, labels, chips, buttons,
 *                                        AI message body, eyebrow, sub-copy.
 *   - JetBrains Mono (variable)        → axis ticks, tooltip numerals, KPI
 *                                        delta line, AI absolute-time bylines.
 *
 * Defining choice: Fraunces carries the «private banker» display moment;
 * the disciplined Inter + Mono pair handles density. NO `border-radius:
 * 9999px` anywhere — single biggest visual departure from D1/D2 (radii
 * ladder 6/12/16/20px is the strongest luxe signal).
 */
export const metadata = {
  title: 'Style D3 · Private Dossier',
  description: 'Luxe pinterest-ref dashboard direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleD3Layout({ children }: { children: ReactNode }) {
  const fontVars = `${frauncesD3.variable} ${interD3.variable} ${jetbrainsMonoD3.variable}`;
  return (
    <div data-style="d3" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

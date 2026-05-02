import type { ReactNode } from 'react';
import { interD4, jetbrainsMonoD4 } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-d4` — «Provedo Console» (Linear interior × pinterest-ref).
 *
 * Route-local theme + fonts scoped under `[data-style="d4"]` so the rest
 * of the app remains untouched. Spec: `D4-density-variant.md`.
 *
 * Two font families, both OFL on Google Fonts, both variable. Total
 * payload budget ~60 kb gzipped (Latin subset, WOFF2):
 *
 *   - Inter (variable)              → all UI body, nav, welcome name,
 *                                     buttons, AI message body, labels,
 *                                     filter chips, table primary cells.
 *   - JetBrains Mono (variable)     → ALL money figures, percentages,
 *                                     tickers, kbd-chips, table numeric
 *                                     cells, axis ticks (allow-list only).
 *
 * Defining choice: terminal-grade information density. Radii drop from
 * D1's 24-28px to 8-12px (chips, NOT pills — only the `[Pro]` badge
 * survives as a pill). Welcome name SHRINKS to 28px (NOT 56px) — the
 * density direction can't spare 56px of vertical for an identity flex.
 * 5 KPI cards in a row (NOT 3) with one spacious lime card. Dense
 * holdings table directly under the KPI strip. `⌘K` command palette
 * REPLACES the chat sidebar (rendered open in the comp so PO can see
 * the AI mode without interaction).
 */
export const metadata = {
  title: 'Style D4 · Provedo Console',
  description: 'Density pinterest-ref dashboard direction for Provedo (POC).',
  robots: { index: false, follow: false },
};

export default function StyleD4Layout({ children }: { children: ReactNode }) {
  const fontVars = `${interD4.variable} ${jetbrainsMonoD4.variable}`;
  return (
    <div data-style="d4" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

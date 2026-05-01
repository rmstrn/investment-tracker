import type { ReactNode } from 'react';
import { frauncesD3, interD3, jetbrainsMonoD3 } from './_fonts';
import './_styles/dossier.css';

/**
 * `/design-system` layout — D3 «Private Dossier» theme variant.
 *
 * Applies `data-theme="dossier"` to the route's outermost wrapper so the
 * dossier CSS variables (`apps/web/src/app/design-system/_styles/dossier.css`)
 * resolve for this subtree only. The world's `<html data-theme>` stays
 * `light`/`dark` for every other route — no global flip.
 *
 * Loads three OFL variable fonts via `next/font/google`:
 *   - Fraunces  (opsz axis) → 3-surface lock (typography specimen / KPI / H2)
 *   - Inter                  → body, labels, chips, buttons
 *   - JetBrains Mono         → axis ticks, KPI delta lines, hex / WCAG values
 *
 * The font CSS variables (`--font-d3-display` / `--font-d3-sans` /
 * `--font-d3-mono`) flow into the dossier theme tokens via the
 * `--d3-font-*` stacks defined in `_styles/dossier.css`.
 */
export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  const fontVars = `${frauncesD3.variable} ${interD3.variable} ${jetbrainsMonoD3.variable}`;
  return (
    <div data-theme="dossier" className={fontVars}>
      {children}
    </div>
  );
}

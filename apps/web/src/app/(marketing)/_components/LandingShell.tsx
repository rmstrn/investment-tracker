import type { ReactNode } from 'react';
import '../../style-d1/_lib/depth.css';
import '../../style-d1/_lib/theme.css';

/**
 * Landing v1 shell — applies `data-theme="lime-cabin"` so the locked
 * D1 lime-cabin tokens resolve on the marketing surface.
 *
 * Per architect ADR-2 (D1_LANDING_ARCHITECTURE.md): scope the lime-
 * cabin theme to the landing without affecting `(marketing)/pricing`
 * or other marketing-shell consumers. Isolated CSS scope = isolated
 * cascade.
 *
 * Imports the canonical D1 token sources (`depth.css` + `theme.css`)
 * directly. Both files are dual-scoped to `[data-style="d1"]` AND
 * `[data-theme="lime-cabin"]` (see depth.css line 53). Importing them
 * here makes the tokens available without forcing the landing to live
 * under `[data-style="d1"]` (which is reserved for `/style-d1` route
 * scope).
 *
 * Layout: max-width 1360px (matches `/style-d1` `.d1-shell`), 24px
 * gutters, vertical rhythm via section-level padding.
 */
export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div data-theme="lime-cabin" className="d1-page">
      <div className="d1-shell">{children}</div>
    </div>
  );
}

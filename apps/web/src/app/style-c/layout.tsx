import type { ReactNode } from 'react';
import { bowlbyOneC, caveatC, interC, sourceSerifC } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-c` — Pressroom Riso comparison route (polished).
 *
 * Risograph broadside / zine direction. Route-local theme + fonts scoped
 * under `[data-style="c"]` so the rest of the app remains untouched.
 *
 * Display swapped DM Serif Display → Bowlby One per `C-deep-visual.md`.
 */
export const metadata = {
  title: 'Style C · Pressroom Riso',
  description: 'Risograph broadside direction for Provedo (comparison route).',
  robots: { index: false, follow: false },
};

export default function StyleCLayout({ children }: { children: ReactNode }) {
  const fontVars = `${bowlbyOneC.variable} ${sourceSerifC.variable} ${interC.variable} ${caveatC.variable}`;
  return (
    <div data-style="c" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

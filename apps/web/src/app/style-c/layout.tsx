import type { ReactNode } from 'react';
import { caveatC, dmSerifDisplay, interC } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-c` — Pressroom Riso comparison route.
 *
 * Risograph broadside / zine direction. Route-local theme + fonts scoped
 * under `[data-style="c"]` so the rest of the app remains untouched.
 */
export const metadata = {
  title: 'Style C · Pressroom Riso',
  description: 'Risograph broadside direction for Provedo (comparison route).',
  robots: { index: false, follow: false },
};

export default function StyleCLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-style="c"
      className={`${dmSerifDisplay.variable} ${interC.variable} ${caveatC.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}

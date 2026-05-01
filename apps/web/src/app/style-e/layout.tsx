import type { ReactNode } from 'react';
import { antonE, oldStandardE, permanentMarkerE, plexMonoE, specialEliteE } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-e` — Pasted Ledger / Cut-Paste comparison route.
 *
 * Xerox-zine direction at the punk / DIY / underground-newspaper end
 * of the Pressroom-broadsheet spectrum. Three display fonts clash on
 * purpose; the AI talks via a sticky-note typed on a typewriter.
 *
 * Route-local theme + fonts scoped under `[data-style="e"]`.
 */
export const metadata = {
  title: 'Style E · Pasted Ledger',
  description: 'Cut-and-paste Xerox-zine direction for Provedo (comparison route).',
  robots: { index: false, follow: false },
};

export default function StyleELayout({ children }: { children: ReactNode }) {
  const fontVars = `${antonE.variable} ${oldStandardE.variable} ${specialEliteE.variable} ${plexMonoE.variable} ${permanentMarkerE.variable}`;
  return (
    <div data-style="e" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

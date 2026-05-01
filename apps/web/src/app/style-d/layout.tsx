import type { ReactNode } from 'react';
import { plexMonoD, sourceSerifD } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-d` — Salmon Quarterly comparison route.
 *
 * Pressroom-broadsheet at the credible / FT-end of the spectrum. Salmon
 * paper, all-serif body, IBM Plex Mono tabular figures, single Pelican
 * Red accent. Route-local theme + fonts scoped under `[data-style="d"]`.
 */
export const metadata = {
  title: 'Style D · Salmon Quarterly',
  description: 'Pressroom-broadsheet credible-end direction for Provedo (comparison route).',
  robots: { index: false, follow: false },
};

export default function StyleDLayout({ children }: { children: ReactNode }) {
  const fontVars = `${sourceSerifD.variable} ${plexMonoD.variable}`;
  return (
    <div data-style="d" className={`${fontVars} min-h-screen`}>
      {children}
    </div>
  );
}

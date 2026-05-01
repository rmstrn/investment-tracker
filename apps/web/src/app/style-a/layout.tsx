import type { ReactNode } from 'react';
import { plexMono, sourceSerif } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-a` — Slow Ledger comparison route.
 *
 * Hardback / Stripe Press / Cereal-mag direction. Route-local theme + fonts
 * scoped under `[data-style="a"]` so the rest of the app remains untouched.
 */
export const metadata = {
  title: 'Style A · Slow Ledger',
  description: 'Quiet editorial direction for Provedo (comparison route).',
  robots: { index: false, follow: false },
};

export default function StyleALayout({ children }: { children: ReactNode }) {
  return (
    <div data-style="a" className={`${sourceSerif.variable} ${plexMono.variable} min-h-screen`}>
      {children}
    </div>
  );
}

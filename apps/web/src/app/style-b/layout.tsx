import type { ReactNode } from 'react';
import { inter, sourceSerifB } from './_lib/fonts';
import './_lib/theme.css';

/**
 * `/style-b` — Hearth Intelligence comparison route.
 *
 * AI-warm tactile direction. Route-local theme + fonts scoped under
 * `[data-style="b"]` so the rest of the app remains untouched.
 */
export const metadata = {
  title: 'Style B · Hearth Intelligence',
  description: 'AI-warm tactile direction for Provedo (comparison route).',
  robots: { index: false, follow: false },
};

export default function StyleBLayout({ children }: { children: ReactNode }) {
  return (
    <div data-style="b" className={`${inter.variable} ${sourceSerifB.variable} min-h-screen`}>
      {children}
    </div>
  );
}

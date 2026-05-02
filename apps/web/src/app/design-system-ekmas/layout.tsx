import type { ReactNode } from 'react';
import { bagelFatOne, manrope } from '../design-system/_fonts';
import './_lib/theme.css';

/**
 * Layout for `/design-system-ekmas` — comparison-only route for PO to evaluate
 * `ekmas/neobrutalism-components` against `Logging-Studio/RetroUI`. The losing
 * library is deleted post-decision; this layout is therefore disposable.
 *
 * Wraps content in `[data-ds-variant="ekmas"]` so the Tailwind tokens defined
 * in `_lib/theme.css` only paint inside this route. Canonical `/design-system`
 * continues to render its visx-candy showcase untouched.
 */
export const metadata = {
  title: 'Design System · ekmas — Provedo',
  description: 'Neo-brutalism comparison render: ekmas/neobrutalism-components.',
  robots: { index: false, follow: false },
};

export default function DesignSystemEkmasLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-ds-variant="ekmas"
      className={`${bagelFatOne.variable} ${manrope.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}

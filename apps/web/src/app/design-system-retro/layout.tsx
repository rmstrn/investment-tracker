import type { ReactNode } from 'react';
import { bagelFatOne, manrope } from '../design-system/_fonts';
import './_lib/theme.css';

/**
 * Layout for `/design-system-retro` — comparison render for
 * `Logging-Studio/RetroUI`. Pair: `/design-system-ekmas`. Loser deleted
 * post PO decision.
 */
export const metadata = {
  title: 'Design System · RetroUI — Provedo',
  description: 'Neo-brutalism comparison render: Logging-Studio/RetroUI.',
  robots: { index: false, follow: false },
};

export default function DesignSystemRetroLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-ds-variant="retro"
      className={`${bagelFatOne.variable} ${manrope.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}

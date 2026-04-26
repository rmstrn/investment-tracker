// PaperGrain — Landing-v2 §C.5
//
// 3% noise SVG layer rendered as background pattern, multiply-blended with the
// cream page background. Mounted ONCE inside `LandingHero`, not page-wide —
// only the hero needs the paper-grain atmosphere. Other sections use clean
// cream / muted / dark backgrounds without grain.
//
// Decorative-only: aria-hidden + pointer-events: none. No interactivity.
// SVG noise is data-URI inline; no extra HTTP request, ~0.4kB inline cost.

import type { ReactElement } from 'react';

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

export function PaperGrain(): ReactElement {
  return (
    <div
      aria-hidden="true"
      data-testid="paper-grain"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `url("${NOISE_SVG}")`,
        mixBlendMode: 'multiply',
        opacity: 1,
        zIndex: 0,
      }}
    />
  );
}

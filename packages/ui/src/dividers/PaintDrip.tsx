'use client';

/**
 * Paint-drip section transition (marketing / candy register only).
 *
 * Per `docs/design/PROVEDO_DESIGN_SYSTEM_v2.md` §7.4 (Divider — paint-drip
 * primitive). Renders an SVG silhouette that bleeds the *next* section's
 * color into the bottom of the *current* section. Color uses the deep
 * variant of the incoming surface (e.g. `candy.pink-deep` when the next
 * section is candy-pink), giving a 1-stop tonal step before the field
 * flattens to base.
 *
 * Three preset shapes (`soft` / `thick` / `uneven`) ship so consecutive
 * transitions on the same page do not repeat. Each path is irregular —
 * 5–8 droplets at varying spacing and depth — to avoid a wallpaper effect.
 *
 * Below 360px viewport the drip falls back to a single 1px ink-rule per
 * the PD-flagged risk in spec §11 (mobile drip silhouette can crowd
 * content). Detection is `matchMedia` based and re-evaluates on resize.
 *
 * Decorative: `aria-hidden="true"`. No animation by default — drips are
 * static SVG geometry; reduced-motion-safe.
 */

import { useEffect, useState } from 'react';

export type PaintDripVariant = 'soft' | 'thick' | 'uneven';

export interface PaintDripProps {
  /** CSS color for the *current* section (typically the section ABOVE the drip). */
  from: string;
  /** CSS color for the drip silhouette — should be the *deep* variant of the next section. */
  to: string;
  /** Drip-band height in px. Default 80. */
  height?: number;
  /** Preset drip shape. Default 'soft'. */
  variant?: PaintDripVariant;
  /** Optional className passthrough for the wrapping element. */
  className?: string;
}

/**
 * Three irregular drip-path presets, viewBox `0 0 1440 80`. The top edge
 * is flat; the bottom edge dips into droplets. `preserveAspectRatio="none"`
 * scales horizontally to fill any container width.
 */
const DRIP_PATHS: Record<PaintDripVariant, string> = {
  // 6 droplets, gentle depths 18–32px, widely spaced.
  soft: 'M0 0 H1440 V32 C1380 32 1340 56 1280 44 C1220 32 1160 60 1080 48 C1000 36 920 64 820 50 C720 36 620 58 520 46 C420 34 320 62 220 50 C140 40 60 56 0 44 Z',
  // 7 droplets, deeper 30–58px, denser cluster mid-section.
  thick:
    'M0 0 H1440 V40 C1390 40 1350 78 1290 60 C1230 42 1170 76 1100 58 C1030 40 960 80 880 62 C800 44 730 78 660 60 C580 42 510 76 430 56 C340 36 260 78 180 58 C100 38 50 64 0 50 Z',
  // 8 droplets, irregular 20–48px, asymmetric spacing left-loaded.
  uneven:
    'M0 0 H1440 V36 C1400 36 1370 56 1330 44 C1290 32 1240 70 1180 50 C1110 28 1050 64 990 48 C930 32 880 56 820 42 C760 28 700 76 620 54 C540 32 470 60 380 46 C300 34 220 70 140 50 C80 36 30 54 0 42 Z',
};

const MOBILE_BREAKPOINT_PX = 360;

/**
 * Hook: returns true when viewport width is below the mobile fallback
 * threshold. SSR-safe — defaults to `false` until the client mounts.
 */
function useIsBelowMobileBreakpoint(): boolean {
  const [isBelow, setIsBelow] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const sync = (): void => setIsBelow(mql.matches);
    sync();
    // `addEventListener` is the modern API; fall back to legacy if needed.
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', sync);
      return () => mql.removeEventListener('change', sync);
    }
    mql.addListener(sync);
    return () => mql.removeListener(sync);
  }, []);

  return isBelow;
}

export function PaintDrip({
  from,
  to,
  height = 80,
  variant = 'soft',
  className,
}: PaintDripProps) {
  const isMobile = useIsBelowMobileBreakpoint();
  const path = DRIP_PATHS[variant];

  if (isMobile) {
    return (
      <div
        aria-hidden="true"
        className={className}
        data-paint-drip="fallback"
        style={{
          width: '100%',
          height: 1,
          backgroundColor: 'var(--color-ink-deep, #1C1B26)',
          // Preserve the surrounding band color so layout still reads
          // as a transition between two surfaces, not a void.
          boxShadow: `0 -1px 0 0 ${from}`,
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={className}
      data-paint-drip={variant}
      style={{
        width: '100%',
        height,
        backgroundColor: from,
        lineHeight: 0,
      }}
    >
      <svg
        width="100%"
        height={height}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        role="presentation"
      >
        <path d={path} fill={to} />
      </svg>
    </div>
  );
}

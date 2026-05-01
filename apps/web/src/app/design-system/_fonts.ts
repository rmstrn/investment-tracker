import { Bagel_Fat_One, Caveat, Geist, Geist_Mono, Manrope } from 'next/font/google';

/**
 * D1 «Lime Cabin» fonts for the canonical `/design-system` showcase.
 *
 * Single-family bet: Geist Sans + Geist Mono — both Vercel/OFL on Google
 * Fonts, both variable. Variables prefixed `--font-d1-*` so they line up
 * with the canonical D1 vocabulary at
 * `apps/web/src/app/style-d1/_lib/fonts.ts` — both routes consume the
 * same `--font-d1-sans` / `--font-d1-mono` token names so
 * `_styles/lime-cabin.css` reads them identically.
 *
 * Legacy Bagel / Manrope / Caveat exports are KEPT below — they are
 * still consumed by the comparison routes (`design-system-ekmas`,
 * `design-system-retro`) which are slated for deletion in Phase 3
 * cleanup. Removing them here would break those sibling routes
 * pre-deletion, violating the «touch only design-system/» rule of the
 * Phase 1 dispatch. Once Phase 3 drops those routes the legacy exports
 * can be removed in one cleanup commit.
 */

export const geistD1 = Geist({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-d1-sans',
});

export const geistMonoD1 = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-d1-mono',
});

/* — Legacy v2 fonts kept for sibling routes (Phase 3 will retire) — */

export const bagelFatOne = Bagel_Fat_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bagel',
});

export const manrope = Manrope({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const caveat = Caveat({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

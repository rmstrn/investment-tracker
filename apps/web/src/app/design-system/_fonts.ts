import { Bagel_Fat_One, Fraunces, Inter, JetBrains_Mono, Manrope } from 'next/font/google';

/**
 * D3 «Private Dossier» fonts for `/design-system`.
 *
 * Three OFL Google Fonts, all variable, Latin subset only (US + EU EN-only
 * surface per `project_target_market_2026-05-01` directive). Mirrors the
 * loading discipline at `apps/web/src/app/style-d3/_lib/fonts.ts`.
 *
 *   - Fraunces (variable, opsz axis) → display ONLY on three surfaces:
 *     typography specimen / KPI numeral demo / drilldown H2 demo. The
 *     3-surface lock is the single most important typography discipline
 *     in D3. Forbidden in body / chips / buttons / nav / labels / tooltips.
 *   - Inter (variable) → all UI body, labels, chips, buttons, AI message
 *     body, eyebrow, sub-copy.
 *   - JetBrains Mono (variable) → axis ticks, tooltip values, KPI delta
 *     line, AI absolute-time bylines, hex / OKLCH / WCAG numerals.
 *
 * CSS variables prefixed `--font-d3-*` so they cannot collide with the
 * upstream layout's GeistSans/GeistMono setup or any other route's fonts.
 */

export const frauncesD3 = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  preload: true,
  variable: '--font-d3-display',
});

export const interD3 = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-d3-sans',
});

export const jetbrainsMonoD3 = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-d3-mono',
});

/**
 * Legacy v2 font exports — RETIRED on this route as of D3 migration
 * (2026-05-01) but re-exported here so two comparison-only sister routes
 * (`/design-system-ekmas`, `/design-system-retro`) continue to compile
 * until Phase 3 cleanup deletes them. Do NOT consume from this route.
 */
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

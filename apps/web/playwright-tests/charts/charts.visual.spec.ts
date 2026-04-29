/**
 * Layer B — visual regression baselines for the chart subsystem.
 *
 * Captures **18 baselines: 9 MVP charts × 2 themes** (light + dark) at the
 * fixed 1280×800 viewport defined in `playwright.config.ts`.
 *
 * Scope deltas vs QA kickoff §5 Layer B (which targets 20):
 * - Scatter excluded per architect ADR Δ3 (V2-deferred at the schema
 *   discriminator).
 * - Candlestick excluded from this slice because the showcase route
 *   intentionally OMITS a Candlestick demo block per FE kickoff §scope
 *   (T3 component awaits legal-advisor sign-off + PO greenlight). The
 *   Candlestick smoke instantiation is covered in
 *   `packages/ui/src/charts/charts.test.tsx` against `LazyCandlestick`.
 *   Adding visual baselines for Candlestick requires wiring a showcase
 *   block, which is a FE slice — surfaced as a follow-on TD on slice
 *   return.
 *
 * Baselines drop into `__screenshots__/` next to this spec. First run
 * (`--update-snapshots`) authors the goldens; subsequent runs assert
 * within a 0.1% pixel-difference tolerance per QA kickoff §5 Layer B.
 */

import { expect, test } from '@playwright/test';

const CHART_KINDS = [
  'line',
  'area',
  'bar',
  'donut',
  'sparkline',
  'calendar',
  'treemap',
  'stacked-bar',
  'waterfall',
] as const;

type ChartKind = (typeof CHART_KINDS)[number];
type Theme = 'light' | 'dark';

/**
 * Set the data-theme attribute on `<html>` per `docs/DECISIONS.md` 2026-04-29
 * theme decision. The page also has a `<ThemeToggle>` widget but driving via
 * the attribute keeps the test deterministic and independent of the toggle's
 * own implementation.
 */
async function setTheme(page: import('@playwright/test').Page, theme: Theme): Promise<void> {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
  // Allow the MutationObserver inside `useDarkTheme()` to fire a re-render
  // before we screenshot.
  await page.waitForTimeout(120);
}

async function settleCharts(page: import('@playwright/test').Page): Promise<void> {
  // Recharts uses a 600ms enter animation by default; under prefers-reduced-
  // motion or when isAnimationActive=false this is a no-op. We give the
  // worst case (600ms enter + a small layout settle) before screenshotting.
  await page.waitForTimeout(800);
}

for (const theme of ['light', 'dark'] as const) {
  for (const kind of CHART_KINDS) {
    test(`chart-${kind} (${theme}) visual baseline`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/design#charts', { waitUntil: 'networkidle' });
      await setTheme(page, theme);

      const locator = page.locator(`[data-testid="chart-${kind}"]`).first();
      await locator.waitFor({ state: 'visible', timeout: 30_000 });
      await settleCharts(page);

      await expect(locator).toHaveScreenshot(`chart-${kind}-${theme}.png`, {
        animations: 'disabled',
      });
    });
  }
}

/**
 * Baseline tally guard — fires if CHART_KINDS drifts from the documented
 * 9-kind set. (The 10th MVP kind, Candlestick, is excluded from visual
 * baselines per the file header — see follow-on TD on slice return.)
 */
test('visual baseline tally is 9 kinds × 2 themes (Candlestick deferred)', () => {
  const baselineCount = CHART_KINDS.length * 2;
  expect(baselineCount).toBe(18);
});

// Re-affirm Scatter exclusion (architect Δ3) at the visual layer too —
// any future wiring of Scatter into the showcase would need to ship its
// own baseline alongside this spec.
test('Scatter is intentionally excluded from MVP visual baselines (architect Δ3)', () => {
  const kinds: ChartKind[] = [...CHART_KINDS];
  // biome-ignore lint/suspicious/noExplicitAny: deliberate negative type-narrow.
  expect((kinds as any[]).includes('scatter')).toBe(false);
});

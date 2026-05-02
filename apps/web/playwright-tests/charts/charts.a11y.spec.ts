/**
 * A11y baseline scan for the chart subsystem on /design-system.
 *
 * Scope: donut sub-tree only (`[data-testid="chart-donut"]`). Other charts
 * are scanned via the existing visual.spec.ts visual baselines + manual
 * inspection — adding a sweep here is out of scope for the editorial-mh3
 * slice (Phase 4 / Task 8 of 13).
 *
 * Theme handling mirrors `charts.visual.spec.ts` `setTheme()` helper:
 * drives `<html data-theme="...">` directly so the test is independent of
 * the page-level toggle widget. Reduced-motion is forced so axe sees the
 * settled DOM rather than a transient enter-animation frame.
 *
 * Pre-authorized dep per CONSTRAINTS Rule 1 (`@axe-core/playwright` is
 * MIT-licensed).
 */

import AxeBuilder from '@axe-core/playwright';
import { type Page, expect, test } from '@playwright/test';

type Theme = 'light' | 'dark';

const THEMES: readonly Theme[] = ['light', 'dark'] as const;

async function setTheme(page: Page, theme: Theme): Promise<void> {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
  // Allow `useDarkTheme()` MutationObserver to fire a re-render before scan.
  await page.waitForTimeout(120);
}

for (const theme of THEMES) {
  test(`donut a11y: ${theme} theme has zero violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/design-system#charts', { waitUntil: 'networkidle' });
    await setTheme(page, theme);

    const donut = page.locator('[data-testid="chart-donut"]').first();
    await donut.waitFor({ state: 'visible', timeout: 30_000 });

    const results = await new AxeBuilder({ page }).include('[data-testid="chart-donut"]').analyze();

    expect(results.violations).toEqual([]);
  });
}

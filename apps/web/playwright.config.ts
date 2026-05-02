/**
 * Playwright config for visual-regression baselines on the chart subsystem
 * (SLICE-CHARTS-QA-V1, Layer B).
 *
 * Scope:
 * - Chromium only (cross-browser visual baselines deferred per QA kickoff
 *   §5 OUT-of-scope).
 * - Single fixed viewport 1280×800 per kickoff §5 Layer B.
 * - 10 MVP charts × 2 themes = 20 baseline screenshots, captured against
 *   the public design showcase route `/design#charts`.
 * - `webServer` auto-spawns the production build so baselines reflect the
 *   shipped bundle, not the dev-mode HMR overlay.
 *
 * Baselines live next to specs under `playwright-tests/charts/`. Diff
 * artefacts (on failure) drop into `playwright-tests/__diffs__/` per
 * Playwright's `outputDir` convention. The 0.1% pixel tolerance from the
 * QA kickoff is encoded as `expect.toHaveScreenshot.maxDiffPixelRatio`.
 *
 * R1 — no paid SaaS. Playwright is MIT; visual regression runs entirely
 * in this repo, no Chromatic / Percy / Argos.
 */

import { defineConfig, devices } from '@playwright/test';

// Visual-regression dev server uses a non-default port (3100) to avoid
// colliding with `pnpm dev`'s port 3000 in case the user has an active
// dev session. Override via PLAYWRIGHT_BASE_URL when running against an
// already-running server (e.g. `PLAYWRIGHT_BASE_URL=http://localhost:3000
// pnpm test:visual` if the dev server is shareable).
const PORT = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? '3100', 10);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './playwright-tests',
  // Baselines and snapshots live next to specs (Playwright's default puts
  // them in `<spec>-snapshots/`, fine for our purposes).
  snapshotPathTemplate: '{testDir}/{testFileDir}/__screenshots__/{arg}{ext}',
  // CI tweaks — fail-fast on baseline drift; locally a single retry softens
  // first-screen layout flakes from font-loading races.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 1,
  workers: 1, // sequential so screenshot capture is deterministic.
  reporter: [['list']],
  expect: {
    toHaveScreenshot: {
      // 0.1% pixel difference tolerance per QA kickoff §5 Layer B.
      maxDiffPixelRatio: 0.001,
      // Anti-aliasing on text edges differs subtly across machines; this
      // threshold is per-pixel YIQ tolerance, not a count.
      threshold: 0.2,
    },
  },
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
    // Force a stable color scheme so the toggle test below sets `data-
    // theme` deterministically without OS preference contamination.
    colorScheme: 'light',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Spawn a Next dev server unless the consumer is pointing at an already-
  // running server via PLAYWRIGHT_BASE_URL. We isolate the build output to
  // `.next-vr` (via NEXT_DIST_DIR, supported by the project's next.config)
  // so a parallel `pnpm dev` on port 3000 cannot lock the shared `.next/`
  // cache on Windows. Next reads `apps/web/.env.local` for Clerk + API
  // base URL automatically.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `pnpm exec next dev --turbopack --port ${PORT}`,
        url: `${BASE_URL}/design`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          NEXT_DIST_DIR: '.next-vr',
        },
      },
});

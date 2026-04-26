// Wave 2.6 a11y CRIT-1 regression: `/disclosures` MUST stay in the Clerk
// public-route matcher. The 3-layer disclaimer pattern (Wave 2.5) places an
// always-visible footer link to /disclosures so regulators / lawyers /
// crawlers / prospects can reach the verbatim regulator-readable text WITHOUT
// authenticating. If this assertion fails, the always-visible footer link
// will return 404 to anonymous users, invalidating the entire 3-layer pattern.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Vitest runs from apps/web/, so resolve relative to process.cwd() to avoid
// import.meta.url URL-scheme issues under happy-dom.
const middlewareSource = readFileSync(path.resolve(process.cwd(), 'src', 'middleware.ts'), 'utf8');

describe('middleware — Wave 2.6 CRIT-1 (anonymous-reachable routes)', () => {
  it('lists `/disclosures` in the Clerk isPublic matcher', () => {
    // Source-level check is intentional: importing `clerkMiddleware` into
    // happy-dom requires Next-server context that vitest cannot easily mock.
    // Asserting on the source text is the simplest regression guard.
    expect(middlewareSource).toMatch(/'\/disclosures'/);
  });

  it('lists `/` in the Clerk isPublic matcher (sanity check)', () => {
    expect(middlewareSource).toMatch(/'\/'/);
  });

  it('lists `/pricing` in the Clerk isPublic matcher (sanity check)', () => {
    expect(middlewareSource).toMatch(/'\/pricing'/);
  });
});

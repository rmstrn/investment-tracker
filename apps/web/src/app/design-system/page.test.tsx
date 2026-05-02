import { describe, expect, it } from 'vitest';

import { metadata } from './page';

describe('Design System page metadata', () => {
  it('title contains the locked product name "Provedo"', () => {
    // H4 regression guard — the brand-truth check. If this assertion fails,
    // either `packages/design-tokens/tokens/brand.json` was reverted or the
    // template literal stopped reading from `brand.productName`.
    expect(metadata.title).toMatch(/Provedo/);
  });

  it('description references the locked product name', () => {
    expect(metadata.description).toMatch(/Provedo/);
  });
});

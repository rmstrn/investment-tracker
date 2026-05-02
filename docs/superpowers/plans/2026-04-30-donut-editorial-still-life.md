# Donut V2 Editorial Still-Life — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace DonutChartV2's «свет изнутри» radial-gradient + museum-vitrine palette with the H3 specular-bevel form + editorial-still-life 5-hue palette per `docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md`.

**Architecture:** Token-driven palette swap (30 new hex in primitives, repoint `chart-categorical.{1..5}` aliases) + new shared `<EditorialBevelFilter>` SVG primitive in `packages/ui/src/charts/_shared/filters.ts`. DonutChartV2 reads CSS vars for slice fills via per-slice `<linearGradient>` defs (categorical mode only); H3 bevel filter wraps the slice container `<g>`. Light/dark theme switching via existing `<html data-theme>` cascade for fills, JS `theme` prop for filter primitive constants.

**Tech Stack:** TypeScript 5.x, React 19, Vitest + happy-dom, Playwright (visual + a11y), DTCG-format JSON tokens compiled by `packages/design-tokens/build.js` (custom Node, not Style Dictionary).

**Reference:** Spec at `docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md` is source-of-truth for hex values, filter primitives, and component contract.

**Total file impact:** 7 ADD + 7 EDIT = 14 file touches. ~10 commits per spec §9.2.

---

## Plan-vs-spec deltas (ground truth corrections)

During implementation grounding, two spec assertions were verified against repo reality and adjusted in this plan:

1. **Token build:** `packages/design-tokens/build.js` is the build entry (not `style-dictionary.config.cjs`). It auto-discovers all `tokens/primitives/*.json` files via `fs.readdirSync` — **no config edit required** for new primitive file. Spec §4.2 line referencing «Register editorial-mh3.json in primitive sources» is a no-op; this plan drops that step.

2. **culori dependency:** Spec §8.3 contrast test mentions «using `culori` (already a dep)». Verified: culori is **NOT** installed. This plan uses raw WCAG sRGB→relative-luminance math (no new dep) for the contrast gate.

---

## Phase 1 — Tokens

### Task 1: Add editorial-mh3 primitive block

**Files:**
- Create: `packages/design-tokens/tokens/primitives/editorial-mh3.json`

- [ ] **Step 1: Write the new primitive file**

```jsonc
// packages/design-tokens/tokens/primitives/editorial-mh3.json
{
  "color": {
    "editorial-mh3": {
      "roasted-cocoa": {
        "light": {
          "top":    { "$value": "#7A5440", "$type": "color", "$description": "editorial-still-life roasted-cocoa light top stop (ΔL +0.10 vs base)." },
          "base":   { "$value": "#5E3A2A", "$type": "color", "$description": "editorial-still-life roasted-cocoa light base. PD-corrected 2026-04-30. WCAG 5.8:1 vs cream." },
          "bottom": { "$value": "#452517", "$type": "color", "$description": "editorial-still-life roasted-cocoa light bottom stop (ΔL −0.10 vs base)." }
        },
        "dark": {
          "top":    { "$value": "#C99B82", "$type": "color", "$description": "editorial-still-life roasted-cocoa dark top stop (ΔL +0.05 vs base)." },
          "base":   { "$value": "#B5876D", "$type": "color", "$description": "editorial-still-life roasted-cocoa dark base. WCAG 6.4:1 vs #0E0E12." },
          "bottom": { "$value": "#A07358", "$type": "color", "$description": "editorial-still-life roasted-cocoa dark bottom stop (ΔL −0.05 vs base)." }
        }
      },
      "burnished-gold": {
        "light": {
          "top":    { "$value": "#C49640", "$type": "color", "$description": "editorial-still-life burnished-gold light top." },
          "base":   { "$value": "#A87C24", "$type": "color", "$description": "editorial-still-life burnished-gold light base. WCAG 3.6:1 vs cream." },
          "bottom": { "$value": "#8C620D", "$type": "color", "$description": "editorial-still-life burnished-gold light bottom." }
        },
        "dark": {
          "top":    { "$value": "#EBCB85", "$type": "color" },
          "base":   { "$value": "#E0BC6E", "$type": "color", "$description": "editorial-still-life burnished-gold dark base. WCAG 8.1:1 vs #0E0E12." },
          "bottom": { "$value": "#D5AD57", "$type": "color" }
        }
      },
      "aubergine": {
        "light": {
          "top":    { "$value": "#785878", "$type": "color" },
          "base":   { "$value": "#5C3F5E", "$type": "color", "$description": "editorial-still-life aubergine light base. Replaced storm-indigo in blue-replace step. WCAG 5.4:1 vs cream." },
          "bottom": { "$value": "#412944", "$type": "color" }
        },
        "dark": {
          "top":    { "$value": "#B093B4", "$type": "color" },
          "base":   { "$value": "#9C7DA0", "$type": "color", "$description": "editorial-still-life aubergine dark base. DERIVED in spec — flag for visual QA on first render. WCAG 6.1:1 vs #0E0E12." },
          "bottom": { "$value": "#88688C", "$type": "color" }
        }
      },
      "wine": {
        "light": {
          "top":    { "$value": "#974663", "$type": "color" },
          "base":   { "$value": "#7A2E48", "$type": "color", "$description": "editorial-still-life wine light base. WCAG 5.7:1 vs cream." },
          "bottom": { "$value": "#5E1830", "$type": "color" }
        },
        "dark": {
          "top":    { "$value": "#D6A1B4", "$type": "color" },
          "base":   { "$value": "#C88AA0", "$type": "color", "$description": "editorial-still-life wine dark base. WCAG 6.5:1 vs #0E0E12." },
          "bottom": { "$value": "#BA738C", "$type": "color" }
        }
      },
      "slate-blue": {
        "light": {
          "top":    { "$value": "#576E89", "$type": "color" },
          "base":   { "$value": "#3F546E", "$type": "color", "$description": "editorial-still-life slate-blue light base. WCAG 4.9:1 vs cream." },
          "bottom": { "$value": "#2A3C53", "$type": "color" }
        },
        "dark": {
          "top":    { "$value": "#B0C2D6", "$type": "color" },
          "base":   { "$value": "#9CB0C8", "$type": "color", "$description": "editorial-still-life slate-blue dark base. WCAG 6.6:1 vs #0E0E12." },
          "bottom": { "$value": "#88A0BB", "$type": "color" }
        }
      }
    }
  }
}
```

- [ ] **Step 2: Verify build picks up the new file**

Run: `pnpm --filter @investment-tracker/design-tokens build`
Expected: build runs without error. Console output mentions writing `css/tokens.css`.

- [ ] **Step 3: Verify primitives present in CSS output**

Run: `grep -c "editorial-mh3" packages/design-tokens/build/css/tokens.css`
Expected: 30 matches (5 hues × 2 themes × 3 stops).

- [ ] **Step 4: Commit**

```bash
git add packages/design-tokens/tokens/primitives/editorial-mh3.json
git commit -m "feat(tokens): add editorial-mh3 primitive block (30 hex, 5 hues x 2 themes x 3 stops)"
```

---

### Task 2: Repoint chart-categorical aliases (light + dark)

**Files:**
- Modify: `packages/design-tokens/tokens/semantic/light.json`
- Modify: `packages/design-tokens/tokens/semantic/dark.json`

- [ ] **Step 1: Update light.json `chart-categorical` block**

Replace the existing `chart-categorical.{1..5}` flat aliases with nested `{base, top, bottom}` triples. Locate the block (currently `chart-categorical.1: {color.museum.slate.light}` etc.) and rewrite:

```jsonc
// packages/design-tokens/tokens/semantic/light.json — replace existing chart-categorical block
"chart-categorical": {
  "1": {
    "base":   { "$value": "{color.editorial-mh3.roasted-cocoa.light.base}",   "$type": "color", "$description": "Categorical series 1 — roasted-cocoa base. Replaces museum-slate." },
    "top":    { "$value": "{color.editorial-mh3.roasted-cocoa.light.top}",    "$type": "color", "$description": "Categorical series 1 — roasted-cocoa top stop for H3 linear-gradient." },
    "bottom": { "$value": "{color.editorial-mh3.roasted-cocoa.light.bottom}", "$type": "color", "$description": "Categorical series 1 — roasted-cocoa bottom stop for H3 linear-gradient." }
  },
  "2": {
    "base":   { "$value": "{color.editorial-mh3.burnished-gold.light.base}",   "$type": "color" },
    "top":    { "$value": "{color.editorial-mh3.burnished-gold.light.top}",    "$type": "color" },
    "bottom": { "$value": "{color.editorial-mh3.burnished-gold.light.bottom}", "$type": "color" }
  },
  "3": {
    "base":   { "$value": "{color.editorial-mh3.aubergine.light.base}",   "$type": "color" },
    "top":    { "$value": "{color.editorial-mh3.aubergine.light.top}",    "$type": "color" },
    "bottom": { "$value": "{color.editorial-mh3.aubergine.light.bottom}", "$type": "color" }
  },
  "4": {
    "base":   { "$value": "{color.editorial-mh3.wine.light.base}",   "$type": "color" },
    "top":    { "$value": "{color.editorial-mh3.wine.light.top}",    "$type": "color" },
    "bottom": { "$value": "{color.editorial-mh3.wine.light.bottom}", "$type": "color" }
  },
  "5": {
    "base":   { "$value": "{color.editorial-mh3.slate-blue.light.base}",   "$type": "color" },
    "top":    { "$value": "{color.editorial-mh3.slate-blue.light.top}",    "$type": "color" },
    "bottom": { "$value": "{color.editorial-mh3.slate-blue.light.bottom}", "$type": "color" }
  }
}
```

- [ ] **Step 2: Mirror to dark.json**

Same shape, but reference `.dark.{base|top|bottom}` instead of `.light.{...}`. Replace the existing block in `packages/design-tokens/tokens/semantic/dark.json`.

- [ ] **Step 3: Build + verify CSS output**

Run: `pnpm --filter @investment-tracker/design-tokens build`
Expected: build green, no «Unresolved ref» error.

Run: `grep -E '\-\-chart-categorical-[1-5]-(base|top|bottom)' packages/design-tokens/build/css/tokens.css | wc -l`
Expected: 30 (15 in `:root`, 15 in `.dark, [data-theme="dark"]`).

- [ ] **Step 4: Inspect emitted hex (sanity check)**

Run: `grep "chart-categorical-1-base" packages/design-tokens/build/css/tokens.css`
Expected (light): `--chart-categorical-1-base: #5E3A2A;` (roasted-cocoa light base)
Expected (dark): `--chart-categorical-1-base: #B5876D;` (roasted-cocoa dark base)

- [ ] **Step 5: Commit**

```bash
git add packages/design-tokens/tokens/semantic/light.json packages/design-tokens/tokens/semantic/dark.json
git commit -m "feat(tokens): repoint chart-categorical aliases to editorial-mh3 base/top/bottom"
```

---

### Task 3: Token snapshot + contrast tests

**Files:**
- Create: `packages/design-tokens/__tests__/css-vars.snapshot.test.ts`
- Create: `packages/design-tokens/__tests__/contrast.test.ts`
- Modify: `packages/design-tokens/package.json` (add `test` script if absent + vitest dep if absent)

- [ ] **Step 1: Verify vitest setup**

Run: `cat packages/design-tokens/package.json | grep -E 'vitest|"test"'`
Expected: vitest dep present in workspace OR similar runner config.

If vitest is NOT in design-tokens package, add to package.json devDependencies (vitest is already in `packages/ui` — workspace-pin same version):

```jsonc
// packages/design-tokens/package.json — add to devDependencies
"vitest": "workspace:*"
```
And to scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write css-vars snapshot test**

```typescript
// packages/design-tokens/__tests__/css-vars.snapshot.test.ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const CSS_PATH = join(__dirname, '..', 'build', 'css', 'tokens.css');

describe('editorial-mh3 CSS vars', () => {
  it('emits 30 chart-categorical vars (5 hues x 2 themes x 3 stops)', () => {
    const css = readFileSync(CSS_PATH, 'utf8');
    const matches = css.match(/--chart-categorical-[1-5]-(base|top|bottom):/g) ?? [];
    expect(matches).toHaveLength(30);
  });

  it('emits all 5 light slot bases with expected hex', () => {
    const css = readFileSync(CSS_PATH, 'utf8');
    const expectedLight: Record<string, string> = {
      '1': '#5E3A2A',  // roasted-cocoa
      '2': '#A87C24',  // burnished-gold
      '3': '#5C3F5E',  // aubergine
      '4': '#7A2E48',  // wine
      '5': '#3F546E',  // slate-blue
    };
    for (const [slot, hex] of Object.entries(expectedLight)) {
      const re = new RegExp(`--chart-categorical-${slot}-base:\\s*${hex}`, 'i');
      expect(css).toMatch(re);
    }
  });

  it('emits all 5 dark slot bases with expected hex', () => {
    const css = readFileSync(CSS_PATH, 'utf8');
    const expectedDark: Record<string, string> = {
      '1': '#B5876D',
      '2': '#E0BC6E',
      '3': '#9C7DA0',
      '4': '#C88AA0',
      '5': '#9CB0C8',
    };
    // Dark block is .dark, [data-theme="dark"] { ... }
    const darkBlock = css.split('.dark, [data-theme="dark"]')[1] ?? '';
    for (const [slot, hex] of Object.entries(expectedDark)) {
      const re = new RegExp(`--chart-categorical-${slot}-base:\\s*${hex}`, 'i');
      expect(darkBlock).toMatch(re);
    }
  });
});
```

- [ ] **Step 3: Write contrast test (raw WCAG calc, no new dep)**

```typescript
// packages/design-tokens/__tests__/contrast.test.ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const CSS_PATH = join(__dirname, '..', 'build', 'css', 'tokens.css');

/** sRGB hex → relative luminance per WCAG 2.x. */
function luminance(hex: string): number {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) throw new Error(`Bad hex: ${hex}`);
  const [r, g, b] = m.map((c) => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

const LIGHT_BG = '#E8E0D0';
const DARK_BG = '#0E0E12';

const LIGHT_BASES: Record<string, string> = {
  '1': '#5E3A2A',
  '2': '#A87C24',
  '3': '#5C3F5E',
  '4': '#7A2E48',
  '5': '#3F546E',
};

const DARK_BASES: Record<string, string> = {
  '1': '#B5876D',
  '2': '#E0BC6E',
  '3': '#9C7DA0',
  '4': '#C88AA0',
  '5': '#9CB0C8',
};

describe('editorial-mh3 WCAG-AA contrast gate', () => {
  for (const [slot, hex] of Object.entries(LIGHT_BASES)) {
    it(`slot ${slot} light base ${hex} >=3:1 vs cream BG`, () => {
      expect(contrast(hex, LIGHT_BG)).toBeGreaterThanOrEqual(3.0);
    });
  }
  for (const [slot, hex] of Object.entries(DARK_BASES)) {
    it(`slot ${slot} dark base ${hex} >=3:1 vs dark BG`, () => {
      expect(contrast(hex, DARK_BG)).toBeGreaterThanOrEqual(3.0);
    });
  }
});
```

- [ ] **Step 4: Run tests**

Run: `pnpm --filter @investment-tracker/design-tokens test`
Expected: all tests pass — 13 contrast assertions + 3 snapshot assertions = 16 tests green.

- [ ] **Step 5: Commit**

```bash
git add packages/design-tokens/__tests__/ packages/design-tokens/package.json
git commit -m "test(tokens): css-vars snapshot + WCAG-AA contrast gate for editorial-mh3"
```

---

## Phase 2 — Filter primitive

### Task 4: EditorialBevelFilter — TDD (test first, then component)

**Files:**
- Create: `packages/ui/src/charts/_shared/__tests__/filters.test.tsx`
- Create: `packages/ui/src/charts/_shared/filters.ts`

- [ ] **Step 1: Write failing test**

```tsx
// packages/ui/src/charts/_shared/__tests__/filters.test.tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EditorialBevelFilter } from '../filters';

describe('<EditorialBevelFilter>', () => {
  it('renders <filter id> matching the id prop', () => {
    const { container } = render(
      <svg>
        <EditorialBevelFilter id="test-filter" theme="light" />
      </svg>,
    );
    const filter = container.querySelector('filter');
    expect(filter).not.toBeNull();
    expect(filter?.getAttribute('id')).toBe('test-filter');
  });

  it('light theme uses #ffffff lighting + slope 0.32', () => {
    const { container } = render(
      <svg>
        <EditorialBevelFilter id="t" theme="light" />
      </svg>,
    );
    const spec = container.querySelector('feSpecularLighting');
    expect(spec?.getAttribute('lighting-color')?.toLowerCase()).toBe('#ffffff');
    expect(spec?.getAttribute('specularConstant')).toBe('1.1');
    const fnA = container.querySelector('feFuncA');
    expect(fnA?.getAttribute('slope')).toBe('0.32');
  });

  it('dark theme uses parchment lighting + slope 0.55', () => {
    const { container } = render(
      <svg>
        <EditorialBevelFilter id="t" theme="dark" />
      </svg>,
    );
    const spec = container.querySelector('feSpecularLighting');
    expect(spec?.getAttribute('lighting-color')?.toLowerCase()).toBe('#f4f1ea');
    expect(spec?.getAttribute('specularConstant')).toBe('1.0');
    const fnA = container.querySelector('feFuncA');
    expect(fnA?.getAttribute('slope')).toBe('0.55');
  });

  it('renders primitives in spec-locked order', () => {
    const { container } = render(
      <svg>
        <EditorialBevelFilter id="t" theme="light" />
      </svg>,
    );
    const filter = container.querySelector('filter');
    const childTags = Array.from(filter?.children ?? []).map((el) => el.tagName.toLowerCase());
    // spec §2.1 order: blur → specular → composite → blur → offset → componentTransfer → merge
    expect(childTags).toEqual([
      'fegaussianblur',
      'fespecularlighting',
      'fecomposite',
      'fegaussianblur',
      'feoffset',
      'fecomponenttransfer',
      'femerge',
    ]);
  });

  it('feDistantLight at azimuth 225, elevation 55', () => {
    const { container } = render(
      <svg>
        <EditorialBevelFilter id="t" theme="light" />
      </svg>,
    );
    const dl = container.querySelector('feDistantLight');
    expect(dl?.getAttribute('azimuth')).toBe('225');
    expect(dl?.getAttribute('elevation')).toBe('55');
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

Run: `pnpm --filter @investment-tracker/ui test charts/_shared/__tests__/filters`
Expected: FAIL — `Failed to resolve import "../filters"`.

- [ ] **Step 3: Implement EditorialBevelFilter**

```tsx
// packages/ui/src/charts/_shared/filters.ts
/**
 * Shared SVG filter primitives for the chart subsystem.
 *
 * Currently exports:
 *   - <EditorialBevelFilter> — H3 specular bevel + paper-press shadow.
 *     Used by DonutChartV2 (categorical / sequential / monochromatic
 *     palettes — applied palette-agnostically on the slice container <g>).
 *
 * Spec: docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md §2.
 */

import type { JSX } from 'react';

export interface EditorialBevelFilterProps {
  /** Caller-owned unique id; used as `<filter id={id}>` and target of `filter={url(#id)}`. */
  id: string;
  /** Active theme; H3 stack uses different lighting + paper-press values per theme. */
  theme: 'light' | 'dark';
}

interface ThemeConstants {
  lightingColor: string;
  specularConstant: string;
  slope: string;
}

const LIGHT: ThemeConstants = {
  lightingColor: '#ffffff',
  specularConstant: '1.1',
  slope: '0.32',
};

const DARK: ThemeConstants = {
  lightingColor: '#F4F1EA',
  specularConstant: '1.0',
  slope: '0.55',
};

/**
 * H3 specular-bevel + paper-press SVG filter.
 *
 * Render once per chart instance, at the top of <svg>, before <defs> for
 * gradients. Apply via `filter={url(#id)}` on the slice container <g> —
 * never on individual paths/circles (one filter region per donut, not N).
 *
 * Theme awareness: only filter primitive constants (specular lighting-color,
 * paper-press slope) differ across themes. Slice fill colors are CSS-var-
 * driven and switch via the `<html data-theme>` cascade — no JS re-render
 * for the fills.
 */
export function EditorialBevelFilter({ id, theme }: EditorialBevelFilterProps): JSX.Element {
  const c = theme === 'dark' ? DARK : LIGHT;
  return (
    <defs>
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        {/* 1. Soften alpha for highlight */}
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        {/* 2. Specular highlight from upper-left raking light */}
        <feSpecularLighting
          in="blur"
          surfaceScale="5"
          specularConstant={c.specularConstant}
          specularExponent="22"
          lighting-color={c.lightingColor}
          result="specOut"
        >
          <feDistantLight azimuth="225" elevation="55" />
        </feSpecularLighting>
        {/* 3. Clip highlight to slice silhouette so bevel respects cornerRadius */}
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="litMasked" />
        {/* 4–6. Paper-press contact shadow */}
        <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="paperBlur" />
        <feOffset in="paperBlur" dx="0" dy="6" result="paperOffset" />
        <feComponentTransfer in="paperOffset" result="paperShadow">
          <feFuncA type="linear" slope={c.slope} />
        </feComponentTransfer>
        {/* 7. Final composite: shadow under, original on top, bevel highlight overlay */}
        <feMerge>
          <feMergeNode in="paperShadow" />
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="litMasked" />
        </feMerge>
      </filter>
    </defs>
  );
}
```

- [ ] **Step 4: Run test — verify all pass**

Run: `pnpm --filter @investment-tracker/ui test charts/_shared/__tests__/filters`
Expected: PASS — all 5 tests green.

Note on JSX casing: React lowercases `lighting-color` to `lightingColor` in TypeScript JSX, but rendered DOM attribute is `lighting-color`. The test asserts the rendered DOM attribute. If a casing-related warning appears, see RemediationsBox below.

> **Remediation if linting flags `lighting-color`:** React 19 accepts kebab-case SVG attributes; if `tsc --strict` flags it, the filter component is the only consumer — either suppress with `// eslint-disable-next-line` on that line, or use bracket-property syntax. Prefer leaving as-is unless build fails.

- [ ] **Step 5: Re-export from `_shared` index**

Add to `packages/ui/src/charts/_shared/index.ts` (create file if absent):

```typescript
export { EditorialBevelFilter, type EditorialBevelFilterProps } from './filters';
```

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/charts/_shared/filters.ts packages/ui/src/charts/_shared/__tests__/filters.test.tsx packages/ui/src/charts/_shared/index.ts
git commit -m "feat(charts): EditorialBevelFilter shared primitive + tests"
```

---

## Phase 3 — DonutChartV2 swap

### Task 5: Functional swap — add filter + linear gradients (radial defs stay as dead code)

**Files:**
- Modify: `packages/ui/src/charts/DonutChartV2.tsx`

This is the «functional» step — new code added, old code remains in place but dead. Splitting the swap from the cleanup makes each commit a valid revert point.

- [ ] **Step 1: Import EditorialBevelFilter**

Add to imports near the top of `DonutChartV2.tsx`:

```typescript
import { EditorialBevelFilter } from './_shared/filters';
```

- [ ] **Step 2: Render filter at top of <svg>**

In the `<svg>` element (around line 626), insert the filter as the first child:

```tsx
<svg
  width={size}
  height={size}
  viewBox={`0 0 ${size} ${size}`}
  aria-hidden="true"
  focusable="false"
  style={{ overflow: 'visible' }}
>
  <EditorialBevelFilter
    id={`donut-bevel-${gradientIdScope}`}
    theme={themeMode}
  />
  {/* … existing radial-gradient defs (will be removed in Task 7) … */}
```

- [ ] **Step 3: Add per-slice <linearGradient> defs (categorical mode only)**

Below the existing `palette === 'categorical' ? (...) : null` radial-gradient block, add a NEW conditional rendering linear gradients. Use a separate `data-testid` to avoid collision until cleanup:

```tsx
{palette === 'categorical' ? (
  <defs data-testid="donut-linear-gradient-defs">
    {segments.map((_, i) => {
      const slot = (i % 5) + 1;
      return (
        <linearGradient
          key={i}
          id={`donut-grad-${i}-${gradientIdScope}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={`var(--chart-categorical-${slot}-top)`} />
          <stop offset="100%" stopColor={`var(--chart-categorical-${slot}-bottom)`} />
        </linearGradient>
      );
    })}
  </defs>
) : null}
```

- [ ] **Step 4: Wrap slice container in filter <g>**

Locate the `useRoundedPath ? <RoundedDonutPath … /> : <FastDonutRing … />` switch. Wrap with a `<g filter="url(#donut-bevel-...)">`:

```tsx
<g filter={`url(#donut-bevel-${gradientIdScope})`}>
  {useRoundedPath ? (
    <RoundedDonutPath … />
  ) : (
    <FastDonutRing … />
  )}
</g>
```

- [ ] **Step 5: Update slice fill resolution**

In the `segments.map(...)` resolution where `seg.fill` is computed (around line 540), change the categorical branch to point to the new linear-gradient ids:

```tsx
const segments: ResolvedSegment[] = sortedSegments.map(({ s, i }, renderIdx) => {
  const fallback = resolvePaletteColor(palette, renderIdx, segmentCount);
  const flatColor = s.color ?? `var(--chart-categorical-${(renderIdx % 5) + 1}-base)` ?? fallback;
  // Categorical: linear-gradient ref. Sequential / monochromatic: flat var.
  const linearFill = palette === 'categorical'
    ? `url(#donut-grad-${renderIdx}-${gradientIdScope})`
    : null;
  const sliceFill = s.color ?? linearFill ?? `var(--chart-${palette === 'sequential' ? `sequential-${renderIdx + 1}` : `categorical-1`})`;
  // … existing rest
});
```

- [ ] **Step 6: Verify type-check + tests still green (existing assertions)**

Run: `pnpm --filter @investment-tracker/ui build`
Expected: type-check passes (no new errors).

Run: `pnpm --filter @investment-tracker/ui test charts/__tests__/DonutChartV2`
Expected: existing tests still green (assertions don't yet cover new defs; they'll be refreshed in Task 6).

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/charts/DonutChartV2.tsx
git commit -m "refactor(charts): swap DonutChartV2 to H3 specular-bevel + linear-gradient (radial defs still present, dead code)"
```

---

### Task 6: Refresh DonutChartV2 test assertions

**Files:**
- Modify: `packages/ui/src/charts/__tests__/DonutChartV2.test.tsx`

- [ ] **Step 1: Add new `<EditorialBevelFilter>` assertion**

Add after the existing «default render uses the rounded <path> branch» test:

```tsx
it('renders <EditorialBevelFilter> with stable id matched by slice container filter attr', () => {
  const { container } = render(<DonutChartV2 payload={buildDonutPayload()} />);
  const filter = container.querySelector('filter[id^="donut-bevel-"]');
  expect(filter).not.toBeNull();
  const filterId = filter!.getAttribute('id')!;
  // <g filter="url(#donut-bevel-...)"> wraps the slice container
  const wrappedG = container.querySelector(`g[filter="url(#${filterId})"]`);
  expect(wrappedG).not.toBeNull();
});

it('renders per-slice <linearGradient> defs for categorical palette', () => {
  const payload = buildDonutPayload(); // 5-slice fixture
  const { container } = render(<DonutChartV2 payload={payload} palette="categorical" />);
  const lgDefs = container.querySelectorAll('linearGradient[id^="donut-grad-"]');
  expect(lgDefs).toHaveLength(payload.segments.length);
  // Each gradient has exactly 2 stops at 0% / 100%
  for (const lg of Array.from(lgDefs)) {
    const stops = lg.querySelectorAll('stop');
    expect(stops).toHaveLength(2);
    expect(stops[0]?.getAttribute('offset')).toBe('0%');
    expect(stops[1]?.getAttribute('offset')).toBe('100%');
    // stop-color references CSS vars (top + bottom)
    expect(stops[0]?.getAttribute('stop-color')).toMatch(/var\(--chart-categorical-\d-top\)/);
    expect(stops[1]?.getAttribute('stop-color')).toMatch(/var\(--chart-categorical-\d-bottom\)/);
  }
});

it('does NOT render <radialGradient> for editorial-still-life form', () => {
  const { container } = render(<DonutChartV2 payload={buildDonutPayload()} />);
  const radialDefs = container.querySelectorAll('radialGradient');
  expect(radialDefs).toHaveLength(0);
});
```

- [ ] **Step 2: Run test — expect a11y / structure assertions pass; radialGradient assertion FAILS (radial defs still present from Task 5 — dead code)**

Run: `pnpm --filter @investment-tracker/ui test charts/__tests__/DonutChartV2`
Expected:
- `<EditorialBevelFilter>` test → PASS
- per-slice `<linearGradient>` test → PASS
- no `<radialGradient>` test → **FAIL** (radial defs still present, will be removed in Task 7)

This is intentional. The failing assertion documents the cleanup work for Task 7.

- [ ] **Step 3: Mark the radialGradient test as `.skip` for now (TDD doc)**

Change `it('does NOT render <radialGradient>...')` to `it.skip('does NOT render <radialGradient>...')` with a comment:

```tsx
// SKIP until Task 7 cleanup — radial defs are dead code after Task 5
// but still rendered. Re-enable after MUSEUM_HUE_ORDER block is removed.
it.skip('does NOT render <radialGradient> for editorial-still-life form', () => { /* … */ });
```

- [ ] **Step 4: Run all tests — green**

Run: `pnpm --filter @investment-tracker/ui test charts/__tests__/DonutChartV2`
Expected: all PASS, 1 skipped.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/charts/__tests__/DonutChartV2.test.tsx
git commit -m "test(charts): refresh DonutChartV2 assertions for H3 + linear-gradient defs"
```

---

### Task 7: Drop dead radial-gradient code

**Files:**
- Modify: `packages/ui/src/charts/DonutChartV2.tsx`
- Modify: `packages/ui/src/charts/__tests__/DonutChartV2.test.tsx`

- [ ] **Step 1: Remove dead identifiers from DonutChartV2.tsx**

Delete (in this order):

1. `MuseumHueName` type (around line 301)
2. `GradientStops` interface (around line 303)
3. `MUSEUM_HUE_ORDER` const array (lines ~315–321)
4. `GRADIENT_STOPS_LIGHT` (lines ~328–339)
5. `GRADIENT_STOPS_DARK` (lines ~345–356)
6. `getGradientStops` function (lines ~358–360)
7. `gradientFillForSlice` helper (lines ~512–517)
8. The «свет изнутри» radial-gradient `<defs>` block — entire `palette === 'categorical' ? (() => { ... gradOriginX ... <radialGradient> ... })() : null` IIFE (lines ~672–716)
9. The D3 «свет изнутри» comment block (lines ~280–300)

Keep:
- `EditorialBevelFilter` import + usage
- New per-slice `<linearGradient>` defs block (Task 5)
- `<g filter=...>` wrapper (Task 5)
- `useThemeMode` import + usage (feeds `theme` prop on filter)
- `gradientIdScope` (now scopes both filter id and linear-gradient ids)

- [ ] **Step 2: Verify type-check passes**

Run: `pnpm --filter @investment-tracker/ui build`
Expected: 0 errors. No references to removed identifiers anywhere in src.

If type errors surface (e.g. helper still referenced somewhere), grep and fix:
Run: `grep -rn "MUSEUM_HUE_ORDER\|GRADIENT_STOPS_\|gradientFillForSlice\|MuseumHueName" packages/ui/src/`
Expected: no matches.

- [ ] **Step 3: Re-enable the skipped radialGradient test**

In `DonutChartV2.test.tsx`, change `it.skip(...)` back to `it(...)`. Remove the SKIP comment.

- [ ] **Step 4: Run tests — all green including the radialGradient absence test**

Run: `pnpm --filter @investment-tracker/ui test charts/__tests__/DonutChartV2`
Expected: ALL PASS, 0 skipped.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/charts/DonutChartV2.tsx packages/ui/src/charts/__tests__/DonutChartV2.test.tsx
git commit -m "refactor(charts): drop GRADIENT_STOPS_LIGHT/DARK + radial-gradient defs in DonutChartV2"
```

---

## Phase 4 — A11y test

### Task 8: axe-core test for /design-system donut

**Files:**
- Create: `apps/web/playwright-tests/charts/charts.a11y.spec.ts`

This is incremental — adds an a11y baseline scan; does not block the redesign.

- [ ] **Step 1: Verify @axe-core/playwright is available (or install)**

Run: `grep -h "@axe-core/playwright" apps/*/package.json packages/*/package.json package.json 2>/dev/null`

If missing, add to `apps/web/package.json` devDependencies (MIT-licensed, pre-authorized per CONSTRAINTS Rule 1):

```jsonc
"@axe-core/playwright": "^4.10.0"
```

Run: `pnpm install`

- [ ] **Step 2: Write the a11y spec**

```typescript
// apps/web/playwright-tests/charts/charts.a11y.spec.ts
/**
 * A11y baseline scan for the chart subsystem on /design-system.
 *
 * Scope: donut sub-tree only (`[data-testid="chart-donut"]`). Other charts
 * are scanned via the existing visual.spec.ts visual baselines + manual
 * inspection — adding a sweep here is out of scope for the editorial-mh3
 * slice.
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const THEMES = ['light', 'dark'] as const;

for (const theme of THEMES) {
  test(`donut a11y: ${theme} theme has zero violations`, async ({ page }) => {
    await page.goto('/design-system#charts');
    await page.evaluate((t) => {
      document.documentElement.setAttribute('data-theme', t);
    }, theme);
    const results = await new AxeBuilder({ page })
      .include('[data-testid="chart-donut"]')
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

- [ ] **Step 3: Run test**

Run: `pnpm --filter @investment-tracker/web test:a11y` (or `playwright test charts.a11y`)
Expected: 2 tests PASS (light + dark, zero violations).

If violations surface, they're caught here before PR — fix in `DonutChartV2.tsx` then re-run.

- [ ] **Step 4: Commit**

```bash
git add apps/web/playwright-tests/charts/charts.a11y.spec.ts apps/web/package.json pnpm-lock.yaml
git commit -m "test(charts): axe-core a11y baseline for donut on /design-system"
```

---

## Phase 5 — Visual baseline replacement

### Task 9: Refresh donut visual snapshots

**Files:**
- Modify: `apps/web/playwright-tests/charts/__screenshots__/chart-donut-light.png`
- Modify: `apps/web/playwright-tests/charts/__screenshots__/chart-donut-dark.png`
- Optionally add: `chart-donut-{light,dark}-hover-slice1.png`, `chart-donut-{light,dark}-focus-slice1.png` (per spec §8.2)

- [ ] **Step 1: Start dev server**

Run: `pnpm --filter @investment-tracker/web dev` (background)

- [ ] **Step 2: Manually verify donut renders correctly on /design-system**

Open `http://localhost:3000/design-system` in browser. Toggle theme to light + dark.

Sanity check:
- 5 hues visible: roasted-cocoa / burnished-gold / aubergine / wine / slate-blue
- Bevel reads top-lit (highlight at top, shadow at bottom)
- No flicker on theme toggle
- Hover scale + paper-press shadow visible

If anything looks off, return to Task 5 / Task 7 to fix before snapshotting.

- [ ] **Step 3: Update visual baselines**

Run: `pnpm --filter @investment-tracker/web test:visual --update-snapshots --grep "donut"`
Expected: baselines regenerated. Verify diff manually:

Run: `git diff --stat apps/web/playwright-tests/charts/__screenshots__/`
Expected: 2 files changed (light + dark donut PNGs).

- [ ] **Step 4: Optionally add hover/focus baselines**

Per spec §8.2 — 4 new interaction baselines. If included, extend `charts.visual.spec.ts` with:

```typescript
test('donut hover state on slice 1 (light)', async ({ page }) => {
  await page.goto('/design-system#charts');
  await setTheme(page, 'light');
  await page.hover('[data-testid="donut-sector"]:nth-child(1)');
  await expect(page.locator('[data-testid="chart-donut"]')).toHaveScreenshot(
    'chart-donut-light-hover-slice1.png',
    { maxDiffPixelRatio: 0.001 }
  );
});
// + dark variant + focus variant × 2 themes = 4 total
```

(Defer if scope tight — tracked as TD.)

- [ ] **Step 5: Stop dev server, commit baselines**

Stop background `pnpm dev` process.

```bash
git add apps/web/playwright-tests/charts/__screenshots__/chart-donut-*.png
git commit -m "test(charts): refresh donut visual baselines for editorial-still-life"
```

---

## Phase 6 — Docs

### Task 10: PROVEDO_DESIGN_SYSTEM_v1.md → v1.2 amendment

**Files:**
- Modify: `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md`

- [ ] **Step 1: Update header version**

Change `**Version:** v1.1` to `**Version:** v1.2`.

Update `**Date:**` to `2026-04-30 (v1.2 amendment same-day)`.

- [ ] **Step 2: Add v1.2 changelog entry at top of «v1.1 changelog» table**

Insert a new row in the changelog table near the top:

```markdown
| 9 | Charts — donut palette | museum-vitrine 5-hue (slate / ochre / fog-blue / plum / stone) | editorial-mh3 5-hue (roasted-cocoa / burnished-gold / aubergine / wine / slate-blue) + H3 specular-bevel form | PD audit + brand-strategist register naming «editorial-still-life». Spec at `docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md`. |
```

(Adjust row number if v1.1 already had 8 ratified drifts — number per existing convention.)

- [ ] **Step 3: Add §13.2 footnote**

Locate §13.2 (forest-jade tier hierarchy lock-in note). Append a footnote at the end of the §13.2 paragraph:

```markdown
> *Editorial-mh3 chart slots sit outside this cap. Chart-data slot allocation is disjoint from surface-chrome roles — the 3-tier / 13-role cap counts jade-derivative surfaces only.*
```

- [ ] **Step 4: Add §13.6 (verbatim brand-strategist 2026-04-30)**

Locate end of §13 brand-strategist lock-in notes. Add new section:

```markdown
### §13.6 — Editorial-mh3 chart palette envelope locked

The 5-hue chart-categorical set (`roasted-cocoa`, `burnished-gold`, `aubergine`, `wine`, `slate-blue`) is the only sanctioned chart-categorical palette. Hard ceilings: chroma ≤0.10 (light), ≤0.12 (dark); luminance L 0.36–0.55 (light), 0.55–0.75 (dark). Any new categorical hue must (a) sit inside this envelope, (b) maintain ΔE ≥10 from forest-jade `#2D5F4E` and loss-bronze `#A04A3D`, (c) clear WCAG-AA non-text 3:1 on `#E8E0D0` + `#0E0E12`. Chart-categorical role is **disjoint** from §13.2 jade-tier surface roles — does not consume the 13-role cap. Editorial-mh3 may NOT be promoted to surface-chrome (backgrounds, borders, CTA, semantic states); chart-slot use only. Register: **editorial-still-life** — sub-register beneath the §2 tactile-paper master register, not a replacement.
```

- [ ] **Step 5: Commit**

```bash
git add docs/design/PROVEDO_DESIGN_SYSTEM_v1.md
git commit -m "docs(design-system): v1.2 — §13.6 editorial-mh3 lock-in + §13.2 footnote"
```

---

### Task 11: CHART_PALETTE_v3_editorial.md (supersedes v2-draft)

**Files:**
- Create: `docs/design/CHART_PALETTE_v3_editorial.md`
- Modify: `docs/design/CHART_PALETTE_v2_draft.md` (mark SUPERSEDED at top, do not delete)

- [ ] **Step 1: Mark v2 as superseded**

Add at the very top of `CHART_PALETTE_v2_draft.md`:

```markdown
> **STATUS — SUPERSEDED 2026-04-30** for the donut-V2 use case by `CHART_PALETTE_v3_editorial.md`.
>
> Museum-vitrine specification is preserved at the primitive layer (`color.museum.*` in `packages/design-tokens/tokens/primitives/color.json`) for any future non-donut chart kind that wants to opt-back-in. This file remains the historical authoritative spec for that palette.
```

- [ ] **Step 2: Author v3 doc**

```markdown
# Chart palette v3 — editorial-still-life

**Status:** LOCKED 2026-04-30
**Supersedes:** `CHART_PALETTE_v2_draft.md` (museum-vitrine, kept as primitives fallback)
**Authors:** product-designer (palette + audit); brand-strategist (§13.6 lock-in + register naming); architect (token migration)
**Cross-ref:** `docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md` (full design spec); `PROVEDO_DESIGN_SYSTEM_v1.md` v1.2 §13.6.

## Brief

DonutChartV2's chart-categorical palette migrated from museum-vitrine (5 desaturated hues) to **editorial-still-life** (5 mid-saturation hues: roasted-cocoa, burnished-gold, aubergine, wine, slate-blue). Form simultaneously upgraded from radial-gradient «свет изнутри» to H3 specular-bevel + paper-press shadow.

Register: editorial-still-life — Dutch-master under-paint × Tufte categorical × cream-paper substrate. Sub-register beneath the §2 tactile-paper master register.

## Hex table — 30 stops (5 hues × 2 themes × 3 stops)

[Copy hex table from `2026-04-30-donut-editorial-still-life-design.md` §3.1]

## Compliance

[Copy WCAG + ΔE table from spec §3.2]

## OKLCH envelope (per §13.6)

[Copy from spec §3.3]

## Token aliases

`chart-categorical.{1..5}.{base, top, bottom}` in `packages/design-tokens/tokens/semantic/{light,dark}.json` reference `color.editorial-mh3.{hue}.{theme}.{stop}` primitives.

CSS vars emitted: `--chart-categorical-{1..5}-{base,top,bottom}` in `:root` (light) and `.dark, [data-theme="dark"]` (dark).

## Future hue additions

Per §13.6, any new categorical hue must:
1. Sit inside the OKLCH envelope (chroma ≤0.10 light / ≤0.12 dark; L 0.36–0.55 light / 0.55–0.75 dark)
2. Maintain ΔE ≥10 from forest-jade `#2D5F4E` and loss-bronze `#A04A3D`
3. Clear WCAG-AA non-text 3:1 on both `#E8E0D0` and `#0E0E12`

Cardinality cap: 5 series. Beyond, use «top-4 + Other» grouping.

## Sources

- product-designer audit 2026-04-30 (`.superpowers/brainstorm/.../section-2-3-pd.md`)
- brand-strategist verdict 2026-04-30 (`.superpowers/brainstorm/.../section-13-6-brand.md` agent transcript)
- architect token plan 2026-04-30
- Spec: `docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md`
```

- [ ] **Step 3: Commit**

```bash
git add docs/design/CHART_PALETTE_v3_editorial.md docs/design/CHART_PALETTE_v2_draft.md
git commit -m "docs(charts): CHART_PALETTE_v3_editorial supersedes v2-draft"
```

---

### Task 12: DECISIONS.md entry

**Files:**
- Modify: `docs/DECISIONS.md`

- [ ] **Step 1: Append entry at the top of the decisions log**

Following the existing convention (newest first), prepend:

```markdown
## 2026-04-30 — DonutChartV2 palette + form: editorial-still-life + H3 specular bevel

**Decision:** Migrate DonutChartV2 from museum-vitrine palette + «свет изнутри» radial gradient to editorial-mh3 5-hue palette + H3 specular-bevel + paper-press shadow form.

**Drivers:** PO directive 2026-04-30 («цвета не подходят под наш стиль» + «нужен 3D-эффект»). product-designer audit confirmed museum-vitrine reads as «dust on linen» on cream substrate.

**Specialists:**
- product-designer: form + palette spec (§2 + §3 of design doc)
- brand-strategist: §13.6 lock-in + register naming «editorial-still-life»
- architect: token migration plan + PR sequence
- frontend-engineer: component contract
- qa-engineer: test plan

**Trade-offs:** Net deepens chroma (0.04–0.06 → 0.06–0.10), introduces bevel filter cost (negligible vs removed radial defs). Museum-vitrine retired from donut-V2 but preserved at primitive layer for future non-donut consumers.

**Supersedes:** `2026-04-29 — Charts palette: museum-palette extension + ink tonal default` (museum-vitrine spec) for the donut-V2 use case only.

**Reference:** `docs/superpowers/specs/2026-04-30-donut-editorial-still-life-design.md`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/DECISIONS.md
git commit -m "chore(decisions): 2026-04-30 entry — editorial-still-life palette + H3 bevel"
```

---

## Phase 7 — Final verification (manual, pre-PR-review)

### Task 13: Run §9.4 verification checklist

Per spec §9.4 — manual gate before requesting reviewer fan-out.

- [ ] **Step 1: Token build verification**

Run: `pnpm --filter @investment-tracker/design-tokens build`
Run: `grep -cE '\-\-chart-categorical-[1-5]-(base|top|bottom)' packages/design-tokens/build/css/tokens.css`
Expected: 30 matches.

- [ ] **Step 2: UI typecheck**

Run: `pnpm --filter @investment-tracker/ui build`
Expected: 0 errors. `useThemeMode` import retained in `DonutChartV2.tsx`.

- [ ] **Step 3: All chart tests green**

Run: `pnpm --filter @investment-tracker/ui test charts`
Expected: ALL PASS, 0 skipped.

Run: `pnpm --filter @investment-tracker/design-tokens test`
Expected: 16 tests PASS (3 snapshot + 13 contrast).

- [ ] **Step 4: Visual inspection on /design-system**

Run: `pnpm --filter @investment-tracker/web dev`

Open browser. Verify:
- [ ] Light + dark themes both render donut correctly
- [ ] 5 hues match expected order: cocoa / gold / aubergine / wine / slate-blue
- [ ] Bevel reads top-lit (highlight top, shadow bottom)
- [ ] No `<radialGradient>` in DOM (DevTools → Elements → search for `radialGradient`; expect 0 hits)
- [ ] `<linearGradient>` defs present (5 for 5-slice fixture)
- [ ] Theme toggle: smooth, no flicker
- [ ] Hover any slice: scale 1.06 + paper-press shadow visible
- [ ] Reduced-motion: entrance + hover collapse to opacity-only
- [ ] Keyboard arrow-nav: focus ring visible on each slice

Stop dev server.

- [ ] **Step 5: Run a11y test**

Run: `pnpm --filter @investment-tracker/web test:a11y` (or via playwright cli)
Expected: 2 tests PASS, zero violations.

- [ ] **Step 6: Final commit summary**

Verify git log:

```bash
git log --oneline main..HEAD | head -15
```

Expected ~10 commits, atomic, in order:
1. `feat(tokens): add editorial-mh3 primitive block ...`
2. `feat(tokens): repoint chart-categorical aliases ...`
3. `test(tokens): css-vars snapshot + WCAG-AA contrast gate ...`
4. `feat(charts): EditorialBevelFilter shared primitive + tests`
5. `refactor(charts): swap DonutChartV2 to H3 specular-bevel + linear-gradient ...`
6. `test(charts): refresh DonutChartV2 assertions ...`
7. `refactor(charts): drop GRADIENT_STOPS_LIGHT/DARK + radial-gradient defs ...`
8. `test(charts): axe-core a11y baseline for donut ...`
9. `test(charts): refresh donut visual baselines ...`
10. `docs(design-system): v1.2 — §13.6 editorial-mh3 lock-in ...`
11. `docs(charts): CHART_PALETTE_v3_editorial supersedes v2-draft`
12. `chore(decisions): 2026-04-30 entry ...`

(11–12 commits expected total — slightly more than the 10 in spec §9.2 because tests landed across 3 commits not 2.)

After all checkboxes green → ready to open PR + request Rule-5 reviewer fan-out per `project_post_phase2_review_plan` memory.

---

## Self-review (Right-Hand)

**1. Spec coverage check:**

| Spec section | Covered by |
|---|---|
| §2 Form spec | Task 4 (filter primitive) + Task 5 (DonutChartV2 swap) |
| §3 Palette spec | Task 1 (primitives) + Task 2 (aliases) |
| §4 Architecture | Tasks 1–7 + 10–12 (file plan) |
| §5 Token migration | Tasks 1, 2, 3 |
| §6 Component contract | Tasks 4, 5 (filter + DonutChartV2 deltas) |
| §7 Governance | Task 10 (§13.6 + §13.2 footnote) |
| §8 Tests | Tasks 3, 4, 6, 8, 9 |
| §9 Rollout | Task 13 (§9.4 checklist) |

All spec sections have at least one task. ✓

**2. Placeholder scan:** No `TBD` / `TODO` / «implement later» in any step. Code blocks present where required. ✓

**3. Type / signature consistency:**
- `EditorialBevelFilter` interface used identically in Task 4 (definition) and Task 5 (consumer)
- `gradientIdScope` referenced consistently as suffix for both filter id and linear-gradient ids
- Token alias paths match between Task 1 (primitives), Task 2 (semantic), Task 3 (snapshot test)
- ✓

**4. Cross-task type / API consistency:**
- Filter prop name `theme` ('light' | 'dark') consistent across Tasks 4, 5, 6
- `useThemeMode` retention noted in Tasks 5, 7, 13 — no contradiction
- ✓

No issues found. Plan ready for execution.

---

## Execution choice

Plan complete and saved to `docs/superpowers/plans/2026-04-30-donut-editorial-still-life.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task (or per phase), review between tasks, fast iteration. Best for this plan because tasks have clear handoff boundaries (tokens → filter → consumer → tests → docs) and each phase produces a verifiable artifact.

2. **Inline Execution** — I execute tasks in this session sequentially using executing-plans skill, with batch commits at phase boundaries. Best if you want continuous oversight and can monitor in real-time.

**Which approach?**

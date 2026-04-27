# Iconography — Provedo

**Status:** LOCKED 2026-04-27
**Library:** [Lucide](https://lucide.dev/icons/) (MIT license)

---

## Browse + copy

- Full library: **https://lucide.dev/icons/**
- Single icon: `https://lucide.dev/icons/{name}` → «Copy SVG» button
- Search filter at top of icon grid

## Why Lucide (vs alternatives)

Chosen over Phosphor / Tabler / Heroicons / Iconoir / Radix Icons. Reasons:

- 2px stroke + rounded line ends — composes cleanly with **Geist** typography (paper-restraint voice, see `PROVEDO_DESIGN_SYSTEM_v1.md`)
- `stroke="currentColor"` standard → CSS `color` controls icon color, no hardcoded hex
- Used by shadcn (already in our stack indirectly via `packages/ui/`)
- Consistent 24×24 viewBox
- MIT license, free, self-host friendly

## Format requirements (for any icon source)

When fetching SVG from Lucide (or evaluating alternatives later):

- SVG only — never PNG
- `stroke="currentColor"` or `fill="currentColor"`
- viewBox `0 0 24 24`
- **NO** inline `width`/`height` attributes — control via CSS
- **NO** hardcoded hex colors anywhere in SVG markup

This guarantees `color: var(--accent)` on a wrapping element propagates correctly to the SVG.

## Initial 18-icon set for v1

| Use case | Lucide name |
|---|---|
| Success | `check-circle-2` (or `check`) |
| Warning | `triangle-alert` |
| Info | `info` |
| Close / dismiss | `x` |
| Search input | `search` |
| Notifications | `bell` |
| Settings | `settings` |
| CTA arrow | `arrow-right` |
| Breadcrumb separator | `chevron-right` |
| Add | `plus` |
| Edit | `pencil` |
| Delete | `trash-2` |
| Positive delta | `trending-up` |
| Negative delta | `trending-down` |
| Accounts overview | `wallet` |
| Broker / institution | `landmark` |
| Citation glyph | `sparkles` |
| Lane A trust | `shield-check` |

## Where deployed

- `apps/web/public/design-system.html` (static showcase, PR #74 — first 11 icons live; remaining 7 to follow during component migration)
- `packages/ui/` — pending migration (~1 FE-week, see `2026-04-27-design-system-fe-review.md` migration plan)

## Production install

```bash
pnpm add lucide-react
```

```tsx
import { Bell, Check, AlertTriangle } from 'lucide-react';

<Bell className="size-5 text-accent" />
```

## When to consult / extend

For any new icon need (new feature, new state, new surface):

1. Open `lucide.dev/icons/`
2. Search by use case (e.g. «filter», «download», «sync»)
3. If found — add to this doc's table below + use in code
4. If not found — check Phosphor / Tabler as fallback, document choice with rationale here

## Extensions log

Append entries when adding icons beyond the initial 18.

| Date | Icon | Use case | Where |
|---|---|---|---|
| 2026-04-27 | (initial 18) | see table above | apps/web/public/design-system.html |

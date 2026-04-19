# @investment-tracker/shared-types

TypeScript types generated from `tools/openapi/openapi.yaml`.

## Regenerate

```bash
pnpm --filter @investment-tracker/shared-types generate
```

Or, from the repo root:

```bash
bash tools/openapi/generate-ts.sh
```

## Layout

- `src/generated/openapi.d.ts` — generated; do not hand-edit.
- `src/index.ts` — curated re-exports and short aliases.

## Consuming

```ts
import type { Account, Transaction } from "@investment-tracker/shared-types";
import type { components, paths } from "@investment-tracker/shared-types";
```

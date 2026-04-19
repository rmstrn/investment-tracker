# oapi-codegen hand patches

TD-007 (`docs/TECH_DEBT.md`): oapi-codegen v2 does not yet emit correct Go
types for the OpenAPI 3.1 `type: [string, "null"]` nullable pattern. When
a regeneration produces wrong types, we apply a hand-patch here rather
than waiting for upstream.

## How it works

1. `make gen-api` (or `go tool oapi-codegen -config codegen/config.yaml ...`)
   regenerates `internal/api/gen/openapi.gen.go`.
2. If there are patches in this directory (files named `NNN-<slug>.patch`),
   they are applied with `git apply --include=internal/api/gen/**` in
   ascending order.
3. The final file is what ships.

## Adding a new patch

1. Regenerate to confirm the regression reproduces.
2. Fix the generated file by hand.
3. Produce a patch: `git diff internal/api/gen/openapi.gen.go > codegen/patches/NNN-<slug>.patch`
4. Check it in with a one-line description in the commit message.

## Retiring a patch

When the upstream `oapi-codegen` release resolves the pattern the patch
addresses, delete the patch file, regenerate, and verify the tests still
pass. Log the removal in `docs/TECH_DEBT.md` under TD-007.

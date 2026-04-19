# @investment-tracker/config

Shared config surface for other workspaces. Currently just re-exports the root `tsconfig.base.json` and `biome.json` so they're importable via the package scope.

```jsonc
// in any workspace tsconfig.json
{ "extends": "@investment-tracker/config/tsconfig" }
```

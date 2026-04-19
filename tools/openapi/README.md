# OpenAPI — Investment Tracker

This directory is the **source of truth** for the Investment Tracker API.

```
tools/openapi/
├── openapi.yaml                         ← edit this
├── scalar.html                          ← static Scalar preview
├── generate-ts.sh                       ← packages/shared-types + api-client
├── generate-go.sh                       ← apps/api/internal/api/openapi_types.gen.go
├── generate-swift.sh                    ← tools/openapi/generated/swift
├── oapi-codegen.yaml                    ← Go codegen config
├── swift-openapi-generator-config.yaml  ← Swift codegen config
└── generated/swift/                     ← generated; do not hand-edit
```

## Spec-first, always

1. **Edit `openapi.yaml`.** That file is the contract between web, iOS, Core
   API (huma v2) and the AI service. Any change — new endpoint, new field,
   renamed enum value — must start here.
2. **Regenerate artefacts.** From the repo root:
   ```bash
   pnpm generate               # TS + Go + Swift
   pnpm generate:types         # TS only (packages/shared-types)
   pnpm generate:go            # Go huma types
   pnpm generate:swift         # Swift Codable types + client
   ```
3. **Commit generated files.** TS/Go/Swift outputs live in-tree so CI builds
   are hermetic and reviewers can see the blast radius. Never hand-edit
   anything under `packages/shared-types/src/generated/`,
   `apps/api/internal/api/openapi_types.gen.go`, or
   `tools/openapi/generated/swift/`.
4. **Update the Bruno collection** in `tools/api-testing/investment-tracker/`
   if you added or changed an endpoint surface.
5. **Open one PR** with the spec edit, regenerated outputs, and any
   downstream code changes. Small spec tweaks + regen is a one-commit PR.

## Quick lint / preview

```bash
pnpm openapi:lint          # redocly lint — catches spec errors early
pnpm openapi:preview       # serve Scalar reference on http://localhost:4040
pnpm openapi:bundle        # write a single bundled JSON to generated/
```

Opening `scalar.html` directly with any static server (e.g. `python -m http.server`
in this directory) also renders the spec — useful in CI artefacts.

## Authoring conventions

- **Paths under `/v1/`.** Breaking changes get `/v2/`; additive changes stay.
- **Operation ids are `verbNounSubject`.** `listAccounts`, `createAccount`,
  `syncAccount`. Codegen uses these as method names.
- **One schema per concept.** If two endpoints look the same, share the
  schema; don't inline the object twice.
- **Money is a string.** Every monetary field references `#/components/schemas/Money`.
  JSON numbers lose precision on big decimals — we never put them on the wire.
- **Enums exhaust the domain.** If a new broker, insight type or transaction
  type is possible, add it to the enum.
- **Multi-currency.** Portfolio/position values always expose both
  `base` (USD today) and `display` (user preference, FX-converted).
  See `MonetaryValue` / `DisplayMonetaryValue` / `PortfolioValues`.
- **Idempotency.** Every mutating endpoint declares
  `$ref: '#/components/parameters/IdempotencyKey'`. The server stores the
  response for 24h keyed on `(user_id, key, method, path)`.
- **Error envelope.** Every non-2xx response refs `ErrorEnvelope`. New
  machine codes go into its `code` enum.
- **Pagination.** List endpoints use `PaginatedEnvelope` (cursor + has_more)
  and accept `cursor` + `limit` query params.

## JSONB boundary

Some fields cross the Postgres JSONB boundary. We split them explicitly so
type consumers know whether to trust the shape.

| Field                            | Schema                              | Notes                                            |
|----------------------------------|-------------------------------------|--------------------------------------------------|
| `PortfolioSnapshot.allocation`   | `PortfolioAllocation` (map symbol→%)| Typed; validated.                                |
| `PortfolioSnapshot.by_asset_type`| `PortfolioAllocation`               | Typed; validated.                                |
| `PortfolioSnapshot.by_currency`  | `PortfolioAllocation`               | Typed; validated.                                |
| `AIMessage.content`              | `AIMessageContent` (discriminated)  | `text` / `tool_use` / `tool_result`.             |
| `Insight.data`                   | `InsightData`                       | Loose until TASK_05 pins insight catalogue.      |
| `audit_log.metadata`             | `object, additionalProperties: true`| Loose on purpose — writer decides.               |
| `transactions.source_details`    | `object, additionalProperties: true`| Provider-specific; not client-facing.            |
| `usage_counters.details`         | `object, additionalProperties: true`| Internal; never on the wire today.               |

## Open questions

- **`InsightData` discriminated union.** TASK_05 owns the insight catalogue;
  once the five types are pinned the schema becomes a `oneOf` on
  `insight_type` with per-type payloads. Tracked in the TODO on the
  `InsightData` schema.
- **Webhook bodies** (`/auth/webhook`, `/billing/webhook`). The spec
  documents them as opaque pass-throughs today; Clerk/Stripe signatures are
  verified by the Core API in TASK_04. If we want strong types for our own
  downstream consumers, emit a secondary schema.

## How a new endpoint lands

1. Open `openapi.yaml`, add the path + schemas.
2. `pnpm openapi:lint` — fix errors.
3. `pnpm generate` — TS/Go/Swift regenerate. Commit the deltas.
4. Implement the handler in `apps/api/internal/api` (huma v2 binds to the
   generated types) and, if needed, the worker / AI service.
5. Add a Bruno request under `tools/api-testing/investment-tracker/<domain>/`.
6. Write a brief entry in the PR description: what endpoint, what tier it
   costs, what rate limit bucket it sits in.

## Required tooling

- `pnpm` (root manager)
- `bash` (scripts assume POSIX sh semantics; on Windows use Git Bash or WSL)
- `go` for Go codegen (oapi-codegen is fetched via `go run`)
- `swift-openapi-generator` for Swift codegen (optional on non-macOS hosts)
- `@redocly/cli` and `@scalar/cli` are pulled in as devDependencies.

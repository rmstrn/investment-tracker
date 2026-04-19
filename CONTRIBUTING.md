# Contributing

## Branching

- `main` — protected. Only merged via PR after passing CI.
- Feature branches: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`, etc.
- Keep branches short-lived (<3 days if possible). Rebase often.

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint via Lefthook.

Format:

```
<type>(<scope>)?: <subject>

[optional body]

[optional footer]
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Examples:

```
feat(api): add portfolio snapshot endpoint
fix(web): close dropdown on outside click
chore: bump turborepo to 2.3.3
docs(architecture): clarify transaction fingerprinting
```

## Pull requests

1. Open a PR against `main`.
2. CI must be green (lint, typecheck, test, build, security).
3. At least one approval.
4. Squash-merge by default — keeps `main` linear.

PRs should touch one concern. If a feature spans multiple apps, split into logically independent PRs when feasible.

## Code style

- **TypeScript**: Biome enforces format + lint. Run `pnpm lint:fix` before pushing.
- **Go**: `gofmt` + `golangci-lint`. See `apps/api/.golangci.yml`.
- **Python**: `ruff` + `mypy`. See `apps/ai/pyproject.toml`.
- **SQL**: `sqlfluff` (config in `apps/api`).

Pre-commit hooks run Biome/gofmt/ruff on staged files automatically.

## Adding a dependency

- **JS/TS**: add to the relevant workspace: `pnpm --filter @investment-tracker/web add <pkg>`.
- **Go**: `cd apps/api && go get <pkg>`; ensure it's tidied with `go mod tidy`.
- **Python**: `cd apps/ai && uv add <pkg>`.

Avoid adding deps to the root `package.json` unless they're shared tooling (Biome, Turbo, etc.).

## Secrets

Never commit `.env`, `.env.local`, API keys, or tokens. `.gitignore` covers these, but double-check before pushing.

Local dev uses `.env.local`. Production/staging use Doppler.

## Design-to-code

Design tokens come from `packages/design-tokens` (Style Dictionary). Tailwind config in `apps/web` and Swift code in the iOS repo both consume the same source. Don't hardcode colors/spacing — use tokens.

## Database migrations

Migrations live in `apps/api/internal/db/migrations` (goose). Forward-only; never edit an applied migration.

To create one: `cd apps/api && goose create <name> sql`.

#!/usr/bin/env sh
# pre-push typecheck hook. Runs `pnpm typecheck` via whichever runner is
# available. Fails the push if typecheck errors, skips if no runner at all.

set -e

if command -v pnpm >/dev/null 2>&1; then
  pnpm typecheck
elif command -v npx >/dev/null 2>&1; then
  npx --yes pnpm@9.15.0 typecheck
else
  echo "hook-typecheck: neither pnpm nor npx available — skipping"
  exit 0
fi

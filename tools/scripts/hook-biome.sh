#!/usr/bin/env sh
# Pre-commit biome hook. Runs against staged JS/TS/JSON files.
# Gracefully skips if no biome runner is available.

set -e

files="$@"
[ -z "$files" ] && exit 0

if command -v pnpm >/dev/null 2>&1; then
  pnpm exec biome check --write --no-errors-on-unmatched --files-ignore-unknown=true $files
elif [ -x node_modules/.bin/biome ]; then
  node_modules/.bin/biome check --write --no-errors-on-unmatched --files-ignore-unknown=true $files
elif command -v npx >/dev/null 2>&1; then
  npx --no-install biome check --write --no-errors-on-unmatched --files-ignore-unknown=true $files
else
  echo "hook-biome: no biome runner available (pnpm / node_modules / npx) — skipping"
  exit 0
fi

git add $files

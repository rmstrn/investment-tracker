#!/usr/bin/env sh
# Pre-commit biome hook. Runs against staged JS/TS/JSON files.
#
# TD-R083 pattern — probe each runner with `--version` before
# delegating. The old `set -e` + `if command -v pnpm ...` chain
# killed the fallback when pnpm was installed but biome wasn't
# (ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL on a fresh worktree). This
# version resolves the runner first, then runs biome with its
# exit code propagating to the commit.

files="$@"
[ -z "$files" ] && exit 0

if command -v pnpm >/dev/null 2>&1 \
    && pnpm exec biome --version >/dev/null 2>&1; then
    biome_cmd="pnpm exec biome"
elif [ -x node_modules/.bin/biome ]; then
    biome_cmd="node_modules/.bin/biome"
elif command -v npx >/dev/null 2>&1 \
    && npx --no-install biome --version >/dev/null 2>&1; then
    biome_cmd="npx --no-install biome"
else
    echo "hook-biome: no biome runner available (pnpm / node_modules / npx) — skipping"
    exit 0
fi

# shellcheck disable=SC2086 # intentional word-splitting for file list + runner
$biome_cmd check --write --no-errors-on-unmatched --files-ignore-unknown=true $files || exit $?

git add $files

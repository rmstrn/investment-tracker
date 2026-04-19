#!/usr/bin/env sh
# Pre-commit ruff hook. Runs ruff check --fix and ruff format on staged
# apps/ai/**/*.py files. Gracefully skips when uv isn't installed.

set -e

files="$@"
[ -z "$files" ] && exit 0

if ! command -v uv >/dev/null 2>&1; then
  echo "hook-ruff: uv not installed — skipping"
  exit 0
fi

# Strip the apps/ai/ prefix so ruff runs relative to apps/ai.
rel=""
for f in $files; do
  rel="$rel ${f#apps/ai/}"
done

( cd apps/ai && uv run ruff check --fix $rel && uv run ruff format $rel )

git add $files

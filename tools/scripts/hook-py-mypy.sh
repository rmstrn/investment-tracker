#!/usr/bin/env sh
# pre-push mypy hook. Skips when uv isn't installed.

set -e

if ! command -v uv >/dev/null 2>&1; then
  echo "hook-py-mypy: uv not installed — skipping"
  exit 0
fi

[ -d apps/ai ] || { echo "hook-py-mypy: apps/ai missing — skipping"; exit 0; }

( cd apps/ai && uv run mypy src )

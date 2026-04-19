#!/usr/bin/env sh
# Run the given uv command, or skip gracefully if uv isn't installed on the
# current machine (e.g. a web-only developer).
#
# Usage:
#   sh scripts/with-uv.sh <args...>
# Example:
#   sh scripts/with-uv.sh run mypy src

set -e

if ! command -v uv >/dev/null 2>&1; then
  echo "with-uv: uv not installed — skipping ($*)"
  exit 0
fi

exec uv "$@"

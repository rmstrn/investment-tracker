#!/usr/bin/env sh
# Invoke the Go toolchain, ensuring GOCACHE is set when running inside a
# limited shell (e.g. lefthook on Windows, which may strip LocalAppData
# from the environment and leave Go with no module cache to fall back on).
#
# Skips gracefully when Go is not installed on the machine.
#
# Usage:
#   sh scripts/with-go.sh vet ./...
#   sh scripts/with-go.sh build ./cmd/api

set -e

if ! command -v go >/dev/null 2>&1; then
  echo "with-go: go toolchain not installed — skipping ($*)"
  exit 0
fi

# Ensure GOCACHE is set. On Windows, Git Bash may drop LocalAppData, which
# `go` needs to compute a default cache location.
if [ -z "${GOCACHE:-}" ]; then
  if [ -n "${LOCALAPPDATA:-}" ]; then
    export GOCACHE="${LOCALAPPDATA}/go-build"
  elif [ -n "${HOME:-}" ]; then
    export GOCACHE="${HOME}/.cache/go-build"
  else
    export GOCACHE="$(mktemp -d)"
  fi
fi

exec go "$@"

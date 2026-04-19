#!/usr/bin/env sh
# pre-push go vet hook. Skips on machines without Go installed
# (e.g. a web-only dev workstation).

set -e

if ! command -v go >/dev/null 2>&1; then
  echo "hook-go-vet: go toolchain not installed — skipping"
  exit 0
fi

[ -d apps/api ] || { echo "hook-go-vet: apps/api missing — skipping"; exit 0; }

( cd apps/api && go vet ./... )

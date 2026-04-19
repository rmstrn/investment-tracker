#!/usr/bin/env sh
# Pre-commit gofmt hook. Gracefully skips when go isn't installed.

set -e

files="$@"
[ -z "$files" ] && exit 0

if ! command -v gofmt >/dev/null 2>&1; then
  echo "hook-gofmt: go toolchain not installed — skipping"
  exit 0
fi

gofmt -l -w $files
git add $files

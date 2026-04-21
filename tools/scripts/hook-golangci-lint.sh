#!/usr/bin/env sh
# pre-push golangci-lint hook — catches bodyclose / noctx /
# errcheck / gocritic / revive locally so they don't surface for
# the first time in CI (TD-R077; CORS slice PR #54 incident).
#
# Runs only when a pre-push actually changed something in
# apps/api/. Uses `--new-from-rev=origin/main` so the linter
# ignores pre-existing issues from unrelated code and focuses on
# what the current branch added — same baseline CI uses.
#
# Skips gracefully when:
#   - Go toolchain not installed (web-only workstations)
#   - apps/api/ missing (worktree shapes)
#   - origin/main not fetched (clean-slate clone before first fetch)
#   - No .go files touched vs origin/main (fast exit for
#     doc-only PRs)
#
# Install golangci-lint once per dev machine:
#   curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/HEAD/install.sh \
#     | sh -s -- -b "$(go env GOPATH)/bin" v2.1.0

set -e

if ! command -v go >/dev/null 2>&1; then
    echo "hook-golangci-lint: go toolchain not installed — skipping"
    exit 0
fi

[ -d apps/api ] || {
    echo "hook-golangci-lint: apps/api missing — skipping"
    exit 0
}

# Resolve golangci-lint path: prefer a GOPATH-local install
# (stable across branches); fall back to PATH.
gcl=""
if gopath_bin="$(go env GOPATH)/bin/golangci-lint" && [ -x "$gopath_bin" ]; then
    gcl="$gopath_bin"
elif command -v golangci-lint >/dev/null 2>&1; then
    gcl="$(command -v golangci-lint)"
else
    echo "hook-golangci-lint: golangci-lint not installed — skipping"
    echo "  install: https://golangci-lint.run/welcome/install/"
    exit 0
fi

# origin/main baseline is what CI uses; bail cleanly if not
# fetched (new clone before first `git fetch origin`).
if ! git rev-parse --verify origin/main >/dev/null 2>&1; then
    echo "hook-golangci-lint: origin/main not available locally — skipping"
    echo "  run 'git fetch origin main' once to enable the hook"
    exit 0
fi

# Fast-path: any .go file changed vs origin/main?
if ! git diff --name-only origin/main...HEAD | grep -q '^apps/api/.*\.go$'; then
    echo "hook-golangci-lint: no apps/api/*.go changes — skipping"
    exit 0
fi

echo "hook-golangci-lint: linting changes vs origin/main …"
cd apps/api || exit 0
exec "$gcl" run --new-from-rev=origin/main ./...

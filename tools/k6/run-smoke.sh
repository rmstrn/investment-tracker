#!/usr/bin/env bash
# Runs every smoke scenario in sequence against the target BASE_URL,
# aggregating exit codes. Any non-zero exit fails the whole run so CI
# can block a promotion on the first real defect.
#
# Scenarios that require authentication skip when TEST_USER_TOKEN is
# unset so the public /health probe can still run as a minimum gate.
#
# Env:
#   BASE_URL         required
#   TEST_USER_TOKEN  optional (enables authenticated scenarios)

set -uo pipefail

if [ -z "${BASE_URL:-}" ]; then
  echo "run-smoke: BASE_URL must be set" >&2
  exit 2
fi

if ! command -v k6 >/dev/null 2>&1; then
  echo "run-smoke: k6 not in PATH" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SMOKE_DIR="${SCRIPT_DIR}/smoke"

run_scenario() {
  local name="$1"
  local requires_auth="$2"
  local script="${SMOKE_DIR}/${name}.js"

  if [ "$requires_auth" = "yes" ] && [ -z "${TEST_USER_TOKEN:-}" ]; then
    echo "run-smoke: skipping $name (TEST_USER_TOKEN unset)"
    return 0
  fi

  echo "────────────────────────────────────────"
  echo "run-smoke: $name"
  echo "────────────────────────────────────────"
  k6 run --quiet "$script"
}

fail=0
run_scenario health           no  || fail=1
run_scenario portfolio_read   yes || fail=1
run_scenario positions_read   yes || fail=1
run_scenario ai_chat_stream   yes || fail=1
run_scenario idempotency      yes || fail=1

if [ "$fail" -ne 0 ]; then
  echo "run-smoke: one or more scenarios failed" >&2
  exit 1
fi

echo "run-smoke: all scenarios passed"

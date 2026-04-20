#!/usr/bin/env bash
# Verifies that every secret declared as `required` in
# ops/secrets.keys.yaml is present on the target Fly app. Exits non-zero
# when any required key is missing. Unexpected secrets on the Fly app
# (not in the manifest) are reported as warnings, not failures — we do
# not want to block a deploy over a PO-side experimental key.
#
# Inputs (environment):
#   FLY_APP       required — the Fly app to probe (e.g. investment-tracker-api)
#   FLY_API_TOKEN required — passed to flyctl
#
# The manifest is located relative to this script, so invocations from
# any working directory work (CI, local, and hooks).

set -euo pipefail

if [ -z "${FLY_APP:-}" ]; then
  echo "verify-prod-secrets: FLY_APP must be set" >&2
  exit 2
fi

if ! command -v flyctl >/dev/null 2>&1; then
  echo "verify-prod-secrets: flyctl not in PATH" >&2
  exit 2
fi

if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "verify-prod-secrets: neither python3 nor python in PATH" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
KEYS_FILE="${SCRIPT_DIR}/../secrets.keys.yaml"

if [ ! -f "$KEYS_FILE" ]; then
  echo "verify-prod-secrets: manifest not found at $KEYS_FILE" >&2
  exit 2
fi

# Extract `required.*.name` values from the YAML manifest. A tiny python
# one-liner keeps this portable without pulling yq; the stdlib has
# everything we need.
expected="$("$PY" - "$KEYS_FILE" <<'PY'
import sys, re
# Minimal YAML parser: read lines, find `required:` block, emit the
# `name:` field of each `- name: VALUE` entry. Stops at the next
# top-level key. Good enough for a flat, hand-maintained manifest — if
# the shape grows, swap for PyYAML.
path = sys.argv[1]
in_required = False
with open(path, encoding="utf-8") as fh:
    for raw in fh:
        line = raw.rstrip("\n")
        stripped = line.lstrip()
        if not stripped or stripped.startswith("#"):
            continue
        # Top-level key detection: no leading space and ends with ":".
        if line and not line[0].isspace() and line.rstrip().endswith(":"):
            in_required = (line.rstrip() == "required:")
            continue
        if not in_required:
            continue
        m = re.match(r"-\s*name:\s*(\S+)\s*$", stripped)
        if m:
            print(m.group(1))
PY
)"

if [ -z "$expected" ]; then
  echo "verify-prod-secrets: manifest parsed zero required keys — aborting" >&2
  exit 2
fi

# Actual keys from Fly — `flyctl secrets list --json` returns an array
# of objects with a Name field. We only care about names; values never
# leave Fly.
actual="$(flyctl secrets list --app "$FLY_APP" --json 2>/dev/null \
  | "$PY" -c "import json, sys; [print(s['Name']) for s in json.load(sys.stdin)]" \
  | sort -u)"

expected_sorted="$(printf '%s\n' "$expected" | sort -u)"

missing="$(comm -23 <(printf '%s\n' "$expected_sorted") <(printf '%s\n' "$actual"))"
extras="$(comm -13 <(printf '%s\n' "$expected_sorted") <(printf '%s\n' "$actual"))"

if [ -n "$missing" ]; then
  echo "::error::missing required secrets on $FLY_APP:"
  printf '%s\n' "$missing" | sed 's/^/  - /'
  exit 1
fi

if [ -n "$extras" ]; then
  echo "::warning::unexpected secrets on $FLY_APP (not in ops/secrets.keys.yaml):"
  printf '%s\n' "$extras" | sed 's/^/  - /'
fi

count="$(printf '%s\n' "$expected_sorted" | wc -l | tr -d ' ')"
echo "verify-prod-secrets: ok — $count required keys present on $FLY_APP"

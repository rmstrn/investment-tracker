#!/usr/bin/env bash
# Verify required AI Service secrets are present on the target Fly app.
#
# Thin shim over verify-prod-secrets.sh — selects the AI-specific manifest
# (apps/ai/secrets.keys.yaml) via KEYS_FILE env override, then delegates.
# Zero duplication: same parse logic, same flyctl probe, same exit codes.
#
# Inputs (environment):
#   FLY_APP       required — the AI Fly app (e.g. investment-tracker-ai-staging)
#   FLY_API_TOKEN required — passed through to flyctl

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

export KEYS_FILE="${REPO_ROOT}/apps/ai/secrets.keys.yaml"

exec "${SCRIPT_DIR}/verify-prod-secrets.sh" "$@"

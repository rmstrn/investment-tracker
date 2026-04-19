#!/usr/bin/env bash
# Generate Go types from tools/openapi/openapi.yaml using oapi-codegen.
#
#   apps/api/internal/api/openapi_types.gen.go
#
# We intentionally generate only types (models). huma v2 owns the actual
# HTTP layer in apps/api; keeping codegen focused on types avoids pulling
# in a second router abstraction.
#
# Requires either a local install of oapi-codegen, or a `go` toolchain so
# the tool can be invoked via `go run`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SPEC="${ROOT_DIR}/tools/openapi/openapi.yaml"
OUT_DIR="${ROOT_DIR}/apps/api/internal/api"
OUT="${OUT_DIR}/openapi_types.gen.go"
CONFIG="${SCRIPT_DIR}/oapi-codegen.yaml"

mkdir -p "${OUT_DIR}"

if command -v oapi-codegen >/dev/null 2>&1; then
  RUNNER=(oapi-codegen)
elif command -v go >/dev/null 2>&1; then
  RUNNER=(go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.4.1)
else
  echo "need either 'oapi-codegen' on PATH or a Go toolchain" >&2
  exit 1
fi

echo "▸ oapi-codegen ${SPEC} → ${OUT}"
"${RUNNER[@]}" --config "${CONFIG}" "${SPEC}" > "${OUT}"

echo "✓ Go types regenerated."

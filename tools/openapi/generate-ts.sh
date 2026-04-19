#!/usr/bin/env bash
# Generate TypeScript artefacts from tools/openapi/openapi.yaml.
#
#   packages/shared-types/src/generated/openapi.d.ts
#       Raw OpenAPI types (openapi-typescript). Source of truth for every TS
#       consumer; re-exported from packages/shared-types/src/index.ts.
#
# The api-client package does not need regeneration — it is a thin wrapper
# over openapi-fetch parameterised by the generated paths type.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SPEC="${ROOT_DIR}/tools/openapi/openapi.yaml"
OUT="${ROOT_DIR}/packages/shared-types/src/generated/openapi.d.ts"

if [[ ! -f "${SPEC}" ]]; then
  echo "spec not found: ${SPEC}" >&2
  exit 1
fi

mkdir -p "$(dirname "${OUT}")"

echo "▸ openapi-typescript ${SPEC} → ${OUT}"
cd "${ROOT_DIR}"
pnpm --filter @investment-tracker/shared-types exec openapi-typescript "${SPEC}" -o "${OUT}"

echo "✓ TS types regenerated."

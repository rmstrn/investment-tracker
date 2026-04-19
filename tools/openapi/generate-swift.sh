#!/usr/bin/env bash
# Generate Swift types from tools/openapi/openapi.yaml using Apple's
# swift-openapi-generator CLI.
#
#   tools/openapi/generated/swift/Types.swift
#   tools/openapi/generated/swift/Client.swift
#
# iOS consumes these by adding this directory as a Swift Package target
# (see apps/ios/README for wiring, added in TASK_08).
#
# Requires: a Swift toolchain (macOS/Linux) and the swift-openapi-generator
# CLI available as `swift-openapi-generator` on PATH, or the Swift Package
# pinned via apps/ios/Package.swift.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SPEC="${ROOT_DIR}/tools/openapi/openapi.yaml"
OUT_DIR="${SCRIPT_DIR}/generated/swift"
CONFIG="${SCRIPT_DIR}/swift-openapi-generator-config.yaml"

mkdir -p "${OUT_DIR}"

if ! command -v swift-openapi-generator >/dev/null 2>&1; then
  cat >&2 <<'EOF'
swift-openapi-generator not found on PATH.

Install (macOS, Homebrew):
    brew install swift-openapi-generator

Or run via swift run from apps/ios once TASK_08 has scaffolded the package:
    cd apps/ios && swift run swift-openapi-generator generate ...

Skipping for now.
EOF
  exit 0
fi

echo "▸ swift-openapi-generator ${SPEC} → ${OUT_DIR}"
swift-openapi-generator generate \
  --mode types \
  --mode client \
  --output-directory "${OUT_DIR}" \
  --config "${CONFIG}" \
  "${SPEC}"

echo "✓ Swift types regenerated."

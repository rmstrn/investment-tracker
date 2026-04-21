#!/usr/bin/env python3
"""Assert the Go and Python shared-header constants stay in sync.

Cross-service HTTP header names live in two places (language barrier;
no cross-lang codegen yet — Sprint C 3a pragma):

  - apps/api/internal/httpheader/httpheader.go       (Go constants)
  - apps/ai/src/ai_service/http_headers.py           (Python constants)

This script parses the cross-service subset out of each file and
fails the CI job when they drift. Adding a new cross-service header
means editing both files; renaming one means editing both files.
The CI check makes forgetting the second edit loud.

The subset is defined by the CANONICAL list below — edit here when
the contract evolves, not when a new internal Go-only header lands
(those live in httpheader.go but not here / not on the Python
side).

Usage:
    python tools/scripts/check-header-symmetry.py
Exit code 0 = in sync. Non-zero = drift, with a diff printed to
stderr.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
GO_FILE = REPO_ROOT / "apps" / "api" / "internal" / "httpheader" / "httpheader.go"
PY_FILE = REPO_ROOT / "apps" / "ai" / "src" / "ai_service" / "http_headers.py"

# Cross-service header constant pairs: (Go name, Python name).
# Both files MUST define these with identical string values. The
# two languages use idiomatic casing (Go CamelCase, Python
# UPPER_SNAKE_CASE per PEP 8 / ruff N814) so the check maps between
# them explicitly. Other constants may exist on the Go side
# (informational headers the web client reads); those are excluded
# from the symmetry check by design.
CANONICAL: tuple[tuple[str, str], ...] = (
    ("UserID", "USER_ID"),
    ("RequestID", "REQUEST_ID"),
    ("Authorization", "AUTHORIZATION"),
)


def parse_go(path: Path) -> dict[str, str]:
    """Extract `Name = "value"` constants from the Go file."""
    text = path.read_text(encoding="utf-8")
    # Match `Name = "value"` lines; tolerant of surrounding whitespace
    # and trailing comments.
    pattern = re.compile(r'^\s*(\w+)\s*=\s*"([^"]*)"', re.MULTILINE)
    return {name: value for name, value in pattern.findall(text)}


def parse_python(path: Path) -> dict[str, str]:
    """Extract `Name = "value"` module-level constants from the Python file."""
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(r'^(\w+)\s*=\s*"([^"]*)"', re.MULTILINE)
    return {name: value for name, value in pattern.findall(text)}


def main() -> int:
    go = parse_go(GO_FILE)
    py = parse_python(PY_FILE)

    drift: list[str] = []
    for go_name, py_name in CANONICAL:
        go_value = go.get(go_name)
        py_value = py.get(py_name)
        if go_value is None:
            drift.append(f"  missing in Go:     {go_name}")
            continue
        if py_value is None:
            drift.append(f"  missing in Python: {py_name}")
            continue
        if go_value != py_value:
            drift.append(
                f"  value mismatch for {go_name} / {py_name}: "
                f"Go={go_value!r} vs Python={py_value!r}"
            )

    if drift:
        sys.stderr.write(
            "check-header-symmetry: cross-service header constants drift\n"
        )
        for line in drift:
            sys.stderr.write(line + "\n")
        pairs = ", ".join(f"{g}/{p}" for g, p in CANONICAL)
        sys.stderr.write(
            "\n"
            f"Edit {GO_FILE.relative_to(REPO_ROOT)} and "
            f"{PY_FILE.relative_to(REPO_ROOT)} so every CANONICAL pair "
            f"({pairs}) carries the same string value on both sides.\n"
        )
        return 1

    print(
        f"check-header-symmetry: OK — {len(CANONICAL)} cross-service headers "
        "in sync across Go + Python."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Validate tools/k6/smoke/*.js body-key references against the OpenAPI spec.

TD-R076 — contract-sync gate that fires before a silent k6 drift
reaches a deploy-blocking staging job. TD-R075 was exactly that:
four smoke scripts referenced response fields that had been
renamed in a spec tighten, and nothing caught it until the Fly
deploy surfaced 2xx-but-assertion-fail.

How it works:

  1. Load the bundled OpenAPI JSON from
     tools/openapi/generated/openapi.bundled.json. Caller is
     responsible for running `pnpm bundle` first (CI step does).
  2. For every tools/k6/smoke/*.js file, scan for
     http.METHOD(`${BASE_URL}/path`, ...) calls.
  3. In the same file, scan for every body.X[.Y[.Z]] reference
     attached to the JSON body (`const body = r.json()` idiom).
  4. Resolve the 2xx response schema for each (method, path) pair
     in the spec, walking internal $ref as needed.
  5. For each body reference, descend the schema tree following
     the dotted key path. Arrays are transparent — body.data[0]
     or body.data[i] is treated as schema.items.
  6. Report every reference whose field is NOT declared in the
     spec. Exit 1 on any miss.

Not a perfect semantic check — only guards "spec drift renaming
a field the smoke script reads". Runtime type correctness still
lives in the k6 assertions. For the MVP scenarios we have
(~5 scripts), this catches the drift class that bit TD-R075
without dragging in a full JSON-Schema validator.

Run manually:
    pnpm --dir tools/openapi bundle
    python tools/scripts/check-k6-contract.py

CI wires it into the `contract-k6-spec-sync` job.
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
SPEC_PATH = REPO_ROOT / "tools" / "openapi" / "generated" / "openapi.bundled.json"
SMOKE_DIR = REPO_ROOT / "tools" / "k6" / "smoke"

# http.METHOD(`${BASE_URL}/path...`, ...) with METHOD in
# {get, post, put, patch, del, options, head}. Path may contain
# template segments `${var}` that we normalize into `{var}` so
# runtime UUID interpolation maps to the openapi `{id}`
# placeholder pattern.
HTTP_CALL = re.compile(
    r"http\.(get|post|put|patch|del|options|head)"
    r"\(\s*`\$\{BASE_URL\}(?P<path>[^`]+)`",
)

# body.X, body?.X, body.X.Y, body.X?.Y, body['X'], body.X.Y.Z …
# Negative lookbehind for `.` and word chars so `res.body.X` /
# `r.body.X` (raw-string-body method calls like .substring(),
# .includes()) don't match — those are string methods on the
# raw response body, not JSON field refs.
BODY_REF = re.compile(
    r"(?<![\w.])body\s*\??\s*"
    r"(?:"
    r"\.\s*(?P<dotted>[A-Za-z_][A-Za-z0-9_]*"
    r"(?:\s*\??\s*\.\s*[A-Za-z_][A-Za-z0-9_]*|"
    r"\s*\[\s*['\"][^'\"]+['\"]\s*\]|"
    r"\s*\[\s*\d+\s*\])*)"
    r"|"
    r"\[\s*['\"](?P<bracket>[^'\"]+)['\"]\s*\]"
    r"(?P<tail>(?:\s*\??\s*\.\s*[A-Za-z_][A-Za-z0-9_]*|"
    r"\s*\[\s*['\"][^'\"]+['\"]\s*\]|"
    r"\s*\[\s*\d+\s*\])*)"
    r")",
)

# Detects the `const body = r.json()` idiom. Scripts without a
# JSON-body assignment shouldn't be validated — body refs in
# those files are request-payload or raw-string variables.
JSON_BODY_ASSIGN = re.compile(r"\bbody\s*=\s*\w+\.json\(\s*\)")


@dataclass(frozen=True)
class Violation:
    """One drifted reference — script + key chain + reason."""
    script: str
    method: str
    path: str
    key_path: str
    reason: str

    def format(self) -> str:
        return (
            f"  {self.script}: {self.method.upper()} {self.path} — "
            f"body.{self.key_path}: {self.reason}"
        )


def load_spec() -> dict[str, Any]:
    """Load the bundled OpenAPI JSON. Expects `pnpm bundle` to have run."""
    if not SPEC_PATH.exists():
        sys.stderr.write(
            f"check-k6-contract: spec bundle missing at {SPEC_PATH.relative_to(REPO_ROOT)}\n"
            f"  run: pnpm --dir tools/openapi bundle\n"
        )
        sys.exit(2)
    with SPEC_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def resolve_ref(spec: dict[str, Any], node: Any) -> Any:
    """Hop one `$ref: '#/...'` if present. Returns node unchanged otherwise."""
    if isinstance(node, dict) and "$ref" in node:
        ref = node["$ref"]
        if not ref.startswith("#/"):
            return node  # external refs unsupported; leave untouched
        current: Any = spec
        for segment in ref[2:].split("/"):
            if not isinstance(current, dict) or segment not in current:
                return node
            current = current[segment]
        return current
    return node


def find_response_schema(
    spec: dict[str, Any], method: str, path: str
) -> dict[str, Any] | None:
    """Return the application/json schema for the first 2xx response."""
    paths = spec.get("paths") or {}
    endpoint = paths.get(path)
    if endpoint is None:
        return None
    op = endpoint.get(method)
    if op is None:
        return None
    responses = op.get("responses") or {}
    for code, resp in responses.items():
        if not (isinstance(code, str) and code.startswith("2")):
            continue
        content = (resp or {}).get("content") or {}
        json_resp = content.get("application/json") or {}
        schema = json_resp.get("schema")
        if schema:
            return resolve_ref(spec, schema)
    return None


def descend_schema(
    spec: dict[str, Any], schema: Any, key: str
) -> tuple[Any, str | None]:
    """Follow one key through a schema node. Returns (subschema, error_msg)."""
    schema = resolve_ref(spec, schema)
    if not isinstance(schema, dict):
        return (None, f"schema is not an object (got {type(schema).__name__})")

    # Array: descend into items transparently.
    while schema.get("type") == "array":
        items = resolve_ref(spec, schema.get("items") or {})
        schema = items if isinstance(items, dict) else {}

    # Composition (oneOf / anyOf / allOf): try every branch, pass
    # if any one has the key. Smoke scripts expect a specific
    # variant at runtime; refusing to descend would false-alarm.
    for composite_key in ("oneOf", "anyOf", "allOf"):
        branches = schema.get(composite_key)
        if not isinstance(branches, list):
            continue
        for branch in branches:
            resolved = resolve_ref(spec, branch)
            if not isinstance(resolved, dict):
                continue
            sub = (resolved.get("properties") or {}).get(key)
            if sub is not None:
                return (resolve_ref(spec, sub), None)

    props = schema.get("properties") or {}
    if key in props:
        return (resolve_ref(spec, props[key]), None)

    # Free-form objects (additionalProperties: true and no
    # explicit properties) — treat as "anything goes"; can't drift.
    if schema.get("additionalProperties") is True and not props:
        return (schema, None)

    return (None, f"key `{key}` not declared in schema")


def parse_body_refs(script_text: str) -> list[str]:
    """Extract dotted body references like `a.b.c` (no `body.` prefix)."""
    out: list[str] = []
    for match in BODY_REF.finditer(script_text):
        dotted = match.group("dotted")
        bracket = match.group("bracket")
        tail = match.group("tail") or ""
        if dotted:
            chain = dotted
        elif bracket:
            chain = bracket + tail
        else:
            continue
        # Normalize: drop optional-chain ?, collapse `['foo']` to
        # `.foo`, drop numeric `[0]`, split on `.`.
        chain = re.sub(r"\[\s*['\"]([^'\"]+)['\"]\s*\]", r".\1", chain)
        chain = re.sub(r"\[\s*\d+\s*\]", "", chain)
        chain = chain.replace("?", "")
        chain = re.sub(r"\s+", "", chain)
        parts = [p for p in chain.split(".") if p]
        if parts:
            out.append(".".join(parts))
    return out


def validate_script(
    spec: dict[str, Any], script: Path
) -> list[Violation]:
    text = script.read_text(encoding="utf-8")
    violations: list[Violation] = []
    # Only gate scripts that actually parse a JSON response body.
    # Scripts without `const body = r.json()` either use `body`
    # as a request-payload variable (idempotency.js) or never
    # touch the JSON body at all (health.js — status-only).
    if not JSON_BODY_ASSIGN.search(text):
        return violations
    # Convert runtime `${var}` path segments (rare in smoke scripts)
    # to openapi-style `{var}`.
    for call in HTTP_CALL.finditer(text):
        method_raw = call.group(1).lower()
        method = "delete" if method_raw == "del" else method_raw
        path = re.sub(r"\$\{([^}]+)\}", r"{\1}", call.group("path"))
        # Strip query string — body keys are response-shape.
        path = path.split("?", 1)[0]
        schema = find_response_schema(spec, method, path)
        if schema is None:
            # Path not in spec (e.g. /health, /ai/chat/stream SSE).
            # Not drift — silently skip; the contract check only
            # polices scripts that reference JSON bodies of
            # spec'd endpoints.
            continue
        for ref in parse_body_refs(text):
            current: Any = schema
            missing_at: str | None = None
            for i, key in enumerate(ref.split(".")):
                current, err = descend_schema(spec, current, key)
                if err:
                    missing_at = f"{'.'.join(ref.split('.')[:i + 1])} ({err})"
                    break
            if missing_at:
                try:
                    script_name = str(script.relative_to(REPO_ROOT))
                except ValueError:
                    # Test harness uses a temp file outside REPO_ROOT.
                    script_name = script.name
                violations.append(
                    Violation(
                        script=script_name,
                        method=method,
                        path=path,
                        key_path=missing_at,
                        reason="not in OpenAPI response schema",
                    )
                )
    return violations


def main() -> int:
    spec = load_spec()
    scripts = sorted(SMOKE_DIR.glob("*.js"))
    if not scripts:
        sys.stderr.write(f"check-k6-contract: no smoke scripts in {SMOKE_DIR}\n")
        return 2
    violations: list[Violation] = []
    for script in scripts:
        violations.extend(validate_script(spec, script))
    if violations:
        sys.stderr.write("check-k6-contract: k6 scripts reference fields not declared in OpenAPI:\n")
        for v in violations:
            sys.stderr.write(v.format() + "\n")
        sys.stderr.write(
            "\nEither tighten the spec to declare the field, or update the "
            "k6 script to match the current response shape.\n"
        )
        return 1
    print(
        f"check-k6-contract: OK — {len(scripts)} smoke scripts validated "
        "against the OpenAPI bundle."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

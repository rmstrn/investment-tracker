"""Unit tests for check-k6-contract.py.

Exercises the regex extraction + schema walk with a hand-rolled
in-memory spec + k6 scripts — no I/O, no pnpm bundle, no
openapi.yaml. Intent: the validator's own logic must be
independently testable so TD-R076 cannot silently regress.

Two core scenarios per the Sprint D kickoff:
  1. Green case — spec + script agree.
  2. Drift case — script references a field the spec doesn't
     declare; validator must report it.

Plus unit-level checks for the three helpers the drift case
exercises: parse_body_refs, descend_schema, find_response_schema.

Run:
    python -m pytest tools/scripts/check_k6_contract_test.py
    # or stdlib-only:
    python tools/scripts/check_k6_contract_test.py
"""
from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

# Load the sibling script under a valid module name (dash in
# filename breaks plain `import`). Register in sys.modules BEFORE
# exec — the @dataclass decorator inside resolves annotations via
# sys.modules[__module__], and a missing entry there fails with
# "NoneType has no attribute __dict__" on Python 3.11+.
_SCRIPT = Path(__file__).parent / "check-k6-contract.py"
_spec = importlib.util.spec_from_file_location("check_k6_contract", _SCRIPT)
assert _spec is not None and _spec.loader is not None
check_k6_contract = importlib.util.module_from_spec(_spec)
sys.modules["check_k6_contract"] = check_k6_contract
_spec.loader.exec_module(check_k6_contract)


def _spec_with_shape(response_schema: dict) -> dict:
    """Minimal OpenAPI spec fragment for one GET /things endpoint."""
    return {
        "openapi": "3.0.0",
        "paths": {
            "/things": {
                "get": {
                    "responses": {
                        "200": {
                            "content": {
                                "application/json": {"schema": response_schema}
                            }
                        }
                    }
                }
            }
        },
    }


class ParseBodyRefsTests(unittest.TestCase):
    def test_simple_field(self):
        js = "const body = r.json(); return body.foo;"
        self.assertIn("foo", check_k6_contract.parse_body_refs(js))

    def test_optional_chain(self):
        js = "return body?.snapshot_date;"
        self.assertIn("snapshot_date", check_k6_contract.parse_body_refs(js))

    def test_dotted_chain(self):
        js = "body.values?.base?.total_value"
        self.assertIn("values.base.total_value", check_k6_contract.parse_body_refs(js))

    def test_bracketed_string_key(self):
        js = "body['data']"
        self.assertIn("data", check_k6_contract.parse_body_refs(js))

    def test_ignores_res_body_string_methods(self):
        """res.body.substring is a RAW string method, not JSON body ref."""
        js = "res.body.substring(0, 100); r.body.includes('x');"
        refs = check_k6_contract.parse_body_refs(js)
        # Neither substring nor includes should appear — `body.`
        # preceded by another dot doesn't match.
        self.assertNotIn("substring", refs)
        self.assertNotIn("includes", refs)

    def test_ignores_member_body_refs(self):
        """obj.body.x must NOT match (body is a property here)."""
        js = "obj.body.foo + another.body.bar"
        self.assertEqual(check_k6_contract.parse_body_refs(js), [])


class DescendSchemaTests(unittest.TestCase):
    def _spec(self) -> dict:
        return {"components": {"schemas": {}}}

    def test_property_found(self):
        schema = {"type": "object", "properties": {"name": {"type": "string"}}}
        sub, err = check_k6_contract.descend_schema(self._spec(), schema, "name")
        self.assertIsNone(err)
        self.assertEqual(sub.get("type"), "string")

    def test_property_missing(self):
        schema = {"type": "object", "properties": {"name": {"type": "string"}}}
        _, err = check_k6_contract.descend_schema(self._spec(), schema, "age")
        self.assertIsNotNone(err)

    def test_array_transparent(self):
        """body.data[].foo — `data` being an array is see-through."""
        schema = {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"foo": {"type": "string"}},
            },
        }
        sub, err = check_k6_contract.descend_schema(self._spec(), schema, "foo")
        self.assertIsNone(err)
        self.assertEqual(sub.get("type"), "string")

    def test_ref_resolution(self):
        spec = {
            "components": {
                "schemas": {
                    "Thing": {
                        "type": "object",
                        "properties": {"id": {"type": "string"}},
                    }
                }
            }
        }
        schema = {"$ref": "#/components/schemas/Thing"}
        sub, err = check_k6_contract.descend_schema(spec, schema, "id")
        self.assertIsNone(err)
        self.assertEqual(sub.get("type"), "string")


class ValidateScriptTests(unittest.TestCase):
    def _write_script(self, tmp: Path, content: str) -> Path:
        p = tmp / "test.js"
        p.write_text(content, encoding="utf-8")
        return p

    def test_green_case_every_ref_in_spec(self):
        """Spec + script agree → zero violations."""
        spec = _spec_with_shape({
            "type": "object",
            "properties": {
                "id": {"type": "string"},
                "name": {"type": "string"},
            },
        })
        script_text = """
        const res = http.get(`${BASE_URL}/things`);
        const body = res.json();
        check(res, {
          'id present': () => body.id !== undefined,
          'name present': () => body?.name,
        });
        """
        with tempfile.TemporaryDirectory() as tmp:
            script = self._write_script(Path(tmp), script_text)
            violations = check_k6_contract.validate_script(spec, script)
        self.assertEqual(violations, [])

    def test_drift_case_script_references_unknown_field(self):
        """Spec declares only `id`; script reads `body.email` → violation."""
        spec = _spec_with_shape({
            "type": "object",
            "properties": {"id": {"type": "string"}},
        })
        script_text = """
        const res = http.get(`${BASE_URL}/things`);
        const body = res.json();
        if (body.email) doStuff();
        """
        with tempfile.TemporaryDirectory() as tmp:
            script = self._write_script(Path(tmp), script_text)
            violations = check_k6_contract.validate_script(spec, script)
        self.assertEqual(len(violations), 1)
        self.assertIn("email", violations[0].key_path)
        self.assertEqual(violations[0].method, "get")
        self.assertEqual(violations[0].path, "/things")

    def test_script_without_json_body_skipped(self):
        """No `body = X.json()` → validator sees no JSON body, skips refs."""
        spec = _spec_with_shape({"type": "object", "properties": {}})
        script_text = """
        const res = http.get(`${BASE_URL}/things`);
        // No res.json() — this script only checks status.
        check(res, { 'status ok': (r) => r.status === 200 });
        """
        with tempfile.TemporaryDirectory() as tmp:
            script = self._write_script(Path(tmp), script_text)
            violations = check_k6_contract.validate_script(spec, script)
        self.assertEqual(violations, [])

    def test_unknown_endpoint_not_flagged(self):
        """Script hits /weird; spec has no /weird path → skip, don't alarm."""
        spec = _spec_with_shape({"type": "object", "properties": {}})
        script_text = """
        const res = http.get(`${BASE_URL}/weird/not/in/spec`);
        const body = res.json();
        doStuff(body.anything);
        """
        with tempfile.TemporaryDirectory() as tmp:
            script = self._write_script(Path(tmp), script_text)
            violations = check_k6_contract.validate_script(spec, script)
        self.assertEqual(violations, [])


if __name__ == "__main__":
    unittest.main(verbosity=2)

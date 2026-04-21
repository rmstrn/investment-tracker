package db

import "testing"

// TestPackage is a no-op placeholder so the coverage tool has something
// to instrument. This package is either fully generated or has no
// branching logic worth unit-testing; without at least one test file,
// `go test -cover ./...` emits `no such tool "covdata"` noise that
// clutters CI output. See BACKEND_HEALTH_2026-04-21.md § §3.
func TestPackage(t *testing.T) { t.Log("ok") }

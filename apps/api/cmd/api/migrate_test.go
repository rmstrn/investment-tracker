// Unit tests for the migrate subcommand CLI shell. No DB — these cover
// arg parsing and env validation, which must fail fast before any
// network dial. DB-touching assertions live in migrate_integration_test.go.
package main

import (
	"bytes"
	"errors"
	"strings"
	"testing"
)

func TestRunMigrate_EmptyArgs(t *testing.T) {
	var stdout, stderr bytes.Buffer
	err := runMigrate(nil, &stdout, &stderr)
	if !errors.Is(err, errMigrateUsage) {
		t.Fatalf("want errMigrateUsage, got %v", err)
	}
	if !strings.Contains(stderr.String(), "usage: api migrate") {
		t.Fatalf("usage text not printed to stderr: %q", stderr.String())
	}
}

func TestRunMigrate_UnknownCommand(t *testing.T) {
	var stdout, stderr bytes.Buffer
	err := runMigrate([]string{"nuke"}, &stdout, &stderr)
	if !errors.Is(err, errMigrateUsage) {
		t.Fatalf("want errMigrateUsage wrap, got %v", err)
	}
	if !strings.Contains(err.Error(), `"nuke"`) {
		t.Fatalf("expected error to cite unknown command, got %q", err.Error())
	}
}

func TestRunMigrate_MissingDatabaseURL(t *testing.T) {
	t.Setenv("DATABASE_URL", "")
	var stdout, stderr bytes.Buffer
	err := runMigrate([]string{"up"}, &stdout, &stderr)
	if err == nil {
		t.Fatal("expected error when DATABASE_URL is unset")
	}
	if errors.Is(err, errMigrateUsage) {
		t.Fatalf("missing env should not be a usage error: %v", err)
	}
	if !strings.Contains(err.Error(), "DATABASE_URL") {
		t.Fatalf("error should mention DATABASE_URL, got %q", err.Error())
	}
}

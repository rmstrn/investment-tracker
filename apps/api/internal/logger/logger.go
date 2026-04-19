// Package logger builds the zerolog logger used across the API process.
//
// Format rules:
//
//   - Production / staging: JSON to stdout (ingested by Grafana Loki).
//   - Development / tests: pretty console writer, unless LOG_FORMAT=json
//     is set explicitly (useful when piping dev logs to a file).
//
// Every log line carries service="api" and env=<environment> so a single
// Loki query fan-out across services still cleanly separates this process.
package logger

import (
	"os"
	"strings"
	"time"

	"github.com/rs/zerolog"
)

// Options configures New. Empty Format means auto-pick from Env.
type Options struct {
	Env     string
	Level   string
	Format  string
	Service string
}

// New builds a base logger. Pass it down via request context or DI — do not
// reach for zerolog.Log (the package-level default) from application code.
func New(opts Options) zerolog.Logger {
	level, err := zerolog.ParseLevel(strings.ToLower(opts.Level))
	if err != nil || level == zerolog.NoLevel {
		level = zerolog.InfoLevel
	}

	zerolog.TimeFieldFormat = time.RFC3339Nano
	zerolog.DurationFieldUnit = time.Millisecond
	zerolog.DurationFieldInteger = false

	var w = os.Stdout
	var writer zerolog.LevelWriter = zerolog.MultiLevelWriter(w)

	useConsole := opts.Format == "console" ||
		(opts.Format == "" && (opts.Env == "development" || opts.Env == "test"))

	if useConsole {
		cw := zerolog.ConsoleWriter{Out: w, TimeFormat: time.RFC3339}
		writer = zerolog.MultiLevelWriter(cw)
	}

	service := opts.Service
	if service == "" {
		service = "api"
	}

	env := opts.Env
	if env == "" {
		env = "development"
	}

	return zerolog.New(writer).
		Level(level).
		With().
		Timestamp().
		Str("service", service).
		Str("env", env).
		Logger()
}

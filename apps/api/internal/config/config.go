// Package config holds runtime configuration loaded from environment variables.
// TASK_04 will expand this with full validation. Scaffold-only for now.
package config

import "os"

type Config struct {
	ListenAddr  string
	DatabaseURL string
	RedisURL    string
}

// Load reads configuration from environment with sane defaults for local dev.
func Load() Config {
	return Config{
		ListenAddr:  envOr("API_LISTEN_ADDR", ":8080"),
		DatabaseURL: envOr("DATABASE_URL", "postgres://investment:investment@localhost:5432/investment_dev?sslmode=disable"),
		RedisURL:    envOr("REDIS_URL", "redis://localhost:6379/0"),
	}
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

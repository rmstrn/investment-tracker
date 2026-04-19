// Package server assembles the Fiber application from configured
// dependencies. Handlers and middleware close over `*Deps` rather than
// over N individual arguments — as PR B2/B3 grow the dep surface
// (Stripe client, asynq client, market-data clients) the signature
// stays the same and only `Deps` gets fields.
package server

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
)

// Deps is the application's dependency bag. It is built once in main and
// passed to every handler constructor. Nothing here takes ownership of
// lifecycle — main is responsible for creating and closing each field.
type Deps struct {
	Cfg      *config.Config
	Log      zerolog.Logger
	Pool     *pgxpool.Pool
	Cache    *cache.Client
	UserRepo *users.Repo
}

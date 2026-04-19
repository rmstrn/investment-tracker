// Package app holds types shared across the server assembly and its
// handlers. Keeping Deps here (instead of in `server`) avoids the
// import cycle `server → handlers → server` since handlers need the
// dependency bag.
package app

import (
	"github.com/MicahParks/keyfunc/v3"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
)

// Deps is the application's dependency bag. It is built once in main
// and passed to every handler constructor. Nothing here takes ownership
// of lifecycle — main is responsible for creating and closing each
// field.
type Deps struct {
	Cfg      *config.Config
	Log      zerolog.Logger
	Pool     *pgxpool.Pool
	Cache    *cache.Client
	UserRepo *users.Repo
	// JWKS is the Clerk verification key set, fetched once at startup
	// (main.run) and asserted non-nil there. Hoisting it to Deps lets
	// server.New stay synchronous — no network on the server-assembly
	// path.
	JWKS keyfunc.Keyfunc
}

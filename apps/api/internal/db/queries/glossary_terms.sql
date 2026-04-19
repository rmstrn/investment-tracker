-- name: ListGlossaryTermsByLocale :many
-- Locale-scoped list for GET /glossary. Default locale is handled by
-- the caller — the query always filters on an explicit locale string.
SELECT * FROM glossary_terms
WHERE locale = $1
ORDER BY slug;

-- name: GetGlossaryTerm :one
-- Composite-key lookup for GET /glossary/{slug}?locale=. pgx.ErrNoRows
-- → handler 404.
SELECT * FROM glossary_terms
WHERE slug = $1 AND locale = $2;

-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- TASK_03_UPDATE Tier C — glossary_terms (DDL only)
--
-- Backs /glossary and /glossary/{slug} (design brief §14.3 Explainer).
-- The seed (~50 MVP terms) lives in a separate migration so that if the
-- post-MVP plan swaps to an admin-editable content surface, the seed
-- migration can be dropped without touching DDL.
-- =====================================================================

CREATE TABLE glossary_terms (
    slug             TEXT NOT NULL,
    locale           TEXT NOT NULL DEFAULT 'en',
    title            TEXT NOT NULL,
    short_def        TEXT NOT NULL,            -- tooltip copy (1 sentence)
    long_def         TEXT,                     -- expanded paragraph used by the chat Explainer callout
    related_slugs    TEXT[] NOT NULL DEFAULT '{}',
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (slug, locale)
);

-- List-all (locale-scoped) — `/glossary?locale=en`.
CREATE INDEX idx_glossary_terms_locale
    ON glossary_terms(locale);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_glossary_terms_locale;
DROP TABLE IF EXISTS glossary_terms;
-- +goose StatementEnd

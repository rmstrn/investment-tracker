-- name: ListAIConversationsByUser :many
-- Cursor pagination by (updated_at, id) descending so the most
-- recently-touched conversation is on top. Each row brings its
-- message_count and a last_message_preview via subqueries so the
-- handler does not need a second round-trip per row.
SELECT
    c.id,
    c.title,
    c.created_at,
    c.updated_at,
    COALESCE((
        SELECT COUNT(*)::int FROM ai_messages m WHERE m.conversation_id = c.id
    ), 0)::int AS message_count,
    (
        SELECT m.content
        FROM ai_messages m
        WHERE m.conversation_id = c.id
          AND m.role = 'assistant'
        ORDER BY m.created_at DESC
        LIMIT 1
    ) AS last_message_content
FROM ai_conversations c
WHERE c.user_id = @user_id
  AND (c.updated_at, c.id) < (@cursor_ts::timestamptz, @cursor_id::uuid)
ORDER BY c.updated_at DESC, c.id DESC
LIMIT @row_limit;

-- name: GetAIConversationByID :one
-- Scoped by user_id so cross-user access → ErrNoRows → 404.
SELECT * FROM ai_conversations WHERE id = $1 AND user_id = $2;

-- name: ListAIConversationMessages :many
-- Messages for one conversation, cursor-paginated by (created_at, id)
-- descending so the detail endpoint surfaces freshest first.
SELECT * FROM ai_messages
WHERE conversation_id = @conversation_id
  AND (created_at, id) < (@cursor_ts::timestamptz, @cursor_id::uuid)
ORDER BY created_at DESC, id DESC
LIMIT @row_limit;

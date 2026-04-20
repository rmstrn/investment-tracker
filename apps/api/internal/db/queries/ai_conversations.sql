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

-- name: InsertAIConversation :one
-- POST /ai/conversations. id is generated app-side (uuid v7);
-- title is optional — when null the AI Service auto-titles from
-- the first user message on the next /ai/chat round.
INSERT INTO ai_conversations (id, user_id, title)
VALUES ($1, $2, $3)
RETURNING *;

-- name: DeleteAIConversation :execrows
-- DELETE /ai/conversations/{id}. CASCADE on ai_messages.conversation_id
-- removes the message thread automatically. Returns row-count so
-- the handler can distinguish "deleted" from "not found / cross-user".
DELETE FROM ai_conversations
WHERE id = $1 AND user_id = $2;

-- name: InsertAIMessage :one
-- Written by /ai/chat + /ai/chat/stream after the assistant turn
-- finishes (SSE message_stop). The handler also lands the prior
-- user turn via this same query on the way in. id is app-generated
-- (uuid v7). content is the JSONB content-blocks array per the
-- openapi AIMessageContent[] shape. tokens_used is nullable — only
-- the assistant row carries it (sum of input+output from usage).
INSERT INTO ai_messages (id, conversation_id, role, content, tokens_used)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListAIConversationMessagesForContext :many
-- Loads the recent turns for the AI Service history payload.
-- ORDER BY created_at ASC so the caller can ship them verbatim
-- (oldest → newest). Role IN ('user','assistant') — `tool` rows
-- live for audit only and never enter the context window; the
-- AI Service does not accept them.
SELECT * FROM ai_messages
WHERE conversation_id = @conversation_id
  AND role IN ('user', 'assistant')
ORDER BY created_at ASC, id ASC
LIMIT @row_limit;

-- name: TouchAIConversation :exec
-- Bumps updated_at so /ai/conversations list surfaces the freshest
-- thread first. Called inside the same tx as the assistant-message
-- insert so the two writes are atomic.
UPDATE ai_conversations
SET updated_at = now()
WHERE id = $1;

//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func seedConversation(t *testing.T, userID uuid.UUID, title string, updatedAt time.Time) uuid.UUID {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO ai_conversations (id, user_id, title, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $4)
	`, id, userID, title, pgtype.Timestamptz{Time: updatedAt, Valid: true})
	if err != nil {
		t.Fatalf("seed conversation: %v", err)
	}
	return id
}

func seedMessage(t *testing.T, convID uuid.UUID, role, textContent string, createdAt time.Time) {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	content := `[{"type":"text","text":"` + textContent + `"}]`
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO ai_messages (id, conversation_id, role, content, created_at)
		VALUES ($1, $2, $3, $4::jsonb, $5)
	`, id, convID, role, content, pgtype.Timestamptz{Time: createdAt, Valid: true})
	if err != nil {
		t.Fatalf("seed message: %v", err)
	}
}

func TestListAIConversations_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")
	now := time.Now().UTC()

	c1 := seedConversation(t, uid, "Older talk", now.AddDate(0, 0, -2))
	seedMessage(t, c1, "assistant", "this is older preview", now.AddDate(0, 0, -2))

	c2 := seedConversation(t, uid, "Newer talk", now)
	seedMessage(t, c2, "user", "user ask", now)
	seedMessage(t, c2, "assistant", "assistant reply", now.Add(1*time.Second))

	resp, body := doJSON(t, a, fiber.MethodGet, "/ai/conversations",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len = %d, want 2", len(data))
	}
	first := data[0].(map[string]any)
	if first["title"] != "Newer talk" {
		t.Fatalf("first title = %v, want Newer talk (sort DESC)", first["title"])
	}
	if first["last_message_preview"] != "assistant reply" {
		t.Fatalf("preview = %v", first["last_message_preview"])
	}
	if first["message_count"].(float64) != 2 {
		t.Fatalf("message_count = %v, want 2", first["message_count"])
	}
}

func TestGetAIConversation_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	conv := seedConversation(t, uid, "Portfolio Q", time.Now().UTC())
	seedMessage(t, conv, "user", "how am i doing", time.Now().UTC())
	seedMessage(t, conv, "assistant", "up 5%", time.Now().UTC().Add(1*time.Second))

	resp, body := doJSON(t, a, fiber.MethodGet, "/ai/conversations/"+conv.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)

	c := out["conversation"].(map[string]any)
	if c["id"] != conv.String() {
		t.Fatalf("id = %v", c["id"])
	}
	msgs := out["messages"].([]any)
	if len(msgs) != 2 {
		t.Fatalf("msgs = %d, want 2", len(msgs))
	}
}

func TestGetAIConversation_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")
	phantom := uuid.Must(uuid.NewV7())

	resp, _ := doJSON(t, a, fiber.MethodGet, "/ai/conversations/"+phantom.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404", resp.StatusCode)
	}
}

func TestGetAIConversation_OtherUser_404(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")
	other := seedUser(t, "plus")
	conv := seedConversation(t, other, "other user's convo", time.Now().UTC())

	resp, _ := doJSON(t, a, fiber.MethodGet, "/ai/conversations/"+conv.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404 for cross-user", resp.StatusCode)
	}
}

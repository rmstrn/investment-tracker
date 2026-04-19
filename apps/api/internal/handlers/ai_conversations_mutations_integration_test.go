//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func TestCreateAIConversation_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{"title": "Portfolio Q"}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/conversations",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["title"] != "Portfolio Q" {
		t.Fatalf("title = %v", out["title"])
	}
	if out["message_count"].(float64) != 0 {
		t.Fatalf("message_count = %v, want 0 on fresh row", out["message_count"])
	}
	if _, err := uuid.Parse(out["id"].(string)); err != nil {
		t.Fatalf("id not a uuid: %v", err)
	}
}

func TestCreateAIConversation_EmptyBody_TitleNull(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/conversations",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["title"] != nil {
		t.Fatalf("title = %v, want nil for empty body", out["title"])
	}
}

func TestCreateAIConversation_TooLongTitle_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	long := make([]byte, 250)
	for i := range long {
		long[i] = 'a'
	}
	body := map[string]any{"title": string(long)}
	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/conversations",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestDeleteAIConversation_HappyPath_Cascades(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	// Create + verify with one message attached.
	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/conversations",
		uid.String(), testSharedInternalToken, map[string]any{"title": "Tmp"})
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("create status = %d", resp.StatusCode)
	}
	var created map[string]any
	_ = json.Unmarshal(raw, &created)
	convID := created["id"].(string)

	// Seed a message via raw SQL — there is no /ai/messages POST in
	// B3-ii-a (that's part of /ai/chat in B3-ii-b), but the CASCADE
	// rule must drop existing messages on conv delete.
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO ai_messages (id, conversation_id, role, content)
		VALUES ($1, $2, 'user', '[{"type":"text","text":"hi"}]'::jsonb)
	`, uuid.Must(uuid.NewV7()), convID)
	if err != nil {
		t.Fatalf("seed message: %v", err)
	}

	resp, _ = doJSON(t, a, fiber.MethodDelete, "/ai/conversations/"+convID,
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNoContent {
		t.Fatalf("delete status = %d, want 204", resp.StatusCode)
	}

	// Subsequent GET → 404.
	resp, _ = doJSON(t, a, fiber.MethodGet, "/ai/conversations/"+convID,
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("post-delete GET = %d, want 404", resp.StatusCode)
	}

	// And the message row is gone via CASCADE.
	var msgCount int
	if err := testPool.QueryRow(context.Background(),
		"SELECT COUNT(*)::int FROM ai_messages WHERE conversation_id = $1", convID).Scan(&msgCount); err != nil {
		t.Fatalf("count messages: %v", err)
	}
	if msgCount != 0 {
		t.Fatalf("messages remaining = %d, want 0 (CASCADE)", msgCount)
	}
}

func TestDeleteAIConversation_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	phantom := uuid.Must(uuid.NewV7())

	resp, _ := doJSON(t, a, fiber.MethodDelete, "/ai/conversations/"+phantom.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404", resp.StatusCode)
	}
}

func TestDeleteAIConversation_CrossUser_404(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	other := seedUser(t, "free")

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/conversations",
		other.String(), testSharedInternalToken, map[string]any{"title": "OtherUser"})
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("seed conv: %d", resp.StatusCode)
	}
	var seeded map[string]any
	_ = json.Unmarshal(raw, &seeded)

	resp, _ = doJSON(t, a, fiber.MethodDelete, "/ai/conversations/"+seeded["id"].(string),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("cross-user delete = %d, want 404", resp.StatusCode)
	}
}

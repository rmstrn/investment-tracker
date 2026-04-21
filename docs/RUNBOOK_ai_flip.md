# Runbook — AI Service 404-swallow flip

**Status:** DRAFT — pre-flight prepared while CC works on TASK_04 B3-i. Flip execution blocked until PR B3-iii merges (Core API write path closed).

**Update 2026-04-21:** AI Service staging is now live at `https://investment-tracker-ai-staging.fly.dev` (TD-070 closed). Prod flip remains pending — gating factor is Core API prod cutover (24-48h staging soak + PR D workers) + AI Service prod app (`investment-tracker-ai`, separate from staging). Bridge invariant `AI_SERVICE_TOKEN` ≡ `INTERNAL_API_TOKEN` verified на staging; same invariant will be re-verified for prod (see TD-082 reserved — automated parity check opens real with prod flip).

**Owner:** TBD (AI Service maintainer at flip time)
**Est. duration:** 30-60 min flip + 24h monitoring window
**Blast radius:** AI Chat endpoints (`POST /v1/ai/chat`, `POST /v1/ai/chat/stream`), Insights generation. No data path impact.

---

## Context

AI Service (`apps/ai`, Python 3.13 / FastAPI) calls Core API via `httpx`-based client in `apps/ai/src/ai_service/clients/core_api.py`. This client is used by AI tools (`get_portfolio_summary`, `get_positions`, `get_transactions`, `get_insights`, `get_market_data`, etc.) — Claude invokes them during chat/insights generation.

During Core API buildout (PRs A → B2c), many read-path endpoints were not yet implemented — client would receive `404 NOT_FOUND` from Core API. Rather than propagate the error (which would break Claude's tool_use loop), the client **soft-swallows 404** and returns a `None`/empty payload to the caller. Claude interprets that as «no data» and proceeds gracefully.

This was a deliberate temporary bridge. Once Core API is feature-complete (B3-iii merged), a 404 from Core API indicates a real bug, not a missing feature — AI Service should **fail fast**, propagate the error as `tool_error` back to Claude, and surface it in logs/Sentry for investigation.

---

## Current state (at time of writing this runbook)

### Core API coverage
- **Read path:** ✅ closed (B2c merged → 30 GET endpoints authenticated)
- **Write path:** 🚧 B3-i merged (2026-04-19, SHA 11d6098); B3-ii in progress; B3-iii queued.
- AI Service uses only read endpoints; write-path gap doesn't affect AI flows directly. But AI chat depends on `POST /v1/ai/chat/stream` being proxied by Core API (lands in B3-ii) → so **full AI flow is not end-to-end until B3-ii is merged**.

### AI Service swallow code (to be removed)
File: `apps/ai/src/ai_service/clients/core_api.py`

Approximate current shape (confirm at flip time by reading the file):

```python
class CoreAPIClient:
    async def get_portfolio(self, user_id: str) -> Portfolio | None:
        try:
            resp = await self._http.get(f"/v1/portfolio", headers=self._headers(user_id))
            if resp.status_code == 404:
                logger.warning("core_api_404_swallowed", endpoint="get_portfolio", user_id=user_id)
                return None                      # ← this is what we're flipping
            resp.raise_for_status()
            return Portfolio.model_validate(resp.json())
        except httpx.HTTPError as e:
            ...
```

Pattern repeats for every tool method. Magnitude ~10-15 call sites.

### What "swallow" looks like to Claude
Tool returns structured «no data» payload (e.g. `{"positions": []}` or `{"error": null, "data": null}`). Claude's tool_use loop receives it without error and moves to the next step — user sees a non-error response with possibly generic language («I don't see any positions yet»).

### What "strict" will look like
Tool returns `tool_error` with structured reason (`endpoint_not_found`, `core_api_unavailable`). Claude surfaces the error back to the user in chat («I ran into an error retrieving your portfolio. Please try again»). AI Service logs the error with `user_id`, endpoint, request-id → Sentry alert.

---

## Flip trigger conditions (all must hold)

1. **PR B3-ii merged** — SSE reverse-proxy from Core API to AI Service is live; AI flow is end-to-end in production.
2. **PR B3-iii merged** — Core API write path closed; `webhook_events` migration applied; no more «not yet implemented» reads or writes on AI Service's code paths.
3. **No open P1 incidents** touching AI or Core API in the last 72h.
4. **Staging parity:** staging Core API is on the same commit as prod (no pending deploys in flight).
5. **Business hours** in maintainer's timezone — avoid flipping late Friday or just before a long weekend.

---

## Pre-flight checks

Before opening the flip PR:

- [ ] Grep `apps/ai/src/` for all 404 swallow sites — produce a checklist of call sites.
- [ ] Verify each call site has a corresponding Core API endpoint in `tools/openapi/openapi.yaml` (no real «not implemented» cases left).
- [ ] Check AI Service integration tests (`apps/ai/tests/integration/`) — confirm they cover happy path + error path for each tool. Add tests for 404-propagation if missing.
- [ ] Check Sentry dashboards: look at the last 7 days of `core_api_404_swallowed` log events in AI Service. Expect zero events in prod — if non-zero, investigate before flipping (swallows hide real bugs).
- [ ] Confirm `X-Request-Id` propagates from Core API back into AI Service logs → makes post-flip debugging tractable.
- [ ] Coordinate with whoever owns on-call: flip introduces visible errors if Core API has a hiccup; they should know.

---

## Implementation

### Step 1: Replace swallow with strict error class

New error class (file: `apps/ai/src/ai_service/clients/errors.py`):

```python
class CoreAPIError(Exception):
    """Raised when Core API returns a non-success response that AI Service
    can't reasonably proceed past. Propagates to Claude as tool_error."""

    def __init__(self, endpoint: str, status_code: int, request_id: str | None, detail: str):
        self.endpoint = endpoint
        self.status_code = status_code
        self.request_id = request_id
        self.detail = detail
        super().__init__(f"{endpoint} returned {status_code}: {detail} (rid={request_id})")


class CoreAPINotFound(CoreAPIError):
    pass


class CoreAPIUnavailable(CoreAPIError):
    """5xx or network error — transient, distinguish from 404 for retry policy."""
    pass
```

Update `CoreAPIClient` call sites:

```python
async def get_portfolio(self, user_id: str) -> Portfolio:
    resp = await self._http.get(f"/v1/portfolio", headers=self._headers(user_id))
    request_id = resp.headers.get("X-Request-Id")
    if resp.status_code == 404:
        raise CoreAPINotFound("get_portfolio", 404, request_id, resp.text)
    if resp.status_code >= 500:
        raise CoreAPIUnavailable("get_portfolio", resp.status_code, request_id, resp.text)
    resp.raise_for_status()
    return Portfolio.model_validate(resp.json())
```

### Step 2: Wire strict errors into Claude tool_use loop

In the agent/tool dispatcher (likely `apps/ai/src/ai_service/agents/tools.py` or similar):

```python
try:
    result = await tool_fn(**args)
    return {"type": "tool_result", "tool_use_id": tool_use_id, "content": result}
except CoreAPIError as e:
    logger.error(
        "core_api_error",
        endpoint=e.endpoint,
        status_code=e.status_code,
        request_id=e.request_id,
        user_id=user_id,
    )
    sentry_sdk.capture_exception(e)
    return {
        "type": "tool_result",
        "tool_use_id": tool_use_id,
        "content": f"Tool execution failed: {e.detail}. Please try again or contact support.",
        "is_error": True,
    }
```

**Key:** `is_error: True` in tool_result — Claude sees it as an error, doesn't hallucinate data.

### Step 3: Add integration tests

New test file: `apps/ai/tests/integration/test_core_api_strict_errors.py`

```python
@pytest.mark.asyncio
async def test_get_portfolio_propagates_404(httpx_mock):
    httpx_mock.add_response(url=".../v1/portfolio", status_code=404)
    client = CoreAPIClient(...)
    with pytest.raises(CoreAPINotFound) as exc:
        await client.get_portfolio(user_id="u1")
    assert exc.value.endpoint == "get_portfolio"

@pytest.mark.asyncio
async def test_tool_dispatcher_emits_tool_error_on_core_api_404(httpx_mock, dispatcher):
    httpx_mock.add_response(url=".../v1/portfolio", status_code=404)
    result = await dispatcher.execute("get_portfolio", {"user_id": "u1"}, tool_use_id="tu1")
    assert result["is_error"] is True
    assert "failed" in result["content"].lower()
```

---

## Rollout plan

Sequential, never parallel.

### Phase 1 — dev (same day)
1. Merge flip PR into `main`.
2. Deploy AI Service to dev environment.
3. Run smoke test: open AI chat, ask portfolio question. Expect successful response.
4. Deliberately break it: scale Core API to 0 replicas in dev → send chat message → expect user to see error message, Sentry alert fires, AI Service logs `CoreAPIUnavailable` with request-id.
5. Restore Core API to 1 replica, verify chat works again.

### Phase 2 — staging (next day)
6. Deploy AI Service to staging.
7. Leave it for 24h. Monitor Sentry: no `CoreAPIError` events expected (staging Core API is healthy).
8. If any event fires, investigate root cause before promoting. Do not suppress.

### Phase 3 — prod (3rd day, mid-morning)
9. Deploy AI Service to prod.
10. Monitor `CoreAPIError` rate in Sentry for the first 60 min — threshold: < 0.1% of AI tool calls. If exceeded, roll back (see below).
11. Leave monitoring active for 24h. Daily review of error rate for 7 days post-flip.

---

## Rollback plan

If post-flip error rate > 0.5% of tool calls, or user-visible AI chat failures spike:

1. **Immediate:** redeploy the previous AI Service image tag (`git revert` + redeploy, or rollback via Fly.io `fly deploy --image <prev-tag>`).
2. **Triage:** open the top 3 Sentry events by count — identify which Core API endpoint is 404/500-ing.
3. **Fix forward vs. revert decision:**
   - If Core API bug → open Core API PR, don't re-flip until merged.
   - If AI Service bug (e.g., URL typo introduced in flip PR) → patch and re-deploy within hours.
4. Document incident in `merge-log.md` with root cause and timeline.

Rollback is safe — reverting the AI Service image restores soft-swallow behavior. No schema/state changes in this flip.

---

## Post-flip verification (day 7)

- [ ] Zero `CoreAPIError` events in prod Sentry over 7-day window (or all events have been investigated and closed).
- [ ] AI chat success rate unchanged vs. baseline (check PostHog funnel: «send chat message → received response»).
- [ ] No increase in user-reported errors in support channels.
- [ ] Update `merge-log.md` with flip completion note.
- [ ] Remove this runbook from active list — move to archive or mark DONE in header.

---

## Follow-ups

- **TD (propose at flip time):** structured `tool_error` schema — should include user-actionable guidance (retry / contact support / upgrade tier) rather than generic string. Requires product input.
- **TD:** retry policy for `CoreAPIUnavailable` (5xx) — exponential backoff with max 2 retries, only on idempotent tools (`get_*`). Don't retry `post_*` tools (not relevant on AI side currently, but plan ahead).
- **TD:** Correlate AI Service request-id with Core API request-id in Sentry breadcrumbs (single trace across both services). Currently they're separate spans.

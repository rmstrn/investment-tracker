# Bruno collection — Investment Tracker

Manual / exploratory tests for the API. `.bru` files are plain text, so
diffs and reviews work like any other source file.

## Prerequisites

- [Bruno](https://www.usebruno.com/) installed locally (CLI or app)
- A Clerk session JWT (web: DevTools → Application → `__clerk_session`)

## Run

```bash
# GUI
bruno

# CLI — run every request in a folder
bru run Accounts --env local
```

## Layout

- `collection.bru` — collection-level auth + docs
- `environments/*.bru` — per-environment vars (`baseUrl`, `clerkJwt`)
- `System / Users / Accounts / Transactions / Portfolio / Positions /
  Market / AI / Billing` — one folder per domain

## Happy path

1. `System / Health` → expect 200
2. `Users / Get Me` → confirm auth works
3. `Accounts / Create Account (manual)` → captures `{{accountId}}`
4. `Transactions / Create Transaction` → captures `{{transactionId}}`
5. `Portfolio / Get Portfolio` → confirms aggregate view
6. `AI / Create Conversation` → captures `{{conversationId}}`
7. `AI / Chat (non-streaming)` → smoke test of the AI proxy

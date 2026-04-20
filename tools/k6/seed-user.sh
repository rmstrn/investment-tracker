#!/usr/bin/env bash
# One-time helper: create (or refresh) the smoke-test user in Clerk and
# print a session JWT suitable for TEST_USER_TOKEN. Run this from a
# trusted shell — it uses CLERK_SECRET_KEY to call the Backend API.
#
# Usage:
#   CLERK_SECRET_KEY=sk_live_... SMOKE_USER_EMAIL=smoke+staging@example.com \
#     bash tools/k6/seed-user.sh
#
# Output (stdout): the JWT, and nothing else, so callers can pipe it
# into `gh secret set STAGING_TEST_USER_TOKEN` or an env file.
#
# What this does NOT do:
#   - seed Core API DB rows. Clerk's user.created webhook populates the
#     users table; the smoke suite assumes that fires within seconds.
#   - provision broker accounts or positions. The smoke suite exercises
#     empty-state reads; the idempotency scenario creates one manual
#     account per iteration (see idempotency.js).
#
# See docs/RUNBOOK_deploy.md § Prerequisites for the end-to-end setup.

set -euo pipefail

: "${CLERK_SECRET_KEY:?must export CLERK_SECRET_KEY (sk_test_* for staging, sk_live_* for prod)}"
: "${SMOKE_USER_EMAIL:?must export SMOKE_USER_EMAIL (e.g. smoke+staging@example.com)}"

API="${CLERK_API_URL:-https://api.clerk.com/v1}"

auth_header=(-H "Authorization: Bearer ${CLERK_SECRET_KEY}")
ct_header=(-H "Content-Type: application/json")

# Look up or create the user.
existing="$(curl -sS "${auth_header[@]}" \
  "${API}/users?email_address=${SMOKE_USER_EMAIL}" \
  | python -c "import json,sys; data=json.load(sys.stdin); print(data[0]['id'] if data else '')")"

if [ -n "$existing" ]; then
  user_id="$existing"
  echo "seed-user: reusing Clerk user $user_id for $SMOKE_USER_EMAIL" >&2
else
  create_payload="$(python -c "import json; print(json.dumps({'email_address': ['${SMOKE_USER_EMAIL}'], 'skip_password_checks': True}))")"
  user_id="$(curl -sS -X POST "${auth_header[@]}" "${ct_header[@]}" \
    -d "$create_payload" "${API}/users" \
    | python -c "import json,sys; print(json.load(sys.stdin)['id'])")"
  echo "seed-user: created Clerk user $user_id" >&2
fi

# Mint a session and exchange it for a short-lived token.
session_id="$(curl -sS -X POST "${auth_header[@]}" "${ct_header[@]}" \
  -d "$(python -c "import json; print(json.dumps({'user_id': '${user_id}'}))")" \
  "${API}/sessions" \
  | python -c "import json,sys; print(json.load(sys.stdin)['id'])")"

jwt="$(curl -sS -X POST "${auth_header[@]}" "${ct_header[@]}" \
  "${API}/sessions/${session_id}/tokens" \
  | python -c "import json,sys; print(json.load(sys.stdin)['jwt'])")"

echo "$jwt"

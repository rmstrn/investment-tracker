"""Python half of the cross-service HTTP header name registry.

Mirrors the Go half at ``apps/api/internal/httpheader/httpheader.go``.
Only the cross-service subset lives here — informational headers
that Core API sets for the web client (X-Partial-Portfolio,
X-RateLimit-*, …) are Go-only and not duplicated.

Sprint C cluster 3a — renaming a cross-service header is a two-file
change (this file + httpheader.go on the Go side). The CI check at
``tools/scripts/check-header-symmetry.py`` fails the build if the
two drift.

Naming: Python constants use UPPER_SNAKE_CASE per PEP 8 (ruff N814
rejects CamelCase imported as constant). The symmetry-check script
maps between Go CamelCase and Python UPPER_SNAKE_CASE via an
explicit pair list; renames on either side still need the matching
edit on the other.
"""

#: Carries the authenticated user UUID on internal-token requests
#: (AI Service → Core API reverse channel; Core API → AI Service
#: tool-use context). FastAPI / Starlette normalize lookups
#: case-insensitively; the spelling is fixed for wire + log
#: consistency. Matches ``httpheader.UserID`` in Go.
USER_ID = "X-User-Id"

#: Per-request trace id emitted by Core API's middleware.RequestID
#: and propagated through every downstream call. "X-Request-ID"
#: (all-caps ID) is the canonical spelling — picked because Go
#: already used it and "-ID" matches IANA-style RFC drafts.
#: Matches ``httpheader.RequestID`` in Go.
REQUEST_ID = "X-Request-ID"

#: Standard IETF bearer header. Re-exported here so service code
#: pulls every header name from one import instead of mixing
#: literal "Authorization" with the Starlette / FastAPI canonical.
#: Matches ``httpheader.Authorization`` in Go.
AUTHORIZATION = "Authorization"

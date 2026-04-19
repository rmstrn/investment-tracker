# internal/auth

Clerk JWT verification middleware. TASK_04 implementation:

- Verifies Clerk session JWT using JWKS (cached)
- Extracts `user_id` and attaches to request context
- Enforces per-user RBAC in the handler layer

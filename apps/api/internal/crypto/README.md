# internal/crypto

Envelope encryption helpers for broker credentials.

- **KEK**: in prod — AWS KMS; in dev — `CREDENTIALS_KEK_BASE64` from env
- **DEK**: AES-256-GCM per-account, stored encrypted in `accounts.credentials_encrypted`
- Plaintext **never** logged or persisted

See [02_ARCHITECTURE.md § Encryption at rest](../../../../docs/02_ARCHITECTURE.md).

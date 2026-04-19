# @investment-tracker/api-client

Typed fetch client for the Investment Tracker API, built on
[`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/) and the generated
types in `@investment-tracker/shared-types`.

## Usage

```ts
import { createApiClient } from "@investment-tracker/api-client";

const api = createApiClient({
  baseUrl: "https://api.investmenttracker.example/v1",
  getAuthToken: () => clerk.session?.getToken(),
  idempotencyKeyFactory: () => crypto.randomUUID(),
});

const { data, error } = await api.GET("/accounts", { params: { query: { limit: 25 } } });
```

## Regenerate

The client itself does not need regeneration; it only wraps `openapi-fetch`
against `@investment-tracker/shared-types`. Regenerate types after editing the
OpenAPI spec:

```bash
bash tools/openapi/generate-ts.sh
```

# @investment-tracker/web

Next.js 15 + React 19 + Tailwind v4 frontend for investment-tracker.

This is a scaffold — real UI lands in **TASK_07**.

## Run

```bash
pnpm --filter @investment-tracker/web dev
# → http://localhost:3000
```

## Build

```bash
pnpm --filter @investment-tracker/web build
pnpm --filter @investment-tracker/web start
```

## Layout

```
src/
├── app/              App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── lib/
    ├── sentry.ts     Sentry init stub
    └── posthog.ts    PostHog init stub
```

## Env

See [`.env.example`](./.env.example). Copy to `.env.local`.

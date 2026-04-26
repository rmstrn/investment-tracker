# Expenses Log — Provedo

Tracks every dollar spent on the project. Updated by PO (purchases) and finance-advisor (categorization, totals, monthly roll-up).

**Convention:**
- Add new expense as a row in the active table below
- Do NOT delete closed rows — move to historical archive once per quarter
- Amounts in original currency; USD equivalent in parentheses when relevant
- Receipts/invoices: store in `docs/finance/receipts/` (gitignored if sensitive) or link to external storage

---

## Summary (auto-update when new entry added)

| Metric | Value |
|---|---|
| **Total spent to date** | **$420 USD** |
| **Entries** | 3 |
| **First expense** | 2026-04-23 |
| **Categories touched** | Domain |

---

## Active expenses log

| # | Date | Category | Description | Amount | Currency | USD equiv | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-04-23 | Domain | Domain purchase (rejected predecessor — sunk cost) | 250 | USD | $250 | Paid | Brand rejected 2026-04-25; domain release/sell decision deferred. |
| 2 | 2026-04-25 | Domain | Provedo.ai (primary brand domain, 2yr min) | ~140 | USD | ~$140 | Paid | Per Spaceship/Porkbun pricing. PO authorized after R32 multi-agent Rule 3 validation. |
| 3 | 2026-04-25 | Domain | Provedo.app (protective TLD) | ~30 | USD | ~$30 | Paid | Squatter-prevention. |

---

## Categories (for consistency as log grows)

- **Domain** — registrar fees, renewals, premium domain purchases
- **Hosting** — Fly.io, Railway, Vercel, etc.
- **Database** — Neon, Supabase, Upstash Redis
- **Auth / Identity** — Clerk, Auth0
- **Secrets / Config** — Doppler
- **Payments** — Stripe fees, payout fees
- **AI / API** — Anthropic, OpenAI, model usage costs
- **Third-party APIs** — Plaid, SnapTrade, Polygon, market data
- **Monitoring / Observability** — Sentry, Datadog, BetterStack
- **Email / Communication** — Resend, Postmark, SendGrid
- **Design / Assets** — fonts, icons, stock imagery, Figma
- **Legal** — trademark clearance, counsel, registration fees, entity formation
- **Marketing / Ads** — ad spend, PR, sponsorships
- **Tools / SaaS** — Linear, Notion, GitHub, development tools
- **Research** — user research platforms, surveys, interview platforms
- **Misc** — anything not above

---

## Monthly roll-up (add when month closes)

### 2026-04
- Domain: $420 ($250 rejected predecessor sunk + $170 Provedo.ai+.app)
- **Total April: $420**

---

## Conventions + owner

- **Owner:** finance-advisor maintains structure + monthly roll-up. PO adds raw entries whenever a purchase happens.
- **When to add:** any time real money leaves an account connected to the project.
- **Currency:** record in actual currency charged + USD equivalent for roll-up.
- **Privacy:** this file goes to main (no sensitive data — just amounts + categories). Receipts with PII or card numbers stored separately (gitignored).
- **Accuracy:** if uncertain about exact amount, estimate + mark `~` prefix; update when final invoice lands.

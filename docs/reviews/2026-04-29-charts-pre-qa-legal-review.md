# Charts subsystem — pre-QA Lane-A legal review — 2026-04-29

**Author:** legal-advisor (internal SME)
**Scope:** chart subsystem on `chore/plugin-architecture-2026-04-29` (10 MVP chart components, schema, showcase consumer, error/empty surfaces, fixtures).
**Reference audits:** `docs/reviews/2026-04-29-finance-charts-lane-a-audit.md` (finance, 42 findings); `docs/design/CHARTS_SPEC.md` v1.1 §5.2 + §3.
**Reference rules:** Provedo Lane-A lock per `DECISIONS.md` 2026-04-23 — information / education only, never personalized advice.
**Verdict:** **APPROVE-WITH-NITS.**
**Hard rules respected:** R1 (no spend), R2 (no PO-name external comms), R4 (no predecessor name).

---

## Caveat

This is internal product-validation review, **NOT** a substitute for licensed counsel review against SEC Investment Advisers Act 1940 §202(a)(11), MiFID II Article 4(1)(4), FCA COBS 9 / FSMA 2000, or 39-ФЗ pre-launch. Lane-A boundary across these jurisdictions is structurally similar (information vs. personalized recommendation) but per-market enforcement, registered-investment-adviser exemptions, and «publisher exclusion» tests differ. Production launch in any of US / EU / UK markets requires jurisdiction-specific licensed counsel sign-off. Russia is explicitly out of scope (PO directive 2026-04-23 lock).

---

## 1. Lane-A boundary status (executive summary)

The chart subsystem **holds the Lane-A line at the structural (Zod schema) layer**. The forbidden-overlay defense is excellent: `LineOverlay` is a `discriminatedUnion('type', [TradeMarker])` — there is *literally no other branch* — backed by a belt-and-suspenders `.refine()` rejecting any of 23 forbidden TA-indicator / signal / target-price tokens. Future contributors who try to add `support_line` or `buy_marker` as a discriminant will fail two gates (union exhaustiveness + refinement). Calendar V2 event types (`earnings`, `news`) are similarly unreachable: `CalendarEventType = z.enum(['dividend','corp_action'])` discriminator-mismatches at parse time. Scatter is excluded from the MVP `ChartPayload` discriminated union (architect Δ3) — payload `{kind:'scatter',...}` fails parse before reaching the renderer; the `lazy.ts` re-export does NOT include scatter. Bar `referenceLine.axis` is `z.literal('zero')` — `targetWeight` field cannot exist anywhere.

The mandatory captions on Treemap and drift-Bar are baked in renderer code (not driven by AI payload), keeping Lane-A wording stable across re-renders. Caption phrasing in both is descriptive («describes proportions», «describes drift; it does not mark drift as good/bad or recommend rebalancing»). Waterfall caption explicitly disclaims forward projection («Does not predict future contributions»). Showcase copy is descriptive throughout.

**No CRITICAL findings.** **No HIGH findings.** Three MEDIUM and four LOW. None block merge.

---

## 2. Findings by severity

### CRITICAL — none

### HIGH — none

### MEDIUM

**M-1. No global «information only, not advice» disclaimer surfaces anywhere on the showcase route.** The chart-level captions (Treemap FINRA, Waterfall conservation, Bar drift) carry the load for individual charts where Lane-A drift risk is highest. But the showcase section header at `apps/web/src/app/design/_sections/charts.tsx:64-74` describes tier semantics and theme mechanism only — there is no top-of-section banner stating that the demonstrated charts are informational visualizations, not investment advice. For an internal `/design` route this is acceptable; **before any chart component renders inside a user-facing product surface (dashboard, chat reply, report)**, a Provedo-wide «descriptive only — not investment advice» disclaimer must be present at section or page level. Recommend tracking as a TD item with explicit ownership: «before any chart component is consumed outside `/design`, surface owner adds page-level Lane-A disclaimer». Reference: SEC Advisers Act §202(a)(11) publisher-exclusion three-prong test (impersonal, non-discretionary, general) — disclaimers are part of the «general» prong.

**M-2. `ChartError` `?debug=1` payload reveal can leak PII when the failing payload contains real broker data.** `packages/ui/src/charts/_shared/ChartError.tsx:42-50` renders raw payload JSON in a `<pre>` block when `URLSearchParams.get('debug') === '1'`. The current showcase passes `LINE_FIXTURE` (synthetic) which is fine. In production the failing payload may contain real ticker holdings, broker source, account-tier identifiers. Two concerns: (a) `?debug=1` is a flimsy gate — anyone copying a URL with the param appended sees the raw payload; (b) screenshot exfiltration (user pastes screenshot to support, payload visible). For an internal `/design` route this is fine. **Production guardrails recommended:** (i) gate `?debug=1` reveal behind a server-side cookie or auth check (e.g. `staff_only` JWT claim) rather than URL param; (ii) redact known-sensitive fields (`brokerSource`, account identifiers, full position values) before stringifying — leave structure visible, mask values; (iii) document this gate in the future Privacy Policy under «debugging tooling». Reference: GDPR Article 5(1)(c) data minimisation + Article 32 confidentiality of processing. Mitigation: file-level comment at `ChartError.tsx:8-10` already flags PO/QA scope — formalize before any non-staff route mounts this component.

**M-3. `meta.alt` / `aria-label` is auto-generated from `meta.title` (or `meta.alt` fallback) — no renderer-side vocabulary check on AI-emitted prose.** Per finance audit §4 rule 4, the renderer needs a regex check against the `AI_CONTENT_VALIDATION_TEMPLATES.md` §3 verb blacklist on `meta.title` / `meta.subtitle` / `meta.alt` / scatter `referenceLines.label`. This is **the SOLE gate** on AI-prose Lane-A drift (architect Δ4 — Pydantic and Zod both guard structure, neither guards prose). Currently absent. The fixture-level copy (`fixtures.ts`) is human-authored and clean. The risk is at runtime when the AI agent fills `meta.title` with «BUY signal: NVDA breakout» or similar. Recommendation: add a `validateChartProseVocabulary(payload)` step at the api-client trust boundary (same layer as Zod parse), backed by the verb blacklist. On match: surface `ChartError` with «Chart unavailable» and log to monitoring. **Not blocking for this slice** because the slice is renderer-only and the regex layer belongs in the api-client where the payload arrives. Track as kickoff acceptance criterion for the next slice (api-client ↔ AI engineer integration).

### LOW

**L-1. Treemap caption renderer-baked phrasing is good but cites FINRA without scope-of-jurisdiction caveat.** `Treemap.tsx:83-84` reads «concentration thresholds are factual conventions per FINRA, not Provedo recommendations». FINRA is a US self-regulatory organization; for EU / UK users, ESMA / FCA conventions are more authoritative. Acceptable as-is for MVP-on-US-soft-launch posture, but if Provedo markets to EU first (per ICP weight DE), the caption should either (a) cite a multi-jurisdiction source («industry convention per FINRA / ESMA investor education») or (b) be templated by user locale. Track as i18n-ready copy item.

**L-2. Waterfall caption is descriptive and disclaims forward projection — strong. Minor: «mechanical components» may read jargon-y for a retail user.** `Waterfall.tsx:110-111`. Recommend simpler framing in a copy pass («the pieces that explain the change»). Lane-A is fine; this is a UX copy nit, not a regulatory one.

**L-3. Bar drift caption uses second-person plural «Provedo describes drift» which is good, but the trigger heuristic is `meta.subtitle.toLowerCase().includes('drift')` — a substring match.** `BarChart.tsx:50`. If a future AI agent emits `meta.subtitle: "Quarterly drift in interest-rate sensitivity"` for a non-allocation bar chart, the FINRA-flavored drift caption renders inappropriately. Low risk because the caption text is generic enough to read sensibly in adjacent semantics, but cleaner: gate on a payload-level discriminator (e.g., `subtype: 'drift'`) rather than substring. Track as schema enhancement; not blocking.

**L-4. Calendar `corp_action` description field is free-form AI-emitted prose.** `charts.ts:525` — `description: z.string()`. Showcase fixture is clean («2-for-1 stock split effective at market open 2026-04-15»). At runtime, AI-emitted descriptions could drift («favorable for shareholders», «expected to boost EPS», etc.). Same root cause as M-3 (no prose vocabulary check). When the M-3 regex layer lands, ensure `CalendarEvent.description` is in the field list it scans.

---

## 3. Spot checks (compliance with dispatch checklist)

| # | Item | Status |
|---|------|--------|
| 1 | All 23 forbidden TA-indicator names structurally rejected | PASS — `FORBIDDEN_OVERLAY_TYPES` at `charts.ts:173-197` covers 23 tokens; all 17 names called out in dispatch are present (plus 6 extras: `channel_band`, `atr`, `stochastic`, `adx`, `ichimoku`, `target_price`). Rejection is **structural** (`discriminatedUnion` with single `TradeMarker` branch) AND documented (`.refine()` belt-and-suspenders). |
| 2 | Calendar V2 event-type gate (`earnings`/`news` rejected) | PASS — `CalendarEventType = z.enum(['dividend','corp_action'])` at `charts.ts:488`. Discriminator-mismatch at parse. Renderer cannot fallback because it switches on `eventType` literal. |
| 3 | Candlestick lazy-no-demo | PASS — `LazyCandlestick` exists in `lazy.ts:26-28` but no demo block in `apps/web/src/app/design/_sections/charts.tsx` (verified by grep — no `Candlestick` or `CANDLESTICK_FIXTURE` import). Showcase comment at `:8-10` explicitly states the omission and references «PO greenlight + legal-advisor sign-off». |
| 4 | Scatter V2-deferred (not in MVP `ChartPayload` union, no demo) | PASS — `ScatterChartPayload` defined at `charts.ts:426-458` for V2 import-readiness but absent from MVP union at `:665-676`. `lazy.ts:13` confirms «Scatter is V2-deferred and NOT exported». No scatter component file. **Future re-introduction explicitly gates on legal-advisor sign-off (this is my future call).** |
| 5 | Mandatory disclaimers / captions descriptive, not advice | PASS — Treemap FINRA caption, Waterfall conservation caption, Bar drift caption all renderer-baked and descriptive. No «you should», «we recommend», «consider rebalancing» language anywhere. Verified by grep across `packages/ui/src/charts/`. |
| 6 | Showcase copy free of «what to do next» framing | PASS — section headers («Charts», «State demonstrations»), tier badges (T1/T2/T3), card titles all describe what the chart **is**, not what to do. No imperative or advisory language. ChartError default body «We could not display this chart. Try again or refresh the page.» is operational, not advisory. |
| 7 | `?debug=1` payload reveal | MEDIUM — see M-2. Acceptable for `/design`; tighten before any production surface. |
| 8 | `alt` / `aria-label` auto-generation prose | MEDIUM — see M-3. No regex gate on AI-emitted `meta.title` / `meta.subtitle` / `meta.alt`. Belongs in api-client trust boundary, not this slice. |

---

## 4. Disclaimer / copy recommendations

1. **Before chart components mount on any user-facing surface (chat reply, dashboard, report):** add page or section-level disclaimer. Recommended phrasing (DRAFT — `[ATTORNEY REVIEW]` before production):

   > Charts and figures shown by Provedo describe your historical broker data. They are factual and educational, not personalized investment advice. Provedo is not a registered investment adviser; consult a licensed professional before making investment decisions.

   Place this once per page (not once per chart) to avoid disclaimer fatigue. SEC publisher-exclusion case law treats prominent, consistent disclaimers as part of the «general» (not personalized) prong.

2. **Production `?debug=1` hardening:** gate behind staff-auth claim, not URL param. Redact `brokerSource` and absolute position values; preserve structure for triage.

3. **AI-prose vocabulary regex layer at api-client trust boundary** (M-3) — track as next-slice acceptance criterion. Backed by `AI_CONTENT_VALIDATION_TEMPLATES.md` §3 verb blacklist (existing artifact).

4. **i18n-readiness for Treemap FINRA citation** (L-1) — track for EU launch.

---

## 5. Recommendation

**APPROVE-WITH-NITS** for merge of `chore/plugin-architecture-2026-04-29` charts subsystem into `main`.

- 0 CRITICAL, 0 HIGH, 3 MEDIUM, 4 LOW.
- No structural Lane-A breaches.
- Schema-layer defenses are exemplary (discriminated union exhaustiveness, `.strict()` mode, `.refine()` belt-and-suspenders, payload-level discriminators for forbidden categories).
- Renderer-baked captions hold the line on AI-prose drift for the three highest-risk chart types (Treemap, Waterfall, drift-Bar).

**Tracked items** (not blocking this merge):

- M-1 — page-level «not investment advice» disclaimer before production consumption.
- M-2 — `?debug=1` hardening before production.
- M-3 — AI-prose vocabulary regex at api-client trust boundary (next slice).
- L-1 — Treemap FINRA caption i18n for EU launch.
- L-3 — Bar drift caption gating on payload-level `subtype` rather than substring.

**Mandatory escalations to licensed counsel before production launch** (not now):

- US: SEC-registered compliance counsel for publisher-exclusion three-prong fit + chart disclaimer wording sign-off.
- EU: per-member-state legal review (DE first per ICP weight) for MiFID II «information vs. advice» line on Treemap color-encoding (intra-day staleness mitigation per finance audit T-1) and Waterfall component decomposition.
- UK: FCA perimeter guidance review (COBS 9 «advising on investments» scope) — generic-advice exclusion fit.

---

## 6. Verification checklist (self-audit)

1. PASS — All 8 dispatch checklist items spot-checked with file:line cites.
2. PASS — Findings have severity tags, file references, concrete remediation.
3. PASS — Disclaimer/copy recommendations are draft text, marked `[ATTORNEY REVIEW]` for production.
4. PASS — Hard rules honored (R1 / R2 / R4 / no velocity metrics).
5. PASS — Caveat header documents licensed-counsel-not-substitute scope.
6. PASS — Read-only review; no source files modified.
7. PASS — Lane-A boundary status one-paragraph at top.

---

**End of review. Verdict: APPROVE-WITH-NITS. 0 CRITICAL · 0 HIGH · 3 MEDIUM · 4 LOW.**

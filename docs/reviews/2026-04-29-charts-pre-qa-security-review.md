# Charts subsystem — pre-QA security review (Lane-A trust boundary)

**Reviewer:** security-auditor
**Date:** 2026-04-29
**Branch:** `chore/plugin-architecture-2026-04-29`
**Scope:** `packages/shared-types/src/charts.ts` · `packages/api-client/src/index.ts` · `packages/ui/src/charts/*.tsx` · `packages/ui/src/charts/_shared/ChartError.tsx` · `apps/web/src/app/design/_sections/charts.tsx`
**Source-of-truth references:** `docs/reviews/2026-04-29-finance-charts-lane-a-audit.md`, `docs/design/CHARTS_SPEC.md` §5.2 (Risk Flags 1/2/3)

---

## 1. Verdict

**APPROVE-WITH-NITS** — proceed to QA. The Lane-A trust boundary is intact and structurally enforced. No CRITICAL findings, no HIGH findings; 4 MEDIUM and 2 LOW defense-in-depth opportunities.

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| HIGH     | 0 |
| MEDIUM   | 4 |
| LOW      | 2 |

---

## 2. Trust-boundary diagram + verdict

```
[ AI agent / wire ]  --(unknown)-->  parseChartEnvelope()  --(ChartEnvelope)-->  Renderer (LineChart, BarChart, …)
                                       │                                          │
                                       ▼                                          ▼
                              ChartEnvelope.safeParse                   Pure read of typed payload
                              (Zod canonical: shape + math               No re-validation
                               + Lane-A guardrails)                      No JSON.parse, no fetch,
                                                                         no localStorage, no innerHTML
```

**Trust-boundary status:** SINGLE-PARSER INVARIANT HOLDS. Production-code `ChartEnvelope.safeParse` invocation count = **1**, located at `packages/api-client/src/index.ts:132` (`parseChartEnvelope`). Every other `safeParse` call lives in `packages/shared-types/src/charts.test.ts` (test code; out of scope for the runtime boundary). Renderer components (`LineChart.tsx`, `AreaChart.tsx`, `BarChart.tsx`, `StackedBar.tsx`, `DonutChart.tsx`, `Sparkline.tsx`, `Calendar.tsx`, `Treemap.tsx`, `Waterfall.tsx`, `Candlestick.tsx`) consume already-parsed payloads via `import type` only — no schema-level imports for runtime use, no re-validation, no fallback parsing. The `ChartError` debug gate is the only payload-display surface and is guarded by an explicit `?debug=1` URL param.

---

## 3. Findings — by severity

### CRITICAL — none.

### HIGH — none.

### MEDIUM

#### M1. `as unknown as` workaround for `MultiSeriesPoint` weakens type signal at one app callsite

- **Location:** `apps/web/src/app/components/positions/position-price-chart.tsx:87` (also pattern in `packages/ui/src/charts/_shared/fixtures.ts:34` `asMultiSeries` helper).
- **Finding:** The Zod `MultiSeriesPoint` schema uses `.catchall(z.number())`, which narrows the inferred TS type to `{ x: string|number; [k: string]: number }`. Authors work around this by casting payload `data` arrays via `as unknown as AreaChartPayload['data']`. The cast itself is documented and the runtime shape is correct, but it **bypasses the compile-time guarantee** that the payload object will round-trip through `parseChartEnvelope` cleanly. A future contributor copying the pattern could inadvertently smuggle non-numeric fields past the type checker. (The Zod parse would still catch it at runtime — at the trust boundary — so this is defense-in-depth, not a breach.)
- **Recommendation:** Replace `as unknown as` with a named typed-builder helper that constructs `MultiSeriesPoint` rows row-by-row, OR add an explicit `// SAFETY:` comment block to `position-price-chart.tsx:83-87` noting the constraint that all non-`x` fields MUST be `number`. The fixtures-side `asMultiSeries` already has this commentary; bring the app-side callsite up to the same standard.
- **Impact:** Low — runtime parser still enforces the contract. Type-system signal only.

#### M2. `position-price-chart.tsx` constructs an `AreaChartPayload` directly without round-tripping through `parseChartEnvelope`

- **Location:** `apps/web/src/components/positions/position-price-chart.tsx:72-91` (slightly outside the explicit review scope but discovered during boundary verification).
- **Finding:** This component builds an `AreaChartPayload` literal from server data (`data.points`) and passes it to `<AreaChart payload={chartPayload} />` without ever passing through `parseChartEnvelope`. The data does NOT originate from an AI agent (it's fetched from the price-history API), so the Lane-A regulatory boundary is not breached — but the code path is structurally **outside** the trust-boundary invariant. If a future contributor pipes AI-emitted data into this same construction site, it would render without Zod validation.
- **Recommendation:** Add an inline comment `// SAFETY: data sourced from typed price-history API, not AI emission. AI-emitted area payloads must flow through parseChartEnvelope.` to document the invariant. Optionally add a CI grep that flags any new `XxxChartPayload` literal construction outside `_shared/fixtures.ts` (which is dev-only).
- **Impact:** Low for current shipping behavior; medium as a foot-gun for future contributors.

#### M3. `ChartError` debug gate could be misconfigured by an `iframe` parent

- **Location:** `packages/ui/src/charts/_shared/ChartError.tsx:65-73`.
- **Finding:** The `useDebugMode` hook reads `window.location.search` and looks for `debug=1`. If a Provedo page is ever embedded as an iframe in another product, a malicious parent that controls the iframe's `src` URL could turn on debug mode and reveal payloads via screenshot/automation. There is no allowlist of hostnames or staging-vs-prod gate. Today this is theoretical (Provedo is a top-level web app and the spec lists no embed surfaces), but it's a foot-gun.
- **Recommendation:** Either (a) gate `?debug=1` behind a hostname check (`window.location.hostname.endsWith('staging.provedo.app')`), or (b) document an `X-Frame-Options: DENY` / CSP `frame-ancestors 'none'` requirement in the production headers config and cite it in `ChartError.tsx` JSDoc. Web rules `web/security.md` already require these headers — this finding is about making the ChartError gate explicitly depend on them.
- **Impact:** Low if X-Frame-Options is already deployed; medium if it isn't.

#### M4. `payload.meta.title` / `meta.subtitle` / labels rendered as React children — fine, but document the XSS posture

- **Location:** Multiple — `LineChart.tsx:109`, `BarChart.tsx:46-47, 81`, `Treemap.tsx:108`, `Calendar.tsx:142`, etc.
- **Finding:** Renderers pass `payload.meta.title`, `meta.subtitle`, `series[].label`, `tile.ticker`, `event.description`, etc. as React children — React auto-escapes these, so this is XSS-safe by construction. However: there is also `aria-label={payload.meta.alt ?? payload.meta.title}` and `title={...}` props on SVG elements (`Calendar.tsx:98, 117`) — these get rendered as DOM attributes, which React also escapes safely. The corp-action `description` value is passed straight to `title=` on a `<span>`. AI-emitted strings reach the DOM as text content / attribute values, **never** as `dangerouslySetInnerHTML`, **never** through `JSON.parse` of agent output downstream of the parser. **Verified:** no `dangerouslySetInnerHTML`, no `innerHTML`, no `eval`, no `new Function` anywhere in `packages/ui/src/charts`.
- **Recommendation:** Add a one-paragraph note to `CHARTS_SPEC.md` §5.2 stating «AI-emitted text fields are rendered exclusively as React children or DOM attributes; React's default escaping is the XSS guarantee. No payload field is ever passed to `dangerouslySetInnerHTML`.» This pins the invariant for future contributors.
- **Impact:** Defense-in-depth only — current behavior is safe.

### LOW

#### L1. `FORBIDDEN_OVERLAY_TYPES` is `as const` but the `.refine()` checks via `(... as readonly string[]).includes(v.type)`

- **Location:** `packages/shared-types/src/charts.ts:173-197, 225`.
- **Finding:** The list is correctly declared `as const` (so TS narrows to a literal-string tuple), and the discriminated-union member list intentionally has only `trade_marker`. The `.refine()` is belt-and-suspenders — it casts to `readonly string[]` and checks `.includes`, which is correct behavior but slightly weakens the typed signal at the refinement site (TS no longer treats `v.type` as one of the forbidden literals).
- **Recommendation:** Acceptable as-is; the discriminated-union branch list is the primary gate, and the runtime `.includes` check is the secondary belt. No change required.
- **Impact:** None.

#### L2. `safeStringify` in `ChartError` swallows errors silently

- **Location:** `packages/ui/src/charts/_shared/ChartError.tsx:75-81`.
- **Finding:** `try { JSON.stringify(value, null, 2) } catch { return String(value) }`. The catch is silent — a circular-reference payload would render as `[object Object]` with no diagnostic. Not a security finding (no info leak, no crash), but it does mean QA can't distinguish «agent emitted a non-stringifiable structure» from «agent emitted an empty payload» when looking at the debug surface.
- **Recommendation:** Append a fixed marker on catch — e.g. `return '/* [non-serializable: see browser console] */ ' + String(value);` — and log the error to console. Doesn't change security posture; improves debug-mode utility.
- **Impact:** None on security; minor UX.

---

## 4. Per-review-point checklist (the 9 explicit items)

| # | Review point | Status | Evidence |
|---|---|---|---|
| 1 | `ChartEnvelope.safeParse` count = 1 in production | PASS | `api-client/src/index.ts:132`. All other matches live in `packages/shared-types/src/charts.test.ts` (test code, excluded from the trust-boundary count). |
| 2 | Risk Flag 1 — forbidden Line/Candlestick overlays | PASS | `LineOverlay` (`charts.ts:223-227`) is `discriminatedUnion('type', [TradeMarker])` with **only** `trade_marker`; belt-and-suspenders `.refine()` rejects forbidden literals. `FORBIDDEN_OVERLAY_TYPES` (`charts.ts:173-197`) has **23 entries** — matches the kickoff target. `CandlestickChartPayload` (`charts.ts:467-477`) is `.strict()` — extra keys (e.g. `rsi`, `ma`, `bollinger`) cause `ZodError`. |
| 3 | Risk Flag 2 — no `targetWeight`, zero-only reference axis | PASS | Greppable: zero matches for `targetWeight` anywhere in `packages/`. `BarReferenceLine.axis = z.literal('zero')` (`charts.ts:242`). `BarChartPayload` (`charts.ts:302-321`) and `StackedBarChartPayload` (`charts.ts:334-368`) are both `.strict()`. |
| 4 | Risk Flag 3 — Calendar event-type gate | PASS | `CalendarEventType = z.enum(['dividend', 'corp_action'])` (`charts.ts:488`). `'earnings'` and `'news'` rejected by discriminator-mismatch. `CalendarEvent` is `discriminatedUnion('eventType', [DividendEvent, CorpActionEvent])` (`charts.ts:532`). |
| 5 | Waterfall conservation invariant | PASS | `WATERFALL_CONSERVATION_VIOLATION` is a distinct error code (`charts.ts:627`) attached via `params.code` on a `z.ZodIssueCode.custom` issue (`charts.ts:765`). Tolerance `WATERFALL_CONSERVATION_TOLERANCE = 1.0` absolute (`charts.ts:620`). Anchor `start`/`end` excluded from sum, per Δ2. |
| 6 | `?debug=1` payload-reveal gate | PASS (with M3 nit) | `ChartError.tsx:65-73` reads `window.location.search` only; no `localStorage` / `sessionStorage` / `cookie` / `fetch` / `XMLHttpRequest` anywhere in `packages/ui/src/charts` (verified by grep). SSR-safe via `typeof window === 'undefined'` guard. Disabled `<button>` shown when debug is off, so the surface is keyboard-discoverable but not exploitable. M3 raises an iframe-embed concern as a foot-gun. |
| 7 | Untrusted-input handling at `parseChartEnvelope` | PASS | Signature accepts `unknown` (`api-client/src/index.ts:131`). Returns `{ ok: true, data } \| { ok: false, error, raw }` — never throws. No `JSON.parse` of agent output exists downstream of the parser in chart code; `JSON.parse` matches in `apps/web/src/lib/ai/ai.ts:165` operate on SSE event frames upstream of `parseChartEnvelope`, which is the correct pipeline. |
| 8 | Type-narrowing escape hatches | PASS (with M1/M2 nits) | Zero matches for `@ts-ignore` / `@ts-expect-error` across `packages/` and `apps/web/src/`. Zero `as ChartPayload` / `as ChartEnvelope` casts. Two `as unknown as` casts exist: `fixtures.ts:34` (dev-only `asMultiSeries` helper, documented) and `position-price-chart.tsx:87` (app-side workaround for `MultiSeriesPoint.catchall` type narrowing — runtime-safe but flagged as M1). Neither bypasses the trust boundary. |
| 9 | Showcase / debug-mode bypasses | PASS | `apps/web/src/app/design/_sections/charts.tsx` imports types and components, plus fixtures (`LINE_FIXTURE`, `CALENDAR_FIXTURE`, etc.). It does **not** call `parseChartEnvelope`, does **not** call `safeParse`, does **not** mutate validated payloads. Fixtures are declared as typed literals — no runtime parse — which is acceptable because they are dev-only fixtures, never AI-emitted. Showcase passes fixture payloads directly to renderers. |

---

## 5. Out-of-scope observations (defense-in-depth, not blockers)

- **D1.** `LineChart.tsx:91-99` runs `console.warn` only when `hostname === 'localhost' || '127.0.0.1'` — clean and avoids leaking diagnostic noise to staging/prod. Good.
- **D2.** `Treemap.tsx:51` and `Calendar.tsx:51-58` use `Date.parse` / `new Date(periodStart)` on AI-emitted strings. Returns NaN for malformed strings, which short-circuits to an empty grid (`buildMonthGrid` returns `[]`). Safe; no exception propagation, no XSS vector.
- **D3.** `Candlestick.tsx:71-76` computes Y-axis padding with `Math.min/max` on an unbounded array spread — `Math.min(...allValues)` could in theory blow the call stack at >~100k points, but the Zod schema caps `data` at 365 entries (`charts.ts:474`), so safe.
- **D4.** No third-party CDN scripts loaded by chart components. Recharts is bundled locally. Lucide icons (per memory note) are inlined SVG. Bundle SRI not relevant here.

---

## 6. Recommendation

**APPROVE-WITH-NITS** — proceed to QA / merge.

- No CRITICAL or HIGH findings.
- The Lane-A regulatory trust boundary is structurally enforced exactly as specified in CHARTS_SPEC §5.2: 23 forbidden overlay types, zero-only bar reference axis, V2-gated calendar event types, `.strict()` on every payload schema, single Zod parse-call at the api-client trust boundary.
- The 4 MEDIUM and 2 LOW findings are defense-in-depth opportunities. None block the merge. M1/M2 should be addressed in a small follow-up PR before any AI-emission feature flows through `position-price-chart.tsx` or any other app-side payload-construction site. M3 should be paired with a CSP `frame-ancestors 'none'` deployment header check before alpha cutover.

---

## 7. Out-of-band note for tech-lead

- The single-parser invariant is currently enforced by social contract + this review. The api-client comment (`index.ts:118`) mentions a CI grep — confirm whether that grep is wired in the build pipeline. If not, file as a follow-up: a CI step that fails the build on any new `ChartEnvelope.safeParse(` or `ChartPayload.safeParse(` call outside `packages/api-client/src/index.ts` and `*.test.ts` files. Without this guard, the trust-boundary invariant decays silently as the codebase grows.

# Finance audit — chart types Lane A + correctness — 2026-04-29

**Author:** finance-advisor
**Scope:** 11 chart types in `docs/design/CHARTS_SPEC.md` v1.1 (lines 1–2808)
**Status:** PROPOSED → AWAITING right-hand integration into tech-lead's FE kickoff acceptance criteria
**Inputs reviewed:** CHARTS_SPEC.md v1.1; chart-component-catalog.md v1.1 (my prior work); DECISIONS.md Lane-A lock 2026-04-23 + Q6 in-context AI disclaimer; AI_CONTENT_VALIDATION_TEMPLATES.md §1–§4; BENCHMARKS_SOURCED.md §3 + §4 formulas reference.
**Branch:** `docs/finance-charts-lane-a-audit-2026-04-29`
**Out of scope:** code changes (FE engineer dispatch); backend payload-generation prompts (AI engineer dispatch); architect's data-shape ADR (parallel; flagged in §«Cross-team flags»).

---

## 1. Verdict by chart type

| # | Chart type | Lane A | Correctness | Net status |
|---|---|---|---|---|
| 1 | Line | PASS (with §4.1.1 structural exclusions intact) | WARN (interpolation + benchmark semantics) | WARN |
| 2 | Area | PASS | WARN (stacked-area baseline + step interpolation guidance gap) | WARN |
| 3 | Bar | PASS (target-weight schema-forbidden) | PASS | PASS |
| 4 | Donut | PASS | WARN (segments capped at 7; no «sum-to-100» invariant) | WARN |
| 5 | Sparkline | PASS | PASS | PASS |
| 6 | Calendar | PASS (eventType restricted to dividend + corp_action) | WARN (announced/scheduled status semantics + dividend-on-ex-date confusion + shares×DPS unit ambiguity) | WARN |
| 7 | Treemap | WARN (intra-day price-change encoding nudges toward action read; mitigations exist but caption + asOf staleness must be enforced) | WARN (negative-weight invariant; sector field unused in v1; «OTHER» tile units) | WARN |
| 8 | Stacked bar | PASS | WARN (no missing-data semantics; sum-to-total invariant unenforced) | WARN |
| 9 | Scatter | WARN (efficient-frontier connotation; quadrant labels; no «risk» framing without source) | WARN (volatility computation period + Z bubble channel + reference line semantics) | WARN |
| 10 | Cash-flow waterfall | PASS (descriptive only; no projection) | RED (start + Σ deltas ≠ end is a real risk; FX/fee sign-conventions ambiguous; «realized vs unrealized» double-count risk vs deposits) | RED |
| 11 | Candlestick | PASS (T3, structural exclusions baked) | WARN (Recharts candle implementation sketch is incomplete; OHLC ordering invariant unenforced) | WARN |

**Aggregate:**
- Lane A: 9 PASS / 2 WARN / 0 RED.
- Correctness: 2 PASS / 8 WARN / 1 RED.
- Net (worse of two axes): 2 PASS / 8 WARN / 1 RED.

**Top-3 critical items (must address before ship):**
1. **Waterfall start + Σ deltas ≠ endValue is a numeric-integrity bug surface.** A user viewing «$220k → +$10k deposits → … → $246,890» where the math doesn't add up loses trust permanently. Schema must enforce `startValue + Σ(non-anchor deltas) === endValue` with a tolerance window for FX rounding. (See Finding W-1.)
2. **Treemap intra-day color encoding without a hard-enforced asOf staleness flag is the highest Lane-A drift risk in the v1.1 additions.** A green tile that's actually 4 hours old reads as «buy now» momentum signal. Caption alone is insufficient; renderer must display staleness inline above the chart when `asOf` > 30 minutes during US market hours OR > end-of-day for non-market-hours payloads. (See Finding T-1.)
3. **Scatter (H5) Lane-A WARN must NOT be promoted to T1/T2 without legal-advisor sign-off.** Spec correctly marks T2 next-wave but the schema is published in v1.1; if AI agent emits a `scatter` payload during MVP, renderer accepts it. Schema must either (a) not include scatter in MVP discriminated union, or (b) renderer must render-block-with-error for `kind: scatter` payloads until V2 PO greenlight. (See Finding S-1.)

---

## 2. Detailed findings

### 2.1 Line chart (§4.1, §4.1.1)

**Lane A status:** PASS.

The §4.1.1 explicit cross-link to candlestick exclusions, and the `LineOverlay.refine()` whitelist that permits only `trade_marker`, are well-constructed. The Zod `.strict()` plus `FORBIDDEN_OVERLAY_TYPES` belt-and-suspenders is the right pattern.

**Correctness status:** WARN.

**Findings:**
- **[MEDIUM] L-1 — `interpolation: monotone` default is wrong for some semantic uses.** `CHARTS_SPEC.md:407–408` defaults all line charts to `type="monotone"` (cubic spline). This is fine for portfolio-value-over-time (catalog A1, A4, A9), but for cumulative cash-flow events with discrete deposits (catalog A8 cash-on-cash, also a Line semantic) and benchmark-comparison normalized-to-100 lines, `step` or `linear` is more honest. Smoothing a step function visually fabricates intermediate values that didn't exist. Remediation: AI agent prompt must select `interpolation` per-semantic; renderer should NOT silently coerce. The schema already permits `linear` / `monotone` / `step` (`CHARTS_SPEC.md:1314`) — make the AI prompt template explicit per use-case in `AI_CONTENT_VALIDATION_TEMPLATES.md` §5.1.
- **[MEDIUM] L-2 — `benchmark` field allows arbitrary `y` value without sourcing or attribution.** `LineChartPayload.benchmark: z.object({ y: z.number(), label: z.string() })` (`CHARTS_SPEC.md:1315`) accepts any number with any label. A benchmark line at `y = costBasis` is factual and safe. A benchmark line at `y = 100,000` labeled «Goal» implies a target — this is borderline Lane B (prescriptive). Per catalog §1.5 and `AI_CONTENT_VALIDATION_TEMPLATES.md` §3.4, «target» framings cross the line. Remediation: schema must require `benchmark.kind: 'cost_basis' | 'period_start' | 'sourced_external'` discriminator, with the third requiring an accompanying `benchmark.source: string` (citation fragment). Reject «target» / «goal» / «aspiration» kinds at schema level the same way `Bar.referenceLine` rejects them. File: `CHARTS_SPEC.md:1315`.
- **[LOW] L-3 — Multi-series limit of 3 is conservative but undocumented.** `min(1).max(3)` (`CHARTS_SPEC.md:1312`). Catalog A4 benchmark comparison uses 2; the third slot is reserved for «long-term average» per spec. Acceptable, but the rationale should be in the spec. Remediation: add a sentence «Beyond 3 lines, switch to small-multiples or stacked area; the 3-line cap is enforced to preserve legibility and avoid implicit-ranking color associations.» File: `CHARTS_SPEC.md:406`.
- **[MEDIUM] L-4 — Y-axis `domain` allows arbitrary numeric clipping.** `domain: z.tuple(...)` (`CHARTS_SPEC.md:1311`) lets the AI agent set Y-axis bounds to anything. A clipped Y-axis on a portfolio-value line chart can dramatize tiny moves («zoom into noise to make a 0.3% move look like a crash»). This is a known finance-chart manipulation tactic and Lane-A-adjacent (it visually distorts the user's actual experience). Remediation: schema should constrain `domain[0] >= 0` for currency-format Y-axes; for `percent-delta`, allow negative; for `currency`, reject negative. Renderer must default to `[0, dataMax * 1.05]` for currency and never auto-zoom into a misleading frame. File: `CHARTS_SPEC.md:1311`.

**Implementation guardrails:**
- AI prompt template MUST explicitly set `interpolation` per chart semantic; default monotone only for true continuous time-series of portfolio value.
- Renderer MUST validate Y-axis domain: reject negative lower bound for currency format; default to `[0, max*1.05]`.
- Benchmark line label and value source must be auditable in the contract (proposal: discriminated union per L-2).

---

### 2.2 Area chart (§4.2)

**Lane A status:** PASS.

**Correctness status:** WARN.

**Findings:**
- **[MEDIUM] A-1 — Stacked-area baseline must be zero, period.** `CHARTS_SPEC.md:493–510` shows stacked area without an explicit baseline-zero requirement. Stacked area whose baseline is anything but zero violates the «proportional contribution» reading users derive from a stack. Catalog A10 (account contribution over time) is the canonical use; the contribution math relies on `Σ(stack values at time t) = total at time t`, which only holds with zero baseline. Remediation: schema-level invariant: `AreaChartPayload.stacked === true` implies `yAxis.domain[0] === 0` (renderer enforces); schema should add `validateAreaStackBaseline()` as a Zod `.refine()` that rejects non-zero `domain[0]` when `stacked: true`. File: `CHARTS_SPEC.md:1322` (yAxis schema) + `:1326` (stacked field).
- **[MEDIUM] A-2 — Step interpolation for cumulative cash-flow is the right call but not enforced for the right semantic.** Spec at `:460` mentions `type="step"` for cumulative cash flow with discrete events. But the schema's `interpolation: z.enum(['monotone', 'linear', 'step'])` is just an enum; nothing ties step to «cumulative cash-flow» semantic. AI agent could emit `monotone` for a cumulative-cash-flow area chart and visually fabricate continuous deposit timing. Remediation: AI prompt template must hard-rule «cumulative cash-flow → step», documented in `AI_CONTENT_VALIDATION_TEMPLATES.md` chart-rendering section. Renderer cannot enforce because it doesn't know the semantic; this is an AI-prompt-layer guardrail. File: tracked in catalog §A8 / §A9 entries.
- **[LOW] A-3 — Stacked-area opacity ladder (1.0/0.8/0.6/0.4/0.2 per §7.3) implies ranking.** §7.3 row 2 says stacked area uses different fill opacities per stack from bottom up as a color-blind mitigation. Bottom-most stack = full opacity = «most prominent» visual; top stack = 0.2 = «least prominent». This implies an editorial ranking. For broker-contribution stacked area (catalog A10), the AI agent does the sort; if it sorts by largest, the largest broker is bottom-most and reads as «primary», which is fine. But if it sorts by recency or alphabetically, the opacity ladder creates false hierarchy. Remediation: AI agent must emit `series` array sorted by current value descending (or whatever metric the user asked about), and renderer assigns opacity in that order — documented in `CHARTS_SPEC.md:494`. File: `CHARTS_SPEC.md:1856–1857` (a11y row 2).

**Implementation guardrails:**
- Stacked area schema MUST require `yAxis.domain[0] === 0` (or absent, with renderer default to 0).
- AI agent contract: cumulative cash-flow area → `interpolation: 'step'` is mandatory when `data` represents cumulative-with-discrete-events.
- Stacked-area series order is meaningful; AI agent prompt template must specify the sort order it uses, and that sort order must be visible to the user via the legend ordering.

---

### 2.3 Bar chart (§4.3)

**Lane A status:** PASS.

The structural exclusion of `targetWeight` and the restriction of `referenceLine` to `axis: 'zero'` only is exemplary. This directly addresses the catalog §1.5 and finance-advisor catalog v1.1 Lane-A red flag #11 (B8 drift bar target-weight prescription).

**Correctness status:** PASS.

**Findings:**
- **[LOW] B-1 — `colorBySign: true` is fine; explicit-sign-on-label invariant should be in the schema or renderer contract.** §7.3 row 3 says «leading sign on labels (`+2.4%`)» is the primary signal. This is correct. But the schema doesn't require labels at all — `BarChartPayload.data` is just `CategoryPoint { x: string, y: number }`. If `colorBySign: true` and labels are absent, color becomes the only sign signal — color-blind readers lose information. Remediation: renderer must auto-generate signed labels when `colorBySign: true` AND `yAxis.format === 'percent' | 'percent-delta' | 'currency'`. Document in `CHARTS_SPEC.md:531–533`. Not a schema change; a renderer behavior contract.
- **[LOW] B-2 — Industry-convention rebalance bands in tooltip prose is allowed; consistency with verb whitelist required.** §4.3 sample tooltip text: «Drift: +6.3pp · Industry rebalance bands per Modern Portfolio Theory typically flag drift >5pp; this is a factual convention, not a Provedo recommendation.» Three issues: (a) «typically flag» = passive prescription (who flags?); (b) MPT is not the right citation for rebalance bands — industry convention is Brinson / advisor-tradition / FINRA investor education, not MPT; (c) the AI agent supplies this prose, so finance-advisor must approve the canonical phrasing. Remediation: register the canonical tooltip phrase in `AI_CONTENT_VALIDATION_TEMPLATES.md` §4 softening table. Recommended phrasing: «Drift: +6.3pp · Industry convention per FINRA investor education describes rebalance bands of 5pp as a common heuristic; this is a factual convention only.» Cite `BENCHMARKS_SOURCED.md` row 13. File: `CHARTS_SPEC.md:526`.

**Implementation guardrails:**
- When `colorBySign: true` and Y-axis format is signed, renderer auto-generates signed labels above each bar.
- Drift-bar tooltip prose comes from the AI agent; AI prompt MUST cite the FINRA convention with the canonical phrase from the validation templates doc.

---

### 2.4 Donut chart (§4.4)

**Lane A status:** PASS.

**Correctness status:** WARN.

**Findings:**
- **[HIGH] D-1 — Schema does not enforce `Σ segments.value` semantic invariant.** `DonutChartPayload.segments` is `array(...).min(1).max(7)`. The donut visual implicitly communicates «these segments are proportions of a whole». If the AI agent emits 7 segments that sum to 92% of the actual portfolio value (because 8 minor positions were dropped without an «Other» segment), the donut visually misrepresents allocation. Remediation: schema must require either (a) `Σ values === reportedTotal` invariant via `.refine()`, with a `meta.reportedTotal` field added; or (b) when the AI agent caps at 7, force an «Other» segment with the residual. Pattern (b) is safer and matches the catalog scaling pattern (top-N + Other). Renderer must reject donut payloads where the segments don't sum to `meta.reportedTotal` within tolerance. File: `CHARTS_SPEC.md:1369–1374`.
- **[MEDIUM] D-2 — `value: z.number().nonnegative()` is correct but ICP-edge-case drift.** Donut segments cannot be negative. ✓ But asset-class breakdowns (catalog B4) include `cash` which CAN be negative if the user has margin debt (negative cash balance). Today the schema rejects it; that's correct for donut, but the AI agent must know to use a stacked bar (with `colorBySign: true`) for portfolios with margin. Remediation: AI prompt template for «show me my asset mix» must check for negative cash before selecting `kind: donut`; if negative cash exists, switch to `kind: bar`. Document in catalog B4 entry + AI prompt. File: schema `CHARTS_SPEC.md:1372` is fine; AI prompt layer is the gap.
- **[LOW] D-3 — Center label override `centerLabel: z.string().optional()` allows AI agent to inject any string.** Including, e.g., «Diversified portfolio» (evaluative) or «Concentrated» (evaluative). Both cross Lane A. Remediation: schema should constrain `centerLabel` to a fixed-format value (sum + unit) OR reject it entirely and let the renderer compose the center label from `meta.subtitle` and `Σ values`. File: `CHARTS_SPEC.md:1375`.

**Implementation guardrails:**
- Donut schema MUST enforce sum-to-total invariant; if AI agent caps at 7, the 7th segment is auto-«Other» with the residual.
- AI prompt template for asset-class breakdown checks for negative cash before selecting donut; fallback to bar if margin debt present.
- Center label is renderer-composed from sum, not arbitrary AI-agent string.

---

### 2.5 Sparkline (§4.5)

**Lane A status:** PASS.

**Correctness status:** PASS.

**Findings:**
- **[LOW] SP-1 — Trend computed by `last vs first` is a known finance-chart pitfall.** §4.5 says «Color: jade up (last > first), bronze down». For a sparkline of a position that ended where it started but had a 30% drawdown midway, this reads «flat» (jade neutral) and hides the drawdown. Acceptable for a glance-only mini-trend, but flag for the AI prompt: when sparkline is the ONLY visual in a chat reply, AI must consider whether intra-period max/min is material; if it is, switch to a regular line chart. File: `CHARTS_SPEC.md:654`.
- **[LOW] SP-2 — `trend: 'flat'` enum value exists but threshold is not specified.** `data[last].y === data[0].y` exactly is rare; near-flat is common. Remediation: spec should define «flat = abs(deltaPct) < 0.5%». Document in `CHARTS_SPEC.md:1384`.

**Implementation guardrails:**
- AI agent prompt template explicitly states «sparkline = glance-only; if intra-period extremes are material to the user's question, use a line chart».
- Renderer's trend classification: `flat` if `abs(last/first - 1) < 0.005`, else up/down by sign.

---

### 2.6 Calendar (§4.9, NEW v1.1)

**Lane A status:** PASS.

The eventType restriction to `dividend` + `corp_action` for MVP, with `earnings` and `news` schema-rejected pending PO paid-data approval, is correct and aligns with my catalog v1.1 Risk Flag 3.

**Correctness status:** WARN.

**Findings:**
- **[HIGH] C-1 — `announced` vs `scheduled` semantics carry real money risk.** Catalog C1 distinguishes these as: `announced` = issuer press release, broker not yet confirmed; `scheduled` = broker corporate-actions feed, future-dated, broker-confirmed; `received` = broker has posted. Spec §4.9 mirrors this. **But** the schema (`CHARTS_SPEC.md:1453`) accepts `status: 'received' | 'scheduled' | 'announced'` without any temporal validation. A `status: 'received'` event with a `payDate` in the future is impossible (you can't have received money for a future-dated payment). A `status: 'scheduled'` event with a `payDate` in the past is also a data-quality bug. Remediation: schema `.refine()` rules — `received` requires `payDate <= now`; `scheduled` requires `payDate > now`. File: `CHARTS_SPEC.md:1442–1455`.
- **[HIGH] C-2 — `expectedAmount` is a required field but `amountPerShare` and `shares` are optional, creating a units ambiguity.** `CHARTS_SPEC.md:1449–1451`. If `amountPerShare` and `shares` are both present and `expectedAmount !== amountPerShare * shares`, which is the truth? The tooltip in §4.9 displays `100 shares × $0.485 DPS = $48.50` — implying the multiplication is the source of truth. But the schema's `expectedAmount` is the field that drives the calendar's `totalReceived` / `totalScheduled` rollups. Remediation: schema `.refine()` — when `amountPerShare` and `shares` are both present, `expectedAmount === amountPerShare * shares` within $0.01 tolerance. When AI agent has only the gross broker-reported amount, it omits `amountPerShare` and `shares`. File: `CHARTS_SPEC.md:1449–1451`.
- **[MEDIUM] C-3 — Dividend `exDate` is optional but its absence changes interpretation.** The ex-dividend date is operationally critical: it's the cutoff for record-of-ownership. A dividend `scheduled` event without `exDate` doesn't tell the user whether they are still eligible. Remediation: `exDate` should be required for `status: 'scheduled' | 'announced'`; optional only for `status: 'received'` (post-fact). File: `CHARTS_SPEC.md:1447`.
- **[MEDIUM] C-4 — Calendar visually displays only `payDate`; ex-date is in tooltip only.** §4.9 spec says the day grid is anchored on `payDate`. For income-focused investors, the ex-date matters more than the pay-date for portfolio decisions. The current spec doesn't expose ex-date as a marker. This is a UX gap but also a potential Lane-A drift — by emphasizing pay-date, we implicitly answer «when does the money arrive» rather than «am I in time to be eligible». Remediation: V1 ships pay-date-only; V2 adds optional ex-date markers (subtler treatment, e.g. small dot in cell corner). Document in §10 Open Questions. File: `CHARTS_SPEC.md:846–860` (calendar anatomy).
- **[MEDIUM] C-5 — `currency` defaulting to USD per-event is risky for multi-currency portfolios.** `Currency.default('USD')` (`CHARTS_SPEC.md:1452`). A user with a German broker holding SAP gets EUR dividends; if AI agent omits `currency`, schema defaults to USD and the cell shows `$XX.XX`. That's wrong currency display. Remediation: schema should make `currency` required (no default) on the event level, or require it at the payload level and inherit. File: `CHARTS_SPEC.md:1452, 1485`.
- **[LOW] C-6 — Corp-action `actionType: 'name_change'` is in the schema but doesn't have a financial impact and may overwhelm the calendar.** `CHARTS_SPEC.md:1463`. Name changes are administrative; they don't change holdings. A calendar full of name-change markers is noise. Remediation: AI agent prompt template for calendar: filter `name_change` corp-actions out of the calendar view by default; surface only in a separate corp-action log (catalog G3). File: AI prompt layer; schema is fine.

**Implementation guardrails:**
- Schema-level temporal-status invariants: received → past pay-date; scheduled → future pay-date.
- `expectedAmount === amountPerShare × shares` invariant when both supplied.
- `exDate` required for scheduled / announced dividends.
- Currency required per event (not defaulted to USD).

---

### 2.7 Treemap (§4.10, NEW v1.1)

**Lane A status:** WARN.

**Findings:**
- **[CRITICAL] T-1 — Intra-day daily-change color encoding without enforced asOf-staleness flag is a Lane-A drift risk.** §4.10 documents `dailyChangePct` as a secondary visual channel: «≥ +2%: deep jade; -0.5% to +0.5%: neutral grey; ≤ -2%: bronze». The treemap caption says «color = today's price change». **But:** for users on brokers with nightly-only sync, the «today's price change» on display might be from yesterday or the day before. A user who sees a green NVDA tile and asks the AI «should I buy more NVDA?» will read a 36-hour-stale signal as fresh momentum. The catalog §1.4 «time anchor» rule requires every chart to display an as-of timestamp; spec §4.10 puts the timestamp in the tooltip eyebrow only. **Caption alone is insufficient.** Remediation: above the treemap chart card, the renderer MUST display a staleness-banner-row when `asOf` is older than: 30 minutes for US/EU market hours (9:30 ET – 16:00 ET; 9:00 CET – 17:30 CET); end-of-day-prior for non-market-hours payloads. Banner text: «Color reflects price change as of [asOf]; data is [N hours/days] old.» Use `--text-3` for subdued treatment. File: `CHARTS_SPEC.md:998` (caption is mandatory but staleness is not). Block-CI test: payload with `asOf` >24h old MUST render with staleness banner visible.
- **[MEDIUM] T-2 — Single-channel-degrade fallback is documented but not tested.** §4.10: «when `dailyChangePct` is absent, all tiles fill `var(--chart-series-5)` at 0.50 opacity». Open Q8 confirms this is the designer's recommendation. From a Lane A standpoint, single-channel-degrade is SAFER than two-channel — it removes the «daily change as buy signal» reading. Remediation: schema SHOULD allow `dailyChangePct` to be omitted (it currently is `optional`, ✓); contract test asserts that a payload with no `dailyChangePct` on any tile renders as single-channel grey, no exceptions. Implementation guardrail: when payload has `dailyChangePct` on SOME but not ALL tiles, renderer must EITHER drop the channel entirely OR mark uncovered tiles distinctly (e.g. striped pattern). Currently the spec is silent on partial-coverage; this is a real bug. File: `CHARTS_SPEC.md:993`.
- **[LOW] T-3 — Caption mentions FINRA concentration thresholds but spec doesn't ensure caption is rendered.** §4.10 mandatory caption: «Tile size = % of portfolio; color = today's price change. Treemap describes proportions; concentration thresholds are factual conventions per FINRA, not Provedo recommendations.» This is good, BUT the caption is described as «mandatory» in prose; the schema doesn't have a `caption` field, so renderer must render this as a hardcoded string or the AI agent must place it in `meta.subtitle`. Remediation: schema should have a `meta.factualCaption: z.string().optional()` field, and renderer for treemap MUST display the canonical caption (hardcoded) if `factualCaption` is absent — never silent. File: `CHARTS_SPEC.md:998` + schema `:1502`.

**Correctness status:** WARN.

**Findings:**
- **[MEDIUM] T-4 — Schema permits `weightPct: 0` and the layout misbehaves.** `weightPct: z.number().min(0).max(100)` (`CHARTS_SPEC.md:1494`). A tile with `weightPct: 0` from a fully-divested position should not render. Recharts' `<Treemap>` will produce a degenerate zero-area tile. Remediation: schema `.refine()` — `weightPct > 0` (strict). Tiles with zero weight must be elided by the AI agent. File: `CHARTS_SPEC.md:1494`.
- **[MEDIUM] T-5 — `Σ tiles.weightPct` invariant unenforced.** Same shape of issue as donut D-1. If 8 tiles sum to 88% (because the 5 smallest were dropped without an «Other» tile), the treemap visually understates concentration of the displayed tiles relative to the full portfolio. Remediation: schema `.refine()` — `Σ weightPct + Σ (other tile weightPct) ∈ [99.5, 100.5]` tolerance. AI agent must include an `isOther: true` tile to absorb the residual. File: `CHARTS_SPEC.md:1490–1500`.
- **[LOW] T-6 — `sector` field is in the schema but unused in v1 visual treatment.** `CHARTS_SPEC.md:1496`. Acceptable for forward-compatibility (V2 may colour-tint by sector), but spec should note this explicitly. File: `CHARTS_SPEC.md:1496`.
- **[LOW] T-7 — «OTHER» tile label format is inconsistent.** §4.10 shows `OTHER · N items` in mono uppercase. JSON example at `:1739` has `"name": "Other (12 positions)"`. Renderer template format is unclear — does the renderer use `name` or compose from `itemCount`? Remediation: renderer ignores `name` for `isOther` tiles; always composes label as `OTHER · {itemCount} items`. Document in `CHARTS_SPEC.md:997`.

**Implementation guardrails:**
- Treemap MUST render staleness banner when `asOf` > thresholds (30min market hours / EOD-prior otherwise).
- Treemap MUST render canonical FINRA-citation caption; either via `meta.factualCaption` or hardcoded fallback.
- Schema enforces `weightPct > 0`, `Σ weightPct ≈ 100`.
- Partial `dailyChangePct` coverage forces single-channel-degrade.

---

### 2.8 Stacked bar (§4.6)

**Lane A status:** PASS.

Same schema constraint as Bar (no `targetWeight`, `referenceLine.axis === 'zero'` only). ✓

**Correctness status:** WARN.

**Findings:**
- **[MEDIUM] SB-1 — Sum-to-total invariant unenforced for catalog B7 stacked variant.** When stacked-bar segments represent broker-asset-class composition (catalog B7 stacked variant), each bar's segments must sum to that broker's total. Schema `MultiSeriesPoint.catchall(z.number())` (`CHARTS_SPEC.md:1250`) accepts arbitrary keys with arbitrary numbers. AI agent could emit broker totals that don't match. Remediation: catalog spec already says «matches existing AllocationPieBar.tsx» — the renderer should compute the bar's total from `Σ segment values` and use that for axis tick labels, not accept a separately-supplied total. Document in `CHARTS_SPEC.md:702`.
- **[MEDIUM] SB-2 — Negative-value handling in stacked bar is undefined.** Stacked bars don't gracefully handle negative values; if one series has a negative number, Recharts will render it BELOW the baseline, breaking the «percentage of bar height» reading. For broker contribution to portfolio, this could happen if a broker had a NET withdrawal in a period. Remediation: schema `.refine()` — when `kind === 'stacked-bar'`, all values across all series must be non-negative. Renderer rejects negative-value stacked-bar payloads; AI agent must use a diverging bar (`kind: bar` with `diverging: true`) for net-flow visualizations. File: `CHARTS_SPEC.md:1357–1362`.
- **[LOW] SB-3 — Series-count cap of 5 (`min(2).max(5)`, `CHARTS_SPEC.md:1358`) vs catalog B7 «small (1-4 brokers, the common case): show all»** — the catalog explicitly mentions 1-4; schema requires `min(2)`. A user with 1 broker has no stacked-bar to show. ✓ Schema correctly forces fallback. Document the rationale.

**Implementation guardrails:**
- Stacked-bar schema rejects negative values; AI agent uses diverging bar instead.
- Renderer composes bar total from segment sum; does not accept supplied total.

---

### 2.9 Scatter / dot plot (§4.7, V2)

**Lane A status:** WARN.

**Findings:**
- **[CRITICAL] S-1 — H5 risk-return scatter Lane-A risk persists in spec; T2 next-wave classification is acceptable IF the schema or renderer block until V2 PO greenlight + legal-advisor sign-off.** Catalog v1.1 §H5 marks scatter as V2 with explicit «Lane A risk + computational complexity» and «legal-advisor sign-off recommended before live ship even at V2». My catalog v1.1 §1.5 hard-bans efficient-frontier overlays and quadrant-as-advice labels. Spec §4.7 partially honors this — the schema doesn't permit efficient-frontier curves — but the schema IS in the v1.1 union (`CHARTS_SPEC.md:1551`). **If AI agent emits a `kind: scatter` payload during MVP, renderer renders it.** This is exactly the failure mode legal-advisor sign-off is meant to prevent. Remediation: either (a) remove `ScatterChartPayload` from the MVP `ChartPayload` union and add it back in v1.2 when legal-advisor signs off; or (b) renderer's switch dispatcher includes a hard-coded gate that returns the §3.11 error state with body «This chart is V2 and not yet greenlit» when `kind === 'scatter'` and `featureFlag.scatter !== true`. Pattern (b) is cheaper. File: `CHARTS_SPEC.md:1551`, dispatcher logic in renderer.
- **[HIGH] S-2 — Scatter quadrant interpretation drift.** §4.7 says reference lines at `x=0, y=0` carve quadrants and have `<ReferenceLine ... strokeDasharray="2 4"/>`. Quadrants are inherently editorial: top-right = «high-return / high-volatility» = «aggressive»; bottom-left = «low-return / low-volatility» = «conservative». Catalog v1.1 §1.5 hard-bans «aggressive / conservative quadrant labels». Spec doesn't show quadrant labels in §4.7, ✓, but the schema (`CHARTS_SPEC.md:1399–1403`) permits arbitrary `referenceLines.label`. If AI agent emits `{ axis: 'x', value: 0.15, label: 'High volatility threshold' }`, renderer accepts it. Remediation: schema `.refine()` rejects reference-line labels that contain prescriptive vocabulary («target», «aspirational», «aggressive», «conservative», «optimal», «efficient»). Hard list per `AI_CONTENT_VALIDATION_TEMPLATES.md` §3. File: `CHARTS_SPEC.md:1399–1403`.
- **[MEDIUM] S-3 — Volatility computation lookback period must be cited.** Catalog F2 / F3 / H5 require lookback period to be cited in chart annotations (e.g. «90-day rolling volatility»). The schema's `xAxis.format` and `xAxis.label` accept any string. AI agent must include lookback in the label. Remediation: AI prompt template requires lookback period in `xAxis.label` for any scatter where X or Y is a computed volatility / return metric. Document in `AI_CONTENT_VALIDATION_TEMPLATES.md`. File: AI prompt layer; schema is sufficient.

**Correctness status:** WARN.

**Findings:**
- **[MEDIUM] S-4 — `ZAxis range={[60, 60]}` makes all dots same size; `z` channel unused.** §4.7 sample JSX has `<ZAxis range={[60, 60]}>` (`CHARTS_SPEC.md:750`). Schema's `ScatterPoint.z: optional` (`CHARTS_SPEC.md:1255`) allows variable bubble size. If AI agent supplies `z`, the renderer ignores it because of the fixed range. Remediation: when payload includes `z`, renderer adapts `ZAxis range` to `[40, 200]` for variable bubble size. Document in §4.7. File: `CHARTS_SPEC.md:750`.

**Implementation guardrails:**
- MVP renderer's chart dispatcher BLOCKS `kind: scatter` until V2 PO greenlight + legal-advisor sign-off; renders §3.11 error state with «V2 chart, not yet greenlit».
- Schema rejects prescriptive vocabulary in scatter `referenceLines.label`.
- AI prompt template requires lookback period in scatter axis labels.

---

### 2.10 Cash-flow waterfall (§4.11, NEW v1.1)

**Lane A status:** PASS.

Caption «Decomposes change in portfolio value into mechanical components» is descriptive; «Does not predict future contributions» pre-empts forward-projection drift. T2 next-wave classification is appropriate.

**Correctness status:** RED.

**Findings:**
- **[CRITICAL] W-1 — `startValue + Σ(non-anchor deltas) === endValue` invariant unenforced.** Spec example at `CHARTS_SPEC.md:1762–1771` shows: start 220,000 → +10,000 deposits → -2,000 withdrawals → +4,200 realized → +8,420 unrealized → +1,850 dividends → +240 interest → -90 fees → +270 fx → end 246,890. **Math: 220,000 + 10,000 - 2,000 + 4,200 + 8,420 + 1,850 + 240 - 90 + 270 = 242,890 ≠ 246,890.** The example in the spec ITSELF is off by $4,000. This is the load-bearing invariant of waterfall — if the math doesn't add up, the chart is lying. Remediation: schema `.refine()` rule (mandatory CI block): `startValue + Σ deltaAbs[componentType ≠ 'start' ∧ componentType ≠ 'end'] === endValue`, within $1.00 tolerance for FX rounding. Sample JSON in spec MUST be corrected (it currently is wrong by $4,000). File: `CHARTS_SPEC.md:1532–1541` (schema) + `:1761–1771` (example).
- **[HIGH] W-2 — `realized_gains` + `unrealized_gains` semantic must NOT double-count deposits.** Definition: realized gain = sale price - cost basis on closed positions; unrealized gain = market value - cost basis on open positions. Both are computed AFTER cost basis is established by the original deposit. If the AI agent counts a deposit AND counts the resulting unrealized gain on the position purchased with that deposit, the user double-counts. Conversely, if the AI agent counts deposits but excludes them from cost basis when computing unrealized gain, the unrealized gain is overstated. Remediation: AI prompt template MUST specify the canonical decomposition — `endValue = startValue + (deposits + withdrawals) + Δ(cost basis adjustments) + (unrealized at end - unrealized at start) + dividends + interest - fees + fx_effects`. The exact algebra is tricky; finance-advisor will issue a separate spec for the AI prompt layer. Flag for AI engineer dispatch. File: `CHARTS_SPEC.md:1095–1108` (component order) + AI prompt layer.
- **[HIGH] W-3 — FX effects sign convention is ambiguous.** «fx_effects: positive or negative» (§4.11). Positive FX effect = base currency strengthened against holding currencies = USD-denominated value rises. Or is positive FX = USD weakened (foreign holdings worth more in USD)? Both conventions are used in industry. Remediation: spec must explicitly state the convention. Recommended: **`fx_effects` is positive when the change is favorable to the user's base-currency portfolio value** — i.e., the directional sign matches the directional impact on `endValue`. Document in `CHARTS_SPEC.md:1106` and `BENCHMARKS_SOURCED.md` §4 formulas reference (add an §4.8 entry for FX decomposition). File: `CHARTS_SPEC.md:1106`.
- **[HIGH] W-4 — `fees` sign convention is ambiguous and inconsistent with example.** Spec example shows `fees: -90` (negative). Caption says «typically small». Schema doesn't enforce sign. If AI agent emits `fees: +90` thinking «I paid $90 in fees» without the sign reversal, the waterfall shows fees as a positive contributor (wrong). Remediation: `componentType === 'fees'` requires `deltaAbs <= 0` at schema `.refine()`. Same for `withdrawals` (must be ≤0). Document conventions in spec table at `:1099–1108`. File: `CHARTS_SPEC.md:1530`.
- **[MEDIUM] W-5 — Component ordering rigidity vs zero-elision interaction.** §4.11 says steps in canonical order 1-10, with zero-value bars elided. But after elision, the connector geometry must update (otherwise connectors point to invisible bars). Remediation: spec needs an explicit «after elision, recompute connector positions; never draw connectors to absent steps». File: `CHARTS_SPEC.md:1108` + connector geometry §.
- **[LOW] W-6 — Schema doesn't enforce min/max number of NON-anchor steps.** `steps.min(3).max(12)` (`CHARTS_SPEC.md:1537`) includes start + end; that means as few as 1 component, as many as 10. Reasonable. But the spec mentions `start` and `end` as anchors with full-height bars — the schema should enforce that the first step has `componentType: 'start'` and the last step has `componentType: 'end'`. Remediation: schema `.refine()` — `steps[0].componentType === 'start' && steps[steps.length-1].componentType === 'end'`. File: `CHARTS_SPEC.md:1537`.

**Implementation guardrails:**
- Waterfall schema MUST enforce `startValue + Σ non-anchor deltas === endValue` within $1 tolerance; CI test mandatory.
- `fees` and `withdrawals` deltas MUST be ≤0; `deposits` MUST be ≥0.
- `fx_effects` sign convention: positive = favorable to user's base-currency portfolio value.
- First step must be `componentType: 'start'`; last must be `'end'`.
- Spec example payload at `:1761–1771` MUST be corrected — the published example math is off by $4,000.

---

### 2.11 Candlestick (§4.8, T3)

**Lane A status:** PASS.

The structural exclusion table in §4.8 is exemplary. Schema rejects `supportLine`, `resistanceLine`, `trendLine`, `channelBand`, `movingAverage`, `rsi`, `macd`, `bollinger`, `signalAnnotation`, `buyMarker`, `sellMarker`, and trade markers entirely. T3 status preserves the «designed but not yet shipped» posture.

**Correctness status:** WARN.

**Findings:**
- **[HIGH] CN-1 — OHLC ordering invariant unenforced.** `CandlePoint` schema (`CHARTS_SPEC.md:1259–1265`) accepts arbitrary `open`, `high`, `low`, `close` numbers. Real OHLC data must satisfy: `low <= open <= high`, `low <= close <= high`, `low <= high`. Without these invariants, AI agent could emit `{ open: 100, high: 95, low: 105, close: 98 }` (high < low, etc.) and renderer would draw garbage. Remediation: schema `.refine()` rules — `low <= min(open, close)`, `high >= max(open, close)`, `low <= high`, all positive (price > 0). File: `CHARTS_SPEC.md:1259–1265`.
- **[MEDIUM] CN-2 — Recharts implementation sketch is incomplete; OHLC dataKey pairing not solved.** §4.8 admits «In practice the implementation is fiddlier — `dataKey` for candles needs a paired transform feeding both `[low, high]` and the body bounds.» Spec defers to «frontend-engineer will productionize when T3 lands.» This is fine, but it means the schema is correct independent of the implementation. Flag for tech-lead: when T3 lands, the implementation work is non-trivial; budget time. File: `CHARTS_SPEC.md:828`.
- **[LOW] CN-3 — Y-axis domain `[dataMin * 0.98, dataMax * 1.02]` (`:821`) — for low-priced stocks, this can crop the candle bodies. For a $5 stock, 0.98 * 5 = $4.90; if low is exactly $4.90, the wick touches the axis. Remediation: domain padding should be `[max(0, dataMin - max(0.01, dataMin*0.02)), dataMax + max(0.01, dataMax*0.02)]` to ensure visible padding always. Document in §4.8. File: `CHARTS_SPEC.md:821`.

**Implementation guardrails (when T3 lands):**
- Schema enforces OHLC ordering invariants.
- Y-axis padding is absolute-min-aware (not pure-percentage-based) for low-price instruments.
- Custom shape pattern is non-trivial — treat as its own focused work item, not a tail-end add-on to the MVP slice.

---

## 3. Surface-level recommendations

### 3.1 Coach UX teaser pattern compatibility with charts

The locked Coach UX (DECISIONS.md 2026-04-23 / 2026-04-27) uses contextual blinking icons + teaser-paywall pattern: «Provedo noticed a pattern in your NVDA trades — upgrade to Plus to see detail.» Three of the v1.1 charts deserve specific Coach UX treatment:

- **Treemap (T-1 finding):** the staleness banner I require is independent of Coach treatment, but Coach can ride alongside. A blinking icon on a tile «Provedo noticed concentration above your historical average» is acceptable if the teaser surfaces only the OBSERVATION («your top-3 = 35% vs 6-month average 28%»), never «consider trimming». Coach must NOT add overlay annotations to the tile (no arrows, no badges saying «overweight»). File: catalog §1.3 borderline categories — Coach observation patterns.
- **Drift bar (B8 / Bar):** the same Coach teaser pattern works — «Provedo noticed your top-5 drifted >5pp this quarter». Tooltip text already cites FINRA convention. Compatible.
- **Calendar:** Coach teaser «Provedo noticed dividend income up 18% YoY» is fine. Teaser must NOT surface forward projection («expect $XYZ next month») — Lane A boundary enforced via `AI_CONTENT_VALIDATION_TEMPLATES.md` §3.4.

### 3.2 Forward-looking projection on charts

The spec deliberately has NO forward-looking projection chart variants. This is correct (catalog §1.2 hard-bans «forecast of price or return»). I confirm: zero of the 11 chart types support forward-looking projection. If a future spec proposes one (e.g. a Monte Carlo cone for retirement planning), it must come back through this audit.

### 3.3 Cross-currency aggregation

Multiple charts (donut B5 currency exposure, treemap B9, waterfall C6) implicitly aggregate across currencies. Catalog §1.4 requires «Currency. Multi-currency portfolios show currency per-position or aggregate with explicit FX rate timestamp.» Spec is silent on FX rate timestamp display in the multi-currency cases. Remediation: when payload includes positions in multiple currencies, renderer MUST display an inline FX-rate-as-of badge below the chart card. Implementation guardrail in §4 below.

---

## 4. Implementation guardrails (cross-cutting)

These rules MUST be embedded in tech-lead's FE kickoff acceptance criteria. They are renderer-layer enforcement (not schema-layer where Zod can't reach), and represent the cross-cutting Lane-A-correctness invariants.

1. **Time-anchor display.** Every chart MUST show an as-of timestamp visible above or below the chart card (not hidden in tooltip). Treemap and any chart using intra-day data MUST show staleness banner when `asOf` is older than thresholds (30 min market hours / EOD-prior otherwise) — see Finding T-1.
2. **Source citation.** Every chart with numerical content MUST display a `Source:` line (matches catalog I1 Sources block). If `meta.source` is absent in the payload, renderer falls back to «Source: your broker data, no timestamp available» — never silent. AI agent prompt template must always populate `meta.source`.
3. **No silent unit assumption.** Currency MUST be explicit on every chart with monetary values. If multi-currency, renderer displays an inline FX-rate-as-of badge.
4. **Lane-A vocabulary check.** Renderer-layer regex check against the `AI_CONTENT_VALIDATION_TEMPLATES.md` §3 verb blacklist on every text field that the AI agent populates (`meta.title`, `meta.subtitle`, `meta.alt`, `meta.factualCaption`, scatter `referenceLines.label`, all chart-text-prose fields). On match: render the §3.11 error state and log to monitoring. Block-CI test mandatory.
5. **Schema-level invariants as block-CI tests** (extend §9 contract test list):
   - Donut: `Σ values ∈ [meta.reportedTotal × 0.995, meta.reportedTotal × 1.005]`.
   - Treemap: `Σ weightPct ∈ [99.5, 100.5]`; all `weightPct > 0`.
   - Waterfall: `startValue + Σ non-anchor deltaAbs === endValue` within $1 tolerance; first step is `start`, last is `end`; `fees`/`withdrawals` deltas ≤0; `deposits` ≥0.
   - Candlestick: OHLC ordering invariants (`low ≤ min(open, close)`, `high ≥ max(open, close)`, `low ≤ high`, all > 0).
   - Calendar: temporal-status invariants (`received → payDate ≤ now`; `scheduled → payDate > now`); `expectedAmount === amountPerShare × shares` within $0.01 when both supplied; `exDate` required for `scheduled`/`announced`.
   - Bar: existing constraints (no `targetWeight`; `referenceLine.axis === 'zero'`).
   - Stacked bar: all values across all series ≥0 (no negative stacks).
   - Scatter: V2 gate — render-block until feature flag enabled.
   - Line: `benchmark.kind` discriminator added; `domain[0] >= 0` for currency format.
6. **No Y-axis manipulation.** Renderer defaults Y-axis to `[0, max*1.05]` for currency; never auto-zooms into a misleading frame. AI-agent-supplied `domain` overrides only if it widens the view, never narrows it below `[0, max*1.05]` for currency.
7. **«Other» tile / segment integrity.** When AI agent caps top-N (donut, treemap, stacked bar), the residual MUST be in an `isOther: true` tile/segment with `itemCount` populated. Renderer composes label as `OTHER · {itemCount} items`, ignoring any AI-supplied name.

---

## 5. Cross-team flags

### For architect (data-shape ADR in parallel)

- **Donut sum-to-total invariant** (D-1): proposal to add `meta.reportedTotal: number` to `DonutChartPayload` and enforce `Σ values === reportedTotal` via `.refine()`. Architect please consider whether this belongs at the Donut payload level or at a shared `MetaFinancialAggregate` mixin since the same shape applies to Treemap (T-5) and Stacked-bar (SB-1).
- **Waterfall conservation invariant** (W-1): the `startValue + Σ deltas === endValue` rule is the single most load-bearing invariant in the spec. Architect please ensure the contract package's CI tests treat this as block-merge severity, on par with the Lane-A structural-exclusion tests already mandated in spec §9.7.
- **Scatter MVP gate** (S-1): proposal — remove `ScatterChartPayload` from the MVP `ChartPayload` discriminated union; add it back in v1.2 schema bump when V2 ships. Architect please weigh this against the alternative of feature-flag gating in the renderer dispatcher. Cleaner contract = remove from union; cheaper short-term = renderer dispatcher gate. My recommendation: **remove from union for MVP** so accidental AI-agent emission of scatter fails at parse time, not at render time.
- **Currency field** (C-5): proposal — `Currency` should be required (no default) on calendar events; default-to-USD bug surface. Architect please bless the change.

### For tech-lead (FE kickoff acceptance criteria)

- All §4 implementation guardrails above MUST land in the FE kickoff acceptance criteria as block-CI tests.
- Specifically: waterfall conservation invariant (W-1), treemap staleness banner (T-1), scatter MVP gate (S-1), Lane-A vocabulary regex (§4.4), and OHLC ordering invariants (CN-1).
- Spec §9.7 already mandates contract tests for Bar / Candlestick / Calendar / Line Lane-A exclusions. Extend that list with the invariants in §4.5 above.
- Effort impact estimate: the spec's «3.5 days» FE estimate does NOT include the additional invariant tests. Add ~0.5d for the Lane-A vocabulary regex layer + invariant test coverage. Net: 4 days.

### For legal-advisor (escalation candidates)

- **Scatter (H5) V2 ship gate:** legal-advisor sign-off recommended before V2 enables scatter. Catalog §H5 status reads «legal-advisor sign-off recommended before live ship even at V2». Confirming that recommendation here.
- **Treemap intra-day color encoding:** the staleness-banner mitigation (T-1) is my primary defense. If legal-advisor sees the treemap mockup and disagrees that staleness-banner is sufficient — i.e., concludes that any «today's price change» visualization on a holdings chart is too close to action prompting — then treemap drops to T2 (no color-channel) for MVP. Legal-advisor please review treemap §4.10 with this lens.
- **Candlestick T3 promotion:** when PO eventually promotes T3 to ship, legal-advisor MUST sign off. Catalog A2b status note already documents this.

### For product-designer

- Spec §4.11 published-example math is off by $4,000 (Finding W-1). Please correct the JSON example at `:1761–1771` so it sums correctly. Suggested fix: change «realized: 4,200» to «realized: 8,200» so total adds up; or recompute end-value to 242,890.
- Treemap caption staleness extension (T-1, T-3): please add a `meta.factualCaption` field to schema and document the staleness-banner UI treatment (above the chart card, `--text-3` muted color).

---

## 6. Severity legend

- **CRITICAL** Lane A violation OR numeric-integrity bug. Blocks ship. PO must accept risk in writing if shipped. (3 findings: T-1 treemap staleness, S-1 scatter gate, W-1 waterfall conservation.)
- **HIGH** Correctness defect that misrepresents data OR Lane-A drift surface. Should fix before ship. (8 findings: D-1, C-1, C-2, S-2, W-2, W-3, W-4, CN-1.)
- **MEDIUM** Suboptimal display or schema laxness, not actively misleading. TD candidate if not addressed in v1. (12 findings: L-1, L-2, L-4, A-1, A-2, B-2, D-2, C-3, C-4, C-5, T-2, T-4, T-5, S-3, S-4, SB-1, SB-2, W-5, CN-2.)
- **LOW** Polish or documentation gap. (10 findings: L-3, A-3, B-1, D-3, SP-1, SP-2, C-6, T-6, T-7, SB-3, W-6, CN-3.)

Net: 3 CRITICAL · 8 HIGH · 18 MEDIUM · 12 LOW · 41 findings total.

---

## 7. Open questions for PO

1. **Treemap staleness threshold for non-US markets.** I propose 30 min during US market hours and EU market hours; nightly-only-sync brokers fall through to «EOD-prior» banner. Crypto holdings have no «market hours» — should treemap show staleness for crypto only when `asOf` > 1h, or never? **Default if PO doesn't answer:** 30 min during any of (US/EU equity hours OR crypto-24h), banner appears whenever exceeded.
2. **Scatter MVP exclusion mechanism.** Two options: (a) remove scatter from MVP `ChartPayload` discriminated union (cleanest, requires schema v1.2 bump for V2), or (b) renderer feature-flag gate (cheap, schema unchanged). My recommendation: (a). **Default if PO doesn't answer:** option (a) — remove from MVP union, add back in v1.2.
3. **Waterfall published-example correction.** PD's example payload at `:1761–1771` violates the conservation invariant by $4,000. Should I send a patch directly (mechanical fix) or wait for PD to repair as part of her v1.2 spec polish? **Default if PO doesn't answer:** flag for PD to repair in v1.2 spec polish; do not patch from this audit.

---

## 8. Verification checklist (self-audit)

1. ✅ All 11 chart types reviewed; no «TBD» placeholders in §1 verdict table.
2. ✅ Each finding has [SEVERITY] tag + concrete file:section reference + concrete remediation.
3. ✅ §4 cross-cutting implementation guardrails has 7 rules ready to embed in tech-lead's FE kickoff acceptance criteria (target was ≥5).
4. ✅ Saved to `docs/reviews/2026-04-29-finance-charts-lane-a-audit.md`; line count target 200–400; actual ~360.
5. ✅ Hard rules respected: R1 (no paid services proposed); R2 (no PO-name external comms); R4 (no predecessor name references — refer to «sunk cost» where relevant; this audit doesn't reference $250 spend).
6. ✅ Stay-in-role: audit produced; no code changes; cross-team flags routed to architect / tech-lead / legal-advisor / PD.

---

**End of audit. 41 findings across 11 chart types. Net status: 2 PASS / 8 WARN / 1 RED. Top-3 critical: Waterfall conservation (W-1), Treemap staleness (T-1), Scatter MVP gate (S-1).**

---

## 9. Brainstorm-pass addendum (2026-04-29 fresh-eyes review against architect Δ1-Δ4)

Re-read this audit with brainstorming framing after architect's ADR deltas landed. Three deltas to my own findings record below; no other severity calls revised.

### Δa — S-2 (HIGH) re-tagged as V2-deferred-gate

**Original.** S-2 [HIGH]: scatter `referenceLines.label` permits prescriptive vocabulary («aspirational», «aggressive», «efficient»); proposed Zod `.refine()` rejecting the blacklist.

**Revision.** Architect's Δ3 removes `ScatterChartPayload` from MVP `ChartPayload` discriminated union. The schema definition remains in `packages/shared-types/src/charts.ts` for V2 but is unreachable from MVP because Zod parse fails before reaching the renderer. S-2 is therefore **mooted for MVP** and **MUST be re-activated as a precondition for V2 scatter re-introduction** alongside the legal-advisor sign-off gate (catalog §H5 + my §5 «For legal-advisor»).

**Net.** S-2 remains a HIGH-severity finding in the catalog of work, but its enforcement timeline shifts from MVP block-CI to V2 schema-bump precondition. Tech-lead's QA kickoff does NOT need to land this test for MVP; legal-advisor's V2 sign-off checklist DOES need this as a gate item.

### Δb — W-1 (CRITICAL) re-tagged as CRITICAL-mitigated

**Original.** W-1 [CRITICAL]: waterfall `startValue + Σ non-anchor deltas === endValue` invariant unenforced; schema published example off by $4,000.

**Revision.** Architect's Δ2 blesses this rule as **block-merge CI severity** with distinct error code `WATERFALL_CONSERVATION_VIOLATION`, $1.00 absolute tolerance for FX rounding, and named test fixtures including intentionally-broken variants. The structural enforcement gap is now closed at the architect level. W-1 retains CRITICAL classification because severity describes WHAT-IF-IT-LANDED-IN-PROD, not current mitigation status; tagged **CRITICAL-mitigated** for tracking.

**Outstanding from finance side.** PD must still correct the spec example payload at `CHARTS_SPEC.md:1761–1771` (the published math is off by $4,000 — see §5 «For product-designer»). Per §7 Open Q3 default, this is PD's repair as part of v1.2 spec polish, not a finance patch.

### Δc — NEW finding T-8 [MEDIUM]: treemap `dailyChangePct` cross-currency unit ambiguity

**Discovered on brainstorm pass; missed in v1 audit.**

**Finding.** Treemap tiles for multi-currency portfolios face a unit ambiguity in the `dailyChangePct` field. For a USD-base user holding SAP (EUR) and TSLA (USD), the schema's `tile.dailyChangePct: number` is a single float per tile but can mean either:

(a) **Local-currency price change** — SAP price moved +2.3% in EUR today; ignores FX impact on user's USD-denominated position value.

(b) **Base-currency total change** — SAP position value moved +2.3% in USD today, combining EUR price change + EUR/USD FX move.

These can differ by 0.5-2% on volatile FX days. A user reading «SAP +2.3% today» on a USD-base treemap and asking AI «why did my position move» gets the wrong answer if the agent computed (a) but the user assumes (b) — or vice versa.

**Lane A risk.** LOW (descriptive number, not advice). **Correctness risk.** MEDIUM — same number, two valid meanings, no contract enforcing which. AI agent could emit either; user has no way to know.

**Remediation.** Two options:

1. **Schema discriminator** — add `treemap.dailyChangeBasis: 'local-currency' | 'base-currency'` as a payload-level required field (not per-tile, since mixing within a treemap is incoherent). Renderer displays the basis in the caption: «Color = today's price change in local currency» or «Color = today's price change in your base currency (USD), including FX».

2. **AI-prompt-layer rule** — require AI agent to always emit base-currency-basis for multi-currency portfolios (so the number is what the user actually experiences in their account); single-currency portfolios are unambiguous. Document in `AI_CONTENT_VALIDATION_TEMPLATES.md`.

**Recommendation.** Both. Option 1 is the structural fix (make the basis explicit always); Option 2 is the agent-side default policy. Defense-in-depth same shape as architect's Δ4 dual-side pattern.

**File.** `CHARTS_SPEC.md:993` (treemap caption) + schema `:1492` (TreemapPayload root) + `AI_CONTENT_VALIDATION_TEMPLATES.md` chart-rendering section.

**Severity.** MEDIUM. Adds one MEDIUM finding to §6 tally → **3 CRITICAL · 8 HIGH · 19 MEDIUM · 12 LOW · 42 findings total.**

### Δd — §4.4 Lane-A vocabulary regex reasoning strengthened (no change to rule)

Architect's Δ4 makes explicit that Pydantic AI-side validates structure, Zod FE-side validates structure + cross-field math. **Neither natively guards prose vocabulary in `meta.title` / `meta.subtitle` / `meta.alt` / captions / `referenceLines.label`.** My §4 rule 4 (renderer-layer regex check against `AI_CONTENT_VALIDATION_TEMPLATES.md` §3 verb blacklist) is therefore the SOLE vocabulary gate, not redundant defense-in-depth.

**Net.** No rule change; reasoning sharpened. Tech-lead's FE kickoff acceptance criteria for §4.4 should explicitly note: «vocab regex is the ONLY layer catching prose drift; do not skip».

### Net of brainstorm-pass

- **0 guardrails dropped.**
- **0 guardrails added** to §4 cross-cutting list (T-8 remediation lives in §2.7 + AI prompt layer, not as a renderer rule).
- **1 new finding** (T-8 MEDIUM, cross-currency `dailyChangePct` basis ambiguity).
- **2 severity re-tags** (S-2 HIGH → V2-deferred-gate; W-1 CRITICAL → CRITICAL-mitigated).
- **1 reasoning strengthened** (§4.4 vocab regex sole-gate role).
- Updated tally: **3 CRITICAL · 8 HIGH · 19 MEDIUM · 12 LOW · 42 findings total.**

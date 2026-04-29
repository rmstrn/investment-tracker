# Round-2 brainstorm — primitives-layer accessibility baseline

**Date:** 2026-04-29
**Reviewer:** a11y-architect
**Branch:** `chore/plugin-architecture-2026-04-29` @ HEAD (read-only)
**Sister voices in flight:** product-designer, brand-strategist, brand-voice-curator (R2 fundamental); architect / finance-advisor / tech-lead (chart Phase-1.5 brainstorm chain)
**Mandate:** decide what a11y MUST live in the primitives layer (so every chart kind inherits it for free) vs. what stays per-chart (consumer wires).

**Thesis in one line:** treat a11y as a structural property of `<ChartFrame>` + the `_shared/` primitives, not as a per-chart consumer responsibility. CRITICAL-1 / CRITICAL-2 of the pre-QA audit (`outline:none` on every container, `useChartKeyboardNav` imported zero times) happened *because* a11y was «advice» rather than «default». The fix is to bake the discipline into primitives so the failure mode is «can't render a chart» rather than «renders an inaccessible chart».

---

## 1. Nine a11y patterns × default × escape hatch

For each pattern: **discussion** → **primitives default** → **escape hatch** → **WCAG SCs touched**.

### Pattern 1 · `role="img"` + `aria-label` on chart container

**Discussion.** Today every chart wires `<div role="img" aria-label={payload.meta.alt ?? payload.meta.title}>` by hand (see `LineChart.tsx:113-115` and 9 siblings). 10 copies of the same five lines. MEDIUM-5 of the pre-QA audit (`aria-label=""` when `meta.title` is empty) is a direct symptom of «every consumer remembers to defensively fall back». Primitives layer should own this once. Source-of-label precedence is non-trivial: `meta.alt` (explicit author override) → `meta.title` (pretty title; may be empty) → synthetic `${kind} chart` last-resort. Empty string MUST be treated as missing, not as «no label».

**Default in primitives.** `<ChartFrame>` enforces — accepts `payload: ChartPayload`, derives `aria-label = payload.meta.alt?.trim() || payload.meta.title?.trim() || \`${payload.kind} chart\``, applies `role="img"` always. Consumers cannot ship a chart container without this; the JSX of consumer charts becomes `<ChartFrame payload={payload}>...recharts internals...</ChartFrame>`, never bare `<div>`.

**Escape hatch.** `<ChartFrame ariaLabel={override}>` accepts an explicit string override for the rare case where the agent's prose is wrong (e.g. a chart of «Q4 returns» where the AT user benefits from «Q4 returns by region, ascending»). Override does NOT bypass the empty-string defense — empty override falls through to derivation.

**WCAG SCs.** 1.1.1 Non-text Content (A); 4.1.2 Name, Role, Value (A).

---

### Pattern 2 · `<ChartDataTable>` visually-hidden transcript

**Discussion.** Already exists in `_shared/ChartDataTable.tsx` and branches per `kind`. Pre-QA audit verified it works (PASS for 8 of 10 charts). Two gaps: LOW-1 (caption is `<p>` sibling, not native `<caption>`) and LOW-3 (Treemap rows render raw numbers). Both speak to a deeper question — should the primitive auto-generate from payload (current architecture, branched switch on `kind`), or accept a `transcript` slot that consumers fill? Today's auto-generation is the right call: payload IS the data; if consumers handcraft transcripts, they drift from what's drawn. But it forces the primitive to know every kind's data shape — that's a coupling cost paid willingly because the alternative is 10 transcript implementations.

**Default in primitives.** `<ChartDataTable payload={payload}>` auto-generates from `payload.kind` switch. Caption lives INSIDE the `<table>` as native `<caption>`. All numeric cells flow through `formatValue(n, format, currency)` (closes LOW-3 architecturally — formatter is the single chokepoint). `<ChartFrame>` renders `<ChartDataTable>` with `class="sr-only"` automatically — consumers do not opt in.

**Escape hatch.** `<ChartFrame transcriptVariant="visible|hidden|none">`:
- `hidden` (default) — sr-only.
- `visible` — renders below the chart for sighted users (e.g. a print stylesheet, a «show data» toggle).
- `none` — opt-out for the rare case where the chart is decorative (V2; defaults to `hidden` if not passed).

**WCAG SCs.** 1.3.1 Info and Relationships (A); 1.1.1 (A) again.

---

### Pattern 3 · Keyboard navigation primitive

**Discussion.** CRITICAL-2 of pre-QA: `useChartKeyboardNav` defined, imported zero times. Root cause: hook returns void; consumer must wire the `activeIndex` state itself, then pipe it into Recharts' `<Tooltip active>`. Three steps, easy to skip, with no compile-time penalty for skipping. The hook today is technically correct but ergonomically wrong — it makes the «accessible path» more verbose than the «inaccessible path». Reverse the gradient: make the accessible path the default, the inaccessible path the explicit opt-out.

**Default in primitives.** `<ChartFrame>` owns keyboard nav. Internally:
```ts
const [activeIndex, setActiveIndex] = useState<number | null>(null);
useChartKeyboardNav(containerRef, payload.data?.length ?? 0, setActiveIndex);
```
exposes `activeIndex` to children via context (`useChartActiveIndex()` hook) so each chart kind can bind it to Recharts' `<Tooltip active payload={data[activeIndex]}>` with one line. Container `tabIndex={0}` and the focus ring (Pattern 4) are also `<ChartFrame>`'s job. No chart can ship without keyboard nav because ChartFrame IS the wrapper.

**Escape hatch.** `<ChartFrame keyboardNav={false}>` opt-out for non-iterable charts (e.g. Sparkline's `standalone={false}` mode where the SR users gets the value from the adjacent number). Donut/Treemap may opt for a different traversal (segments, not data points) — they pass `keyboardNav="custom"` and consume the context themselves. Maximum two escape values; opt-out is loud.

**WCAG SCs.** 2.1.1 Keyboard (A); 2.1.2 No Keyboard Trap (A).

---

### Pattern 4 · Focus ring on focused datum

**Discussion.** `CHART_FOCUS_RING_CLASS` already exists in `_shared/a11y.ts` for the **container**. The Round-1 a11y audit's residual gap (criterion 8.d) is the **active-dot** — when keyboard arrows move through data, the active dot needs its own ring, not just the Recharts default `activeDot={r:5, fill, stroke:'var(--card)'}`. Today there's no «focused datum» visual primitive; each chart redefines its own active marker. Treemap focuses a tile by re-rendering with a different stroke; LineChart by changing the dot radius; Bar by inverting the cell fill. Inconsistent and easy to break.

**Default in primitives.** Ship a `<FocusRing>` component (or HOC `withFocusRing(Marker)`) that:
- Wraps the active marker (dot, sector, tile, bar) with a 2 px solid `var(--accent)` outline + 2 px halo gap (`box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent)`).
- Reads from the same `useChartActiveIndex()` context as the keyboard nav.
- Honors `data-reduced-motion` to suppress the ring fade-in.

Each chart kind imports `<FocusRing>` and applies it inside its Recharts shape renderer (Treemap content render-prop, BarChart `<Cell>`, LineChart `activeDot`).

**Escape hatch.** Charts may pass a custom `focusedDatumStyle` prop to `<ChartFrame>` if the chart geometry calls for a different ring shape (Calendar might want a rectangular ring; Donut a radial sector outline). The shape is custom; the contrast contract (3:1 vs adjacent + 2 px thickness) is enforced by the primitive via documented token usage — it cannot be bypassed silently.

**WCAG SCs.** 2.4.7 Focus Visible (AA); 2.4.11 Focus Appearance (AA, new in 2.2).

---

### Pattern 5 · Color-blind safety — non-color encoding

**Discussion.** Pre-QA flagged this for 7 of 10 charts (PARTIAL on color-only series). The chart series tokens (`--chart-series-1` through `--chart-series-7`) are color-only differentiators. Today's mitigation is the `<ChartDataTable>` transcript (AT users get full data) — but a sighted color-blind user looking at a multi-series LineChart cannot distinguish series. Per WCAG 1.4.1, color cannot be the SOLE means of conveying information. The fix is structural: each series index gets a SECOND visual cue (dash pattern, marker shape, fill pattern) auto-derived from index, not author choice.

**Default in primitives.** `_shared/seriesEncoding.ts` exports three lookup tables keyed by series index `0..6`:
- `STROKE_DASHARRAY[i]` — `''`, `'4 2'`, `'2 2'`, `'6 3 2 3'`, `'8 2'`, `'1 2'`, `'10 4 2 4'` for line/area.
- `MARKER_SHAPE[i]` — `circle`, `square`, `triangle`, `diamond`, `cross`, `wye`, `star` for scatter and active dots.
- `PATTERN_FILL_ID[i]` — references SVG `<pattern>` defs (`url(#chart-pattern-1)`...) for bar/area/donut/treemap fills.

Charts opt-in by reading the table at series-index time. `<ChartFrame>` injects the SVG `<defs>` for pattern fills at the chart root so all kinds share one definition.

**Escape hatch.** `<ChartFrame seriesEncoding="color-only">` — explicit acknowledgement that the chart has only one series (Sparkline, single-series Bar, single-series Line) and color-blind concern doesn't apply. AT users still get the transcript. Charts with ≥2 series cannot pass this — the prop is `single | color-only-allowed | color-plus-shape (default) | color-plus-pattern`.

**WCAG SCs.** 1.4.1 Use of Color (A) — closes pre-QA HIGH-5 architecturally.

---

### Pattern 6 · Reduced-motion as primitives single source of truth

**Discussion.** `useReducedMotion` already exists in `_shared/useReducedMotion.ts`. Each chart calls it independently. Today this works but creates 10 independent hook calls per page mount. More important: the Round-2 deep audit on `/design-system` flagged a related failure (Finding 1 — PMR scope too narrow on the showcase page). For charts specifically, the rule is simpler: every chart's Recharts `isAnimationActive={!prefersReducedMotion}`. There's no business reason a chart should ever override this.

**Default in primitives.** `<ChartFrame>` calls `useReducedMotion()` once and exposes via context. Consumer charts read it via `useChartReducedMotion()` and pass directly to Recharts. Or — better — `<ChartFrame>` injects `data-reduced-motion={prefersReducedMotion}` on the container and global CSS targets `[data-reduced-motion="true"] svg *` for compositor-friendly transition suppression. Belt-and-braces.

**Escape hatch.** None. Charts cannot opt-out of reduced-motion — there is no legitimate use case. The escape hatch is at the `useReducedMotion()` hook level: SSR returns `false`, browsers without `matchMedia` return `false`. That's the only fallback contract.

**WCAG SCs.** 2.3.3 Animation from Interactions (AAA); aligns with WCAG 2.2.

---

### Pattern 7 · Screen-reader live regions on data refresh

**Discussion.** Not currently implemented. When a chart's payload changes (e.g. user toggles time range, AI agent re-emits with updated data), an SR user has no signal that the visual updated. They must re-navigate into the chart to discover the new data. WCAG 4.1.3 Status Messages (AA, 2.1+) addresses this exactly. The naive implementation (`role="status"` on the entire chart) is wrong because the chart has lots of internal content — every change would re-announce everything. The right pattern is a small live region adjacent to the chart that announces a one-line summary (`«Portfolio price chart updated: 1 year, 12 data points, latest $124,500.»`).

**Default in primitives.** `<ChartFrame>` renders an internal sibling `<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">` that contains a derived summary string. Summary is computed from `payload` (kind + meta.title + data length + latest data point). On `payload` change (React `useEffect` dep), summary re-renders → SR announces. Polite, not assertive — never interrupts.

**Escape hatch.** `<ChartFrame liveRegionVariant="polite|assertive|off">`. Default `polite`. `off` for charts that update every second (real-time streaming) — those need a different announcement strategy (debounced summaries, opt-in announce button). Default never assertive.

**WCAG SCs.** 4.1.3 Status Messages (AA).

---

### Pattern 8 · Color contrast for axis tick labels

**Discussion.** Pre-QA HIGH-1 (Treemap white-on-fill 3.99:1) and Round-2 audit criterion 1.h (light-mode chart axis labels at 3.82:1) both trace to the same root: the `--text-3` token sets the floor for axis tick contrast, and the floor is too low in light mode. Tokens were partially fixed in `b0857df` (Round-1 closure). But the structural lesson is that primitives shouldn't pick token freely — they should pick token by **measured contrast against the background luminance the chart is sitting on**. A primitive that picks `--text-2` on cream and `--text-3` on cocoa-board reads as «designed-for-context» rather than «one token everywhere».

**Default in primitives.** `_shared/buildChartTheme.ts` exposes `chartAxisLabelToken(themeMode: 'light' | 'dark'): CssVar`. Light mode → `var(--text-2)` (the cleaner-than-text-3 mid-tone). Dark mode → `var(--text-3)` (already 7:1 against `--bg`). All 10 charts read this through one helper. Token choice is automatic; manual override is gated.

**Escape hatch.** `<ChartFrame axisLabelTokenOverride={'--text-2'|'--text-3'|'--ink'}>` accepts a union of three known tokens. Cannot pass arbitrary CSS color — the primitive is the gatekeeper for «what's a valid axis-label color in Provedo». This closes the «designer types `#999` and ships it» class of failure.

**WCAG SCs.** 1.4.3 Contrast Minimum (AA); 1.4.11 Non-text Contrast (AA).

---

### Pattern 9 · Touch target hit-area expansion

**Discussion.** WCAG 2.5.5 (Target Size, AAA) wants 44×44 CSS px for interactive elements. WCAG 2.5.8 (Target Size Minimum, AA, new in 2.2) wants 24×24. Bar widths on a 320 px viewport with 12 bars are ~22 px wide. Donut sectors at small sizes are arc-shaped, not square. Hit-target failure for chart interactives (bars, sectors, scatter points, calendar event markers) is the most overlooked a11y gap because Recharts hides the geometry under SVG paths and the 24×24 floor doesn't naturally apply to SVG. The fix is invisible hit-area expansion via overlay `<rect>` siblings, sized to the WCAG floor and pointer-events transparent above them, opaque on the rect. Only relevant for charts whose datum is interactive (today: BarChart, DonutChart sectors via `onClick`, Calendar events).

**Default in primitives.** `<HitTargetOverlay datumGeometry={...} minSizePx={24}>` shared primitive that renders an invisible `<rect>` over the visible shape, sized to max(visualSize, 24). Pointer events live on the overlay; visual stays untouched. Charts opt-in per datum class (Bar, Sector, EventMarker). Primitive picks 24 px (AA floor) by default; iOS-targeted contexts can pass `minSizePx={44}`.

**Escape hatch.** Per-chart configurability via `<ChartFrame hitTargetMin={24|44}>`. Single number; no per-datum override (those live in chart-internal positioning). For charts with no interactive datum (Sparkline, Waterfall — read-only), the overlay is not rendered, no cost.

**WCAG SCs.** 2.5.5 Target Size (AAA); 2.5.8 Target Size Minimum (AA).

---

### Pattern 10 — bonus · Focus Not Obscured (WCAG 2.4.11+ / 2.4.12)

**Discussion.** When a keyboard-focused datum sits at the edge of a scroll container, sticky headers (the showcase has one), or the viewport — focus might be partially or fully obscured. WCAG 2.4.11 Focus Not Obscured (Minimum, AA, new in 2.2) is satisfied if focus is at least partially visible; 2.4.12 (Enhanced, AAA) requires it fully unobscured. Today, the chart container takes focus once and arrow-nav moves the *internal* active dot — but if the user has scrolled the chart so the active dot is below a sticky header, no scroll-into-view runs. This is a silent failure: focus IS visible per browser, just not per the user's viewport.

**Default in primitives.** `useChartKeyboardNav` calls `node.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' })` on every index change, scoped to the chart container, not the page. For sticky-header avoidance, the primitive reads `--sticky-header-offset` CSS variable (default 0, set by the app shell to its sticky-header height) and adjusts. This is one CSS variable on `:root`, transparent to consumers.

**Escape hatch.** `<ChartFrame focusScrollMode="container|datum|none">`. Default `container` (current behavior — focus the container, internal nav doesn't scroll). `datum` = scroll-into-view per arrow press (recommended for tall charts where active dot moves vertically). `none` = explicit opt-out.

**WCAG SCs.** 2.4.11 Focus Not Obscured (Minimum) (AA); 2.4.12 (AAA).

---

## 2. Five design directions × pros / cons / fit-for-Provedo

| # | Direction | Core contract | Pros | Cons | Verdict |
|---|---|---|---|---|---|
| 1 | **Maximalist** — primitives enforce ALL a11y, charts cannot bypass | `<ChartFrame>` renders everything; consumer chart hands geometry only | a11y is a structural property; CRITICAL-1/CRITICAL-2 cannot recur; QA gate becomes test-once-not-per-chart | Brittle for one-off needs (Sparkline standalone mode, Calendar custom traversal); creates fork-or-bypass pressure when novel chart kinds arrive | TOO RIGID — Provedo will need to add chart kinds we haven't anticipated, escape hatches must exist |
| 2 | **Minimalist** — primitives offer hooks; charts opt-in | Charts call `useReducedMotion`, `useChartKeyboardNav`, etc. by hand; primitives are advisory | Maximum flexibility; charts can innovate freely | This is the CURRENT ARCHITECTURE that produced CRITICAL-1/CRITICAL-2 — opt-in means opt-out by forgetting | REJECT — proven failure mode |
| 3 | **Layered (escapable defaults)** — primitives default ON, consumers can override per-prop | `<ChartFrame ariaLabel={override}>`, `<ChartFrame keyboardNav={false}>`, etc. — every default is a prop with a documented value | Best of both: failure-by-default impossible (must explicitly disable); flexibility preserved (named override props) | More API surface to learn; overrides require discipline in code review (an override prop in PR diff is a flag) | **RECOMMEND** — this is Provedo discipline: opinionated defaults, explicit escape |
| 4 | **Test-driven** — Vitest matchers shipped with primitives | `expect(<MyChart />).toBeAccessible()` runs synthetic axe-core + role/label/keyboard checks; CI gates merge | Catches regressions even after Direction 3 escapes; surfaces «accidentally accessible» wins; integrates with QA pipeline | Test coverage is downstream of the API design — can fail to catch failures the API allows; runtime cost on every test run; needs maintenance as WCAG evolves | COMPLEMENT to Direction 3 — not a substitute. Layered defaults + automated tests = belt + braces |
| 5 | **Audit-driven** — eslint plugin asserts required props on chart components | Lint rule: «`<LineChart>` must be rendered inside `<ChartFrame>`»; «no inline `outline:none`»; «no `tabIndex={0}` without focus-ring class» | Catches static-source failures before runtime; near-zero overhead per CI run; learnable by example | eslint cannot reason about runtime composition (e.g. `<ChartFrame>` wrapped in a forwardRef gets harder); rules drift from spec; high false-negative ceiling | COMPLEMENT to Direction 3 — adopt for the 3-4 most regression-prone rules (no inline outline:none, ChartFrame required) |

**Recommended stance for Provedo:** **Direction 3 (Layered) as primary, Direction 4 (Test-driven) as gating, Direction 5 (Audit-driven) for the highest-leverage static rules.** Reject 1 (rigid) and 2 (proven-broken).

The Layered direction maps cleanly to Provedo's stated voice (restraint with deliberate moments) — defaults are opinionated and well-named; escapes are visible in code and reviewable. Test-driven adds the recurrence gate. Audit-driven catches the «outline:none» class of failure cheaply at PR time.

---

## 3. Top-5 patterns that MUST live in primitives (ranked by leverage)

1. **Container `role`/`aria-label` derivation + focus ring + keyboard nav as a single `<ChartFrame>` primitive** (Patterns 1, 3, 4, 10). The CRITICAL fixes from pre-QA become structural; any new chart kind inherits all four. Highest leverage move in the entire layer.
2. **Color-blind series encoding tables** (Pattern 5). Closes pre-QA HIGH-5 architecturally; cannot be added per-chart later without a refactor; cheapest if shipped Day 1.
3. **`<ChartDataTable>` auto-generation with formatter pipeline** (Pattern 2). Already exists; primitives layer formalizes the contract and closes LOW-1/LOW-3 in one place.
4. **Reduced-motion + axis-label contrast as theme primitives** (Patterns 6, 8). Single source of truth for «what color/motion can charts use» — closes `--text-3` token-cliff regressions and makes future high-contrast / print themes additive, not migrative.
5. **Live region for payload updates** (Pattern 7). Currently absent everywhere; cheap to add at the primitive boundary; would otherwise be forgotten on every new chart.

---

## 4. Top-3 escape hatches consumers genuinely need

1. **`ariaLabel` override on `<ChartFrame>`** (Pattern 1). The agent's `meta.title` is sometimes wrong for AT context («Q4 returns» vs «Q4 returns by region, ascending»). Override is a one-line consumer concern; cannot live anywhere except the primitive.
2. **`keyboardNav={false | 'custom'}` on `<ChartFrame>`** (Pattern 3). Sparkline `standalone={false}` mode genuinely should NOT take focus (HIGH-4 pre-QA). Calendar may need a 2D traversal (day-of-month, week-of-year), not a linear arrow walk. Without this escape, those two chart kinds either lie about being accessible or fork.
3. **`seriesEncoding` modes** (Pattern 5). Single-series charts (Sparkline, single-line LineChart, single-bar BarChart) have nothing to differentiate by shape/dash — forcing pattern fills there is gratuitous and breaks the visual. The four-value enum (`single | color-only-allowed | color-plus-shape (default) | color-plus-pattern`) gives the consumer enough room without leaking style decisions.

---

## 5. Recommended design direction

**LAYERED (Direction 3)** as primary architecture, with **Direction 4 (Vitest matchers)** as the merge-gating discipline and **Direction 5 (eslint rules)** for the 3-4 highest-leverage static checks.

Why: Provedo's discipline is «opinionated defaults, explicit escape, never silent failure». Layered matches that exactly. Maximalist (Direction 1) creates a fork-or-bypass dynamic when novel charts arrive. Minimalist (Direction 2) is the current architecture that produced two CRITICAL fails. Tests + lints are necessary but not sufficient — they catch regressions but cannot replace good API design.

The smallest concrete move that proves this direction:

**Promote `<ChartFrame>` to a real primitive.** Today the «chart container div» pattern is duplicated across 10 files. One refactor — extract the container `<div>` + role + aria-label derivation + focus-ring class + tabIndex + `<ChartDataTable>` rendering into `_shared/ChartFrame.tsx` — closes pre-QA CRITICAL-1, eliminates MEDIUM-5, and lays the foundation for Patterns 3, 4, 7, 10 in the same primitive without refactoring consumer charts again.

After that, the remaining patterns layer onto `<ChartFrame>` additively. No second refactor needed.

---

## 6. WCAG 2.2 criteria mapped per primitive

| Primitive | WCAG SCs addressed | Level | Pre-QA / R2 finding closed |
|---|---|---|---|
| `<ChartFrame>` (container, role, label, focus, kbd-nav) | 1.1.1 / 2.1.1 / 2.1.2 / 2.4.7 / 2.4.11 (Focus Visible + Focus Appearance) / 2.4.11 (Focus Not Obscured) / 4.1.2 | A + AA | CRITICAL-1, CRITICAL-2, MEDIUM-5, R2 finding 1+2 |
| `<ChartDataTable>` | 1.1.1 / 1.3.1 / 4.1.2 | A | LOW-1, LOW-3 |
| `<FocusRing>` (focused-datum primitive) | 2.4.7 / 2.4.11 | AA | R1 active-dot focus gap, criterion 8.d |
| `seriesEncoding` tables (dasharray / shape / pattern) | 1.4.1 | A | HIGH-5 (color-only series), criteria 4.a / 8.e |
| `useReducedMotion` (centralized) | 2.3.3 | AAA | R2 finding 1 (PMR scope too narrow) |
| `chartAxisLabelToken` helper | 1.4.3 / 1.4.11 | AA | HIGH-1 (Treemap), criterion 1.h |
| Live region inside `<ChartFrame>` | 4.1.3 Status Messages | AA | (none today — preventative) |
| `<HitTargetOverlay>` | 2.5.5 / 2.5.8 | AA + AAA | (none flagged today — preventative for Bar / Donut sector / Calendar events) |

---

## 7. Hierarchy-via-depth — primitive shadow tier mapping

Round-2 finding 3 flagged 6 elevation tiers in one viewport. For the chart primitives layer, shadow usage should collapse to **3 tiers max**:

| Surface | Shadow token | Justification |
|---|---|---|
| `<ChartFrame>` resting state | `var(--shadow-soft)` | Charts sit in cards; cards already provide elevation. The chart itself is +0.5, not +1. |
| `<ChartFrame>` keyboard-focused / hovered state | `var(--shadow-card)` | Hover/focus lifts to «active» tier — same idiom as the rest of the system. |
| `<ChartFrame>` for «hero» chart on a page (e.g. portfolio overview chart) | `var(--shadow-lift)` | Reserved by `<ChartFrame variant="hero">`. Maximum one per page. |

Token `--shadow-primary-extrude` and `--shadow-input-inset` are NOT for charts — keeping them out of the chart primitives keeps the per-primitive elevation budget at 3 tiers. Closes Round-2 finding 3 from the chart-subsystem side.

---

## 8. Brainstorming record (per `superpowers:brainstorming`)

Five candidate primitives architectures considered, four rejected with reasoning above (Maximalist / Minimalist / Test-driven-only / Audit-driven-only). Layered direction held under fresh-eyes review as the only architecture that:

1. Makes the failure mode «cannot ship inaccessible chart» rather than «can ship inaccessible chart by forgetting».
2. Keeps escape hatches narrow and named (3 explicit escape patterns identified, not «consumer overrides whatever»).
3. Aligns with Provedo's design-system voice (opinionated, restrained, deliberate).
4. Is additive over existing `_shared/` primitives — `<ChartFrame>` extraction is a refactor, not a rewrite, and the 10 charts shrink in size as their boilerplate moves to the primitive.
5. Does not preclude Test-driven (Direction 4) or Audit-driven (Direction 5) layered on top — the three directions stack.

Single biggest risk to the layered direction: API surface creep on `<ChartFrame>`. Each escape hatch adds a prop. Mitigation: cap the prop count on `<ChartFrame>` at ~10 (currently the table sketches 7: `payload`, `ariaLabel?`, `transcriptVariant?`, `keyboardNav?`, `liveRegionVariant?`, `axisLabelTokenOverride?`, `hitTargetMin?`, `focusScrollMode?`, `seriesEncoding?`, `variant?`). If a 12th prop is needed, that's the trigger for splitting `<ChartFrame>` into `<ChartFrame>` (a11y core) + `<ChartShell>` (presentation) — but only at the trigger, not before. YAGNI applies.

---

## 9. Implementation handoff

This document is a brainstorm; not a kickoff. Right-Hand synthesis is the next step. Specific recommendations for the synthesizer:

1. **Adopt Layered (Direction 3) as the primitives-layer architecture.**
2. **Promote `<ChartFrame>` to a real primitive in the FE kickoff.** Extract container + role + label-derivation + focus-ring + tabIndex + `<ChartDataTable>` rendering. Closes pre-QA CRITICAL-1, MEDIUM-5 in one refactor. Foundation for Patterns 3, 4, 7, 10.
3. **Ship `seriesEncoding` tables on Day 1 of the primitives layer.** Cheapest if added before charts adopt; expensive to retrofit later.
4. **Add Vitest matcher `toBeAccessibleChart()` to the primitives package** that runs container-role / aria-label / focus-ring / kbd-nav presence checks. Run in CI per chart kind.
5. **Add eslint rule `provedo/no-inline-outline-none-on-charts`** + `provedo/chart-must-use-chart-frame`. Two rules cover ~90% of the regression surface.
6. **Cap `<ChartFrame>` prop count at 10. If 12 needed → split.**
7. **Reject Maximalist (Direction 1); reject Minimalist (Direction 2).** Document the rejection rationale in the FE kickoff so future contributors don't litigate it.

---

*Read-only audit. No code, no edits. Cited files: `packages/ui/src/charts/_shared/{a11y,useChartKeyboardNav,useReducedMotion,ChartDataTable,ChartError,ChartEmpty,ChartSkeleton}.{ts,tsx}`, `packages/ui/src/charts/{Line,Area,Bar,Donut,Sparkline,Calendar,Treemap,StackedBar,Waterfall,Candlestick}Chart.tsx`, `docs/reviews/2026-04-29-charts-pre-qa-a11y-review.md`, `docs/reviews/2026-04-29-r2-a11y-architect-deep.md`, `docs/reviews/2026-04-29-architect-chart-data-shape-adr.md`, `docs/design/CHARTS_SPEC.md`. No spend, no external comms, no predecessor references, no velocity metrics.*

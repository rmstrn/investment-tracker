# Memoro — In-context AI Disclaimer Pattern (SPEC)

**Status:** DRAFT spec — first-pass internal legal-advisor output. Design candidate authority: product-designer. Copy authority: content-lead. Engineering implementation: tech-lead + frontend-engineer.
**Version:** 0.1 (2026-04-23)
**Owner:** legal-advisor (internal SME, regulatory rationale + required placement rules).
**Cross-references:** `docs/product/02_POSITIONING.md` v3.1 Section «Footer disclaimer» + «In-context AI disclaimer LOCKED 2026-04-23 Q6»; `docs/DECISIONS.md` 2026-04-23 «Option 4 review synthesis: 7 PO decisions locked» Q6 entry; `docs/reviews/2026-04-23-legal-advisor-option4.md` §EU + §UK (verdict: in-context disclaimer required before EU/UK public launch).

---

## Purpose

Memoro occupies a Lane A regulatory posture: **information and education only, not investment advice**. The footer disclaimer on the landing page is the first layer of this positioning but is insufficient on its own for EU (MiFID II) and UK (FCA PERG 8 + Consumer Duty) markets, because the AI-output surfaces (Chat, Insights, Coach) are multiple clicks away from the landing page. European regulators treat consistent in-context disclaimers on the surface that actually delivers personalized analysis as a material defense factor. This spec defines where, when, and how the in-context disclaimer appears, and the regulatory rationale for each design constraint.

**This document is a SPEC, not a policy and not copy.** Final microcopy is content-lead's; final visual treatment is product-designer's; final implementation is tech-lead's. Legal-advisor owns the placement rules and the regulatory reasoning.

---

## 1. Scope — where the disclaimer must appear

The in-context AI disclaimer must be attached to every AI-generated output surface. Specifically:

### 1.1 Required surfaces (MUST)

| Surface | Why |
|---|---|
| **Chat** — every AI response message bubble | Direct AI-to-user analysis on actual portfolio data; highest regulatory scrutiny under EU MiFID II personal-recommendation test |
| **Insights feed** — each insight card | Proactive surfacing of events (dividends, drawdowns, concentration). EU UCPD + FCA Consumer Duty scrutinize consistency of "not advice" framing on pushed content |
| **Coach cards** — each pattern-read | Behavioral pattern observations on user's trade history. Closest to the "personal recommendation" perimeter under EU/UK readings (per Legal-advisor review 2026-04-23 §EU + §UK) |
| **Scenario tool responses** — when "What if ...?" simulations return | Quantitative projections are explicitly observational; disclaimer reinforces that interpretation |
| **Weekly digest emails (when implemented)** — every email | Communications channel outside the product interface requires its own disclaimer instance; landing footer does not reach email recipients |
| **Push notifications (when implemented, EU/UK markets)** — on the notification detail view | FCA has treated push-notification marketing of specific instruments as triggering of personal-recommendation scrutiny; CIS markets inherit the rule |

### 1.2 Not required (MUST NOT) — treat as noise

| Surface | Why not |
|---|---|
| Navigation chrome (tabs, menus, settings pages) | Not AI output; disclaimer inflation reduces signal-to-noise |
| Pure dashboard widgets showing user-entered or broker-sourced numeric data without AI summarization | Factual data display is not AI output in the Lane A sense |
| Account settings, billing, profile | Administrative surfaces; no AI opinion involved |
| Login, onboarding (first-sync screens) | No AI output yet; disclaimer premature |
| Educational static content (help center, term definitions) | Pre-authored content, not dynamic AI output |
| Landing page | Already covered by the footer disclaimer; in-context treatment would duplicate |

### 1.3 Special case — empty states

When an AI surface is empty (e.g. Coach with <30 days of history, no insights this week), the empty-state copy does not require the disclaimer if it only describes the empty state. If the empty-state copy explains *what the AI will do when data arrives*, the disclaimer should appear in a collapsed / tooltip form attached to that explanation.

---

## 2. Message — what it says

### 2.1 Core message (bilingual, per positioning lock)

**English:**
> **Information only — not investment advice.** Memoro analyzes your actual data; all decisions are yours.

**Russian:**
> **Только информация — не инвестиционный совет.** Memoro анализирует твои реальные данные; все решения — за тобой.

### 2.2 Jurisdiction-specific expansions (optional, where context permits)

The core message is the default. In specific surfaces where additional text can be tolerated (e.g. a dedicated "About this response" panel), the following jurisdictionally-grounded expansions may be appended. These are NOT required on every surface; they are a reserve option for surfaces with more UI real estate.

**EU/UK expanded form:**
> **Information only — not investment advice.** Memoro provides observations, calculations, and pattern descriptions based on your actual data. It is not a personal recommendation within the meaning of MiFID II / FCA rules. All investment decisions are yours.

**US expanded form:**
> **Information only — not investment advice.** Memoro is not a registered investment advisor. Observations above are educational and based on your actual data. All investment decisions are yours.

> **Rationale (legal-advisor):** EU/UK expansion adds the "personal recommendation" negation because that is the specific regulatory test those jurisdictions apply. US expansion uses the "registered investment advisor" framing because that is the publisher's-exclusion language the SEC evaluates. Content-lead may reduce further but should not alter the regulatory anchors without legal-advisor review.

### 2.3 What the message must NOT say

- Must NOT say or imply that Memoro's output is a recommendation, suggestion, or guidance to take action
- Must NOT say or imply suitability for the individual user's circumstances ("suitable for you" / "recommended for you" / "right for your portfolio" — all forbidden)
- Must NOT use hedging language that could be read as undermining the disclaimer itself ("this is not advice, but...")
- Must NOT be phrased as a liability shield in the user's face ("Memoro is not liable for..." — that is TOS territory, not in-context)
- Must NOT be longer than two short sentences in the default form (Q6 PO lock intent: minimize visual noise)

---

## 3. Visual format — design spec

### 3.1 Default pattern — icon + tooltip

PO-suggested pattern (Q6): **small informational icon attached to each AI output, with the disclaimer revealed on tap/hover tooltip.** This keeps visual noise low while preserving the disclaimer at the exact surface the regulator looks at.

**Visual primitives:**
- Icon: small "info" glyph (consistent with the product's icon system — product-designer owns the final shape)
- Position: attached to the output block (response bubble, card corner, email footer-line)
- Color: secondary / muted — does not compete with the output for attention, but discoverable
- Hit target: meets WCAG 2.2 AA minimum (24×24px tap target recommended)
- Cursor: pointer on desktop
- Screen-reader label: the full disclaimer text is in `aria-label` or equivalent so keyboard and screen-reader users receive the disclaimer without requiring hover

**Interaction:**
- **Desktop.** Hover reveals tooltip with the core message. Tooltip dismisses on mouse-leave with a short delay (~200ms) to avoid flicker.
- **Mobile.** Tap reveals a persistent tooltip or bottom-sheet with the core message. Tap outside dismisses. Avoid long-press; that gesture has platform-specific conflicts.
- **Keyboard.** Focus reveals the tooltip. Enter/Space activates. Escape dismisses.
- **Reduced-motion.** No animation on reveal; instant show/hide.

### 3.2 Progressive prominence — first N interactions

PO Q6 discussion floated the pattern: **first 3 interactions with each AI surface show the disclaimer pinned / visible; subsequent interactions show the icon only, with disclaimer accessible via tooltip.**

Rationale: a genuinely new user has not yet internalized the Lane A framing; pinning the disclaimer for the first few interactions establishes the context. After that, the user has learned the disclaimer's content; icon-only reduces noise and satisfies the regulatory "consistent disclosure" expectation without UI inflation.

**Counter-per-surface recommendation.** Track the pinned-count per user per surface (Chat / Insights / Coach), not globally. A user who has seen the disclaimer in Chat three times has not internalized the Coach surface's disclaimer context, because Coach output is substantively different and closer to the personal-recommendation perimeter under EU/UK readings.

**Default count = 3 per surface, tunable.** Content-lead + user-researcher should test the right number in alpha; 3 is a starting point reflecting typical onboarding habituation curves, not a legal minimum. Legal-advisor requires the disclaimer to be accessible (icon) indefinitely — never removed from a surface after N interactions; only the pinned/visible treatment changes.

### 3.3 Alternative formats (reserve)

If the icon+tooltip pattern fails user-testing or fails a Consumer-Duty audit challenge in the UK, two reserve formats are regulatory-adequate:

**Reserve A — inline micro-text.** A single line of muted text directly below each AI output: "Information only — not investment advice." No icon, no tooltip. Most regulatory-conservative. Noisier UI.

**Reserve B — first-interaction modal + persistent footer-row disclaimer in the AI surface's chrome.** On first visit to the Chat / Insights / Coach surface, a dismissable modal states the disclaimer explicitly. After dismissal, a persistent one-line disclaimer lives in the surface chrome (e.g. below the Chat input, in the Insights feed header). Less noisy per card but higher cognitive load on entry.

**Not a reserve — pure footer-only.** This is the current (pre-in-context) state and is insufficient for EU/UK markets. Do not fall back to this.

### 3.4 Placement grammar — what goes where

| Surface | Disclaimer attachment point |
|---|---|
| Chat — AI response bubble | Icon at bottom-right of bubble (after citations, before timestamp) |
| Chat — tool-call response (chart, table) | Icon in the tool-result card header or adjacent to chart title |
| Insights feed — each card | Icon in card footer, adjacent to the card's secondary actions |
| Coach — pattern-read card | Icon in card header, adjacent to the "pattern" label. Coach cards, being highest regulatory risk, additionally include the expanded EU/UK form as default in EU/UK geos (see §4) |
| Scenario tool — result panel | Icon adjacent to the primary result number |
| Weekly digest email | Footer line of email, always visible (email has no tooltip affordance) |
| Push notification detail view | Disclaimer line at bottom of the detail sheet |

---

## 4. Geographic variation — per-market rendering

The disclaimer text and treatment vary by the user's detected geography (or explicit locale selection) to align with per-jurisdiction regulatory language.

| Geography | Default core message | Expanded form used? | Notes |
|---|---|---|---|
| US | English core | US expanded on Coach + Scenario surfaces | Footer disclaimer + Lane A framing aligns with publisher's-exclusion defense |
| EU (all member states) | English core (until language expansion post-launch) | **EU/UK expanded on Coach by default** | Coach surface carries the highest EU MiFID II risk per Legal-advisor review 2026-04-23 §EU |
| UK | English core | **EU/UK expanded on Coach by default + on Insights when the insight references a specific instrument** | FCA PERG 8 broader "merits" test makes Insights-specific-ticker cases borderline (see Legal-advisor review 2026-04-23 §UK) |
| LATAM (Spanish / Portuguese) | English core day-1; localized parallel when content-lead ships the respective language packs | US expanded form used as the default expanded variant (closest regulatory framing absent local jurisdictional advice) | Post-alpha localization |
| APAC (English-available markets) | English core | US expanded form | Per-market legal review needed before local-language launch |
| Crypto-native (global) | English core | US expanded form | Crypto-native users expect this framing; treat as US-style for disclaimer purposes |
| RU-localized interfaces (CIS-non-RU only) | Russian core | Russian does not currently carry an expanded form — legal-advisor will author if post-launch RU-diaspora market entry is approved | Russia (RF) out of launch scope per `DECISIONS.md` Q7 2026-04-23. This row applies to Kazakhstan, Armenia, Belarus, etc. users choosing RU language |

> `[ATTORNEY REVIEW]` — Per-jurisdiction rendering depends on geography detection reliability (IP-derived region + user-set locale). Counsel to validate that Memoro's geography-detection logic is defensible for regulatory purposes — a user in Germany who sets their locale to en-US should still receive the EU expanded form when their IP resolves to DE, unless they explicitly override. This logic belongs in product-designer + tech-lead's scope; legal-advisor validates the rendering rules.

---

## 5. Rationale per jurisdiction — why each rule exists

### 5.1 US (SEC + state)

- **Footer disclaimer + landing Lane A framing + consistent in-context icon** → publisher's-exclusion defense (Lowe v. SEC, 472 U.S. 181) is reinforced by the "impersonal + bona fide publication" test. Consistent disclosure is evidence of the bona fide publication frame.
- **US expanded form uses "registered investment advisor" phrase** → matches the exact SEC vocabulary, lowers parsing friction in an enforcement review.

### 5.2 EU (MiFID II)

- **In-context disclaimer on Coach + Insights** → MiFID II Article 4(1)(4) + Commission Delegated Regulation (EU) 2017/565 Article 9 personal-recommendation test. Consistent "not personal recommendation" framing at the output level rebuts the "presented as suitable for that person" prong.
- **EU expanded form uses "personal recommendation" phrase** → matches the regulator's own vocabulary (ESMA Q&A on personal recommendation).
- **BaFin (Germany) strictness** → Legal-advisor review flagged BaFin's historically narrow interpretation of "investment information". Disclaimer on Coach is the primary mitigation for DE launch.

### 5.3 UK (FCA + Consumer Duty)

- **UK additionally requires disclaimer on Insights with specific tickers** → FCA PERG 8.28.1 treats comparison of specific investments as regulated advice in some contexts. Per-card disclaimer reduces the interpretive risk.
- **Consumer Duty (PS22/9)** → disclosure consistency is an explicit Consumer Duty expectation on "consumer understanding". Landing-only disclosure likely fails Consumer Duty's reasonableness standard; in-context treatment satisfies it.

### 5.4 LATAM / APAC / crypto-native

- No single regulator-specific language requirement at launch. US expanded form is the safest default while licensed counsel per target market has not yet scoped specific language.

### 5.5 Russia (out of scope)

- Russia not launched per `DECISIONS.md` Q7 2026-04-23. If re-scoped, 39-ФЗ + 152-ФЗ will require distinct treatment (including localization-of-data concerns).

---

## 6. Accessibility + performance

**Accessibility (WCAG 2.2 AA minimum):**
- Icon must have a non-decorative `aria-label` containing the disclaimer text so screen-reader users receive the disclaimer without needing to trigger the tooltip.
- Tooltip must be keyboard-operable (focusable, Enter/Space to activate, Escape to dismiss).
- Color contrast of the icon against surface meets 3:1 (non-text UI component).
- Do not rely on color alone to indicate the disclaimer's presence.
- Respect `prefers-reduced-motion`.

**Performance:**
- No per-card network fetch for disclaimer text. Disclaimer copy is bundled with the locale pack.
- Tooltip rendering must not block AI response rendering. AI output loads first; icon/tooltip can hydrate after.

---

## 7. Analytics + audit

- **Count pinned impressions per user per surface.** Needed for the progressive-prominence pattern (§3.2).
- **Do not log disclaimer tooltip opens as a product event tied to user identity.** The disclaimer's purpose is regulatory coverage; tracking individual interaction with a regulatory disclosure risks adverse inference ("users did not read the disclaimer") in enforcement review. A raw aggregate count is acceptable for design calibration; per-user trail is not.
- **Version the disclaimer copy.** When copy changes (e.g. after content-lead refinement), the version should be logged in a release note and retained in `docs/legal/` git history.

> `[ATTORNEY REVIEW]` — The analytics rule in this section is a legal-advisor judgment, not a statutory requirement. Counsel may take a different view. Escalate to privacy counsel during pre-launch DPIA.

---

## 8. Open questions for design phase

1. Icon glyph choice (info / shield / document) — product-designer owns.
2. Exact animation timings — product-designer owns.
3. Reduced-motion alternative — product-designer owns.
4. Mobile bottom-sheet vs persistent tooltip — product-designer owns.
5. Copy refinements within the semantic envelope set in §2 — content-lead owns.
6. Progressive-prominence count (default 3, tunable) — user-researcher validates in alpha.
7. Email disclaimer line styling — content-lead + product-designer jointly.
8. Push-notification disclaimer surface (detail view vs notification body itself) — product-designer + tech-lead on platform constraints.

---

## 9. Cross-references

- Copy pattern aligns with content-lead's AI microcopy spec (TBD in `docs/content/`).
- Visual treatment aligns with product-designer's in-context AI surface spec (TBD in `docs/design/`).
- Engineering implementation aligns with tech-lead's AI output middleware (where the disclaimer-attach logic lives server-side; client only renders).
- Regulatory sources tracked in `docs/reviews/2026-04-23-legal-advisor-option4.md` appendix.

---

## References

- Lowe v. SEC, 472 U.S. 181 (1985): https://supreme.justia.com/cases/federal/us/472/181/
- SEC Release IA-1092 (1987): https://www.sec.gov/rules/interp/ia-1092.pdf
- Directive 2014/65/EU (MiFID II) Art. 4(1)(4): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014L0065-20240328
- Commission Delegated Regulation (EU) 2017/565 Art. 9: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32017R0565
- FCA PERG 8: https://www.handbook.fca.org.uk/handbook/PERG/8/
- FCA Consumer Duty PS22/9: https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

All URLs accessed 2026-04-23.

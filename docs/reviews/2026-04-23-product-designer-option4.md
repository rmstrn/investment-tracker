# Product-designer independent review — Option 4 Second Brain

**Specialist:** product-designer
**Date:** 2026-04-23
**Seen other reviews:** NO (isolated context per CONSTRAINTS Rule 3)
**Scope:** UX + surface architecture + design-system fit for «Second Brain for Your Portfolio»
**Method:** read `docs/product/02_POSITIONING.md` v2, `docs/04_DESIGN_BRIEF.md` v1.1, `docs/product/STRATEGIC_OPTIONS_v1.md` §Option 4, `docs/CC_KICKOFF_option4_feasibility.md`, `docs/content/landing.md`, `docs/product/01_DISCOVERY.md` v2 §1-4; inspected current shipped surfaces at `apps/web/src/app/(app)/` (dashboard, chat, insights, positions, accounts).

---

## Verdict

**WARN** — conditional support.

The metaphor is coherent on paper and survives the 3-surface test IF (and only if) three design questions are answered before lock hardens:

1. **Which of the three surfaces owns the home screen?** Positioning says «all three primary (progressive disclosure)». That is a positioning statement, not a design pattern. A home screen has exactly one primary surface. Without picking one, the product will either A/B itself in real time or ship as a tabbed index that feels like three bundled apps — which is the exact commodity-drift failure mode named in §«Risk of focus-loss».
2. **What is the visual identity of «second brain»?** The metaphor has well-known aesthetic gravity (neural-network glyphs, synapse glows, AI sparkle) that directly conflicts with Design Brief principle #1 «Calm over busy» and the Magician-Sage-Everyman archetype. If we are not explicit about what second-brain-looks-like-for-us, default taste will drift toward AI-sparkle fintech, which is on-brand for nobody we want to resemble.
3. **How does the coach surface survive its own empty state for 30 days?** The hero verb «remembers» is a load-bearing promise. For the first month, the brain has nothing to remember. The mitigation must be designed, not described.

I do not recommend reverting to Oracle over this. I do recommend that PO sees these three questions surfaced explicitly before locking hardens around a metaphor whose design-execution risk is materially higher than the copy-lock risk implied in v2 positioning.

---

## 3-surface coherence analysis

The positioning promises one metaphor holding three surfaces without fragmenting. Let me pressure-test that by surface.

### Chat (= conversation with your second brain)

- **Already shipped** (`apps/web/src/app/(app)/chat/`). This is the surface least threatened by the metaphor swap — «talk to your second brain» is functionally identical to «talk to your portfolio», just with memory framing.
- **Risk:** Design Brief §14.1 describes chat as message column + streaming + ToolUseCard + TrustRow. Second-brain framing invites a design instinct to add «memory cues» (brain icon near AI bubble, «I remember you asked…» phrasing baked into UI chrome). Every such cue is additive visual noise. Chat in v1.1 is already calm; Second Brain should not add decoration to prove the metaphor.
- **Mitigation:** the metaphor should live in copy and empty-state suggested prompts («Ask what I remember about your Apple trades»), NOT in persistent chrome (no brain icons, no «memory indicator» bars).

### Insights Feed (= what the brain surfaces proactively)

- **Already shipped** (Slice 6a, PR #64). Currently a list + filter + local dismiss on `(app)/insights`.
- **Risk:** the feed is visually closest to a standard «notifications-center + cards» pattern. Second-brain framing needs to earn differentiation over notification fatigue (see §«Surface risks»). The word «proactive» is design code for «push-driven», and push fatigue is the #1 retention killer for AI-notice products (`improve-retention` skill B=MAP: Ability drops when Trigger frequency exceeds user threshold).
- **Mitigation path:** reframe the feed as «weekly digest + on-demand dive» rather than continuous-stream. Feed IS the digest (read at user's pace), not a push-log. This aligns with content-lead's proposed «A few minutes a week» revision in §3 of landing.md.

### Coach (= what the brain notices about your behavior)

- **Not shipped.** New vertical per `CC_KICKOFF_option4_feasibility.md`. Has the 30-day cold-start that positioning acknowledges as inherited risk.
- **Risk:** coach is structurally the most dangerous surface to design under Second Brain metaphor. If it lives as a tab, it duplicates the insights feed pattern (both are «cards of things the brain noticed»). If it lives inline in chat, it competes with user queries. If it lives as a weekly surface, it needs a strong reason to exist as a separate page vs. a filtered view of insights feed.
- **Key design question unresolved in positioning:** is coach a destination or a surfacing pattern? Positioning treats it as a surface; tech-lead kickoff asks «is this a new page, a new insight-type inside Slice 6a chassis, or a weekly email?» That question is the design decision, not a technical decision, and nobody has answered it yet.

### Coherence score

Three surfaces under one metaphor: **coherent on paper, fragile in execution.** The metaphor does NOT tell me what the home screen looks like. «All three primary» is a copywriting posture, not an information architecture. The coherence risk is not «do users get the metaphor» — it's «does the product get the metaphor», meaning does the design produce one home that narrates «one brain», or three tabs that narrate «three features bundled».

---

## Design system compatibility

### Tokens

Current Design Brief v1.1 tokens are metaphor-neutral. Color, spacing, radius, motion, typography all survive the metaphor swap without edit. No token change is required by Second Brain positioning per se. This is a point in favor of Option 4 — the system does not have to rebuild.

### Principles

Principle #1 «Calm over busy» is the principle under most pressure. Second-brain vocabulary («memory», «remembers», «notices», «proactive») carries aesthetic implications that the principle explicitly rejects:

- **Neural-network visual trope** — glowing synapse lines, animated node constellations, AI-sparkle gradients. Every second-brain product in adjacent markets (productivity-AI) defaults to this. Using any of it would break principle #1.
- **«Memory indicator» chrome** — timelines, progress bars showing «brain is learning», animated memory-accumulation graphs. These are visual-metaphor crutches that compensate for weak copy. Our copy is strong enough (per content-lead draft §3) that chrome is not needed.
- **AI-sparkle iconography** — sparkles, stars, «AI» badges, gradient halos around AI-generated content. Design Brief §9 specifies Lucide for web at stroke-width 1.5. Lucide has `brain`, `brain-cog`, `brain-circuit` icons; all three are visually ornate at stroke 1.5 and fight the rest of the icon set's restraint.

**Net:** Second-brain positioning is compatible with the token system but puts compound pressure on principle #1. The design-execution discipline needed to keep the product visually calm under memory-metaphor copy is significant and undocumented as of v2 positioning.

### Archetype

v2 positioning upgraded archetype from v1 «Magician + Everyman» to «Magician + Sage primary, Everyman modifier». Sage emphasis is the right move for Second Brain — Sage is knowledge-worker-coded (Notion/Obsidian/Linear intonation, per brand-strategist's read). This is a net-positive archetype shift and DOES align with principle #1 «calm over busy». Sage is calm. Magician is NOT calm — Magician is «wow moment» surprise. Design must discipline Magician's bias toward decoration; Sage carries the restraint mandate.

### Voice surfaces (from Design Brief §2.2 tone table)

| Surface | v1.1 tone | Second Brain voice compatibility |
|---|---|---|
| Dashboard | Neutral, factual, tight | Compatible — memory metaphor stays out of numbers |
| AI chat | Warm, curious, allowed to hedge | Compatible — «I remember…» phrasing fits |
| Insights | Proactive, specific, actionable | **Tension** — «actionable» bumps against Lane A; needs rework to «proactive, specific, observational» |
| Onboarding | Encouraging, never patronizing | Compatible — 3-stage promise fits |
| Errors | Calm, specific, with next step | Compatible |
| Paywall | Honest about value, never guilt-trip | Compatible |

**Action for Design Brief v1.2:** update §2.2 Insights row from «actionable» to «observational» — small but carries the Lane A positive-trust-signal discipline into the design system.

---

## Visual direction the metaphor suggests

What does «Second Brain» imply aesthetically? Three honest possible directions, only one of them on-brand.

### Direction A — AI-sparkle neural-network (OFF-BRAND, should be banned)

Glowing synapse lines, neural-node constellations, gradient halos on AI output, brain-icon lockups. This is the default for 2025-2026 AI-consumer-app design. It is the opposite of principle #1 «calm over busy». This is what happens if the design is left to default taste under a brain-metaphor brief. **Explicitly forbid in design system.**

### Direction B — Editorial knowledge-work (CLOSEST TO ON-BRAND, recommended)

Notion/Obsidian/Linear intonation as positioning already names. Calm typographic hierarchy, generous whitespace, information density without visual noise, Inter + Geist Mono already locked, restrained use of violet-700 accent. The «brain» is implied by how the product behaves (remembers, cross-references, cites sources), not by how it looks. Visual restraint is the signal.

This is the only direction compatible with both principle #1 and the Magician-Sage-Everyman archetype.

### Direction C — Library / archival (on-brand, narrower)

Serif typography undertones, library-card-catalog metaphors, citation-forward design (sources treated as first-class). More Sage-heavy than direction B. Could work but narrows from Magician and may feel academic in a way that ICP B (AI-native newcomer 22-32) finds distant.

### Recommendation

Design system commits to Direction B (editorial knowledge-work). No visual metaphor for «brain» in chrome — the brain is the product's behavior, not its surface. This should be written into Design Brief v1.2 §1 as an explicit anti-pattern list:

- NO brain icons in persistent UI chrome
- NO neural-network visualizations
- NO AI-sparkle badges on AI output
- NO «memory indicator» progress bars
- NO synapse / node / network / particle effects
- YES restrained typography, whitespace, tabular numbers, source citation as first-class

---

## Surface-level risks

| Surface | Risk | Severity | Mitigation |
|---|---|---|---|
| Chat | Memory-metaphor tempts persistent chrome («memory count», brain icon next to bubbles) | Medium | Ban chrome; let copy carry the metaphor (empty-state suggested prompts) |
| Insights feed | Confused with notifications-center; push-fatigue risk if «proactive» = push-driven | High | Reframe feed as weekly digest (read at pace), not notification stream. Align with content-lead §3 «a few minutes a week» revision. Notification count badge stays modest (slate-700 dot default, violet-700 only high-priority) |
| Coach (new) | Tab-duplication with insights feed (both = cards-of-things-brain-noticed). No answer yet for destination-vs-surfacing-pattern question | **Critical** | PO-level design decision required BEFORE tech-lead coach ADR lands. See «Alternative architectures» below |
| Coach empty state | 30-day cold-start. Hero promises «remembers» but first month is empty. Brand-damage risk if surface shows «nothing yet» | **Critical** | Design spec for 3-stage disclosure (minute 1 / day 1 / day 30) must ship as surface spec, not just onboarding copy. Empty state must narrate «brain is learning from your trades» with specific day-count and preview of what's coming, not passive «no patterns yet» |
| Dashboard | «Insight of the day» card already on dashboard (§11.1). Second-brain framing risks pulling Coach preview onto dashboard too, making dashboard the «3-surface summary page» and losing its own role | Medium | Lock dashboard as dashboard (hero metric + chart + positions table), NOT as 3-surface summary. One surface hook (Insight of the day) is enough |
| Paywall | Freemium tier structure is feature-based (accounts / messages / insights), but Second Brain framing implies memory-based. Mismatch if Free tier shows «your brain can only remember 90 days» — which IS what tiering does (Free = 90-day history) but reads harsh | Low-Medium | Rename tier-gate copy to match metaphor. Current Free = «90-day history»; Second-Brain-voice = «your brain remembers 90 days; Plus remembers unlimited» — honest, not punitive |
| Onboarding | 3-stage promise (minute 1 / day 1 / day 30) is progressive but the middle stage (day 1, first insight drop) relies on insights-generation cadence hitting within 24h of first sync. If cadence misses, promise breaks | High | Design must coordinate with tech-lead: first-insight SLA is a design contract, not a worker scheduling detail. Day 1 promise = insight delivered within 24h of first sync, OR 3-stage promise changes |
| Notifications center (BellDropdown §10.3) | Second-brain framing adds pressure to notify more (more things for «brain to notice»). Violates not-goal «push-notification maximization» (§1) | Medium | Keep BellDropdown notification pressure flat. Second-brain does NOT mean more notifications; it means smarter insight curation inside the existing (weekly) cadence |
| iOS (post-alpha) | Brain-metaphor + SF Symbols + HIG default instincts may produce different visual output than web | Medium | Explicit iOS spec must mirror Direction B anti-patterns list. SF Symbols `brain` / `brain.head.profile` banned in persistent chrome for same reason as Lucide `brain` banned on web |

---

## Competitor UX pattern comparison

| Competitor | Home layout | Primary surface | Second Brain fit / our read |
|---|---|---|---|
| **Getquin** | Tabs-based dashboard + AI side-panel | Aggregator-first | Their AI is layered ON dashboard. Our Second Brain positions brain-first; home cannot be their dashboard + AI layer, or we collapse back to «AI + tracker» commodity (which §«Risk of focus-loss» names explicitly) |
| **PortfolioPilot** | Dashboard-first with inline AI assistant + «advice» CTAs | Dashboard | Advisor-framed. Our Second Brain is Lane A by construction; home screen does NOT carry «recommended action» CTAs. Clean differentiation |
| **Snowball** | Tabs-based, dividend-centric dashboard | Dividend analytics | Different axis entirely. No overlap with Second Brain home pattern |
| **Origin** | Chat-first with cards scaffold | Chat | **Closest structural analog to our likely Second Brain home.** Origin is multi-topic (invest + budget + wellness); we are investing-pure. But structurally, chat-first with surface-cards-scaffold IS the pattern Second Brain wants |
| **Mezzi** | Dashboard + advice cards | Dashboard + advice | Advisor-framed. Similar rejection as PortfolioPilot |
| **Wealthfolio (OSS)** | Desktop-app-style tabs | Tracker | Privacy-first, no AI-native home. Not a UX reference |
| **Notion / Obsidian (cross-category)** | Workspace-with-sidebar or graph view | Knowledge objects | Archetype reference for Direction B (editorial knowledge-work). Not a home-layout reference (they are workspace apps, we are a tracker) |

### What UX pattern does Second Brain imply?

None of the direct competitors sit where Second Brain wants to sit. The closest structural analog is **Origin (chat-first with surface cards)**, but Origin is multi-topic and SEC-advisor-framed, so their specific layout is not directly copyable.

The pattern Second Brain needs to create: **chat as the through-line, with insights and coach as structured surfacings reachable from chat context.** This is neither the Getquin pattern (dashboard with AI layered) nor the Notion pattern (workspace with AI embedded). It is closer to **Linear's approach** — one primary surface (in Linear's case, the issue list), with AI-generated insights woven into that primary surface rather than siloed to their own tabs.

**If we adopt Linear's pattern for our domain:** primary surface is chat (the conversation with the brain); insights and coach appear as **in-conversation surfacings** (cards, pills, digests that resolve inside chat context) as well as on dedicated pages for users who want to browse them. The dedicated pages exist for archive/browse, not as daily entry points.

This is novel-in-fintech. Nobody in the 34-competitor scan works this way. Which is exactly the territory positioning claims.

---

## Mobile / iOS readiness

**Status:** post-alpha per Design Brief §1, but decisions made now propagate.

### Metaphor translation

«Second Brain» translates to iOS SwiftUI semantically without issue. The three-surface model (chat / insights / coach) maps naturally to three iOS tabs OR to one primary chat screen with sheets/navigation links to insights and coach. Which pattern we pick depends entirely on the home-screen decision flagged in «3-surface coherence analysis».

### HIG tensions

1. **Tab-bar pressure.** iOS HIG favors tab-bar navigation for multi-surface apps. If we ship 3-5 tabs (Dashboard / Chat / Insights / Coach / Settings or similar), the iOS experience defaults to «three siloed things» — the exact commodity-drift failure §«Risk of focus-loss» names. This is harder to fight on iOS than on web (web can default to single-page chat-primary; iOS tab-bar pulls toward fragmentation).
2. **SF Symbols brain icons.** `brain`, `brain.head.profile`, `brain.filled.head.profile` exist. Same ban as web Lucide `brain` — not in persistent chrome. Metaphor lives in behavior, not in icons.
3. **Liquid Glass (iOS 26) temptation.** ECC skill `liquid-glass-design` covers iOS 26 style. Second-brain metaphor + liquid glass = visually-heavy AI-sparkle trap. Explicit design decision: **Liquid Glass is OFF for the brain-metaphor app** unless used minimally on chrome (tab-bar blur, nav background only). No glass cards for AI content. Principle #1 rules.
4. **Notifications.** iOS push-notification primitives are more aggressive than web (lock screen, banners, widgets). Second-brain insight cadence MUST be weekly default on iOS; daily/real-time only on user opt-in. Design Brief §16 notification defaults carry over cleanly but need tier-specific iOS enforcement (Free = 1 weekly push; Plus = 1 daily max; Pro = user-configured up to 3/day).

### iOS-specific open design questions

1. Home pattern — tab-bar with Dashboard/Chat/Insights/Coach (4 tabs) vs chat-as-primary with Dashboard/Insights/Coach as secondary navigation? This is the same question as web but answered differently (web can hide it more easily; iOS forces the pick).
2. Coach as tab or as weekly-digest sheet triggered from chat? Leaning weekly-digest sheet — it honors the cadence (weekly, not daily) AND avoids tab-bar dilution.

**Recommendation:** iOS ADR deferred to post-alpha but home-pattern decision made now (web + iOS) so the product has one architecture, not two.

---

## Accessibility angle (WCAG 2.2 AA)

### What metaphor changes

Second-brain framing is a pure copy/conceptual overlay; it does not add or remove structural accessibility concerns beyond what Design Brief §12 already covers.

### Specific checks per surface

1. **Chat streaming** — §12.3 already specifies `aria-live="polite"` for streaming. Second-brain «typing/thinking» indicator must stay text-only announceable; do NOT add decorative «brain pulse» animation as the only liveness indicator.
2. **Insights cards** — each card needs clear heading level (§12), source attribution announced by screen reader, dismiss button with proper `aria-label` («Dismiss insight: [headline]»). Already in Design Brief §10.3 InsightCard spec; holds.
3. **Coach** — new surface. Pattern-read narratives must use semantic HTML (article/section/h2/h3), not just divs with styled text. Observational narrative MUST NOT rely on color to signal «this is a pattern notice» — use labeled heading («Pattern noticed: 2026-04-15»).
4. **Reduced motion** — «brain thinking» animations, count-up memory counters, decorative transitions all MUST respect `prefers-reduced-motion`. Already in §12.4.
5. **Screen reader narrative** — «Second Brain» as product name is fine; «Your brain noticed X» as card framing CAN feel awkward when screen reader reads «Your brain noticed: Apple is 14% of your portfolio». Observation: content-lead draft §3 bullet 2 uses «Surfaces dividends, drawdowns and concentration shifts before you notice» — which reads cleanly on screen readers. Card headlines inside the product should prefer «Noticed» / «Surfaced» as verb headers rather than «Your brain noticed…» because the latter creates identity-of-the-thing-talking-to-you which screen readers amplify awkwardly.
6. **Brain icon (IF used against our ban)** — any icon we do use needs `aria-label="Second Brain"` or equivalent; but since Direction B bans persistent brain chrome, this concern is moot in practice.

### Net

Metaphor does not create NEW accessibility risk. It creates a content-voice risk (personification in card headlines) that content-lead can mitigate with verb-led framing rather than identity-led framing. Copy audit of every AI-facing surface against «verb-led, not identity-led» is a §16-level discipline that should land in Design Brief v1.2.

---

## Alternative UX architectures

If the 3-surface coherence question cannot be resolved cleanly under Second Brain framing, three alternative architectures are worth named consideration.

### Alternative 1 — Chat-primary with insights/coach as contextual panels

**Pattern:** one home = chat. Insights and coach live as (a) dedicated index pages for browse/archive AND (b) contextual surfaces inside chat (cards appear inline when conversation hits relevant territory; weekly digest sheet triggered from chat). Dashboard is a secondary route, not home.

**Rationale:** aligns with Linear's one-surface + woven-AI pattern. Honors «chat = conversation with second brain» as the entry point. Makes the three surfaces feel like «one brain expressing differently», not «three tabs».

**Cost:** requires home-screen redesign (current `(app)/dashboard` is home). Existing dashboard surface demotes to secondary. This is a Slice-sized design + frontend change. Slice 6a insights page survives as archive/browse view.

**Best fit for:** Second Brain metaphor + ICP A productivity-native users. Worst risk: ICP B (AI-native newcomers) may expect dashboard-at-login; chat-at-login is more demanding of user initiation.

### Alternative 2 — Feed-primary (insights home) with chat as quick-action

**Pattern:** home = insights feed. Chat is reachable as prominent CTA (top-right «Ask your brain anything») and as in-feed card action («Explore in chat»). Coach surfaces are a filter-tab inside the feed (feed shows: all / insights / patterns / dividends).

**Rationale:** closest to what's actually shipped (Slice 6a exists; chat exists). Lowest engineering churn. Maps to Analyst voice more than Second Brain — insights-first is Analyst's signature.

**Cost:** under Second Brain metaphor, feed-primary READS as «brain is mostly a notification stream» which demotes the chat-as-primary-conversation promise. Compatible but weaker metaphor fidelity.

**Best fit for:** Option 2 Analyst, not Option 4 Second Brain. Named here because if Second-Brain metaphor-execution falters, this is the graceful partial-retreat that still keeps insights work.

### Alternative 3 — Unified «Story of your portfolio» view (SINGLE timeline home)

**Pattern:** home = one chronological timeline mixing chat-turns, insights, coach pattern-reads, transactions. No separate tabs for insights/coach. Chat input lives at top. Browsing the timeline IS browsing the brain's memory.

**Rationale:** metaphor-maximalist. The brain has ONE memory; the home visualizes it as one timeline. Insights and coach become entry-types on the timeline, not separate surfaces. Strongest brand distinctiveness.

**Cost:** highest engineering cost (new timeline component, new ordering logic, new interaction patterns). Also highest interaction-design risk — timelines-of-AI-content don't have good prior art; this is novel UX. Discovery risk that users can't scan / filter efficiently.

**Best fit for:** breakout-variance play. Matches PO's stated appetite («highest-variance option with unified narrative» per Q2 in decision aid). Highest brand distinctiveness + highest execution risk.

### Recommendation among alternatives

**Alternative 1 (chat-primary + contextual panels) is the soundest architecture for Second Brain metaphor.** It delivers the «one brain, three manifestations» narrative without tab-fragmentation. It survives the iOS tab-bar pressure (iOS can mirror with chat-tab primary, insights/coach as secondary tabs with less bar weight). It honors Design Brief §1 principles. It demands a real dashboard-demotion decision from PO, which is the price of metaphor integrity.

**Alternative 3 (unified timeline) is higher upside** but high execution risk and no competitor prior art to learn from. If PO wants breakout play, it's on the table. Design would need a design-sprint week (per `product-innovation:design-sprint`) before committing.

**Alternative 2 is named as graceful fallback** if Alternative 1 proves infeasible, not as a first choice under Second Brain.

---

## Recommendation

1. **PO sees three questions flagged before Option 4 hardens:**
   - Home screen pick (Alternative 1 recommended)
   - Visual direction commitment (Direction B editorial knowledge-work; ban list explicit in Design Brief v1.2)
   - Coach 30-day empty-state spec (designed, not described)
2. **If these three answers land cleanly, Option 4 is coherent and I support it.**
3. **If any of the three stall, the Oracle fallback named in v1.4 positioning remains valid** — Oracle preserves the locked hero, ships with chat-primary home (which is Alternative 1 under Second Brain naming), and avoids the coach 30-day cold-start.
4. **Design-system work that is metaphor-neutral and should happen regardless of Option 4 vs. Oracle:**
   - Update Design Brief §2.2 Insights row: «actionable» → «observational»
   - Add §1 anti-pattern list (ban AI-sparkle / brain-icon-chrome / neural-network visuals) — this is defensive even under Oracle
   - Draft coach surface-spec BEFORE tech-lead coach ADR lands — the spec informs the ADR, not the other way around
   - Draft 3-stage onboarding flow map as mermaid diagram — concrete artifact that pressure-tests the positioning's 3-stage promise
5. **Design-sprint candidate:** Alternative 3 (unified timeline) is a 1-week design-sprint-worthy exploration if PO is interested in breakout-variance. Not required for alpha; flagged as high-upside exploration.
6. **Do NOT rewrite Design Brief from scratch under Option 4.** v1.1 holds. v1.2 additions are surgical: anti-pattern list, tone-row fix, Second-Brain-specific surface specs (home, coach, 3-stage onboarding). No token changes.

### Bottom line

Second Brain is a coherent metaphor with real design-execution risk. The positioning document declares three surfaces primary; product design cannot. One must be primary on the home screen. Picking chat (Alternative 1) preserves the metaphor, matches ICP A, survives iOS HIG pressure, and keeps engineering scope honest. Anything else either fragments into tabs (commodity drift) or demands a timeline pattern with no prior art (high-upside breakout, design-sprint worth it).

Metaphor survives. Execution discipline determines whether it ships calm or ships AI-sparkle. The design-system work to ensure calm is doable but must be explicit — it will not happen by default under a brain-metaphor brief.

---

## Open questions for PO (via Navigator)

1. **Home-screen pick** — accept Alternative 1 (chat-primary + contextual insights/coach panels + dashboard demoted to secondary route), or hold for design-sprint on Alternative 3 (unified timeline)?
2. **Anti-pattern list lock** — ban AI-sparkle / brain-icon-chrome / neural-network visuals in Design Brief v1.2? (Strongly recommended; guards principle #1 calm-over-busy against default design-taste drift.)
3. **Coach as destination vs. surfacing pattern** — does coach warrant its own route, or does it live as a filter-view of insights feed + weekly sheet triggered from chat? This is a design decision, not tech. Recommend answering BEFORE tech-lead coach ADR lands.
4. **Dashboard role under Second Brain** — keep as current home, or demote to secondary route (required by Alternative 1)?
5. **3-stage onboarding promise SLA** — day-1 first-insight promise is a design contract. Tech-lead must confirm first-insight generation within 24h of sync. If not, 3-stage promise changes (day-3 instead of day-1, or different framing).

---

## Dependencies

- **Blocked on:** PO decision on Alternative 1 vs. design-sprint on Alternative 3 (question 1). Tech-lead coach ADR return (gates coach surface spec).
- **Blocks:** Coach surface spec, 3-stage onboarding spec, Design Brief v1.2 PR, iOS home-pattern ADR.

## Not seen

I have not read the other 5 specialist reviews (brand-strategist, user-researcher, finance-advisor, legal-advisor, content-lead). This review is independent per CONSTRAINTS Rule 3.

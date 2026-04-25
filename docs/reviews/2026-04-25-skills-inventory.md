# Skills Inventory — Full Catalogue
**Date:** 2026-04-25
**Method:** Glob + Read frontmatter + cross-check against runtime skill registry (system-reminder)
**Total skills found:** ~290 (after de-duping wondelai cross-bundle copies)

> Note: wondelai-skills ships the same skill (e.g., `obviously-awesome`) into 6 bundle folders (`marketing-cro/`, `product-innovation/`, `product-strategy/`, `sales-influence/`, `strategy-growth/`, `ux-design/`). The runtime exposes each under one canonical `<bundle>:<name>` namespace, so I count them once per canonical exposure.

> Also note: ECC (`everything-claude-code`) duplicates SKILL.md across `.agents/`, `.cursor/`, `.kiro/`, and `docs/ja-JP/`, `docs/ko-KR/` etc. for harness portability. The runtime registers each skill once. I count once per logical skill.

---

## Summary by source

| Source | Count (logical) |
|---|---|
| User global (`~/.claude/skills/`) | 6 |
| Plugin: `everything-claude-code` (ECC) | ~150 (incl. legacy slash shims) |
| Plugin: `claude-plugins-official:superpowers` | 14 |
| Plugin: `wondelai-skills` (6 bundles × ~10 skills, de-duped to ~50 canonical) | ~50 |
| Plugin: `ui-ux-pro-max-skill` | 7 |
| Built-in / system | 5 (`init`, `review`, `security-review`, `update-config`, `keybindings-help`, `simplify`, `fewer-permission-prompts`, `loop`, `schedule`) |

---

## Summary by category (curated for creative-team relevance)

| Category | Count | Notable skills |
|---|---|---|
| Process discipline (superpowers) | 14 | brainstorming, writing-plans, executing-plans, dispatching-parallel-agents, subagent-driven-development, verification-before-completion, test-driven-development, systematic-debugging, requesting/receiving-code-review, finishing-a-development-branch, using-git-worktrees, using-superpowers, writing-skills |
| Brand / voice / identity | 4 | ECC `brand-voice`, ui-ux-pro-max `brand`, ECC `frontend-design` (visual direction), user `obviously-awesome` (also runtime) |
| Content / writing | 4 | ECC `article-writing`, `content-engine`, `crosspost`, `investor-outreach` |
| Design / UI / UX | ~14 | ECC `frontend-design`, `frontend-slides`, `accessibility`, `liquid-glass-design`; ui-ux-pro-max `ui-ux-pro-max`/`design-system`/`design`/`ui-styling`/`brand`/`banner-design`/`slides`; ux-design bundle: `refactoring-ui`, `ios-hig-design`, `ux-heuristics`, `hooked-ux`, `improve-retention`, `web-typography`, `top-design`, `design-everyday-things`, `lean-ux`, `microinteractions` |
| Strategy / positioning | 4 | strategy-growth `obviously-awesome`, `blue-ocean-strategy`, `crossing-the-chasm`, `traction-eos` |
| Marketing / CRO | 5 | marketing-cro `cro-methodology`, `storybrand-messaging`, `scorecard-marketing`, `contagious`, `one-page-marketing` |
| Sales / influence | 4 | sales-influence `influence-psychology`, `predictable-revenue`, `made-to-stick`, `hundred-million-offers` |
| Product innovation / discovery | 6 | product-innovation `lean-startup`, `design-sprint`, `design-everyday-things`, `inspired-product`, `continuous-discovery`, `37signals-way` |
| Product strategy / customer | 3 | product-strategy `jobs-to-be-done`, `mom-test`, `negotiation` |
| Research / reasoning tools | 5 | ECC `market-research`, `deep-research`, `exa-search`, `documentation-lookup`, `search-first` |
| Multi-perspective reasoning | 3 | ECC `council`, `product-lens`, `santa-method` (adversarial dual-review) |
| Continuity / session | 4 | ECC `save-session`, `resume-session`, `ck` (per-project memory), `strategic-compact` |
| Investor / pitch | 3 | ECC `investor-materials`, `investor-outreach`, `prp-prd` |
| Engineering build/test/review | many | ECC per-language (`tdd-workflow`, `verification-loop`, `code-review`, `security-review`, `e2e-testing`, `*-patterns`, `*-testing`) |
| Workflow ops / orchestration | ~8 | ECC `dmux-workflows`, `team-builder`, `autonomous-agent-harness`, `claude-devfleet`, `agentic-engineering`, `enterprise-agent-ops`, `prompt-optimizer`, `gan-style-harness` |
| AI/agent engineering | ~8 | ECC `claude-api`, `agent-harness-construction`, `agent-introspection-debugging`, `agent-eval`, `eval-harness`, `iterative-retrieval`, `cost-aware-llm-pipeline`, `agent-payment-x402` |
| Domain ops (irrelevant for creative team) | many | healthcare, customs, finance-billing, energy-procurement, returns-reverse-logistics, etc. — skipped from picks |

---

## Full skill list (curated — creative-team-relevant + foundational)

> Engineering-language patterns (springboot, django, perl, csharp, kotlin, rust, golang, etc.), domain-ops (healthcare, customs, energy), and ECC legacy slash shims are listed by name only at the bottom for completeness — not catalogued individually.

### Plugin: `everything-claude-code` — creative & strategic skills

| Name | Description (compact) | Category |
|---|---|---|
| `brand-voice` | Build a source-derived writing style profile from real posts/essays/launch notes, reuse across content + outreach. | brand/voice |
| `article-writing` | Write articles, guides, blog posts, tutorials, newsletter issues in a distinctive voice from supplied examples. | content |
| `content-engine` | Platform-native content systems for X, LinkedIn, TikTok, YouTube, newsletters, multi-platform repurposing. | content |
| `crosspost` | Multi-platform content distribution across X, LinkedIn, Threads, Bluesky. | content |
| `frontend-design` | Build distinctive, production-grade frontend interfaces with high design quality (anti-template). | design |
| `frontend-slides` | Create animation-rich HTML presentations from scratch or by converting decks. | design |
| `accessibility` | WCAG 2.2 Level AA: design, implement, audit inclusive digital products. | design/UX |
| `liquid-glass-design` | iOS 26 Liquid Glass design system (dynamic glass material, blur, reflection). | design |
| `market-research` | Market sizing, competitive analysis, investor due-diligence, decision-oriented summaries with citations. | research |
| `deep-research` | Multi-source web research using firecrawl + exa MCP, cited reports. | research |
| `exa-search` | Neural search via Exa MCP for web, code, companies, people. | research |
| `documentation-lookup` | Up-to-date library/framework docs via Context7 instead of training data. | research |
| `search-first` | Research-before-coding: search existing tools/libraries/patterns first. | research/process |
| `council` | Convene a 4-voice council for ambiguous decisions, tradeoffs, go/no-go reviews. | reasoning |
| `product-lens` | Validate the "why" before building, run product diagnostics. | product/reasoning |
| `santa-method` | Multi-agent adversarial verification with convergence loop (two reviewers must agree). | reasoning/QA |
| `prompt-optimizer` | Analyze raw prompts, identify intent/gaps, match ECC components. | process |
| `prp-prd` | Interactive PRD generator: problem-first, hypothesis-driven product spec. | product |
| `prp-plan` | Comprehensive feature implementation plan with codebase analysis. | process |
| `prp-implement` | Execute an implementation plan with rigorous validation loops. | process |
| `investor-materials` | Pitch decks, one-pagers, investor memos, accelerator applications. | investor |
| `investor-outreach` | Cold emails, warm intro blurbs, follow-ups, update emails. | content/sales |
| `save-session` / `resume-session` | Save/load session state to ~/.claude/session-data/. | continuity |
| `ck` | Persistent per-project memory; auto-loads project context on session start. | continuity |
| `strategic-compact` | Suggest manual context compaction at logical intervals to preserve context. | continuity |
| `verification-loop` | Comprehensive verification system for Claude Code sessions. | QA |
| `code-review` | Local uncommitted changes or GitHub PR review. | QA |
| `security-review` | Auth, user input, secrets, crypto, payments review. | security |
| `team-builder` | Interactive agent picker for composing and dispatching parallel teams. | orchestration |
| `dmux-workflows` | Multi-agent orchestration via dmux (tmux pane manager). | orchestration |
| `claude-devfleet` | Plan projects, dispatch multi-agent coding tasks. | orchestration |
| `autonomous-agent-harness` | Transform Claude Code into a fully autonomous agent system. | orchestration |
| `agentic-engineering` | Eval-first execution, decomposition, verification as agentic engineer. | process |
| `agent-introspection-debugging` | Structured self-debugging for AI agent failures. | agent-eng |
| `agent-eval` | Head-to-head comparison of coding agents on benchmark tasks. | agent-eng |
| `eval-harness` | Formal evaluation framework for Claude Code sessions (eval-driven dev). | agent-eng |
| `claude-api` | Anthropic Claude API patterns for Python/TS (caching, thinking, tool use). | AI eng |
| `agent-harness-construction` | Design agent action spaces, tool definitions, observation models. | agent-eng |
| `iterative-retrieval` | Progressive context retrieval refinement for subagent context-window problem. | agent-eng |
| `cost-aware-llm-pipeline` | Cost optimization patterns for LLM API usage; model routing by complexity. | AI eng |
| `seo` | Audit, plan, implement SEO improvements (technical, on-page, content). | marketing |
| `lead-intelligence` | AI-native lead intelligence and outreach pipeline (Apollo/Clay replacement). | sales |
| `connections-optimizer` | Reorganize X/LinkedIn network with review-first pruning. | network |
| `social-graph-ranker` | Weighted social-graph ranking for warm intro discovery, bridge scoring. | network |
| `messages-ops` / `email-ops` | Live messaging / mailbox triage, drafting, send verification. | comms |
| `google-workspace-ops` | Operate across Google Drive/Docs/Sheets/Slides as one workflow. | ops |
| `github-ops` | GitHub repo operations, automation, issue/PR triage. | ops |
| `project-flow-ops` | Triage GitHub + Linear issues and PRs as one execution flow. | ops |
| `unified-notifications-ops` | Notifications across GitHub/Linear/desktop as one ECC-native workflow. | ops |
| `terminal-ops` | Evidence-first repo execution workflow. | ops |
| `research-ops` | Evidence-first current-state research workflow. | research/ops |
| `ai-first-engineering` | Engineering operating model where AI agents generate large share of code. | meta |
| `architecture-decision-records` | Capture architectural decisions as structured ADRs. | docs |
| `agent-sort` | Build an evidence-backed ECC install plan by sorting skills for a repo. | meta |
| `skill-stocktake` / `skill-health` / `skill-comply` | Audit, dashboard, and compliance for the skill portfolio. | meta |
| `context-budget` | Audit Claude Code context window consumption across agents/skills/MCP. | meta |
| `rules-distill` | Scan skills to extract cross-cutting principles and distill into rules. | meta |
| `repo-scan` | Cross-stack source code asset audit. | meta |
| `workspace-surface-audit` | Audit active repo, MCP servers, plugins, connectors, env surfaces. | meta |
| `automation-audit-ops` | Evidence-first automation inventory and overlap audit for ECC. | meta |
| `data-scraper-agent` | Build automated AI-powered data collection agent for public sources. | data |
| `manim-video` | Reusable Manim explainers for technical concepts/graphs/system diagrams. | media |
| `video-editing` | AI-assisted video editing workflows. | media |
| `videodb` / `fal-ai-media` / `ui-demo` | Video/audio/media MCP-driven generation + UI demo recording via Playwright. | media |
| `feature-dev` / `blueprint` / `code-tour` / `codebase-onboarding` | Feature dev guide / multi-session blueprints / CodeTour walkthroughs / onboarding analysis. | process |

### Plugin: `claude-plugins-official:superpowers` (full enumeration)

| Name | Description (compact) |
|---|---|
| `brainstorming` | MUST use before any creative work — explore intent, requirements, design before implementation. |
| `writing-plans` | Use when you have a spec/requirements for multi-step task, before touching code. |
| `executing-plans` | Use when you have a written implementation plan to execute in a separate session. |
| `dispatching-parallel-agents` | Use when 2+ independent tasks can be worked on without shared state. |
| `subagent-driven-development` | Execute implementation plans with independent tasks in current session. |
| `test-driven-development` | Use when implementing any feature or bugfix, before writing implementation code. |
| `systematic-debugging` | Use when encountering any bug, test failure, or unexpected behavior. |
| `verification-before-completion` | Use before claiming work is complete, fixed, or passing. |
| `requesting-code-review` | Use when completing tasks, implementing major features, or before merging. |
| `receiving-code-review` | Use when receiving code review feedback. |
| `finishing-a-development-branch` | Decide how to land a finished branch. |
| `using-git-worktrees` | Use when starting feature work that needs isolation. |
| `using-superpowers` | Establishes how to find and use skills, run multi-agent reviews. |
| `writing-skills` | Use when creating new skills, editing existing skills. |

### Plugin: `wondelai-skills` — canonical skills (de-duped across 6 bundles)

| Bundle namespace | Skill | Description (compact) |
|---|---|---|
| `strategy-growth:` | `obviously-awesome` | April Dunford positioning: competitive alternatives, unique attributes, best-fit customers. |
| `strategy-growth:` | `blue-ocean-strategy` | Create uncontested market space using value innovation. |
| `strategy-growth:` | `crossing-the-chasm` | Navigate technology adoption lifecycle from early adopters to mainstream. |
| `strategy-growth:` | `traction-eos` | EOS framework: align vision and execution. |
| `marketing-cro:` | `cro-methodology` | Audit websites/landing pages for conversion issues; evidence-based CRO. |
| `marketing-cro:` | `storybrand-messaging` | Donald Miller narrative messaging: customer as hero. |
| `marketing-cro:` | `scorecard-marketing` | Quiz/assessment funnels generating qualified leads at 30-50% conversion. |
| `marketing-cro:` | `contagious` | Jonah Berger STEPPS framework for word-of-mouth/virality. |
| `marketing-cro:` | `one-page-marketing` | Allan Dib full-customer-journey marketing plan (stranger → fan). |
| `sales-influence:` | `influence-psychology` | Cialdini's six principles of ethical persuasion. |
| `sales-influence:` | `predictable-revenue` | Aaron Ross: scalable outbound B2B with SDR/AE/CSM specialization. |
| `sales-influence:` | `made-to-stick` | Heath brothers SUCCES framework for memorable messages. |
| `sales-influence:` | `hundred-million-offers` | Alex Hormozi Value Equation, bonus stacking, risk reversal. |
| `product-innovation:` | `lean-startup` | MVPs, validated learning, pivot-or-persevere decisions. |
| `product-innovation:` | `design-sprint` | 5-day prototype-test-validate process. |
| `product-innovation:` | `inspired-product` | Marty Cagan empowered product teams: discovery + delivery dual-track. |
| `product-innovation:` | `continuous-discovery` | Teresa Torres: weekly customer touchpoints + Opportunity Solution Tree. |
| `product-innovation:` | `37signals-way` | Lean opinionated products (Getting Real / Rework / Shape Up). |
| `product-strategy:` | `jobs-to-be-done` | Customers hire products for jobs; circumstances over demographics. |
| `product-strategy:` | `mom-test` | Talk to customers without leading them: discuss life, get specifics, dig into emotion. |
| `product-strategy:` | `negotiation` | Tactical empathy, calibrated questions, mirroring (Chris Voss). |
| `ux-design:` | `refactoring-ui` | Audit/fix visual hierarchy, spacing, color, depth in web UIs. |
| `ux-design:` | `ios-hig-design` | Native iOS interfaces following Apple HIG. |
| `ux-design:` | `ux-heuristics` | Nielsen heuristic analysis for usability. |
| `ux-design:` | `hooked-ux` | Nir Eyal Hook Model: Trigger, Action, Variable Reward, Investment. |
| `ux-design:` | `improve-retention` | B=MAP behavior design for retention problems. |
| `ux-design:` | `web-typography` | Select, pair, implement typefaces for web. |
| `ux-design:` | `top-design` | Awwwards-level immersive web experiences. |
| `ux-design:` | `design-everyday-things` | Don Norman: affordances, signifiers, constraints, feedback. |
| `ux-design:` | `lean-ux` | Hypothesis-driven design, collaborative sketching. |
| `ux-design:` | `microinteractions` | Triggers, rules, feedback, loops, modes for delight + clarity. |

### Plugin: `ui-ux-pro-max-skill` (full enumeration)

| Name | Description (compact) |
|---|---|
| `ui-ux-pro-max:ui-ux-pro-max` | Flagship: 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, 25 chart types across 10 stacks. Plan/build/review UI. |
| `ui-ux-pro-max:design-system` (`ckm:design-system`) | Three-layer tokens (primitive→semantic→component), CSS variables, spacing/typography scales, design-to-code handoff. |
| `ui-ux-pro-max:design` (`ckm:design`) | Unified: brand identity, tokens, UI styling, logo (55 styles), CIP (50 deliverables), HTML decks, banners, icons, social photos. |
| `ui-ux-pro-max:brand` (`ckm:brand`) | Brand voice, visual identity, messaging frameworks, asset management, consistency. |
| `ui-ux-pro-max:ui-styling` (`ckm:ui-styling`) | shadcn/ui + Radix + Tailwind components, dark mode, accessible patterns. |
| `ui-ux-pro-max:banner-design` (`ckm:banner-design`) | Banners for social/ads/web/print across 13 styles (minimalist → 3D → editorial). |
| `ui-ux-pro-max:slides` (`ckm:slides`) | Strategic HTML presentations with Chart.js, design tokens, copywriting formulas. |

### User global (`~/.claude/skills/`)

| Name | Description (compact) |
|---|---|
| `obviously-awesome` | (User-global copy) April Dunford positioning canvas. |
| `github` | GitHub operations via `gh` CLI: issues, PRs, CI, code review, API queries. |
| `redis-patterns` | Caching, pub/sub, streams for event processing. |
| `redis-cache-manager` | Auto-activating skill for backend caching. |
| `backend-patterns` | Backend architecture patterns, API design, DB optimization. |
| `golang-patterns` | Go-specific design patterns: functional options, struct composition. |

### Built-in / system / harness skills

| Name | Description (compact) |
|---|---|
| `update-config` | Configure Claude Code harness via settings.json (hooks, permissions, env). |
| `keybindings-help` | Customize keyboard shortcuts in `~/.claude/keybindings.json`. |
| `simplify` | Review changed code for reuse/quality/efficiency, fix issues. |
| `fewer-permission-prompts` | Scan transcripts for safe Bash/MCP calls; add allowlist to `.claude/settings.json`. |
| `loop` | Run a prompt/slash command on recurring interval. |
| `schedule` | Cron-scheduled remote agents (one-time or recurring). |
| `init` | Initialize a new CLAUDE.md with codebase documentation. |
| `review` | Review a pull request. |
| `security-review` | Security review of pending changes on current branch. |

### ECC engineering / domain (named only — not creative-team relevant)

> Listed for completeness; not used for creative-team picks.

**Languages:** `golang-patterns/testing`, `python-patterns/testing`, `rust-patterns/testing`, `kotlin-patterns/testing/coroutines-flows/exposed-patterns/ktor-patterns`, `dotnet-patterns`, `csharp-testing`, `perl-patterns/testing/security`, `springboot-patterns/security/tdd/verification`, `django-patterns/security/tdd/verification`, `laravel-patterns/security/tdd/verification`, `nestjs-patterns`, `nuxt4-patterns`, `nextjs-turbopack`, `bun-runtime`, `dart-flutter-patterns`, `compose-multiplatform-patterns`, `swiftui-patterns`, `swift-concurrency-6-2`, `swift-actor-persistence`, `swift-protocol-di-testing`, `foundation-models-on-device`, `clickhouse-io`, `postgres-patterns`, `jpa-patterns`, `pytorch-patterns`, `java-coding-standards`, `cpp-coding-standards`, `cpp-testing`, `cpp-build`, `cpp-review`.

**Build/test/review per language:** `*-build`, `*-test`, `*-review` slash shims (cpp/flutter/go/gradle/kotlin/python/rust).

**Domain-specific (irrelevant for creative team):** `healthcare-cdss-patterns`, `healthcare-emr-patterns`, `healthcare-eval-harness`, `healthcare-phi-compliance`, `hipaa-compliance`, `customs-trade-compliance`, `quality-nonconformance`, `production-scheduling`, `inventory-demand-planning`, `carrier-relationship-management`, `logistics-exception-management`, `returns-reverse-logistics`, `customer-billing-ops`, `finance-billing-ops`, `energy-procurement`, `gdpr-data-handling`, `employment-contract-templates`, `defi-amm-security`, `evm-token-decimals`, `nodejs-keccak256`, `llm-trading-agent-security`, `backtesting-frameworks`, `risk-metrics-calculation`, `nutrient-document-processing`, `visa-doc-translate`, `agent-payment-x402`.

**ECC slash shims (legacy, prefer skill directly):** `agent-sort`, `aside`, `claw`, `context-budget`, `devfleet`, `docs`, `eval`, `evolve`, `feature-dev`, `hookify*`, `instinct-*`, `jira`, `learn-eval`, `orchestrate`, `plan`, `projects`, `promote`, `prompt-optimize`, `prune`, `prp-*`, `resume-session`, `review-pr`, `rules-distill`, `santa-loop`, `save-session`, `sessions`, `skill-create`, `skill-health`, `tdd`, `verify`.

---

## Creative-team curated picks (skill-attach plan)

### For `brand-strategist` (naming + brand archetype + voice + tagline)

| Skill | Why |
|---|---|
| `ui-ux-pro-max:brand` | Brand identity, voice, messaging frameworks — closest to brand-strategist core. |
| `everything-claude-code:brand-voice` | Source-derived voice profiles from real material (anti-generic-AI). |
| `strategy-growth:obviously-awesome` | Positioning is upstream of naming; competitive-alternative mapping forces differentiation. |
| `sales-influence:made-to-stick` | SUCCES filter for tagline memorability (Simple, Unexpected, Concrete, Credible, Emotional, Stories). |
| `marketing-cro:contagious` | STEPPS lens for whether a name has Social Currency / Triggers / Emotion / Practical Value / Stories. |
| `superpowers:brainstorming` | HARD-GATE design-before-implementation; perfect fit for naming rounds. |
| `everything-claude-code:council` | 4-voice ambiguous-decision council — ideal for name shortlist debate. |
| `everything-claude-code:market-research` | Competitor name landscape, category conventions, decision-oriented summaries. |
| `everything-claude-code:exa-search` | Trademark/handle/domain availability scanning via neural search. |
| `superpowers:verification-before-completion` | Block premature lock-in claims (matches PO's "no spend without approval"). |

**Recommendation:** attach 8-10. Top-6 minimum: `ui-ux-pro-max:brand`, `brand-voice`, `obviously-awesome`, `made-to-stick`, `brainstorming`, `council`.

### For `brand-voice-curator` (NEW — taste reference log + voice profile derivation)

| Skill | Why |
|---|---|
| `everything-claude-code:brand-voice` | Core capability — exact match. Source-derived voice profile is the role's primary deliverable. |
| `sales-influence:made-to-stick` | Score voice candidates on memorability (SUCCES). |
| `marketing-cro:contagious` | STEPPS triggers — does the voice carry? |
| `superpowers:brainstorming` | Process discipline for voice exploration. |
| `everything-claude-code:council` | When references conflict, use 4-voice debate to converge. |
| `everything-claude-code:market-research` | Find analog brands' real voice corpora as references. |
| `everything-claude-code:exa-search` | Surface live writing samples from referenced authors/brands. |
| `everything-claude-code:save-session` + `resume-session` | Voice work spans many sessions; continuity is essential. |
| `everything-claude-code:ck` | Per-project memory — voice profile must persist. |
| `everything-claude-code:strategic-compact` | Voice work is corpus-heavy; need disciplined compaction. |

**Recommendation:** 9 picks — all listed. This role is the strongest fit for ECC's `brand-voice` skill on the entire team.

### For `product-designer` (UX flows + wireframes + Design Brief)

| Skill | Why |
|---|---|
| `ui-ux-pro-max:ui-ux-pro-max` | Flagship: 50+ styles, 161 palettes, 57 font pairings, 99 UX guidelines, 25 chart types — primary design intelligence. |
| `ui-ux-pro-max:design-system` | Token architecture (primitive→semantic→component) — directly maps to Design Brief deliverable. |
| `everything-claude-code:frontend-design` | Distinctive, non-template UI direction (anti-generic-AI). |
| `ux-design:refactoring-ui` | Audit/fix visual hierarchy, spacing, color, depth — perfect QA pass. |
| `ux-design:ux-heuristics` | Nielsen heuristics for usability review of flows. |
| `ux-design:microinteractions` | Designed states (hover/focus/active) — required by web/design-quality.md. |
| `ux-design:hooked-ux` | Habit-forming loops — fits Companion / Coach contextual UX in Memoro. |
| `ux-design:improve-retention` | B=MAP behavior design for activation/retention loops. |
| `ux-design:web-typography` | Type pairing for distinctive landing/Companion surfaces. |
| `superpowers:brainstorming` | Design-before-implementation gate. |

**Recommendation:** 8-10 picks — all above. Drop `web-typography` if only 8. Add `liquid-glass-design` if iOS surface emerges.

### For `user-researcher` (ICP discovery + interviews + JTBD + opportunity mapping)

| Skill | Why |
|---|---|
| `product-strategy:jobs-to-be-done` | Core methodology — circumstances over demographics. |
| `product-strategy:mom-test` | Don't-lead-the-witness interview discipline. |
| `product-innovation:continuous-discovery` | Weekly cadence + Opportunity Solution Tree. |
| `product-innovation:lean-startup` | MVP / validated learning / pivot-or-persevere framing. |
| `product-innovation:design-sprint` | 5-day rapid validation when stakes are high. |
| `everything-claude-code:market-research` | ICP segmentation, competitor research, market sizing. |
| `everything-claude-code:deep-research` | Multi-source cited reports for ICP/regulatory grounding. |
| `everything-claude-code:exa-search` | Find real interview subjects, look-alike user posts on Reddit/forums. |
| `everything-claude-code:council` | When research signals conflict, run 4-voice debate. |
| `superpowers:brainstorming` | Question-design discipline before interviews. |

**Recommendation:** 8-10 picks — all above.

### For `content-lead` (landing copy + email + microcopy + paywall + in-product strings)

| Skill | Why |
|---|---|
| `marketing-cro:storybrand-messaging` | Customer-as-hero narrative — directly drives landing structure. |
| `sales-influence:made-to-stick` | SUCCES filter for headlines, taglines, paywall copy. |
| `marketing-cro:contagious` | STEPPS for shareable copy (especially aha-moment screens). |
| `sales-influence:influence-psychology` | Reciprocity / social proof / scarcity — paywall + trial + upgrade copy. |
| `marketing-cro:one-page-marketing` | Full customer-journey lens (stranger → fan) — guides email sequences. |
| `sales-influence:hundred-million-offers` | Value Equation + risk reversal — paywall offer construction. |
| `everything-claude-code:content-engine` | Platform-native posts (X/LinkedIn/etc.) for launch + content marketing. |
| `everything-claude-code:article-writing` | Long-form pieces (blog, newsletter) in Memoro voice. |
| `everything-claude-code:brand-voice` | Tone consistency across surfaces (lock + reuse). |
| `superpowers:brainstorming` | Pre-write design pass (CTA framing, hierarchy) before drafting. |

**Recommendation:** 8-10 picks — all above. Drop `hundred-million-offers` if voice is anti-hard-sell.

### For `creative orchestrator` (NEW — for consideration)

| Skill | Why |
|---|---|
| `superpowers:brainstorming` | HARD-GATE design-before-implementation across all creative work. |
| `superpowers:writing-plans` | Multi-step creative initiative plans (e.g., naming round, brand sprint). |
| `superpowers:dispatching-parallel-agents` | The literal mechanism for the project's "REAL parallel Agent-tool dispatch" hard rule. |
| `everything-claude-code:council` | Multi-voice debate for ambiguous strategic creative decisions. |
| `everything-claude-code:product-lens` | "Validate the why before building" — orchestrator's gate function. |
| `everything-claude-code:brand-voice` | Tone alignment across all creative outputs. |
| `strategy-growth:obviously-awesome` | Positioning anchor for any creative request. |
| `everything-claude-code:market-research` | Decision-grade research before committing creative direction. |
| `everything-claude-code:deep-research` | Cited multi-source synthesis for big-bet creative calls. |
| `superpowers:verification-before-completion` | Pre-claim gate (matches PO's hard rules: no spend, no PO-name posts, multi-agent review). |
| `mcp__plugin_everything-claude-code_sequential-thinking__sequentialthinking` | (Deferred MCP tool — same purpose as Anthropic sequential-thinking; useful for orchestrator reasoning.) |

**Recommendation:** 8-10 picks. Top-8: `brainstorming`, `writing-plans`, `dispatching-parallel-agents`, `council`, `product-lens`, `obviously-awesome`, `market-research`, `verification-before-completion`.

**Cross-check vs Navigator role.** The current Navigator is a **gateway / dispatcher / synthesizer** for PO talk-flow (per `MEMORY.md → project_team_structure_2026-04-24`). It owns:
- single conversation surface to PO
- routing to specialists
- synthesis of returned outputs into one weighted recommendation

A `creative orchestrator` would overlap on dispatch + synthesis but differ in:
- **scope** — only creative/brand/content/design initiatives (not engineering, not legal)
- **gate** — runs `brainstorming` + `product-lens` + `council` before dispatch
- **deliverable** — creative rounds doc with debated options (not a routing memo)

**Risk:** layering a creative orchestrator under Navigator adds a hop. Two viable shapes:
1. **Promote skills onto Navigator** — give Navigator the orchestrator skill stack; no new agent.
2. **Keep Navigator thin, add orchestrator under it** — only worthwhile if creative work volume justifies a dedicated specialist.

**Suggestion for PO:** Option 1 first; reassess if Navigator overloads.

---

## Honest caveats

- **Wondelai bundle multiplication:** the 6-bundle layout (`marketing-cro/`, `product-innovation/`, etc.) ships the same SKILL.md repeatedly. Glob shows ~250 files; runtime exposes ~50 canonical skills under namespaces like `strategy-growth:obviously-awesome`. I de-duped to canonical.
- **ECC duplication:** ECC ships SKILL.md across `.agents/`, `.cursor/`, `.kiro/`, plus localized `docs/ja-JP/`, `docs/ko-KR/`, `docs/zh-CN/` etc. Same skill, different harness slot. De-duped.
- **Some descriptions truncated** in the skill registry (e.g., `simplify`, `redis-cache-manager`, `redis-patterns`, `golang-patterns`, `backend-patterns`, `github`). I've extrapolated from name + path. Read individual SKILL.md if a high-stakes attach decision depends on full description.
- **`obviously-awesome` exists in three places:** user global (`~/.claude/skills/obviously-awesome/`), `wondelai-skills:strategy-growth`, `wondelai-skills:marketing-cro`, etc. The runtime registers under `strategy-growth:obviously-awesome` (and other bundles). The user-global copy may shadow or duplicate — verify on attach.
- **Plugin: `claude-plugins-official:superpowers`** — the runtime exposes both modern `superpowers:writing-plans` and deprecated `superpowers:write-plan` shims. Always pick the non-deprecated form.
- **MCP-deferred tools** (sequential-thinking, exa MCP, context7 MCP, github MCP, playwright MCP, memory MCP) are not "skills" but tool schemas. They complement skills like `exa-search` and `deep-research` — listed in the skill descriptions but not in this inventory's per-skill table.
- **Built-in skills** (`init`, `review`, `security-review`) are harness-level; they appear in the runtime registry without `<plugin>:` prefix.
- **No spend rule respected:** all skills enumerated here are local — no API calls made.

---

## Process / time

- Method: 6 parallel Glob calls + 14 selective Read calls (frontmatter only, ≤25 lines each) + cross-check against runtime skill registry from system-reminder.
- Time: ~12 minutes.
- Total lines: ~250 (well under 700 cap).

# Agents Inventory — Full Catalogue
**Date:** 2026-04-25
**Method:** Glob + Read frontmatter (first 10 lines per file)
**Total agents found:** 67

---

## Summary by source

| Source | Count | Path pattern |
|---|---|---|
| Project (investment-tracker) | 14 | `D:\investment-tracker\.agents\team\*.md` (excl. README + CONSTRAINTS) |
| User global | 0 | `~/.claude/agents/` (directory not present) |
| Plugin: everything-claude-code | 47 | `plugins/cache/everything-claude-code/everything-claude-code/1.10.0/agents/` |
| Plugin: hr-legal-compliance | 2 | `plugins/cache/claude-code-workflows/hr-legal-compliance/1.2.2/agents/` |
| Plugin: quantitative-trading | 2 | `plugins/cache/claude-code-workflows/quantitative-trading/1.2.2/agents/` |
| Plugin: security-compliance | 1 | `plugins/cache/claude-code-workflows/security-compliance/1.2.0/agents/` |
| Plugin: superpowers | 1 | `plugins/cache/claude-plugins-official/superpowers/5.0.7/agents/` |
| Plugin: c-level-skills (executive-mentor) | 1 (no frontmatter) | `plugins/cache/claude-code-skills/c-level-skills/2.1.2/executive-mentor/agents/` |
| Plugin: ui-ux-pro-max-skill | 0 | skills only, no agents |
| Plugin: wondelai-skills | 0 | skills only, no agents |

**Notes:**
- The user-global directory `C:\Users\rmais\.claude\agents\` does not exist (Glob returned 0).
- ECC also bundles per-skill agent helpers in `1.10.0/.agents/skills/<skill>/agents/` and `docs/<lang>/...` translations — these are **not** standalone Claude agents; excluded from this catalogue (they are skill internals or localized copies).
- ECC has alternate-IDE export dirs (`.codex/agents`, `.kiro/agents`, `.opencode/prompts/agents`) that mirror the canonical `1.10.0/agents/` set in non-Claude formats; excluded to avoid duplication.

---

## Project agents (D:\investment-tracker\.agents\team\)

| Name | Description | Model | Tools | Path |
|---|---|---|---|---|
| navigator | PO's Russian-speaking strategic co-pilot — single point of contact with the team. Primary interface for product decisions, sprint intent, weekly status reads. Holds full product context. Does NOT write code. | opus | Read, Glob, Grep, Bash, Edit, Write, WebFetch, Agent | navigator.md |
| tech-lead | Strategic co-pilot for the PO. Routes work, decomposes features into slices, writes kickoffs, maintains TD ledger / merge-log / ADRs. NEVER writes production code. | opus | Read, Glob, Grep, Bash, Edit, Write, WebFetch | tech-lead.md |
| backend-engineer | Implements backend features. Go handlers in apps/api (Fiber v3) and Python AI service in apps/ai (FastAPI + Pydantic v2). Strict spec-first against OpenAPI. | sonnet | Read, Glob, Grep, Bash, Edit, Write | backend-engineer.md |
| frontend-engineer | Implements Next.js 15 frontend in apps/web. New pages, client components, TanStack Query hooks, Vitest smoke tests. | sonnet | Read, Glob, Grep, Bash, Edit, Write | frontend-engineer.md |
| devops-engineer | Owns CI/CD, Docker images, Doppler secrets, deploy pipelines, staging/prod infra, runbooks. Does NOT write product features. | sonnet | Read, Glob, Grep, Bash, Edit, Write | devops-engineer.md |
| qa-engineer | Owns test strategy across Go + Python + Vitest + k6. Coverage analysis, flaky-test root-cause, contract-test gaps, staging smoke verification. | sonnet | Read, Glob, Grep, Bash, Edit, Write | qa-engineer.md |
| code-reviewer | Independent post-merge (or large-PR pre-merge) reviewer. Correctness, security, performance, design fit, testing, docs. NEVER edits code. | opus | Read, Glob, Grep, Bash, Write | code-reviewer.md |
| product-designer | Owns UX flows, wireframes, surface design, visual system maintenance (Design Brief). Translates positioning → screens. Does NOT write production frontend code. | opus | Read, Glob, Grep, Bash, Edit, Write | product-designer.md |
| brand-strategist | Owns naming, brand archetype, tone of voice, taglines, brand foundation. Naming workshops, brand voice profiles, tagline generation. | opus | Read, Glob, Grep, Bash, Edit, Write, WebFetch | brand-strategist.md |
| brand-voice-curator | Maintains living taste-reference log (brands PO loves/hates, any industry), reverse-engineers voice-profile from accumulated references. Owns docs/product/BRAND_VOICE/. | opus | Read, Glob, Grep, Bash, Edit, Write, WebFetch | brand-voice-curator.md |
| content-lead | Owns landing copy, email sequences, microcopy, paywall copy, in-product strings. Consumes brand voice from brand-strategist. | opus | Read, Glob, Grep, Bash, Edit, Write, WebFetch | content-lead.md |
| user-researcher | Owns ICP validation, customer discovery, interview scripts, JTBD statements, opportunity mapping, feedback synthesis. Does NOT run live customer calls (PO does). | opus | Read, Glob, Grep, Bash, Edit, Write, WebFetch | user-researcher.md |
| finance-advisor | Internal finance domain expert. Validates AI-generated financial content for accuracy, reviews feature logic from investor psychology angle, startup financial modeling. NOT registered investment advisor. | opus | Read, Glob, Grep, Bash, Edit, Write, WebFetch | finance-advisor.md |
| legal-advisor | Internal legal-domain SME. GDPR, ToS, privacy policies, employment/contractor contracts, Lane A regulatory boundary. Does NOT replace licensed attorneys. | opus | Read, Glob, Grep, Bash, Edit, Write, WebFetch | legal-advisor.md |

(Files `README.md` and `CONSTRAINTS.md` exist in same dir but are docs, not agent definitions.)

---

## User global agents (~/.claude/agents/)

Directory `C:\Users\rmais\.claude\agents\` does not exist on this machine. **0 agents.**

---

## Plugin agents — by plugin

### Plugin: everything-claude-code (1.10.0) — 47 agents

Path: `C:\Users\rmais\.claude\plugins\cache\everything-claude-code\everything-claude-code\1.10.0\agents\`

| Name | Description | Model | Tools | Path |
|---|---|---|---|---|
| a11y-architect | Accessibility Architect specializing in WCAG 2.2 compliance for Web and Native. PROACTIVELY when designing UI components, design systems, or auditing for inclusive UX. | opus (also lists `sonnet` — duplicate key in frontmatter) | Read, Write, Edit, Bash, Grep, Glob | a11y-architect.md |
| architect | Software architecture specialist for system design, scalability, and technical decision-making. PROACTIVELY when planning new features, refactoring, or architectural decisions. | opus | Read, Grep, Glob | architect.md |
| build-error-resolver | Build and TypeScript error resolution specialist. Fixes build/type errors only with minimal diffs. | sonnet | Read, Write, Edit, Bash, Grep, Glob | build-error-resolver.md |
| chief-of-staff | Personal communication chief of staff. Triage email/Slack/LINE/Messenger; classify into 4 tiers; generate draft replies; enforce post-send follow-through. | opus | Read, Grep, Glob, Bash, Edit, Write | chief-of-staff.md |
| code-architect | Designs feature architectures by analyzing existing codebase patterns and conventions; provides implementation blueprints with files, interfaces, data flow, build order. | sonnet | Read, Grep, Glob, Bash | code-architect.md |
| code-explorer | Deeply analyzes existing codebase features by tracing execution paths, mapping architecture layers, documenting dependencies. | sonnet | Read, Grep, Glob, Bash | code-explorer.md |
| code-reviewer | Expert code review specialist. Quality, security, maintainability. Use immediately after writing or modifying code. MUST BE USED for all code changes. | sonnet | Read, Grep, Glob, Bash | code-reviewer.md |
| code-simplifier | Simplifies and refines code for clarity, consistency, and maintainability while preserving behavior. Focus on recently modified code. | sonnet | Read, Write, Edit, Bash, Grep, Glob | code-simplifier.md |
| comment-analyzer | Analyze code comments for accuracy, completeness, maintainability, and comment rot risk. | sonnet | Read, Grep, Glob, Bash | comment-analyzer.md |
| conversation-analyzer | Analyzes conversation transcripts to find behaviors worth preventing with hooks. Triggered by `/hookify` without arguments. | sonnet | Read, Grep | conversation-analyzer.md |
| cpp-build-resolver | C++ build, CMake, compilation error resolution specialist. Build errors, linker, template errors with minimal changes. | sonnet | Read, Write, Edit, Bash, Grep, Glob | cpp-build-resolver.md |
| cpp-reviewer | Expert C++ code reviewer — memory safety, modern C++ idioms, concurrency, performance. MUST BE USED for C++ projects. | sonnet | Read, Grep, Glob, Bash | cpp-reviewer.md |
| csharp-reviewer | Expert C# code reviewer — .NET conventions, async patterns, security, nullable refs, performance. MUST BE USED for C# projects. | sonnet | Read, Grep, Glob, Bash | csharp-reviewer.md |
| dart-build-resolver | Dart/Flutter build, analysis, dependency error resolution. `dart analyze`, Flutter compilation, pub conflicts, build_runner. | sonnet | Read, Write, Edit, Bash, Grep, Glob | dart-build-resolver.md |
| database-reviewer | PostgreSQL specialist — query optimization, schema design, security, performance. PROACTIVELY when writing SQL, migrations, schemas. Includes Supabase patterns. | sonnet | Read, Write, Edit, Bash, Grep, Glob | database-reviewer.md |
| docs-lookup | When user asks how to use a library, framework, or API, fetch current docs via Context7 MCP and return answers with examples. | sonnet | Read, Grep, mcp__context7__resolve-library-id, mcp__context7__query-docs | docs-lookup.md |
| doc-updater | Documentation and codemap specialist. PROACTIVELY for updating codemaps and docs. Runs `/update-codemaps` and `/update-docs`. | haiku | Read, Write, Edit, Bash, Grep, Glob | doc-updater.md |
| e2e-runner | End-to-end testing specialist using Vercel Agent Browser (preferred) with Playwright fallback. Generates/maintains/runs E2E tests. | sonnet | Read, Write, Edit, Bash, Grep, Glob | e2e-runner.md |
| flutter-reviewer | Flutter and Dart code reviewer. Widget best practices, state mgmt, Dart idioms, performance, accessibility, clean architecture. | sonnet | Read, Grep, Glob, Bash | flutter-reviewer.md |
| gan-evaluator | GAN Harness — Evaluator agent. Tests live running app via Playwright, scores against rubric, provides feedback to Generator. | opus | Read, Write, Bash, Grep, Glob | gan-evaluator.md |
| gan-generator | GAN Harness — Generator agent. Implements features per spec, reads evaluator feedback, iterates until quality threshold met. | opus | Read, Write, Edit, Bash, Grep, Glob | gan-generator.md |
| gan-planner | GAN Harness — Planner agent. Expands a one-line prompt into a full product spec with features, sprints, eval criteria, design direction. | opus | Read, Write, Grep, Glob | gan-planner.md |
| go-build-resolver | Go build, vet, compilation error resolution. Build errors, `go vet` issues, linter warnings with minimal changes. | sonnet | Read, Write, Edit, Bash, Grep, Glob | go-build-resolver.md |
| go-reviewer | Expert Go code reviewer — idiomatic Go, concurrency patterns, error handling, performance. MUST BE USED for Go projects. | sonnet | Read, Grep, Glob, Bash | go-reviewer.md |
| harness-optimizer | Analyze and improve the local agent harness configuration for reliability, cost, and throughput. | sonnet | Read, Grep, Glob, Bash, Edit | harness-optimizer.md |
| healthcare-reviewer | Reviews healthcare app code for clinical safety, CDSS accuracy, PHI compliance, medical data integrity. EMR/EHR, CDSS, health info systems. | opus | Read, Grep, Glob | healthcare-reviewer.md |
| java-build-resolver | Java/Maven/Gradle build, compilation, dependency error resolution. | sonnet | Read, Write, Edit, Bash, Grep, Glob | java-build-resolver.md |
| java-reviewer | Expert Java + Spring Boot code reviewer — layered architecture, JPA, security, concurrency. MUST BE USED for Spring Boot projects. | sonnet | Read, Grep, Glob, Bash | java-reviewer.md |
| kotlin-build-resolver | Kotlin/Gradle build, compilation, dependency error resolution. | sonnet | Read, Write, Edit, Bash, Grep, Glob | kotlin-build-resolver.md |
| kotlin-reviewer | Kotlin and Android/KMP code reviewer — idiomatic patterns, coroutine safety, Compose, clean architecture, Android pitfalls. | sonnet | Read, Grep, Glob, Bash | kotlin-reviewer.md |
| loop-operator | Operate autonomous agent loops, monitor progress, intervene safely when loops stall. | sonnet | Read, Grep, Glob, Bash, Edit | loop-operator.md |
| opensource-forker | Fork any project for open-sourcing. Strips secrets (20+ patterns), replaces internal refs, generates `.env.example`, cleans git history. Stage 1 of opensource-pipeline. | sonnet | Read, Write, Edit, Bash, Grep, Glob | opensource-forker.md |
| opensource-packager | Generate complete OSS packaging for sanitized project. Produces CLAUDE.md, setup.sh, README, LICENSE, CONTRIBUTING, GH issue templates. Stage 3. | sonnet | Read, Write, Edit, Bash, Grep, Glob | opensource-packager.md |
| opensource-sanitizer | Verify OSS fork fully sanitized. Scans for leaked secrets, PII, internal refs, dangerous files (20+ regex). PASS/FAIL/PASS-WITH-WARNINGS report. Stage 2. PROACTIVELY before public release. | sonnet | Read, Grep, Glob, Bash | opensource-sanitizer.md |
| performance-optimizer | Performance analysis and optimization. Bottlenecks, slow code, bundle sizes, runtime perf. Profiling, memory leaks, render optimization. | sonnet | Read, Write, Edit, Bash, Grep, Glob | performance-optimizer.md |
| planner | Expert planning specialist for complex features and refactoring. PROACTIVELY for feature implementation, architectural changes, complex refactoring. | opus | Read, Grep, Glob | planner.md |
| pr-test-analyzer | Reviews PR test coverage quality and completeness, with emphasis on behavioral coverage and real bug prevention. | sonnet | Read, Grep, Glob, Bash | pr-test-analyzer.md |
| python-reviewer | Expert Python code reviewer — PEP 8, Pythonic idioms, type hints, security, performance. MUST BE USED for Python projects. | sonnet | Read, Grep, Glob, Bash | python-reviewer.md |
| pytorch-build-resolver | PyTorch runtime, CUDA, training error resolution. Tensor shape mismatches, device errors, gradient issues, DataLoader, mixed precision. | sonnet | Read, Write, Edit, Bash, Grep, Glob | pytorch-build-resolver.md |
| refactor-cleaner | Dead code cleanup and consolidation specialist. PROACTIVELY for unused code, duplicates, refactoring. Runs knip, depcheck, ts-prune. | sonnet | Read, Write, Edit, Bash, Grep, Glob | refactor-cleaner.md |
| rust-build-resolver | Rust build, compilation, dependency error resolution. Cargo build errors, borrow checker, Cargo.toml problems. | sonnet | Read, Write, Edit, Bash, Grep, Glob | rust-build-resolver.md |
| rust-reviewer | Expert Rust code reviewer — ownership, lifetimes, error handling, unsafe usage, idiomatic patterns. MUST BE USED for Rust projects. | sonnet | Read, Grep, Glob, Bash | rust-reviewer.md |
| security-reviewer | Security vulnerability detection and remediation. PROACTIVELY after code handling user input, auth, API endpoints, sensitive data. Secrets, SSRF, injection, unsafe crypto, OWASP Top 10. | sonnet | Read, Write, Edit, Bash, Grep, Glob | security-reviewer.md |
| seo-specialist | SEO specialist — technical SEO audits, on-page optimization, structured data, Core Web Vitals, content/keyword mapping. | sonnet | Read, Grep, Glob, Bash, WebSearch, WebFetch | seo-specialist.md |
| silent-failure-hunter | Reviews code for silent failures, swallowed errors, bad fallbacks, missing error propagation. | sonnet | Read, Grep, Glob, Bash | silent-failure-hunter.md |
| tdd-guide | Test-Driven Development specialist enforcing write-tests-first. PROACTIVELY for new features, bug fixes, refactoring. Ensures 80%+ coverage. | sonnet | Read, Write, Edit, Bash, Grep | tdd-guide.md |
| type-design-analyzer | Analyzes type design for encapsulation, invariant expression, usefulness, enforcement. | sonnet | Read, Grep, Glob, Bash | type-design-analyzer.md |
| typescript-reviewer | Expert TypeScript/JavaScript reviewer — type safety, async correctness, Node/web security, idiomatic patterns. MUST BE USED for TS/JS projects. | sonnet | Read, Grep, Glob, Bash | typescript-reviewer.md |

---

### Plugin: hr-legal-compliance (1.2.2) — 2 agents

Path: `C:\Users\rmais\.claude\plugins\cache\claude-code-workflows\hr-legal-compliance\1.2.2\agents\`

| Name | Description | Model | Tools | Path |
|---|---|---|---|---|
| hr-pro | Professional, ethical HR partner — hiring, onboarding/offboarding, PTO/leave, performance, compliant policies, employee relations. Asks for jurisdiction first; produces structured, bias-mitigated, lawful templates. | sonnet | (not specified) | hr-pro.md |
| legal-advisor | Drafts privacy policies, ToS, disclaimers, legal notices. GDPR-compliant texts, cookie policies, DPAs. PROACTIVELY for legal docs, compliance, regulatory. | sonnet | (not specified) | legal-advisor.md |

---

### Plugin: quantitative-trading (1.2.2) — 2 agents

Path: `C:\Users\rmais\.claude\plugins\cache\claude-code-workflows\quantitative-trading\1.2.2\agents\`

| Name | Description | Model | Tools | Path |
|---|---|---|---|---|
| quant-analyst | Builds financial models, backtests trading strategies, analyzes market data. Implements risk metrics, portfolio optimization, statistical arbitrage. PROACTIVELY for quant finance, trading algos, risk analysis. | inherit | (not specified) | quant-analyst.md |
| risk-manager | Monitors portfolio risk, R-multiples, position limits. Hedging strategies, expectancy, stop-losses. PROACTIVELY for risk assessment, trade tracking, portfolio protection. | inherit | (not specified) | risk-manager.md |

---

### Plugin: security-compliance (1.2.0) — 1 agent

Path: `C:\Users\rmais\.claude\plugins\cache\claude-code-workflows\security-compliance\1.2.0\agents\`

| Name | Description | Model | Tools | Path |
|---|---|---|---|---|
| security-auditor | Expert security auditor — DevSecOps, comprehensive cybersecurity, compliance frameworks. Vulnerability assessment, threat modeling, OAuth2/OIDC, OWASP, cloud security, GDPR/HIPAA/SOC2, incident response. | opus | (not specified) | security-auditor.md |

---

### Plugin: superpowers (5.0.7) — 1 agent

Path: `C:\Users\rmais\.claude\plugins\cache\claude-plugins-official\superpowers\5.0.7\agents\`

| Name | Description | Model | Tools | Path |
|---|---|---|---|---|
| code-reviewer | Senior code reviewer for completed major project steps. Reviews work against original plan and coding standards; validates feature implementations, API endpoint completion, etc. | inherit | (not specified) | code-reviewer.md |

---

### Plugin: c-level-skills (executive-mentor) — 1 file (no frontmatter)

Path: `C:\Users\rmais\.claude\plugins\cache\claude-code-skills\c-level-skills\2.1.2\executive-mentor\agents\`

| Name | Description | Model | Tools | Path |
|---|---|---|---|---|
| devils-advocate | (no YAML frontmatter — markdown-only role doc) Adversarial thinker for executive decision-making. Examines plans, proposals, decisions from adversarial angle before commitment. | n/a | n/a | devils-advocate.md |

This file uses a non-standard format (no `name:`/`description:` frontmatter), so it may not be loadable as a regular Claude agent — it appears to be a role-prompt include used by the executive-mentor skill.

---

## Creative-relevant agents (filtered)

Filter: design / UI / UX / accessibility, brand / voice / archetype / naming, content / copy / writing, user research / discovery / JTBD, strategy / positioning / market / SEO, creative architect / project planning.

| Name | Source | Description (1-line) | Why creative-relevant |
|---|---|---|---|
| navigator | project | PO's strategic co-pilot, single point of contact, holds full product context | Coordinates dispatch of all creative specialists; cannot run a creative council without it |
| product-designer | project | Owns UX flows, wireframes, surface design, visual system maintenance | Direct UX/UI ownership; uses ui-ux-pro-max + design-system + frontend-design skills |
| brand-strategist | project | Owns naming, brand archetype, tone of voice, taglines | Naming + brand foundation lead |
| brand-voice-curator | project | Maintains taste-reference log, reverse-engineers voice profile | Anchors brand-strategist on PO's actual taste (not borrowed voice) |
| content-lead | project | Landing copy, email sequences, microcopy, paywall, in-product strings | Applies locked tone to every surface |
| user-researcher | project | ICP validation, interview scripts, JTBD statements, opportunity mapping | Discovery/JTBD/Mom Test angle; validates assumptions |
| a11y-architect | plugin: ECC | WCAG 2.2 accessibility architect for Web and Native | Inclusive UX, accessibility audit; pairs well with product-designer |
| seo-specialist | plugin: ECC | Technical SEO, on-page, structured data, Core Web Vitals, content mapping | Landing/SEO content alignment |
| architect | plugin: ECC | Software architecture / system design / scalability for new features and refactoring | "Creative architect" angle — high-level planning across domains |
| planner | plugin: ECC | Comprehensive planning specialist for complex features / architectural changes | Strategic project planning |
| code-architect | plugin: ECC | Designs feature architectures from codebase patterns; gives blueprints | Translates creative spec into engineering blueprint |
| gan-planner | plugin: ECC | Expands one-line prompt into full product spec (features, sprints, eval, design direction) | Spec generation, including design direction |
| chief-of-staff | plugin: ECC | Triage email/Slack/LINE/Messenger; classify; draft replies | Adjacent comms-strategy / messaging triage role |
| hr-pro | plugin: hr-legal | HR partner — hiring, onboarding, PTO, performance, compliant policies | Employer-brand / team-comms adjacent |

---

## Honest caveats

- **User-global agents directory does not exist** (`C:\Users\rmais\.claude\agents\`) — Glob returned 0 files; nothing in `~/.claude/` named `agents`.
- **`devils-advocate.md` (executive-mentor) has no YAML frontmatter** — listed for completeness but may not be a loadable Claude agent in the standard sense.
- **`a11y-architect.md` has duplicate `model` keys** in frontmatter (`sonnet` then `opus`); the effective value depends on YAML parser behavior — most parsers take the last value (`opus`).
- **ECC also ships per-skill `agents/` subdirs** under `1.10.0/.agents/skills/<skill>/agents/` (e.g., `agent-introspection-debugging/agents`, `frontend-design/agents`). These contain agent helpers scoped to the skill, not registered as top-level Claude agents — excluded to avoid noise. If a future audit needs them, they exist and follow the same frontmatter convention.
- **ECC also has localized doc copies** under `docs/{ja-JP, ko-KR, pt-BR, tr, zh-CN, zh-TW}/agents/` — translations of the canonical 47 agents; not separate definitions; excluded.
- **Workflows packages** (`hr-legal-compliance`, `quantitative-trading`, `security-compliance`) use a sparse frontmatter that omits explicit `tools:` — those agents inherit default tool sets at load time. Listed as "not specified" rather than guessing.
- **`superpowers/code-reviewer`** uses `model: inherit` — adopts the parent session's model.
- **No agents found** in `ui-ux-pro-max-skill` and `wondelai-skills` plugin caches — those packages ship skills only, no agent definitions.

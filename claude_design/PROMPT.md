# Промт для Claude Design

## Что я приложил (для тебя, PO)

Папка `claude_design/` содержит весь контекст лендинга Provedo:
- **01_brand/** — бренд, голос, позиционирование, taste-references
- **02_design/** — Design Brief v1.4, design tokens (color/typography/spacing/motion), animations + globals.css
- **03_landing_source/** — текущий код лендинга (page.tsx + 14 компонентов + /disclosures)
- **04_charts/** — 4 анимированных chart-компонента
- **05_recent_critique/** — внутренние audits (synthesis 3 опций редизайна A/B/C + chart audit + hero chat audit + voice review + AI-tool/fintech competitor audits)
- **README.md** — структура папки + quick context

**Как использовать:**
1. Открой claude.ai (или claude.ai/design если доступен)
2. Создай новый чат
3. Загрузи всю папку `claude_design/` (drag-and-drop файлов или zip)
4. Скопируй промт ниже (один блок) и отправь

---

## Промт (копировать целиком, отправить в Claude)

```
I need a fresh, independent design perspective on the Provedo landing page.

## Project context (1 paragraph)
Provedo is a pre-alpha Lane A portfolio AI assistant. «Lane A» means it provides INFORMATION about a user's portfolio (read-only multi-broker aggregation + chat-first answers + retrospective pattern detection) — NEVER personalized investment advice. The product positions in the «friendly information-only» quadrant of fintech voice — between dry information tools (Kubera) and warm advice tools (Magnifi/Getquin). Hero head is locked: «Provedo will lead you through your portfolio.» Tagline is locked: «Notice what you'd miss».

## What I'm uploading
A self-contained snapshot of the current landing in 5 numbered folders:
- 01_brand/ — brand foundation, voice profile, positioning, taste references
- 02_design/ — design tokens (color/typography/spacing/motion in JSON), Design Brief, globals.css, animations.css
- 03_landing_source/ — page.tsx + marketing-layout.tsx + 14 React components + /disclosures route
- 04_charts/ — 4 animated SVG chart components (PnL sparkline, dividend calendar, trade timeline, allocation pie+bar)
- 05_recent_critique/ — my internal team's recent audits, including a Phase 2 redesign synthesis with 3 strategic options A/B/C, a chart-by-chart upgrade audit, a hero chat mockup audit, and a brand-voice review

Read README.md for the file map.

## Hard constraints (please respect)
1. Hero head + sub LOCKED — do NOT propose hero copy changes
2. Naming Provedo LOCKED — do not propose alternative names
3. Visual direction is Modern AI-Tool Minimalist (warm-cream #FAFAF7 + slate-900 + teal-600 #0D9488) + Inter + JetBrains Mono — propose changes WITHIN this palette, not new palettes
4. Lane A discipline — no copy that drifts into «advice / recommendations / strategy / suggestions» (verb allowlist: «provides clarity / context / observation / foresight / leads through»)
5. Archetype balance: Magician + Sage primary, Everyman modifier — proposals should preserve this register, not drift toward Stripe-imperative or Lovable-warm

## What I want from you
Step 1 — Audit (independent of my team's critique):
- Read 01_brand/ + 02_design/ first to absorb the brand
- Open the live preview if possible: https://investment-tracker-web-git-feat-lp-pr-7c8919-ruslan-maistrenko1.vercel.app
- Then read 03_landing_source/ + 04_charts/ to see current implementation
- Form your OWN independent assessment BEFORE reading 05_recent_critique/
- Write a section: «What I see when I land on this page» — first impressions, hierarchy, what works, what's weak, what would surprise me from a 2026 fintech-AI Sage tool

Step 2 — Compare with my team's critique:
- THEN read 05_recent_critique/ files
- Note: my team is already proposing a Chart Proposal B (rebuild Tab 4 + brand-color PnL + polish 2 charts) and Hero ChatMockup Proposal A (polish content + motion + typography)
- Tell me where you AGREE with their direction and where you'd push different

Step 3 — Your design vision:
- Propose the strongest design direction you can imagine for this landing — within the locked constraints above
- Be specific: layout choices, motion choices, typography choices, chart visual language, hero chat surface treatment
- Include 2-3 specific reference brands/sites you'd point at as «landing should feel like X meets Y»
- Tell me what you'd CUT entirely

Step 4 — Concrete next-PR worth of work:
- If I gave you 1 week of design+frontend work, what 5-7 specific changes would you ship?
- Order by user-impact / dev-effort ratio
- Distinguish: «brand-correct polish» vs. «structural redesign»

## Length + format
- Step 1: ~400 words
- Step 2: ~300 words
- Step 3: ~600 words with specific examples
- Step 4: numbered list with effort estimates

## What you should NOT do
- Don't paraphrase my team's critique back to me — give your independent take
- Don't propose changes that violate the 5 hard constraints
- Don't suggest more «AI-tool generic» moves (gradient meshes, abstract 3D, animated particle backgrounds, Stripe-imperative «Build the future of...» CTAs) — those are anti-brand for this tool
- Don't suggest re-positioning toward advice tooling — Lane A is non-negotiable

Begin with Step 1 after reading 01_brand/ and 02_design/.
```

---

## Что делать с ответом Claude Design

Когда придёт ответ:
1. Скопируй его обратно мне — я сравню с тем что наша команда уже предлагает (Proposal B charts + Proposal A hero chat)
2. Если есть что-то новое и сильное — мы добавляем в slice-LP3.3 / 3.4 ИЛИ открываем slice-LP3.5 на дополнительные direction'ы
3. Если ничего нового — подтверждение что мы на правильном курсе, едем как есть

Можешь показать ответ напрямую или просто скопировать ключевые моменты — оба варианта работают.

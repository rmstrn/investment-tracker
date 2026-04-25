# Kickoff — Provedo first-pass landing build + deploy → staging.investment-tracker.app

**DEPLOY TARGET CORRECTED 2026-04-25 by PO (Navigator update):** target is **staging.investment-tracker.app** (existing staging environment), NOT memoro.co. All references к «memoro.co» в этом kickoff to be read as «staging.investment-tracker.app». DNS already configured, deploy pipeline exists (Railway или Fly.io — devops-engineer confirms на дисптче). No domain setup needed для this slice.

**7 open questions RESOLVED by Navigator 2026-04-25:**
1. Footer rename notice — **NO** (cleaner comparison surface)
2. Trial CTA destination — **`#waitlist` anchor** (skip Clerk integration для first-pass; static no-form anchor)
3. DNS access — **N/A** (staging.investment-tracker.app pipeline existing, no DNS work)
4. Robots noindex — **YES** (staging defaults — `<meta name="robots" content="noindex,nofollow">`)
5. Hero/chart visuals — **skeleton blocks** (fastest to ship — placeholder rectangles labeled с category)
6. brand.json productName — **skip** (inline strings для first-pass, не token migration scope)
7. TM filing status — **NOT blocker** (TM filing requires PO manual checks separately; landing build proceeds)

**ADDITIONAL Navigator clarifications:**
- **Strip Clerk `await auth()` call** в `(marketing)/page.tsx` для first-pass (avoid Clerk runtime dependency на staging) — replace с simple static page render. TD-entry для restore on production cutover.
- **Logo wordmark** — first-pass uses inline text «Provedo» в Inter Semibold с tracking-tight. SVG asset = product-designer follow-up artefact (separate slice).

---

# Kickoff — Provedo first-pass landing build + deploy → staging.investment-tracker.app (ORIGINAL TITLE retained for reference)

**Slice ID:** Slice-LP1 (Provedo first-pass landing)
**Date issued:** 2026-04-25
**Issued by:** Tech Lead (Navigator-dispatched)
**Builders:** frontend-engineer (primary) · devops-engineer (deploy)
**Reviewers (post-merge):** code-reviewer · brand-voice-curator (EN guardrail spot-check on tab copy) · product-designer (visual fidelity vs Direction A)
**Bilingual artefact:** RU primary narrative, EN for technical references / file paths / code / acceptance criteria.

---

## 1. Slice scope

### Slice-LP1: Provedo first-pass landing
**One-line goal:** Ship a static, copy-locked Provedo landing page deployed at `https://memoro.co` so PO can do head-to-head comparison vs Claude Design first-pass.

**Why critical / Why now**
- PO готовит параллельный first-pass через Claude Design (pure HTML output). Head-to-head нужен для calibration of «what does Provedo *actually* look like» before any production polish.
- Provedo brand+content+design locked 2026-04-25 (32 раунда workshop + 6-specialist Rule 3). Все load-bearing inputs готовы — нет стратегического незакрытого блокера.
- memoro.co domain — sunk cost, controlled by PO с 2026-04-23. Reuse для first-pass review без second domain-purchase. provedo.ai migration — отдельный slice post-review.

**Acceptance criteria** (full checklist в §4 ниже).

**What is "done"**
- `https://memoro.co` resolves к Provedo landing over HTTPS
- Landing renders all 4 demo tabs + insights + aggregation + footer
- Copy verbatim из `docs/content/landing-provedo-v1.md` v2
- WCAG 2.2 AA contrast confirmed на всех text/interactive surfaces
- Lucide или Heroicons consistent set (no emoji-as-icons)
- Lighthouse CWV: LCP <2.5s · INP <200ms · CLS <0.1 (mobile + desktop)
- Bundle ≤150kb gzipped (landing budget per `~/.claude/rules/web/performance.md`)
- PO can open URL и compare side-by-side с Claude Design output

### Out-of-scope (HARD STOP)

**Do NOT include in this slice:**
1. **Full token migration across `apps/web/`.** v1.4 Provedo tokens (`packages/design-tokens/MIGRATION_PROVEDO_v1.4.md`) — отдельный slice. В этом slice — scope-only к marketing route.
2. **Memoro→Provedo brand string sweep** в `(app)/*` routes (dashboard, chat, insights, positions, accounts) и `(auth)/*` routes — НЕ трогать.
3. **Renaming `brand.productName` в `packages/design-tokens/tokens/brand.json`** — не блокер для landing-route inline-styled approach. Token migration делается отдельно.
4. **Logo SVG wordmark replacement** в `packages/ui/src/components/Logo.tsx` — product-designer владеет SVG asset как separate artefact (см. MIGRATION §14.4). Marketing route может использовать text-based wordmark inline («Provedo» через Inter Semibold) для first-pass.
5. **provedo.ai DNS / migration** — domain owned, но миграция waits на post-review PO call. memoro.co — first-pass deploy target.
6. **Russian copy.** EN-only per content lock (`landing-provedo-v1.md` v2 §10).
7. **Email signup capture / waitlist forms / analytics tracking.** No backend dependency, no API calls. CTAs link to `/sign-up` (existing Clerk route) ИЛИ к anchor / no-op для first-pass.
8. **CI/CD pipeline integration / GitHub Actions deploy.** Manual deploy для first-pass; production CI/CD = отдельный slice when provedo.ai migration time.
9. **A/B variants of hero / paywall optimization.** Single locked phrase per content v2 §1.
10. **Mobile native app references / iOS surface.** Web-only landing.

---

## 2. Implementation plan — frontend-engineer

### 2.1 Anchor

- **Worktree:** `D:\investment-tracker` (main repo, no separate worktree needed for first-pass)
- **Base SHA:** `6811815` (current main tip per session snapshot; rebase if main moved)
- **Branch:** `feat/lp-provedo-first-pass`
- **PR target:** `main`

### 2.2 Existing surface state

**ВАЖНО — текущий `apps/web/src/app/(marketing)/page.tsx` уже существует** и содержит Memoro-era landing (Hero / ThreePillars / TrustStrip + Clerk redirect). Strategy:

- **REPLACE** existing `page.tsx` content fully (Memoro copy → Provedo copy).
- **PRESERVE** Clerk `auth()` + `redirect('/dashboard')` pattern at top of component (signed-in users still redirect; first-pass landing only renders for anonymous).
- **REPLACE** existing `MarketingHeader.tsx` brand strings («Investment Tracker — home» → «Provedo — home») и focus ring color reference (`ring-brand-500` violet → teal per §3.6 inline override).
- **REPLACE** existing `MarketingFooter.tsx` to carry Provedo footer disclaimer verbatim from `landing-provedo-v1.md` §6.

### 2.3 Route scope

**Single route:** `apps/web/src/app/(marketing)/page.tsx` (replace Memoro landing)

**Components needed (all new в `apps/web/src/app/(marketing)/_components/`):**

| Component | Source copy | Notes |
|---|---|---|
| `ProvedoHero.tsx` | `landing-provedo-v1.md` §1 | Headline + sub + dual CTA + small-print. NO email capture для first-pass — primary CTA `Ask Provedo` → `#demo` anchor; trial CTA → `/sign-up`. |
| `ProvedoDemoTabs.tsx` | `landing-provedo-v1.md` §2 | shadcn `Tabs` component. 4 tabs (Why? · Dividends · Patterns · Aggregate). Each tab = mock user-message bubble + mock Provedo-response bubble + chart placeholder (static SVG/PNG из product-designer assets ИЛИ skeleton block). |
| `ProvedoInsightsSection.tsx` | `landing-provedo-v1.md` §3 | Section hero + sub + 3 bullet cards + mid-page brand-world narrative + closing line. |
| `ProvedoAggregationSection.tsx` | `landing-provedo-v1.md` §4 | Section hero + marquee logos. **Use fallback copy «Hundreds of brokers and exchanges»** (NOT «1000+») — tech-lead verification flag in v2 §4 still open, fallback A is safe для first-pass. Logo marquee: static row at first-pass acceptable; CSS-only `@keyframes` infinite-scroll OK if respects `prefers-reduced-motion`. |
| `ProvedoRepeatCTA.tsx` | `landing-provedo-v1.md` §5 | Pre-footer CTA block. |
| `ProvedoFooter.tsx` (replaces existing `MarketingFooter.tsx` for marketing route, OR override its content via prop/conditional) | `landing-provedo-v1.md` §6 | Disclaimer verbatim. Renaming notice **DEFERRED** — see Risk #3 ниже. PO call required before adding. |

**SEO / meta:** Update existing `metadata` export in `page.tsx` per `landing-provedo-v1.md` §7. Use `og:url = https://memoro.co/` (NOT provedo.ai/) — first-pass deploys на memoro.co, og должен match deployed URL. canonical URL same.

### 2.4 shadcn/ui primitives reuse

Existing in repo (`@investment-tracker/ui`): `Button`, `Card`, `CardTitle`, `CardDescription`, `Logo`. Need to add (or import directly from shadcn если уже available): `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`. Verify per `pnpm` workspace structure. Если shadcn `tabs` уже generated — reuse; иначе `pnpm dlx shadcn@latest add tabs` is local-tooling, Rule 1 OK.

### 2.5 Token consumption strategy — scoped inline override

**Decision: scope-limited approach, NOT full migration.**

Reason: full v1.4 token migration (per `MIGRATION_PROVEDO_v1.4.md`) is its own slice (~14-step Phase A-E). В этом slice — landing-only. Two approaches valid; choose **(a) inline CSS variables на marketing-route layout**:

```tsx
// apps/web/src/app/(marketing)/layout.tsx — wrap children в style block
<div
  className="provedo-route flex min-h-screen flex-col"
  style={{
    // Provedo v1.4 tokens scoped to marketing route only
    // Per docs/04_DESIGN_BRIEF.md §3.6 RESOLVED — A2 muted teal LOCKED
    '--provedo-bg-page': '#FAFAF7',
    '--provedo-bg-elevated': '#FFFFFF',
    '--provedo-bg-muted': '#F5F5F1',
    '--provedo-text-primary': '#0F172A',     // slate-900
    '--provedo-text-secondary': '#334155',   // slate-700
    '--provedo-text-tertiary': '#475569',    // slate-600
    '--provedo-border-subtle': '#E2E8F0',    // slate-200
    '--provedo-border-default': '#CBD5E1',   // slate-300
    '--provedo-accent': '#0D9488',           // teal-600 LOCKED
    '--provedo-accent-hover': '#0F766E',     // teal-700
    '--provedo-accent-subtle': '#CCFBF1',    // teal-100
    '--provedo-positive': '#16A34A',         // green-600
    '--provedo-negative': '#DC2626',         // red-600
  } as React.CSSProperties}
>
```

Then в landing components use `style={{ backgroundColor: 'var(--provedo-bg-page)', color: 'var(--provedo-text-primary)' }}` или Tailwind arbitrary values: `bg-[var(--provedo-bg-page)] text-[var(--provedo-text-primary)]`.

**Rationale for inline scope:**
- Existing global tokens (`bg-background-primary`, `text-text-primary`, etc.) point at v1.3 Memoro slate-violet system. Touching them = full migration scope.
- Inline scope в `(marketing)/layout.tsx` обеспечивает Provedo visual без касания Memoro tokens, dashboard, chat, etc.
- Когда full token migration ships (separate slice), эти inline overrides **deletable in single PR** — clean teardown.

### 2.6 Typography

Use Next.js 15 `next/font/google` per MIGRATION §4 (Inter + JetBrains Mono):

```ts
// apps/web/src/app/(marketing)/layout.tsx OR app root if simpler
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--provedo-font-sans',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--provedo-font-mono',
  preload: false, // mono used for tab data only, not above-fold
});
```

Apply variables к marketing layout root, не к `<html>` глобально (preserves Geist в dashboard / chat). RU subset NOT needed — landing EN-only per content lock.

### 2.7 Mock data & charts

**Static / inline mock per tab. NO API calls. NO backend dependency.**

For chart placeholders в demo tabs:
- **Option A (simplest, recommended):** static SVG placeholder rendered inline (можно generate с simple line / bar). product-designer can deliver 4 SVG snippets if нужны — separate dispatch. Для first-pass, frontend-engineer может render basic SVG inline.
- **Option B:** PNG screenshot from product-designer mockups если уже доступны.
- **Option C:** Skeleton block с label («Chart of monthly P&L, sources cited inline») — simplest, valid для first-pass.

**Default: Option C** для unblock; Option A if product-designer turnaround fast.

### 2.8 Mandatory skill invocations (per `.agents/team/frontend-engineer.md`)

Frontend-engineer MUST invoke в kickoff acknowledgment:

1. `everything-claude-code:frontend-design` — anti-template / distinctive design verification (Direction A — Modern AI-Tool Minimalist register)
2. `ui-ux-pro-max --design-system` — full pattern recommendation для landing surface
3. `ui-ux-pro-max --stack nextjs` — Next.js 15 App Router performance patterns (RSC, font loading, image optimization)
4. `ui-ux-pro-max --stack shadcn` — shadcn/ui Tabs/Card/Button conventions
5. `everything-claude-code:accessibility` — WCAG 2.2 AA verification pre-PR
6. **Pre-delivery checklist** mandatory before PR opens (per frontend-engineer.md role spec)

### 2.9 Anti-patterns to avoid (Direction A guardrails)

Per `docs/04_DESIGN_BRIEF.md` §0.1:
- NO purple / violet anywhere (Memoro-era killed по PO calibration)
- NO AI-glow shadow / sparkle iconography / brain-mascot
- NO gradient mesh hero backgrounds
- NO emoji as icons → use Lucide или Heroicons consistent set
- NO «advice / recommendation / strategy» в any Provedo agent-subject sentence (per `BRAND_VOICE/VOICE_PROFILE.md` §«Provedo EN copy guardrails»)

### 2.10 Performance budget (per `~/.claude/rules/web/performance.md`)

| Metric | Target | Verification |
|---|---|---|
| LCP | <2.5s | Lighthouse mobile + desktop |
| INP | <200ms | Lighthouse |
| CLS | <0.1 | Lighthouse |
| Bundle JS gzipped | <150kb | `pnpm build` output / Next.js bundle analyzer |
| CSS gzipped | <30kb | bundle analyzer |
| Fonts | Inter + JetBrains Mono only, both `display: swap`, Inter preloaded | Lighthouse |
| Marquee animation | `prefers-reduced-motion` respected | Playwright DevTools emulation |

---

## 3. Deploy plan — devops-engineer

### 3.1 Target

- **Domain:** `memoro.co` (DNS controlled by PO since 2026-04-23 sunk-cost purchase)
- **Platform recommendation:** **Vercel** (free tier, native Next.js 15 support, automatic HTTPS via Let's Encrypt, no CI/CD overhead)
- **Alternative:** Netlify (also free tier, Next.js adapter; Vercel preferred because zero-config для Next.js 15 RSC)
- **Rule 1 compliance:** Both Vercel free + Netlify free are zero-spend tiers. ✅ No greenlight required. Если quota exceeded для personal account → escalate to PO before paid upgrade.

### 3.2 Build trigger

**First-pass: manual deploy preferred** (review-only target, no continuous deployment yet).

- Step 1: frontend-engineer merges `feat/lp-provedo-first-pass` to `main` (CI green required per project policy).
- Step 2: devops-engineer triggers deploy from `main` via Vercel CLI (`vercel --prod`) или Vercel dashboard import.
- Step 3: DNS configuration (см. §3.3).
- Step 4: HTTPS auto-provisioned by Vercel.
- Step 5: Smoke test (см. §3.6).

**NOT in first-pass:** GitHub Actions auto-deploy on push to main. Manual deploy = simpler rollback, simpler scoping. Auto-deploy CI = separate slice.

### 3.3 DNS configuration

memoro.co — bare apex domain.

**For Vercel:**
1. In Vercel project settings → Domains → Add `memoro.co` + `www.memoro.co`
2. At PO's domain registrar (Namecheap / Cloudflare / wherever memoro.co lives):
   - Apex `memoro.co` → A record pointing к Vercel anycast IP `76.76.21.21`
   - `www.memoro.co` → CNAME → `cname.vercel-dns.com`
3. Wait DNS propagation (5-30 min typical, до 48hr worst case)
4. Verify HTTPS: `curl -I https://memoro.co` should return 200 + valid Let's Encrypt cert

**Action item:** devops-engineer needs **DNS access credentials** for memoro.co — check с PO какой регистрар и есть ли у devops доступ. Если нет — PO performs DNS step manually with devops-provided records.

### 3.4 Environment variables / secrets

**None required.** Landing is fully static. No backend API calls. No Clerk runtime secrets used (Clerk redirect happens server-side, no signed-in users will hit memoro.co для first-pass since traffic = PO + reviewers only).

**Caveat:** existing `(marketing)/page.tsx` uses `auth()` from Clerk. Если Clerk provider не initialized at runtime, `auth()` throws. Mitigation:
- **Option 1:** wrap `auth()` in try/catch — if errors, render landing as anonymous (graceful degradation)
- **Option 2:** Keep Clerk provider в layout; deploy с placeholder Clerk publishable key (anonymous flow only goes through `auth()` returning null `userId`)
- **Option 3 (simplest для first-pass):** strip Clerk auth check from landing entirely, since signed-in redirect is не critical для first-pass review

**Recommendation:** Option 3 — frontend-engineer removes `auth()` + `redirect('/dashboard')` for landing; document как TD-0XX «restore Clerk redirect when memoro.co transitions to provedo.ai production». Trigger: provedo.ai migration slice.

### 3.5 Skills (per devops-engineer role)

- `everything-claude-code:deployment-patterns` — Vercel + DNS pattern check
- `everything-claude-code:canary-watch` — post-deploy 24-hour smoke monitoring (basic uptime / SSL renewal verification, no real production load)

### 3.6 Smoke tests post-deploy

- [ ] `https://memoro.co` returns 200, valid HTTPS, valid TLS cert
- [ ] `http://memoro.co` redirects к HTTPS
- [ ] `https://www.memoro.co` redirects к apex (or vice versa, consistent canonical)
- [ ] Page renders Hero + DemoTabs + Insights + Aggregation + Footer (visual smoke test)
- [ ] All 4 tab triggers click-functional, swap content без console errors
- [ ] No 404s for fonts / images / favicons
- [ ] Lighthouse mobile ≥90 на Performance / Accessibility / Best Practices / SEO

### 3.7 Rollback plan

- DNS unset memoro.co (return к `<empty>` или previous parking page) → instant rollback. TTL <24hr.
- Vercel deploy rollback: Vercel Dashboard → Deployments → previous deployment → «Promote to Production». <1 min.
- Code rollback: revert merge commit on `main`, redeploy. <5 min.

---

## 4. Acceptance criteria (full checklist)

Frontend-engineer must verify ALL before PR opens; devops-engineer verifies §4 deploy items post-deploy.

### Content fidelity
- [ ] Hero copy verbatim из `landing-provedo-v1.md` v2 §1 («Provedo will lead you through your portfolio» / «Notice what you'd miss across all your brokers» / «Ask Provedo» / trial + free CTAs со small-print)
- [ ] Section 2 — 4 demo tabs verbatim из §2 (user-message + Provedo-response для each tab)
- [ ] Section 3 — Insights bullets + mid-page narrative + closing line verbatim из §3
- [ ] Section 4 — Aggregation header verbatim из §4. **Use fallback A copy «Hundreds of brokers and exchanges»** (NOT «1000+»; verification flag still open per content v2 §11.2)
- [ ] Section 5 — Repeat CTA verbatim из §5
- [ ] Footer disclaimer verbatim из §6
- [ ] SEO meta + OG verbatim из §7 (но `og:url = https://memoro.co/` для first-pass — see §2.3 outscope override)

### Brand voice guardrails (5-item EN, mandatory)
- [ ] Zero co-occurrence «Provedo» + (advice / advise / recommendation / recommends / strategy / suggestion / suggests) anywhere в page text
- [ ] All Provedo agent-subject verbs из allowlist (provides clarity / context / observation / foresight; sees / surfaces / shows / cites / connects / notices / holds / reads / answers / leads through)
- [ ] No «provides guidance» (use «provides clarity» per Item 4 splitter)
- [ ] No «to Provedo» as call-to-action verb form (EN restriction)
- [ ] No surveillance-coded verbs («watches / tracks / monitors») для Provedo

### Visual / Direction A
- [ ] Background `#FAFAF7` warm-neutral page bg
- [ ] Text primary `#0F172A` slate-900
- [ ] Accent `#0D9488` teal-600 — applied к primary CTAs / focus rings / link hovers / Provedo-bubble accents (NOT sky-500 — see §3.6 RESOLVED note)
- [ ] Inter font loaded для headlines + body
- [ ] JetBrains Mono для tab data values (numbers / tickers / dates)
- [ ] 1px clean borders на cards (slate-200 subtle)
- [ ] Subtle shadows (no heavy drop-shadows, no AI-glow)
- [ ] Hover/focus/active states designed (not default Tailwind)
- [ ] **No purple / violet anywhere** (zero violet-* classes in landing components)
- [ ] **No emoji as icons** — Lucide или Heroicons consistent set
- [ ] **No gradient mesh / sparkle / AI-cliche** anti-patterns

### Accessibility (WCAG 2.2 AA)
- [ ] Contrast ratios verified all text/bg pairs (axe DevTools clean)
- [ ] Keyboard navigation: all CTAs / tab triggers / footer links Tab-reachable
- [ ] Focus visible on all interactive elements (2px teal-600 outline, 2px offset)
- [ ] Tabs: arrow-key navigation between triggers (shadcn default)
- [ ] Screen reader: section landmarks + skip link
- [ ] `prefers-reduced-motion` respected (marquee / any animations static)
- [ ] Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`
- [ ] All images have meaningful `alt` (or `alt=""` for decorative)

### Responsive (per `~/.claude/rules/web/testing.md`)
- [ ] 320px — no horizontal scroll, hero copy readable
- [ ] 375px — hero CTA stack vertical, demo tabs scroll horizontally if needed
- [ ] 768px — tablet layout, demo tabs side-by-side
- [ ] 1024px — desktop layout
- [ ] 1440px — max-width container caps at sensible breakpoint
- [ ] 1920px — no excessive whitespace, content centered

### Performance (per `~/.claude/rules/web/performance.md`)
- [ ] Lighthouse mobile: Performance ≥90, A11y ≥95, BP ≥95, SEO ≥95
- [ ] LCP <2.5s
- [ ] INP <200ms
- [ ] CLS <0.1
- [ ] JS bundle (gzipped) ≤150kb
- [ ] CSS bundle (gzipped) ≤30kb
- [ ] Inter preloaded; JetBrains Mono lazy-loaded
- [ ] No blocking 3rd-party scripts

### Code quality
- [ ] TypeScript: no `any`, exported components have explicit prop types
- [ ] No `console.log` в production code
- [ ] Files <800 lines (likely <300 each для landing components)
- [ ] Functions <50 lines
- [ ] No magic numbers (or extracted к named constants)
- [ ] `pnpm tsc --noEmit` — zero errors
- [ ] `pnpm eslint` (or biome per project config) — zero errors
- [ ] `pnpm test` — existing landing test (`page.test.tsx`) updated/passing OR replaced with Provedo-specific test

### Deploy (devops-engineer)
- [ ] `https://memoro.co` resolves, valid HTTPS, page renders
- [ ] `http://` → `https://` redirect works
- [ ] Lighthouse on memoro.co ≥90 mobile (real-world incl. CDN latency)
- [ ] DNS A/CNAME records documented в kickoff completion report
- [ ] Vercel project linked в repo (or documented как manual deploy для now)
- [ ] Rollback path tested (devops can articulate the sequence)

### Pre-delivery checklist (frontend-engineer.md mandatory section)
- [ ] All required skill invocations completed (§2.8)
- [ ] Anti-template policy passed (§2.9)
- [ ] Component checklist (per `~/.claude/rules/web/design-quality.md`):
  - [ ] Avoids default Tailwind/shadcn template look
  - [ ] Intentional hover/focus/active states
  - [ ] Hierarchy through scale contrast (not uniform emphasis)
  - [ ] Believable as real product screenshot

---

## 5. Dependencies + parallelization

### 5.1 Parallelization decision: **PARALLEL with sync point at deploy gate**

**Frontend-engineer и devops-engineer работают параллельно** с одним synchronization point:

```
T0: Kickoff dispatched
T0+0h: Both start in parallel
   ├── frontend-engineer: build landing (~4-8h)
   └── devops-engineer: stage Vercel project + verify DNS access (~1-2h)

T1: devops-engineer ready (Vercel project created, awaits build)
T2: frontend-engineer ready (PR opens, code review, merge to main)
T2+15m: devops-engineer deploys from main → memoro.co
T3: Smoke tests + Lighthouse verification
T4: Notify Navigator: «Slice-LP1 deployed → ready for PO comparison»
```

**Why parallel works:**
- devops-engineer не блокируется на code; может предварительно create Vercel project, link к GitHub, configure domain, request DNS access, всё до того как build готов.
- frontend-engineer не блокируется на deploy; builds и locally previews через `pnpm dev`.
- Sync point = merge to main + manual deploy trigger. Manual = simpler чем CI/CD wiring для one-shot.

**Fallback к sequential если:**
- DNS access не availble у devops до того как frontend готов → devops blocks pre-deploy step, frontend-engineer ships PR independently, deploy happens after DNS resolves
- Vercel free-tier quota issue → escalate к PO, не блокирует frontend (которое можно deploy на Netlify alternative или preview URL до решения)

### 5.2 Critical-path estimate

**Optimistic:** 6-8 hours total (frontend ~6h, devops parallel ~2h, deploy ~30min, smoke ~30min)
**Realistic:** 1-2 working sessions (~12-16 hours human-time spread)
**Pessimistic:** 2-3 sessions если DNS access friction or design polish iterations

---

## 6. Risks + mitigations

### Risk 1 — Token migration scope creep (HIGH probability, MEDIUM impact)

**Risk:** Frontend-engineer encounters Memoro-era tokens (`bg-background-primary`, `text-text-primary`, `ring-brand-500`) и решает «better just migrate everything для consistency». Single-PR scope blows up к 14-step Phase A-E migration.

**Mitigation:**
- Kickoff §2.5 explicit: **inline-scoped CSS variables в marketing route only**. Out-of-scope §2 reaffirms.
- Frontend-engineer kickoff acknowledgement must include: «I will NOT touch `apps/web/src/app/(app)/*` routes, `(auth)/*` routes, или `packages/design-tokens/tokens/*`».
- If frontend-engineer encounters пример где inline scope не работает (e.g. `MarketingHeader` shared by /pricing route), file TD-entry, не fix inline. Pricing route может остаться Memoro-era для first-pass — PO not visiting `/pricing` для landing comparison.

### Risk 2 — memoro.co domain confusion (LOW impact, accepted by PO)

**Risk:** Users hitting memoro.co see «Provedo» branding. SEO crawlers index memoro.co с Provedo content. Brand confusion if anyone outside PO+reviewer team finds URL.

**Mitigation accepted by PO:** First-pass review-only; not promoted, not indexed-promoted, no traffic source.

**Two sub-options для footer notice:**
- **Option A (recommended for clarity):** Add small non-blocking footer notice «Renaming to provedo.ai soon» — explicit transparency, low visual cost
- **Option B:** Skip notice — keep landing clean for pure visual comparison vs Claude Design

**PO call needed before frontend-engineer ships footer.** Default to Option B (skip) if no PO answer by build time — cleanest comparison surface; notice can be added in patch PR after PO sees first-pass.

**SEO mitigation:** add `<meta name="robots" content="noindex,nofollow">` к landing для memoro.co stage. Remove when migrating к provedo.ai. This adds zero visual cost и prevents accidental indexing.

### Risk 3 — Design Brief sky-500 references confuse builder (LOW probability, LOW impact)

**Risk:** Some occurrences в Design Brief v1.4 still reference `sky-500` / `sky-400` even though §3.6 RESOLVED locked to `teal-600 #0D9488`. Bulk-replace not done (per Design Brief §3.6 final paragraph: «All sky-500 references in v1.4 spec to be read as teal-600»).

**Mitigation:**
- Kickoff §4 acceptance criteria explicitly says **teal-600 `#0D9488`** (not sky-500).
- Frontend-engineer trust §3.6 RESOLVED note: every sky reference in Design Brief = read as teal in implementation.
- Single source of truth для color values: **THIS KICKOFF §2.5** (`--provedo-accent: #0D9488`). If Design Brief contradicts kickoff in any inline value, kickoff wins.

### Risk 4 — Clerk auth() runtime failure on memoro.co (MEDIUM probability, MEDIUM impact)

**Risk:** existing `(marketing)/page.tsx` has `await auth()` from Clerk. Без Clerk runtime initialized в Vercel deploy, this throws.

**Mitigation:** §3.4 Option 3 — strip Clerk redirect from landing. Anonymous-only first-pass. File TD: «restore Clerk redirect when memoro.co → provedo.ai prod migration».

### Risk 5 — Lighthouse CLS regression from web fonts (LOW probability, LOW impact)

**Risk:** Inter + JetBrains Mono FOIT/FOUT может вызвать CLS spike >0.1.

**Mitigation:** `display: swap` на both fonts; preload Inter only (above-fold critical); JetBrains Mono lazy для below-fold tab data. `next/font/google` handles font-metric-overrides automatically для Inter to minimize CLS. Verify в Lighthouse pre-deploy.

### Risk 6 — Logo wordmark mismatch (LOW probability, LOW impact)

**Risk:** `packages/ui/src/components/Logo.tsx` still says «Memoro» (or «Investment Tracker») — visible в `MarketingHeader`.

**Mitigation:** First-pass approach — render text-based wordmark inline в новом `ProvedoHeader.tsx` (или patch existing `MarketingHeader.tsx` для marketing route only):

```tsx
<Link href="/" aria-label="Provedo — home">
  <span className="font-sans text-xl font-semibold tracking-tight text-[var(--provedo-text-primary)]">
    Provedo
  </span>
</Link>
```

Replaces `<Logo variant="full" size={28} />` для marketing route. Existing `Logo` component untouched. Real SVG wordmark = product-designer follow-up artefact.

---

## 7. Coordination notes

- **Comparison framing:** PO сравнивает с Claude Design first-pass. Ready-for-review preferred over polish-perfect. Don't over-iterate; ship a clean v1, capture feedback in PO comparison session, then iterate в patch PR.
- **TM filing pending:** USPTO TESS / DPMA остальные 4 hits / Provedo Security NL — manual PO actions, NOT blockers для landing build. Only blocker если PO decides «hold all Provedo-branded surfaces до TM clear». Confirm в PO answer на open question (см. §8).
- **Memoro era preservation:** Existing Memoro landing (`page.tsx` original content) preserved в git history at SHA `6811815`. Easy restore if needed.
- **Pricing page (`/pricing`):** out-of-scope. May still show Memoro copy. PO not reviewing pricing для first-pass comparison.
- **Sign-up flow:** trial CTA points to `/sign-up` which goes through Clerk. If Clerk runtime breaks per Risk 4, trial CTA can be `disabled` или anchor to `#waitlist` (no email capture для first-pass).

---

## 8. Open questions для Navigator / PO (resolve before dispatch builders)

1. **Footer rename notice (Risk 2 sub-option):** include «Renaming to provedo.ai soon» footer line YES/NO? Recommend NO (keep landing pure for comparison).
2. **Trial CTA destination:** `/sign-up` (real Clerk flow) OR `#waitlist` anchor (no real form)? Recommend `/sign-up` if Clerk works, else `#waitlist`.
3. **Hero secondary visual:** product-designer delivers static SVG/PNG mock asset для hero, OR frontend-engineer ships без visual (text + CTA only)? Recommend без visual для first-pass speed; add asset patch PR after.
4. **DemoTabs chart placeholders:** product-designer delivers 4 SVG mocks, OR skeleton blocks acceptable? Recommend skeleton blocks (fastest).
5. **DNS access for memoro.co:** does devops-engineer have credentials to PO's domain registrar? If no, PO performs DNS step manually with devops-provided records.
6. **Robots noindex on memoro.co:** confirm OK to add `<meta name="robots" content="noindex,nofollow">` для first-pass stage. Recommend YES.
7. **`brand.json` productName update:** safe to skip для first-pass (using inline strings)? Or update productName="Provedo" в same slice? Recommend skip — token migration owns it later.

---

## 9. Commit structure (per project policy)

**Commit 1 — implementation:**
```
feat(marketing): replace landing with Provedo first-pass build

- Replace (marketing)/page.tsx Memoro hero/pillars/trust → Provedo Hero/DemoTabs/Insights/Aggregation/RepeatCTA/Footer
- Add ProvedoHero, ProvedoDemoTabs, ProvedoInsightsSection, ProvedoAggregationSection, ProvedoRepeatCTA, ProvedoFooter components in (marketing)/_components
- Apply Direction A v1.4 tokens via inline CSS variables on marketing route layout (scope-only; full token migration deferred)
- Load Inter + JetBrains Mono via next/font/google
- Update SEO metadata + OG tags per content/landing-provedo-v1.md v2 §7
- Strip Clerk auth redirect for first-pass deploy compatibility (TD-XXX restore on provedo.ai migration)
- Verbatim copy from docs/content/landing-provedo-v1.md v2
```

**Commit 2 — docs:**
```
docs: close Slice-LP1 Provedo first-pass landing

- Add merge-log entry: SHA <new>, Slice-LP1 merged, deploy target memoro.co
- Add TD-XXX: restore Clerk auth redirect on landing for provedo.ai migration
- Add TD-XXX (P3): full token migration to v1.4 across apps/web (separate slice)
- Add TD-XXX: replace text-based Provedo wordmark with Logo SVG when product-designer asset lands
- Update docs/03_ROADMAP.md: Slice-LP1 → done, link to merge-log
- Update docs/PO_HANDOFF.md §current state: landing on memoro.co, ready for PO/Claude Design comparison
```

---

## 10. Pre-flight checks (frontend-engineer before opening PR)

- [ ] All 8 acceptance categories in §4 ✅
- [ ] All 6 mandatory skill invocations in §2.8 done
- [ ] Local Lighthouse mobile run ≥90 across all 4 categories
- [ ] `pnpm tsc --noEmit` clean
- [ ] `pnpm test` passing (page.test.tsx updated)
- [ ] Visual diff screenshots captured at 320/768/1440 (attach to PR)
- [ ] Brand-voice-curator EN guardrail self-audit (zero «advice/recommend/strategy» co-occurrence)
- [ ] Anti-template policy self-audit (component checklist)

## 11. Pre-flight checks (devops-engineer before deploying)

- [ ] DNS access to memoro.co confirmed (or PO available для manual DNS step)
- [ ] Vercel project created, linked к GitHub repo (or staged для manual import)
- [ ] memoro.co + www.memoro.co added к Vercel project domains
- [ ] Smoke test scripts ready (curl + Lighthouse CLI commands)
- [ ] Rollback sequence rehearsed (Vercel dashboard «Promote previous deployment» path verified)

---

## 12. Report format (both builders, post-merge)

```markdown
### Slice-LP1 completion report

**Frontend-engineer:**
- PR: <link>
- Merged SHA: <hash>
- Local Lighthouse: P=<>, A=<>, BP=<>, SEO=<>
- Files changed: <count>
- TDs filed: TD-XXX, TD-XXX
- Surprises: <any unexpected findings, all → new TDs>
- `git log --oneline -3`:
  <hash> docs: close Slice-LP1 Provedo first-pass landing
  <hash> feat(marketing): replace landing with Provedo first-pass build
  6811815 docs(po-handoff): end-of-session snapshot 2026-04-24

**Devops-engineer:**
- Deployment URL: https://memoro.co
- Vercel project: <project-name>
- DNS records added: <A and CNAME details>
- TLS cert valid: <yes/no, expiry date>
- Lighthouse on production: P=<>, A=<>, BP=<>, SEO=<>
- Rollback tested: <yes/no, screenshot attached>
- TDs filed: TD-XXX (CI/CD auto-deploy when provedo.ai migration), TD-XXX (production observability)

**Combined acceptance:** All §4 boxes checked → ready for PO comparison vs Claude Design first-pass.
```

---

## 13. References

- `docs/04_DESIGN_BRIEF.md` v1.4 (master visual spec; sky→teal §3.6 RESOLVED note authoritative)
- `docs/content/landing-provedo-v1.md` v2 (final EN copy, verbatim source)
- `docs/product/04_BRAND.md` v1.0 (brand foundation)
- `docs/product/BRAND_VOICE/VOICE_PROFILE.md` (5-item EN guardrails — mandatory)
- `packages/design-tokens/MIGRATION_PROVEDO_v1.4.md` (full token migration spec — referenced для color/font values, NOT executed in this slice)
- `~/.claude/rules/web/performance.md` (CWV targets, bundle budgets)
- `~/.claude/rules/web/testing.md` (responsive breakpoints, visual regression)
- `~/.claude/rules/web/design-quality.md` (anti-template policy, component checklist)
- `.agents/team/frontend-engineer.md` (skill invocation requirements, pre-delivery checklist)
- `.agents/team/devops-engineer.md` (deploy patterns, canary watch)

**END Slice-LP1 kickoff**

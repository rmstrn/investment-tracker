# TD-100 Page-Level Disclaimer — Synthesis 2026-04-29

**Workshop dispatch:** legal-advisor + content-lead + product-designer (parallel, isolated contexts).
**Aggregator:** Right-Hand.
**Owner of impl:** frontend-engineer.

## Inputs

- `docs/reviews/2026-04-29-td100-disclaimer-legal.md` — 7-statement regulatory floor; top-3 critical (not adviser / educational / past performance); EU/UK requires explicit «not personalized»; persistent footer; bilingual EN+RU; jurisdiction-neutral phrasing; `[ATTORNEY REVIEW]` pre-production
- `docs/reviews/2026-04-29-td100-disclaimer-copy.md` — 3 variants × 2 langs (A compact / B medium / C verbose); flagged TD-099 cross-cut on «инвестиционные рекомендации»; «стоит» tier-2 hit replaced with «обращайтесь»
- `docs/reviews/2026-04-29-td100-disclaimer-placement.md` — Option A persistent footer (last grid-row of `AppShellClient`, NOT position:fixed); component path `packages/ui/src/components/regulatory-disclaimer/RegulatoryDisclaimer.tsx`; **block-ship gate: WCAG AA contrast on `--color-text-tertiary` fails (#7A7A7A → 4.06:1)**

## Reconciliation — three angles disagree on copy density

- Legal floor: 7 statements minimum
- Content-lead: Variant A (compact, 4 anchors, ~26-28 words) recommended for sticky-footer
- Mismatch: A's 4 anchors covers top-3 critical + one extra, but legal's full floor is 7

**Resolution:** two-tier rendering.
- **Compact (sticky-footer):** Variant B medium — must contain all top-3 critical (legal §1.1 + §1.2 + §1.4) + EU/UK explicit «not personalized» phrase + «Read full disclaimer →» link to `/legal/disclaimer`. ~2 lines mobile.
- **Verbose (`/legal/disclaimer` page):** Variant C — all 7 legal statements rendered as a full page.
- This way persistent surface carries the cross-market floor; remaining statements live one click away.

## Implementation contract — frontend-engineer

### Files (NEW)
- `packages/ui/src/components/regulatory-disclaimer/RegulatoryDisclaimer.tsx` — component with `variant: 'compact' | 'verbose'` + `lang: 'en' | 'ru'` props
- `packages/ui/src/components/regulatory-disclaimer/copy.ts` — copy constants (Variant B compact + Variant C verbose, both EN + RU)
- `packages/ui/src/components/regulatory-disclaimer/index.ts` — barrel
- `packages/ui/src/components/regulatory-disclaimer/regulatory-disclaimer.test.tsx` — Vitest smoke
- `apps/web/src/app/(legal)/legal/disclaimer/page.tsx` — full disclaimer page (route group `(legal)` may need creating; layout can re-use `(app)` shell or be standalone)
- `apps/web/src/app/(legal)/layout.tsx` — minimal shell if needed

### Files (MODIFY)
- `apps/web/src/app/(app)/layout.tsx` — mount `<RegulatoryDisclaimer variant="compact" lang={locale} />` as last child of grid-row container (NOT `position: fixed`)
- `packages/ui/package.json` — if exposing component as subpath, add export entry; else mount via existing `./` index

### Final copy text — synthesised from content-lead + legal

**Compact (Variant B medium, sticky-footer):**

EN:
> Provedo provides information, not investment advice. Past performance does not guarantee future results. Investment decisions remain yours. [Read full disclaimer →](/legal/disclaimer)

RU:
> Provedo предоставляет информацию, не инвестиционные советы. Прошлая доходность не гарантирует будущую. Инвестиционные решения остаются за вами. [Полный текст →](/legal/disclaimer)

Notes:
- Used «инвестиционные советы» rather than «инвестиционные рекомендации» — both are regulatorily-accurate; «советы» avoids the TD-099 forbidden stem `рекоменд-`. Term-of-art valid under MiFID II / 39-ФЗ.
- ~22-25 words EN / ~22-26 words RU. Fits sticky-footer single-line on desktop, 2 lines mobile.
- All 4 anchors present: identity (information not advice), past-performance, ownership-of-decisions, escape-hatch link.

**Verbose (Variant C, full page):**

EN (paragraph-by-paragraph, all 7 legal §1.1–§1.7):
> Provedo is not a registered investment adviser. The information presented is for educational and informational purposes only.
>
> Provedo does not provide personalized recommendations or investment advice tailored to your specific situation, objectives, or risk tolerance.
>
> Past performance does not guarantee future results. Charts and figures shown describe historical or current state of your connected accounts; they do not predict future outcomes.
>
> Provedo does not execute trades, hold custody of your assets, or move money between accounts. All trading and account-management actions are performed by you on your broker's platform.
>
> Account data is sourced from connected aggregators (Plaid, SnapTrade) and synchronized periodically. It may not reflect real-time prices or pending transactions. Verify with your broker before acting on any figure shown here.
>
> For decisions affecting your financial situation, consult a licensed professional appropriate to your jurisdiction.

RU:
> Provedo не является зарегистрированным инвестиционным советником. Представленная информация предназначена для образовательных и информационных целей.
>
> Provedo не предоставляет персональных рекомендаций или инвестиционных советов, учитывающих вашу конкретную ситуацию, цели или толерантность к риску.
>
> Прошлая доходность не гарантирует будущую. Показанные графики и цифры описывают историческое или текущее состояние ваших подключённых счетов; они не предсказывают будущие результаты.
>
> Provedo не исполняет сделки, не хранит активы и не переводит деньги между счетами. Все торговые операции и управление счётом вы выполняете на платформе вашего брокера.
>
> Данные счетов поступают из подключённых агрегаторов (Plaid, SnapTrade) и синхронизируются периодически. Они могут не отражать актуальные цены или незавершённые транзакции. Проверьте у вашего брокера перед действием на основе любой цифры здесь.
>
> Для решений, влияющих на ваше финансовое положение, обращайтесь к лицензированному специалисту в вашей юрисдикции.

Notes:
- Verbose RU note: «инвестиционных советов» (not «рекомендаций») throughout — consistent with compact variant + avoids TD-099 stem; semantically equivalent to «investment advice» under MiFID II Art. 4(1)(4) + 39-ФЗ.
- Aggregators named: Plaid, SnapTrade. NOT individual brokerages (per legal angle).
- «Обращайтесь» replaces «стоит обратиться» (TD-099 tier-2 hit on `стоит`).
- All 7 legal §1.1–§1.7 covered.
- `[ATTORNEY REVIEW]` tag — disclaimer copy needs licensed attorney sign-off before public alpha. File as TD when scheduling alpha launch.

### Mount placement (per product-designer)

`apps/web/src/app/(app)/layout.tsx` final grid-row, NOT `position: fixed`:
```tsx
<RegulatoryDisclaimer variant="compact" lang={locale} />
```

Routes covered (no need to mount per-route):
- `/dashboard`, `/positions`, `/positions/[id]`, `/chat`, `/chat/[id]`, `/insights`, `/accounts` — all in `(app)` group.

NOT mounted in:
- `(marketing)` — separate marketing-disclaimer concern, out of scope
- `(auth)` — no chart content
- root `/` — handled by `(marketing)`
- `/design` — staff-only showcase; verbose link in section instead

### WCAG AA contrast block-ship — token decision

Product-designer flagged: `--color-text-tertiary` (#7A7A7A) fails AA at 4.06:1.

**Synthesis decision:** use existing `--color-text-secondary` token (already AA-compliant) for disclaimer body text. Avoids design-tokens change in this slice.

If `--color-text-secondary` doesn't fit visually (too dark/light), fallback: bump `--color-text-tertiary` from #7A7A7A → #6E6E6E (4.84:1) in `packages/design-tokens/src/`. Run `pnpm --filter @investment-tracker/design-tokens build` to regen.

Default: try `--color-text-secondary` first; only touch design-tokens if visual mismatch.

### Visual specification (per product-designer)

- Background: `var(--color-surface-quiet)` (or similar muted token; do NOT compete with content)
- Typography: Geist body, 12-14px responsive
- Color: `var(--color-text-secondary)` (AA-compliant)
- Border-top: 1px `var(--color-border-quiet)`
- Padding: 12px vertical, 24px horizontal (responsive)
- Link «Read full disclaimer →»: standard link styling using `var(--color-link)` or theme accent

### Responsive

- Mobile (320px+): wraps to 2 lines if needed; no horizontal scroll
- Tablet/desktop: single line
- Print: include disclaimer in print stylesheet (don't hide)

### Theme

- `data-theme="light/dark"`: token-flip via CSS vars (no JS)
- WCAG AA contrast verified in both themes

### A11y

- Semantic `<footer role="contentinfo">` with `aria-label="Lane A regulatory disclaimer"`
- «Read full disclaimer →» link is keyboard-focusable
- No animations on disclaimer itself

### `/legal/disclaimer` page

- Path: `apps/web/src/app/(legal)/legal/disclaimer/page.tsx`
- Layout: minimal `(legal)/layout.tsx` (header + content + footer; can re-use existing footer pattern)
- Renders `<RegulatoryDisclaimer variant="verbose" lang={locale} />`
- Page metadata: `title: "Disclaimer — Provedo"`, locale-aware
- Linked from compact disclaimer + footer of every (app) route

### Tests

- `RegulatoryDisclaimer.test.tsx`:
  - Renders compact variant in EN + RU
  - Renders verbose variant in EN + RU
  - «Read full disclaimer →» link href = `/legal/disclaimer`
  - Has `role="contentinfo"` + `aria-label`
  - WCAG AA contrast for body color ≥ 4.5:1 against background (use computed-style assertion if feasible; manual check otherwise)
- Mount integration: `(app)/layout.test.tsx` (if exists) or smoke check via web build

### Acceptance criteria

- [ ] `RegulatoryDisclaimer.tsx` exists with `variant` + `lang` props
- [ ] Bilingual copy in `copy.ts`: compact + verbose × EN + RU = 4 strings
- [ ] Mounted in `(app)/layout.tsx` as last grid-row, not `position: fixed`
- [ ] `/legal/disclaimer` page renders verbose variant with all 7 legal floor statements
- [ ] WCAG AA contrast verified body text vs background (token choice documented in commit)
- [ ] `pnpm --filter @investment-tracker/ui test` green
- [ ] `pnpm --filter @investment-tracker/web test` green
- [ ] `pnpm --filter @investment-tracker/web build` green
- [ ] Manual visual smoke: `/dashboard` + `/legal/disclaimer` render in both themes
- [ ] No TD-099 forbidden tokens in copy (audit: `recommend / suggest / advise / should / consider / стоит / рекоменд-`); single legitimate exception is «советы / советов / советник» as regulatory term-of-art

## Out-of-scope (file as TDs)

- **TD-105 (P3):** scoped phrase-whitelist for AI-agent quoting disclaimer — currently TD-099 vocabulary gate would block any AI-emitted string containing «инвестиционные рекомендации» or «инвестиционные советы» (the regulatory terms-of-art). When AI agent first emits disclaimer-citing strings, add scoped phrase-whitelist analogous to «Provedo» brand whitelist. Trigger: SLICE-AI-CHARTS-V1 OR first AI-emitted string referencing disclaimer wording.
- **TD-106 (P1, pre-alpha):** `[ATTORNEY REVIEW]` tag — disclaimer copy needs licensed attorney sign-off before any public alpha route exposes user-facing chart content. Route current copy through licensed counsel (PO's call on which firm). Trigger: alpha launch scheduling.
- **`/legal/privacy` + `/legal/terms`:** separate slices, out of TD-100 scope.

## Caveats

- This is internal product-validation. NOT a substitute for licensed counsel review pre-launch.
- Russia (RF) is out-of-scope per Q7 lock 2026-04-23. RU disclaimer ships for CIS non-RF diaspora.

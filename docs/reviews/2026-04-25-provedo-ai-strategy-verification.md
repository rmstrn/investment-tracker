# Provedo .ai Strategy Verification — 2026-04-25

**Verifier:** verification-analyst (Navigator-dispatched)
**Decision context:** PO выбрал Provedo (R32 winner). Audit YELLOW. Стратегия — .ai primary, .com waived.

---

## Phase 1 — provedo.ai availability

| Source | Result |
|---|---|
| WebFetch `https://provedo.ai` | **ECONNREFUSED** — no DNS / no service |
| who.is WHOIS | «No WHOIS data found» |
| whois.com | пустой результат |
| Porkbun, Namecheap, Dynadot, Name.com, Spaceship | прямые quote-страницы заблокированы 403 / loading-placeholders (anti-scrape); manual GUI verification needed pre-purchase |

**Verdict (high-confidence):** provedo.ai **likely available для standard registration**. Нет registry-of-record следов, no parking, no DNS. Премиум-broker маркер (отдельная for-sale страница / зарезервированная цена) **не обнаружен** ни в одном из 6 источников. Если бы был premium hold (>$500), one of registrar lookups would surface it.

**Pricing baseline 2026 (post-March $20 wholesale hike):**
- Spaceship — $68.98/yr (cheapest)
- Dynadot — $85.60/yr
- Namecheap — ~$80/yr (2-yr min ~$160)
- GoDaddy — $194.98 first 2 yrs + $289.98 renewal
- **Mandatory 2-year minimum registration** для всех .ai

**Estimated total:** ~$140–170 за 2 года через Spaceship/Dynadot. Standard reg, no broker.

---

## Phase 2 — TM landscape (revised)

### Critical NEW finding: ДВА Leipzig-Provedo entities (audit captured только один)

| Entity | HRB | Status | Activity |
|---|---|---|---|
| **Provedo GmbH** | 25090 | **EXTINCT** — deleted ex officio 21 Nov 2024 (§ 394 FamFG, lack of assets). Insolvency 26 Nov 2018. Liquidation 5 Feb 2019. | Legacy smart-home apps still stranded в iOS/Android stores. provedo.de **for sale at €1,750** на fruits.co (зомби-asset). |
| **Provedo Software GmbH** | 28698 | **ACTIVE 2025** | Agile software dev / Java / consulting. Active hiring May 2025 (Modern Java Dev, Video Producer, Customer Service). Site `provedo-software.de`. **Не упомянут в исходном namespace audit.** |

### Trademark «provedo agile software»

- Filed **30 Sept 2010** by Synexus Software GmbH (предшественник Provedo GmbH)
- Word-figurative mark (registered, не expired по доступным следам)
- Owner-of-record может быть assigned to Provedo Software GmbH либо stuck в либидации Provedo GmbH
- **DPMA register login требуется** для подтверждения IC classes — manual GUI step

**Likely classes:** IC 9 (software) + IC 42 (software services). Это **наши целевые классы**.

### Viveros Provedo S.A.

- Active 1926-present, Logroño
- IC 31 (live plants — vines, fruit trees, olives) — **cross-class, no conflict**
- Без EUIPO Provedo-mark в открытом search

### Phonetic variants

«Provida» / «Provedere» / «Proveedo» / «Provido» — никаких fintech / AI / financial software hits в открытом search. **Phonetic field clean.**

---

## Phase 3 — Cross-class assessment

| Entity | Their classes | Our IC 9 / 36 / 42 target | Conflict |
|---|---|---|---|
| Provedo GmbH (extinct) | IC 9 / 42 (legacy mark «provedo agile software») | IC 9 / 36 / 42 | **MARK SURVIVES OWNER DEATH** — assigned либо abandoned, требует DPMA проверки. Если still registered и не в abandonment — direct same-class. |
| Provedo Software GmbH (ACTIVE) | IC 9 / 42 (agile software dev) — likely successor of «provedo agile software» mark | IC 9 / 36 / 42 | **DIRECT SAME-CLASS, SAME-INDUSTRY** — software-development to software-product overlap. **Likelihood-of-confusion analysis required.** Mitigant: они B2B custom dev (services), мы B2C product (downloadable app for investment tracking) — different sub-channels, but USPTO/EUIPO examiners могут считать overlap problematic. |
| Viveros Provedo (active) | IC 31 | IC 9 / 36 / 42 | **None.** |

---

## Phase 4 — Recommendation

### Verdict: **GO WITH CAUTION** (was: GO)

| Aspect | Status |
|---|---|
| provedo.ai availability | GO — standard reg ~$140-170/2yr |
| Provedo GmbH (smart-home) | NEUTRAL — entity dead, but mark may persist |
| Provedo Software GmbH (NEW) | **YELLOW-RED** — active, same-IC, same-industry (software). Was missing from original audit. |
| Viveros Provedo (nursery) | GREEN — cross-class |
| Phonetic field | GREEN — clean |

### Pre-purchase checklist (BLOCKING)

1. **PO greenlight** на purchase (Rule 1 — zero spend без approval)
2. **Manual DPMA register search** for «PROVEDO» / «provedo agile software» — capture: current owner, IC classes, status (registered / lapsed / opposition), expiry date. ~15 min, free.
3. **Manual EUIPO eSearch** for «PROVEDO» — IC 9, 36, 42 filter. ~10 min, free.
4. **USPTO TESS** for «PROVEDO» — IC 9, 36, 42. ~10 min, free.
5. **Investigate Provedo Software GmbH** scope deeper — do they have own trademark filing? Are they the assignee of «provedo agile software» mark? Visit `provedo-software.de` directly (was 403 для нашего fetch).
6. **provedo.ai checkout via GUI** — Spaceship первым (cheapest, $68.98/yr) — verify no premium-hold surprise pre-purchase.

### Decision tree

- **GO standard reg** if:
  - DPMA mark «provedo agile software» — **lapsed / abandoned** OR не в IC 9/42 для downloadable consumer apps
  - Provedo Software GmbH — pure B2B services без own product mark
  - .ai не premium

- **WAIT / REVISIT** if:
  - DPMA mark **active в IC 9 для software products** (not just services) — direct hit, требует legal opinion
  - Provedo Software GmbH владеет mark с broad IC 9 scope
  - .ai оказывается premium >$500

- **NO-GO** if all three: active mark + active company + premium domain

### Risk-adjusted note для PO

Original audit YELLOW был underspecified. **Active Provedo Software GmbH (Leipzig, software dev)** меняет geometry: same-IC same-industry coexistence — обычно fine для distinct sub-categories (B2B custom dev vs B2C downloadable app), но требует **explicit legal-advisor sign-off** перед TM filing. Domain purchase ($140) — низкий sunk cost даже если потом TM придётся сменить, но **не запускайте TM filing до DPMA/EUIPO/USPTO direct check**.

---

**Lines:** 109 / 120 budget.

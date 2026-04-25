# Provedo Namespace Audit — Competitive Analysis
**Date:** 2026-04-25
**Method:** WebSearch + WebFetch across App Store / Google Play / web / social / TM / Romance-language register / multi-TLD
**Compared to:** Memoro YELLOW + Lucri YELLOW baselines (2026-04-25)
**Author:** background-dispatched general-purpose agent

---

## Executive verdict

**YELLOW (worse than Memoro on direct app-store collision; comparable to Lucri on Romance-language register; better than both on US TM cleanliness)** — Provedo namespace is occupied by **two substantial established entities**: (1) **Provedo GmbH** — Leipzig German smart-home automation manufacturer, **majority-owned by GASAG (energy utility) since Jan 2017**, with a **live iOS app + live Android app on the German App Store / Google Play under exact name «provedo App»**; (2) **Viveros Provedo S.A.** — Spanish vine + fruit-tree nursery founded **1926 (99-year legacy fortress)**, owns **provedo.com**, "national market leader" in Spain with 4M plants/year production, exports to Iberian Peninsula + Mediterranean. Direct AI-portfolio-tracker collision **not found** — neither occupant operates in finance. But: **provedo.com permanently locked** by 99-year Spanish brand, **provedo App already exists on iOS + Android in DE storefront**, and **«provedo» = 1st-person-singular present indicative of Italian verb «provedere» («I provide»)** — active common-noun status in Italian (same problem as Lucri). Lock viable but namespace is **not «cleaner» than Memoro** — it shifts the friction from European-AI-productivity-adjacent to **dual-fortress** (German smart-home + Spanish nursery legacy) plus active app-store collision in DE storefront.

**PO's stated rejection criterion for Memoro («есть другие приложения с таким названием») applies MORE strongly to Provedo** — Memoro had 1 active iOS/Android app under the same name; Provedo has 2 active apps (iOS + Android) under the literal name «provedo App» from a GASAG-owned smart-home group. This is the opposite of solving the problem PO had with Memoro.

---

## Findings detail

### 1. Apple App Store

| Field | Value |
|---|---|
| Name | **provedo App** |
| Bundle/ID | id1011715007 |
| Developer | **provedo GmbH** (Leipzig, DE; GASAG-owned 56.67% since 2017-01-01) |
| Storefront | DE primary (`itunes.apple.com/de` redirect → `apps.apple.com/de/app/provedo-app/id1011715007`) |
| Category | Home automation / smart home control |
| Description | Apple iOS app to control «provedo micro automation» smart-home system: lighting, sockets, AC, shading, heating, ventilation, motion detection, security, door cameras, alarm — full home-automation suite |
| Sister app | «provedo Starter App» (separate iOS app for systems deployed after 2017-12-31) — **SECOND iOS app from same vendor under same root brand** |
| Status | **Active** (listed on App Advice + AppPure 2024-2025 mirrors); US storefront returned 404 to passive fetch (German storefront only — DE-localized) |
| Threat | **MEDIUM-HIGH** (direct exact-name app-store collision in DE storefront; sister-app duplicates the brand surface) |

Substring noise hits на App Store: PRUVEEO (camera brand, EN), Proveo (separate EN-language app from Doublepoint), Profo, etc. — these are adjacent name-space, not «Provedo» exact.

### 2. Google Play

| Field | Value |
|---|---|
| Name | **provedo App** |
| Package | `net.provedo.automation` |
| Developer | **provedo GmbH** |
| Category | Tools / home automation |
| Last update | Version 1.14 surfaced on apk-dl + apkpure mirrors (no live Play scrape — Apple/Google anti-scrape) |
| Status | **Active** (multiple APK mirror sites carry recent versions) |
| Threat | **MEDIUM-HIGH** (same vendor, exact name, same product surface) |

Direct passive fetch на `play.google.com/store/search?q=provedo&c=apps` surfaced **«provedi.se» from Code Dream** (different name — substring hit). Provedo APK lives под `net.provedo.automation` package — the actual provedo-GmbH app — not surfaced in the search-page snippet but confirmed via APK mirror sites.

Substring noise: provvio, Proove, Projavi, Pruvo — none collide with «Provedo» exact.

### 3. Web products

| Entity | URL | Type | Category | Owner | Scale | Status | Overlap | Threat |
|---|---|---|---|---|---|---|---|---|
| **Viveros Provedo S.A.** | **provedo.com** | Spanish nursery / breeder | Vine plants, fruit trees, olive trees, R&D genetic enhancement | Family-held; founded 1926 by Pedro Provedo, Logroño La Rioja ES | **National market leader Spain**, 4M plants/year, 200+ hectares, 20,000m² greenhouses, exports Iberian + Mediterranean, 7 employees on LinkedIn (size 51-200), 430 LinkedIn followers | **Active 99 years** (founded 1926; legacy fortress) | NONE (agriculture/nursery) | **MEDIUM-HIGH** (.com fortress permanently locked; D&B-listed CIF A26013912; LATAM/EU brand-recognition noise) |
| **Provedo GmbH (Leipzig)** | **provedo-automation.de** + **provedo-software.de** | Smart-home automation manufacturer | Building automation hardware + software (heating/ventilation/shading/lighting/security/comfort) | **GASAG Berliner Gaswerke** (majority owner since Jan 2017, 56.67%) | Award winner: «Best Product» SmartHome Initiative Germany; Energy Awards 2015; products в hospitals/hotels/commercial buildings | **Active** (LinkedIn page live, separate domains active for each subsidiary) | TANGENTIAL (B2B + prosumer hardware/software, not finance — но IS a SaaS-ish app-bearing brand) | **MEDIUM-HIGH** (corporate-utility-backed, app-bearing exact-name competitor in Germany) |
| **provedo software GmbH** | provedo-software.de | Sister entity to Provedo GmbH | Agile software development (separate sub-brand: «provedo automation» appears as one of several «Lösungen / Referenzen») | Likely same group | Unclear scale (separate dev-services brand) | Active | NONE direct, но reinforces «provedo» as multi-entity DE corporate cluster | **LOW-MEDIUM** (brand-cluster reinforcement) |

ProductHunt + Crunchbase: no «Provedo» product or company surfaced. Bing did surface a **PitchBook profile** (`pitchbook.com/profiles/company/171007-48`) for Provedo — passive fetch returned 403 (paywall), but PitchBook listing existence confirms Provedo GmbH appears in private-capital databases as a tracked acquisition target.

### 4. Social presence

| Handle | Platform | Status | Notes |
|---|---|---|---|
| `@provedo` | Instagram | **TAKEN** — owner display name «Lazmar» (passive fetch confirmed handle resolves to active profile shell) | Personal/unrelated handle |
| `@provedoextreme` | X/Twitter | **TAKEN** — surfaced in Bing top-10 results (`x.com/provedoextreme`) | Substring-only handle, owner unconfirmed без login |
| `@provedo` | X/Twitter | Status indeterminate (x.com fetch returned 402 paywall; not surfaced in top Bing X results) | Likely held by personal user — cannot confirm passively |
| Provedo (LinkedIn `/company/provedo`) | LinkedIn | **TAKEN — Viveros Provedo (Spanish nursery)** — 430 followers, Logroño La Rioja, Farming industry, 7 employees | The «cleaner» short-form LinkedIn slug is owned by 99-yr nursery |
| provedo-gmbh (LinkedIn `/company/provedo-gmbh`) | LinkedIn | **TAKEN — Provedo GmbH (smart-home, Leipzig)** | Second LinkedIn presence under same root brand |
| Viveros Provedo Facebook | Facebook | **TAKEN** — `facebook.com/p/Viveros-Provedo-100030929183699/` | Spanish nursery owns FB presence |

Verdict: prime social handles `@provedo` on IG **clearly taken** (personal). Both major LinkedIn slugs (`/company/provedo` + `/company/provedo-gmbh`) **taken by competitors**. This is **worse than Memoro's social posture** (Memoro had `@memoro` taken on IG/X but LinkedIn slug was healthcare LLC only — single-entity social fortress; Provedo has **dual social fortress**: Spanish nursery + German smart-home both occupy LinkedIn space).

### 5. Domain occupants (multi-TLD probe)

| Domain | Status | Holder |
|---|---|---|
| **provedo.com** | **ACTIVE — Viveros Provedo S.A. (Spanish nursery, 1926)** | LATAM/Iberian fortress, **NOT acquirable** (99-yr legacy brand) |
| **provedo.de** | **For sale — €1,750 + VAT via fruits.co premium domain marketplace**, "Verified Seller" anonymous | Domain investor; acquirable but paid-tier (~€2,000+ with VAT/transfer fees). Note: provedo GmbH operates на `provedo-automation.de` + `provedo-software.de` (hyphenated TLD), so root `provedo.de` is held by domain investor, NOT by Provedo GmbH — interesting fact. |
| **provedo.it** | **ACTIVE — paused page** with Italian tagline «idee che parlano di voi! / siamo in pausa, ma ancora per poco…» («ideas that speak about you / we are on pause, but not for much longer») | Italian indie/marketing-shop nascent project; could grow |
| **provedo.ai** | **ECONNREFUSED** | Likely held but not deployed (R32 confirmed; this audit confirms) |
| **provedo.app** | **ECONNREFUSED** | Likely held but not deployed |
| **provedo.io** | **ECONNREFUSED** | Likely held but not deployed |
| **provedo.co** | **ECONNREFUSED** | Likely held but not deployed |
| **provedo.money** | **ECONNREFUSED** | Likely held but not deployed |
| **provedo.es** | **ECONNREFUSED** | Likely held by Viveros Provedo or domain investor (Spain TLD relevant given nursery) |
| **provedo.pt** | **ECONNREFUSED** | Likely held but not deployed |
| **provedo.ro** | **ECONNREFUSED** | Likely held but not deployed |
| provedo-automation.de | **ACTIVE — Provedo GmbH** | Smart-home group hyphenated brand |
| provedo-software.de | **ACTIVE — provedo software GmbH** | Same-group software arm |

**Implication:** The premium **.com is permanently locked** by Viveros Provedo (1926, won't sell). **.de is on sale at €1,750+VAT** — acquirable но paid-tier (Rule 1: requires PO approval). **.ai/.app/.io/.co/.money — ECONNREFUSED status indeterminate**: ECON doesn't confirm available; could be held + firewalled. Final WHOIS via Namecheap/Porkbun required (free, no spend) before lock claim. **Italian .it occupied by paused indie marketing shop** — could either go dormant or revive (unpredictable).

This is **structurally worse than Memoro's domain posture** (where memoro.com/.app/.dev were parked-for-sale by domain investors and acquirable; .ai was the one fortress at $250+ contested). For Provedo, the **most premium TLD (.com) is impossible** at any price.

### 6. Trademark signal

| Mark | Owner | Source | Goods/Class | Status |
|---|---|---|---|---|
| PROVEDO (likely DE/EU TM) | **Provedo GmbH (Leipzig)** | Inferred — company operates продукты under brand 10+ years, GASAG-acquired 2017 implies brand-asset value protection; not surfaced in passive Bing search | Class 9 (software) + Class 11 (heating/ventilation) likely | **Unconfirmed** (DPMA/EUIPO direct query needed; legal-advisor task) |
| PROVEDO (likely ES TM) | **Viveros Provedo S.A.** | Inferred — 99-yr legacy brand, D&B-listed CIF A26013912, almost certainly holds OEPM (Spanish PTO) marks Class 31 (live plants) | Class 31 | **Unconfirmed** but high probability |
| PROVEDO (US filings) | **Not surfaced** в passive Justia/Trademarkia/USPTO indirect search | — | — | **No US TM filings surfaced** for «Provedo» in any class — apparent US clearance signal (subject to legal-advisor verification via direct USPTO TESS query) |

**Implication:** US TM surface is **APPARENT WIN for Provedo** vs Memoro (where Memoro LLC had 4 broad-coverage US filings). EU/DE/ES TM surface — **NOT cleared**: two established entities (Provedo GmbH DE + Viveros Provedo ES) both almost certainly hold TM rights in their respective classes. Class collision direct (Class 36 finance) — none surfaced; cross-class TM coexistence depends on goods/services specifications. **Comprehensive USPTO/EUIPO/DPMA/OEPM clearance required before any public launch with «Provedo» mark.** Per Rule 1, paid TSDR/EUIPO direct queries deferred to PO approval.

### 7. Romance / Latin-language register

| Language | «provedo» reading | Register | Threat |
|---|---|---|---|
| **Latin** | Closest is *provideo* («I provide / I foresee») = pro- («forward») + video («I see») | Classical/medieval Latin | Positioning asset (etymological backstory: «I provide» / «I foresee») |
| **Italian** | **«io provedo»** — 1st-person-singular present indicative of archaic verb **provedere** = «I provide» (modern standard form is *provvedere* with double-v → *provvedo*) | **Active archaic/literary common-verb form** — IT speakers parse «provedo» = «I provide» (slightly archaic but recognizable; modern *provvedo* more common) | **MEDIUM**: in IT market, «Provedo» reads as conjugated verb («I provide»), не coined name. Brand-distinctiveness ceiling lower in IT. **Same structural problem as Lucri (active common-noun in Romance languages).** |
| **Spanish** | Spanish «I provide» is **«proveo»** (NOT «provedo») — verb is *proveer* (regular -er with present *proveo, provees, provee, proveemos, proveéis, proveen*). «Provedo» is **not a Spanish word** | Non-word in modern Spanish | **LOW** — neutral / coinage-feel for Spanish speakers, **but**: «Provedo» **is a Spanish surname** (1 in 46M globally; 103 bearers in Spain — Castile-León, La Rioja, Navarre concentration) — surname-status carries personal-name connotation in Spain |
| **Portuguese** | Variant form referenced in PT dictionaries («provedo de acesso» as alternate spelling); standard PT for «provider» is *provedor* (e.g., *provedor de internet*). «Provedo» **archaic / variant** but recognizable as provider-cognate | Common-noun-adjacent, archaic register | **LOW-MEDIUM**: PT speakers parse «provedo» as truncated/variant *provedor* — not strong distinctiveness, semantic shadow toward «provider/ISP» |
| **Romanian** | Not a standard Romanian word. Closest is *prevedea* («to foresee») which conjugates as *prevăd* (1st-pers-sing). «Provedo» reads as foreign neologism in RO | Non-word in modern Romanian | **LOW** — neutral (better than Lucri's «you work» reading in RO) |
| **English** | «Provedo» **not a native English word**. Etymon-adjacent: *provedore* (archaic, 16-19th c., «one who provides; ship's purveyor / Italian magistrate») — obsolete EN with positive connotation | Archaic/extinct in modern EN | **LOW** — coinage-feel for EN speakers; mild positive connotation if «provedore» echo recognized (rare) |

**Key insight (vs Memoro + Lucri):** Provedo sits in **active archaic-verb territory in Italian** (1st-person-sing of *provedere*) — same structural register as Lucri's IT/PT/RO common-noun status, but **less broad** (Provedo's IT-collision is real; PT/ES/RO collisions weaker than Lucri's). Provedo is **better than Lucri on Romance-language distinctiveness** (only 1 strong language collision: Italian) but **worse than Memoro** (Memoro = pure coined Latin, no living-language conjugated-verb shadow). 

The crucial twist: **«Provedo» = «I provide» in Italian** is **on-message for our positioning** («financial Coach who provides clarity») — same way «Lucri = profits» echoed our finance category. Whether this is brand-asset (etymological poetry) or distinctiveness-drag (IT speakers hear generic verb) depends on positioning angle; for IT-market expansion, it lowers TM distinctiveness ceiling.

### 8. Italy / Spain / Portugal / Germany market specifics

- **Spain:** Viveros Provedo «national market leader» в vine/fruit-tree nursery — high-recognition local brand in agri-sector. Province concentration: La Rioja (HQ), Castile-León, Navarre. **Spain-market launch friction**: brand confusion in print/SEO + .com fortress.
- **Italy:** provedo.it is paused indie marketing-shop landing. Italian-language conjugation collision («io provedo»). Italy-market launch friction: linguistic-distinctiveness drag + nascent indie domain occupant.
- **Portugal:** No active commercial Provedo entity surfaced. Linguistic shadow as truncated *provedor* (provider/ISP). LOW friction.
- **Germany:** Provedo GmbH is **mid-size GASAG-backed smart-home brand**, awarded by SmartHome Initiative Germany, operates iOS + Android consumer apps, runs hyphenated .de domains (provedo-automation.de + provedo-software.de). **DE-market launch friction**: direct iOS/Android app-store collision + corporate-utility-backed competitor + DE LinkedIn slug. **THIS IS THE HEAVIEST FRICTION POINT.**
- **Romania:** No active Provedo entity surfaced. RO-market launch: clean.

---

## Threat-level summary

| Provedo entity | Type | Category overlap | Scale | Threat |
|---|---|---|---|---|
| **Provedo GmbH** (Leipzig, DE; GASAG-owned smart-home) | Manufacturer + iOS app + Android app + 2 DE domains + DE LinkedIn slug | TANGENTIAL (smart-home, not finance — но **app-bearing exact-name competitor**) | GASAG-utility-backed, SmartHome Initiative «Best Product» award, hospital/hotel B2B + prosumer, PitchBook-tracked | **MEDIUM-HIGH** (direct App Store + Google Play exact-name DE-storefront collision + corporate-utility backing) |
| **Viveros Provedo S.A.** (Spain, 1926) | 99-yr nursery + provedo.com fortress + ES LinkedIn slug + Facebook | NONE (agriculture) | National market leader Spain, 4M plants/yr, 200+ ha, exports Iberian + Mediterranean | **MEDIUM-HIGH** (.com permanent lockout + 99-yr legacy brand-recognition fortress in Iberian/LATAM markets) |
| provedo.it «idee che parlano di voi» paused page | Nascent IT marketing shop | UNKNOWN | Solo / paused | **LOW-MEDIUM** (Italian premium TLD held; could revive) |
| provedo.de domain investor | Domain | n/a | For sale €1,750+VAT | **LOW** (acquirable but paid; €2k tier) |
| provedo.ai/.app/.io/.co/.money ECONNREFUSED | Domain | n/a | Status indeterminate | **LOW-MEDIUM** (status TBD; need WHOIS) |
| @provedo IG (Lazmar) + @provedoextreme X | Social handles | n/a | Personal | **LOW** (forces handle suffix) |
| Provedo Spanish surname (~100 bearers) | Personal-name | n/a | Rare surname | **LOW** (cosmetic; ES surname-recognition only) |
| Italian 1st-person-sing «io provedo» («I provide») | Linguistic collision | Active archaic verb | n/a | **MEDIUM** (IT-market distinctiveness drag) |

---

## Comparison Provedo vs Memoro vs Lucri

| Vector | Memoro | Lucri | Provedo |
|---|---|---|---|
| **Direct category collision** (AI portfolio tracker) | NONE | NONE | **NONE** |
| **Adjacent neighbor (active competitor)** | Memoro GmbH AI productivity 2,800+ users (TANGENTIAL — productivity) | 4 BR finance entities (Lucri Capital + Lucri Finanças + Lucri S.A. + LuCri Contabilidade), all B2B BR | **2 substantial fortresses**: Provedo GmbH (DE smart-home, GASAG-backed, **iOS + Android apps**) + Viveros Provedo S.A. (ES nursery, **99 years, owns provedo.com**) — **dual-fortress structure** |
| **App-store presence under exact name** | Memoro GmbH iOS + Android (1 vendor, 2,800 users, productivity category) | NONE surfaced | **Provedo GmbH iOS + Android + sister «provedo Starter App» on iOS — 2 iOS apps from 1 vendor** in DE storefront, home-automation category |
| **TM filings (US)** | Memoro LLC 4 broad US filings 2022 (status unknown without paid TSDR) | No US filings surfaced | **No US filings surfaced** — apparent win |
| **TM filings (EU/local)** | Likely Memoro GmbH DE/EU mark unconfirmed | Multiple BR-INPI Class 36 highly likely | **Likely Provedo GmbH DPMA/EUIPO + Viveros Provedo S.A. OEPM** — **two likely TM holders** in EU |
| **Domain ownership: .com** | .com parked-for-sale (acquirable, paid) | .com parked Coming Soon (acquirable, paid); **.com.br = legacy 1934 fortress** | **.com = 99-yr Spanish nursery FORTRESS — NOT acquirable at any price** |
| **Domain ownership: .ai/.io/.app/.co/.money** | .ai = competitor; .app/.dev parked-for-sale; **.co OURS** | .io/.ai/.co/.money ECONNREFUSED (indeterminate); .app = nascent indie | **.ai/.app/.io/.co/.money ECONNREFUSED** (indeterminate); .de = €1,750 broker; .it = paused indie |
| **Premium domain achievable** | memoro.co (purchased $250) | Workable: lucri.io/.ai/.co/.money если confirmed available | Workable: provedo.co если confirmed available, **но .com permanently locked** |
| **Social handles** | @memoro IG/X taken | @lucri_oficial taken (BR legacy); @lucri X indeterminate; LinkedIn slug contested | **@provedo IG taken (Lazmar)**; @provedoextreme X taken; **dual LinkedIn slug taken (Viveros Provedo + Provedo GmbH)** |
| **Romance-language register** | Coined Latin 1st-pers-sing — not in active common use | Active common-noun in IT/PT/RO (3 languages) | **Active archaic-verb in IT (1 language)**: «io provedo» = «I provide» |
| **Legacy-brand fortress (≥50 yrs)** | None | Yes — Lucri Ltda 1934 (91 yrs) BR distribution | **Yes — Viveros Provedo 1926 (99 yrs) ES nursery — older than Lucri's** |
| **App-store fortress under exact name** | Memoro GmbH (productivity, 2,800 users) — 1 fortress | No app-store fortress | **Provedo GmbH (home-automation, GASAG-backed, 2 iOS apps) — corporate-utility fortress** |
| **Final verdict** | **YELLOW** | **YELLOW** | **YELLOW** (different shape — better US TM; worse on dual-fortress + .com permanent lockout + DE app-store collision) |

---

## Honest assessment

Provedo namespace is **YELLOW, NOT GREEN, and NOT cleaner than Memoro or Lucri**. Different shape of friction, comparable total weight.

**Provedo is BETTER than Memoro on:**
1. **No US TM filings surfaced** (Memoro had 4 Memoro LLC US filings 2022). Apparent US TM clearance — subject to legal-advisor confirmation.
2. **No direct AI-productivity neighbor** with 2,800+ users (Memoro GmbH was the meaningful AI competitor in our prosumer adjacent space). Provedo GmbH is smart-home/B2B, not AI-prosumer.
3. **Provedo GmbH category is further from us** than Memoro GmbH was — building automation hardware ≠ personal-finance software, лучше distance than productivity-AI.

**Provedo is WORSE than Memoro on:**
1. **Two iOS apps + one Android app under exact name «provedo App» from GASAG-owned Provedo GmbH in DE storefront.** Memoro had 1 iOS + 1 Android from Memoro GmbH; Provedo has 2 iOS + 1 Android from Provedo GmbH (provedo App + provedo Starter App). **PO's stated rejection criterion («есть другие приложения с таким названием») applies more strongly to Provedo, not less.**
2. **provedo.com permanently locked** by 99-yr Viveros Provedo nursery. Memoro's .com was parked-for-sale (acquirable). For Provedo, no premium .com path exists at any price.
3. **Dual social-LinkedIn fortress**: both `/company/provedo` (nursery) AND `/company/provedo-gmbh` (smart-home) taken — Memoro had only `/company/memorollc` (single-entity) and the namespace was contested but workable. Provedo's LinkedIn surface is **structurally double-occupied**.
4. **Dual TM-holder structure in EU**: Provedo GmbH (likely DPMA + EUIPO) + Viveros Provedo (likely OEPM) — two cross-class TM blockers, vs Memoro's single Memoro GmbH likely-holder + Memoro LLC US healthcare filings.

**Provedo is comparable to Lucri on:**
1. Romance-language conjugation collision in 1 language (Provedo: IT; Lucri: IT+PT+RO). Provedo's collision is narrower (1 language) but its IT-language reading is **direct verb form on-message** («I provide» — finance/coaching positioning) while Lucri's was «profits» (also on-message). Both create distinctiveness-ceiling drag in EU/LATAM, Lucri broader.
2. Legacy-brand fortress: Lucri = 1934 BR stationery (91 yrs); Provedo = **1926 ES nursery (99 yrs) — older**. Provedo's legacy fortress is **3 years older than Lucri's** and owns the .com (Lucri's owns .com.br only).

**Driver that would change verdict to RED:** HIGH-scale Provedo competitor in finance/portfolio category with public traction. **Not found.** Provedo GmbH operates in DE smart-home; Viveros Provedo in ES agri. Neither overlaps our consumer-fintech category.

**Driver that would push verdict to GREEN:** clean .com + .ai available + no app-store collision + no major TM holders + no Romance-language register collision. **Zero of these are met.**

**Recommendation framing for PO** (decision PO-side, not mine): If PO rejected Memoro on namespace grounds («есть другие приложения с таким названием»), **Provedo does NOT solve that problem — it amplifies it**:
- Memoro had 1 vendor with 1 iOS + 1 Android app under exact name (Memoro GmbH, AI productivity).
- Provedo has 1 GASAG-owned vendor with 2 iOS + 1 Android apps under exact name (provedo App + provedo Starter App, home automation).

**The «other apps with same name» problem is structurally LARGER for Provedo than for Memoro.** Plus Provedo adds a 99-yr legacy nursery that owns the .com permanently — a friction Memoro did not have.

The honest tradeoff for PO:
- **Pick Memoro** → European AI-productivity neighbor (1 app vendor) + US TM-clearance friction + .ai owned by competitor + .co OURS
- **Pick Lucri** → BR finance-class neighbor cluster (4 entities) + .com.br + @lucri_oficial fortress + Romance common-noun in 3 languages + .com parked-acquirable
- **Pick Provedo** → DE GASAG-backed smart-home neighbor (2 app vendor) + ES 99-yr nursery legacy fortress + .com permanently locked + dual LinkedIn slug taken + IT verb-form distinctiveness drag + apparent US TM cleanliness

None of three is clean. **Provedo is the «two-fortress» option** vs Memoro's «one-AI-neighbor» and Lucri's «BR-cluster». PO must trade off:
- Memoro: 1 active app collision, US TM friction, premium .ai owned by competitor
- Lucri: 0 app collisions, 0 surfaced US TM, but 4 BR finance-class entities + Romance-language register breadth + legacy stationery fortress
- Provedo: **3 active app collisions** (2 iOS + 1 Android same vendor), apparent US TM clean, but dual-fortress (DE GASAG smart-home + ES 99-yr nursery) + .com permanently locked + dual LinkedIn

**PO's core rejection criterion («другие приложения с таким названием») places Provedo in the worst position of the three on app-store collision count.**

---

## Caveat

Web/social signal is indirect for scale. Specifically:
- **Provedo GmbH iOS install count + Android install count NOT surfaced** в passive fetch (Apple/Google anti-scrape). Could be <1k or 100k+. Manual App Store/Play visit recommended.
- **Provedo GmbH revenue/employee count NOT surfaced** в passive fetch (PitchBook 403 paywall). GASAG-utility backing implies non-trivial scale, но exact figures unconfirmed.
- **Viveros Provedo revenue NOT surfaced** в passive fetch (D&B preview-only; «national market leader» vendor-stated). 4M plants/year + 200 ha + 7 employees on LinkedIn + size band 51-200 — implies €5-30M revenue range plausibly, но unconfirmed.
- **Domain ECONNREFUSED on .ai/.app/.io/.co/.money/.es/.pt/.ro = status indeterminate** (could be available OR held + firewalled). Final WHOIS via Namecheap/Porkbun required (free, no spend) before lock.
- **DPMA + EUIPO + OEPM direct trademark search NOT executed** в passive fetch (databases require direct queries). Comprehensive TM clearance must be done by legal-advisor before public launch.
- **App Store passive enumeration blocked** by Apple anti-scrape (US storefront 404; DE storefront redirected to live page but rating/install counts not extracted). Cannot rule out additional regional «Provedo» indie iOS apps without manual browse.
- **@provedo X handle status indeterminate** (x.com 402 to passive fetch). Manual login-required check needed.
- **provedo.it status «paused»** — could be defunct placeholder, abandoned indie marketing project, or actively-shipping nascent project. Cannot determine without manual visit + WHOIS.

PO can request deeper scale verification on Provedo GmbH iOS/Android install counts + Viveros Provedo revenue + DPMA/EUIPO/OEPM direct TM search if borderline-MEDIUM-HIGH threats need to be resolved up or down. Sources: provedo.com (Viveros Provedo), provedo-automation.de, provedo-software.de, apps.apple.com/de/app/provedo-app/id1011715007, m.apkpure.com/de/provedo-app/net.provedo.automation, careinvest-online.net/gasag-uebernimmt-mehrheit-an-smart-home-anbieter-provedo, raue.com (Raue LLP advised GASAG on acquisition), pitchbook.com/profiles/company/171007-48 (paywall), de.linkedin.com/company/provedo-gmbh, linkedin.com/company/provedo (Viveros), www.fruits.co/en/domain/provedo.de (broker €1,750), forebears.io/surnames/provedo, en.wiktionary.org/wiki/provedo, context.reverso.net/translation/italian-english/provedo, energyawards.handelsblatt.com/2015/09/07/provedo-gmbh, leipzig.de/news/news/provedo-micro-automation-gehoert-zu-den-besten-smarthome-produkten.

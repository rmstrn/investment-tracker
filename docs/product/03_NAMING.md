# 03 — Naming Workshop (IN PROGRESS)

**Owner:** `brand-strategist` agent (as of 2026-04-23).
**Status (2026-04-23):** PO leans **Memoro** from Round 5 top-3, but wants to see Round 6 alternatives before final lock. Round 6 dispatched in parallel 2026-04-23.

> **[TODO — see `docs/PENDING_CLEANUPS.md` item #4]** Round 5 top-3 (Mneme / Memoro / Noesis) still reads as tie-ranked. Re-annotate with «PO result 2026-04-23: [final name] selected» header when name is locked post-Round-6.
> **[TODO — see `docs/PENDING_CLEANUPS.md` item #1]** `[Name]` / `[Название]` placeholders across ALL docs need substitution with locked name. Same commit as Round 5 annotation.

**Status (2026-04-22):** Name undecided. PO взял паузу на размышление. Все предложенные направления отклонены.

## Criteria locked

- **Length: 1 word ideal, 2 words max** (refined 2026-04-23 by PO)
- **Memorable + meaningful** (refined 2026-04-23): not generic abstract, not descriptive, has semantic content. The user should be able to say "это называется [X], и это про [чувство/идею]".
- Pronounceable in both Russian and English
- **NOT** generic fintech suffixes: `-ly`, `-io`, `fin-`, `wealth-`, `invest-`
- Matches tone: Magician + Everyman (modern, smart, conversational, not corporate)
- Domain `.com` / `.app` / `.ai` realistically obtainable (ideally <$10K)
- No strong trademark conflicts in US (USPTO) + EU (EUIPO)

## Calibration constraint 2026-04-23

PO explicitly cannot provide reference brands («какие бренды нравятся по звуку» — no answer available). Earlier plan to reverse-engineer vibe from references is blocked. Next naming round must:
- Operate within the refined criteria above
- Stay away from rejected directions (see «Directions explicitly tried and rejected»)
- Rely on: archetype (Magician + Everyman) + locked positioning + semantic hook connected to the product (chat/conversation/second-brain/portfolio-lens — not literal «Ask» or «Folio» which are rejected, but conceptually-adjacent evocative words)

## Rounds attempted (all rejected by PO)

### Round 1 — broad brainstorm (18 candidates)

- **Conversation angle:** Ask, Spoke, Envoy, Nod
- **Clarity angle:** Nous, Gist, Clair, Lucid, Verity
- **Modern abstract:** Arc, Axis, Prism, Nimbus, Pulse
- **Premium:** Sage, Quill, Beacon
- **Playful:** Kite

**PO favorite:** **Ask**. `ask.com` is taken (legacy search engine from early 2000s).

### Round 2 — Ask variants + adjacent imperatives

- **Alt spellings:** Asq, Yask, Aska, Asko
- **Adjacent verbs:** Tap, Hey, Reply, Know, Tell

**PO verdict:** "all taken / not available" — rejected.

### Round 3 — Portfolio-root direction ("спроси портфолио")

Domain checks performed via WebFetch:

| Domain | WebFetch status | Interpretation |
|---|---|---|
| ask.ai | Redirect to brokerscrowd | **For sale** via broker ($50K-500K+) |
| ask.app | HTTP 520 | Unclear |
| ask.money | Empty page | Possibly free |
| asq.com | ECONNREFUSED | **Possibly free** |
| asq.app | Sedo parking | **For sale** on Sedo ($500-10K) |
| tap.money | ECONNREFUSED | **Possibly free** |
| hey.money | Empty | Possibly free |
| know.money | Empty | Possibly free |
| yask.com | ECONNREFUSED | **Possibly free** |
| reply.money | Active product | **TAKEN** (stablecoin payments) |
| folio.ai | Spaceship marketplace | **For sale** (premium) |
| folio.chat | Empty | Unclear |
| folio.money | Redirect to expireddomains | Recently expired |
| askfolio.com | Empty | **Possibly free** |
| foli.com | Empty | **Possibly free** |
| foli.app | atom.com (Squadhelp) | **For sale** ($500-10K+) |
| stack.money | Redirect to koipulse | **TAKEN** |
| trove.money | ECONNREFUSED | Possibly free |

**PO verdict:** "все не то" — rejected the entire descriptive direction (AskFolio, Foli, Trove, etc.).

### Round 4 — evocative direction (hinted, not deeply explored)

- **Delphi** — Greek oracle metaphor (place where people asked questions about future)
- **Koan** — zen paradox/question
- **Vessel** — minimal premium container metaphor

**PO verdict:** also "не то". PO wants time to think.

## Open calibration question for next session

**"What 2-3 brand names (any industry, not necessarily finance) do you like the SOUND/FEEL of?"**

Reference examples offered: Notion, Linear, Perplexity, Arc, Stripe, Vercel, Anthropic, Raycast, Rakuten.

Purpose: reverse-engineer the vibe PO wants so next candidates match that feel, not PO's rejection list.

## Round 5 — Mind/memory/second-brain territory (2026-04-23)

**Trigger:** PO locked Option 4 «Second Brain for Your Portfolio» as strategic direction (`DECISIONS.md` 2026-04-23). Naming territory shifted from earlier rounds into mind / memory / brain / knowledge / recall / thought / synapse / cognition. Navigator dispatched brand-strategist with `docs/product/NAMING_ROUND_5_brief.md`.

**Criteria recap (locked):**
- 1 word ideal, 2 words max.
- Memorable + meaningful (semantic content, not generic abstract).
- Bilingual pronounceability: EN + RU primary. English is day-1 launch (PO 2026-04-23); RU secondary parallel.
- Not in rejected-list below.
- Domain indirect signal via WebFetch free pages only. **No purchase, no premium search, no outreach — per `.agents/team/CONSTRAINTS.md`.**

### Round 5 candidates (10)

| # | Name | Semantic rationale | Phonetic (EN / RU / parity) | Archetype lean | Domain indirect signal | Rejected-list check |
|---|---|---|---|---|---|---|
| 1 | **Mneme** | Greek Μνήμη — memory; one of the Greek Muses as «memory of the arts». Compact, evocative, rare enough to own. Direct semantic map to Second Brain memory claim. | EN «ne-mee» (silent M, 2 syl) / RU «мнэ́мэ» (2 syl) / parity: passable — English silent-M is counterintuitive, Russian rendering clean. | Sage-dominant, Magician modifier | `mneme.com` cert issue (unreachable — likely possibly-free or dormant). `mneme.app` ECONNREFUSED (possibly-free). Final verification via Namecheap/Porkbun required. | OK — not in rejected list |
| 2 | **Recall** | English verb «to remember again / retrieve from memory». Direct Second Brain mapping. Imperative reads as brand command («Recall your portfolio»). | EN «rih-call» (2 syl) / RU «реко́лл» (2 syl) / parity: strong — both languages render cleanly, no letter cluster. | Magician + Sage blend | `recall.ai` — **TAKEN** (Series B meeting-recording company, $38M Series B, active product). Strong brand in AI space. `recall.com` likely taken by dictionary/media co. `recall.app` ECONNREFUSED — possibly-free. Final verification required. | OK — not in rejected list |
| 3 | **Cortex** | Brain outer layer, technical/scientific edge. Second Brain literal anatomy. Common in tech (Cortex M processors, Cortex search). | EN «KORE-teks» (2 syl) / RU «ко́ртекс» (2 syl) / parity: strong — clean in both. | Sage-dominant | `cortex.app` → redirect to atom.com (Squadhelp) — **for sale premium, likely $5K-20K range**. `cortex.com` HTTP 522 (Cloudflare error — ambiguous; likely active site). Cortex.ai likely taken by CortexAI observability product. | OK — not in rejected list |
| 4 | **Synapse** | Neural junction — where memory forms. Technical edge, evocative. | EN «SIN-aps» (2 syl) / RU «си́напс» (2 syl) / parity: strong — equal in both. | Sage + Magician | `synapse.com` — **TAKEN** (active product-development firm, 20+ years, Nike/Google/NASA clients). Synapse.app likely taken. Very crowded name in tech. | OK — not in rejected list |
| 5 | **Bodh** | Sanskrit बोध — awakening, knowledge, consciousness. Short, evocative, rare. Cross-cultural resonance (adjacent to Bodhi, Buddha root). | EN «bohd» (1 syl) / RU «бодх» (1 syl) / parity: passable — Russian cluster «дх» uncommon but readable. | Sage-dominant, Magician modifier | `bodh.ai` — **TAKEN** (AI conversational product «Bodhi», memory-retention focus, at capacity / waitlist). Semantic overlap with our space — risky. `bodh.com` likely parked. | OK — not in rejected list |
| 6 | **Noesis** | Greek νόησις — «the act of thinking / intellectual insight». Philosophical pedigree (Husserl phenomenology). Evocative, uncommon, serious. | EN «no-EE-sis» (3 syl) / RU «ноэ́зис» (3 syl) / parity: strong — clean in both. | Sage-dominant (strong) | `noesis.com` ECONNREFUSED (possibly-free or down). `noesis.app` empty page (possibly-free). Final verification required. | OK — not in rejected list |
| 7 | **Ken** | Old English / Scots «knowledge, understanding, range of sight». 3-letter, extremely short, proverbial («beyond my ken»). | EN «ken» (1 syl) / RU «кен» (1 syl) / parity: strong — trivial. | Everyman + Sage | `ken.ai` cert expired (domain may be possibly-free or parked). `ken.app` empty (possibly-free). `ken.com` likely taken by a person. Homonym concern: «Ken» is a common English first name + Barbie-adjacent. | OK — not in rejected list. **Concern: homonym dilution.** |
| 8 | **Lore** | Body of knowledge, tradition of stories. «Portfolio lore» reads as the accumulated knowledge about your holdings. | EN «lor» (1 syl) / RU «ло́ре» (2 syl) / parity: passable — Russian rendering adds syllable. | Sage + Everyman | `lore.com` — **TAKEN** (Lore Systems, sovereign AI control infra for defense/gov, well-funded, 47K+ newsletter subs). `lore.app` socket error (ambiguous). Very crowded brand. | OK — not in rejected list. **Concern: crowded.** |
| 9 | **Memoro** | Latin «I remember» (1st-person singular memorō). Coined feel, invented-but-rooted. «Memoro remembers your portfolio.» | EN «me-MO-ro» (3 syl) / RU «мемо́ро» (3 syl) / parity: strong — clean vowel-heavy flow. | Magician-dominant (coined) + Sage | `memoro.app` empty (possibly-free). `memoro.com` empty (possibly-free). Promising. Final verification required. | OK — not in rejected list |
| 10 | **Mindgrove** | Compound: «mind» + «grove». «Grove» = small tree stand, metaphor for curated/tended collection. Two-word-as-one-word. Evocative, gardenlike. | EN «MAIND-grov» (2 syl) / RU «майндгров» (2 syl) / parity: passable — Russian cluster heavy but readable. | Everyman + Sage | `mindgrove.app` — positioned «A graph for your mind» (possibly early-stage product or placeholder — ambiguous signal). `mindgrove.com` likely available. | OK — not in rejected list. **Concern: «grove» is a crowded SaaS suffix.** |

### Top 3 recommended

**Pick 1 — Mneme**
- Strongest semantic tie to Second Brain: Greek root means «memory» and is literally the mother of the Muses (memory as source of knowledge).
- Empty fintech territory (no known competitor uses this name).
- Indirect domain signal: `.com` unreachable (cert issue — often indicates dormant/possibly-free); `.app` ECONNREFUSED (possibly-free). Final Namecheap/Porkbun check required.
- Phonetic concern: English silent-M («ne-mee» not «m-neem») is a learning moment — real brand-education cost for early adopters. Russian rendering clean («мнэмэ»).
- Rationale: short, evocative, ownable. The silent-M is a memorable-and-meaningful feature if positioned right («like the Muse of memory»); if positioned wrong, it's a phonetic stumbling block.
- **Concern for Russian parallel:** letter cluster «мнэ» uncommon; acceptable but not native.

**Pick 2 — Memoro**
- Latin 1st-person-singular «I remember» is a brand voice all on its own — the product literally says «I remember» when named Memoro. Direct Second Brain identity fit.
- Coined-feel (like Notion, Kubera, Figma) — no pre-existing baggage.
- Indirect domain signal: `.com` and `.app` both empty-page WebFetch (possibly-free on both TLDs). Strong relative to Pick 1.
- Strong bilingual parity — Latin-root vowel-heavy word translates phonetically equivalent in both English and Russian.
- Archetype fit: coined Latin carries Magician (mystical) + Sage (scholarly) without being pretentious.
- **Concern:** 3 syllables is at the upper bound of «memorable short name». Longer than Notion (2) or Stripe (1).

**Pick 3 — Noesis**
- Greek «intellectual act of thinking» — philosophical weight, Sage-archetype match.
- 3 syllables, pronounceable in both languages.
- Indirect domain signal: `.com` ECONNREFUSED (possibly-free or down), `.app` empty page (possibly-free).
- Strong Sage-lean archetype alignment with Second Brain metaphor.
- **Concern 1:** 3 syllables, slightly heavier than Mneme / Memoro.
- **Concern 2:** Greek philosophy pedigree may feel «too academic» for ICP B (AI-native newcomers 22-32); Magician-Sage balance leans too far Sage without Everyman warmth.

### Weakest for Russian parallel use (of the three)

**Mneme** — «мнэмэ» letter cluster «мнэ» is uncommon in Russian; acceptable but not native-feeling. Memoro and Noesis are both stronger in Russian phonetics.

### Open questions for PO (via Navigator)

1. **Silent-M risk in Mneme.** Is the «like the Muse of memory» education burden acceptable, or does it kill the name? PO call.
2. **Homonym concern for Ken.** Ken is a common English first name. Dilution risk vs «ultra-short memorable» benefit — PO preference?
3. **Coined-vs-rooted preference.** Memoro is coined-feel (Latin root but not a living word). Mneme / Noesis are rooted (live Greek words). Is there a preference for rooted-authenticity vs coined-invented-for-us-only?
4. **Russian parallel weight.** EN is day-1 launch; RU is post-launch secondary. How heavily should RU-phonetic parity weight naming decision? If EN-first is strong, can we accept marginal RU-phonetic cost (Mneme case)?

### Rejected-list diff after Round 5

No new entries added to rejected list — all 10 candidates pass the check against previous four rounds' rejected directions (Ask imperatives, Ask creative spellings, Folio roots, evocative trio Delphi/Koan/Vessel). None of Round 5 candidates overlap.

**If PO rejects all 10,** the remaining untapped territory is:
- Russian-source names (Svod, Istok, Vera — still untapped; Svod has a memory/compendium connotation that fits)
- Pure-coined made-up roots (like Figma — no etymological anchor)

### Domain signal summary (indirect only; final verification required)

| Name | .com | .app | .ai | Notes |
|---|---|---|---|---|
| Mneme | cert/unreachable | ECONNREFUSED | not checked | Possibly-free on .com and .app — verify |
| Memoro | empty | empty | not checked | Both possibly-free — strongest signal |
| Noesis | ECONNREFUSED | empty | not checked | Both possibly-free — verify |
| Recall | likely taken | ECONNREFUSED | **TAKEN (Series B meeting-AI co.)** | .ai blocked; check .com + .app |
| Cortex | 522 ambiguous | for sale premium (Squadhelp) | likely taken | $.app $5K-20K estimate via broker — **PO approval required for purchase** |
| Synapse | **TAKEN (product-dev firm)** | likely taken | likely taken | crowded |
| Bodh | likely parked | not checked | **TAKEN (AI memory product «Bodhi»)** | semantic overlap risk |
| Ken | likely taken (person) | empty | cert expired | homonym concern |
| Lore | **TAKEN (AI gov co.)** | socket error | not checked | crowded |
| Mindgrove | likely available | active product («graph for mind») | not checked | suffix concern |

**No domain purchases implied. No trademarks filed. No outreach to any owner.**

## Round 6 — dispatched 2026-04-23 in parallel with decision-lock

**Context.** PO reviewed Round 5 top 3 (Mneme / Memoro / Noesis) + 7 alternates as part of the Option 4 review synthesis 2026-04-23 (`DECISIONS.md` «Option 4 review synthesis: 7 PO decisions locked», Q1). PO indicated **Memoro** as the leading candidate from Round 5 but wants to see additional options before final lock. Round 6 dispatched in parallel with decision-lock (main-context dispatch, not Navigator dispatch) to widen the candidate pool before name-lock.

**Brief (scoped for brand-strategist Round 6):**
- Same criteria as Round 5 (1-2 words, memorable + meaningful, bilingual pronounceability, domains indirect-signal only, no purchase, no outreach per `.agents/team/CONSTRAINTS.md`).
- Territory: **extend** mind / memory / brain / knowledge / synapse / cognition territory from Round 5. Do NOT re-propose the Round 5 ten candidates. Do NOT re-propose any rejected-list direction (Ask imperatives, creative spellings, Folio roots, evocative trio Delphi/Koan/Vessel).
- Adjacent territories worth exploring: Russian-source names (Svod, Istok — still untapped; Svod semantically fits memory/compendium), pure-coined made-up roots (Figma-style, no etymological anchor), two-syllable abstract (Stripe/Vercel/Rakuten phonetic shape), further Greek/Latin beyond what Round 5 covered (Sophia, Pythia, Thoth, Janus, Memor, Mnemos variants).
- Non-criterion: «Second Brain» / «Portfolio Memory» are tagline/brand-world copy, NOT product name (per Q1 lock). Product name does NOT need to mirror the metaphor literally — it needs to be memorable + meaningful + ownable.
- **PO lean note:** Memoro from Round 5 is the leading candidate; Round 6 is a widen-the-pool pass, not a rejection of Memoro. If Round 6 surfaces a stronger candidate, PO will re-compare; if not, Memoro holds the lead and moves toward final lock.

**Status:** RETURNED 2026-04-23.

**Context update at dispatch time:** Tagline «Second Brain for Your Portfolio» is brand-world copy, NOT product name. Hero imperative is locked bilingually («Спроси свой портфель» / «Ask your portfolio»). Geography is global **without Russian Federation as launch market** (CIS diaspora still in scope). Product name must pair naturally with both the imperative hero and the memory-metaphor tagline.

**Directions explored** (untapped after Rounds 1-5):

- **Direction A — Pure coined, no etymological anchor** (Figma / Kubera / Notion / Stripe pattern). 2 syllables max, ownable-by-construction.
- **Direction B — Short EN-native coined, action/verb flavor** (Steady / Cover / Beam / Tally pattern). Not imperative (hero owns that), but verb-adjacent.
- **Direction C — Russian-source single words** (Svod / Istok / Vera pattern). Global-minus-RF geography makes RU-source optional, but retains resonance for RU-speaking diaspora junior ICP.
- **Direction D — Portmanteau / blends** (Robinhood / Brex / Chime / Ledgr pattern). Two-word compression that reads as one coined word.

### Round 6 candidates (12 — 10 strong + 2 DOA documented for thoroughness)

| # | Name | Dir | Semantic rationale | Phonetic (EN / RU / parity) | Archetype lean | Domain indirect signal (.com / .app / .ai / other) | Rejected-list check | Concern flags |
|---|---|---|---|---|---|---|---|---|
| 1 | **Orma** | A | Pure coined. Italian «orma» means «footprint / trace / imprint» — fits the memory-trace-of-your-portfolio metaphor if you reach for it, but shallow enough to read as invented-for-us. Two-syllable vowel-bookended shape (Figma / Notion / Kubera family). | EN «OR-ma» (2 syl) / RU «о́рма» (2 syl) / parity: strong — clean in both. | Magician-dominant (coined) + Everyman modifier | `.com` empty/minimal placeholder (possibly-free); `.ai` empty (possibly-free); `.app` ECONNREFUSED (possibly-free); `.io` empty (possibly-free); `.money` ECONNREFUSED (possibly-free). **Strongest domain signal in Round 6.** Final Namecheap/Porkbun verification required. | OK — not in rejected list | Italian speakers may hear «footprint» consciously — neutral-to-positive semantic map, no negative pull |
| 2 | **Kavo** | A | Pure coined. No dictionary meaning in EN or RU. Two-syllable, consonant-opening, hard-soft shape. Reads as invented (Kavo / Kubera / Rakuten family). | EN «KAH-vo» (2 syl) / RU «ка́во» (2 syl) / parity: strong — trivial in both, though RU «каво» reads colloquially as a non-standard phonetic spelling of «кого» (whom) in casual speech — minor flavor risk. | Magician-dominant (coined) | `.com` ECONNREFUSED (possibly-free); `.app` ECONNREFUSED (possibly-free); `.ai` ERR_TLS_CERT_ALTNAME_INVALID (likely-possibly-free, cert misconfig signals dormant); `.io` empty (possibly-free). Final verification required. | OK — not in rejected list | RU colloquial «каво→кого» flavor is minor but real; could read as «playful mis-spelling» which is off-brand for a finance product |
| 3 | **Nura** | A | Pure coined. Sanskrit-adjacent feel but no direct meaning (Nur is Arabic for «light», Nura is feminine form in some languages — shallow but non-conflicting). Two-syllable, soft-opening. | EN «NOO-ra» (2 syl) / RU «ну́ра» (2 syl) / parity: strong — clean in both. | Magician + Everyman | `.com` timeout (ambiguous); `.app` HTTP 401 (auth wall — signals parked-with-hosting, not necessarily taken); `.ai` for-sale at Spaceship broker (premium); `.io` empty (possibly-free); `.money` ECONNREFUSED (possibly-free). **Weakest of the A-trio on domains — .ai is premium.** | OK — not in rejected list | .ai blocked by broker; light semantic overlap with Arabic feminine name «Nura» (common name, not a brand) |
| 4 | **Lumi** | A | Pure coined. Latin root «lumen» (light) is in the background but the word «Lumi» itself reads as invented. Two-syllable, soft-flowing, warm. Fits «the light that surfaces what you would miss» tagline undertone. | EN «LOO-mee» (2 syl) / RU «лю́ми» (2 syl) / parity: strong. | Magician (light-metaphor) + Sage | `.com` ECONNREFUSED (possibly-free — surprising for a 4-letter); `.app` empty page (possibly-free); `.ai` ECONNREFUSED (possibly-free). **Strong domain signal — verify urgently, likely already gone in one TLD we didn't check.** | OK — not in rejected list | «Lumi» is a common prefix in SaaS (Luminous, Luma AI, Lumi Labs) — phonetic territory is crowded even if exact-match domains look free; trademark risk elevated |
| 5 | **Ember** | B | English noun — «a small glowing piece of coal or wood remaining in a fire». Metaphorical map: «your portfolio is the fire; your second brain keeps the embers glowing — quiet, persistent, always warm, never loud». Short, warm, distinct from typical fintech cold-tech palette. | EN «EM-ber» (2 syl) / RU «э́мбер» (2 syl) / parity: strong — clean in both; RU rendering adds no awkwardness. | Everyman + Magician (warmth-metaphor) | `.ai` empty (possibly-free); `.app` ECONNREFUSED (possibly-free); `.io` empty (possibly-free); `.com` not checked but Ember.js framework owns `emberjs.com` — `.com` likely taken by the open-source framework community. | OK — not in rejected list | **Ember.js (open-source JavaScript framework)** is a well-known developer tool. Phonetic territory is crowded for tech audience; however Ember.js does not own the fintech/finance trademark class — legal clearance still possible |
| 6 | **Tally** | B | English verb/noun — «to count / keep a running total / keep score». Direct semantic map: «your portfolio's tally kept by a second brain». Native EN verb with light RU loan-word pattern. | EN «TA-lee» (2 syl) / RU «та́лли» (2 syl) / parity: strong — clean in both. | Everyman (counting-metaphor) + Sage | `.com` ERR_TLS_CERT_ALTNAME_INVALID (ambiguous; likely taken by a rights-holder); `.app` ECONNREFUSED (possibly-free but…); `.ai` **for-sale at Spaceship broker (premium)**. **`tally.so` is a major SaaS brand** (form builder, 500K+ teams — «doing to forms what Notion did to docs»). | OK — not in rejected list (technically) | **Serious brand crowding.** Tally.so dominates the short-tail Google results for «Tally»; PO would inherit phonetic competition with an established Notion-adjacent SaaS brand. Also: Tally (consumer fintech, ex-credit-card-consolidation company) shut down in 2022 — dormant trademark risk in the financial class. |
| 7 | **Svod** | C | Russian «свод» — (1) vault / compendium / codex; (2) the arch/dome of a vault (architectural); (3) a consolidated collection of knowledge («свод правил» = code of rules, «свод знаний» = body of knowledge). Literal fit: «your portfolio's codex». Short, 1-syllable, strong. | EN «svod» (1 syl) / RU «свод» (1 syl) / parity: passable — English speakers will say «svohd» fluently (similar to «squad», «sword»); initial «sv-» cluster uncommon in English but pronounceable. | Sage-dominant | `.com` HTTP 403 (active server but restrictive — **likely taken by a streaming VOD-related brand**; «SVOD» is the industry acronym for Subscription Video On Demand, which overlaps heavily in search); `.app` 403 (consistent); `.ai` socket-closed (ambiguous); `.money` ECONNREFUSED (possibly-free); `.io` ECONNREFUSED (possibly-free). | OK — not in rejected list | **SVOD = industry acronym for Subscription Video On Demand.** This is a major SEO and disambiguation problem: «svod» in global English search will surface Netflix-class streaming-industry content before any fintech brand. RU audience reads «свод» correctly as «codex» — but global EN launch inherits streaming-industry baggage. |
| 8 | **Vedi** | C | Russian «веди» (imperative of «вести» — lead / conduct / guide) and simultaneously the Slavic archaic letter «ВЕДИ» meaning «to know / knowledge». Direct memory/knowledge mapping. Short, 2-syllable, warm. Also close to Sanskrit «veda» (knowledge) for cross-cultural resonance. | EN «VEH-dee» (2 syl) / RU «ве́ди» (2 syl) / parity: strong — clean in both. | Sage + Everyman (imperative warmth) | `.com` ECONNREFUSED (possibly-free); `.app` empty (possibly-free); `.ai` empty (possibly-free); `.io` **TAKEN** (Vedi is Australian vet-practice SaaS with Sidekick AI, real usage metrics). | OK — not in rejected list | `.io` is taken by an active SaaS (vet-adjacent, has its own AI module called Sidekick) — trademark search should check USPTO «Vedi» in fintech class specifically. The vet-practice brand is a non-competing class, but the name itself is increasingly used in the AI-assistant space. |
| 9 | **Istok** | C | Russian «исток» — source / origin / wellspring. Semantic map: «the source of understanding for your portfolio». Two-syllable, hard-consonant ending. | EN «EE-stok» (2 syl) / RU «исто́к» (2 syl) / parity: passable — English speakers will pronounce cleanly but the phonetic shape is unambiguously foreign, which could be an asset (like Rakuten, Skoda) or a friction (hard to spell from hearing). | Sage + Magician | `.app` **for-sale at Spaceship broker, price $6,999** (within reach but requires PO approval per Rule 1); `.com` timeout (ambiguous); `.ai` ECONNREFUSED (possibly-free). Russian military-industry context («Istok» JSC is a major Russian electronics manufacturer). | OK — not in rejected list | **Russian military-industrial association.** Istok JSC is a sanctioned Russian defense electronics manufacturer — global launch inherits geopolitical baggage in EU + US markets. KILL for geography-without-RF launch. |
| 10 | **Memora** | D | Portmanteau: memory + era («a era of memory», «our memory-era»). Latin-adjacent feel. Direct semantic map to Second Brain metaphor. | EN «meh-MOR-ah» (3 syl) / RU «мемо́ра» (3 syl) / parity: strong. | Magician + Sage | `.com` parked/placeholder; `.ai` **TAKEN — Memora.ai is an active pre-launch memory-product** («Just start typing…», «store and recall information naturally», explicitly positioned against Notion). **Direct competitor in the exact memory/knowledge-capture space.** `.app` timeout. | OK — not in rejected list | **DOA — Memora.ai is a direct adjacent competitor** in the memory-product space (same Notion-category reference point). Cannot use. Documented for thoroughness. |
| 11 | **Portmem** | D | Portmanteau: portfolio + memory. Direct literal compression. | EN «PORT-mem» (2 syl) / RU «портмэм» (2 syl) / parity: weak — RU rendering reads awkwardly, «port» as a root sounds like «портал / портье», «мэм» is not a native root. | Sage | `.com` **TAKEN — PortMem is an active enterprise SaaS** at v0.1 Research Preview, explicitly «working with enterprise partners in finance and legal to validate the system in production». **Direct competitor in finance memory-persistence space.** | OK — not in rejected list | **DOA — PortMem.com is an active enterprise finance-memory product.** Direct competitor. Cannot use. |
| 12 | **Reckon** | B | English verb — «to calculate / figure / consider / suppose». Action-flavor, native EN verb, memory-and-inference-adjacent. | EN «REK-un» (2 syl) / RU «ре́кон» (2 syl) / parity: strong. | Everyman + Sage | `.com` **TAKEN** by Reckon (Australian accounting/payroll SaaS, active major brand, SMB accounting category). `.app` for-sale at Dynadot broker. | OK — not in rejected list | **DOA — Reckon.com is an established Australian accounting SaaS brand in the finance-adjacent class.** Direct trademark conflict. Cannot use. |

### Round 6 domain signal summary (indirect only, final verification required)

| Name | .com | .app | .ai | Other | Verdict |
|---|---|---|---|---|---|
| Orma | empty placeholder | ECONNREFUSED | empty | .io empty, .money ECONNREFUSED | **Strongest** — possibly-free across all checked |
| Kavo | ECONNREFUSED | ECONNREFUSED | cert-invalid | .io empty | **Strong** — possibly-free signals; verify |
| Nura | timeout | HTTP 401 auth wall | premium broker (Spaceship) | .io empty | Mixed — .ai is broker-premium |
| Lumi | ECONNREFUSED | empty | ECONNREFUSED | — | **Strong** but likely too-good-to-be-true for 4-letter; verify urgently |
| Ember | not checked (.com — Ember.js community owns mindshare) | ECONNREFUSED | empty | .io empty | Strong for .ai/.app/.io; .com likely crowded |
| Tally | cert-invalid | ECONNREFUSED | premium broker | — | Weak — tally.so is dominant SaaS brand |
| Svod | 403 active server | 403 | socket-closed | .money ECONNREFUSED, .io ECONNREFUSED | Weak — SVOD industry-acronym conflict |
| Vedi | ECONNREFUSED | empty | empty | .io TAKEN (Australian vet SaaS) | Mixed — .io taken compromises trademark |
| Istok | timeout | **for-sale $6,999** Spaceship | ECONNREFUSED | — | **DOA — Russian defense-industry association (Istok JSC)** |
| Memora | parked | timeout | **TAKEN (direct competitor)** | — | **DOA — memora.ai is direct memory-product competitor** |
| Portmem | **TAKEN (direct competitor)** | not checked | not checked | — | **DOA — finance-memory enterprise SaaS** |
| Reckon | **TAKEN (Australian accounting SaaS)** | for-sale Dynadot | not checked | — | **DOA — finance-adjacent trademark conflict** |

**No domain purchases implied. No trademarks filed. No outreach to any owner. All WebFetch signals are indirect and require Namecheap/Porkbun confirmation before any lock.**

### Round 6 top 3 — ranked against Memoro (Round 5 benchmark)

**Memoro baseline recap:** Latin 1st-person-singular «I remember», 3 syl, `.com` + `.app` possibly-free signals (Round 5). Archetype: Magician + Sage. Strongest bilingual parity. Concerns: 3 syllables (upper bound of «memorable short»); coined-but-Latin-rooted rather than fully invented; when paired with tagline «Second Brain for Your Portfolio» reads as brand-world redundancy («memory-named product for a memory-metaphor tagline»).

---

**Pick 1 — Orma**

*Why it could beat Memoro:* Shorter (2 syl vs 3). Pure-coined — no etymological redundancy with the memory-metaphor tagline, so product-name and tagline do different jobs (tagline carries the metaphor; name carries the mark). Strongest Round 6 domain signal: empty placeholder or ECONNREFUSED across `.com`, `.app`, `.ai`, `.io`, `.money` — closest to a clean sweep we've seen across 6 rounds. Phonetic shape (vowel-bookended 2-syllable) sits in the Figma / Notion / Kubera family — proven modern-SaaS sound. Pairs clean with the imperative hero: «Ask Orma» reads as talking to a named assistant, which reinforces the second-brain relationship without the name itself saying «memory».

*Why it is a peer of Memoro (not strict upgrade):* Italian speakers will hear «footprint / trace» consciously — this is a neutral semantic (and arguably on-brand: «your portfolio's trace»), but it means Orma is not strictly etymologically neutral. For a brand claiming «memory», «trace» is close enough to be a happy accident, but not a deliberate Latin-rooted claim like Memoro's «I remember». Memoro makes a declarative statement in the name; Orma makes a sound with a quiet semantic shadow.

*Trade-off vs Memoro:* Orma wins on length + domain cleanliness + tagline-relationship; Memoro wins on declarative semantic clarity + stronger «say-what-you-mean» positioning fit.

---

**Pick 2 — Kavo**

*Why it could beat Memoro:* Fully invented — no etymological anchor at all, closest to the Figma / Stripe / Kubera pattern the brief called out. 2-syllable CV-CV shape with a hard opening consonant gives it more phonetic distinctiveness than Orma's softer vowel-bookended shape. Domain signals broadly possibly-free across `.com`, `.app`, `.ai`, `.io` (with cert-invalid on `.ai` likely indicating dormant rather than active).

*Why it is NOT strictly better than Memoro:* RU-speaking diaspora audience may read «каво» as a playful mis-spelling of «кого» (whom) — this is a minor flavor note, not a disqualifier, but it means the RU parallel is not strictly clean the way Memoro is. Also: no semantic anchor at all means the brand has to do 100% of the meaning-making through copy and experience; for a category («second brain for investing») that is still being invented, a word that carries some semantic shadow may do more work than a fully abstract mark.

*Trade-off vs Memoro:* Kavo wins on pure-coined ownability + phonetic distinctiveness; Memoro wins on semantic work-done-by-the-name + RU-phonetic cleanness.

---

**Pick 3 — Ember**

*Why it could beat Memoro (different axis):* This is the most different-axis pick in Round 6. Ember introduces a **warmth/light metaphor** into what is otherwise a memory/cognition naming territory — which, paired with the «Second Brain for Your Portfolio» tagline, gives the brand a two-layer metaphor structure (second brain = memory; ember = the quiet glow of knowledge). This is closer to what Notion does with «notion» (the word is warmth-adjacent, not storage-adjacent, and that tension makes the brand feel alive rather than literal). Short, native-EN, cleanly bilingual. Domain signal strong on `.ai`, `.app`, `.io`.

*Why it is NOT strictly better than Memoro:* `.com` is almost certainly ceded to the Ember.js open-source community (the Ember.js framework has been a visible dev tool since 2011). For a developer-adjacent audience (ICP A Notion/Obsidian cohort), «Ember» will have an unavoidable JavaScript-framework association — this is not a trademark conflict (different classes) but a cultural-recall conflict. If we could acquire `ember.money` or `ember.app` that would blunt the issue, but the phonetic territory itself is compromised for the technically-literate segment of the ICP.

*Trade-off vs Memoro:* Ember wins on metaphor-layering + warmth-tone + memorability for a broad audience; Memoro wins on cultural-recall cleanness for tech-native audience + direct tagline-fit.

---

### Recommendation

**Memoro stays as the lead, but Orma deserves serious PO consideration as a tied peer.**

Honest assessment:
- **Memoro is not dethroned.** 10 of the 12 Round 6 candidates have material issues (DOA competitors on exact-match domains × 3, trademark conflicts × 2, premium-broker blockers × 2, phonetic crowding × 3). This itself is signal — the naming problem is genuinely hard at round 6, and Memoro's profile (possibly-free on `.com` and `.app`, clean bilingual phonetics, direct semantic fit) is rarer than it looks.
- **Orma is the only Round 6 candidate that is a clean peer to Memoro on trade-offs.** It loses declarative semantic specificity but wins on length, domain cleanliness, and tagline-name separation (which is arguably a feature, not a bug, once the tagline does the memory-metaphor work).
- **Kavo is a plausible upgrade axis if PO prefers fully-invented-Figma-style** over coined-Latin-rooted. Currently a step behind Orma on cleanness because of the RU-colloquial flavor note.
- **Ember is a metaphor-axis alternative, not a domain-axis winner.** Include it only if PO actively values the warmth-metaphor layering.

**Suggested PO decision path:**
1. If PO values declarative semantic fit + RU-phonetic cleanness → **lock Memoro**.
2. If PO values maximum ownability + tagline-name separation → **lock Orma**.
3. If PO wants one more round with pure-Figma-style fully-abstract candidates → **Kavo is the starting point**, Round 7 would expand into that territory.

Three of four Direction-D (portmanteau) candidates came back dead-on-arrival (Memora, Portmem, plus earlier Remembr ambiguous) — this signals that the portmanteau territory for memory+finance has already been colonized by active or pre-launch products. Direction D is effectively closed for this brand.

### Round 6 open questions for PO

1. **Orma vs Memoro — does the tagline-name separation (Orma = abstract mark, tagline = metaphor) read as more or less coherent than the tagline-name alignment (Memoro = memory, tagline = memory)?** This is the core aesthetic-strategy call; brand-strategist cannot decide it without PO input.
2. **How much weight to put on the «Italian `orma` = footprint» shadow semantic?** Neutral-positive in our read; PO may read it as «too European», «too quiet», or «perfect».
3. **Ember vs cultural-recall cost.** If ICP A is Notion/Obsidian cohort (productivity-native, likely dev-adjacent), Ember.js framework association is a real cost. Is this disqualifying for PO, or acceptable («most users will never know»)?
4. **Pure-coined (Kavo) depth pass — Round 7?** If PO wants more Figma-style fully-invented options, that is Round 7 brief territory. Current Round 6 pass produced Orma (coined-with-semantic-shadow), Kavo (fully-coined), Lumi (coined-Latin-adjacent), Nura (coined-Sanskrit-adjacent) — only Kavo is strictly fully-invented, the rest have etymological shadows.

### Round 6 rejected-list diff

No new entries to add to the rejected-direction list — the Round 6 candidates span four directions (pure-coined / EN-native-action / RU-source / portmanteau) that are each still partially open after Round 6. What IS rejected (case-by-case, not direction-level):

- **Istok** — Russian defense-industry association (Istok JSC); not suitable for global-minus-RF launch.
- **Memora** — Memora.ai is direct memory-product competitor at launch capture stage.
- **Portmem** — Portmem.com is active finance-memory enterprise SaaS.
- **Reckon** — Reckon.com is major Australian accounting SaaS with existing finance-class trademark.
- **Orva** — Orva.com is active 75-year e-commerce brand (footwear/apparel merchandising).
- **Ovra** — Ovra.com is active French artisan-marketing SaaS.
- **Ludo** — Ludo.ai is active AI game-dev platform (Unity/Ubisoft customers).
- **Beam** — Beam.ai is active enterprise AI automation (Fortune 500).
- **Fathom** — Fathom.ai is active meeting-notetaker (300K+ companies), Fathom.com is Fathom Analytics.
- **Gist** — Gist.ai is active AI-visibility platform (ProrataAI, DoorDash/Fortune customers).
- **Arva** — Arva.ai is active AI-compliance platform for financial institutions (direct regulatory-adjacent conflict).
- **Bearing** — Bearing.ai is active maritime AI platform (Forbes AI 50).
- **Keen** — Keen.com is active psychic-services platform (wrong brand vibe).
- **Poise** — Poise.com is major consumer health brand (Kimberly-Clark).
- **Savvy** — Savvy.com is active vacation-rental platform.
- **Cover** — Cover.ai is active school-safety tech company (TechCrunch-covered).
- **Yasno** — Yasno.ai is active Russian AI image/text generator; Yasno.com is personal blog in political commentary.
- **Cove** — Cove.app is for-sale premium at Spaceship.
- **Tenet** — Tenet.ai priced at $16M broker listing; Tenet.app at $99K.
- **Grasp** — Grasp.app is GoDaddy for-sale premium listing.
- **Nira** — Nira.app is active 3D visualization SaaS; Nira.ai is Spaceship premium broker.
- **Liva** — Liva.app is Brazilian health company (livasaude.com.br).

These 22 are added to the case-by-case domain-conflict list (separate from the direction-level rejected list which remains: Ask imperatives, creative spellings, Folio roots, Delphi/Koan/Vessel trio).

---

## Next session actions (post-Round-5)

1. PO reviews Round 5 top 3 (Mneme / Memoro / Noesis) + 7 alternates via Navigator.
2. PO answers open questions (silent-M risk, coined-vs-rooted preference, RU phonetic weight).
3. Shortlist converges to 2-3 candidates.
4. Shortlist gets final domain verification (free Namecheap / Porkbun / Cloudflare Registrar search) + USPTO / EUIPO trademark check (free public search).
5. If shortlist name sits on broker (e.g. Cortex on Squadhelp), estimate range reported to PO; **no purchase without PO approval.**
6. Lock name → move to brand foundation (logo, palette, typography, `04_BRAND.md`) → CD brief.

## Notes

- Until name locked, all landing copy uses `[Название]` placeholder
- Footer disclaimer has `[Название]` / `[Name]` placeholder
- Domain WebFetch is indirect signal only — final check must be via Namecheap / Porkbun / Cloudflare Registrar
- Trademark check not yet performed on any candidate (since no name locked)

## Directions explicitly tried and rejected (don't re-propose)

- Ask and all short imperative verbs (Ask, Tap, Hey, Reply, Know, Tell)
- Ask creative spellings (Asq, Yask, Aska, Asko)
- Portfolio/folio roots (Folio, Foli, AskFolio, Trove, Stack)
- First-pass evocative trio (Delphi, Koan, Vessel)

## Directions NOT yet tried (worth exploring if Rounds 5-6 rejected)

- Latin/Greek single words beyond Delphi/Koan/Mneme/Noesis (Sophia, Pythia, Thoth, Janus) — some Greek covered in Round 5; Latin covered in Round 5 (Memoro)
- **Deeper pure-coined Figma-style pass** — Round 6 surfaced one strictly fully-invented candidate (Kavo); a Round 7 brief could explore this territory more thoroughly (3-letter roots, consonant-cluster shapes, rare-phoneme starters)
- Reference-driven — blocked until PO provides reference brands

**Round 5 territory covered:** mind / memory / brain / knowledge / recall / cognition — 10 candidates produced 2026-04-23.
**Round 6 territory covered:** pure-coined (A), short EN-native action (B), Russian-source single words (C), portmanteau (D) — 12 candidates produced 2026-04-23; 6 survive trademark/domain filter; 22 case-by-case names added to conflict list.

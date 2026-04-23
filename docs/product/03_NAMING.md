# 03 — Naming Workshop (IN PROGRESS)

**Owner:** `brand-strategist` agent (as of 2026-04-23).
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

**Status:** IN FLIGHT 2026-04-23. Results will populate this section when brand-strategist returns.

### Round 6 candidates

*(placeholder — brand-strategist to populate)*

### Round 6 top picks

*(placeholder — brand-strategist to populate)*

### Round 6 rejected-list diff

*(placeholder — brand-strategist to populate)*

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

## Directions NOT yet tried (worth exploring if Round 5 rejected)

- Russian-source names (Vera, Istok, Svod) — still untapped; Svod semantically fits Second Brain («compendium / vault»)
- Latin/Greek single words beyond Delphi/Koan/Mneme/Noesis (Sophia, Pythia, Thoth, Janus) — some Greek covered in Round 5
- Pure-coined made-up roots (like Figma — no etymological anchor at all); Memoro (Round 5) coined-but-Latin-rooted is a halfway step
- Two-syllable abstract (like Stripe, Vercel, Rakuten)
- Reference-driven — blocked until PO provides reference brands

**Round 5 territory covered:** mind / memory / brain / knowledge / recall / cognition — 10 candidates produced 2026-04-23, see Round 5 section above.

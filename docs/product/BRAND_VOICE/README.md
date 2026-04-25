# Brand Voice — Living Corpus

**Owner:** `brand-voice-curator` agent
**Dispatched by:** Navigator (when PO adds taste signals or requests voice-profile refresh)
**PO interaction:** PO gives signals to Navigator («увидел X, нравится/не нравится, reason Y»). Navigator translates to curator dispatches. Curator updates living docs.

---

## Why this exists

After 17 naming rounds without a final lock, root-cause diagnosis (2026-04-24) showed that all generation rounds were anchored against **borrowed voice-profile** (Stripe/Brex/Mercury decoded in Round 15 Step 2), not against PO's actual taste.

Open question from Round 5 — «what 2-3 brand names do you like by sound/feel, any industry?» — remained unanswered for 15 rounds. Without positive taste-anchor, every naming round could only filter against criteria (length, phonetics, TM, domain) without knowing what PO would emotionally resonate with.

This directory is the fix:
- `REFERENCES_LIVING.md` — PO's accumulated taste signals (brands loved + hated)
- `VOICE_PROFILE.md` — derived voice profile (reverse-engineered from references, refreshed as corpus grows)
- `README.md` — this file

---

## How to use

### For PO (через Navigator)

**Add a taste signal any time:**
- «Увидел бренд X — нравится, feels like Y»
- «Наткнулся на Z — не нравится, звучит как W»
- «Старое: всегда любил A потому что B»

Navigator dispatches brand-voice-curator → curator appends to `REFERENCES_LIVING.md` → updates derived profile in `VOICE_PROFILE.md`.

**No minimum effort per signal.** One brand at a time is fine. Multiple brands at once is fine. Only negative feeling is fine. Don't need reason — curator will ask clarifying question through Navigator if reason is load-bearing.

### For Navigator

Use curator's `VOICE_PROFILE.md` as **positive anchor** in every naming round brief (not just as filter). Pattern:

```
Round N brief:
- Generate against POSITIVE voice-profile (see VOICE_PROFILE.md §phonetic/semantic/archetype anchors)
- AVOID negative territories (see VOICE_PROFILE.md §anti-target)
- Combined with constraints (rejected-list, Rule 1, archetype lock, tone)
```

If VOICE_PROFILE.md shows `Threshold status: NEED-MORE` — do NOT launch naming round. Ask PO for more references first.

### For brand-strategist (naming rounds)

When dispatched for Round N+1:
1. Read `docs/product/BRAND_VOICE/VOICE_PROFILE.md` as primary anchor
2. Generate against derived positive patterns (not borrowed Stripe/Brex anchor)
3. Explicitly avoid derived negative patterns
4. Return candidates to Navigator for synthesis

---

## Threshold

**Minimum for reliable voice-profile:** 10 positive references + 5 negative = 15 total.

Below threshold: curator emits `insufficient signal` flag. Navigator does NOT trigger naming round.

Above threshold: curator's `VOICE_PROFILE.md` is actionable. Navigator CAN trigger naming round.

Ideal: 20+ total references, refreshed over weeks of PO encountering brands in the wild (not one-shot exercise).

---

## Current state (2026-04-24 bootstrap)

- `REFERENCES_LIVING.md` — starter template, awaiting PO's first 10+10 seeding
- `VOICE_PROFILE.md` — empty (will derive after initial seeding)

**Next step:** PO provides initial 10+10 (positive + negative) brand references via Navigator. Curator populates living doc. Voice profile derives. Ready for Round 18.

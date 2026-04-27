# Final Brand Harmony Pass

**Verdict:** TIGHTEN
**Confidence:** high

Final state walked end-to-end (light + dark, all 12 surface groups). System is 90% on-brand and ready to ship after 3 surgical dial-backs. The polish round landed real value: borders give the system architectural rigor without stealing the tactile mood, secondary-outlined fixes the «disabled-looking» button regression, inset chat user bubble nails the «posing-a-question» register I flagged last round, and the bronze red-shift is the right call. What's left is one density issue (forest-jade overuse), one residual archetype-drift (single-word color emphasis), and one doc-truth bug.

## Section 1 — Archetype + voice composition (final)

**Magician+Sage primary holds.** The pulse-with-halo on portfolio cards, citation glyph `✦`, cross-broker insight card all carry quiet-Magician (librarian-Magician, finding the connection in the catalog). Sage shows up in tabular numerals, mono eyebrows, dotted dividers, restrained shadows, no italic. Both archetypes legible.

**Everyman modifier is now better-served by borders.** Counter-intuitive but real: the 1px borders give cards a «catalog card» feel — the kind of thing you'd find in a museum or library. That's *more* Everyman-warm than borderless cream-on-cream, because borderless reads «sterile design system» while bordered reads «artifact, indexed, tangible». Borders are an unexpected Everyman win.

**Voice composition (Patagonia / Craig Mod / Wirecutter / Economist / McPhee):** rendered system composes correctly with this stack on 9 of 10 voice signals. The one signal still fighting is the accent-color-on-single-word emphasis — it appears in display headline («Notice **what** you'd miss»), insight head («A pattern **across** accounts»), chat assistant bodies («drifted **3.2%**», «reads as **opportunistic**»), and signature card. None of the voice references do this. Stripe Press never colors single words in headlines. The Economist uses italics (deliberately disallowed here) for emphasis but never color. Patagonia lets prose rest. This single pattern is the residual Vercel/Linear inheritance — a billboard tic borrowed unconsciously. Detail in §5.

**Competitor territory final landing:** Light theme = Mercury 2024 + Stripe Press primary (very close), with light-touch Granola in chat asymmetry. Dark theme = Linear/Vercel-adjacent, defensible because dark = «night focus mode» where Sage takes over. Two-territory system is fine; document it in `04_BRAND.md` so future contributors don't try to «warm» the dark theme back.

## Section 2 — Anti-feature scan

**Borders: NOT fighting tactile mood.** I worried they would. They don't. The 1px ink-at-low-alpha border + double-shadow on light-theme cards reads «paper card pinned to corkboard» — the border adds edge definition without flattening the lift. Compositor-friendly choice.

**Hover states: not Vercel-coded.** The `transform: translateY(-1px)` button hover and the rgba background hovers on nav/tabs are restrained. No glow, no scale, no color shift on primary surfaces. Correctly tuned.

**Forest-jade overuse: YES, this is the system's biggest residual issue.** Counted 17+ distinct surface-roles where `--accent` appears as fill or text color. That density flattens the accent's semantic meaning. Detail in §4.

**Visual «pop» that contradicts observant-composed voice:** two leftover spots.
- The `chip.accent` ("Verified") full-fill forest-jade pill is a small thing but it's a billboard chip — solid color, white text, lifted shadow. Mercury 2024 verified chips are quieter (outlined or text-only with a tiny leading dot). LOW priority but worth a note.
- The `bub-ai` has `border-top: 1px solid color-mix(...accent 30%)` — a subtle jade tint at the top edge of every assistant bubble. This was added for differentiation but it makes every AI response carry a green hairline. In a long conversation that becomes a green ladder. Recommend dropping. The card border + shadow + label do the differentiation work; the tinted top-edge is belt-and-suspenders.

**Anti-features I expected but didn't find:** no gradient backgrounds, no glassmorphism creep, no decorative blobs, no skeumorphic textures, no emoji in microcopy, no loud focus rings. Discipline held across the polish round.

## Section 3 — Hierarchy preservation

**Verdict: hero composition still leads — but margin is thinner than before borders landed.**

Original brand-strategist concern was that the signature hero card («Notice **what** you'd miss» + lift shadow + ink CTA) had to dominate. After borders went on every card, the system *did* flatten somewhat — every surface now has the same edge treatment. The hero card holds its lead through three preserved differentiators:

1. `--shadow-lift` (`8px 8px 24px` warm) vs `--shadow-card` (`5px 5px 14px`) — measurable lift difference. Held.
2. `border-radius: 22px` vs cards at `18px` — subtle but present.
3. Display-48 type vs section h3 at 22px — typographic dominance held.

What got lost: the «only the hero has a border» exclusivity move (which was never specced, but emerged accidentally last round). That's gone. Net — hero still leads on shadow + scale + type, but no longer leads on edge treatment.

**Recommendation:** acceptable. The system trades hero-exclusivity for catalog-coherence, and catalog-coherence is more on-archetype (Sage = library = every card indexed). Don't try to claw exclusivity back by removing borders from non-hero cards. Instead, if hero needs more lift, push `--shadow-lift` warmer/wider (already at `8px 8px 24px rgba(140,100,55,0.2)` — could go to `10px 10px 30px`).

**Eye-flow on the actual signature stage:** eyebrow → headline → sub → CTA still scans correctly. The accent-color on «what» pulls the eye but pulls it to the wrong place (a function word, not the noun). See §5.

## Section 4 — Forest-jade density · Bronze red-shift

### Forest-jade `#2D5F4E` density — ROLE HIERARCHY NEEDED

Counted 17+ distinct uses of `--accent` as fill or text color across light theme:
1. `stage-head .eyebrow` (mono label)
2. `sig-eyebrow` (signature card eyebrow)
3. `sig-headline .accent` (single word in display)
4. `insight-eyebrow`
5. `insight-head .accent` (single word in card head)
6. `bub-ai .label` («PROVEDO REPLIES»)
7. `bub-ai .body .accent` (single words inside chat — ostensibly removed in CSS but still rendered via spans)
8. `bub-ai border-top` (tinted hairline)
9. `citation::before` (✦ glyph)
10. `pulse` (success dot + halo)
11. `checkbox.checked` (fill)
12. `switch.on` (track + halo)
13. `radio.checked::after` (inner dot)
14. `chip.accent` (full-fill pill)
15. `toast-icon.success` (full-fill circle)
16. `status-dot` (avatar status)
17. `avatar.accent` (full-fill avatar)
18. `input:focus` (`--accent-glow` ring)
19. `tr .delta.pos` (positive numbers in table)

That's accent as: status, success, verification, citation, focus, input-active, navigation-active, brand-eyebrow, headline-emphasis, body-emphasis, AI-attribution, semantic-positive-data. Six different semantic loads on one color. The color is doing too many jobs.

**Fatigue check:** at this density, forest-jade stops reading «meaningful signal» and starts reading «brand color» — i.e., decorative. The Sage archetype specifically rejects color-as-decoration; color should mean something. Right now it means six things, which means it means nothing.

**Recommendation: introduce 3-tier role hierarchy in `04_BRAND.md`.**

| Tier | Role | Surfaces (KEEP) | Density |
|---|---|---|---|
| **Primary (color)** | Active state on user-controlled toggles | checkbox.checked · switch.on · radio.checked · input:focus glow | 4 surfaces |
| **Secondary (color)** | Semantic positive in data + status | pulse (success) · `tr .delta.pos` · status-dot · toast success icon | 4 surfaces |
| **Tertiary (mono only)** | Editorial labels (eyebrows + AI attribution) | stage-head eyebrow · sig-eyebrow · insight-eyebrow · bub-ai .label · citation glyph | 5 surfaces |

**Surfaces that should DROP accent to ink (or text-2):**
- `sig-headline .accent` (single-word emphasis on display) → ink, bold weight only
- `insight-head .accent` (single-word in insight head) → ink, bold weight only
- `bub-ai .body .accent` (already specced to ink in CSS — verify spans in markup don't override)
- `bub-ai border-top` (tinted hairline) → drop entirely; border + shadow + label already differentiate
- `chip.accent` full-fill «Verified» → consider outlined variant: transparent bg + 1px accent border + accent text. Reads as semantic-status without billboard weight.
- `avatar.accent` full-fill (PR avatar) → demo-only, fine; don't ship into product unless avatar coloring is a real feature.

This drops forest-jade from 17 surfaces to ~9, with clear semantic hierarchy. Color regains meaning. System reads more Sage.

### Bronze `#A04A3D` red-shift — LANDED CORRECTLY

PO landed at `#A04A3D` light / `#BD6A55` dark. I had recommended `#9C5040 / #B86A5A` last round. PO's `#A04A3D` is +5 chroma, ~same hue. Marginally more saturated than my proposal but still in the museum-vitrine register, not the alarm register.

**Reads as:** old leather, terracotta brick, dried-earth. Patagonia Worn Wear catalog territory. NOT alarm/blood. NOT autumn-orange.

**Acid tests passed:**
- `pulse.warn` solid bronze dot on Binance card → reads «attention warranted», not «danger». Correct register.
- Negative delta `−5.8%` in table → reads warning, not catastrophe. Correct.
- `chip.warning` («Drift +3.2%») → noteworthy without alarming. Correct.
- `toast-icon.warning` (`!` glyph on bronze) → editorial caution. Correct.
- `btn-danger` («Delete») → still firm enough to register destructive action. Just barely; LOW concern.

The red-shift opens about 2-3% of «alarm» territory the orange did not. For everything except `btn-danger` that's an upgrade. For `btn-danger` it's neutral — the verb «Delete» + the color combine adequately. No regression.

**Verdict:** ship `#A04A3D / #BD6A55` as final. Don't push further red.

## Section 5 — Top 3 actionable changes

### 1. Drop accent-color from single-word emphasis in headlines + body. (HIGH leverage)

**Files:** `design-system.html` lines 630, 684, 735, 810, 815 (and any landing surfaces using `.sig-headline .accent` / `.insight-head .accent` / `.bub-ai .body .accent`).

**Change:**
- `sig-headline .accent` → `color: var(--ink); font-weight: 700;` (drop accent color)
- `insight-head .accent` → same
- `bub-ai .body .accent` already specced ink in CSS line 472; verify no inline overrides in markup spans

**Rationale:** Patagonia/Stripe Press/Economist/Wirecutter never color individual words in display or body. The technique is Vercel/Linear inheritance. Bold-weight-without-color preserves emphasis hierarchy and pushes the system one notch toward Sage. Keep accent color for tier-1 (active controls) and tier-2 (semantic data) only.

### 2. Build forest-jade role hierarchy and prune surfaces. (HIGH leverage)

**Document in `04_BRAND.md`** the 3-tier table in §4 above. **Patch `design-system.html`:**

- `bub-ai border-top` (line 465) → drop the tinted hairline. Border + shadow + accent label already differentiate AI from user.
- `chip.accent` (line 358-361) → consider transparent variant: `background: transparent; border: 1px solid var(--accent); color: var(--accent);`. Compare side-by-side; if «Verified» reads too quiet, keep current full-fill but document as exception.
- Reduce simultaneous on-screen accent surfaces in any single view to ≤3 by following tier hierarchy.

**Rationale:** color carrying 6 semantic loads = color carrying 0. Sage archetype demands color-as-meaning. 3-tier hierarchy restores meaning.

### 3. Fix swatch documentation truth-bug. (LOW effort, doc-hygiene)

**Files:** `design-system.html` lines 642-654.

The swatch grid still displays the OLD hex values:
- BG shown `#F4F1EA` — actual CSS var `#F1EDE3`
- Card shown `#FAF7F0` — actual `#FFFFFF`
- Inset shown `#ECE7DC` — actual `#E8E2D4`
- Bronze shown `#9B5C3E` — actual `#A04A3D`

The CSS variables (lines 545-570) are correct; the inline-style swatches that *display* them are stale. PO will refer to this page as the source of truth. Update the 4 swatch chips and `.sw-hex` text to match the actual locked values.

---

**Net assessment:** ship after these 3 patches. Issue #1 is the biggest brand-side leverage point; issue #2 is the highest-density polish; issue #3 is doc-hygiene that prevents future contributor confusion. None require rework. All three are surgical.

The system is genuinely close. Borders + outlined-secondary + pulse-warn-solid + inset-chat-user + bronze-red-shift all landed as upgrades. The remaining work is restraint — pruning the Vercel/Linear inheritance that's still hiding in single-word color emphasis and accent-density. Once pruned, this is Mercury-2024 / Stripe-Press territory with Provedo's own accent — defensible, ownable, and on-archetype.

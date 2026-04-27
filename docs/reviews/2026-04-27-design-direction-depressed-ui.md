# Design Direction — Depressed UI + Button 3D

**Confidence:** high
**Migration impact:** small (changes are scoped to marketing-surface tokens; web-app primitives already flat-with-border)

---

## Q1 — Depressed elements: keep / drop / hybrid?

**Recommendation:** **(c) Hybrid** — keep depressed only for **text inputs / textareas / search**. Drop depressed from switch / checkbox / radio. Use flat-with-border for those, with the active state carrying meaning via fill (forest-jade) + outline, not via inset shadow.

**Why:**
1. **Affordance rule (Norman):** depressed inset reads as «receive input from me» — that maps perfectly to a typing field (you literally press into it with text). It maps poorly to a binary toggle, which is a switch that flips, not a well that fills. PO's gut («depressed reads as disabled») was correct *for non-input controls* — depressed states are ambiguous on stateful toggles because users compare them to disabled buttons.
2. **Mercury 2024 / Stripe Press / Granola precedent:** all three keep inputs subtly recessed (ring + faint inner shadow, not heavy inset) but render switches/checkboxes as flat geometric surfaces with crisp filled active states. None of them inset-shadow a checkbox.
3. **Brand alignment:** «Magician + Everyman» wants confidence + plainness. Tactile depth on inputs sells «this ledger is physical, real». Tactile depth on a checkbox sells nothing — it's just visual cost.
4. **A11y:** flat toggles with explicit fill + border + checkmark icon hit WCAG AA more reliably across OS-level dark/light extremes than inset shadows, which can disappear on high-contrast modes and OLED true-black.
5. **Geist composition:** Geist's clean geometric letterforms sit better next to flat toggles than against multiple inset shadow vocabularies competing for attention.

**Trade-offs:**
- Lose some tactile consistency across the form vocabulary — there will be one «depth language» (inputs) instead of one unified inset language across all form controls.
- Slight visual inconsistency on dense forms where text fields and toggles sit side-by-side. Mitigated by sharing the same border-radius scale and border-color token.
- We give up a small bit of «distinctive Provedo feel» on the toggles. But we already lost that on secondary buttons two iterations ago — the hybrid is now the honest pattern.

**CSS / token changes:**

Keep (no change):
```css
/* Input / Textarea / Search — KEEP depressed */
--shadow-input-inset: inset 0 1px 2px rgba(0,0,0,0.06), inset 0 0 0 1px var(--color-border-default);
--color-input-bg: var(--color-cream-50);  /* stays */
```

Change:
```css
/* Switch / Checkbox / Radio — DROP inset, go flat */
.switch {
  background: var(--color-cream-100);          /* was: inset cream-50 with shadow */
  border: 1px solid var(--color-border-default);
  box-shadow: none;
}
.switch[data-state="checked"] {
  background: var(--color-forest-jade-600);    /* fill carries the «on» meaning */
  border-color: var(--color-forest-jade-700);
}
.checkbox, .radio {
  background: var(--color-background-primary);
  border: 1.5px solid var(--color-border-default);
  box-shadow: none;
}
.checkbox[data-state="checked"] {
  background: var(--color-forest-jade-600);
  border-color: var(--color-forest-jade-700);
  /* checkmark icon in cream-50 */
}
```

New semantic token to add:
```json
"shadow.inputInset": "inset 0 1px 2px rgba(0,0,0,0.06)"
```
Drop usage of generic `shadow.inset` from switch/checkbox/radio components.

---

## Q2 — Button 3D shadow on secondary?

**Recommendation:** **(a) Status quo** — only the primary CTA carries the ink-extruded 3D shadow. Secondary stays outlined-flat. Ghost stays flat. **Do not add 3D to secondary.**

**Why:**
1. **Hierarchy is the entire job of the secondary button.** The moment secondary gets a shadow, it competes with primary for attention. Two buttons fighting at the same visual weight = user hesitation = lower conversion. Mercury, Linear, Stripe all enforce this gap.
2. **«3D feel» does not require shadow on every element.** The page already has tactile depth via the primary CTA, lifted cards, and depressed inputs. Secondary's job is to be *available, not loud* — flat outline does that work cleanly.
3. **Stripe Press / Mercury 2024 reference:** secondary buttons in both are flat outlined with no shadow. Granola does the same. Adding shadow to secondary would push us out of that territory, into territory closer to Apple HIG iOS 14-era buttons, which is not the brand we picked.
4. **Migration economics:** adding a subtle shadow to secondary creates a third shadow token to maintain (`shadow.button-secondary` between `none` and `shadow.cta-extrude`), invites endless tweaking on contrast and alpha, and FE will get rebuild-fatigue. Status quo is free.
5. **A11y:** focus ring on flat secondary is unambiguous (`outline: 2px solid brand-500`). Focus ring on shadowed secondary requires careful stacking to not look like a doubled bevel.

**Trade-offs:**
- Slight perceived flatness on secondary in screenshots compared to primary. This is the *correct* trade — it's hierarchy working as designed.
- We lose «every button feels tangible». But we never had that since secondary went outlined; only primary has been tangible for two iterations and the system reads fine.

**CSS changes:** none. Confirm and lock current state:

```css
/* Primary — KEEP 3D extrude */
.btn-primary {
  background: var(--color-ink-900);
  box-shadow:
    0 1px 0 0 rgba(0,0,0,0.04),
    0 2px 4px rgba(0,0,0,0.10),
    inset 0 1px 0 rgba(255,255,255,0.06);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow:
    0 2px 0 0 rgba(0,0,0,0.04),
    0 4px 8px rgba(0,0,0,0.12),
    inset 0 1px 0 rgba(255,255,255,0.06);
}
.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0,0,0,0.10);
}

/* Secondary — flat outlined, NO shadow */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border-strong);
  box-shadow: none;
}
.btn-secondary:hover { background: var(--color-cream-100); }

/* Ghost — flat, NO shadow */
.btn-ghost { background: transparent; box-shadow: none; }
.btn-ghost:hover { background: var(--color-cream-100); }
```

---

## Key risks if PO accepts

1. **Token sprawl risk (low):** `shadow.inset` should be split into two semantic tokens — `shadow.inputInset` (kept) and `shadow.toggleInset` (deleted). Ask FE to grep usages and migrate in one PR; otherwise the legacy token name lingers and creates drift.
2. **Cross-surface consistency drift (medium):** the marketing landing-v2 currently uses the depressed pattern more aggressively than the in-app surfaces (web app primitives are already flat-with-border). After this decision, marketing and app should converge — recommend a follow-up audit pass over `packages/ui/src/primitives/{Input,Button}.tsx` to align with the marketing tactile language for inputs only. Do that in the same PR cycle.
3. **«Now another iteration» fatigue:** PO is iteration-fatigued. This decision should be **locked for 4 weeks** unless we get real user feedback (not gut feel) that contradicts it. Land it in `docs/04_DESIGN_BRIEF.md` v1.2 with a changelog entry stating «depth language: inputs depressed, toggles flat, secondary flat — locked 2026-04-27».
4. **Dark mode parity (low):** inset shadow on inputs in dark mode needs a different alpha (`rgba(0,0,0,0.3)` or even a subtle highlight on the bottom edge instead of top). If we don't spec both, dark mode will look incorrect on launch. Add the dark variant when locking the token.
5. **Switch active-state contrast (medium):** forest-jade-600 fill against cream-100 unchecked state must hit 3:1 non-text contrast minimum (WCAG AA for UI components). Verify with the existing palette before locking — if it's borderline, bump to forest-jade-700 for the fill.

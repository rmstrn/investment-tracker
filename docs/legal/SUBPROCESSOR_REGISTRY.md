# Memoro — Subprocessor Registry

**Status:** ACTIVE (internal single source of truth). Public-facing version will be derived from this table at **`[SUBPROCESSOR REGISTRY PUBLIC URL — TBD]`** once a public route exists.
**Version:** 0.1 (2026-04-23)
**Owner:** legal-advisor maintains; tech-lead + PO update when subprocessors change.
**Refresh cadence:** quarterly minimum + on every subprocessor change + on every AI-vendor retention-mode re-verification.
**Cross-references:** `docs/legal/PRIVACY_POLICY_draft.md` §6; `docs/legal/DPA_template.md` Annex III; `docs/legal/AI_DISCLAIMER_PATTERN.md` §5 (AI vendor config).

---

## How to read this file

- **Status column key:** `active` = in production use · `configured` = contracted but not yet routing traffic · `planned` = on roadmap, not yet contracted · `retired` = removed.
- **DPA status key:** `signed` = fully executed · `drafted` = internal draft ready for counterparty · `in-negotiation` = counterparty revisions pending · `vendor-standard` = using vendor's standard DPA (attach version + date) · `not-started`.
- **TIA status key:** Transfer Impact Assessment under Schrems II (CJEU C-311/18). `complete` = TIA executed + retained · `drafted` = internal draft · `not-started`. Only applicable to non-adequacy-decision destinations.
- **Retention config key (AI vendors only):** `ZDR` = Zero Data Retention confirmed by vendor admin console · `30d-abuse-only` = OpenAI enterprise tier with 30-day abuse-monitoring retention · `default` = vendor default (NOT acceptable for EU/UK launch; must be upgraded) · `unverified` = not yet checked.

---

## 1. Current subprocessor table

| # | Subprocessor | Purpose | Data category shared | HQ | Data-residency option | DPA URL / version | DPA status | SCC / IDTA | TIA status | AI retention config | Contact URL |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Clerk** | Authentication + session management | Identity (email, name), auth tokens, MFA factors | US (San Francisco) | EU region available | `[VENDOR DPA URL — TBD]` version `[DATE]` | `vendor-standard` (pending configuration) | EU-US DPF: verify. SCCs fallback for non-DPF. | `not-started` | N/A | https://clerk.com/legal/dpa |
| 2 | **Plaid** | Brokerage aggregation (US-primary) | OAuth tokens, account data, transactions | US (San Francisco) | US-primary; limited EU | `[VENDOR DPA URL — TBD]` | `vendor-standard` (pending configuration) | EU-US DPF + SCCs | `not-started` | N/A | https://plaid.com/legal/#privacy |
| 3 | **SnapTrade** | Brokerage aggregation (multi-region) | OAuth tokens, account data, transactions | Canada (Ottawa) | Canada + EU regions | `[VENDOR DPA URL — TBD]` | `vendor-standard` (pending configuration) | EU-Canada: adequacy decision 2002/2/EC (verify current status) | `not-started` | N/A | https://snaptrade.com/legal |
| 4 | **Anthropic** | AI inference (Claude API) | Chat content, portfolio context passed to model | US (San Francisco) | US | `[VENDOR DPA URL — TBD]` | `vendor-standard` (ZDR tier required) | EU-US DPF: verify. SCCs fallback. | `not-started` | **Must be ZDR** (verify pre-EU-launch; current status: `unverified`) | https://www.anthropic.com/legal |
| 5 | **OpenAI** | AI inference (GPT API) | Chat content, portfolio context passed to model | US (San Francisco) | US | `[VENDOR DPA URL — TBD]` | `vendor-standard` (zero-retention or 30d-abuse-only tier required) | EU-US DPF: verify. SCCs fallback. | `not-started` | **Must be `ZDR` or `30d-abuse-only`** (verify pre-EU-launch; current status: `unverified`) | https://openai.com/enterprise-privacy |
| 6 | **Fly.io** | Application hosting + infrastructure | All processed data at rest + in transit | US (San Francisco) | EU (fra/ams), US, APAC regions | `[VENDOR DPA URL — TBD]` | `vendor-standard` (pending configuration) | EU-US DPF / SCCs | `not-started` | N/A | https://fly.io/legal/dpa |
| 7 | **Doppler** | Secrets management (env config) | No user data — configuration only | US | US | `[VENDOR DPA URL — TBD]` | `vendor-standard` (low-risk; no user data) | EU-US DPF / SCCs | `not-started` (low priority — no user data) | N/A | https://www.doppler.com/legal |
| 8 | **Stripe** | Payments (paid tiers) | Billing info, payment-method tokens (no full PAN) | US (San Francisco) | US + EU regions | `[VENDOR DPA URL — TBD]` | `planned` — not yet contracted; pre-paid-launch block | EU-US DPF + SCCs | `not-started` (pre-paid-launch block) | N/A — PCI scope handled separately | https://stripe.com/legal/dpa |

### 1.1 Status summary (count by state)

| State | Count |
|---|---|
| Active in production | 6 (Clerk, Plaid, SnapTrade, Anthropic, OpenAI, Fly.io) + Doppler (infra) = 7 |
| Configured / planned / not-yet-production | 1 (Stripe) |
| DPA signed | 0 |
| DPA in `vendor-standard` pending execution | 7 |
| DPA `planned` | 1 (Stripe) |
| TIA complete | 0 |
| AI retention config verified | 0 (Anthropic + OpenAI both `unverified`) |

---

## 2. Pre-EU-launch checklist (per subprocessor)

The following items must be green for each subprocessor before Memoro can lawfully serve EU / EEA / UK users at scale. Current state is RED across the board — this is the expected state at pre-alpha, and is the top-of-list action as part of pre-public-launch legal workstream.

| # | Subprocessor | DPA signed | SCCs / IDTA attached | TIA complete | Residency set to EU where needed | AI retention verified | Ready? |
|---|---|---|---|---|---|---|---|
| 1 | Clerk | ☐ | ☐ | ☐ | ☐ | N/A | RED |
| 2 | Plaid | ☐ | ☐ | ☐ | ☐ | N/A | RED |
| 3 | SnapTrade | ☐ | ☐ | ☐ | ☐ | N/A | RED |
| 4 | Anthropic | ☐ | ☐ | ☐ | ☐ | ☐ | RED |
| 5 | OpenAI | ☐ | ☐ | ☐ | ☐ | ☐ | RED |
| 6 | Fly.io | ☐ | ☐ | ☐ | ☐ | N/A | RED |
| 7 | Doppler | ☐ | ☐ | ☐ | N/A | N/A | RED (low-priority) |
| 8 | Stripe | ☐ | ☐ | ☐ | ☐ | N/A | N/A (not yet contracted) |

---

## 3. AI vendor retention configuration — detailed tracking

This section tracks the specific configuration required for AI vendors. The default tier for both Anthropic and OpenAI retains inputs/outputs for a period that is NOT compatible with Memoro's data-minimization posture or with the AI-training exclusion promised in the Privacy Policy §5.3.

### 3.1 Anthropic (Claude API)

**Required configuration:** Zero Data Retention (ZDR). Available to enterprise and API customers with appropriate contracting. ZDR means: inputs and outputs are not logged beyond the duration of the request; no training use; no human review.

**Configuration steps (to be executed by tech-lead, verified by legal-advisor + security-compliance skill):**
1. Request ZDR enablement on the Anthropic account via the admin console or Anthropic support.
2. Capture the vendor's confirmation (email or dashboard screenshot) in `docs/legal/vendor-evidence/anthropic-zdr-confirmation-[DATE].pdf`.
3. Record the effective date in this registry.
4. Re-verify quarterly by confirming the admin console still shows ZDR for the account.

**Current state (2026-04-23):** `unverified` — pre-alpha; likely on default tier. Action required before EU/UK launch.

### 3.2 OpenAI (GPT API)

**Required configuration:** either Zero-Retention tier (Enterprise) or 30-day-abuse-only tier. Default API retains for 30 days for abuse monitoring; enterprise ZDR removes this. Memoro should target ZDR where cost allows; 30-day-abuse-only is acceptable if ZDR is not available for Memoro's usage tier.

**Configuration steps (as above, to be executed by tech-lead + legal-advisor):**
1. Upgrade OpenAI account to Enterprise if needed (cost decision — flagged for PO; CONSTRAINT Rule 1).
2. Request ZDR enablement.
3. Capture evidence in `docs/legal/vendor-evidence/openai-zdr-confirmation-[DATE].pdf`.
4. Record effective date in this registry.
5. Re-verify quarterly.

**Current state (2026-04-23):** `unverified` — pre-alpha; likely on default 30-day-abuse tier. Acceptable for pre-alpha; must be confirmed as minimum 30-day-abuse (not a higher retention tier) and upgraded to ZDR if enterprise cost is approved by PO.

> `[PO DECISION NEEDED]` — OpenAI enterprise ZDR likely requires a paid plan upgrade. Exact cost TBD based on volume. This is a CONSTRAINT Rule 1 item: legal-advisor cannot authorize the upgrade. Surface to PO via Navigator when pre-EU-launch preparation starts.

### 3.3 Alternative AI vendor evaluation (future)

Should either Anthropic or OpenAI change their retention posture in a way that Memoro cannot accept, two fallback vendor candidates should be scoped:
- **Azure OpenAI** — enterprise-grade retention controls, EU residency, but introduces Microsoft as an additional subprocessor chain.
- **Mistral** (EU-based) — EU residency natively, smaller ecosystem.
- **Self-hosted Llama / other open-weight models via Fly.io / AWS Bedrock** — operational complexity tradeoff.

This evaluation is deferred. Tracked here for awareness only.

---

## 4. Russia (152-ФЗ) — data localization status

**Current posture:** Russia is out of launch scope per `DECISIONS.md` Q7 2026-04-23. None of the current subprocessors have Russian-territory data tiers. If Russian market entry is re-scoped in the future, the following is required before any Russian-resident user can be onboarded:

- A Russian-resident database tier holding initial record, systematization, accumulation, storage, clarification, and extraction of Russian personal data (152-ФЗ Article 18(5))
- Notification to Roskomnadzor under 152-ФЗ
- A Russian-licensed legal opinion on the 39-ФЗ perimeter (see Legal-advisor review 2026-04-23 §Russia)
- Per-subprocessor evaluation of Russian-residency feasibility (as of 2026-04-23: none of the current 8 subprocessors support it)

This is a material architectural decision and is flagged for tech-lead + finance-advisor coordination if/when Russia re-enters scope.

---

## 5. Change log

| Date | Change | Author |
|---|---|---|
| 2026-04-23 | Registry initialized with 8 subprocessors; all DPA statuses `vendor-standard` pending execution; AI retention `unverified` for Anthropic + OpenAI; TIA `not-started` across all. | legal-advisor |

---

## 6. How to update this file

1. Any subprocessor addition/removal/change is a material privacy-policy change and triggers a 30-day user notice per Privacy Policy §13. Plan ahead.
2. Update this table first; then trigger the cascade:
   - `PRIVACY_POLICY_draft.md` §6.1 list update
   - Internal record of processing (Art. 30 GDPR)
   - Public-facing registry URL (when it exists)
   - User notification per Privacy Policy §13
3. Retain change log entries indefinitely. Do not remove historical rows.

---

## 7. Cross-reference matrix — open `[ATTORNEY REVIEW]` + ownership items

| # | Item | Owner | Dependent on |
|---|---|---|---|
| 1 | DPA URL / version for each vendor | legal-advisor (collect) + PO (execute) | Pre-public-launch |
| 2 | SCC Module 2 (or appropriate module) per vendor | legal-advisor (propose) + counsel (review) + PO (execute) | Pre-EU-launch |
| 3 | UK IDTA / Addendum for UK transfers | legal-advisor (propose) + UK counsel (review) + PO (execute) | Pre-UK-launch |
| 4 | TIA per vendor (Schrems II) | legal-advisor (draft templates) + counsel (review) | Pre-EU-launch |
| 5 | Anthropic ZDR confirmation | tech-lead (execute) + legal-advisor (verify) | Pre-EU-launch |
| 6 | OpenAI ZDR / 30d-abuse confirmation | tech-lead (execute) + legal-advisor (verify) + PO (cost approval if Enterprise upgrade) | Pre-EU-launch |
| 7 | Public-facing registry URL | tech-lead (build) + product-designer (design) | Pre-public-launch |
| 8 | Art. 30 record-of-processing internal documentation | legal-advisor (draft) + counsel (review) | Pre-public-launch |

---

## References

- GDPR Article 28 (Processor), 30 (Records of processing), 32 (Security), 44–50 (Transfers): https://gdpr-info.eu/
- Commission Implementing Decision (EU) 2021/914 (SCCs): https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj
- CJEU C-311/18 (Schrems II): https://curia.europa.eu/juris/document/document.jsf?docid=228677
- EU-US Data Privacy Framework: https://www.dataprivacyframework.gov/
- UK IDTA + Addendum (ICO): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-data-transfer-agreement-and-guidance/
- Russia 152-ФЗ: http://www.consultant.ru/document/cons_doc_LAW_61801/
- Vendor DPA index pages (listed in table §1 per row)

All URLs accessed 2026-04-23.

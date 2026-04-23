# Memoro — Data Processing Agreement (DPA) Template

**Status:** DRAFT template — first-pass internal legal-advisor output. Intended as Memoro's template for subprocessor negotiations where Memoro is the data controller and the counterparty is a data processor. Requires licensed privacy counsel review before any negotiation use. Many vendors will propose their own DPA; Memoro's template establishes a baseline for red-line comparison.
**Version:** 0.1 (2026-04-23)
**Language:** English (EU legal convention).
**Owner:** legal-advisor (internal SME) · final sign-off: licensed privacy counsel.
**Key `[ATTORNEY REVIEW]` items:** governing-law selection, SCC version (2021/914) module application, UK IDTA / UK Addendum selection, liability-cap negotiation position, audit-rights scope, sub-processor authorization mechanism.

---

## How to use this template

1. This template is drafted from Memoro's perspective as **data controller**. Most subprocessors (Clerk, Plaid, SnapTrade, Anthropic, OpenAI, Fly.io, Doppler, Stripe) will present their own DPAs, usually controller-friendly for enterprise customers. In those cases, use this template as the **red-line baseline** — what we would propose if they asked — and compare their terms against ours.
2. Where the subprocessor insists on their DPA, the areas to negotiate toward this template's position are: breach notification timing (we want ≤24h; vendors often propose 72h or "without undue delay"), audit rights, sub-sub-processor authorization, data-deletion-on-termination specificity, and the SCC module selection.
3. Integrate this template with an Annex I (processing details), Annex II (technical and organizational measures), Annex III (sub-processors approved at DPA execution) per the 2021/914 SCC structure.
4. For the EU-Standard Contractual Clauses, incorporate **Module 2 (controller-to-processor)** from Commission Implementing Decision 2021/914 by reference and attach as an Annex. Do not re-draft SCC text; use the official version.

---

# Data Processing Agreement

**Between:**

**`[MEMORO LEGAL ENTITY — TBD]`**, a **`[legal form]`** with its registered office at **`[ADDRESS]`**, represented by **`[AUTHORIZED SIGNATORY]`** ("Controller")

**and**

**`[SUBPROCESSOR LEGAL NAME]`**, a **`[legal form]`** with its registered office at **`[ADDRESS]`**, represented by **`[AUTHORIZED SIGNATORY]`** ("Processor")

(each a "Party", together the "Parties").

Effective as of **`[EFFECTIVE DATE]`** (the "Effective Date").

## Recitals

(A) The Controller is the operator of an AI-assisted portfolio intelligence service ("Memoro") and acts as data controller in respect of personal data processed in connection with that service.

(B) The Processor provides **`[SERVICE DESCRIPTION]`** ("the Services") to the Controller pursuant to a separate agreement ("Main Agreement"). In providing the Services, the Processor processes personal data on behalf of the Controller.

(C) The Parties wish to set out the terms governing the Processor's processing of personal data on behalf of the Controller in accordance with applicable data-protection law, including the EU General Data Protection Regulation (Regulation (EU) 2016/679, "GDPR"), the UK GDPR and Data Protection Act 2018, and any other applicable law.

## 1. Definitions

Capitalized terms have the meanings given to them in the GDPR. In particular:
- **"Personal Data", "Process", "Processing", "Data Subject", "Personal Data Breach"** — as defined in GDPR Article 4.
- **"Applicable Data Protection Law"** means the GDPR, the UK GDPR, the UK Data Protection Act 2018, the California Consumer Privacy Act as amended by the CPRA, and any other law applicable to the Processing under this DPA.
- **"Sub-processor"** means any third party engaged by the Processor to Process Personal Data on behalf of the Controller.
- **"Standard Contractual Clauses" or "SCCs"** means the standard contractual clauses for the transfer of personal data to third countries adopted by Commission Implementing Decision (EU) 2021/914, specifically Module 2 (controller-to-processor), as may be amended from time to time.

## 2. Subject matter, duration, nature, and purpose of processing

- **Subject matter:** Processing of Personal Data as described in Annex I.
- **Duration:** the term of the Main Agreement, unless terminated earlier.
- **Nature and purpose:** as set out in the Main Agreement and Annex I.
- **Types of Personal Data:** as set out in Annex I.
- **Categories of Data Subjects:** as set out in Annex I (primarily users of Memoro: individual retail investors).

## 3. Controller's instructions

3.1 The Processor shall Process Personal Data only on the documented instructions of the Controller, including with regard to transfers of Personal Data to a third country or an international organization, unless required to do so by Union or Member State law to which the Processor is subject; in such a case, the Processor shall inform the Controller of that legal requirement before Processing, unless that law prohibits such information on important grounds of public interest.

3.2 The Main Agreement and this DPA (including Annex I) constitute the Controller's complete and final instructions at the date of execution. Additional instructions require the written agreement of both Parties.

3.3 The Processor shall immediately inform the Controller if, in its opinion, an instruction infringes Applicable Data Protection Law.

## 4. Confidentiality and personnel

4.1 The Processor shall ensure that persons authorized to Process Personal Data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality.

4.2 The Processor shall apply the principle of need-to-know and implement access controls appropriate to the sensitivity of the Personal Data.

## 5. Technical and organizational measures (Art. 32 GDPR)

5.1 The Processor shall implement and maintain the technical and organizational measures set out in Annex II, which shall ensure a level of security appropriate to the risk.

5.2 The measures shall as a minimum include:
- Pseudonymization and encryption of Personal Data in transit and at rest
- The ability to ensure the ongoing confidentiality, integrity, availability, and resilience of Processing systems and services
- The ability to restore the availability of and access to Personal Data in a timely manner in the event of a physical or technical incident
- A process for regularly testing, assessing, and evaluating the effectiveness of the measures

5.3 The Processor shall notify the Controller of any material change to Annex II at least 30 days before the change takes effect, except for changes required by law or emergency security response.

> `[ATTORNEY REVIEW]` — Annex II contents are subprocessor-specific. For AI vendors (Anthropic, OpenAI), specifically require: zero-data-retention / no-training configuration, prompt isolation, and log-retention limits. For auth (Clerk), require MFA for internal access, SOC 2 Type II attestation. For hosting (Fly.io), require region-lock to EU for EU-user data.

## 6. Sub-processors

6.1 The Processor shall not engage a Sub-processor without the Controller's prior general or specific written authorization.

6.2 **General authorization (preferred).** The Controller grants general authorization for the Sub-processors listed in Annex III. The Processor shall inform the Controller of any intended additions or replacements of Sub-processors **at least 30 days in advance**, giving the Controller the opportunity to object on reasonable data-protection grounds. If the Controller objects on reasonable grounds, the Processor shall not use that Sub-processor for the Controller's Personal Data and the Parties shall discuss alternatives in good faith.

6.3 The Processor shall impose on each Sub-processor the same data-protection obligations as those set out in this DPA, in particular providing sufficient guarantees to implement appropriate technical and organizational measures.

6.4 The Processor remains fully liable to the Controller for the performance of each Sub-processor's obligations.

> `[ATTORNEY REVIEW]` — The 30-day advance notice is Memoro's preferred position. Vendors often counter with shorter windows (e.g. Clerk, Stripe enterprise DPAs offer 10-30 day windows). Acceptable floor is 10 days if the vendor provides a public sub-processor list updated in real time (allowing Memoro to monitor proactively). Shorter than 10 days should be escalated.

## 7. Data-subject rights assistance

7.1 Taking into account the nature of the Processing, the Processor shall assist the Controller by appropriate technical and organizational measures, insofar as possible, in fulfilling the Controller's obligations to respond to requests for exercising Data Subject rights under Chapter III of the GDPR (Articles 15–22).

7.2 If a Data Subject submits a request directly to the Processor, the Processor shall:
- Not respond substantively to the Data Subject on behalf of the Controller
- Promptly forward the request to the Controller (within 5 business days)

## 8. Personal Data Breach notification

8.1 The Processor shall notify the Controller of a Personal Data Breach affecting Controller Personal Data **without undue delay and in any case within 24 hours** of becoming aware of the Breach.

8.2 The notification shall include, to the extent known at the time:
- Nature of the Personal Data Breach
- Categories and approximate number of Data Subjects concerned
- Categories and approximate number of Personal Data records concerned
- Likely consequences of the Breach
- Measures taken or proposed to mitigate or address the Breach
- Name and contact details of the Processor's data-protection point of contact

8.3 If initial information is incomplete, the Processor shall provide further information in phases without undue delay.

8.4 The Processor shall cooperate with and provide reasonable assistance to the Controller in the Controller's investigation, notification to supervisory authorities (GDPR Article 33 — 72 hours), and notification to Data Subjects (GDPR Article 34) where applicable.

> `[ATTORNEY REVIEW]` — 24-hour notification is Memoro's preferred position and gives Memoro working time to meet its own 72-hour regulator-notification obligation under GDPR Article 33. Vendors often propose 48 or 72 hours or "without undue delay". Acceptable floor is 48 hours combined with a commitment to reasonable cooperation with Memoro's Article 33 timing. Below 48 hours or removal of the cooperation commitment should be escalated.

## 9. Data-protection impact assessment + prior consultation

The Processor shall provide reasonable assistance to the Controller in complying with the Controller's obligations under GDPR Articles 35 (Data Protection Impact Assessment) and 36 (prior consultation with supervisory authorities), taking into account the nature of the Processing and the information available to the Processor.

## 10. International transfers

10.1 The Processor shall not transfer Personal Data outside the European Economic Area (EEA) or the UK without the Controller's prior written authorization or in compliance with Chapter V of the GDPR.

10.2 For transfers to third countries not covered by an adequacy decision, the Parties agree to the **Standard Contractual Clauses, Module 2 (Controller to Processor)**, as adopted by Commission Implementing Decision (EU) 2021/914 of 4 June 2021, which are incorporated by reference and included as **Annex IV**. The Parties complete the SCC annexes as follows:
- SCC Annex I.A (Parties): as set out at the top of this DPA
- SCC Annex I.B (Description of transfer): as set out in Annex I of this DPA
- SCC Annex II (Technical and organizational measures): as set out in Annex II of this DPA
- SCC Annex III (List of Sub-processors): as set out in Annex III of this DPA
- Clause 7 (docking clause): [included / not included — select]
- Clause 9(a) (sub-processor authorization): Option 2 (general written authorization) with 30-day prior-notice period, consistent with Section 6.2
- Clause 11 (independent dispute resolution): [included / not included — select]
- Clause 13 (supervision): the supervisory authority of the Controller's Member State of habitual residence (or, where the Controller is not established in the EU, the Member State of the Controller's EU representative under Art. 27)
- Clause 17 (governing law) and Clause 18(b) (jurisdiction): the law and courts of **`[MEMBER STATE — TBD per entity domicile]`**

10.3 For transfers from the UK, the Parties incorporate the **UK International Data Transfer Agreement (IDTA)** or the **UK Addendum to the EU SCCs** as set out in **Annex V**. Where the UK Addendum is used, the EU SCCs as attached are the "Approved EU SCCs" for purposes of the Addendum.

10.4 The Processor shall promptly notify the Controller of any request from a public authority for access to Personal Data (except where prohibited by law) and of any change in law of the destination country that materially affects the Processor's ability to comply with the SCCs.

> `[ATTORNEY REVIEW]` — SCC module selection must match the actual relationship. Most Memoro subprocessors are controller-to-processor (Module 2). If a subprocessor is a sub-processor to a processor-already-engaged (e.g. an AI model provider under Memoro's AI-layer vendor), the correct module may be 3 (processor-to-processor). Counsel to verify per counterparty. The Memoro entity may or may not be established in the EU at signing — if not, Clause 13 supervisory-authority selection depends on the Art. 27 EU representative appointment. Transfer Impact Assessment (TIA) per Schrems II remains mandatory even when SCCs are executed.

## 11. Audit rights

11.1 The Processor shall make available to the Controller all information necessary to demonstrate compliance with the obligations in this DPA, and shall allow for and contribute to audits, including inspections, conducted by the Controller or an auditor mandated by the Controller.

11.2 Audits shall be conducted:
- Once per calendar year at the Controller's cost, or more frequently in the event of a Personal Data Breach or reasonable concern about compliance
- With at least 30 days' prior written notice
- During normal business hours
- Without materially disrupting the Processor's operations
- Subject to reasonable confidentiality undertakings

11.3 The Processor may satisfy its audit obligation by providing:
- A current SOC 2 Type II report or equivalent independent third-party audit report
- ISO/IEC 27001 certification and corresponding Statement of Applicability
- Other equivalent industry-standard audit or certification evidence

provided such reports cover the Services and are dated within the previous 12 months. The Controller reserves the right to conduct a direct audit where such reports do not cover specific concerns raised.

> `[ATTORNEY REVIEW]` — Audit rights are typically the second-most-negotiated clause after breach notification. Vendors prefer SOC 2 report delivery in lieu of direct audit; Memoro's template accepts that in Section 11.3, which is pragmatic. Direct-audit reservation in 11.3 final sentence protects against dilution.

## 12. Deletion or return of data on termination

12.1 Upon termination of the Main Agreement or this DPA (whichever ends earlier), the Processor shall, at the choice of the Controller (communicated in writing within 30 days of termination), delete or return all Personal Data to the Controller and delete existing copies, unless Union or Member State law requires storage of the Personal Data.

12.2 The Processor shall confirm deletion in writing. Where deletion is not technically feasible for backup media, the Processor shall isolate and protect the Personal Data from active Processing until technically feasible deletion.

12.3 The default choice, absent written instruction from the Controller within 30 days of termination, is deletion.

## 13. Liability

The Parties' liability for matters arising under this DPA is governed by the limitations of liability set out in the Main Agreement, provided that limitations of liability shall not apply to the extent prohibited by Applicable Data Protection Law (in particular, limitations cannot exclude liability arising from Data Subject claims under the GDPR as addressed in SCC Clause 12).

> `[ATTORNEY REVIEW]` — Liability interplay between this DPA and the Main Agreement is a common friction point. For DPAs negotiated under enterprise cloud MSAs, the cap is typically shared. For DPAs standalone (e.g. a small subprocessor without a broader MSA), a DPA-specific cap may be needed. Counsel to tailor per negotiation.

## 14. General provisions

14.1 **Governing law.** This DPA is governed by the law of **`[MEMBER STATE — TBD, consistent with Main Agreement]`**, except to the extent Applicable Data Protection Law mandatorily prescribes other governing law.

14.2 **Conflicts.** In the event of conflict between this DPA and the Main Agreement concerning the Processing of Personal Data, this DPA prevails. In the event of conflict between this DPA and the SCCs, the SCCs prevail.

14.3 **Severability.** If any provision is held invalid, the remainder remains in effect.

14.4 **Changes to Applicable Data Protection Law.** The Parties shall negotiate in good faith to update this DPA in response to material changes in Applicable Data Protection Law.

14.5 **Notices.** Notices under this DPA shall be sent in writing to the addresses set out at the top of this DPA or to such other address as a Party notifies to the other in writing.

14.6 **Counterparts.** This DPA may be executed in counterparts, including by electronic signature.

---

**SIGNED:**

For Controller (**`[MEMORO ENTITY]`**):
Name: `[NAME]`
Title: `[TITLE]`
Date: `[DATE]`

For Processor (**`[SUBPROCESSOR]`**):
Name: `[NAME]`
Title: `[TITLE]`
Date: `[DATE]`

---

## Annex I — Description of Processing

### A. List of Parties
As set out at the top of this DPA.

### B. Description of processing

**Purpose of processing.** `[Concise description — e.g. "Provision of authentication and session-management services enabling Controller's users to access the Memoro application"]`

**Categories of Data Subjects.** Users of Memoro (individual retail investors aged 18+).

**Categories of Personal Data processed.** `[Select and populate]`
- Identity data (email, name)
- Authentication data (session tokens, MFA factors)
- Portfolio data (brokerage account holdings, transaction history)
- AI interaction data (chat content, response history)
- Usage data (access logs, feature events)
- Billing data (payment-method tokens, billing address)

**Sensitive / special-category data.** None. Processor shall not process special-category data as defined in GDPR Article 9.

**Frequency of processing.** Continuous throughout the term of the Main Agreement.

**Duration of Processing.** Term of the Main Agreement plus retention per Section 12.

**Nature of Processing.** `[e.g. collection, storage, retrieval, use, transmission, pseudonymization, deletion]`

**Purpose of data transfer (if SCCs apply).** Provision of the Services to the Controller.

**Transfer period.** Duration of the Main Agreement.

### C. Competent supervisory authority

`[TBD — depends on Controller's Member State of establishment or EU representative appointment]`

---

## Annex II — Technical and organizational measures (Art. 32 GDPR)

> `[PROCESSOR-POPULATED]` — To be completed by the Processor with its specific TOMs. Baseline expectations:

**Encryption and pseudonymization.**
- Encryption in transit: TLS 1.2 or higher for all Personal Data transmission.
- Encryption at rest: AES-256 (or equivalent) for all Personal Data storage.
- Key management: encryption keys managed by a hardware security module or equivalent, with documented key rotation policy.

**Access control.**
- Role-based access control applied to internal personnel.
- Multi-factor authentication required for administrative access to production systems.
- Access logs retained for 12 months minimum.
- Personnel termination triggers immediate access revocation.

**Backup and availability.**
- Automated backups with geographic redundancy.
- Documented recovery-time and recovery-point objectives (RTO / RPO).
- Tested disaster-recovery plan exercised at least annually.

**Logging and monitoring.**
- Centralized logging for security-relevant events.
- Anomaly detection and alerting.
- Retention of security logs for 12 months minimum.

**Vulnerability management.**
- Automated dependency scanning.
- Regular penetration testing (annual or on material change).
- Timely patching of security vulnerabilities per industry-standard CVSS-based SLA.

**Personnel.**
- Background checks where legally permitted.
- Confidentiality undertakings.
- Data-protection and security training on onboarding and at least annually.

**Incident response.**
- Documented incident-response plan.
- Incident-response team with defined roles.
- Tabletop exercises at least annually.

**Vendor management (for Processor's own sub-processors).**
- Due-diligence process for all Sub-processors.
- Flow-down of data-protection obligations.

**Physical security.**
- Restricted access to data-center facilities (handled by cloud infrastructure provider).
- No paper records of Personal Data.

---

## Annex III — List of approved Sub-processors (as of Effective Date)

| Sub-processor legal name | Purpose | Location | DPA in place |
|---|---|---|---|
| `[SUB-SUB-PROCESSOR 1]` | `[e.g. underlying cloud infrastructure]` | `[COUNTRY]` | `[Y/N]` |
| `[SUB-SUB-PROCESSOR 2]` | `[e.g. backup storage]` | `[COUNTRY]` | `[Y/N]` |

Processor shall maintain an up-to-date list at **`[PUBLIC URL OR CONTACT EMAIL]`** and notify Controller of changes per Section 6.2.

---

## Annex IV — EU Standard Contractual Clauses (Module 2)

The Standard Contractual Clauses for the transfer of personal data to third countries pursuant to Regulation (EU) 2016/679, adopted by Commission Implementing Decision (EU) 2021/914 of 4 June 2021, **Module 2 (Controller to Processor)**, are incorporated by reference and attached.

**Source (official):** https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj

Completed annexes are as set out in this DPA's Annexes I, II, and III.

---

## Annex V — UK International Data Transfer Agreement / Addendum

For transfers from the UK, the Parties incorporate the **UK International Data Transfer Addendum to the EU Commission Standard Contractual Clauses** ("UK Addendum"), version B.1.0, issued by the UK Information Commissioner as effective on 21 March 2022.

**Source (official):** https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-data-transfer-agreement-and-guidance/

Completed tables:

- **Table 1 (Parties):** as set out at the top of this DPA, plus UK-contact addresses as applicable.
- **Table 2 (Selected Approved EU SCCs):** the EU SCCs attached as Annex IV, Module 2.
- **Table 3 (Appendix Information):** as set out in Annexes I, II, III.
- **Table 4 (Ending the Addendum when the Approved Addendum Changes):** Neither Party may end the Addendum under Section 19 unless the changes are material and adversely affect the Party's rights.

---

## References

- GDPR Articles 28, 32, 33, 34, 35: https://gdpr-info.eu/
- Commission Implementing Decision (EU) 2021/914 (SCCs): https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj
- EDPB Guidelines 07/2020 on controller-processor concepts: https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-072020-concepts-controller-and-processor-gdpr_en
- UK IDTA and UK Addendum: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-data-transfer-agreement-and-guidance/
- EDPB Recommendations 01/2020 on supplementary measures (post-Schrems II): https://edpb.europa.eu/our-work-tools/our-documents/recommendations/recommendations-012020-measures-supplement-transfer_en

All URLs accessed 2026-04-23.

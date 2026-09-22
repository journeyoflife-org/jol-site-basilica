# Data Protection Impact Assessment — jol-site-basilica

**GDPR Article 35 — Data Protection Impact Assessment**

Instantiated from the canonical template at
`jol-compliance/gdpr/dpias/dpia-template.md`. Together with
[`compliance/ropa/jol-site-basilica-ropa.md`](../ropa/jol-site-basilica-ropa.md)
this closes ADR-011 **INV-9** ("every spoke has a ROPA record and DPIA before
go-live") at spoke level.

> **Status: DRAFT — NOT APPROVED. Go-live is blocked.**
> Fields marked `[REQUIRED — DPO INPUT]` must be completed by the Data
> Protection Officer. Nothing here is invented: assessment rows are filled only
> where repository evidence exists, and each carries its citation.

| Field | Value |
|-------|-------|
| **Organisation** | `[REQUIRED — DPO INPUT]` — the contracting legal entity is not stated in any repository |
| **Project / System Name** | JOL Basilica vertical front-end (ADR-011 spoke #1, vertical `basilica`, layout family `sacred`) |
| **DPIA Reference** | DPIA-2026-`[NNN — DPO to assign]` |
| **Data Protection Officer** | `[REQUIRED — DPO INPUT]` |
| **DPIA Lead** | `[REQUIRED — DPO INPUT]` |
| **Document Owner** | `[REQUIRED — DPO INPUT]` |
| **Version** | 0.1.0-draft |
| **Initiated Date** | 2026-09-13 |
| **Completed Date** | Not completed |
| **Status** | ☒ Draft ☐ Under Review ☐ Approved ☐ Re-assessment |
| **Classification** | Internal — Confidential |
| **Companion ROPA** | `compliance/ropa/jol-site-basilica-ropa.md` (spoke-level, human-readable Art. 30 record) |

> **INV-9 note — two ROPA locations exist.** ADR-011 states enforcement as
> "ROPA dir existence check per spoke", but the implemented check
> (`@journeyoflife-org/testing` → `adr011-invariants.test.ts`, INV-9) asserts
> `jol-hub/data/exports/ropa/lt/<vertical>/*.json`. That hub path is populated
> for all ten verticals and passes. The spoke-level record here is therefore
> **supplementary** — it is the Art. 30 narrative for this vertical, not the
> machine-checked artefact. The prose/implementation discrepancy needs
> reconciliation in the ADR-011 amendment.

---

## 1. Screening: Is a DPIA Required?

| # | Screening Question | Yes | No | Evidence |
|---|-------------------|-----|-----|-------|
| 1 | Special category data (Art. 9)? | ☒ | ☐ | Religious belief is the product's subject matter. `seed-data/src/schema.ts` classifies clergy data as Art. 9: *"Clergy names are Art. 9 personal data and must come from the RLS-scoped content API, never from a committed fixture."* |
| 2 | Large scale (≥400,000 data subjects)? | ☐ | ☒ | Pilot is 7 basilica tenants in this spoke. Platform ambition is larger, but this assessment is scoped to the LT basilica pilot. |
| 3 | Systematic monitoring of publicly accessible areas? | ☐ | ☒ | No CCTV or location tracking. `mapLocation` block stores only the *institution's* coordinates, not visitor location. |
| 4 | Automated decision-making with legal/significant effects? | ☐ | ☒ | No profiling or scoring identified in code. |
| 5 | Vulnerable data subjects? | ☒ | ☐ | Design brief explicitly targets elderly visitors and pilgrims. Pastoral enquiries (funerals, baptism, confession) concern people in bereavement or crisis. Canonical template classes "congregants in pastoral care" as vulnerable. |
| 6 | New technologies (AI/ML, biometrics)? | ☐ | ☒ | None in this spoke. |
| 7 | Matching or combining datasets from multiple sources? | ☒ | ☐ | Web enquiries are combined with CRM records: `jol-bitrix24-integration` performs **bidirectional** contacts/deals/organisations sync with deterministic conflict resolution. |
| 8 | Systematic evaluation or scoring of individuals? | ☐ | ☒ | None identified. |
| 9 | Transfers outside the EU? | ☒ | ☐ | Build/package supply chain resolves from `npm.pkg.github.com` and CI runs on GitHub Actions (US). Tenant personal data is asserted EU-only; see §6. |
| 10 | Supervisory authority "must-DPIA" list? | `[REQUIRED — DPO INPUT]` | ☐ | VDAI (Lithuania) blacklist not checked. Religious-affiliation processing plus large-scale web publication is commonly listed. |

**Screening Result: ☒ DPIA REQUIRED** — questions 1, 5, 7 and 9 are affirmative.

---

## 2. Description of Processing

### 2.1 Nature

| Aspect | Description |
|--------|-------------|
| **Processing Operations** | Publication of institutional content; collection of contact/pastoral enquiries; consent-gated behavioural analytics; subdomain-based tenant resolution; editorial creation and moderation of tenant content by authenticated staff; synchronisation of enquiry data to Bitrix24 CRM |
| **Technologies Used** | Next.js 14 App Router (SSR), TypeScript strict, PostgreSQL schema-per-tenant with RLS (ADR-001), `@journeyoflife-org/tenant-resolver`, `@journeyoflife-org/bitrix-sdk`, Bitrix24 Enterprise on-premise (JOL Proxmox, EU), SOPS/age secret encryption, Proxmox VE deployment |
| **Data Flow** | Visitor → nginx wildcard (`*.gyvenimo-kelias.lt`) → tenant resolution (host → slug → schema) → SSR page from seed fixture or RLS-scoped content API → enquiry form → hub backend → Bitrix24 CRM (bidirectional sync) → staff task. Analytics: browser → consent check → `sendBeacon` → platform endpoint. |

### 2.2 Scope

| Aspect | Description |
|--------|-------------|
| **Geographic Scope** | Lithuania. Data sovereignty: LT data resides in Lithuania (`obsidian/01-Governance/.../High-Level-Architecture-and-Core-Principles.md`) |
| **Data Subject Volume** | 7 basilica tenants in this spoke. Verified resolvable: `basilica-vilnius-cathedral`. The seven-tenant pilot set is registered in `@journeyoflife-org/tenant-resolver` |
| **Data Categories** | DC-01, DC-02, DC-03, DC-04 **(Art. 9)**, DC-06 **(Art. 9)**, DC-08. DC-05 Financial is **not processed** — see §2.5 |
| **Processing Frequency** | Continuous (public website); event-driven (enquiries); periodic (CRM sync) |

### 2.3 Context

| Aspect | Description |
|--------|-------------|
| **Data Subject Relationship** | Members of religious institutions, pilgrims, tourists and bereaved families using the site voluntarily |
| **Data Subject Expectations** | Confidential handling of pastoral enquiries. A funeral or confession enquiry is reasonably expected to be seen only by the addressed clergy |
| **Vulnerable Populations** | Elderly visitors (explicit design target); bereaved families; people in pastoral crisis; potentially children if any tenant enables youth content |

### 2.4 Purpose

| Purpose | Description | Legal Basis |
|---------|-------------|-------------|
| Publish institutional information | History, schedules, visiting hours, location | `[REQUIRED — DPO INPUT]` — likely Art. 6(1)(f) legitimate interests |
| Handle pastoral enquiries | Weddings, funerals, baptism, confession, Mass intentions, pilgrimage, group visits, volunteering | `[REQUIRED — DPO INPUT]` — **Art. 9(2) condition mandatory, none recorded** |
| Consent-gated analytics | Measure engagement | `[REQUIRED — DPO INPUT]` — likely Art. 6(1)(a) consent |
| Editorial administration | Staff author and moderate tenant content | `[REQUIRED — DPO INPUT]` — likely Art. 6(1)(b) or (f) |
| CRM synchronisation | Route and track enquiries to staff | `[REQUIRED — DPO INPUT]` — inherits the enquiry basis |

### 2.5 Excluded processing — payments

**No financial data (DC-05) is processed by this spoke.** ADR-009 Model A closes
the payment boundary: no PSP SDK, key or endpoint anywhere in the hub tree,
frontend and config included. `@journeyoflife-org/ui`'s legacy PSP-integrated donation
widget was removed under O-021; no `stripe` dependency exists in any package
manifest; the INV-3 invariant test passes. The renderer's donation surface
shows a pending-payments notice and does not simulate a charge.

The 1.2% GPM function is **informational only**, directing visitors to the
official VMI/EDS system. No payment data is collected. Consequence: **this
DPIA does not cover payment processing**, and any future live donation flow
requires a fresh DPIA plus ADR-009 §4's sole opening condition (PCI-DSS SAQ A
verification).

---

## 3. Necessity and Proportionality

### 3.1 Lawfulness, fairness, transparency

| Criterion | Assessment | Compliant |
|-----------|-----------|-----------|
| Legal basis per purpose | None recorded for any purpose in §2.4 | ☐ Yes ☐ Partial ☒ **No** |
| Privacy notice | `jol-compliance/gdpr/privacy-policies/lt/privacy-policy-lt.md` exists but is an unadopted template; the spoke renders `/privacy` links in its footer to routes that do not exist in `src/app/` | ☐ Yes ☒ **Partial** ☐ No |
| Purpose limitation | Enquiry data flows to CRM for staff assignment; no secondary use identified in code | ☒ Yes ☐ Partial ☐ No |
| **Authorization to publish** | **No written authorization from any basilica or diocese exists in any repository.** `obsidian/.../Essential-Clarification-Questions.md` Q9 asks whether domain and church-authority authorization exists at all | ☐ Yes ☐ Partial ☒ **No** |
| Controller/processor role | Undetermined. Canonical ROPA guidance §6: each tenant *"may act as an independent controller"* — requires an Art. 26 arrangement or Art. 28 DPA per institution | ☐ Yes ☐ Partial ☒ **No** |

### 3.2 Data minimisation

| Criterion | Assessment | Compliant |
|-----------|-----------|-----------|
| Only necessary data collected | Strong: clergy data is **role-only by schema contract**; names are excluded from committed fixtures. Tenant registry performs closed lookups with no enumeration endpoint (GDPR Art. 9 / SOC 2 CC6.1). `Tenant.schema` is stripped before any client boundary by `toPublicTenant()` | ☒ Yes |
| Retention periods defined | None defined for any activity | ☐ Yes ☐ Partial ☒ **No** |
| Anonymisation / pseudonymisation | Analytics is consent-gated before emission; `Tenant.id` is a public slug, never a database ID; PII-safe logging redacts personal data from application and audit logs | ☒ Yes (partial — `[REQUIRED — DPO INPUT]` confirm analytics identifiers) |

### 3.3 Data subject rights

Mechanisms exist in the hub (`gdpr/dsr-procedures/data-subject-rights-procedure.md`,
`SharedCompliancePage.tsx`, admin-dashboard `ConsentDashboard`,
`RetentionCountdown`) but are **not wired in this spoke** — it has no DSR
routes. `[REQUIRED — DPO INPUT]` confirm whether DSR is served centrally by the
renderer or must exist per spoke.

| Right | Mechanism in this spoke | SLA | Compliant |
|-------|-----------|-----|-----------|
| Access (Art. 15) | Not implemented | 30 days | ☐ Yes ☒ **No** |
| Rectification (Art. 16) | Not implemented | 30 days | ☐ Yes ☒ **No** |
| Erasure (Art. 17) | Not implemented; **note conflict** — append-only audit log and immutable registry policy must be reconciled with erasure | 30 days | ☐ Yes ☒ **No** |
| Restriction (Art. 18) | Not implemented | 30 days | ☐ Yes ☒ **No** |
| Portability (Art. 20) | Not implemented | 30 days | ☐ Yes ☒ **No** |
| Objection (Art. 21) | Not implemented | 30 days | ☐ Yes ☒ **No** |
| Automated decisions (Art. 22) | N/A — no automated decision-making | — | ☒ Yes |

---

## 4. Risk Assessment

### 4.1 Identification

| ID | Risk | Source / Threat | DC | L | S | Score | Level |
|----|------|-----------------|----|---|---|-------|-------|
| R-001 | Art. 9 pastoral enquiry processed with no recorded legal basis | Missing Art. 6 + Art. 9(2) determination | DC-04, DC-06 | 5 | 5 | 25 | **Critical** |
| R-002 | Publication of institutional content without authorization from the institution | No DPA, no Art. 26 arrangement, no written permission | DC-04 | 5 | 4 | 20 | **Critical** |
| R-003 | Cross-tenant data leakage | Multi-tenancy isolation failure | All | 2 | 5 | 10 | High |
| R-004 | Unlawful third-country transfer | US build/CI supply chain; `google.com/maps` directions links exposing visitor IP | DC-08 | 3 | 2 | 6 | Medium |
| R-005 | Clergy names published from a committed fixture | Contributor bypasses the role-only contract | DC-04 | 2 | 4 | 8 | Medium |
| R-006 | Compliance controls present but not enforcing | Three grep-based gates were vacuous (scanned zero files) from scaffold until 2026-09-12/13 remediation | All | 5 | 3 | 15 | **High → mitigated** |
| R-007 | Unverified historical or canonical claims published as fact | Seed fixtures carry `[TODO: verify with parish/diocese — do not publish unverified]` markers; `resolveLocale` currently publishes those markers to `/en` and `/ru` | DC-04 | 4 | 3 | 12 | High |
| R-008 | Enquiry data lost or duplicated in CRM sync | Bidirectional sync failure | DC-02, DC-06 | 2 | 3 | 6 | Medium |
| R-009 | No DSR mechanism reachable by data subjects | Spoke has no DSR routes | All | 4 | 4 | 16 | **High** |

### 4.2 Treatment

| ID | Level | Treatment | Measure | Residual L | Residual S | Owner | Target |
|----|-------|-----------|---------|-----------|-----------|-------|--------|
| R-001 | Critical | **Avoid** until resolved | Do not enable pastoral enquiry forms in production until Art. 6 + Art. 9(2) conditions are recorded per tenant | 1 | 5 | DPO | Before go-live |
| R-002 | Critical | **Avoid** until resolved | Obtain written authorization + executed DPA or Art. 26 arrangement per institution; staging hosts only until then | 1 | 4 | Platform owner + DPO | Before go-live |
| R-003 | High | Mitigate | Schema-per-tenant + RLS (ADR-001); `schema` server-only; closed lookups, no enumeration; LRU-cached resolution | 1 | 5 | Engineering | Implemented — verify by test |
| R-004 | Medium | Mitigate | EU-only tenant data residency; transfer impact assessment for the build/CI chain; replace `google.com/maps` directions with a self-hosted alternative or disclose in the privacy notice | 2 | 2 | DPO | `[REQUIRED]` |
| R-005 | Medium | Mitigate | Schema contract excludes names; add a CI assertion that no committed fixture contains a clergy name field | 1 | 4 | Engineering | Before go-live |
| R-006 | Mitigated | Mitigate | **Completed 2026-09-12/13**: all three gates rewritten with correct file selection and positive-control self-tests that fail if detection capability is lost. Applied to all ten spokes | 1 | 3 | Engineering | **Done** |
| R-007 | High | Mitigate | Convert `[TODO: verify]` markers from a runtime string into a **build-time failure**; add per-claim provenance fields (`source`, `verifiedBy`, `verifiedAt`) to the tenant schema | 2 | 3 | Engineering + content owner | Before go-live |
| R-008 | Medium | Mitigate | Deterministic conflict resolution, retry queue with exponential back-off, append-only audit log — all implemented in `jol-bitrix24-integration` | 1 | 3 | Engineering | Implemented — verify by test |
| R-009 | High | Mitigate | Wire DSR routes in the spoke or confirm central provision by the renderer; publish the adopted LT privacy notice | 2 | 4 | DPO + Engineering | Before go-live |

---

## 5. Measures Envisaged

### 5.1 Technical

| Measure | Description | Risks | Status |
|---------|-------------|-------|--------|
| Encryption at rest | SOPS/age tiered recipient model; `secrets/encrypted/{common,critical,production}` | R-001, R-003 | ☒ Implemented |
| Encryption in transit | TLS at edge | R-001 | ☒ Implemented — `[REQUIRED]` confirm version and wildcard-cert scope |
| Tenant isolation | PostgreSQL schema-per-tenant + RLS (ADR-001) | R-003 | ☒ Implemented |
| Server-only secrets | `Tenant.schema` stripped by `toPublicTenant()`; never serialized to clients | R-003 | ☒ Implemented |
| Non-enumeration | Closed lookups return `null`; bare 404; no registry endpoint exported | R-002, R-003 | ☒ Implemented and verified |
| Consent gating | Analytics emits only when `localStorage['jol-consent-analytics'] === 'granted'` | R-001 | ☒ Implemented |
| Clergy name exclusion | Schema contract: roles only in fixtures | R-005 | ☒ Implemented |
| Secret detection | `scripts/check-secrets.sh` with positive-control self-test | R-006 | ☒ Remediated 2026-09-13 |
| Payment boundary | `scripts/check-payment-boundary.sh` + hub INV-3 invariant test | — | ☒ Remediated; boundary CLOSED |
| CRM security | OAuth2, Fernet-encrypted tokens at rest, 90-day rotation, HMAC-SHA256 webhook verification, PII-safe logging, `crm`-only scope | R-001, R-008 | ☒ Implemented |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, deprecated `X-XSS-Protection` | R-001 | ☒ **Deficient** — no CSP, HSTS, `Referrer-Policy`, `Permissions-Policy` |
| Backup & DR | Hub renderer has `deploy.sh`/`rollback.sh` | R-008 | ☐ **Gap** — this spoke ships no Dockerfile and no deploy/rollback script |

### 5.2 Organisational

| Measure | Description | Risks | Status |
|---------|-------------|-------|--------|
| DPO oversight | DPO reviews new processing activities | All | ☐ **Not evidenced** — no DPO identified |
| ROPA record | Spoke-level Art. 30 narrative + hub machine-checked JSON per vertical | All | ☒ Implemented (both) |
| DPIA | This document | All | ☒ Draft |
| DPA with processors | Art. 28 DPAs with sub-processors | R-002, R-004 | ☐ **Not evidenced** — `bitrix24-dpa-status.md` records status only |
| Art. 26 joint-controller arrangement | Per institution, if joint controllership applies | R-002 | ☐ **Not evidenced** |
| Incident response | `jol-bitrix24-integration/docs/incident-playbook.md` | R-001 | ☐ Template — requires DPO approval |
| Authorization to publish | Written permission per institution | R-002 | ☐ **Absent for all institutions** |
| Privacy by design | Gate battery + invariant tests in CI | R-006 | ☒ Implemented |

---

## 6. Consultation with Supervisory Authority (Art. 36)

**Is prior consultation required?**

- [ ] No
- [x] **Cannot be determined without DPO input — but the default answer on current evidence is YES.**

**Rationale:** R-001 and R-002 are scored Critical and are treated by
**Avoidance**, not mitigation — the processing simply must not start until a
legal basis and authorization exist. If the controller intends to begin
processing Art. 9 pastoral enquiries before those are in place, residual risk
remains high and Art. 36 prior consultation with **VDAI** (Lithuania) would be
required. If processing waits for the DPA and Art. 9(2) determination, residual
risk falls and consultation is likely unnecessary.

`[REQUIRED — DPO INPUT]` Art. 36 determination.

| Field | Value |
|-------|-------|
| Authority | VDAI (Valstybinė duomenų apsaugos inspekcija), Lithuania |
| Date of consultation | `[REQUIRED — DPO INPUT]` |
| Reference number | `[REQUIRED — DPO INPUT]` |
| Response | `[REQUIRED — DPO INPUT]` |
| Actions taken | `[REQUIRED — DPO INPUT]` |

---

## 7. Blocking items before go-live

1. Art. 6 basis and **Art. 9(2) condition** recorded per purpose and per tenant (R-001).
2. **Written authorization to publish** plus executed DPA or Art. 26 arrangement per institution (R-002).
3. Controller/processor role determined per tenant.
4. Retention periods defined for every activity.
5. DSR mechanisms reachable by data subjects (R-009).
6. LT privacy notice adopted and served at real routes; the spoke currently links to `/privacy`, `/cookies` and `/accessibility-statement` routes that do not exist in `src/app/`.
7. `[TODO: verify]` markers made a build-time failure rather than published text (R-007).
8. Security headers completed (CSP, HSTS, Referrer-Policy, Permissions-Policy).
9. Deployment and rollback pipeline built for the spoke.
10. DPO identified and this assessment signed off.

## 8. Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| DPIA Lead | `[REQUIRED]` | | |
| Data Protection Officer | `[REQUIRED]` | | |
| Platform Owner | `[REQUIRED]` | | |

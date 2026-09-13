# Record of Processing Activities — jol-site-basilica

**GDPR Article 30 — Record of Processing Activities**

Instantiated from the canonical template at
`jol-compliance/gdpr/ropa/ropa-template.md`. Satisfies ADR-011 **INV-9**
("every spoke has a ROPA record and DPIA before go-live").

> **Status: DRAFT — NOT APPROVED FOR GO-LIVE.**
> Fields marked `[REQUIRED — DPO INPUT]` must be completed and approved by the
> Data Protection Officer before any tenant is served on a production
> subdomain. No value in this record has been invented: rows below are filled
> **only** where repository evidence exists, and each carries its evidence
> citation. This is deliberate — an unverified ROPA is worse than an
> incomplete one, because it presents assumptions to a supervisory authority
> as records (Art. 30(4)).

| Field | Value |
|-------|-------|
| **Organisation** | `[REQUIRED — DPO INPUT]` legal entity name. Repository evidence is limited to the `journeyoflife-org` GitHub organisation and EUPL-1.2 licensing (ADR-011: `/opt/jol` = Church Platform). The contracting legal entity is not stated anywhere in this repository. |
| **Registration Number** | `[REQUIRED — DPO INPUT]` |
| **Registered Address** | `[REQUIRED — DPO INPUT]` |
| **Data Protection Officer** | `[REQUIRED — DPO INPUT]` |
| **EU Representative** | `[REQUIRED — DPO INPUT]` — likely N/A if the controller is established in Lithuania |
| **Document Owner** | `[REQUIRED — DPO INPUT]` |
| **Version** | 0.1.0-draft |
| **Effective Date** | Not effective — draft |
| **Last Reviewed** | 2026-09-12 |
| **Next Review Due** | On DPO completion |
| **Classification** | Internal — Confidential |
| **Spoke** | `jol-site-basilica` (ADR-011 spoke #1, vertical `basilica`, layout family `sacred`) |

---

## 0. Controller / processor position — UNRESOLVED, BLOCKING

The canonical template's own guidance §6 states: *"Each tenant (religious
institution) may act as an independent controller. Confirm controller/processor
roles in the Data Processing Agreement."*

This is the single largest open compliance question for the Basilica pilot and
it is **not answerable from code**:

- The pilot spans **seven** basilica tenants in this spoke plus **one**
  cathedral-basilica in `jol-site-cathedral` (Kaunas Cathedral Basilica remains
  `cathedral-kaunas` per platform-owner ruling, 2026-09-12).
- Each is a distinct religious institution, potentially a distinct legal
  person, in a distinct diocese.
- Whether JOL is **controller**, **joint controller** (Art. 26) or **processor**
  (Art. 28) for each determines whether an Art. 26 arrangement or an Art. 28
  DPA is required — and who owes the Art. 13/14 transparency duty.
- No DPA, Art. 26 arrangement, or written authorization to publish was found in
  any repository, for any of the eight institutions.

**Consequence:** no tenant may go live on a production subdomain until this is
resolved per institution. Staging hosts only until then.

`[REQUIRED — DPO INPUT]` controller/processor role per tenant, and the
executed DPA or Art. 26 arrangement reference for each.

---

## 1. Controller Processing Activities

### 1.1 Processing Activity Register

Rows PA-001 … PA-005 are **code-evidenced**. Retention periods and Art. 9
conditions are not determinable from code and are left to the DPO.

| Ref. | Activity Name | Purpose | Legal Basis (Art. 6) | Special Category Basis (Art. 9) | Data Categories | Data Subject Categories | Recipient Categories | Third-Country Transfers | Retention | TOMs |
|------|--------------|---------|---------------------|-------------------------------|----------------|------------------------|---------------------|------------------------|-----------|------|
| PA-001 | Contact / enquiry form handling | Route visitor, pilgrimage, group-visit, wedding, funeral and volunteer enquiries to staff | `[REQUIRED — DPO INPUT]` | `[REQUIRED — DPO INPUT]` — see §1.3 | DC-01, DC-02, DC-06 | DS-03, DS-05, DS-06 | Bitrix24 CRM (on-premise, EU) | None expected — see §6 | `[REQUIRED — DPO INPUT]` | TLS in transit; HMAC-SHA256 webhook verification; PII-safe logging; `crm`-only least-privilege scope |
| PA-002 | Consent-gated analytics | Measure page and content engagement | `[REQUIRED — DPO INPUT]` | N/A | DC-08 | Anonymous visitors | Self-hosted platform analytics | `[REQUIRED — DPO INPUT]` | `[REQUIRED — DPO INPUT]` | Consent gate before any emission; `navigator.sendBeacon`; no third-party tracking SDK |
| PA-003 | Tenant resolution | Serve the correct basilica site per subdomain | `[REQUIRED — DPO INPUT]` | N/A | DC-08 (host header, IP) | Anonymous visitors | None (in-process) | None | `[REQUIRED — DPO INPUT]` | Closed lookups only, no tenant enumeration; 5-minute LRU; schema name server-only |
| PA-004 | Clergy and ministry publication | Present ministry roles and role-based contact addresses | `[REQUIRED — DPO INPUT]` | `[REQUIRED — DPO INPUT]` — DS-01 religious affiliation | DC-02, DC-04 | DS-01 | Public website visitors | None | `[REQUIRED — DPO INPUT]` | **Roles only, never names, in committed fixtures** — enforced by schema contract |
| PA-005 | Editorial and moderation | Authenticated staff create, moderate and publish tenant content | `[REQUIRED — DPO INPUT]` | N/A | DC-01, DC-03 | DS-02 | Platform administrators | `[REQUIRED — DPO INPUT]` | `[REQUIRED — DPO INPUT]` | Authentication; moderation queue; HTML sanitisation; rate limiting |

### 1.2 Evidence citations

| Ref. | Evidence |
|------|----------|
| PA-001 | `jol-bitrix24-integration/docs/architecture.md`; `@jol-hub/bitrix-sdk/src/api/crm.ts`; renderer `components/crm/ContactFormCrm.tsx`, `app/api/crm/leads/route.ts` |
| PA-002 | `src/lib/analytics.ts` — consent read from `localStorage['jol-consent-analytics']`, emits only when value is exactly `granted` |
| PA-003 | `@jol-hub/tenant-resolver/src/index.ts` — subdomain/header resolution, LRU cache, `toPublicTenant` strips `schema` |
| PA-004 | `@jol-hub/seed-data/src/schema.ts` — `ClergyRoleListBlockSchema` documented as "ROLES ONLY, never names. Clergy names are Art. 9 personal data and must come from the RLS-scoped content API, never from a committed fixture." |
| PA-005 | Renderer `components/editor/{BlockEditor,ModerationQueue}.tsx`, `lib/editor/{sanitize,moderation,validation}.ts`, `lib/rate-limit.ts`, `app/api/auth/[...nextauth]/route.ts` |

### 1.3 Art. 9 exposure — the material risk

Religious belief is special-category data. This spoke's core subject matter
*is* religious affiliation, so Art. 9 is engaged by the product's existence,
not by an incidental feature:

- Enquiries about **weddings, funerals, baptism, confession and Mass
  intentions** (PA-001) reveal religious belief of the enquirer and of named
  third parties (e.g. the deceased).
- **DC-06 Communication Data** is classified Special Category in the canonical
  template, and prayer/pastoral requests fall squarely inside it.
- These are routed into **Bitrix24 CRM**, which requests `crm`-only scope and
  applies PII-safe logging, but for which **no Art. 9(2) condition is
  evidenced anywhere** in `jol-bitrix24-integration/compliance/gdpr/lawful-basis.md`
  or elsewhere. That repository's own README states: *"All compliance
  documents are templates. They require review and approval by your DPO before
  production use."*

`[REQUIRED — DPO INPUT]` the Art. 9(2) condition relied upon for PA-001 and
PA-004, per tenant. Until recorded, contact forms that route pastoral
enquiries to the CRM **must not be enabled in production**.

---

## 2. Processor Processing Activities

`[REQUIRED — DPO INPUT]` — depends entirely on the §0 controller/processor
determination. If JOL acts as processor for each basilica, this section becomes
the primary register and §1 is restated from the controller's perspective.

---

## 3. Data Categories

Per the canonical template: DC-01 Identity, DC-02 Contact, DC-03
Authentication, DC-04 Religious Affiliation **(Art. 9)**, DC-05 Financial,
DC-06 Communication Data **(Art. 9)**, DC-07 Children's Data **(heightened)**,
DC-08 Technical.

Spoke-specific notes:

- **DC-05 Financial** — not processed by this spoke. ADR-011 **INV-3**
  (ADR-009 Model A) closes the payment boundary: no PSP SDK may be imported
  into any spoke, enforced by `scripts/check-payment-boundary.sh`. Donation
  handling is hub-backend only. The 1.2% GPM function is **informational**,
  directing the visitor to the official VMI/EDS system; no payment data is
  collected here.
- **DC-07 Children's Data** — no processing identified in code. Must be
  re-assessed if any tenant enables youth-group or Sunday-school content.
- **DC-04** — unavoidable; see §1.3.

---

## 4. Data Subject Categories

DS-01 Clergy, DS-02 Lay Administrators, DS-03 Congregation Members, DS-05
Donors, DS-06 Third-Party Contacts, and anonymous website visitors (pilgrims,
tourists). DS-04 Children & Minors — not currently processed.

Note for DS-01: clergy **names** are Art. 9 personal data and are excluded
from committed fixtures by schema contract (PA-004 evidence). Any move to
publish named clergy requires a fresh Art. 9 assessment and, in practice,
documented consent from the individual.

---

## 5. Recipient & Third-Party Disclosures

| Recipient | Category | Data Shared | Legal Basis | DPA in Place | Location |
|-----------|----------|-------------|-------------|-------------|----------|
| Bitrix24 Enterprise (self-hosted) | CRM, JOL-operated | Enquiry and contact data (PA-001) | Art. 28 or Art. 26 — `[REQUIRED — DPO INPUT]` | `[REQUIRED — DPO INPUT]` — `jol-bitrix24-integration/compliance/dpa/bitrix24-dpa-status.md` records status only | JOL Proxmox infrastructure, EU |
| Proxmox VE hosting | Infrastructure, JOL-operated | All served content and access logs | JOL-operated | N/A (own infrastructure) | Lithuania — `[REQUIRED — DPO INPUT]` confirm |
| Maps / directions | Not a recipient | None | N/A | N/A | Self-hosted tiles only; `mapLocation` block documents "no third-party SDK". Note the directions link currently targets `google.com/maps` — see §6. |

---

## 6. International Data Transfers

`jol-bitrix24-integration` asserts *"All data stays within JOL-controlled EU
infrastructure — no third-country transfers."* Two items contradict or
complicate that assertion and need DPO confirmation:

1. **Directions links.** The tenant fixture's `mapLocation.directionsUrl`
   points to `https://www.google.com/maps/dir/?...`. Clicking it sends the
   visitor's browser to a US provider. This is a visitor-initiated navigation
   rather than a server-side transfer of JOL-held personal data, but it is a
   third-party disclosure of the visitor's IP address and must be covered by
   the cookie/privacy notice.
2. **Build and package supply chain.** `@jol-hub/*` packages resolve from
   `npm.pkg.github.com` and CI runs on GitHub Actions (US). This carries
   **source code, not tenant personal data** — but IP addresses of contributors
   and CI logs are in scope and should be assessed.

`[REQUIRED — DPO INPUT]` transfer mechanism and safeguards for both.

---

## 7. Retention Schedule

`[REQUIRED — DPO INPUT]` for every activity. Cross-reference
`jol-compliance/gdpr/retention-policies/data-retention-policy.md`, which is
also a template and not yet instantiated for this spoke.

---

## 8. Technical and Organisational Measures (Art. 32)

| Measure | Description | Status |
|---------|-------------|--------|
| Encryption at rest | SOPS/age tiered recipient model; `secrets/encrypted/` | Implemented (satellite kit) |
| Encryption in transit | TLS | Implemented at edge; `[REQUIRED — DPO INPUT]` confirm TLS version and wildcard-certificate scope for `*.gyvenimo-kelias.lt` |
| Secret detection | `scripts/check-secrets.sh` with positive-control self-test | **Remediated 2026-09-12** — previously vacuous, scanning zero files |
| Payment boundary | `scripts/check-payment-boundary.sh` (INV-3, ADR-009 Model A) | **Remediated 2026-09-12** — previously vacuous |
| Access control | RBAC via `@jol-hub/auth`, `next-auth` | Implemented in hub renderer |
| Schema isolation | Schema-per-tenant + RLS (ADR-001); schema name server-only | Implemented |
| Tenant non-enumeration | Closed lookups returning `null`; bare 404 | Implemented |
| Audit logging | Append-only JSON audit log | Implemented in `jol-bitrix24-integration` |
| PII-safe logging | Redaction filter | Implemented in `jol-bitrix24-integration` |
| Token management | OAuth2, Fernet-encrypted at rest, 90-day rotation | Implemented in `jol-bitrix24-integration` |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, deprecated `X-XSS-Protection` | **Deficient** — no CSP, HSTS, `Referrer-Policy` or `Permissions-Policy`; `[REQUIRED]` remediation |
| Backup & recovery | Proxmox immutable image tags; `deploy.sh` / `rollback.sh` exist in hub renderer | **Gap** — this spoke ships no Dockerfile and no deploy/rollback script |
| Incident response | `jol-bitrix24-integration/docs/incident-playbook.md` | Template — requires DPO approval |

---

## 9. Review & Approval History

| Date | Reviewer | Role | Changes Made | Approved |
|------|----------|------|--------------|----------|
| 2026-09-12 | AI-assisted architecture review | Lead Architect (acting) | Initial instantiation from canonical template; code-evidenced rows only | ☐ No — DPO approval required |

---

## Blocking items before go-live

1. §0 controller/processor determination per institution, with executed DPA or
   Art. 26 arrangement.
2. Written **authorization to publish** from each basilica or its diocese —
   none exists for any of the eight institutions.
3. Art. 9(2) condition recorded for PA-001 and PA-004.
4. Retention periods for all activities.
5. Legal entity, registration number, DPO and document owner identified.
6. Security-header and deploy/rollback gaps in §8 closed.
7. Companion **DPIA** completed from
   `jol-compliance/gdpr/dpias/dpia-template.md` (INV-9 requires both).

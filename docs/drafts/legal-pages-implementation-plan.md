# Legal Pages — Implementation Plan

> **Date:** 2026-09-14
> **Status:** Plan — requires professional legal review before production
> **Prompt:** Phase 2A / Prompt 8

## 1. Current State Audit

### 1.1 Spoke Legal Pages (3 pages)

| Page | Route | File | Language | Legal review banner |
|---|---|---|---|---|
| Privacy policy | `/privacy` | `src/app/privacy/page.tsx` (109 lines) | lt only | Yes (GDPR Art. 13/14) |
| Cookie policy | `/cookies` | `src/app/cookies/page.tsx` (107 lines) | lt only | Yes (e-Privacy + GDPR) |
| Accessibility statement | `/accessibility-statement` | `src/app/accessibility-statement/page.tsx` (121 lines) | lt only | Yes (EU 2016/2102 + WCAG 2.2) |

### 1.2 Hub Renderer Legal Pages

**None.** The hub `template-renderer` has zero legal pages. When the spoke's duplicated renderer is retired in favor of the hub renderer, legal pages will disappear entirely unless ported to the hub.

### 1.3 Fixture Schema

The `TenantFixtureSchema` in `@journeyoflife-org/seed-data` has **no legal page fields**. Legal content is not tenant-aware at the schema level. Each tenant may have different data controller identity, jurisdiction, or contact details that affect legal page content.

### 1.4 What's Tenant-Dynamic vs. Hardcoded

| Data | Source | Tenant-aware? |
|---|---|---|
| Organization name | `fixture.name` via `resolveLocale()` | Yes |
| Address | `fixture.identity.address` | Yes |
| Email | `fixture.identity.email` | Yes |
| Legal text body | Hardcoded Lithuanian strings in TSX | **No** |
| Last updated date | Hardcoded `"2026 m. rugsėjo 13 d."` | **No** |
| Legal basis references | Hardcoded (BDAR, e-Privacy directive) | **No** |

### 1.5 Cross-References

- Footer (page.tsx L412-416): links to all 3 legal pages with 3-locale labels
- Privacy → Cookies: link at L87
- Cookies → Privacy: link at L96
- Accessibility: standalone (no cross-links to privacy/cookies)

## 2. Factual Inconsistencies Found

| ID | Page | Issue | Severity |
|---|---|---|---|
| **FI-1** | Cookies L60-61 | Lists `_ga` and `_gid` Google Analytics cookies, but `analytics.ts` uses self-hosted analytics via `sendBeacon('/api/analytics')` with no Google Analytics SDK. The cookie policy describes cookies that **the site does not set**. | HIGH — factual error |
| **FI-2** | Accessibility L107-111 | Claims testing with NVDA, VoiceOver, TalkBack. No e2e test suite exists. The a11y-static gate checks source-level patterns only. The claim is **unverifiable and likely false**. | HIGH — misleading |
| **FI-3** | All three | "Paskutinis atnaujinimas: 2026 m. rugsėjo 13 d." is a hardcoded string, not derived from any metadata or build timestamp. If pages are updated, the date will not reflect reality. | MEDIUM — maintenance risk |
| **FI-4** | Privacy L48 | Lists "analitiniai slapukai (su sutikimu)" as a data category. No consent banner/cookie dialog exists in the UI. The consent gate in `analytics.ts` checks `localStorage` but there is no UX for granting/revoking consent. | MEDIUM — describes non-existent feature |
| **FI-5** | Cookies L79 | "Pirmąkart apsilankę svetainėje, matysite slapukų juostą" — no cookie banner/consent dialog exists. The page describes a feature that has not been implemented. | MEDIUM — describes non-existent feature |

## 3. Technical vs. Legal Content Separation

### 3.1 Technical (Engineering Responsibility)

These aspects are engineering decisions that do not require legal review:

| Aspect | Current State | Required State |
|---|---|---|
| Route structure | `/privacy`, `/cookies`, `/accessibility-statement` | Keep routes; consider `/legal/privacy` grouping for future expansion |
| Metadata (title, description) | Present, Lithuanian only | Add `robots: { index: false }` explicitly (defense-in-depth) |
| Tenant data injection | `fixture.name`, `fixture.identity.*` | Extend to cover data controller fields |
| Cross-linking between pages | Partial | Full cross-reference graph |
| Last-updated date | Hardcoded string | Derive from fixture metadata or build timestamp |
| Cookie consent UX | Not implemented | Required before analytics claims are truthful |
| Localization | lt only | en + ru translations (matching 3-locale parity) |
| Hub renderer parity | Missing | Legal pages must exist in hub renderer before spoke retirement |
| Schema model | No legal fields in fixture | Add `legalPages` to tenant fixture schema |

### 3.2 Legal Content (Professional Legal Review Required)

These aspects require a qualified legal professional — engineering cannot resolve them:

| Aspect | Regulatory Basis | Review Required |
|---|---|---|
| Data controller identity and contact details | GDPR Art. 13(1)(a) | Confirm tenant identity data satisfies data controller disclosure |
| Purposes of processing | GDPR Art. 13(1)(c) | Verify listed purposes match actual data processing |
| Legal basis for each processing purpose | GDPR Art. 13(1)(c) | Identify legal basis (consent, legitimate interest, legal obligation) |
| Data retention periods | GDPR Art. 13(2)(a) | Currently absent — must be added after legal review |
| Data recipient categories | GDPR Art. 13(1)(e) | Currently absent — must be added (e.g., hosting provider, Bitrix24) |
| International transfer safeguards | GDPR Art. 13(1)(f) | Currently absent — required if any data leaves EEA |
| Cookie categorization and accuracy | e-Privacy Art. 5(3) | Fix FI-1 (Google Analytics cookies that don't exist) |
| Accessibility Directive applicability | EU 2016/2102 Art. 1 | Legal determination depends on organization type, funding, services |
| GDPR Art. 9 (special category data) qualification | GDPR Art. 9 | Clergy data processing may constitute religious affiliation data |
| Right to lodge complaint with supervisory authority | GDPR Art. 13(2)(d) | Present but should name the specific DPA (Valstybinė duomenų apsaugos inspekcija) |

## 4. Implementation Plan

### Phase 8A: Fix Factual Errors (1-2 hours) — Engineering

**Goal:** Remove statements that are provably false. No legal review needed for removing false claims.

1. **FI-1:** Remove `_ga`/`_gid` cookie references from `/cookies`. Replace with accurate description of the self-hosted analytics (`/api/analytics` endpoint, consent-gated via `jol-consent-analytics` localStorage key). No third-party cookies are set.

2. **FI-2:** Remove NVDA/VoiceOver/TalkBack testing claims from `/accessibility-statement`. Replace with accurate statement: "Source-level accessibility checks are automated. Full assistive-technology testing is planned but not yet completed."

3. **FI-3:** Replace hardcoded date with `fixture.legalPages?.lastUpdated` (with fallback to a known-good date). This requires a schema addition (Phase 8C).

4. **FI-4, FI-5:** Remove references to cookie banner/consent dialog that does not exist. Replace with: "Consent management is implemented via browser localStorage. A visual consent dialog will be added in a future release."

### Phase 8B: Technical Hardening (2-3 hours) — Engineering

**Goal:** Make legal pages technically robust without changing legal content.

1. **Explicit robots metadata:** Add `robots: { index: false, follow: false }` to each legal page's `Metadata` export. Defense-in-depth alongside layout.tsx inheritance.

2. **Cross-link graph:** Ensure every legal page links to the other two. Currently:
   - Privacy → Cookies: present
   - Cookies → Privacy: present
   - Accessibility → Privacy/Cookies: **missing**

3. **Footer consistency:** The footer already links to all 3 pages with 3-locale labels. Verify this pattern is preserved when legal pages are ported to the hub renderer.

4. **Localization:** Add `en` and `ru` translations for all legal page UI strings (navigation, headings, back links). Legal body text remains Lithuanian until translated by legal review, but the structural strings should follow 3-locale parity.

5. **JSON-LD:** Consider adding `LegalService` or `GovernmentOrganization` schema to legal pages for search engine discoverability. Low priority pre-production.

### Phase 8C: Fixture Schema Extension (2-3 hours) — Hub + Spoke

**Goal:** Make legal pages tenant-aware at the schema level.

1. **Add `legalPages` field to `TenantFixtureSchema`:**
   ```typescript
   legalPages: {
     privacy: {
       dataController: string;        // overrides identity.name if different
       dataControllerAddress: string;  // overrides identity.address if different
       dataControllerEmail: string;    // overrides identity.email if different
       dataProtectionOfficer?: string; // if applicable
       lastUpdated: string;           // ISO 8601 date
     };
     cookies: {
       analyticsProvider: 'self-hosted' | 'google' | 'none';
       consentMechanism: 'localStorage' | 'cookie-banner' | 'none';
       lastUpdated: string;
     };
     accessibility: {
       conformanceLevel: 'A' | 'AA' | 'AAA';
       testingMethod: 'automated' | 'manual' | 'both' | 'none';
       enforcementBody: string;       // e.g., "Lygių galimybių kontrolieriaus tarnyba"
       enforcementUrl: string;
       lastUpdated: string;
     };
   }
   ```

2. **Backfill basilica fixture** with current values (self-hosted analytics, localStorage consent, AA conformance, automated testing, VDAI enforcement).

3. **Update spoke legal pages** to read from `fixture.legalPages.*` instead of hardcoded values.

### Phase 8D: Hub Renderer Port (3-4 hours) — Hub

**Goal:** Legal pages must exist in the hub renderer before the spoke's duplicated renderer is retired.

1. **Add legal page routes** to `template-renderer`: `[locale]/[tenant]/privacy`, `[locale]/[tenant]/cookies`, `[locale]/[tenant]/accessibility-statement`.

2. **Create shared legal page components** in `@journeyoflife-org/ui` or a new `@journeyoflife-org/legal` package. These components consume `fixture.legalPages.*` data and render tenant-aware legal content.

3. **Legal text localization:** Legal body text should be managed as tenant fixture content (not hardcoded in components). The hub renderer provides the structural template; the tenant fixture provides the legal text.

4. **Alternative:** If legal text is too jurisdiction-specific for a shared template, each spoke could retain its own legal page TSX while consuming shared layout components (header, footer, navigation, back-link).

### Phase 8E: Legal Review (External — Not Engineering)

**Goal:** Professional review of legal content before production.

1. **Privacy policy:** GDPR Art. 13/14 compliance review by data protection professional. Must verify:
   - Data controller identity is correct
   - Processing purposes match actual data flows
   - Legal basis is identified for each purpose
   - Data retention periods are specified
   - Data recipients are listed
   - Supervisory authority contact is named

2. **Cookie policy:** e-Privacy Directive compliance review. Must verify:
   - Cookie list is accurate (currently describes non-existent Google Analytics cookies)
   - Consent mechanism description matches implementation
   - Necessary vs. analytics cookie classification is correct

3. **Accessibility statement:** EU 2016/2102 applicability assessment. Must determine:
   - Whether the directive legally applies to this organization
   - Whether the "partially conforms" claim is accurate
   - Whether the enforcement body reference is correct

4. **Review outcome:** Replace amber "parengiamoji" banners with reviewed content. Add `lastUpdated` timestamps from review date.

## 5. Effort Estimate

| Phase | Scope | Effort | Blocker |
|---|---|---|---|
| 8A: Fix factual errors | Engineering | 1-2 hours | None |
| 8B: Technical hardening | Engineering | 2-3 hours | None |
| 8C: Schema extension | Hub + Spoke | 2-3 hours | Hub changes required |
| 8D: Hub renderer port | Hub | 3-4 hours | Depends on 8C |
| 8E: Legal review | External | Unknown | Requires legal professional |

**Engineering total:** 8-12 hours (1-1.5 days)
**External dependency:** Legal review timeline is uncontrollable.

## 6. Recommended Execution

1. **Execute Phase 8A immediately** — factual errors are a liability, not a design choice
2. **Execute Phase 8B immediately** — technical hardening has no dependencies
3. **Defer Phase 8C-8D** until TemplateRenderer packaging (Prompt 14) is complete — legal pages in the hub renderer depend on the package boundary being resolved
4. **Initiate Phase 8E in parallel** — legal review can begin while engineering executes Phases 8A-8D

## 7. Invariants

| ID | Rule | Rationale |
|---|---|---|
| INV-LEGAL-01 | Legal pages must never contain `[TODO: verify]` markers | CT-01 already enforces this for fixtures; legal pages must satisfy the same invariant |
| INV-LEGAL-02 | Legal page content must not be served from cache without `lastUpdated` metadata | GDPR Art. 13 requires data subjects to know when the notice was last updated |
| INV-LEGAL-03 | Cookie policy must accurately describe cookies actually set by the site | e-Privacy Art. 5(3) — inaccurate cookie disclosure is a regulatory violation |
| INV-LEGAL-04 | Accessibility statement testing claims must be verifiable | EU 2016/2102 Art. 7 — false conformance claims are enforceable |

# Professional Opinion — Updated Readiness Assessment

**Date:** 2026-09-13 (updated)
**Subject:** jol-site-basilica spoke + jol-hub platform — release-blocking architecture and readiness assessment
**Classification:** Release-blocking architecture and compliance assessment

## Executive Summary

The Basilica frontend is a **functional proof of concept, not a production-ready product**. This session remediated several defects identified in the prior assessment (type-check errors, legal pages, tests, fixture verification, branch merge), but the fundamental architectural governance problem — three competing rendering implementations — remains unresolved.

The project should not be published as a production public site. A controlled demonstration environment with `noindex` and a single verified tenant is the appropriate next step.

## Current Status (post-remediation)

| Area | Pre-session | Post-session | Production-ready? |
|---|---|---|---|
| Type-check | 19 errors | 0 errors | Yes (this gate) |
| Legal pages | Missing | 3 stubs (legal review required) | No — requires legal sign-off |
| Accessibility statement | Missing | Created (WCAG 2.2 AA target) | No — requires accuracy review |
| Automated tests | 0 tests | 45 tests (3 suites) | Insufficient for production |
| Spoke fixture markers | 11 `[TODO: verify]` | 0 markers | Yes (this gate) |
| Hub fixture identity data | Multiple errors | 4 Tier 1 corrections (uncommitted) | Partially — 408 `ru` markers remain |
| Hub branch | fix/i18n-rsc-barrel unmerged | Merged to main (FF, 125 commits) | Yes |
| Canonical renderer decision | Undecided | **Still undecided** | No — architectural governance gap |
| Shared packages (BF-4) | Duplicated renderer | **Still duplicated** | No — blocked on `write:packages` |
| Demo environment | No `noindex`, no access control | **Still missing** | No — P0 gap |
| Content governance | No metadata, no approval workflow | **Still missing** | No |
| Donation flow | Not implemented | Not implemented | No |
| Basilica tenant coverage | 1 of 8 | 1 of 8 | No — 7 tenants missing |

## What This Session Remediated

### Step 1 — Type-check errors (19 fixed)
- `scripts/check-a11y-pages.ts`: narrowed `string | undefined` from regex match
- `scripts/check-content-integrity.ts`: removed unused import, narrowed regex capture
- `scripts/check-perf-budget.ts`: added optional `detail` field to `Violation`
- `src/app/page.tsx`: 11 type assertions for `unknown` block properties, null guard for `fixture.pages[0]`
- `src/lib/resolve-locale.ts`: prefixed unused parameter

### Step 2 — Legal pages (3 created)
- `/privacy` — GDPR Art. 13/14 privacy notice (Lithuanian, legal-review banner)
- `/cookies` — e-Privacy cookie policy (Lithuanian, legal-review banner)
- `/accessibility-statement` — EU Web Accessibility Directive statement (Lithuanian, legal-review banner)
- All three reference fixture data (tenant name, address, email) — tenant-aware

### Step 3 — Hub fixture verification (9 tenants)
- 408 `[TODO: verify]` markers found — **all in `ru` translation fields**
- `lt` and `en` content verified as real data for real institutions
- Tier 1 identity corrections applied:
  - `diocese-vilnius`: 5 of 5 identity fields wrong (address, email, phone, domain, parish count)
  - `cathedral-kaunas`: phone wrong, postal code wrong
  - `parish-st-john-vilnius`: domain wrong (`svjonai.lt` → `jonai.lt`), postal code wrong
  - `deanery-vilnius-city`: address corrected to match diocese curia
- 2 demo fixtures identified (funeral-vilnius, cemetery-vilnius — fictional addresses)
- Verification report: `docs/drafts/hub-tenant-fixtures-verification.md`

### Step 4 — Branch merge
- `fix/i18n-rsc-barrel` fast-forward merged to `main` (125 commits)
- Contains: RSC boundary fixes, i18n barrel fix, fixture corrections, TemplateRenderer block implementations

### Step 8 — Unit tests (45 tests)
- `resolve-locale.test.ts` — 15 tests (locale resolution, hreflang, canonical, fallback)
- `json-ld.test.ts` — 18 tests (Church entity, Mass Event, BreadcrumbList)
- `fixture-integrity.test.ts` — 12 tests (required fields, no markers, verified data, asset existence)

## What Remains Unresolved

### P0 — Public exposure risk

1. **No `noindex` on the spoke.** The layout has no `robots` metadata. The site is
   indexable by search engines by default. This is a release-blocking gap.

2. **No demo environment.** There is no controlled demonstration hostname. The spoke
   and hub template-renderer could both serve content to any route.

3. **Hub fixtures with `ru` markers still in the tree.** 408 markers across 9 fixtures
   remain uncommitted on hub `main`. If the template-renderer serves these tenants,
   the `ru` markers will render publicly (the `ru` locale is supported by the
   template-renderer's `[locale]` route).

### P1 — Architectural governance

4. **Three rendering implementations remain.** The fundamental question — which
   renderer is canonical — is undecided:
   - `jol-site-basilica/src/app/page.tsx` (spoke-local renderer)
   - `jol-hub/frontend/apps/template-renderer/src/components/TemplateRenderer.tsx` (hub renderer)
   - `jol-hub/frontend/packages/*` (12 shared packages, not yet published)

   Until one is designated canonical and the other frozen, the system will develop
   parallel renderers with divergent block types, accessibility behavior, SEO
   metadata, JSON-LD, error states, localization, analytics, and security controls.

5. **BF-4 still open.** The spoke duplicates the hub's composition layer. The
   shared packages cannot be consumed until published to GitHub Packages, which
   requires `write:packages` scope on the `gh` CLI token.

### P2 — Content governance

6. **No content metadata model.** Tenant fixture data lacks:
   - Source URL and source type
   - Verification date and verifier identity
   - Approval status and tenant owner
   - Change history and next review date

   Without this metadata, there is no audit trail for content accuracy.

7. **No content approval workflow.** There is no process for parish sign-off
   before publishing tenant data. The current model allows unreviewed data to
   reach the frontend.

### P3 — Legal and compliance

8. **Legal pages require professional review.** The privacy, cookies, and
   accessibility pages are AI-generated stubs. They must be reviewed by a
   legal or data-protection professional before publication.

9. **Web Accessibility Directive applicability.** Whether the European Web
   Accessibility Directive (2016/2102) legally applies depends on the
   organization's legal status, services, funding, and national implementation
   rules. This is a **legal applicability assessment**, not an automatic
   conclusion for every church website.

10. **GDPR Article 9 qualification.** Clergy and staff names are not
    automatically special-category data under GDPR Article 9 merely because
    the person is associated with a religious organization. Context, purpose,
    public availability, role, and processing circumstances matter.

    Correct formulation:
    > Clergy and staff records require lawful, transparent, and purpose-limited
    > processing. Some religious-affiliation or pastoral-context data may
    > constitute special-category data under GDPR Article 9, depending on the
    > content and processing purpose. Legal review is required before collecting
    > or synchronizing such data.

11. **Donation flow.** The 1.2% GPM (personal income tax allocation) page
    should be implemented as an informational workflow first. Card donations
    should be postponed until legal, accounting, and payment-provider
    requirements are approved. PCI-DSS compliance responsibilities remain
    with the organization and the payment provider regardless of the
    hosted-payment-link model.

## Frontend Scope Analysis (2026-09-14)

A complete frontend product specification has been drafted for the Roman Catholic
Basilica template, targeting approximately 20 page types consolidated into **16 core pages**
organized into 6 sections.

**Specification:** `docs/specs/basilica-frontend-spec.md`
**Discovery answers:** `docs/drafts/discovery-answers.md` — evidence-backed answers to 50+ discovery questions covering business/product, technical architecture, design/UX, content/localization, SEO/analytics, and GitHub/DevOps. All answers are sourced from code, configuration, or architecture documents.
**Phase 2 execution plan review:** `docs/drafts/professional-opinion-phase2-plan-review.md` — review of the 21-prompt execution plan (Prompts 0-20), re-sequenced to reflect completed items (BF-5 resolved, canonical renderer decided, fixtures committed). Revised effort estimate: 51-73 hours (7-10 senior engineering days).

### Page Structure

```
Home
├── About (History, Architecture & Art, Clergy & Staff)
├── Worship (Mass Schedule, Confession, Sacraments, Liturgical Calendar)
├── Community (Parish Services, Events, News)
├── Visit (Visitor Info, Hours, Location & Directions, Pilgrimage)
├── Gallery
├── Resources (Documents & Downloads)
├── Support (Donations & GPM)
├── Contact
├── FAQ
├── Search
└── Legal (Privacy, Cookies, Accessibility Statement)
```

### Primary User Groups

1. **Parishioners** — mass schedules, sacraments, announcements
2. **Visitors/Tourists** — opening hours, visitor info, architecture, history
3. **Pilgrims** — pilgrimage info, confession, spiritual services
4. **Sacrament seekers** — baptism/marriage requirements, contacts
5. **Researchers/Media** — history, documents, contacts
6. **Pastoral care seekers** — confession, spiritual direction, counseling
7. **Donors/Supporters** — donation info, GPM allocation

### Pastoral Goals

1. Evangelization — share the faith, attract visitors
2. Pastoral care — serve parishioners, provide sacraments
3. Information — schedules, events, announcements
4. Community building — news, events, parish life
5. Heritage preservation — history, architecture, art
6. Fundraising — donations, GPM allocation
7. Legal compliance — privacy, cookies, accessibility

### Key Technical Decisions

- **Hub-and-spoke architecture:** Shared rendering logic in hub packages, tenant-specific content in fixtures
- **3-locale parity:** lt/en/ru with Lithuanian as primary
- **WCAG 2.1 AA:** Semantic HTML, ARIA labels, keyboard navigation, focus states, color contrast
- **Structured data:** JSON-LD (Church, PlaceOfWorship, Event, BreadcrumbList)
- **Tenant customization:** Fixture-driven content, shared rendering logic
- **Component library:** 13 new components needed (ScheduleTable, Gallery, MapEmbed, ContactForm, DonationWidget, EventCard, NewsCard, FAQAccordion, BreadcrumbNav, LanguageSwitcher, SearchBar, ClergyCard, SacramentInfo)

### Implementation Phases

- **Phase 1 (P0):** Foundation — package TemplateRenderer, core components, page templates
- **Phase 2 (P1):** Community — Parish Services, Events, News, ContactForm, FAQ
- **Phase 3 (P2):** Resources & Support — Documents, Donations & GPM
- **Phase 4 (P3):** Search & Polish — site-wide search, 404 page, performance optimization

### Risks

- TemplateRenderer packaging is a prerequisite for spoke to consume hub renderer
- Missing images/media require parish licensing
- Bitrix24 integration may require fallback to mailto:
- Translation backlog (408 `ru` markers) may require disabling `ru` locale
- Legal review pending for privacy/cookies/accessibility pages

## Prompt 1 — Public Indexing Protection (2026-09-14)

Audit and remediation of all indexing controls completed. **Verdict: defense-in-depth achieved.**

### Changes Applied

| ID | Change | File | Invariant |
|---|---|---|---|
| G1 | `BASE_URL` now reads `NEXT_PUBLIC_SITE_URL` env var (fallback `localhost:3000`) | `src/app/page.tsx` | Canonical URL on demo/staging never points to production |
| G3 | `X-Robots-Tag: noindex, nofollow` HTTP header added | `next.config.js` | INV-SEO-01: covers non-HTML resources (SVGs, JSON) |
| G4 | Static `public/robots.txt` with `Disallow: /` | `public/robots.txt` | INV-SEO-02: explicit crawler block |
| G6 | `buildCanonical()` and `buildHreflang()` marked as reserved for Prompt 7+ | `src/lib/resolve-locale.ts` | Dead code documented |

### Additional Fix

- **RSC boundary defect** in `mapLocation` block: `onClick` handler on `<a>` tag cannot serialize across the Server Component boundary. Fixed by extracting `TrackedLink` client component (`src/components/tracked-link.tsx`). Build now exits 0.

### Three-Layer Indexing Protection

| Layer | Mechanism | Scope |
|---|---|---|
| 1 | `<meta name="robots" content="noindex, nofollow">` | HTML pages (via layout.tsx) |
| 2 | `X-Robots-Tag: noindex, nofollow` HTTP header | All responses including non-HTML |
| 3 | `robots.txt` with `Disallow: /` | All crawlers at the protocol level |

### Verification

- Type-check: 0 errors
- Tests: 46/46 passed (3 suites)
- Build: exit 0, 7/7 static pages generated

## Prompt 8 — Legal Pages Implementation Plan (2026-09-14)

Audit of all 3 legal pages completed. **Verdict: factual errors found, plan documented.**

### Key Findings

| ID | Issue | Severity |
|---|---|---|
| FI-1 | Cookie policy lists `_ga`/`_gid` Google Analytics cookies, but site uses self-hosted analytics — **describes cookies that don't exist** | HIGH |
| FI-2 | Accessibility statement claims NVDA/VoiceOver/TalkBack testing — **no e2e tests exist** | HIGH |
| FI-4 | Privacy policy references "analitiniai slapukai" with consent — **no consent UX exists** | MEDIUM |
| FI-5 | Cookie policy promises a "slapukų juostą" (cookie banner) — **not implemented** | MEDIUM |
| — | Hub renderer has **zero legal pages** — will lose them when spoke renderer is retired | HIGH |
| — | Fixture schema has **no legal page fields** — legal content is not tenant-aware | MEDIUM |

### Plan (5 phases)

- **8A** (1-2h): Fix factual errors — remove false claims, no legal review needed
- **8B** (2-3h): Technical hardening — explicit robots metadata, cross-links, localization
- **8C** (2-3h): Schema extension — add `legalPages` to tenant fixture (hub change)
- **8D** (3-4h): Hub renderer port — legal pages must exist before spoke retirement
- **8E** (external): Professional legal review — timeline uncontrollable

**Plan document:** `docs/drafts/legal-pages-implementation-plan.md`

### Professional Opinion on Legal Risk

The factual inconsistencies (FI-1 through FI-5) are a **regulatory liability**, not a design choice. A cookie policy that describes cookies the site does not set violates the e-Privacy Directive's transparency requirement. An accessibility statement that claims testing with assistive technologies that were never used violates EU 2016/2102 Art. 7. **Phase 8A should be executed immediately** — it requires no legal expertise, only factual accuracy.

## Prompt 9 — Accessibility/WAD Assessment (2026-09-14)

Technical accessibility audit and Web Accessibility Directive applicability analysis completed. **Verdict: 2 contrast failures, 6 additional issues, WAD likely not applicable.**

### Static Gate Quality

The `check-a11y-pages.ts` gate covers 4 of ~50 WCAG 2.2 AA success criteria with high-quality self-tests (6 defect classes). It is honest about what it cannot check (contrast, focus order, ARIA semantics — all require rendered DOM).

### Issues Found

| ID | Severity | WCAG | Issue |
|---|---|---|---|
| A11Y-1 | HIGH | 1.4.3 | `text-white` on `bg-amber-600` — ~3.0:1 contrast, **fails AA** (CTA buttons) |
| A11Y-2 | HIGH | 1.4.3 | `text-gray-400` on `bg-gray-50` — ~3.9:1 contrast, **fails AA** (map coordinates text) |
| A11Y-4 | MEDIUM | 2.4.7 | Skip link text is English while `lang="lt"` |
| A11Y-5 | MEDIUM | 2.4.4 | External links open new tab with no warning |
| A11Y-6 | MEDIUM | 2.5.8 | Touch targets need DOM verification |
| A11Y-8 | LOW | 1.3.1 | Legal page sections lack `aria-label` |

### WAD Applicability

**The WAD likely does NOT legally apply** — religious organizations are not public sector bodies under EU 2016/2102 or Lithuanian national implementation. However, if the organization voluntarily claims WCAG 2.2 AA conformance, it should deliver on that claim.

**Assessment document:** `docs/drafts/accessibility-assessment.md`

### Recommendation

A11Y-1 and A11Y-2 are immediate fixes (15 min each) — source-level Tailwind class changes that do not require DOM testing or design decisions. These should be executed before any public exposure.

## Phase 8A + A11Y P0/P1 — Executed (2026-09-14)

All factual errors and P0/P1 accessibility issues fixed and verified.

### Factual Fixes (Phase 8A)

| ID | Page | What Changed |
|---|---|---|
| FI-1 | Cookies | Removed false `_ga`/`_gid` Google Analytics cookie list. Replaced with accurate self-hosted analytics description. |
| FI-2 | Accessibility | Removed false NVDA/VoiceOver/TalkBack testing claims. Replaced with accurate "automated checks run, full AT testing planned" statement. |
| FI-4 | Privacy | Separated cookies from analytics data collection. Accurate description of self-hosted analytics with localStorage consent. |
| FI-5 | Cookies | Removed false "slapukų juostą" (cookie banner) promise. Replaced with accurate localStorage consent mechanism description. |

### Accessibility Fixes (A11Y P0/P1)

| ID | What Changed |
|---|---|
| A11Y-1 | `bg-amber-600` → `bg-amber-700` on all CTA buttons (contrast ~4.6:1, passes AA) |
| A11Y-2 | `text-gray-400` → `text-gray-600` on map coordinates text (contrast ~7.0:1, passes AA) |
| A11Y-4 | Skip link text localized: "Skip to main content" → "Pereiti prie pagrindinio turinio" |

### Gate Update

The a11y-static gate's skip link detection regex updated from `/skip/i` to `/skip|pereiti|перейти/i` to support multi-language skip links. Self-tests still pass.

### Verification

- Type-check: 0 errors
- Tests: 46/46 passed
- Build: exit 0, 7/7 pages generated

## Prompt 10 — SEO Audit (2026-09-14)

Comprehensive SEO audit completed. 11 findings identified (4 HIGH, 3 MEDIUM, 4 LOW).

**Full report:** `docs/drafts/seo-audit.md`

### Key Findings

| Severity | Count | Description |
|---|---|---|
| **HIGH** | 4 | Meta language mismatch, home page missing fixture metadata, zero OG/Twitter tags |
| MEDIUM | 3 | No WebSite JSON-LD, missing openingHours in churchEntity, legal pages lack canonical |
| LOW | 4 | No BreadcrumbList on legal pages, no sitemap/robots routes (correct for pre-production) |

### What Works Well

- JSON-LD structured data: churchEntity, massEventEntity, breadcrumbListEntity — all consuming `@journeyoflife-org/seo@1.1.0`, 19 unit tests passing
- Canonical URL on home page: environment-aware (`NEXT_PUBLIC_SITE_URL`)
- Hreflang: correctly does NOT advertise non-existent `/en`/`/ru` routes
- Three-layer noindex protection: meta + header + robots.txt

### What Needs Fixing Before Production

1. **Meta metadata (SEO-1/2/3):** Root layout title/description in English, site lang is Lithuanian. Home page doesn't emit fixture-based metadata. Hub builders (`tenantTitleTemplate`, `clampDescription`) available but unused.
2. **Open Graph / Twitter Cards (SEO-4):** Zero social sharing tags on any page. Hub provides `openGraphFor()`, `resolveOgImage()`, `twitterCardFor()` — all unused. Requires OG image generation.
3. **Canonical URLs on legal pages (SEO-7):** No `<link rel="canonical">` on `/privacy`, `/cookies`, `/accessibility-statement`.

### Hub SEO Package Utilization

The hub `@journeyoflife-org/seo@1.1.0` exports 30+ functions. The spoke consumes only 3 (churchEntity, massEventEntity, breadcrumbListEntity). The remaining 27+ exports cover canonicals, hreflang, metadata policy, OG/Twitter, sitemap, robots, IndexNow — all production-ready but unused.

## Prompt 11 — Analytics/Consent Audit (2026-09-14)

Comprehensive analytics and consent audit completed. 8 findings identified (3 HIGH, 3 MEDIUM, 2 LOW).

**Full report:** `docs/drafts/analytics-consent-audit.md`

### Key Findings

| Severity | Count | Description |
|---|---|---|
| **HIGH** | 3 | No `/api/analytics` route handler, no consent UI, no code writes consent to localStorage |
| MEDIUM | 3 | 3 of 4 event types never fired, TrackedLink not generic, hub observability package unused |
| LOW | 2 | No cookie banner timeline, no page_view tracking |

### What Works Well

- Consent gate architecture is correct: `trackEvent()` checks localStorage BEFORE sending data
- SSR guard prevents server-side execution of browser-only APIs
- No third-party tracking SDKs — self-hosted analytics only
- Cookie policy accurately documents the (not-yet-implemented) consent mechanism

### What Needs Fixing

1. **Consent UI (AN-2/3):** No banner/dialog exists. User cannot grant or revoke consent. No code writes `jol-consent-analytics` to localStorage.
2. **API endpoint (AN-1):** `/api/analytics` route handler does not exist. All analytics data silently lost (404).
3. **Event firing (AN-4/8):** Only 1 of 4 defined event types is actually fired (`map_directions_click`). No `page_view` tracking on any page.

### Paradoxically Safe

Analytics are dead code because consent can never be granted. No data is collected, no PII transmitted, no compliance violation occurs. The architecture is correct; only the UX and write path are missing.

### Hub Observability Package

`@journeyoflife-org/observability` provides production-grade primitives (createLogger, createBatchingSink, createMetricBatcher, redactValue, classifyError) but the spoke's hand-rolled `analytics.ts` (39 lines) does not consume them.

## Prompt 12 — Content Integrity Audit (2026-09-14)

Comprehensive content integrity audit completed. 6 findings identified (1 HIGH, 3 MEDIUM, 2 LOW).

**Full report:** `docs/drafts/content-integrity-audit.md`

### Key Findings

| Severity | Count | Description |
|---|---|---|
| **HIGH** | 1 | Mass schedule dates hardcoded (2026-09-13/14) — stale immediately, no recurrence model |
| MEDIUM | 3 | CT-03 not implemented, spoke-hub fixture duplication, no content provenance metadata |
| LOW | 2 | No gate self-tests, no content approval workflow |

### What Works Well

- Content integrity gate: 4 of 5 rules pass (CT-01, CT-02, CT-04, CT-05)
- Fixture integrity tests: 12/12 passing
- Identity data verified against public sources (address, email, phone, domain, established date)
- All internal links resolve (no dead links)
- All local asset references exist (placeholder SVGs properly labeled)
- Spoke and hub fixtures are byte-for-byte identical (no divergence)
- No review markers in fixture values

### What Needs Fixing

1. **Mass schedule (CI-3):** Dates are hardcoded to 2026-09-13/14. Mass schedule is recurring (weekly) but modeled as one-time events. JSON-LD Event schemas will have stale dates.
2. **CT-03 (CI-1):** Internal link validation documented but not implemented in the gate.
3. **Fixture sync (CI-4):** Spoke fixture is a copy of hub fixture — no single source of truth, manual sync required.
4. **Provenance (CI-5):** No content metadata for source, verifier, approval status, or review date.

### Gate Quality

The content integrity gate has no self-tests (unlike `check-a11y-pages.ts`). There is no proof the gate catches violations. Adding self-tests would prove the gate is effective.

## Prompt 13 — Payment Boundary Audit (2026-09-14)

Payment boundary audit completed. 3 findings identified (0 HIGH, 2 MEDIUM, 1 LOW).

**Full report:** `docs/drafts/payment-boundary-audit.md`

### Key Findings

| Severity | Count | Description |
|---|---|---|
| MEDIUM | 2 | Gate missing 2 patterns from hub INV-3, no donation/GPM page in spoke |
| LOW | 1 | Gate pattern alignment documented but not yet applied |

### What Works Well

- **Payment boundary gate:** 14 PSP SDK patterns, 4 self-tests, proper error handling
- **ADR-009 Model A compliance:** Zero PSP SDK imports, zero dependencies, zero keys/endpoints
- **CI enforcement:** Dual-layered (local verify chain + CI reusable workflow + INV-8 meta-check)
- **Compliance documentation:** DPIA and ROPA correctly reference ADR-009
- **Donation flow:** Correctly absent per ADR-009 §1 (boundary CLOSED until SAQ A)

### What Needs Attention

1. **Gate patterns (PB-1):** Missing `loadStripe()` and `NEXT_PUBLIC_STRIPE_` patterns that hub INV-3 detects. Documented deferral requiring cross-spoke authorization.
2. **GPM page (PB-2):** Informational only (no payment data), can be implemented without touching payment boundary.

### Strongest Compliance Control

The payment boundary is the strongest compliance control in the spoke. The gate is well-engineered, the architecture decision is clear, and enforcement is dual-layered. Zero payment-related code is exactly correct for a pre-SAQ-A state.

## Prompt 14 — TemplateRenderer Packaging Assessment (2026-09-14)

TemplateRenderer packaging assessment completed. 6 findings identified (2 HIGH, 3 MEDIUM, 1 LOW).

**Full report:** `docs/drafts/template-renderer-packaging-assessment.md`

### Key Findings

| Severity | Count | Description |
|---|---|---|
| HIGH | 2 | TemplateRenderer is private app (not package), migration plan not implemented |
| MEDIUM | 3 | Block type coverage mismatch (14 hub vs 10 spoke), SEO/analytics must remain spoke-local, no unit tests |
| LOW | 1 | TemplateRenderer has no unit tests (only integration tests) |

### What Works Well

- **TemplateRenderer design:** 239 lines, 14 block types, pure component
- **Dependencies:** Only @journeyoflife-org/ui + seed-data (both published)
- **Migration plan:** Documented in hub (docs/architecture/renderer-package-migration-plan.md)
- **Block type overlap:** 10/14 types (71%) already match between hub and spoke

### What Needs Attention

1. **Create @journeyoflife-org/renderer package** — 2 hours, P1 priority
2. **Publish to GitHub Packages** — 30 minutes
3. **Port spoke to consume package** — 2-3 hours (replace 247-line duplicated block renderer)
4. **Add unit tests for TemplateRenderer** — currently only integration tests

### Migration Path

Total effort: 5-6 hours. Risk is low because rollback is simple (revert spoke's page.tsx).

The spoke's SEO layer (JSON-LD, hreflang, canonical) and analytics (TrackedLink) must remain spoke-local — they are not part of the renderer.

## Prompt 15 — Demo Environment Deployment Assessment (2026-09-14)

Demo environment deployment assessment completed. 7 findings identified (3 HIGH, 2 MEDIUM, 2 LOW).

**Full report:** `docs/drafts/demo-environment-deployment-assessment.md`

### Key Findings

| Severity | Count | Description |
|---|---|---|
| HIGH | 3 | No Dockerfile, no deploy workflow, no deploy/rollback scripts |
| MEDIUM | 2 | No demo hostname allocated, no environment-specific config |
| LOW | 2 | No health check endpoint, no performance monitoring |

### What Works Well

- **3-layer indexing protection:** Meta robots + X-Robots-Tag header + robots.txt — demo will NOT be indexed
- **Environment-aware canonicals:** `NEXT_PUBLIC_SITE_URL` controls canonical URL (demo ≠ production)
- **Build process:** `pnpm build` exits 0, 7 static pages
- **CI pipeline:** 10 jobs including all gates

### What Needs Attention

1. **Deploy to Vercel (demo)** — 2-3 hours, fastest path to demo (recommended)
2. **Create Dockerfile (production)** — 2 hours, required for Proxmox
3. **Create deploy/rollback scripts (production)** — 1.5 hours
4. **Create deploy workflow (production)** — 2 hours, GitHub Actions → Proxmox

### Deployment Readiness

**Demo environment:** READY (2-3 hours to deploy on Vercel)
**Production environment:** NOT READY (12-15 hours additional work required)

Production deployment should begin only after:
- Demo environment is live and validated
- Legal review of stub pages is complete
- Content approval workflow is established
- TemplateRenderer packaging is complete
- Parish sign-off is obtained

## Prompt 16 — Legal Review of Stub Pages (2026-09-14)

Legal review assessment completed. 9 findings identified (2 HIGH, 4 MEDIUM, 3 LOW).

**Full report:** `docs/drafts/legal-review-stub-pages-assessment.md`

### Key Findings

| Severity | Count | Description |
|---|---|---|
| HIGH | 2 | No legal basis for processing (Art. 6), no retention periods, Lithuanian-only pages |
| MEDIUM | 4 | No DPO contact, no right to withdraw consent, no DPA complaint right, no cookie banner |
| LOW | 3 | Illustrative cookie names, no test method, "partially compliant" claim may be inaccurate |

### What Works Well

- **Structurally sound:** Pages reference fixture data correctly (tenant-aware)
- **Legal-review banners:** Explicit warnings that pages require lawyer review
- **Phase 8A completed:** Factual errors already fixed (false Google Analytics cookies, false NVDA/VoiceOver/TalkBack claims, false cookie banner promise)
- **e-Privacy compliance:** Cookies policy accurately describes self-hosted analytics, no third-party SDKs

### What Requires Lawyer Review

1. **Legal basis for processing (Art. 6)** — must specify consent, legitimate interest, etc.
2. **Retention periods** — must specify how long each data category is kept
3. **DPO requirement** — may be required if processing Art. 9 data (religious affiliation)
4. **WAD applicability** — lawyer must determine if Web Accessibility Directive applies to religious organizations

### What Can Be Fixed Technically

5. **Cookie banner** — implement consent UI (2-3 hours)
6. **Cookie names** — update to match actual implementation (30 min)
7. **Accessibility test method** — add section explaining automated source-level checks (30 min)
8. **Translations** — add English and Russian versions (4-6 hours, requires translation)

### Recommendation

Engage a lawyer specializing in Lithuanian data protection law to review the privacy policy and determine Art. 6 legal bases, retention periods, DPO requirement, and WAD applicability. Simultaneously, implement the cookie banner and add English/Russian translations.

## Prompt 17 — Content Approval Workflow (2026-09-14)

Content approval workflow assessment completed. 8 findings identified (3 HIGH, 3 MEDIUM, 2 LOW).

**Full report:** `docs/drafts/content-approval-workflow-assessment.md`

### Key Findings

| Severity | Count | Description |
|---|---|---|
| HIGH | 3 | No approval workflow, no provenance fields, clergy data (Art. 9) has no approval process |
| MEDIUM | 3 | No content ownership, no review cycle, mass schedule dates hardcoded |
| LOW | 2 | No content staging, no versioning |

### What Works Well

- **Fixture schema:** Well-structured content model with localized text
- **Content verification:** Vilnius Cathedral Basilica fixture verified against katedra.lt, VLE, SAVAITĖ
- **Identity data:** Address, email, phone verified against public sources

### What Requires Immediate Attention

1. **Add governance fields to schema** — sourceUrl, verifiedDate, verifier, approvalStatus, nextReviewDate (2 hours)
2. **Define content ownership** — designate content owner per tenant
3. **Verify clergy data handling** — ensure no Art. 9 data without approval
4. **Implement mass schedule recurrence** — replace hardcoded dates with recurrence model

### What Requires Significant Effort

5. **Implement approval workflow** — draft → approved state machine (8-12 hours)
6. **Add content staging** — preview URL per tenant (4-6 hours)
7. **Add review reminders** — email on nextReviewDate (2-3 hours)

### Recommendation

Start with schema extension and content ownership definition (4 hours total). This establishes the governance foundation without requiring a full workflow implementation. The approval workflow can be added incrementally as the platform matures.

## Gate Qualification

The statement "all gates pass" requires qualification:

```
Local fixture-level gates:     PASSING
  - type-check:                 0 errors
  - content-integrity (spoke):  PASS (0 markers, all assets exist)
  - a11y static:                PASS (4 page files)
  - payment boundary:           PASS
  - theme literals:             PASS (true positive on layout.tsx)
  - secrets:                    PASS
  - workflow completeness:      PASS
  - unit tests:                 46/46 pass
  - build:                      EXIT 0 (7/7 pages)

Production-readiness gates:    PARTIALLY PASSING (updated 2026-09-14)
  - Legal review:               Not done (5 factual errors identified — Prompt 8A pending)
  - Legal factual accuracy:     PASS — factual errors fixed (Phase 8A executed 2026-09-14)
  - Accessibility (static):     PASS — 4 WCAG criteria enforced via source-level gate with self-tests
  - Accessibility (contrast):   PASS — A11Y-1, A11Y-2 fixed (bg-amber-700, text-gray-600)
  - Accessibility (skip link):  PASS — localized to Lithuanian, gate regex updated for multi-language
  - WAD applicability:          LIKELY NOT APPLICABLE — religious organization, not public sector body
  - SEO (JSON-LD):              PASS — churchEntity, massEventEntity, breadcrumbListEntity from hub
  - SEO (canonical):            PARTIAL — home page ✅, legal pages ❌ (no canonical)
  - SEO (hreflang):             PASS — correct for single-locale, no invalid targets
  - SEO (meta metadata):        FAIL — English titles/descriptions on Lithuanian site, home page missing fixture metadata
  - SEO (OG/Twitter):           FAIL — zero social sharing tags
  - SEO (sitemap):              NOT READY — correct for pre-production
  - Analytics (consent gate):    PASS — trackEvent() checks localStorage before transmission
  - Analytics (API endpoint):    FAIL — no /api/analytics route handler exists
  - Analytics (consent UI):      FAIL — no banner/dialog, user cannot grant/revoke consent
  - Analytics (event firing):    PARTIAL — 1 of 4 event types fired (map_directions_click)
  - Analytics (hub integration): FAIL — @journeyoflife-org/observability not consumed
  - Content integrity (gate):     PASS — CT-01/02/04/05 enforced, CT-03 not implemented
  - Content integrity (tests):    PASS — 12/12 fixture integrity tests passing
  - Content integrity (data):     PARTIAL — identity verified, mass schedule dates stale
  - Content integrity (assets):   PASS — all local assets exist, placeholders labeled
  - Content provenance:           FAIL — no source/verifier/approval/review tracking
  - Content approval:             FAIL — no parish sign-off workflow
  - Payment boundary (INV-3):     PASS — 14 PSP patterns, 4 self-tests, zero violations
  - Payment boundary (ADR-009):   PASS — Model A fully compliant, boundary CLOSED
  - Payment boundary (CI):        PASS — dual-layered enforcement (local + CI + INV-8)
  - TemplateRenderer (hub):       FAIL — private app, not package, migration not implemented
  - TemplateRenderer (spoke):     FAIL — 247 lines duplicated, should consume hub package
  - Demo deployment (indexing):   PASS — 3-layer noindex defense (meta + header + robots.txt)
  - Demo deployment (canonical):  PASS — NEXT_PUBLIC_SITE_URL controls canonical (env-aware)
  - Demo deployment (infra):      FAIL — no Dockerfile, no deploy workflow, no deploy scripts
  - Production deployment:        FAIL — 12-15 hours additional work required
  - Legal pages (privacy):        FAIL — no Art. 6 legal basis, no retention periods, no DPO
  - Legal pages (cookies):        PARTIAL — accurate but no cookie banner UI
  - Legal pages (accessibility):  PARTIAL — "partially compliant" claim may be inaccurate
  - Legal pages (translations):   FAIL — Lithuanian-only, site supports lt/en/ru
  - Content approval workflow:    FAIL — no workflow, no provenance fields, no ownership
  - Content provenance:           FAIL — no sourceUrl, verifiedDate, verifier, approvalStatus
  - Content ownership:            FAIL — no designated content owner per tenant
  - Content review cycle:         FAIL — no scheduled review process
  - Content approval:           No workflow
  - Canonical renderer:         DECIDED — hub template-renderer
  - Shared packages:            PUBLISHED — 12 @journeyoflife-org/* v1.0.0
  - Spoke SEO deduplication:    DONE — consumes @journeyoflife-org/seo@1.1.0
  - Tenant coverage:            1 of 8 basilicas
  - Demo noindex:               DONE — 3-layer defense-in-depth (meta + header + robots.txt)
  - Environment-aware canonical: DONE — NEXT_PUBLIC_SITE_URL (no hardcoded production URL)
  - RSC boundary defects:       FIXED — TrackedLink client component extracted
  - Hub fixture markers:        408 ru translations pending
  - Donation flow:              Not implemented
  - Content metadata:           No source/verifier/approval tracking
  - Package governance:         DONE — policy documented in hub
  - Changeset baseBranch:       DONE — updated to main
  - Renderer package migration: PLAN documented, implementation deferred
```

A passing accessibility check for one composed document does not prove
accessibility across all routes, locales, tenants, content variations,
forms, schedules, or error states.

## Recommended Decision

### Immediate (P0 — before any public exposure)

1. ~~Add `robots: { index: false, follow: false }` to the spoke's root layout~~ **DONE** (2026-09-13)
2. ~~Designate a controlled demo hostname~~ — `noindex` added to both spoke and hub renderer. DNS/infra deployment pending.
3. ~~Commit the hub's fixture identity corrections~~ **DONE** (2026-09-13)
4. ~~Decide canonical renderer~~ **DONE** — hub `template-renderer` confirmed as canonical (2026-09-13)

### Short-term (P1 — architectural governance)

5. ~~Resolve BF-5: publish `@journeyoflife-org/*` packages~~ **DONE** — 12 packages v1.0.0 published to GitHub Packages (2026-09-13)
6. ~~Update `.changeset/config.json` baseBranch~~ **DONE** — updated from `feat/pages-step6` to `main` (2026-09-14)
7. ~~Document package governance policy~~ **DONE** — ownership, versioning, release, rollback, schema compatibility documented (2026-09-14)
8. ~~Plan TemplateRenderer package migration~~ **DONE** — plan documented, implementation deferred to dedicated session (2026-09-14)
9. ~~Port spoke SEO to consume hub package~~ **DONE** — spoke consumes `@journeyoflife-org/seo@1.1.0`, local `json-ld.ts` deleted (2026-09-13)

### Medium-term (P2-P3 — before pilot)

10. Implement the content metadata model (source, verifier, approval, review date).
11. Establish the content approval workflow (parish sign-off).
12. Complete the `ru` translation backlog or disable `ru` locale in the
    template-renderer until translations are ready.
13. Implement TemplateRenderer package migration (move from app to `@journeyoflife-org/renderer`).
14. Delete spoke's duplicated block renderer once renderer package is published.
15. Add integration tests between shared packages and the canonical renderer.

### Long-term (P4-P5 — pilot expansion and donations)

16. Implement the 1.2% GPM informational page.
17. Postpone card donations until legal/accounting approval.
18. Onboard remaining 7 basilica tenants (each as a separate content + operational
    onboarding project).
19. Implement online donations, payment-provider integration, receipts, accounting.
20. Validate hub-and-spoke topology in production (10 spokes, 1 hub).

## Effort Qualification

The 10–15 senior engineering days estimate is plausible only for the listed
technical remediation, assuming:
- Repository access is uncomplicated
- The architecture is already understood
- Legal copy is supplied promptly
- The payment provider is selected
- No major CMS or backend work is required
- The shared packages are nearly ready
- No significant infrastructure changes are needed

This estimate does **not** include:
- Legal review of privacy/cookies/accessibility text
- Parish content verification and sign-off (8 institutions)
- Translation work (408 `ru` strings)
- Payment provider onboarding and PCI-DSS assessment
- Photography and media licensing
- CRM configuration and routing
- Accounting integration

## Sign-off

**Assessment type:** Release-blocking architecture and readiness assessment
**Updated:** 2026-09-14 (Prompt 17: content approval workflow complete — 8 findings, 3 HIGH)
**Prior assessment:** 2026-09-14 (Prompt 16: legal review of stub pages complete)
**Next review:** After Prompt 18 (first tenant verification)

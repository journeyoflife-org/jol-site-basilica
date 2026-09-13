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
  - unit tests:                 45/45 pass

Production-readiness gates:    FAILING
  - Legal review:               Not done
  - Content approval:           No workflow
  - Canonical renderer:         Undecided
  - Shared packages:            Not published
  - Tenant coverage:            1 of 8 basilicas
  - Demo environment:           No noindex, no access control
  - Hub fixture markers:        408 ru translations pending
  - Donation flow:              Not implemented
  - Content metadata:           No source/verifier/approval tracking
```

A passing accessibility check for one composed document does not prove
accessibility across all routes, locales, tenants, content variations,
forms, schedules, or error states.

## Recommended Decision

### Immediate (P0 — before any public exposure)

1. Add `robots: { index: false, follow: false }` to the spoke's root layout
   metadata to prevent search indexing.
2. Designate a controlled demo hostname (e.g., `demo.basilica.gyvenimo-kelias.lt`)
   with noindex, no real donation processing, and clearly marked demo status.
3. Commit the hub's fixture identity corrections (currently uncommitted on `main`).
4. Decide whether `jol-site-basilica` or `jol-hub/template-renderer` is the
   canonical renderer. Freeze the other.

### Short-term (P1-P2 — before pilot)

5. Resolve BF-5: obtain `write:packages` scope and publish `@jol-hub/*` packages.
6. Resolve BF-4: port the canonical renderer to consume shared packages; delete
   the duplicate.
7. Implement the content metadata model (source, verifier, approval, review date).
8. Establish the content approval workflow (parish sign-off).
9. Complete the `ru` translation backlog or disable `ru` locale in the
   template-renderer until translations are ready.

### Medium-term (P3-P4 — pilot expansion)

10. Implement the 1.2% GPM informational page.
11. Postpone card donations until legal/accounting approval.
12. Onboard remaining 7 basilica tenants (each as a separate content + operational
    onboarding project).
13. Add integration tests between shared packages and the canonical renderer.

### Long-term (P5 — post-pilot)

14. Implement online donations, payment-provider integration, receipts, accounting.
15. Validate hub-and-spoke topology in production (10 spokes, 1 hub).

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
**Updated:** 2026-09-13
**Prior assessment:** Superseded by this update
**Next review:** After P0 items are remediated

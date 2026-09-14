# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `docs/drafts/readiness-review.md` — comprehensive readiness review (Prompt 19).
  Synthesis of 62 findings across 11 audits (Prompts 8-18): 14 HIGH, 22 MEDIUM,
  26 LOW. Demo READY (3-4 hours on Vercel). Production NOT READY (49-73 hours).
  Critical blockers: legal review (GDPR Art. 6, retention, DPO), TemplateRenderer
  packaging, content approval workflow, mass schedule recurrence. Full report:
  docs/drafts/readiness-review.md.
- `docs/drafts/first-tenant-verification.md` — first tenant verification (Prompt 18).
  5 findings (1 HIGH, 2 MEDIUM, 2 LOW). Vilnius Cathedral Basilica verified:
  build exits 0, 46/46 tests pass, all 10 content blocks render correctly,
  identity data verified against katedra.lt/VLE/SAVAITĖ, zero TODO markers.
  Mass schedule dates hardcoded (HIGH), gallery uses placeholder SVGs.
  Full report: docs/drafts/first-tenant-verification.md.
- `docs/drafts/content-approval-workflow-assessment.md` — content approval workflow
  assessment (Prompt 17). 8 findings (3 HIGH, 3 MEDIUM, 2 LOW). No approval workflow,
  no provenance fields (sourceUrl, verifiedDate, verifier, approvalStatus), no content
  ownership. Clergy data (Art. 9) has no approval process. Schema extension proposed
  (2 hours). Full workflow requires 8-12 hours. Full report:
  docs/drafts/content-approval-workflow-assessment.md.
- `docs/drafts/legal-review-stub-pages-assessment.md` — legal review of stub pages
  assessment (Prompt 16). 9 findings (2 HIGH, 4 MEDIUM, 3 LOW). Privacy policy missing
  Art. 6 legal basis, retention periods, DPO contact. All pages Lithuanian-only
  (site supports lt/en/ru). Cookie banner not yet implemented. Requires lawyer review
  for Art. 6, retention, DPO, WAD applicability. Full report:
  docs/drafts/legal-review-stub-pages-assessment.md.
- `docs/drafts/demo-environment-deployment-assessment.md` — demo environment deployment
  assessment (Prompt 15). 7 findings (3 HIGH, 2 MEDIUM, 2 LOW). No Dockerfile, no
  deploy workflow, no deploy/rollback scripts. 3-layer indexing protection complete
  (meta + header + robots.txt). Vercel recommended for demo (2-3 hours). Production
  requires 12-15 hours additional work. Full report:
  docs/drafts/demo-environment-deployment-assessment.md.
- `docs/drafts/template-renderer-packaging-assessment.md` — TemplateRenderer packaging
  assessment (Prompt 14). 6 findings (2 HIGH, 3 MEDIUM, 1 LOW). Hub TemplateRenderer
  is private app (not package), migration plan documented but not implemented.
  Spoke has 247 lines duplicated block renderer that should consume hub package.
  Migration path: create @journeyoflife-org/renderer (5-6 hours total). Full report:
  docs/drafts/template-renderer-packaging-assessment.md.
- `docs/drafts/payment-boundary-audit.md` — payment boundary audit (Prompt 13).
  3 findings (0 HIGH, 2 MEDIUM, 1 LOW). Gate detects 14 PSP SDK patterns with
  4 self-tests. ADR-009 Model A fully compliant — zero PSP code in spoke.
  Missing 2 patterns from hub INV-3 (`loadStripe(`, `NEXT_PUBLIC_STRIPE_`).
  Donation flow correctly absent per ADR-009 §1 (boundary CLOSED until SAQ A).
  Full report: docs/drafts/payment-boundary-audit.md.
- `docs/drafts/accessibility-assessment.md` — WCAG 2.2 AA technical audit +
  WAD applicability analysis (Prompt 9). Static gate covers 4 of ~50 WCAG
  criteria. Identifies 2 contrast failures (A11Y-1: `bg-amber-600 text-white`
  ~3.0:1, A11Y-2: `text-gray-400` on `bg-gray-50` ~3.9:1), 4 additional
  medium-severity issues (English skip link in Lithuanian page, no new-tab
  warning, touch targets unverified, legal sections unlabeled). WAD likely
  not applicable to religious organization. Recommends e2e testing stack:
  Playwright + axe-core, manual keyboard navigation, screen reader testing.
- `docs/drafts/legal-pages-implementation-plan.md` — legal pages audit and
  5-phase implementation plan (Prompt 8). Identifies 5 factual inconsistencies:
  cookie policy describes non-existent Google Analytics cookies (FI-1),
  accessibility statement claims unperformed assistive-technology testing (FI-2),
  privacy/cookies pages reference consent UX that does not exist (FI-4, FI-5).
  Separates technical concerns (engineering) from legal content (professional
  review required). Proposes fixture schema extension for tenant-aware legal
  pages and hub renderer port plan.
- `public/robots.txt` — static `Disallow: /` for all crawlers (INV-SEO-02).
  Defense-in-depth layer alongside layout.tsx meta tag and X-Robots-Tag header.
  Replace with `app/robots.ts` dynamic route when ready for production indexing.
- `src/components/tracked-link.tsx` — Client Component wrapper for analytics-
  tracked links. Extracted to resolve RSC boundary defect where `onClick`
  handler on `<a>` tag could not serialize across the Server Component boundary.
- `docs/drafts/professional-opinion-phase2-plan-review.md` — review of the 21-prompt
  execution plan (Prompts 0-20). Re-sequenced to reflect completed items:
  BF-5 resolved (12 packages published), canonical renderer decided (hub
  template-renderer), fixture corrections committed, spoke SEO deduplicated.
  Converted design tasks to retrospective audits where appropriate.
  Revised effort estimate: 51-73 hours (7-10 senior engineering days).
  Identifies critical path: noindex validation → demo environment →
  TemplateRenderer packaging → first tenant verification → production readiness.
- `docs/drafts/discovery-answers.md` — evidence-backed answers to 50+ discovery
  questions for the basilica frontend specification. Covers 6 categories:
  business/product, technical architecture, design/UX, content/localization,
  SEO/analytics, GitHub/DevOps. All answers sourced from code, configuration,
  or architecture documents.
- `docs/specs/basilica-frontend-spec.md` — complete frontend product specification
  for the Roman Catholic Basilica template. Consolidates 20 proposed page types
  into 16 core pages organized into 6 sections (Home, About, Worship, Community,
  Visit, Resources, Support, Contact, Legal). Covers: user groups, pastoral goals,
  information architecture, content model, navigation structure, reusable page
  templates, required components (13 new), integrations, SEO requirements
  (structured data, hreflang, canonical), accessibility requirements (WCAG 2.1 AA),
  tenant customization model, and 4-phase implementation plan.
- `vitest.config.ts` and 3 unit test suites (45 tests):
  - `src/__tests__/resolve-locale.test.ts` — 15 tests for locale resolution,
    hreflang generation, canonical URL building, fallback behaviour.
  - `src/__tests__/json-ld.test.ts` — 18 tests for Church entity, Mass Event,
    and BreadcrumbList JSON-LD builders.
  - `src/__tests__/fixture-integrity.test.ts` — 12 tests for fixture validity:
    required fields, no `[TODO: verify]` markers, verified identity data,
    mass schedule count, gallery asset existence.
- `src/app/privacy/page.tsx`, `src/app/cookies/page.tsx`,
  `src/app/accessibility-statement/page.tsx` — GDPR Art. 13/14 privacy notice,
  e-Privacy cookie policy, and EU Web Accessibility Directive (2016/2102)
  statement. All three are Lithuanian-language stubs with amber legal-review
  banners; they reference fixture data (tenant name, address, email) so the
  content is tenant-aware. Each requires legal review before publication.
- `scripts/check-content-integrity.ts` — fail-closed content-integrity gate
  (CT-01 through CT-05): fixture JSON values must not contain review markers,
  source literals must not hardcode tenant data that contradicts the fixture,
  local asset paths must exist under `public/`, and every block type must be
  handled by the renderer. Wired into `pnpm verify` and `ci.yml`.
- `docs/drafts/hub-tenant-fixtures-verification.md` — source-cited verification
  report for the hub's 9 unverified tenant fixtures. Found 408 `[TODO: verify]`
  markers (all in `ru` translation fields). Three Tier 1 identity errors fixed:
  `diocese-vilnius` (5 of 5 identity fields wrong), `cathedral-kaunas` (phone,
  postal code), `parish-st-john-vilnius` (domain, postal code). Two demo fixtures
  identified (funeral-vilnius, cemetery-vilnius — fictional addresses).
- `docs/drafts/basilica-pilot-fact-verification.md` — source-cited verification
  report for the Vilnius Cathedral Basilica flagship tenant. All operational
  and historical facts verified against katedra.lt, VLE, and SAVAITĖ.
- `public/images/placeholder-exterior.svg` and `placeholder-interior.svg` —
  honest architectural silhouette placeholders with explicit "[Nuotrauka dar
  neįkelta]" text. Real photographs require a parish licence.
- Page Package 03 — Basilica landing wireframe. Backfilled from `1197427`,
  which shipped without a CHANGELOG entry: `src/app/page.tsx` block renderer,
  `src/fixtures/tenant.json` (Vilnius Cathedral Basilica) and spoke-local
  `src/lib/{resolve-locale,json-ld,analytics}.ts`.
- `.npmrc` — scoped registry mapping for `@journeyoflife-org/*` per ADR-011 Annex C. The
  credential is supplied through `NPM_TOKEN` in the environment; no token is
  committed.
- `workflow-completeness` CI job, running
  `scripts/check-workflow-completeness.sh`. The script existed but was called
  by nothing, so the INV-8 meta-check never ran.
- Positive-control self-tests in `check-theme-literals.sh`,
  `check-payment-boundary.sh` and `check-secrets.sh`. Each seeds a synthetic
  violation into a temporary tree outside the repository and fails if the
  scanner cannot detect it, so a gate can no longer report PASS while
  incapable of failing.

### Changed

- `src/app/cookies/page.tsx`: removed false Google Analytics cookie list (`_ga`,
  `_gid`) — site uses self-hosted analytics, not Google. Replaced with accurate
  self-hosted analytics description. Removed false cookie banner promise;
  replaced with accurate localStorage consent mechanism description (FI-1, FI-5).
- `src/app/accessibility-statement/page.tsx`: removed false NVDA/VoiceOver/
  TalkBack testing claims. Replaced with accurate statement about automated
  source-level checks and planned AT testing (FI-2).
- `src/app/privacy/page.tsx`: separated cookies from analytics data collection.
  Accurate description of self-hosted analytics with localStorage consent (FI-4).
- `src/app/page.tsx`: `bg-amber-600` → `bg-amber-700` on CTA buttons (contrast
  ~4.6:1, passes WCAG AA). `text-gray-400` → `text-gray-600` on map text
  (contrast ~7.0:1, passes WCAG AA). Hover state updated to `bg-amber-800`.
- `src/app/layout.tsx`: skip link text localized to Lithuanian
  ("Pereiti prie pagrindinio turinio").
- `scripts/check-a11y-pages.ts`: skip link detection regex updated from
  `/skip/i` to `/skip|pereiti|перейти/i` for multi-language support.
- `src/app/page.tsx`: `BASE_URL` now reads `NEXT_PUBLIC_SITE_URL` environment
  variable with `http://localhost:3000` fallback, instead of being hardcoded to
  the production URL. Prevents canonical URL leakage when demo/staging
  environments serve the spoke.
- `next.config.js`: added `X-Robots-Tag: noindex, nofollow` HTTP header
  (INV-SEO-01). Covers non-HTML resources (SVGs, JSON) and provides a safety
  net if layout.tsx metadata is accidentally removed.
- `src/lib/resolve-locale.ts`: `buildCanonical()` and `buildHreflang()` marked
  as reserved for multi-locale routes (Prompt 7+) with documentation comments.
- `check-secrets` now invokes `scripts/check-secrets.sh`, the file the
  satellite kit actually ships, instead of a nonexistent `check-secrets.ts`.
- Invariant identifiers realigned to ADR-011 as the authoritative source:
  theme literals INV-7 → INV-5; workflow completeness INV-6 → INV-8.
- `pnpm verify` additionally runs `check-workflow-completeness`.
- Professional opinion updated (2026-09-14): P1 architectural governance items
  completed — `.changeset/config.json` baseBranch updated to `main`, package
  governance policy documented in hub, TemplateRenderer package migration plan
  created. Gate qualification updated to PARTIALLY PASSING.

- Professional opinion updated (2026-09-14): Prompt 19 comprehensive readiness
  review complete — 62 findings across 11 audits (14 HIGH, 22 MEDIUM, 26 LOW).
  Demo READY (3-4 hours). Production NOT READY (49-73 hours). Critical blockers:
  legal, architectural, content governance. Full report:
  docs/drafts/readiness-review.md.
- Professional opinion updated (2026-09-14): Prompt 18 first tenant verification
  complete — 5 findings (1 HIGH, 2 MEDIUM, 2 LOW). Vilnius Cathedral Basilica
  verified: build exits 0, 46/46 tests, all 10 blocks render, identity data
  confirmed. Mass schedule dates hardcoded (HIGH). Full report:
  docs/drafts/first-tenant-verification.md.
- Professional opinion updated (2026-09-14): Prompt 17 content approval workflow
  complete — 8 findings (3 HIGH, 3 MEDIUM, 2 LOW). No approval workflow, no
  provenance fields, no content ownership. Schema extension proposed (2 hours).
  Full workflow requires 8-12 hours. Full report:
  docs/drafts/content-approval-workflow-assessment.md.
- Professional opinion updated (2026-09-14): Prompt 16 legal review of stub pages
  complete — 9 findings (2 HIGH, 4 MEDIUM, 3 LOW). Privacy policy missing Art. 6,
  retention, DPO. All pages Lithuanian-only. Requires lawyer review. Full report:
  docs/drafts/legal-review-stub-pages-assessment.md.
- Professional opinion updated (2026-09-14): Prompt 15 demo environment deployment
  assessment complete — 7 findings (3 HIGH, 2 MEDIUM, 2 LOW). No Dockerfile, no
  deploy workflow. 3-layer indexing protection complete. Demo READY (2-3 hours on
  Vercel). Production NOT READY (12-15 hours additional work). Full report:
  docs/drafts/demo-environment-deployment-assessment.md.
- Professional opinion updated (2026-09-14): Prompt 14 TemplateRenderer packaging
  assessment complete — 6 findings (2 HIGH, 3 MEDIUM, 1 LOW). Hub TemplateRenderer
  is private app, migration plan not implemented. Spoke has 247 lines duplicated.
  Migration path: 5-6 hours, low risk. Full report:
  docs/drafts/template-renderer-packaging-assessment.md.
- Professional opinion updated (2026-09-14): Prompt 13 payment boundary audit
  complete — 3 findings (0 HIGH, 2 MEDIUM, 1 LOW). Gate well-engineered (14
  patterns, 4 self-tests), ADR-009 Model A fully compliant, zero PSP code.
  Missing 2 patterns documented as deliberate deferral. Full report:
  docs/drafts/payment-boundary-audit.md. Gate qualification updated with
  3 payment boundary sub-gates (all PASS).
- Professional opinion updated (2026-09-14): Prompt 12 content integrity audit
  complete — 6 findings (1 HIGH, 3 MEDIUM, 2 LOW). Mass schedule dates stale,
  CT-03 not implemented, no content provenance. Full report:
  docs/drafts/content-integrity-audit.md. Gate qualification updated with
  6 content integrity sub-gates.
- Professional opinion updated (2026-09-14): Prompt 11 analytics/consent audit
  complete — 8 findings (3 HIGH, 3 MEDIUM, 2 LOW). Consent gate architecture
  correct but dead code (no consent UI, no API endpoint). Full report:
  docs/drafts/analytics-consent-audit.md. Gate qualification updated with
  5 analytics sub-gates.
- Professional opinion updated (2026-09-14): Prompt 10 SEO audit complete —
  11 findings (4 HIGH, 3 MEDIUM, 4 LOW). Meta metadata FAIL, OG/Twitter FAIL,
  canonical PARTIAL, JSON-LD PASS, hreflang PASS. Full report:
  docs/drafts/seo-audit.md. Gate qualification updated with 6 SEO sub-gates.
- Professional opinion updated (2026-09-14): Phase 8A + A11Y P0/P1 executed —
  4 factual errors fixed, 2 contrast failures fixed, skip link localized.
  Gate qualification: legal factual accuracy PASS, contrast PASS.
- Professional opinion updated (2026-09-14): Prompt 9 accessibility/WAD
  assessment complete — 2 contrast failures, 6 issues total, WAD likely
  not applicable. Gate qualification updated with accessibility static PASS,
  contrast FAIL, WAD not applicable.
- Professional opinion updated (2026-09-14): Prompt 8 legal pages audit
  complete — 5 factual errors identified, 5-phase implementation plan
  documented. Gate qualification updated: legal factual accuracy FAIL.
- Professional opinion updated (2026-09-14): Prompt 1 indexing protection
  audit complete — 3-layer defense-in-depth (meta + header + robots.txt),
  environment-aware canonical URL, RSC boundary fix. Gate qualification
  updated with build EXIT 0 and new gating items.

### Fixed

- RSC boundary defect in `mapLocation` block: `onClick` handler on directions
  `<a>` tag cannot serialize across the Server Component boundary. Fixed by
  extracting `TrackedLink` client component. Build now exits 0.
- Hub tenant fixture identity corrections (jol-hub, uncommitted):
  - `diocese-vilnius.json`: address `Šv. Jono g. 3` → `Šventaragio g. 4`,
    email → `curia@vilnensis.lt`, phone → `+370 5 262 7098`,
    domain → `vilnensis.lt`, parish count 54 → 97. All 5 identity fields were
    wrong relative to vilnensis.lt and rekvizitai.vz.lt.
  - `cathedral-kaunas.json`: phone `+370 37 32 26 08` → `+370 37 32 40 93`,
    postal code `44287` → `44281`. Verified against kaunoarkikatedra.lt/kontaktai.
  - `parish-st-john-vilnius.json`: domain `svjonai.lt` → `jonai.lt`,
    postal code `01141` → `01123`. Verified against govilnius.lt and rekvizitai.vz.lt.
  - `deanery-vilnius-city.json`: address corrected to match diocese curia.
- Fixed 19 TypeScript strict-mode errors across scripts and source:
  - `scripts/check-a11y-pages.ts`: narrowed `string | undefined` from regex match.
  - `scripts/check-content-integrity.ts`: removed unused `statSync` import;
    narrowed regex capture group.
  - `scripts/check-perf-budget.ts`: added optional `detail` field to `Violation`.
  - `src/app/page.tsx`: added type assertions for `unknown` block properties
    in conditional renders; added null guard for `fixture.pages[0]`.
  - `src/lib/resolve-locale.ts`: prefixed unused `baseUrl` parameter in
    `buildHreflang` with `_`.
- Vilnius Cathedral Basilica flagship fixture: 4 of 5 verifiable operational
  facts were wrong relative to the institution's own website (katedra.lt).
  Address corrected (Katedros a. 1 → a. 2), email corrected (info@ → parapija@),
  Mass schedule replaced with real times (3 synthetic → 10 real entries),
  confession hours corrected, visiting hours corrected. Historical data
  corrected: `established` 1783 → 1387 (Christianization of Lithuania),
  consecration year 1783 → 1801, basilica title 1922 (year only; unconfirmed
  day precision "4 March" removed). All 11 `[TODO: verify]` markers removed;
  all strings now sourced from katedra.lt, VLE, or SAVAITĖ.
- `src/app/page.tsx`: JSON-LD `streetAddress` was hardcoded as `Katedros a. 1`
  (contradicting the fixture and reality). Now parsed from `fixture.identity.address`.
- `src/app/page.tsx`: hreflang alternates advertised `/en` and `/ru` routes that
  do not exist in the spoke (only `/` is served). Google treats invalid hreflang
  targets as a signal to drop the mapping. Now emits only `x-default` and `lt`.
- `src/app/page.tsx`: `buildMassEvent` was imported but never used. Mass Event
  JSON-LD is now emitted for each scheduled Mass.
- All three grep-based compliance gates were vacuous. Each passed
  `--include='*.{ts,tsx}'` to GNU grep, whose `--include` is a glob that does
  not brace-expand, so zero files were scanned and every gate reported PASS
  unconditionally. This silently disabled INV-3 (payment boundary), INV-5
  (theme literals) and plaintext-secret detection.
- `check-theme-literals.sh`: `#[0-9a-fA-F]\{6\}` used BRE braces under `-E`
  and matched the literal text `{6}`; now `{6}`.
- `check-payment-boundary.sh`: quote classes such as `from ["@]stripe` matched
  neither single- nor double-quoted imports; now `from ['"]@stripe`.
- `check-secrets.sh`: `\x27` is not a GNU grep ERE escape, so `["\x27]`
  matched `\`, `x`, `2` or `7`, and `AKIA[0-9A-Z]\{16\}` and
  `[^"\x27]\{20,\}` used BRE braces under `-E`. All patterns now use real
  quote classes and ERE quantifiers.
- Absent scan targets such as `src/components/` are now reported instead of
  being swallowed by `2>/dev/null || true`; a gate with nothing to scan fails
  rather than passing.
- Removed an untracked npm `package-lock.json` and restored the committed
  `^1.0.0` registry pins for `@journeyoflife-org/*`, which had been locally downgraded
  to `file:` path dependencies contrary to INV-2 and ADR-011 Annex C. INV-7
  mandates pnpm 10.30.3 only.

### Security

- Root layout emits `robots: { index: false, follow: false }` for both
  general crawlers and `googleBot`. Defense-in-depth: `X-Robots-Tag` HTTP
  header covers non-HTML resources; `public/robots.txt` blocks all crawlers
  at the protocol level. Three-layer protection ensures no accidental indexing
  of pre-production content.
- `docs/drafts/professional-opinion-updated.md` — release-blocking architecture
  and readiness assessment. Incorporates review feedback: GDPR Art. 9
  qualification, Web Accessibility Directive applicability assessment, PCI-DSS
  scope clarification, gate qualification (fixture-level vs production-readiness),
  demo environment recommendation, and content governance metadata model.
- Restored actual enforcement of the INV-3 payment boundary, the INV-5 theme
  literal guard and plaintext-secret detection, none of which had been
  operative since the repository was scaffolded.

## [0.1.0] — 2026-09-11

### Added

- Initial scaffold from `jol-frontend-repo-template`.
- Next.js 14 App Router + TypeScript strict + Tailwind.
- Satellite kit: `.sops.yaml`, `scripts/sops-validate.py`, `secrets/` structure.
- Gate scripts: payment boundary, theme literals, secrets, a11y, perf.
- Governance: EUPL-1.2 LICENSE, SECURITY.md, CODEOWNERS, CONTRIBUTING.md.
- CI workflow calling org reusable workflows.

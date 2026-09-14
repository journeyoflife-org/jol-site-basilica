# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

- `check-secrets` now invokes `scripts/check-secrets.sh`, the file the
  satellite kit actually ships, instead of a nonexistent `check-secrets.ts`.
- Invariant identifiers realigned to ADR-011 as the authoritative source:
  theme literals INV-7 → INV-5; workflow completeness INV-6 → INV-8.
- `pnpm verify` additionally runs `check-workflow-completeness`.
- Professional opinion updated (2026-09-14): P1 architectural governance items
  completed — `.changeset/config.json` baseBranch updated to `main`, package
  governance policy documented in hub, TemplateRenderer package migration plan
  created. Gate qualification updated to PARTIALLY PASSING.

### Fixed

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

- Root layout now emits `robots: { index: false, follow: false }` for both
  general crawlers and `googleBot`. The spoke is not production-ready and must
  not be indexed by search engines until legal, content, and architectural
  governance gaps are resolved.
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

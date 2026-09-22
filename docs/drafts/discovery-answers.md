# Discovery Answers — Basilica Frontend Specification

> **Status:** Evidence-backed answers from codebase audit
> **Date:** 2026-09-14
> **Method:** Every answer is sourced from code, configuration, or architecture documents — not assumptions.

## Business and Product

### Who owns and administers each website?

**Answer:** The platform owner is `journeyoflife-org` (GitHub organization). Each tenant (basilica, cathedral, parish) is administered by its own institution, but the platform code and shared packages are governed centrally.

**Evidence:** CODEOWNERS, CONTRIBUTING.md, `journeyoflife-org/.github` reusable workflows.

### Will each organization have its own domain or subdomain?

**Answer:** Both. Subdomain routing is the default (`*.gyvenimo-kelias.lt`), with custom domain support for VIP tenants via `Tenant.domain`.

**Evidence:** `tenant-resolver/src/index.ts` — resolution chain: exact hostname → subdomain of `TENANT_BASE_DOMAIN` → `X-Tenant` header. `TENANT_BASE_DOMAIN` defaults to `gyvenimo-kelias.lt`.

### Will the platform support one language initially or multiple languages?

**Answer:** Three languages from day one: Lithuanian (lt, mandatory), English (en, optional), Russian (ru, optional).

**Evidence:** `LocalizedTextSchema` in `seed-data/src/schema.ts` — `lt` is `z.string().min(1)` (mandatory), `en` and `ru` are `z.string().optional()`.

### Which countries and legal jurisdictions must be supported first?

**Answer:** Lithuania. All tenants operate under Lithuanian civil law, Lithuanian Catholic Church canon law, and the Archdiocese of Vilnius.

**Evidence:** Tenant fixtures reference Lithuanian addresses, phone numbers (+370), domains (.lt), and Lithuanian-language content. GDPR applies as EU member state regulation.

### Which features are mandatory for the pilot?

**Answer:** Based on the frontend specification (16 core pages) and the professional opinion:
- Mass/confession schedules
- Sacrament information
- Contact information
- Location/map
- Visitor information
- Legal pages (privacy, cookies, accessibility)
- noindex (pre-production)

### Which features can be postponed?

**Answer:**
- Card donations (requires legal/accounting/payment-provider approval)
- Online shop/e-commerce
- Newsletter/email integration
- CMS (content can be fixture-based initially)
- Advanced search (can be added in Phase 3)

### Are donations and e-commerce required in the Basilica pilot?

**Answer:** Donations: informational page only (1.2% GPM allocation). Card donations: postponed until legal/accounting approval. E-commerce: not required for pilot.

**Evidence:** Professional opinion §11: "The 1.2% GPM page should be implemented as an informational workflow first. Card donations should be postponed until legal, accounting, and payment-provider requirements are approved."

### What payment providers should be supported?

**Answer:** Not yet selected. The `@journeyoflife-org/commerce` package exists but has no payment provider integration. PCI-DSS scope clarification: hosted payment links (Stripe Payment Links, etc.) keep PCI-DSS responsibility with the provider.

**Evidence:** `package.json` lists `@journeyoflife-org/commerce: "^1.0.0"` but no Stripe/Paysera SDK in dependencies.

### Who manages content and approvals?

**Answer:** Not yet established. The content approval workflow is identified as a gap in the professional opinion (P2 item #11). Currently, tenant fixture data can reach the frontend without parish sign-off.

### Are there multiple administrative roles?

**Answer:** Not yet implemented. The `@journeyoflife-org/auth` package exists but no role-based access control is configured. The `ClergyRoleListBlock` schema explicitly separates roles from names (GDPR Art. 9 compliance) — clergy names must come from an RLS-scoped content API, not committed fixtures.

**Evidence:** `seed-data/src/schema.ts` line 217-219: "Clergy names are Art. 9 personal data and must come from the RLS-scoped content API, never from a committed fixture."

## Technical Architecture

### What frontend framework and version are currently used?

**Answer:** Next.js 14.2.0 with App Router.

**Evidence:** `package.json` — `"next": "14.2.0"`. `tsconfig.json` — `"plugins": [{ "name": "next" }]`.

### Is the application based on Next.js, React, another framework, or a custom platform?

**Answer:** Next.js 14.2.0 + React 18.3.0 + TypeScript 5.4 (strict mode) + Tailwind CSS 3.4.

**Evidence:** `package.json` dependencies.

### Which rendering strategy is required: static generation, server-side rendering, or a hybrid approach?

**Answer:** Hybrid. Next.js App Router defaults to React Server Components (RSC) with static generation. Client components use `'use client'` directive. The template-renderer uses dynamic routes (`[locale]/[tenant]/[...slug]`) which resolve at request time.

**Evidence:** `next.config.js` — no `output: 'export'` (not purely static). RSC boundary enforced by `'use client'` directives in hub packages.

### What backend APIs already exist?

**Answer:** The platform is frontend-only. Backend APIs are planned but not yet implemented:
- Bitrix24 CRM integration (`@journeyoflife-org/bitrix-sdk` package exists)
- Analytics endpoint (`/api/analytics` referenced in `analytics.ts`)
- Content API for clergy names (referenced in schema comments but not implemented)

### Which shared packages are available under `@journeyoflife-org/*`?

**Answer:** 12 packages published at v1.0.0 to GitHub Packages:

| Package | Purpose |
|---|---|
| `a11y` | Accessibility utilities |
| `auth` | Authentication (not yet configured) |
| `bitrix-sdk` | Bitrix24 CRM integration |
| `commerce` | Payment/donation (no provider integrated) |
| `i18n` | Internationalization (lt/en/ru) |
| `observability` | Analytics, error reporting |
| `perf` | Performance monitoring |
| `seed-data` | Tenant fixture schemas + fixtures |
| `seo` | SEO metadata, JSON-LD builders |
| `tenant-resolver` | Tenant resolution chain |
| `testing` | Test utilities |
| `ui` | Design system components |

**Evidence:** All 12 packages published to GitHub Packages as `@journeyoflife-org/*` v1.0.0 (2026-09-13). `seo` bumped to v1.1.0 after adding `massEventEntity` and `breadcrumbListEntity`.

### How is tenant identification performed?

**Answer:** Resolution chain (in order):
1. Exact hostname match (custom domains, VIP)
2. Subdomain extraction: `*.gyvenimo-kelias.lt` → slug lookup
3. `X-Tenant` header (API/admin/dev override)
4. `X-Forwarded-Host` honored (Proxmox/nginx chains)

Performance: in-memory LRU cache (5 min TTL). Closed lookups only — unknown slugs/domains return `null` (no enumeration).

**Evidence:** `tenant-resolver/src/index.ts` — full resolution chain documented in module header.

### How are themes, logos, fonts, colors, and content configured?

**Answer:**
- **Themes:** `VERTICAL_FAMILY` maps tenant vertical to layout family (sacred, eastern, administrative, memorial, congregation). `FAMILY_ACCENT` maps family to Tailwind border color class.
- **Logos/fonts:** Not yet configured. `tailwind.config.ts` has empty `theme.extend`.
- **Colors:** Liturgical accent colors via Tailwind classes (`border-liturgical-gold`, `border-liturgical-purple`, etc.).
- **Content:** Tenant fixture JSON (`@journeyoflife-org/seed-data`) — `TenantFixture` schema with `pages[].contentBlocks[]`.

**Evidence:** `layout-families.ts` in template-renderer. `seed-data/src/schema.ts` — `TenantFixtureSchema`.

### Is there a CMS?

**Answer:** No. Content is currently fixture-based (JSON files in `seed-data/src/fixtures/tenants/`). A CMS is listed as a future integration in the frontend specification.

### How are media files stored?

**Answer:** Currently in `public/images/` within each spoke repo. The hub's `seed-data` fixtures reference image paths (e.g., `/images/placeholder-exterior.svg`). No centralized media storage or CDN is configured.

**Evidence:** `public/images/placeholder-exterior.svg` exists in spoke. Gallery block schema requires `src`, `alt`, `width`, `height`.

### How are deployments performed?

**Answer:** Not yet automated. The architecture specifies Proxmox VE 9.2 via immutable image tags. CI pipeline exists (`.github/workflows/ci.yml`) but no deployment workflow.

**Evidence:** Memory: "Deployment: Proxmox VE 9.2 via immutable image tags." No `deploy.yml` in `.github/workflows/`.

### Which environments exist: development, staging, and production?

**Answer:** Development only. Staging and production are not yet deployed. `noindex` is applied to prevent search indexing of pre-production content.

**Evidence:** `layout.tsx` — `robots: { index: false, follow: false }`. Professional opinion: "Demo environment: DNS/infra deployment pending."

### Which observability and error-reporting tools are used?

**Answer:** `@journeyoflife-org/observability` package exists but is not yet wired. Analytics events are defined in `src/lib/analytics.ts` with consent gating, but the `trackEvent` function has a TODO: "wire to @journeyoflife-org/observability when packages are published."

**Evidence:** `analytics.ts` line 18: TODO comment. `package.json` lists `@journeyoflife-org/observability: "^1.0.0"`.

### What are the performance and uptime objectives?

**Answer:** Not yet defined. A performance budget script exists (`scripts/check-perf-budget.ts`) that checks gzipped chunk sizes against budgets, but no specific LCP/CLS/FID targets are documented.

**Evidence:** `scripts/check-perf-budget.ts` reads `.next` build manifests. No `PERFORMANCE_BUDGET.md` or similar document.

## Design and UX

### Is there an existing Figma design system?

**Answer:** No. The `@journeyoflife-org/ui` package provides design tokens and components, but no Figma file is referenced.

### What visual style should represent a Roman Catholic Basilica?

**Answer:** Liturgical accent colors via `VERTICAL_FAMILY`:
- Sacred (basilica, cathedral, parish, chapel, monastery): `border-liturgical-gold`
- Eastern (orthodox, greek-catholic): `border-liturgical-purple`
- Administrative (diocese, deanery): `border-primary`
- Memorial (cemetery, funeral-home): `border-gray-400`
- Congregation (protestant): `border-liturgical-green`

**Evidence:** `layout-families.ts` — `FAMILY_ACCENT` mapping.

### Which colors, typography, iconography, photography, and imagery are permitted?

**Answer:**
- **Colors:** Liturgical accent colors (gold, purple, green) + Tailwind defaults.
- **Typography:** Not yet configured (Tailwind defaults).
- **Iconography:** Not yet defined.
- **Photography:** Placeholder SVGs with "[Nuotrauka dar neįkelta]" text. Real photographs require parish license.
- **Imagery:** Gallery blocks require explicit `width`/`height` (CLS prevention) and `alt` text (WCAG 1.1.1).

**Evidence:** `public/images/placeholder-exterior.svg`. Gallery block schema requires dimensions + alt.

### Must the design support elderly and less technically experienced users?

**Answer:** Yes. WCAG 2.2 AA compliance is required (INV-10 in CI). This includes large touch targets, high contrast, clear navigation, and keyboard accessibility — all of which benefit elderly users.

**Evidence:** `ci.yml` line 92: "Accessibility, static (INV-10 / WCAG 2.2 AA)". Skip navigation link in `layout.tsx`.

### Which accessibility standard is required?

**Answer:** WCAG 2.2 AA. The CI pipeline enforces static accessibility checks (landmarks, skip links, alt text). Full WCAG 2.2 AA compliance requires rendered DOM testing (not yet implemented).

**Evidence:** `ci.yml` — `a11y-static` job. `check-a11y-pages.ts` scans for landmarks, skip links, alt text.

### Is WCAG 2.2 AA compliance required?

**Answer:** Yes. Explicitly required by INV-10 in the CI pipeline.

### What mobile-first breakpoints should be used?

**Answer:** Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px). No custom breakpoints configured.

**Evidence:** `tailwind.config.ts` — empty `theme.extend`.

### Are there restrictions on animations or video?

**Answer:** Not yet defined. The `analytics.ts` file references `prefers-reduced-motion` but no animation policy is documented.

### Should the interface support dark mode?

**Answer:** Not yet implemented. Tailwind supports dark mode via `dark:` variant, but no dark mode configuration exists.

## Content and Localization

### Who provides the content?

**Answer:** Tenant institutions (basilicas, cathedrals, parishes) provide content via fixture JSON files. The Vilnius Cathedral Basilica fixture was verified against katedra.lt, VLE, and SAVAITĖ.

**Evidence:** `src/fixtures/tenant.json` — Vilnius Cathedral Basilica. Professional opinion: "All operational and historical facts verified against katedra.lt, VLE, and SAVAITĖ."

### Which languages must be supported?

**Answer:** Lithuanian (mandatory), English (optional), Russian (optional). 408 `ru` translation markers remain in hub fixtures — `ru` locale may need to be disabled until translations are complete.

**Evidence:** `LocalizedTextSchema` — `lt` mandatory, `en`/`ru` optional. Professional opinion: "408 ru translations pending."

### Will translations be human-produced, machine-assisted, or both?

**Answer:** Not yet decided. The 408 `ru` markers suggest human translation is needed but not yet completed.

### How should liturgical dates and calendars be represented?

**Answer:** Mass schedule blocks use ISO 8601 `startDate` (e.g., `"2026-09-13T10:00:00"`) for JSON-LD Event structured data. No liturgical calendar integration exists yet.

**Evidence:** `MassScheduleBlockSchema` — `startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)`.

### Should content support diocesan or national liturgical variations?

**Answer:** Not yet implemented. The schema supports localized text but no liturgical variation mechanism.

### How will clergy names, schedules, documents, and announcements be maintained?

**Answer:**
- **Clergy names:** Must come from an RLS-scoped content API (not committed fixtures) due to GDPR Art. 9.
- **Schedules:** Tenant fixture `massSchedule` blocks.
- **Documents:** Not yet implemented (frontend spec lists "Documents & Downloads" as a future page).
- **Announcements:** Not yet implemented (frontend spec lists "News" as a future page).

**Evidence:** `ClergyRoleListBlockSchema` comment: "Clergy names are Art. 9 personal data and must come from the RLS-scoped content API."

### Which content requires approval before publication?

**Answer:** All tenant fixture data. The professional opinion identifies "no content approval workflow" as a P2 gap. Currently, unreviewed data can reach the frontend.

## SEO and Analytics

### What are the target locations and search terms?

**Answer:** Lithuania. Target search terms (inferred from content):
- "Mass times [city]"
- "Basilica in [city]"
- "Confession times [city]"
- "[Basilica name] Vilnius/Kaunas/..."

### Should pages target local searches such as "Mass times," "Basilica in [city]," and "confession times"?

**Answer:** Yes. Mass schedule blocks emit Event JSON-LD with `startDate`. Church entity JSON-LD includes address, geo coordinates, and telephone.

**Evidence:** `page.tsx` — `churchEntity()` and `massEventEntity()` builders.

### Which analytics and consent-management platforms are approved?

**Answer:** Self-hosted analytics via `@journeyoflife-org/observability`. Consent-gated (checks `localStorage.getItem('jol-consent-analytics')`). No third-party tracking SDK.

**Evidence:** `analytics.ts` — consent gate, `navigator.sendBeacon('/api/analytics', ...)`.

### Is Google Search Console used?

**Answer:** Not yet configured. Sitemap and robots.txt are not yet generated.

### Are XML sitemaps generated automatically?

**Answer:** Not yet. The frontend spec lists "Auto-generated XML sitemap" as a requirement, but no implementation exists.

### Should schema.org structured data be implemented?

**Answer:** Yes. Implemented:
- Church (with `kind: 'basilica'`, `preciseCatholic: true`)
- PlaceOfWorship
- Event (mass schedules)
- BreadcrumbList
- FAQPage (faq blocks)
- Service (sacrament blocks)

**Evidence:** `page.tsx` — `churchEntity()`, `massEventEntity()`, `breadcrumbListEntity()` from `@journeyoflife-org/seo`.

### Are canonical URLs and hreflang required?

**Answer:** Yes. Implemented:
- Canonical URLs via `buildCanonicalUrl()`
- Hreflang alternates via `buildHreflang()` (lt, en, ru, x-default)

**Evidence:** `resolve-locale.ts` — `buildCanonicalUrl()`, `buildHreflang()`. Tests verify hreflang generation.

## GitHub and DevOps

### What branching strategy is required?

**Answer:** `main` is the trunk. Feature branches merge via PR with 2 approvals (strict branch protection). Conventional Commits with closed scope list.

**Evidence:** CONTRIBUTING.md, CODEOWNERS. Hub: `main` is trunk after `fix/i18n-rsc-barrel` fast-forward merge.

### Are signed commits mandatory?

**Answer:** Yes. INV-6 requires GPG-signed commits.

**Evidence:** Memory: "Git: GPG signing mandatory for commits."

### Which checks must pass before merging?

**Answer:** CI pipeline (`.github/workflows/ci.yml`) runs:
1. Build (frontend-build)
2. Test (frontend-test)
3. Security scan (security-scan)
4. Payment boundary (INV-3)
5. Compliance check (INV-5)
6. Satellite kit drift
7. Workflow completeness (INV-8)
8. Accessibility static (INV-10)
9. Content integrity
10. Performance budget (post-build)

**Evidence:** `ci.yml` — 10 jobs.

### Should every repository use the same repository template?

**Answer:** Yes. All spokes are scaffolded from `jol-frontend-repo-template`.

**Evidence:** CHANGELOG.md: "Initial scaffold from `jol-frontend-repo-template`."

### What are the required GitHub Actions workflows?

**Answer:** 5 org reusable workflows (INV-8):
1. `frontend-build.yml`
2. `frontend-test.yml`
3. `security-scan.yml`
4. `payment-boundary-guard.yml`
5. `compliance-check.yml`

Plus 3 local jobs: drift-check, workflow-completeness, a11y-static, content-integrity, perf-budget.

**Evidence:** `ci.yml` — calls `journeyoflife-org/.github/.github/workflows/*.yml@main`.

### Which dependency, security, and quality scanners are required?

**Answer:**
- **Secrets:** `scripts/check-secrets.sh` (AWS keys, GitHub tokens, etc.)
- **Payment boundary:** `scripts/check-payment-boundary.sh` (no Stripe/PSP imports in spoke)
- **Theme literals:** `scripts/check-theme-literals.sh` (no denomination literals in components)
- **Security scan:** Org reusable workflow `security-scan.yml`
- **SCA:** Included in security scan

**Evidence:** `ci.yml` — security job. Gate scripts in `scripts/`.

### Are preview deployments required for pull requests?

**Answer:** Not yet implemented. No preview deployment workflow exists.

### Which container and deployment platform is used?

**Answer:** Proxmox VE 9.2 via immutable image tags. No container orchestration (Kubernetes, Docker Swarm) is configured.

**Evidence:** Memory: "Deployment: Proxmox VE 9.2 via immutable image tags."

### How are secrets managed?

**Answer:** SOPS with age encryption. Encrypted secrets in `secrets/encrypted/`. `.sops.yaml` defines creation rules.

**Evidence:** `.sops.yaml`, `scripts/sops-validate.py`, `secrets/` directory structure.

### What rollback strategy is required?

**Answer:** Not yet documented. Package governance policy (hub) documents rollback procedure for published packages (append-only registry → publish new version). No infrastructure rollback procedure.

**Evidence:** `docs/architecture/package-governance-policy.md` §4 — Rollback Procedure.

## Summary of Gaps

| Area | Gap | Priority |
|---|---|---|
| Content approval | No workflow for parish sign-off | P2 |
| CMS | No content management system | Future |
| Media storage | No centralized storage/CDN | P1 |
| Deployment | No automated deployment workflow | P0 |
| Staging/production | No environments deployed | P0 |
| Observability | `@journeyoflife-org/observability` not wired | P1 |
| Performance targets | No LCP/CLS/FID objectives defined | P1 |
| Dark mode | Not implemented | Future |
| Liturgical calendar | No integration | Future |
| Documents/news | Not yet implemented | P2 |
| Preview deployments | Not implemented | Future |
| Rollback strategy | Not documented for infrastructure | P1 |

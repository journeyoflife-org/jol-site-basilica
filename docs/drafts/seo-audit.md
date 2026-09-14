# SEO Audit — Prompt 10

**Date:** 2026-09-14
**Scope:** jol-site-basilica spoke (Next.js 14 App Router)
**Status:** Audit complete — 11 findings (4 HIGH, 3 MEDIUM, 4 LOW)

---

## 1. JSON-LD Structured Data

### 1.1 churchEntity — PASS

Consumed from `@journeyoflife-org/seo@1.1.0`.

| Field | Value | Source |
|---|---|---|
| `@type` | `Church`, `CatholicChurch`, `PlaceOfWorship` | kind=basilica, preciseCatholic=true |
| `name` | "Vilniaus Šv. Stanislovo ir Šv. Vladislovo arkikatedra bazilika" | fixture.name[lt] |
| `url` | `http://localhost:3000` (dev) / env (prod) | NEXT_PUBLIC_SITE_URL |
| `address` | PostalAddress (streetAddress, postalCode, addressLocality, addressCountry=LT) | fixture.identity.address parsed |
| `geo` | GeoCoordinates (54.6862, 25.2903) | hardcoded in page.tsx |
| `telephone` | "+370 5 261 0731" | fixture.identity.phone |
| `description` | tagline[lt] | fixture.tagline |
| `parentOrganization` | ReligiousOrganization "Vilnius Archdiocese" | fixture.identity.jurisdiction |

**Missing (optional):**
- `image` — not provided (fixture has placeholder SVGs, not real photos)
- `openingHours` — visiting hours exist in fixture (`visitingInfo` block) but are not wired to churchEntity

**Google Rich Results validation:** name ✅, address ✅ — passes LocalBusiness minimum.

### 1.2 massEventEntity — PASS

One Event per mass schedule entry (10 events from fixture).

| Field | Value | Source |
|---|---|---|
| `@type` | `Event` | massEventEntity |
| `name` | "Šv. Mišios — Sunday 08:00" | fixture massSchedule.masses[] |
| `startDate` | "2026-09-13T08:00:00" | fixture massSchedule.masses[].startDate |
| `location` | Place with PostalAddress | fixture.name + parsed address |

**Missing (optional):**
- `endDate` — not in fixture
- `description` — not in fixture

**Google Rich Results validation:** name ✅, startDate ✅, location ✅ — passes Event minimum.

**Issue:** Mass event startDate values are hardcoded dates (2026-09-13/14). These will become stale. For production, mass schedules should use recurring dates or be dynamically generated.

### 1.3 breadcrumbListEntity — PASS (partial)

Home page emits single-item BreadcrumbList: `[{ name: "Pradžia", url: "/" }]`.

**Gap:** Legal pages (privacy, cookies, accessibility-statement) emit no BreadcrumbList. While these are terminal pages, Google expects at least a 2-item breadcrumb (Home → Current Page) for richer SERP display.

### 1.4 WebSite + SearchAction — NOT IMPLEMENTED

Hub provides `websiteWithSearchEntity()` but the spoke does not consume it. This schema enables the Google sitelinks search box.

**Severity:** MEDIUM — valuable for discoverability but not blocking.

### 1.5 Tests

19 tests in `src/__tests__/json-ld.test.ts` — all passing. Coverage:
- churchEntity: 12 tests (types, address, geo, telephone, parent, image, kind variants)
- massEventEntity: 3 tests (type, fields, location)
- breadcrumbListEntity: 3 tests (type, positions, empty)

---

## 2. Canonical URLs

### 2.1 Home Page — PASS

```html
<link rel="canonical" href="${BASE_URL}/" />
```

Environment-aware since Prompt 1 (`NEXT_PUBLIC_SITE_URL` with `http://localhost:3000` fallback).

### 2.2 Legal Pages — FAIL

No `<link rel="canonical">` on:
- `/privacy`
- `/cookies`
- `/accessibility-statement`

Next.js does NOT auto-generate canonical URLs from the page URL. Without explicit canonical, browsers may use the current URL (including query parameters), which can cause duplicate content issues.

**Hub provides:** `absoluteCanonical(origin, route)` — strips query/fragment, normalizes trailing slash.

**Severity:** MEDIUM — not blocking for pre-production, but must be fixed before indexing.

---

## 3. Hreflang Tags

### 3.1 Current State — PASS (correct for single-locale)

```html
<link rel="alternate" hrefLang="x-default" href="${canonical}" />
<link rel="alternate" hrefLang="lt" href="${canonical}" />
```

Correctly does NOT advertise `/en` or `/ru` routes that don't exist. Google treats invalid hreflang targets as a signal to drop the entire mapping.

### 3.2 Hub Capability — UNUSED

Hub provides `buildHreflangSet()` with pilot locale matrix:
- `lt-LT` → `/{locale}/...`
- `en-LT` → `/{locale}/...`
- `ru-LT` → `/{locale}/...`
- `x-default` → `lt` (primary market)

Also provides `verifyHreflangReciprocity()` for auditing cross-page hreflang consistency.

**Severity:** LOW — correct for current state; will need implementation when multi-locale routes are added (Prompt 7+).

---

## 4. Meta Metadata

### 4.1 Root Layout — ISSUE

```typescript
title: 'Basilica of Vilnius Cathedral | Journey of Life',
description: 'Basilica of Vilnius Cathedral — Journey of Life Catholic Church platform',
```

**Problem:** Title and description are in English, but `<html lang="lt">`. Meta descriptions should match the page language. Google may flag this as a language signal mismatch.

### 4.2 Home Page — FAIL

Home page does NOT override layout metadata. The fixture provides:
- `fixture.name.lt` = "Vilniaus Šv. Stanislovo ir Šv. Vladislovo arkikatedra bazilika"
- `fixture.tagline.lt` = "Vilniaus arkivyskupijos motininė bažnyčia, mažoji bazilika nuo 1922 m."
- `fixture.pages[0].meta.description` = "Vilniaus Šv. Stanislovo ir Šv. Vladislovo arkikatedra bazilika"

None of these are wired to Next.js metadata. The home page inherits the English generic layout title.

### 4.3 Legal Pages — PASS (with caveat)

All three legal pages have Lithuanian titles and descriptions:
- Privacy: "Privatumo politika | Journey of Life"
- Cookies: "Slapukų politika | Journey of Life"
- Accessibility: "Prieinamumo pareiškimas | Journey of Life"

**Caveat:** Descriptions are generic ("...— Journey of Life Catholic Church platform"), not content-specific.

### 4.4 Hub Metadata Builders — UNUSED

| Function | Purpose | Status |
|---|---|---|
| `tenantTitleTemplate(name)` | `{ default, template: "%s \| {name}" }` | Not consumed |
| `clampDescription(text)` | Clamp to 150-160 chars on word boundary | Not consumed |
| `autoDescription(content)` | Auto-generate from content when none provided | Not consumed |
| `robotsPolicyFor(kind)` | index,follow for public; noindex for privileged | Not consumed |

**Severity:** HIGH — meta descriptions are the primary SEO signal for search results. The home page currently has no Lithuanian, tenant-specific metadata.

---

## 5. Open Graph / Twitter Cards

### 5.1 Current State — FAIL

**Zero Open Graph tags on any page.** No `<meta property="og:title">`, no `og:description`, no `og:image`, no `og:url`, no `og:locale`, no `og:site_name`.

**Zero Twitter Card tags on any page.** No `twitter:card`, no `twitter:title`, no `twitter:description`, no `twitter:image`.

**Impact:** When the site URL is shared on Facebook, LinkedIn, X (Twitter), WhatsApp, etc., there is no preview card. The link appears as plain text with no title, description, or image.

### 5.2 Hub Capability — UNUSED

| Function | Purpose | Status |
|---|---|---|
| `openGraphFor(input)` | Build OG metadata from tenant data | Not consumed |
| `resolveOgImage(options)` | OG image with fallback chain | Not consumed |
| `twitterCardFor(image)` | Twitter card type selector | Not consumed |
| `OG_IMAGE_WIDTH/HEIGHT` | 1200×630 constants | Defined, unused |

### 5.3 OG Image — NOT GENERATED

No `public/og-image.png`, no `app/opengraph-image.tsx`, no `@vercel/og`/`satori` integration. The hub defines the contract (1200×630, < 1MB, branded) but raster rendering requires the renderer package.

**Severity:** HIGH — social sharing is a primary discovery channel. Without OG tags, the site has zero social media presence when links are shared.

---

## 6. Robots / Sitemap

### 6.1 Current State — PASS (pre-production)

Three-layer indexing protection (Prompt 1):
1. `<meta name="robots" content="noindex, nofollow">` in layout.tsx
2. `X-Robots-Tag: noindex, nofollow` HTTP header in next.config.js
3. `public/robots.txt` with `Disallow: /`

### 6.2 Production Readiness — NOT READY

| Component | Status | Hub Support |
|---|---|---|
| `app/robots.ts` | Not implemented | `robotsDirectives()` available |
| `app/sitemap.ts` | Not implemented | `sitemapEntry()`, `shardUrls()`, `SITEMAP_POLICY` available |
| IndexNow | Not implemented | `buildIndexNowPayload()` available |
| Google Search Console | Not provisioned | No tenant domains yet |

**Severity:** LOW — correct for pre-production. Must be implemented before removing noindex.

---

## 7. @journeyoflife-org/seo Package Usage

### 7.1 Consumed (3 of 30+ exports)

| Export | Used | Where |
|---|---|---|
| `churchEntity` | ✅ | page.tsx L319 |
| `massEventEntity` | ✅ | page.tsx L348 |
| `breadcrumbListEntity` | ✅ | page.tsx L333 |

### 7.2 Not Consumed (27+ exports available)

| Export | Category | Priority |
|---|---|---|
| `absoluteCanonical` | Canonical | MEDIUM |
| `buildHreflangSet` | Hreflang | LOW |
| `tenantTitleTemplate` | Metadata | HIGH |
| `clampDescription` | Metadata | HIGH |
| `autoDescription` | Metadata | HIGH |
| `openGraphFor` | OG/Twitter | HIGH |
| `resolveOgImage` | OG/Twitter | HIGH |
| `twitterCardFor` | OG/Twitter | HIGH |
| `robotsDirectives` | Robots | LOW |
| `sitemapEntry` | Sitemap | LOW |
| `shardUrls` | Sitemap | LOW |
| `SITEMAP_POLICY` | Sitemap | LOW |
| `websiteWithSearchEntity` | JSON-LD | MEDIUM |
| `localBusinessEntity` | JSON-LD | MEDIUM |
| `faqPageEntity` | JSON-LD | LOW |
| `buildIndexNowPayload` | Indexing | LOW |
| `robotsPolicyFor` | Metadata policy | MEDIUM |
| `verifyHreflangReciprocity` | Hreflang audit | LOW |
| `normalizeRoute` | URL normalization | LOW |
| `sanitizeOrigin` | URL validation | LOW |
| `sameCanonical` | Canonical comparison | LOW |
| `lastmodIso` | Sitemap dates | LOW |
| `isSitemapKind` | Sitemap filtering | LOW |
| `churchSlug` | Church URL generation | LOW |
| `ogImagePath` | OG image path | MEDIUM |
| `PILOT_HREFLANG` | Locale matrix | LOW |
| `X_DEFAULT_LOCALE` | Default locale | LOW |

**Severity:** MEDIUM — the hub SEO package is a comprehensive, well-tested library. The spoke should consume it rather than building ad-hoc solutions.

---

## Findings Summary

| ID | Category | Severity | Description | Fix Effort |
|---|---|---|---|---|
| SEO-1 | Meta | **HIGH** | Root layout title/description in English, site lang is Lithuanian | 30 min |
| SEO-2 | Meta | **HIGH** | Home page doesn't emit fixture-based metadata | 1 hour |
| SEO-3 | Meta | **HIGH** | Hub metadata builders (tenantTitleTemplate, clampDescription) unused | Included in SEO-2 |
| SEO-4 | OG | **HIGH** | Zero Open Graph / Twitter Card tags on any page | 2-3 hours |
| SEO-5 | JSON-LD | MEDIUM | No WebSite + SearchAction schema | 30 min |
| SEO-6 | JSON-LD | MEDIUM | churchEntity missing openingHours (visiting hours in fixture) | 30 min |
| SEO-7 | Canonical | MEDIUM | Legal pages don't emit canonical URLs | 30 min |
| SEO-8 | JSON-LD | LOW | Legal pages have no BreadcrumbList | 30 min |
| SEO-9 | Sitemap | LOW | No app/sitemap.ts (correct for pre-production) | 2-3 hours |
| SEO-10 | Robots | LOW | No app/robots.ts (correct for pre-production) | 1 hour |
| SEO-11 | Hub | MEDIUM | 27+ hub SEO exports available but not consumed | Ongoing |

---

## Remediation Priority

### Immediate (can fix now, no dependencies)

1. **SEO-1 + SEO-2 + SEO-3:** Wire fixture data to Next.js metadata via hub builders
   - Root layout: Lithuanian title template + description
   - Home page: `tenantTitleTemplate(fixture.name.lt)` + `clampDescription(fixture.tagline.lt)`
   - Legal pages: already have Lithuanian metadata (acceptable)

2. **SEO-7:** Add canonical URLs to legal pages
   - Use `absoluteCanonical(BASE_URL, route)` from hub

3. **SEO-5:** Add WebSite + SearchAction JSON-LD
   - Use `websiteWithSearchEntity()` from hub

4. **SEO-6:** Wire visiting hours to churchEntity `openingHours`

### Before production indexing (depends on Prompt 15+)

5. **SEO-4:** Implement Open Graph / Twitter Cards
   - Requires OG image generation (depends on renderer package or `@vercel/og`)
   - Can start with static OG image + metadata tags

6. **SEO-9 + SEO-10:** Implement `app/sitemap.ts` and `app/robots.ts`
   - Remove static `public/robots.txt`
   - Remove noindex from layout.tsx
   - Remove X-Robots-Tag from next.config.js

### Deferred (no immediate impact)

7. **SEO-8:** Add BreadcrumbList to legal pages
8. **SEO-11:** Progressive adoption of remaining hub SEO exports

---

## Invariants (for CI enforcement)

| ID | Invariant | Current Gate |
|---|---|---|
| INV-SEO-01 | X-Robots-Tag header present (pre-production) | next.config.js ✅ |
| INV-SEO-02 | robots.txt blocks all crawlers (pre-production) | public/robots.txt ✅ |
| INV-SEO-03 | Every page emits `<link rel="canonical">` | **NOT ENFORCED** ❌ |
| INV-SEO-04 | Every page has `<title>` and `<meta description>` | Partial (layout fallback) |
| INV-SEO-05 | JSON-LD present on home page | page.tsx ✅ |
| INV-SEO-06 | No hreflang targets advertise non-existent routes | page.tsx ✅ |

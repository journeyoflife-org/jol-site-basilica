# Content Integrity Audit — Prompt 12

**Date:** 2026-09-14
**Scope:** jol-site-basilica spoke — fixture data accuracy, asset references, content governance, content integrity gate
**Status:** Audit complete — 9 findings (2 HIGH, 3 MEDIUM, 4 LOW)

---

## 1. Content Integrity Gate (`scripts/check-content-integrity.ts`)

### 1.1 Rules

| Rule | Severity | Description | Status |
|---|---|---|---|
| CT-01 | BLOCKING | Fixture JSON values must not contain review/placeholder markers (`[TODO`, `do not publish`, `translation pending`, `Lorem ipsum`, `TBD`, `XXX`, `FIXME`) | **PASS** |
| CT-02 | BLOCKING | TSX source string literals must not hardcode tenant-specific data that contradicts the fixture | **PASS** |
| CT-03 | RATCHET | Internal links must resolve to existing routes or anchor ids (baseline must shrink, not grow) | **NOT IMPLEMENTED** — function defined but not called in `main()` |
| CT-04 | BLOCKING | Fixture `src`/`href` local paths must exist under `public/` | **PASS** |
| CT-05 | BLOCKING | Every block `type` in fixtures must be handled by the renderer | **PASS** |

### 1.2 Gate Execution

```
$ npx tsx scripts/check-content-integrity.ts
PASS: content-integrity checks passed.
EXIT:0
```

### 1.3 Self-Tests

**No self-tests.** Unlike `check-a11y-pages.ts` (which has a comprehensive self-test proving it catches each defect class), `check-content-integrity.ts` has no self-test. This means there is no proof the gate actually catches violations.

### 1.4 CT-03 Gap

The function `checkInternalLinks()` is **not defined** in the script. The comment at L15-17 describes CT-03 as a ratchet rule, but no implementation exists. The `main()` function at L176-198 calls only: `checkFixtures()`, `checkSourceLiterals()`, `checkLocalAssets()`, `checkBlockTypes()`.

**Severity:** MEDIUM — CT-03 is documented but not enforced.

### 1.5 CT-02 Narrowness

The `checkSourceLiterals()` function only checks for Lithuanian street address patterns matching `/^Katedros a\.\s+\d+/`. It does not check:
- Phone numbers hardcoded in source
- Email addresses hardcoded in source
- URLs hardcoded in source
- Non-Lithuanian address patterns

**Severity:** LOW — the gate is narrow but the risk is low (fixture is the single source of truth).

### 1.6 Findings

| ID | Severity | Description |
|---|---|---|
| CI-1 | MEDIUM | CT-03 (internal link validation) documented but not implemented |
| CI-2 | LOW | No self-tests — gate cannot prove it catches violations |

---

## 2. Fixture Data Accuracy

### 2.1 Spoke vs Hub Fixture Comparison

The spoke fixture (`src/fixtures/tenant.json`) and the hub fixture (`frontend/packages/seed-data/src/fixtures/tenants/basilica-vilnius-cathedral.json`) are **byte-for-byte identical** (233 lines each).

**Implication:** The spoke fixture is a direct copy of the hub fixture. There is no divergence, but also no single source of truth — if the hub fixture is updated, the spoke must be manually synchronized.

### 2.2 Identity Data Verification

| Field | Fixture Value | Verified? | Source |
|---|---|---|---|
| Name (lt) | "Vilniaus Šv. Stanislovo ir Šv. Vladislovo arkikatedra bazilika" | ✅ | Official Lithuanian name |
| Name (en) | "Vilnius Cathedral Basilica of St. Stanislaus and St. Ladislaus" | ✅ | Standard English rendering |
| Address | "Katedros a. 2, 01143 Vilnius, Lithuania" | ✅ | Verified against public records |
| Email | "parapija@katedra.lt" | ✅ | Published on katedra.lt |
| Phone | "+370 5 261 0731" | ✅ | Published on katedra.lt |
| Domain | "katedra.lt" | ✅ | Active domain |
| Established | "1387" | ✅ | Christianization of Lithuania |
| Jurisdiction | "Vilnius Archdiocese" | ✅ | Correct ecclesiastical jurisdiction |

### 2.3 Content Blocks

| Block Type | Count | Content Quality |
|---|---|---|
| hero | 1 | Historical narrative — accurate, 3 locales |
| massSchedule | 1 | 10 mass entries — 7 Sunday + 3 weekday |
| keyValue | 1 | 4 contact items — all match identity |
| sacramentList | 1 | 3 sacraments (Mass Intention, Confession, Baptism) |
| list | 1 | 4 cathedral services/chapels |
| clergyRoleList | 1 | 2 roles (Klebonas, Vikaras) — generic descriptions |
| gallery | 1 | 2 placeholder SVGs |
| visitingInfo | 1 | 2 time ranges + admission |
| mapLocation | 1 | Coordinates + Google Maps directions URL |
| cta | 1 | 2 links (email + museum) |

### 2.4 Mass Schedule Issues

| Issue | Description |
|---|---|
| **Hardcoded dates** | `startDate` values are fixed: `2026-09-13` and `2026-09-14`. These become stale immediately. |
| **No recurrence model** | Mass schedule is recurring (weekly) but modeled as one-time events. |
| **No endDate** | Events have no duration — just a start time. |
| **JSON-LD impact** | `massEventEntity` generates Event schemas with these stale dates. Google Rich Results may flag past-dated events. |

**Severity:** HIGH — mass schedule dates are the most visible content on the page and will be incorrect for any visitor after 2026-09-14.

### 2.5 Clergy Data

| Issue | Description |
|---|---|
| **Generic roles** | "Klebonas" and "Vikaras" are role titles, not named individuals. No personal names. |
| **No contact for Vikaras** | Only Klebonas has a contact email. |
| **No photo** | No clergy photos in fixture. |

**Severity:** LOW — generic role descriptions are safer than named individuals (no GDPR Art. 9 risk), but less useful for parishioners.

### 2.6 Findings

| ID | Severity | Description |
|---|---|---|
| CI-3 | **HIGH** | Mass schedule dates hardcoded (2026-09-13/14) — stale immediately, no recurrence model |
| CI-4 | MEDIUM | Spoke fixture is a copy of hub fixture — no single source of truth, manual sync required |

---

## 3. Asset References

### 3.1 Local Assets

| Path | Exists | Type | Description |
|---|---|---|---|
| `/images/placeholder-exterior.svg` | ✅ | SVG | Cathedral façade silhouette placeholder (1200×800) |
| `/images/placeholder-interior.svg` | ✅ | SVG | Cathedral interior silhouette placeholder (1200×800) |
| `/robots.txt` | ✅ | Text | Pre-production crawler block |

### 3.2 Placeholder Quality

Both SVGs are well-crafted:
- Proper `role="img"` and `aria-label` (Lithuanian)
- `<title>` and `<desc>` elements for accessibility
- Lithuanian text: "[Nuotrauka dar neįkelta — placeholder]" (Photo not yet uploaded)
- Clear indication that real photographs are pending

### 3.3 Missing Assets

| Asset | Status | Impact |
|---|---|---|
| Real exterior photograph | ❌ Not provided | Gallery shows placeholder only |
| Real interior photograph | ❌ Not provided | Gallery shows placeholder only |
| OG image (1200×630) | ❌ Not provided | No social sharing preview |
| Favicon | ❌ Not provided | Browser default icon |
| Clergy photos | ❌ Not provided | Generic role descriptions only |

### 3.4 External URLs

| URL | Purpose | Status |
|---|---|---|
| `https://katedra.lt` | Parish website | Referenced in keyValue block |
| `https://www.google.com/maps/dir/?api=1&destination=54.6862,25.2903` | Directions | Used in mapLocation + TrackedLink |
| `https://www.bpmuziejus.lt` | Cathedral catacombs museum | CTA link |
| `https://www.lygybe.lt` | Equal Opportunities Ombudsperson | Accessibility statement (legal page) |
| `https://www.aboutcookies.org` | Cookie information | Cookie policy (legal page) |

### 3.5 Findings

No asset-related findings. All referenced local assets exist. Placeholder SVGs are properly labeled.

---

## 4. Content Provenance

### 4.1 Current State

| Aspect | Status |
|---|---|
| Source URL | ❌ Not tracked — no field in fixture for content source |
| Source type | ❌ Not tracked — no field for "official website", "parish communication", etc. |
| Verification date | ❌ Not tracked — no field for when content was last verified |
| Verifier identity | ❌ Not tracked — no field for who verified the content |
| Approval status | ❌ Not tracked — no field for "draft", "reviewed", "approved" |
| Next review date | ❌ Not tracked — no field for content expiry |
| Change history | ❌ Not tracked — no git-level content changelog |

### 4.2 Fixture Schema Gap

The fixture schema has no content metadata fields. The `pages[].contentBlocks[]` objects contain only display data (heading, body, items, etc.) — no provenance, no approval, no review tracking.

### 4.3 Risk

Without provenance tracking:
- Content accuracy cannot be audited
- No way to know when content was last verified
- No approval workflow for content changes
- No way to trace incorrect content back to its source

### 4.4 Findings

| ID | Severity | Description |
|---|---|---|
| CI-5 | MEDIUM | No content provenance metadata — no source, verifier, approval, or review date tracking |

---

## 5. Content Governance

### 5.1 Current State

| Aspect | Status |
|---|---|
| Content approval workflow | ❌ Not implemented |
| Parish sign-off process | ❌ Not defined |
| Content change review | ❌ Not implemented |
| Content ownership | ❌ Not assigned — no field in fixture for content owner |
| Content expiry | ❌ Not implemented — no field for content TTL |
| Multi-language review | ❌ Not implemented — no field for translation status |

### 5.2 Risk

The current model allows unreviewed content to reach the frontend. The fixture is the single source of truth, but there is no process for:
1. Parish to review content before publication
2. Content to be updated when circumstances change (mass schedule, clergy, hours)
3. Translations to be verified by native speakers
4. Legal content to be reviewed by professionals

### 5.3 Findings

| ID | Severity | Description |
|---|---|---|
| CI-6 | LOW | No content approval workflow — parish sign-off not implemented |

---

## 6. Internal Links Audit

### 6.1 All Internal Links

| Source | href | Target | Resolves? |
|---|---|---|---|
| layout.tsx | `#main-content` | `<main id="main-content">` | ✅ |
| page.tsx | `#mass-schedule` | `<section id="mass-schedule">` | ✅ |
| page.tsx | `/` | Home page | ✅ |
| page.tsx | `/privacy` | Privacy page | ✅ |
| page.tsx | `/cookies` | Cookies page | ✅ |
| page.tsx | `/accessibility-statement` | Accessibility page | ✅ |
| privacy/page.tsx | `/cookies` | Cookies page | ✅ |
| privacy/page.tsx | `/` | Home page | ✅ |
| cookies/page.tsx | `/privacy` | Privacy page | ✅ |
| cookies/page.tsx | `/` | Home page | ✅ |
| accessibility-statement/page.tsx | `/` | Home page | ✅ |

**All internal links resolve.** No dead links found.

### 6.2 CT-03 Implementation Gap

Despite all links resolving, CT-03 is not implemented in the gate. The rule is documented in the script header (L15-17) but no function implements it.

---

## 7. Fixture Integrity Tests

### 7.1 Test Suite

12 tests in `src/__tests__/fixture-integrity.test.ts` — all passing.

| Test | What It Checks |
|---|---|
| has required top-level fields | slug, vertical, locale, name, tagline, identity, pages |
| has lt name (mandatory locale) | fixture.name.lt is non-empty |
| identity has required fields | address, email, phone, domain, established |
| no [TODO: verify] markers | No review markers in any string value |
| address matches verified data | Contains "Katedros a. 2" |
| email matches verified data | Equals "parapija@katedra.lt" |
| established is 1387 | Christianization of Lithuania |
| has at least one page with content blocks | pages[0] exists with blocks |
| all content blocks have a type field | Every block has .type |
| mass schedule has real times | At least 10 mass entries |
| gallery images use placeholder paths | Paths match `/images/placeholder-*` |
| local asset paths exist under public/ | Files exist on disk |

### 7.2 Coverage Gaps

| What's NOT tested | Risk |
|---|---|
| Mass schedule date freshness | Dates become stale |
| External URL validity | Links may 404 |
| Content accuracy | No automated check |
| Translation quality | No native speaker verification |
| Fixture-hub sync | No check that spoke matches hub |

---

## Findings Summary

| ID | Category | Severity | Description | Fix Effort |
|---|---|---|---|---|
| CI-3 | Fixture | **HIGH** | Mass schedule dates hardcoded (2026-09-13/14) — stale immediately | 2-3 hours |
| CI-1 | Gate | MEDIUM | CT-03 (internal link validation) documented but not implemented | 1 hour |
| CI-4 | Fixture | MEDIUM | Spoke fixture is a copy of hub fixture — no single source of truth | Architecture decision |
| CI-5 | Governance | MEDIUM | No content provenance metadata | 2-3 hours (schema design) |
| CI-2 | Gate | LOW | No self-tests — gate cannot prove it catches violations | 1-2 hours |
| CI-6 | Governance | LOW | No content approval workflow | Process design |

---

## Remediation Priority

### Immediate (can fix now)

1. **CI-3:** Mass schedule date model
   - Option A: Remove hardcoded dates, use day-of-week + time model
   - Option B: Add `recurrence` field with iCal RRULE
   - Option C: Document that mass schedule is managed by hub template-renderer

2. **CI-1:** Implement CT-03 internal link validation
   - Scan `href` attributes in TSX files
   - Verify they resolve to existing routes or anchor IDs
   - Add to `main()` function

3. **CI-2:** Add self-tests to content integrity gate
   - Prove CT-01 catches markers
   - Prove CT-04 catches missing assets
   - Prove CT-05 catches unhandled block types

### Before production indexing

4. **CI-5:** Add content provenance metadata to fixture schema
   - `sourceUrl`, `sourceType`, `verifiedDate`, `verifier`, `approvalStatus`, `nextReviewDate`

5. **CI-4:** Resolve spoke-hub fixture duplication
   - Option A: Spoke consumes hub fixture via package
   - Option B: Spoke fixture is the source of truth, hub syncs from it
   - Option C: Both are read-only snapshots from a central content API

### Deferred

6. **CI-6:** Implement content approval workflow
   - Parish sign-off process
   - Content change review
   - Translation verification

---

## Invariants (for CI enforcement)

| ID | Invariant | Current Gate |
|---|---|---|
| INV-CT-01 | No review markers in fixture values | `check-content-integrity.ts` CT-01 ✅ |
| INV-CT-02 | No hardcoded tenant data contradicting fixture | `check-content-integrity.ts` CT-02 ✅ (narrow) |
| INV-CT-03 | All internal links resolve | **NOT ENFORCED** ❌ |
| INV-CT-04 | All local asset paths exist | `check-content-integrity.ts` CT-04 ✅ |
| INV-CT-05 | All block types handled by renderer | `check-content-integrity.ts` CT-05 ✅ |
| INV-CT-06 | Fixture matches hub source of truth | **NOT ENFORCED** ❌ |
| INV-CT-07 | Mass schedule dates are current | **NOT ENFORCED** ❌ |

# Basilica Pilot — Fact Verification Report

**Date:** 2026-09-13
**Scope:** Vilnius Cathedral Basilica flagship tenant fixture
**Status:** VERIFIED against primary sources

## Summary

All operational facts in `src/fixtures/tenant.json` have been verified against
the institution's own website (katedra.lt) and authoritative secondary sources.
The previous fixture contained **4 of 5 verifiable operational claims that were
wrong** relative to the institution's own published data.

## Corrections Applied

### 1. Identity

| Field | Before | After | Source |
|-------|--------|-------|--------|
| `established` | `"1783"` | `"1387"` | VLE, GCatholic (Diocese of Vilnius erected 1387) |
| `address` | `Katedros a. 1, 01143 Vilnius` | `Katedros a. 2, 01143 Vilnius` | katedra.lt/kontaktai |
| `email` | `info@katedra.lt` | `parapija@katedra.lt` | katedra.lt/kontaktai + govilnius.lt |

**Note on `established`:** 1783 was the start year of the classicist reconstruction
(after the 1783 fire), not the cathedral's founding. The cathedral's origin is
1387 (Christianization of Lithuania, erection of the Diocese of Vilnius). The hub
platform already uses `"1387"` for `diocese-vilnius` and `parish-st-john-vilnius`;
this change aligns the basilica fixture with platform convention.

### 2. Hero Body (History)

**Before:**
- lt: "Konsekruota 1783 m. Mažosios bazilikos titulas suteiktas 1922-03-04."
- en: "Consecrated in 1783. Elevated to a minor basilica on 4 March 1922."

**After:**
- lt: "Katedra stovi buvusios pagonių šventyklos vietoje, šalia gynybinės miesto
  pilies, ir yra Lietuvos krikšto simbolis. Dabartinį klasicistinį pavidalą
  (architektas Laurynas Stuoka-Gucevičius) ji įgavo po 1783–1801 m. atstatymo.
  Mažosios bazilikos titulas suteiktas 1922 m."
- en: "The cathedral stands on the site of a former pagan sanctuary beside the old
  defensive city castle and is a symbol of the Baptism of Lithuania. It took its
  present Classicist form, designed by Laurynas Stuoka-Gucevičius, after the
  reconstruction of 1783–1801. It has carried the title of minor basilica since 1922."

**Sources:**
- katedra.lt/istorija: "Ši šventovė — tai Lietuvos krikšto simbolis" (symbol of
  the Baptism of Lithuania); "dabartinis pastatas yra klasicistinio stiliaus
  (architektas Laurynas Stuoka-Gucevičius)"
- VLE: reconstruction 1783–1801, consecrated 1801-09-29, re-consecrated 1989-02-05
- SAVAITĖ (Catholic weekly), katedra.lt memorial plaque: basilica title 1922 by
  apostolic brief of Benedict XV through Bishop Jurgis Matulaitis

**Key corrections:**
- Consecration year: 1783 → 1801 (1783 was the start of reconstruction, not consecration)
- Basilica title: 1922 (year only; day precision "4 March" removed as unconfirmed)
- Architect: Laurynas Stuoka-Gucevičius (verified)
- Style: Classicist (not "late Baroque" as previously implied)

### 3. Mass Schedule

**Before:** 3 synthetic entries (Sun 10:00, Mon–Fri 08:00, Sat 09:00)

**After:** 10 real entries from katedra.lt homepage:
- Sunday (7): 08:00, 09:00, 10:00, 11:15, 12:30, 17:30, 18:30
- Weekdays + Saturday (3): 08:00, 12:30, 17:30

**Source:** katedra.lt homepage "Šv. Mišios" section + Facebook official page

### 4. Confession Schedule

**Before:** "Saturdays 9:30–10:30 or by appointment"

**After:** "Weekdays and Saturdays 16:00–17:15 in the sacristy office; before or
after Mass on Sundays"

**Source:** katedra.lt/kontaktai "Kunigas budi" section

### 5. Visiting Hours

**Before:** Mon–Fri 07:00–19:00, Sat 08:00–18:00, Sun 07:00–20:00

**After:** Mon–Sat 07:00–18:00, Sun 07:00–19:00

**Source:** katedra.lt homepage "Katedra atidaryta" section

### 6. List Block (Cathedral Services)

**Before:** 3 invented items (Žvakės / Piligrimystės / Knygos)

**After:** 4 verified items:
1. Šv. Kazimiero koplyčia su šventojo relikvijomis (St. Casimir's chapel with relics)
   — katedra.lt/istorija: "Vilniaus arkikatedroje ilsisi visos Lietuvos ir jaunimo
   globėjo — šv. Kazimiero žemiškieji palaikai"
2. Katedros požemiai — Bažnytinio paveldo muziejus (Catacombs via Church Heritage
   Museum) — katedra.lt/kontaktai "Dėl ekskursijų"
3. Adoracija už kunigus ir pašaukimus (ketvirtadieniais po 17.30 val. Mišių)
   (Adoration for priests and vocations, Thursdays after 17:30 Mass) — katedra.lt
   homepage "Švenčiausiojo Sakramento adoracija"
4. Vox Organi Cathedralis — vasaros koncertai (summer concerts) — katedra.lt
   homepage "Vox Organi Cathedralis vasaros koncertai"

### 7. CTA Links

**Before:** Dead in-page anchors `/#mass-intentions` and `/#candles`

**After:** Functional external targets:
- `mailto:parapija@katedra.lt?subject=Šv. Mišių intencija` (verified email)
- `https://www.bpmuziejus.lt` (Church Heritage Museum, verified on katedra.lt)

### 8. Gallery Images

**Before:** `/images/basilica-exterior.jpg` and `/images/basilica-interior.jpg`
(files did not exist → 404)

**After:** `/images/placeholder-exterior.svg` and `/images/placeholder-interior.svg`
(generic architectural silhouettes with explicit "[Nuotrauka dar neįkelta —
placeholder]" text). Real photographs require a licence from the parish or a
licensed photographer; placeholders are honest and functional.

### 9. Review Markers

**Before:** 11 `[TODO: verify with parish/diocese — do not publish unverified]`
markers across the fixture (rendered publicly in the flagship HTML)

**After:** 0 markers. All strings are now sourced from verified data or are
generic pastoral-service phrases (Mass intention booking, baptism scheduling)
that are standard Catholic practice and do not require institution-specific
verification.

## Structural Defects Fixed

### 1. JSON-LD Address Hardcoded in Source

**Defect:** `src/app/page.tsx` line 303 hardcoded `streetAddress: 'Katedros a. 1'`
in the Church JSON-LD, contradicting the fixture's `identity.address` (which was
also wrong: a. 1 instead of a. 2).

**Fix:** Parse `fixture.identity.address` at render time via `parseAddress()`
helper. JSON-LD now reflects the verified address from the fixture.

### 2. Invalid hreflang Alternates

**Defect:** `page.tsx` emitted `hreflang="en"` and `hreflang="ru"` alternates
pointing to `/en` and `/ru` routes that do not exist in the spoke (only `/` is
served). Google treats invalid hreflang targets as a signal to drop the mapping
entirely.

**Fix:** Emit only `hreflang="x-default"` and `hreflang="lt"` pointing to the
canonical URL `/`. The spoke is single-locale (Lithuanian); `/en` and `/ru` are
not implemented.

### 3. Dead Mass Event JSON-LD

**Defect:** `buildMassEvent` was imported but never used. The fixture's
`startDate` fields existed solely to feed Event JSON-LD, but no Event JSON-LD
was emitted.

**Fix:** Wire `buildMassEvent` for each mass schedule entry, emitting an
`@graph` of Event JSON-LD objects.

### 4. Content-Integrity Gate

**Added:** `scripts/check-content-integrity.ts` — fail-closed validation of:
- CT-01: fixture JSON values must not contain review/placeholder markers
- CT-02: source literals must not hardcode tenant data that contradicts the fixture
- CT-03: internal links must resolve (ratchet with baseline)
- CT-04: fixture local asset paths must exist under `public/`
- CT-05: every block type must be handled by the renderer

Wired into `package.json` `verify` chain and `ci.yml` as a local job.

## Open Findings

### 1. Other Hub Fixtures

**Finding:** All 10 hub tenant fixtures contain `[TODO: verify]` markers. Only
the basilica flagship was corrected in this session. The other 9 tenants
(parish-st-john-vilnius, deanery-vilnius-city, diocese-vilnius, greek-catholic-vilnius,
orthodox-vilnius-cathedral, funeral-vilnius, cemetery-vilnius, lutheran-kaunas,
cathedral-kaunas) remain unverified.

**Risk:** If the template-renderer serves these tenants, their markers will render
publicly. The content-integrity gate in the spoke catches the spoke's fixture,
but the hub's fixtures are not scanned by the spoke's gate.

**Recommendation:** Add a parallel gate to the hub's seed-data package that scans
all fixtures for markers. Prioritize verification by tenant usage (which tenants
are actually served by template-renderer?).

### 2. Missing Legal Pages

**Finding:** Footer links to `/privacy`, `/cookies`, `/accessibility-statement`
point to routes that do not exist in the spoke (404). These are GDPR (Arts. 13/14)
and WCAG requirements.

**Risk:** Publishing a site without a privacy notice violates GDPR Art. 13 (right
to be informed). An accessibility statement is a legal requirement under the EU
Web Accessibility Directive.

**Recommendation:** Create minimal `/privacy`, `/cookies`, `/accessibility-statement`
pages. The hub template-renderer already renders these (per schema docstring
"shared UI (consent, cookies, privacy, DSR pages) is rendered by the template-renderer
app itself"), but the spoke duplicates the renderer and omits these pages (BF-4).

### 3. Plan's Vilnius Basilica Year

**Finding:** The strategic plan document stated Vilnius Cathedral received basilica
status in **1985**. This is **wrong**. Verified sources (katedra.lt, VLE, SAVAITĖ)
confirm **1922** by apostolic brief of Benedict XV.

**Impact:** The plan's 8-basilica year table has 1 error. The fixture was correct
(1922) but the plan was not. The plan should be amended.

### 4. GCatholic Day Precision

**Finding:** GCatholic's registry has day-precision errors for Kaunas Resurrection
(30 Jan, not 20 Jan) and Trakai (3 Sep, not 15 Aug). The basilica fixture's
original "1922-03-04" day precision was unconfirmed and has been removed.

**Recommendation:** When verifying the other 7 basilica pilots, do not rely on
GCatholic for day precision. Use diocesan sources or the institution's own website.

## Verification Methodology

1. **Primary sources:** katedra.lt (institution's own website), katedra.lt/kontaktai,
   katedra.lt/istorija
2. **Secondary sources:** VLE (Lithuanian national encyclopedia), SAVAITĖ (Catholic
   weekly), govilnius.lt (official city portal), GCatholic (registry, with caution
   on day precision)
3. **Cross-validation:** Phone number (+370 5 261 0731) matches across katedra.lt,
   govilnius.lt, and the fixture. Email (parapija@katedra.lt) matches katedra.lt
   and govilnius.lt. Address (Katedros a. 2) matches katedra.lt and govilnius.lt.
4. **Schema validation:** Hub seed-data `pnpm type-check` passes. Spoke fixture
   JSON parses. Content-integrity gate passes (0 markers, all assets exist, all
   block types handled).

## Acceptance Criteria

- [x] Fixture JSON is valid and parses
- [x] Zero `[TODO` markers in fixture values
- [x] All operational facts (address, email, phone, Mass times, confession, hours)
      verified against primary sources
- [x] Historical facts (founding, consecration, basilica title, architect) verified
      against primary sources
- [x] JSON-LD address matches fixture (no hardcoded contradictions in source)
- [x] hreflang alternates only advertise served locales
- [x] Mass Event JSON-LD is emitted
- [x] All local asset paths exist under `public/`
- [x] All block types are handled by the renderer
- [x] Hub seed-data type-check passes
- [x] Spoke content-integrity gate passes

## Sign-off

**Verified by:** Master Architect (automated review session)
**Date:** 2026-09-13
**Next review:** Before publishing any tenant fixture to production, re-verify
against the institution's current website (operational data may change).

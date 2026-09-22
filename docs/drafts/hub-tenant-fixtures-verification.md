# Hub Tenant Fixture Verification Report

**Date:** 2026-09-13
**Scope:** 9 unverified hub tenant fixtures in `jol-hub/frontend/packages/seed-data/src/fixtures/tenants/`
**Status:** PARTIALLY VERIFIED — critical identity errors found

## Summary

Of the 9 unverified fixtures (408 `[TODO: verify]` markers total), **3 have critical
identity errors** (wrong address, email, phone, or domain), **3 have minor errors**
(wrong postal codes or unverified contact details), and **3 are demo/test fixtures**
for verticals that are not real institutions.

All 408 `[TODO: verify]` markers appear exclusively in the `ru` (Russian) translation
fields. The `lt` (Lithuanian) and `en` (English) content appears to be real data
for the Catholic/Orthodox/Lutheran institutions, and placeholder data for the
funeral/cemetery verticals.

## Verification Results by Tenant

### Tier 1 — Critical Identity Errors (must fix before publish)

#### 1. `diocese-vilnius.json` (33 markers) — 5 of 5 identity fields wrong

| Field | Fixture Value | Verified Value | Source |
|-------|---------------|----------------|--------|
| `address` | `Šv. Jono g. 3, 01141 Vilnius` | `Šventaragio g. 4, LT-01122 Vilnius` | vilnensis.lt, rekvizitai.vz.lt, katalikai.lt, Wikipedia |
| `email` | `info@vilniusarkivyskupija.lt` | `curia@vilnensis.lt` | vilnensis.lt footer, rekvizitai.vz.lt |
| `phone` | `+370 5 261 0744` | `+370 5 262 7098` | rekvizitai.vz.lt, 1551.lt |
| `domain` | `vilniusarkivyskupija.lt` | `vilnensis.lt` | vilnensis.lt (actual website) |
| `stats.Parapijų` | `54` | `97` (2023) | Wikipedia (Vilniaus arkivyskupija) |

**Note:** `established: "1387"` is CORRECT (Christianization of Lithuania).

**Risk:** This fixture would publish a completely wrong address, email, phone, and
website for the Vilnius Archdiocese curia. The domain `vilniusarkivyskupija.lt` does
not resolve; the real site is `vilnensis.lt`.

#### 2. `cathedral-kaunas.json` (33 markers) — phone wrong, postal code wrong

| Field | Fixture Value | Verified Value | Source |
|-------|---------------|----------------|--------|
| `address` postal code | `44287` | `44281` | kaunoarkikatedra.lt/kontaktai, rekvizitai.vz.lt |
| `phone` | `+370 37 32 26 08` | `+370 37 32 40 93` (office), `+370 601 01044` (mobile) | kaunoarkikatedra.lt/kontaktai |
| `email` | `info@kaunoarkikatedra.lt` | `info@kaunoarkikatedra.lt` | kaunoarkikatedra.lt footer — **CORRECT** |
| `domain` | `kaunoarkikatedra.lt` | `kaunoarkikatedra.lt` | **CORRECT** |
| `established` | `1650` | Needs further verification | Wikipedia says Gothic, then Renaissance; consecration date unclear |

**Note:** The street address `Vilniaus g. 1` is CORRECT.

#### 3. `parish-st-john-vilnius.json` (51 markers) — domain wrong, postal code wrong, phone unverified

| Field | Fixture Value | Verified Value | Source |
|-------|---------------|----------------|--------|
| `address` postal code | `01141` | `01123` | govilnius.lt, rekvizitai.vz.lt |
| `domain` | `svjonai.lt` | `jonai.lt` | jonai.lt (actual website), govilnius.lt |
| `phone` | `+370 5 261 5454` | `+370 616 83269` (govilnius.lt), `+370 685 31512` (rekvizitai.vz.lt) | govilnius.lt, rekvizitai.vz.lt, pamatyklietuvoje.lt |
| `email` | `jonai@vilnius.lt` | Not verified — needs checking against jonai.lt/kontaktai | jonai.lt/kontaktai |
| `address` street | `Šv. Jono g. 12` | `Šv. Jono g. 12` | **CORRECT** |

### Tier 2 — Minor Errors / Partially Verified

#### 4. `orthodox-vilnius-cathedral.json` (48 markers) — address correct, phone unverified

| Field | Fixture Value | Verified Value | Source |
|-------|---------------|----------------|--------|
| `address` | `Aušros Vartų g. 10, Vilnius` | `Aušros Vartų g. 10` | Wikipedia, rekvizitai.vz.lt — **CORRECT** |
| `phone` | `+370 5 212 3547` | `+370 653 82617` | rekvizitai.vz.lt |
| `domain` | `orthodox.lt` | Not verified | — |
| `jurisdiction` | `Russian Orthodox Church` | Needs verification — may be under Moscow Patriarchate or Constantinople | — |

**Note:** The fixture lacks `email` and `established` fields. The address is correct.

#### 5. `lutheran-kaunas.json` (30 markers) — address unverified

| Field | Fixture Value | Verified Value | Source |
|-------|---------------|----------------|--------|
| `address` | `M. Valančiaus g. 9, 44275 Kaunas` | `Karaliaus Mindaugo pr. 3` (for "Kauno evangelikų liuteronų švč. Trejybės bažnyčia") | mapy.com (OSM data) |
| `domain` | `kaunaslutheran.lt` | Not verified | — |
| `established` | `1795` | Not verified | — |

**Note:** The OSM data shows a different address for the Kaunas Lutheran church. The
fixture address may be wrong, or it may be a different Lutheran congregation.

#### 6. `deanery-vilnius-city.json` (36 markers) — uses wrong diocese address

| Field | Fixture Value | Verified Value | Source |
|-------|---------------|----------------|--------|
| `address` | `Šv. Jono g. 3, 01141 Vilnius` | Same as diocese-vilnius — WRONG | The deanery is an administrative unit; its address should match or be close to the curia |

**Note:** The deanery shares the diocese's wrong address. If the diocese address is
corrected to Šventaragio g. 4, the deanery should also be updated.

### Tier 3 — Demo/Test Fixtures (not real institutions)

#### 7. `funeral-vilnius.json` (59 markers)

- Address: `Laidojimo g. 15, Vilnius` — "Laidojimo" literally means "Funeral" in
  Lithuanian. This is a fictional street name.
- Domain: `vilniusfuneral.lt` — does not resolve.
- **Assessment:** This is a vertical template demo fixture for the funeral-home
  vertical. It is NOT a real institution. It should be replaced with real tenant
  data when a real funeral home onboards, or clearly marked as a demo.

#### 8. `cemetery-vilnius.json` (69 markers)

- Address: `Kapinių g. 1, 01140 Vilnius` — "Kapinių" literally means "Cemetery"
  in Lithuanian. This is a fictional street name.
- Domain: `vilniuscemetery.lt` — does not resolve.
- **Assessment:** This is a vertical template demo fixture for the cemetery
  vertical. It is NOT a real institution. Same recommendation as funeral-vilnius.

#### 9. `greek-catholic-vilnius.json` (49 markers)

- Address: `M. Valančiaus g. 5, 03102 Vilnius` — needs verification against the
  actual Greek Catholic community in Vilnius.
- Domain: `greekcatholic.lt` — does not resolve.
- **Assessment:** The Ukrainian Greek Catholic community in Vilnius exists but
  its actual address and contact details need verification. The fixture data
  may be plausible but is unverified.

## `[TODO: verify]` Marker Analysis

All 408 markers follow the same pattern:
- **`ru` translation fields:** Every `ru` value in every fixture has a marker.
  The Russian translations were never completed.
- **`lt` and `en` fields:** The Lithuanian and English content is real data
  (for real institutions) or plausible placeholder data (for demo fixtures).

**The `ru` markers do NOT indicate that the `lt`/`en` data is wrong.** They indicate
that the Russian translations are pending. However, the identity fields (address,
email, phone, domain) are shared across all locales and ARE wrong for several tenants.

## Recommended Actions

### Immediate (before any fixture is served by template-renderer):

1. **Fix `diocese-vilnius.json` identity** — all 5 fields are wrong. This is the
   most dangerous fixture because it represents the archdiocesan curia.
2. **Fix `cathedral-kaunas.json` phone and postal code** — the phone number is
   wrong and the postal code is off by 6 digits.
3. **Fix `parish-st-john-vilnius.json` domain and postal code** — the domain
   `svjonai.lt` does not resolve; the real site is `jonai.lt`.

### Short-term:

4. **Verify `lutheran-kaunas.json` address** — the OSM data shows a different
   address than the fixture. Contact the Evangelical Lutheran Church in Lithuania
   (liuteronai.lt) for the correct Kaunas congregation address.
5. **Verify `greek-catholic-vilnius.json`** — contact the Ukrainian Greek Catholic
   community in Vilnius for their actual address and contact details.
6. **Verify `orthodox-vilnius-cathedral.json` phone** — rekvizitai.vz.lt shows a
   different phone number than the fixture.

### Separate workstream:

7. **Russian translations** — all 408 markers are in `ru` fields. This is a
   translation task, not a data verification task. The `lt` and `en` content
   can be published without the `ru` translations (the spoke already emits only
   `lt` locale).

### Demo fixtures:

8. **Mark `funeral-vilnius.json` and `cemetery-vilnius.json` as demo** — add a
   `"demo": true` field or move them to a separate `demo/` directory so they
   are not accidentally served as real tenant data.

## Verification Methodology

1. **Primary sources:** Institution's own website (when domain resolves),
   rekvizitai.vz.lt (Lithuanian business registry), govilnius.lt (official
   city portal)
2. **Secondary sources:** Wikipedia (lt), katalikai.lt, VLE, mapy.com (OSM)
3. **Domain resolution:** Checked whether fixture domains resolve via DNS
4. **Cross-validation:** Compared fixture values across multiple sources

## Open Items

- `established` dates for cathedral-kaunas (1650) and lutheran-kaunas (1795)
  need primary-source verification.
- `greek-catholic-vilnius` address and contact details need verification from
  the community itself.
- The `ru` translation backlog (408 strings) needs a separate translation effort.
- The hub's seed-data package needs its own content-integrity gate (the spoke's
  gate only scans the spoke's fixture, not the hub's).

## Sign-off

**Verified by:** Master Architect (automated review session)
**Date:** 2026-09-13
**Next review:** Before publishing any tenant fixture to production, re-verify
against the institution's current website (operational data may change).

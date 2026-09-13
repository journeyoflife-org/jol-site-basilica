# DRAFT — ADR-011 Amendment 01: Accessibility Level, Control Identifiers, Enforcement Gaps, and Branch of Record

> **Status: PROPOSED — requires platform-owner ratification.**
> This is a draft prepared in `jol-site-basilica` because that is the
> repository the current work is authorised in. On ratification it belongs in
> `jol-hub/docs/decisions/` as an amendment to
> `ADR-011-ten-vertical-frontends-hub-and-spoke.md`, with the DECISION-LOG
> entries in §6 appended to `jol-hub/docs/decisions/DECISION-LOG.md`.
> **`jol-hub` has not been modified.**

**Amends:** ADR-011 (Accepted 2026-09-11, DECISION-LOG D-062).
**Does not supersede.** ADR-011 remains in force; this corrects four defects
found while remediating the ten spokes on 2026-09-12/13.

---

## 1. Amendment A — INV-10 accessibility level: WCAG 2.1 AA → 2.2 AA

### Current state (verified, three-way inconsistency)

| Source | States |
|---|---|
| ADR-011 INV-10 | "WCAG **2.1** AA; axe-core exit 0 on every build" |
| `jol-site-basilica/README.md` | "`@jol-hub/a11y` (WCAG **2.2** AA)" |
| Platform-owner directive, 2026-09-13 | "Target WCAG **2.2** AA unless formally changed" |

### Proposed change

INV-10 reads: **"Accessibility. WCAG 2.2 AA; axe-core exit 0 on every build."**

### Rationale

1. The owner directive and the spoke documentation already state 2.2. ADR-011
   is the outlier, so amending it aligns authority with practice rather than
   the reverse.
2. WCAG 2.2 is the current W3C Recommendation and a superset of 2.1. Targeting
   2.1 while the design brief requires accessibility for elderly visitors
   forgoes directly relevant criteria — notably 2.5.7 Dragging Movements,
   2.5.8 Target Size (Minimum), and 3.2.6 Consistent Help, all of which
   matter for an elderly and mobile-first pilgrim audience.
3. WCAG 2.2 AA is the declared standard in the adjacent Via-Vitae tree
   (ADR-011 Context §6), so the amendment removes a cross-tree divergence.

### Impact — verified as documentation-only

`@jol-hub/testing/src/invariants/adr011-invariants.test.ts` implements tests
for **six** invariants: INV-2, INV-3, INV-5, INV-7, INV-9, INV-11. **INV-10 has
no implemented test**, so no assertion encodes "2.1" and **no code change is
required** by this amendment.

Forward obligation: when axe-core is wired into the build per INV-10's
enforcement column, its ruleset must be configured for WCAG 2.2 tags, and the
2.2-only criteria listed above must be included in the spoke `check-a11y`
page list.

---

## 2. Amendment B — Control identifier reconciliation

The same controls carry different identifiers depending on the document read.
An auditor tracing "INV-7" reaches *uniform stack* in the ADR and *theme
literals* in spoke CI configuration.

### Authoritative mapping

`adr011-invariants.test.ts`'s header block matches ADR-011 exactly and is
adopted as the authoritative reference:

| ID | Invariant | Enforcement |
|---|---|---|
| INV-1 | Single source of truth | *none implemented* — see §4 |
| INV-2 | Versioned packages | hub invariant test |
| INV-3 | Payment boundary CLOSED | hub invariant test + `check-payment-boundary.sh` |
| INV-4 | Schema-per-tenant | *none implemented* — see §4 |
| INV-5 | Theme vertical (no denomination literals) | hub invariant test (ui package only) + `check-theme-literals.sh` |
| INV-6 | Governance (GPG, Conventional Commits) | process, not code |
| INV-7 | Uniform stack | hub invariant test |
| INV-8 | Identical CI | `check-workflow-completeness.sh` — see §4 |
| INV-9 | GDPR Art. 9 (ROPA/DPIA) | hub invariant test |
| INV-10 | Accessibility | *none implemented* |
| INV-11 | Reversibility | hub invariant test |

### Corrections required

| Document | Currently says | Correct to |
|---|---|---|
| `jol-hub/docs/architecture/package-versioning-policy.md` | "ADR-011 (2026-09-11), **INV-5**" as the versioning authority | **INV-2** |
| Spoke `README.md` / `ci.yml` | theme literals = **INV-7** | **INV-5** |
| Spoke `check-theme-literals.sh` | **INV-7** | **INV-5** |
| Spoke `check-workflow-completeness.sh` | **INV-6** | **INV-8** |

The last three were **already applied across all ten spokes on 2026-09-12/13**
and are recorded here for ratification. The first is a hub document and has
**not** been touched.

---

## 3. Amendment C — INV-9 prose versus implementation

ADR-011 states INV-9 enforcement as *"CI: ROPA dir existence check **per
spoke**."* The implemented check asserts a **hub** path:

```
jol-hub/data/exports/ropa/lt/<vertical>/*.json
```

Verified populated for all ten verticals (`basilica`, `cathedral`, `diocese`,
`deanery`, `church`, `funeral`, `cemetery-cleaning`, `protestant`, `orthodox`,
`other-church`), one to two JSON records each. The test passes.

**Proposed reconciliation:** INV-9 enforcement is restated as *two* artefacts,
because they serve different purposes and neither substitutes for the other:

1. **Machine-checked (hub):** `data/exports/ropa/lt/<vertical>/*.json` — the
   Art. 30 export consumed by tooling and the supervisory-authority response
   path.
2. **Narrative (per spoke):** `compliance/ropa/<spoke>-ropa.md` and
   `compliance/dpia/<spoke>-dpia.md` — the human-readable assessment,
   including controller/processor position, Art. 9(2) condition and retention
   reasoning, which cannot be expressed in the export schema.

ADR-011 Annex B already requires "each spoke requires its own ROPA record
(Art. 30) before go-live" and "its own DPIA (Art. 35)", so this restates the
Annex as the enforcement mechanism rather than adding a requirement.

---

## 4. Amendment D — Enforcement gaps

ADR-011 asserts each invariant *"is enforced as a CI test (not review
discipline), falsifiable in both directions."* **That assertion is currently
false for four of eleven invariants.**

| INV | Gap | Evidence |
|---|---|---|
| **INV-1** | No test asserts that spokes contain no shared logic. All ten spokes ship `src/lib/{resolve-locale,json-ld,analytics}.ts` duplicating `@jol-hub/{i18n,seo,observability}`, and hand-rolled block renderers duplicating the hub's `TemplateRenderer`/`page-composer`. This is the single largest live violation of the topology and nothing detects it. | Verified across spokes 2026-09-13 |
| **INV-4** | No test greps spokes for `t_` schema literals, despite ADR-001 treating schema names as server-only secrets. | Not implemented in the invariant suite |
| **INV-8** | No hub test. Spoke-level `check-workflow-completeness.sh` existed but was **orphaned** — referenced by neither `package.json` nor `ci.yml` — so the meta-check guaranteeing "a spoke cannot silently skip a gate" never ran. **Fixed 2026-09-13** in all ten spokes; still no hub-side assertion that all ten remain identical. Also unmet: INV-8's stated mechanism is *"workflow sha256 pin match"*, but spokes reference org reusable workflows at the mutable ref `@main`, so gate logic can change under every spoke with no spoke-side diff. | Verified 2026-09-13 |
| **INV-10** | No test at all. See §1. | Verified 2026-09-13 |

**Proposed:** ADR-011's enforcement column is corrected to state actual
enforcement status per invariant, and implementing tests for INV-1, INV-4 and
INV-10 is recorded as required work with an owner and a date. An invariant
that is documented as CI-enforced but is not creates worse audit exposure than
one documented as manual, because it induces reliance.

**Related, and separately actionable:** INV-8's sha256 pin requirement should
either be implemented or removed from the ADR. As written it is unmet in all
ten spokes.

---

## 5. Amendment E — Repository template violates INV-5 by construction

`jol-hub/docs/templates/jol-frontend-repo-template/src/app/layout.tsx:15`:

```
description: '__VERTICAL_NAME__ — Journey of Life Catholic Church platform',
```

The scaffold **bakes a denomination literal into every spoke's
`<meta name="description">`**, so INV-5 is violated at the moment of
scaffolding, before any contributor writes code. All ten spokes inherit it.
Detected in every one on 2026-09-13 once the theme-literal gate was repaired:

| Spoke | Published meta description |
|---|---|
| `jol-site-orthodox` | "Vilnius Orthodox Cathedral — Journey of Life **Catholic Church** platform" |
| `jol-site-protestant` | "Kaunas Lutheran Church — Journey of Life **Catholic Church** platform" |
| `jol-site-other-church` | "Vilnius Greek Catholic Church \| Journey of Life" |
| `jol-site-basilica`, `-cathedral`, `-diocese`, `-deanery`, `-parish`, `-funeral`, `-cemetery-care` | same literal, denomination-appropriate by coincidence |

Two of these are **factually false statements about real religious
institutions** published in search-engine metadata: an Orthodox cathedral and a
Lutheran church each describing themselves as part of a Catholic Church
platform. This is precisely the harm INV-5 and DS-THEME-01/O-022 exist to
prevent, and it is the class of error most likely to destroy credibility with
the institutions being onboarded.

**Proposed:** the template's metadata description becomes
`__VERTICAL_NAME__ — Journey of Life platform`, with denomination sourced from
tenant data rather than hardcoded. Spokes are then corrected individually. The
template fix is the durable one; fixing only the spokes leaves the next
scaffolded repo broken.

Note the hub's INV-5 test scans **only** `packages/ui/src` for *quoted*
denomination literals (`/['"]catholic['"]/i`), so it cannot catch this: the
violation is in an app-level template string in a spoke, and the word is not
the whole quoted value. Spoke-level `check-theme-literals.sh` is the only
control that detects it.

---

## 5A. Amendment F — Branch of record for the hub frontend

ADR-011 describes a hub-and-spoke topology in which ten spokes consume twelve
published `@jol-hub/*` packages. It does not state **which hub branch those
packages come from**, and the answer is not the obvious one.

Verified 2026-09-13:

| | `main` (`4f93c6b9`) | `feat/pages-step6` (`0a9464b3`) |
|---|---|---|
| `frontend/packages` | **4** — auth, bitrix-sdk, i18n, ui | **12** |
| `frontend/apps` | 15, including all twelve `lt-*` demo apps | 4, including `template-renderer` |
| `template-renderer` | absent | present |
| `tenant-resolver` | absent | present |
| ADR-011 itself | **absent** | present |
| `release.yml` | absent | present |
| `frontend-test.yml` (build-gate) | absent | present |
| `.changeset/config.json` | absent | present |

`main` has **zero** commits that are not in `feat/pages-step6`; the feature
branch is 125 commits ahead. Consequences:

- **ADR-011 is not on the hub's default branch.** The governing decision for the
  topology exists only on an unmerged feature branch.
- Publishing from `main` would release four packages and omit
  `tenant-resolver`, the package every spoke needs for multi-tenant routing.
  `release.yml` does not exist on `main` at all, so a `main` push publishes
  nothing.
- `.changeset/config.json` sets `baseBranch: feat/pages-step6`, which is
  **correct** given the above, not stale.
- The twelve `lt-*` apps — the "original implementation" — are alive on `main`
  and were deleted only on `feat/pages-step6`. The governance intent to keep the
  new product separate from the original is therefore still live, and is
  currently satisfied *de facto* by the branch split.

**Owner decision, 2026-09-13: `feat/pages-step6` is the trunk-in-waiting.**
The twelve packages are published from it; the fast-forward into `main` is a
separate governed step, taken once `build-gate` is green. Because `main` is a
strict ancestor, that merge is a clean fast-forward with no possible conflict —
the debt is governance and CI-greenness, not mechanics. Merging deletes the
twelve `lt-*` apps from `main`, which is the intended outcome per ADR-011 and
the ROLLBACK NOTE in `TemplateRenderer.tsx`.

**Proposed:** ADR-011 gains a clause naming the branch of record, so that the
packages the spokes pin are traceable to a specific hub ref. Until the
fast-forward completes, that clause names `feat/pages-step6` and records the
merge as pending work.

---

## 6. Proposed DECISION-LOG entries

Last existing entry verified as **D-065**. Proposed:

| ID | Decision | Ref |
|---|---|---|
| **D-066** | ADR-011 INV-10 accessibility target amended from WCAG 2.1 AA to WCAG 2.2 AA. Documentation-only; no implemented test asserts 2.1. axe-core ruleset must target 2.2 when wired. | Amendment A |
| **D-067** | Control identifiers reconciled to ADR-011 as authoritative: versioning policy INV-5 → INV-2; spoke theme-literal gate INV-7 → INV-5; workflow meta-check INV-6 → INV-8. Spoke-side corrections applied to all ten spokes 2026-09-12/13. | Amendment B |
| **D-068** | INV-9 enforcement restated as two artefacts: hub machine-checked ROPA export per vertical, plus per-spoke narrative ROPA and DPIA. | Amendment C |
| **D-069** | ADR-011's claim that all eleven invariants are CI-enforced is corrected. INV-1, INV-4 and INV-10 have no implemented test; INV-8's sha256 pin requirement is unmet in all ten spokes. Implementing them is recorded as required work. | Amendment D |
| **D-070** | Frontend repository template corrected to remove the hardcoded denomination literal from `layout.tsx` metadata, which violated INV-5 by construction in all ten spokes and published false religious-identity metadata for the orthodox and protestant verticals. | Amendment E |
| **D-072** | `feat/pages-step6` named the hub frontend trunk-in-waiting and the branch of record for publishing the twelve `@jol-hub/*` packages. `main` is 125 commits behind and lacks the renderer, `tenant-resolver`, ADR-011 and `release.yml`. Fast-forward into `main` recorded as pending work, gated on `build-gate` being green. | Amendment F |

*D-071 is reserved by `donation-demonstration-path.md`; it is deliberately not
reused here.*

---

## 7. Compliance

- **SOC 2 CC3.1 / CC8.1** — changes are change-controlled; ADR-011 is amended,
  not replaced, and superseded text is annotated rather than deleted.
- **ISO 27001:2022 A.8.32** — change management for governance documents; the
  eleven invariants remain fitness functions, with their actual enforcement
  status now stated truthfully.
- **GDPR Art. 5(2) accountability** — a control documented as enforced but not
  enforced is an accountability defect in itself; Amendment D closes it.
- **WCAG 2.2 AA** — aligns with the accessibility commitment made to elderly
  and pilgrim users in the product brief.

## 8. Rollback

Reverting this amendment restores WCAG 2.1 AA as the INV-10 target and
reintroduces the identifier collisions. Neither is a code change, so rollback
is documentation-only. Amendment E's template fix should **not** be rolled
back independently: reverting it re-breaks every future spoke.

# TemplateRenderer Packaging Assessment — Prompt 14

**Date:** 2026-09-14
**Scope:** Hub template-renderer readiness for spoke consumption, migration path, packaging feasibility
**Status:** Assessment complete — 6 findings (2 HIGH, 3 MEDIUM, 1 LOW)

---

## 1. Current State

### 1.1 Hub TemplateRenderer

**Location:** `jol-hub/frontend/apps/template-renderer/src/components/TemplateRenderer.tsx`

| Aspect | Status |
|---|---|
| Type | Next.js app (NOT a package) |
| Package.json | `"private": true` — cannot be published |
| Lines | 239 (TemplateRenderer.tsx) |
| Block types | 14 (hero, text, keyValue, schedule, list, stats, cta, faq, gallery, massSchedule, sacramentList, clergyRoleList, visitingInfo, mapLocation) |
| Dependencies | `@journeyoflife-org/ui`, `@journeyoflife-org/seed-data` |
| Layout families | `src/lib/layout-families.ts` (49 lines) — vertical → layout family mapping |
| Tests | 135 vitest tests (integration via app, no unit tests for TemplateRenderer itself) |

### 1.2 Spoke Block Renderer

**Location:** `jol-site-basilica/src/app/page.tsx`

| Aspect | Status |
|---|---|
| Type | Inline block renderer (422 lines total) |
| BlockRenderer | Lines 63-309 (247 lines) |
| Block types | 10 (hero, massSchedule, keyValue, sacramentList, list, clergyRoleList, gallery, visitingInfo, mapLocation, cta) |
| SEO layer | JSON-LD, hreflang, canonical (lines 317-390) — spoke-specific |
| Analytics | TrackedLink for map directions (lines 272-279) — spoke-specific |
| Tests | 46 vitest tests (fixture integrity, JSON-LD, locale resolution) |

### 1.3 Block Type Coverage Comparison

| Block Type | Hub | Spoke | Notes |
|---|---|---|---|
| hero | ✅ | ✅ | Both implement |
| text | ✅ | ❌ | Hub only |
| keyValue | ✅ | ✅ | Both implement |
| schedule | ✅ | ❌ | Hub only (generic schedule) |
| list | ✅ | ✅ | Both implement |
| stats | ✅ | ❌ | Hub only |
| cta | ✅ | ✅ | Both implement |
| faq | ✅ | ❌ | Hub only |
| gallery | ✅ | ✅ | Both implement |
| massSchedule | ✅ | ✅ | Both implement (spoke-specific name) |
| sacramentList | ✅ | ✅ | Both implement |
| clergyRoleList | ✅ | ✅ | Both implement |
| visitingInfo | ✅ | ✅ | Both implement |
| mapLocation | ✅ | ✅ | Both implement |

**Overlap:** 10/14 block types (71%)
**Hub-only:** 4 types (text, schedule, stats, faq)
**Spoke-only:** 0 types

---

## 2. Migration Plan Status

### 2.1 Documented Plan

**Location:** `jol-hub/docs/architecture/renderer-package-migration-plan.md`

| Step | Status | Notes |
|---|---|---|
| 1. Create package scaffold | ❌ NOT STARTED | `@journeyoflife-org/renderer` v1.0.0 |
| 2. Move source files | ❌ NOT STARTED | TemplateRenderer.tsx + layout-families.ts |
| 3. Update imports | ❌ NOT STARTED | template-renderer app → package |
| 4. Build and publish | ❌ NOT STARTED | GitHub Packages |
| 5. Port spoke to consume | ❌ NOT STARTED | Replace page.tsx block renderer |
| 6. Verify | ❌ NOT STARTED | Both hub and spoke |

**Estimated effort:** 4-6 hours (per migration plan)
**Priority:** P1 — architectural governance

### 2.2 Why Migration Is Needed

1. **Code duplication:** Spoke has 247 lines of block renderer that duplicates hub logic
2. **Maintenance burden:** Changes to block rendering must be made in 10+ spokes
3. **Inconsistency risk:** Spoke-specific implementations drift from hub standard
4. **ADR-011 compliance:** Spokes should consume hub packages, not duplicate logic

---

## 3. Findings

| ID | Severity | Description |
|---|---|---|
| TR-1 | HIGH | TemplateRenderer is a private app, not a package — cannot be published |
| TR-2 | HIGH | Migration plan documented but not implemented (0/6 steps complete) |
| TR-3 | MEDIUM | Block type coverage mismatch: hub has 14, spoke has 10 (4 hub-only types) |
| TR-4 | MEDIUM | Spoke has SEO layer (JSON-LD, hreflang, canonical) that must remain spoke-local |
| TR-5 | MEDIUM | Spoke has analytics (TrackedLink) that hub doesn't provide |
| TR-6 | LOW | TemplateRenderer has no unit tests (only integration tests via app) |

---

## 4. Packaging Feasibility

### 4.1 What Can Be Packaged

| Component | Packageable | Notes |
|---|---|---|
| TemplateRenderer.tsx | ✅ YES | Pure component, depends on @journeyoflife-org/ui + seed-data |
| layout-families.ts | ✅ YES | Pure mapping logic, no dependencies |
| Block types (14) | ✅ YES | All are pure React components |
| SEO layer (JSON-LD) | ❌ NO | Spoke-specific, uses @journeyoflife-org/seo (already a package) |
| Analytics (TrackedLink) | ❌ NO | Spoke-specific, consent-gated |
| Route composition | ❌ NO | App-level concern, not packageable |

### 4.2 Target Package Structure

```
@journeyoflife-org/renderer@1.0.0
├── package.json (name, version, exports, files, publishConfig)
├── tsup.config.ts (ESM + CJS + DTS)
└── src/
    ├── index.ts (barrel export)
    ├── TemplateRenderer.tsx (239 lines)
    └── layout-families.ts (49 lines)
```

**Exports:**
- `TemplateRenderer` (default + named)
- `LayoutFamily` (type)
- `VERTICAL_FAMILY` (constant)
- `FAMILY_ACCENT` (constant)
- `VERTICAL_ACCENT_OVERRIDE` (constant)

### 4.3 Dependencies

```
@journeyoflife-org/renderer
├── @journeyoflife-org/ui (Badge, Card, CardContent)
└── @journeyoflife-org/seed-data (ContentBlock, LocalizedText, TenantFixture, TenantPage)
```

Both are already published at ^1.0.0.

---

## 5. Migration Path

### 5.1 Phase 1: Create Package (Hub)

**Effort:** 2 hours

1. Create `frontend/packages/renderer/` scaffold
2. Move `TemplateRenderer.tsx` and `layout-families.ts`
3. Create `tsup.config.ts` and `package.json`
4. Add unit tests for TemplateRenderer (currently missing)
5. Build and verify

### 5.2 Phase 2: Publish Package (Hub)

**Effort:** 30 minutes

1. Bump version to 1.0.0
2. Publish to GitHub Packages
3. Verify `npm view @journeyoflife-org/renderer`

### 5.3 Phase 3: Port Spoke (Spoke)

**Effort:** 2-3 hours

1. Add `@journeyoflife-org/renderer` to dependencies
2. Replace `BlockRenderer` in `page.tsx` with `TemplateRenderer`
3. Adapt fixture format if needed (spoke uses `ContentBlock` with `[key: string]: unknown`, hub uses typed `ContentBlock` from seed-data)
4. Keep SEO layer (JSON-LD, hreflang, canonical) spoke-local
5. Keep analytics (TrackedLink) spoke-local
6. Update tests
7. Verify type-check, tests, build

### 5.4 Phase 4: Update Hub App (Hub)

**Effort:** 30 minutes

1. Update `template-renderer` to import from `@journeyoflife-org/renderer`
2. Verify all 10 tenants still render
3. Delete local `TemplateRenderer.tsx` and `layout-families.ts`

---

## 6. Risks

### 6.1 Breaking Changes

| Risk | Mitigation |
|---|---|
| TemplateRenderer API changes | Keep interface stable: `{ fixture, page, basePath }` |
| Block type schema mismatch | Spoke uses loose typing, hub uses strict typing from seed-data |
| Fixture format incompatibility | Verify spoke fixture conforms to seed-data schema |

### 6.2 Spoke-Specific Concerns

| Concern | Resolution |
|---|---|
| SEO layer (JSON-LD, hreflang) | Keep spoke-local, not part of renderer package |
| Analytics (TrackedLink) | Keep spoke-local, wrap hub's mapLocation block if needed |
| Custom styling (Tailwind classes) | Hub uses design tokens, spoke uses hardcoded colors — may need adaptation |

### 6.3 Rollback Plan

If migration fails:
1. Revert spoke's `page.tsx` to local block renderer
2. Revert template-renderer's imports to local component
3. Unpublish `@journeyoflife-org/renderer` (or publish revert version)

---

## 7. Recommendations

### 7.1 Immediate (Before Production Indexing)

1. **Implement migration plan** — 4-6 hours, P1 priority
2. **Add unit tests for TemplateRenderer** — currently only integration tests
3. **Verify fixture format compatibility** — spoke fixture vs seed-data schema

### 7.2 Deferred

4. **Extend spoke block coverage** — add text, schedule, stats, faq blocks (from hub)
5. **Unify styling** — spoke uses hardcoded colors, hub uses design tokens
6. **Extract SEO layer to package** — if multiple spokes need same JSON-LD logic

### 7.3 Not Recommended

7. **Do NOT package the SEO layer** — it's spoke-specific and already uses @journeyoflife-org/seo
8. **Do NOT package analytics** — consent-gated, spoke-specific

---

## 8. Professional Opinion

The TemplateRenderer is the **canonical rendering logic** for all JOL spokes. It is well-designed (239 lines, 14 block types, pure component) and depends only on published packages. However, it is currently a private app, not a package, so it cannot be consumed by spokes.

The migration plan is documented but not implemented. The spoke has 247 lines of duplicated block renderer logic that should be replaced with the hub package. This is a P1 architectural governance item.

The migration is straightforward:
1. Create `@journeyoflife-org/renderer` package (2 hours)
2. Publish to GitHub Packages (30 minutes)
3. Port spoke to consume the package (2-3 hours)
4. Update hub app to import from package (30 minutes)

Total effort: 5-6 hours. Risk is low because the rollback plan is simple (revert spoke's page.tsx).

The spoke's SEO layer (JSON-LD, hreflang, canonical) and analytics (TrackedLink) must remain spoke-local — they are not part of the renderer.

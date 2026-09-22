# Professional Opinion: Phase 2 Execution Plan Review

> **Date:** 2026-09-14
> **Status:** Plan review and adjustment
> **Context:** User provided 21-prompt execution plan (Prompts 0-20)

## Executive Summary

The proposed execution plan is **well-structured and architecturally sound**. It correctly prioritizes architecture governance over premature implementation. However, the plan assumes a starting state that no longer exists — several items it treats as pending are already complete.

**Adjustment required:** The plan must be re-sequenced to reflect that:
1. BF-5 (package publishing) is **DONE** — 12 packages published as `@journeyoflife-org/*` v1.0.0
2. Canonical renderer decision is **DONE** — hub `template-renderer` confirmed as canonical
3. Hub fixture corrections are **COMMITTED** — Tier 1 identity errors fixed and committed
4. Spoke SEO deduplication is **DONE** — consumes `@journeyoflife-org/seo@1.1.0`

## Current State vs. Plan Assumptions

| Plan Item | Plan Assumption | Actual State | Adjustment |
|---|---|---|---|
| Prompt 2-3 (Fixture audit/commit) | Uncommitted fixture corrections | Committed 2026-09-13 | **Skip** — already done |
| Prompt 4 (Canonical renderer ADR) | Decision pending | Decision made 2026-09-13 | **Convert to documentation** — record the decision, don't re-debate it |
| Prompt 5 (Package boundary) | Not yet designed | 12 packages already published | **Retrospective audit** — validate the existing package boundary, don't design from scratch |
| Prompt 12 (write:packages) | Blocked | Resolved 2026-09-13 | **Skip** — already resolved |
| Prompt 13-14 (Migration) | Pending | Partially done (SEO migrated) | **Adjust scope** — focus on TemplateRenderer packaging, not general migration |

## Recommended Execution Order (Adjusted)

Based on the current state, here is the **revised execution order**:

### Phase 2A: Foundation Validation (Prompts 0-1, 8-11)

**Rationale:** Before building new features, validate that the foundation is solid.

1. **Prompt 0 — Session initialization** ✅ (Can be executed immediately)
   - Purpose: Establish baseline context
   - Estimated time: 15 minutes

2. **Prompt 1 — Freeze and verify indexing protection** ✅ (Execute next)
   - Purpose: Confirm noindex/nofollow are working correctly
   - Critical because: Demo environment is the next step
   - Estimated time: 1-2 hours

3. **Prompt 8 — Legal-page implementation plan** ✅ (Execute after Prompt 1)
   - Purpose: Separate technical structure from legal content
   - Critical because: Legal pages are P3 items in professional opinion
   - Estimated time: 2-3 hours

4. **Prompt 9 — Accessibility/WAD assessment** ✅ (Execute after Prompt 8)
   - Purpose: Technical accessibility audit + WAD applicability facts
   - Critical because: WCAG 2.2 AA is required (INV-10)
   - Estimated time: 3-4 hours

5. **Prompt 10 — SEO audit** ✅ (Execute after Prompt 9)
   - Purpose: Verify structured data, canonical URLs, hreflang
   - Critical because: SEO is production-blocking
   - Estimated time: 2-3 hours

6. **Prompt 11 — Quality and test gaps** ✅ (Execute after Prompt 10)
   - Purpose: Define minimum test suite for all page types
   - Critical because: 46 tests exist, but coverage is narrow
   - Estimated time: 4-6 hours

### Phase 2B: Architecture Governance (Prompts 4, 5, 6, 7)

**Rationale:** Document decisions that were made informally, validate package boundary.

7. **Prompt 4 — Canonical-renderer ADR** ✅ (Convert to documentation task)
   - Purpose: Record the decision (hub template-renderer) in formal ADR
   - Do NOT re-debate — decision was made 2026-09-13
   - Estimated time: 1-2 hours

8. **Prompt 5 — Shared-package boundary** ✅ (Convert to retrospective audit)
   - Purpose: Validate the existing 12-package boundary
   - Do NOT redesign — packages are already published
   - Focus: Are the package responsibilities correct? Any missing packages?
   - Estimated time: 2-3 hours

9. **Prompt 6 — Content metadata and governance** ✅ (Execute as designed)
   - Purpose: Design content approval workflow
   - Critical because: Professional opinion identifies this as P2 gap
   - Estimated time: 4-6 hours

10. **Prompt 7 — Bitrix24 integration boundaries** ✅ (Execute as designed)
    - Purpose: Define CRM integration architecture
    - Critical because: Contact forms are Phase 2 (P1) in frontend spec
    - Estimated time: 3-4 hours

### Phase 2C: Implementation Preparation (Prompts 13-15)

**Rationale:** Prepare for TemplateRenderer packaging and demo environment.

11. **Prompt 13 — First shared-package migration** ✅ (Adjust scope)
    - Purpose: Plan TemplateRenderer packaging (move from app to `@journeyoflife-org/renderer`)
    - Scope: Only TemplateRenderer + layout-families, not general migration
    - Estimated time: 2-3 hours

12. **Prompt 14 — Implement migration slice** ✅ (Execute after Prompt 13 approval)
    - Purpose: Package TemplateRenderer, publish as `@journeyoflife-org/renderer`
    - Estimated time: 4-6 hours (dedicated session)

13. **Prompt 15 — Demo environment design** ✅ (Execute as designed)
    - Purpose: Design controlled demo environment
    - Critical because: P0 item in professional opinion
    - Estimated time: 3-4 hours

### Phase 2D: Tenant Verification (Prompts 16-17)

**Rationale:** Verify content before publishing.

14. **Prompt 16 — First tenant verification** ✅ (Execute as designed)
    - Purpose: Formal verification package for Vilnius Cathedral Basilica
    - Critical because: Professional opinion requires content approval
    - Estimated time: 4-6 hours

15. **Prompt 17 — Remaining tenant onboarding** ✅ (Execute after Prompt 16)
    - Purpose: Onboarding plan for 7 remaining basilicas
    - Estimated time: 6-8 hours (spread across multiple sessions)

### Phase 2E: Features and Production Readiness (Prompts 18-20)

**Rationale:** Implement features, then validate production readiness.

16. **Prompt 18 — GPM feature** ✅ (Execute as designed)
    - Purpose: Design 1.2% GPM informational page
    - Estimated time: 2-3 hours

17. **Prompt 19 — Donation/e-commerce architecture** ✅ (Execute as designed)
    - Purpose: Future donation architecture (no implementation)
    - Estimated time: 3-4 hours

18. **Prompt 20 — Production-readiness review** ✅ (Execute last)
    - Purpose: Final release decision
    - Estimated time: 4-6 hours

## Prompts to Skip or Modify

| Prompt | Original Purpose | Adjustment |
|---|---|---|
| Prompt 2-3 | Fixture audit/commit | **Skip** — already committed |
| Prompt 12 | write:packages resolution | **Skip** — already resolved |

## Professional Opinion on Plan Quality

### Strengths

1. **Controlled sequence** — One prompt at a time prevents scope creep
2. **Operating rules** — Clear safety constraints (no auto-commit, no auto-push, no secrets)
3. **Architecture-first** — Correctly prioritizes governance over implementation
4. **Verification-focused** — Multiple audit prompts before implementation
5. **Legal/compliance awareness** — Separates technical structure from legal content
6. **Rollback planning** — Every migration includes rollback criteria

### Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Plan assumes outdated state | Medium | High | **Adjusted in this review** — prompts re-sequenced |
| TemplateRenderer packaging is complex | High | Medium | Dedicated 4-6 hour session (Prompt 14) |
| Legal review requires external input | High | High | Prompt 8 separates technical from legal; legal content requires professional review |
| Demo environment requires infrastructure | High | Medium | Prompt 15 designs before implementing; requires DNS/nginx/Proxmox access |
| Content approval workflow is organizational | Medium | High | Prompt 6 designs the model; actual approval requires parish sign-off (not technical) |

## Recommendations

### Immediate Next Steps

1. **Execute Prompt 0** — Session initialization (15 minutes)
2. **Execute Prompt 1** — Indexing protection audit (1-2 hours)
3. **Pause and review** — Confirm noindex is working before proceeding

### Critical Path

The critical path to production is:

```
Prompt 1 (noindex validation)
  ↓
Prompt 15 (demo environment design)
  ↓
Prompt 14 (TemplateRenderer packaging)
  ↓
Prompt 16 (first tenant verification)
  ↓
Prompt 20 (production readiness review)
```

### Non-Critical Path

Prompts 6-10 (content governance, Bitrix, legal, accessibility, SEO) can be executed in parallel or deferred until after the demo environment is operational.

## Updated Professional Opinion

**Assessment type:** Phase 2 execution plan review
**Updated:** 2026-09-14
**Prior assessment:** 2026-09-14 (Frontend scope analysis + P1 governance)
**Next review:** After Prompt 1 (indexing protection audit)

### Gate Qualification (Updated)

```
Production-readiness gates:    PARTIALLY PASSING
  - Legal review:               Not done (Prompt 8 pending)
  - Content approval:           No workflow (Prompt 6 pending)
  - Canonical renderer:         DECIDED — hub template-renderer (Prompt 4 → ADR documentation)
  - Shared packages:            PUBLISHED — 12 @journeyoflife-org/* v1.0.0 (Prompt 5 → retrospective audit)
  - Spoke SEO deduplication:    DONE — consumes @journeyoflife-org/seo@1.1.0
  - Tenant coverage:            1 of 8 basilicas (Prompt 16-17 pending)
  - Demo noindex:               DONE — both spoke and hub renderer (Prompt 1 → validation)
  - Hub fixture markers:        408 ru translations pending (Prompt 16 → verification)
  - Donation flow:              Not implemented (Prompt 18-19 pending)
  - Content metadata:           No source/verifier/approval tracking (Prompt 6 pending)
  - Package governance:         DONE — policy documented in hub
  - Changeset baseBranch:       DONE — updated to main
  - Renderer package migration: PLAN documented (Prompt 13-14 → implementation)
  - Bitrix integration:         Not designed (Prompt 7 pending)
  - Accessibility audit:        Not done (Prompt 9 pending)
  - SEO audit:                  Not done (Prompt 10 pending)
  - Test coverage:              46 tests, narrow coverage (Prompt 11 pending)
```

### Effort Estimate (Revised)

**Phase 2A (Foundation Validation):** 12-18 hours
**Phase 2B (Architecture Governance):** 10-14 hours
**Phase 2C (Implementation Preparation):** 10-14 hours
**Phase 2D (Tenant Verification):** 10-14 hours
**Phase 2E (Features and Production):** 9-13 hours

**Total:** 51-73 hours (7-10 senior engineering days)

This is consistent with the original 10-15 day estimate, adjusted for work already completed.

## Sign-off

**Plan review:** Complete
**Adjustments:** Re-sequenced prompts, skipped completed items, converted design tasks to audit/documentation tasks
**Recommended start:** Prompt 0 (session initialization)
**Critical decision:** Do not skip Prompt 1 (indexing protection) — this is the gateway to demo environment deployment

# Content Approval Workflow Assessment — Prompt 17

**Date:** 2026-09-14
**Scope:** Content governance, approval processes, provenance tracking, tenant content validation
**Status:** Assessment complete — 8 findings (3 HIGH, 3 MEDIUM, 2 LOW)

---

## 1. Current State

### 1.1 Content Governance Model

| Aspect | Status | Notes |
|---|---|---|
| Content source | Tenant fixtures (JSON) | `src/fixtures/tenant.json` (spoke) = hub fixture (byte-for-byte identical) |
| Content approval | ❌ NOT IMPLEMENTED | No approval workflow exists |
| Content provenance | ❌ NOT IMPLEMENTED | No sourceUrl, verifiedDate, verifier, approvalStatus, nextReviewDate |
| Content review cycle | ❌ NOT IMPLEMENTED | No scheduled review process |
| Content ownership | ❌ NOT DEFINED | No designated content owner per tenant |

### 1.2 Fixture Schema Analysis

**Hub schema:** `jol-hub/frontend/packages/seed-data/src/schema.ts`

The schema defines content structure but **no governance fields**:

| Field | Present | Purpose |
|---|---|---|
| `slug` | ✅ | Tenant identifier |
| `vertical` | ✅ | Layout family selection |
| `locale` | ✅ | Default locale |
| `name` | ✅ | Tenant name (localized) |
| `tagline` | ✅ | Tenant description (localized) |
| `identity` | ✅ | Contact info (address, email, phone, domain) |
| `pages` | ✅ | Content blocks array |
| `sourceUrl` | ❌ | Source of truth URL (e.g., katedra.lt) |
| `verifiedDate` | ❌ | Last verification date |
| `verifier` | ❌ | Who verified the content |
| `approvalStatus` | ❌ | draft/pending/approved/rejected |
| `nextReviewDate` | ❌ | Scheduled review date |

### 1.3 Content Types Requiring Approval

| Content Type | Sensitivity | GDPR | Approval Required | Current Status |
|---|---|---|---|---|
| **Identity data** (name, address, email, phone) | Medium | Art. 6 | ✅ Yes | Verified against public sources (katedra.lt) |
| **Mass schedules** | Low | N/A | ✅ Yes | Verified against katedra.lt, but dates hardcoded (stale) |
| **Confession hours** | Low | N/A | ✅ Yes | Verified against katedra.lt |
| **Sacraments** | Low | N/A | ✅ Yes | Generic descriptions, no approval |
| **Clergy names/roles** | HIGH | Art. 9 | ✅✅ Yes (Art. 9) | ❌ NOT VERIFIED — no clergy data in fixture |
| **Visiting hours** | Low | N/A | ✅ Yes | Verified against katedra.lt |
| **Gallery images** | Medium | Copyright | ✅ Yes | Placeholders only (no real photos) |
| **Historical facts** | Low | N/A | ✅ Yes | Verified against VLE, SAVAITĖ |
| **Legal pages** (privacy, cookies, a11y) | HIGH | GDPR, e-Privacy | ✅✅ Yes (legal) | ❌ NOT REVIEWED by lawyer |

---

## 2. Findings

| ID | Severity | Description |
|---|---|---|
| CA-1 | HIGH | No content approval workflow — unreviewed content can reach frontend |
| CA-2 | HIGH | No content provenance fields — no sourceUrl, verifiedDate, verifier |
| CA-3 | HIGH | Clergy data (Art. 9 personal data) has no approval process — GDPR risk |
| CA-4 | MEDIUM | No content ownership model — no designated content owner per tenant |
| CA-5 | MEDIUM | No scheduled review cycle — content can become stale without detection |
| CA-6 | MEDIUM | Mass schedule dates hardcoded (not recurring) — stale immediately after fixture date |
| CA-7 | LOW | No content staging environment — no way to preview changes before publication |
| CA-8 | LOW | No content versioning — no audit trail of who changed what, when |

---

## 3. Content Approval Workflow Design

### 3.1 Proposed Schema Extension

Add governance fields to `TenantFixtureSchema`:

```typescript
const TenantFixtureSchema = z.object({
  // ... existing fields ...
  
  // Content governance (PROPOSED)
  sourceUrl: z.string().url().optional(),        // Source of truth (e.g., https://katedra.lt)
  verifiedDate: z.string().datetime().optional(), // Last verification (ISO 8601)
  verifier: z.string().optional(),                // Who verified (name or role)
  approvalStatus: z.enum(['draft', 'pending', 'approved', 'rejected']).default('draft'),
  nextReviewDate: z.string().datetime().optional(), // Scheduled review (ISO 8601)
  contentOwner: z.string().optional(),            // Designated owner (email or role)
});
```

### 3.2 Proposed Approval Workflow

```
┌─────────────┐
│  Content    │
│  Author     │
│  (Tenant)   │
└──────┬──────┘
       │ 1. Submit content
       ▼
┌─────────────┐
│  Draft      │◄─── status: draft
│  (Tenant)   │
└──────┬──────┘
       │ 2. Review
       ▼
┌─────────────┐
│  Pending    │◄─── status: pending
│  Review     │
└──────┬──────┘
       │ 3. Approve/Reject
       ▼
┌─────────────┐
│  Platform   │
│  Owner      │
└──────┬──────┘
       │ 4a. Approve
       ▼
┌─────────────┐
│  Approved   │◄─── status: approved
│  (Live)     │
└─────────────┘
       
       │ 4b. Reject
       ▼
┌─────────────┐
│  Rejected   │◄─── status: rejected
│  (Feedback) │
└─────────────┘
```

### 3.3 Content Ownership Model

| Role | Responsibility | Access |
|---|---|---|
| **Tenant Content Author** | Submit content updates, verify factual accuracy | Write to tenant fixture |
| **Platform Owner** | Approve/reject content, ensure compliance | Read/write all fixtures |
| **DPO** | Review Art. 9 data (clergy, pastoral care) | Read all fixtures |
| **Legal Reviewer** | Review legal pages (privacy, cookies, a11y) | Read legal pages |

### 3.4 Review Cycle

| Content Type | Review Frequency | Trigger |
|---|---|---|
| Identity data | Annual | Change of address, phone, email |
| Mass schedules | Weekly | Schedule changes (recurring events) |
| Confession hours | Monthly | Schedule changes |
| Clergy data | Quarterly | Personnel changes (Art. 9) |
| Legal pages | Annual | Legal changes, lawyer review |
| Gallery images | Annual | New photos, copyright changes |

---

## 4. Implementation Path

### 4.1 Phase 1: Schema Extension (Hub)

**Effort:** 2 hours

1. Add governance fields to `TenantFixtureSchema`
2. Update all 18 tenant fixtures with governance metadata
3. Add validation for governance fields
4. Rebuild and republish `@journeyoflife-org/seed-data`

### 4.2 Phase 2: Approval Workflow (Hub)

**Effort:** 8-12 hours

1. Design approval API (submit, review, approve, reject)
2. Implement approval state machine
3. Add approval UI (tenant dashboard)
4. Add notification system (email on status change)
5. Add audit trail (who approved what, when)

### 4.3 Phase 3: Content Staging (Hub)

**Effort:** 4-6 hours

1. Implement content staging environment (preview URL per tenant)
2. Add content diff view (what changed)
3. Add approval preview (see changes before approving)

### 4.4 Phase 4: Spoke Integration (Spoke)

**Effort:** 2-3 hours

1. Update spoke to consume governance fields from fixture
2. Display approval status in admin UI (if implemented)
3. Add content review reminders (nextReviewDate)

---

## 5. Risks

### 5.1 Current Risks (No Approval Workflow)

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Inaccurate content published | Reputational damage | Medium | Manual verification (current) |
| Art. 9 data leaked (clergy names) | GDPR violation | Low | No clergy data in fixtures currently |
| Stale mass schedules | User frustration | High | Already observed (dates hardcoded) |
| Legal pages non-compliant | Regulatory fine | Medium | Lawyer review pending (Prompt 16) |

### 5.2 Implementation Risks

| Risk | Mitigation |
|---|---|
| Schema extension breaks existing fixtures | Backward-compatible (all new fields optional) |
| Approval workflow too complex | Start simple (draft → approved), add stages later |
| Content owners not defined | Require contentOwner field before approval |
| Review cycle not enforced | Add automated reminders (email on nextReviewDate) |

---

## 6. Recommendations

### 6.1 Immediate (Before Production)

1. **Add governance fields to schema** — 2 hours, backward-compatible
2. **Define content ownership** — designate content owner per tenant
3. **Verify clergy data handling** — ensure no Art. 9 data without approval
4. **Implement mass schedule recurrence** — replace hardcoded dates with recurrence model

### 6.2 Before Demo

5. **Implement basic approval workflow** — draft → approved (2 states)
6. **Add content staging** — preview URL per tenant
7. **Add review reminders** — email on nextReviewDate

### 6.3 Deferred

8. **Full approval workflow** — draft → pending → approved/rejected (4 states)
9. **Content versioning** — audit trail of changes
10. **Automated content validation** — check for stale dates, missing fields

---

## 7. Professional Opinion

The spoke has **no content approval workflow** — unreviewed content can reach the frontend. This is a **P2 gap** identified in the professional opinion and a **HIGH severity finding** in this assessment.

**Critical gaps:**
1. No content provenance fields (sourceUrl, verifiedDate, verifier, approvalStatus)
2. No content ownership model (no designated content owner per tenant)
3. No scheduled review cycle (content can become stale without detection)
4. Clergy data (Art. 9 personal data) has no approval process — GDPR risk

**What can be fixed immediately:**
1. Add governance fields to schema (2 hours, backward-compatible)
2. Define content ownership (designate content owner per tenant)
3. Verify clergy data handling (ensure no Art. 9 data without approval)
4. Implement mass schedule recurrence (replace hardcoded dates)

**What requires significant effort:**
5. Implement approval workflow (8-12 hours)
6. Add content staging (4-6 hours)
7. Add review reminders (2-3 hours)

**Recommendation:** Start with schema extension and content ownership definition (4 hours total). This establishes the governance foundation without requiring a full workflow implementation. The approval workflow can be added incrementally as the platform matures.

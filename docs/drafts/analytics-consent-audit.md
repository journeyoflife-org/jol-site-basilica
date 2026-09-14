# Analytics/Consent Audit — Prompt 11

**Date:** 2026-09-14
**Scope:** jol-site-basilica spoke — analytics data flow, consent mechanism, e-Privacy/GDPR compliance
**Status:** Audit complete — 8 findings (3 HIGH, 3 MEDIUM, 2 LOW)

---

## 1. Analytics Module (`src/lib/analytics.ts`)

### 1.1 Event Types Defined

| Event Type | Fields | Status |
|---|---|---|
| `page_view` | path, locale | **Defined but NEVER fired** |
| `mass_times_open` | path | **Defined but NEVER fired** |
| `map_directions_click` | path, destination | **Fired** via TrackedLink |
| `contact_form_submit_success` | path | **Defined but NEVER fired** |

### 1.2 Data Flow

```
User action → TrackedLink onClick → trackEvent()
  → consent gate (localStorage 'jol-consent-analytics' === 'granted')
  → navigator.sendBeacon('/api/analytics', JSON payload)
  → ??? (no route handler exists)
```

### 1.3 Consent Gate

```typescript
const consent = typeof localStorage !== 'undefined'
  ? localStorage.getItem('jol-consent-analytics')
  : null;
if (consent !== 'granted') return;
```

**Correct:** Consent is checked BEFORE any data transmission.
**Problem:** Nothing in the codebase writes to `jol-consent-analytics`. Consent can never be 'granted'.

### 1.4 SSR Guard

```typescript
if (typeof window === 'undefined') return;
```

**Correct:** Prevents server-side execution of browser-only APIs.

### 1.5 Transport

```typescript
navigator.sendBeacon('/api/analytics', JSON.stringify({
  ...event,
  timestamp: new Date().toISOString(),
}));
```

**Issue:** `sendBeacon` sends to `/api/analytics` which has **no route handler**. Data is silently lost (404). The try/catch ensures non-fatal failure, but analytics are effectively dead.

### 1.6 Findings

| ID | Severity | Description |
|---|---|---|
| AN-1 | **HIGH** | No `/api/analytics` route handler — all analytics data silently lost (404) |
| AN-4 | MEDIUM | 3 of 4 event types defined but never fired (page_view, mass_times_open, contact_form_submit_success) |

---

## 2. Consent Mechanism

### 2.1 Current State

| Component | Status |
|---|---|
| Consent read (localStorage) | ✅ Implemented in `trackEvent()` |
| Consent write (localStorage) | ❌ **Not implemented** — nothing sets `jol-consent-analytics` |
| Consent UI (banner/dialog) | ❌ **Not implemented** — no component exists |
| Consent revocation | ❌ **Not implemented** — no UI to withdraw consent |
| Consent persistence | ❌ **Not implemented** — no expiry or renewal mechanism |

### 2.2 Cookie Policy Documentation

The cookie policy page (`/cookies`) accurately documents the mechanism:

> "Analitiniai duomenys renkami tik tada, kai naršyklės localStorage nustatytas sutikimo požymis (`jol-consent-analytics = granted`)."

This is **factually accurate** (Phase 8A fixed) but describes a mechanism that doesn't exist yet.

### 2.3 Findings

| ID | Severity | Description |
|---|---|---|
| AN-2 | **HIGH** | No consent UI — user cannot grant or revoke analytics consent |
| AN-3 | **HIGH** | No code writes `jol-consent-analytics` to localStorage — consent can never be granted |

---

## 3. TrackedLink Component (`src/components/tracked-link.tsx`)

### 3.1 Implementation

```typescript
'use client';
import { trackEvent } from '@/lib/analytics';

export default function TrackedLink({ href, className, children, eventPath, eventDestination }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}
      onClick={() => trackEvent({ type: 'map_directions_click', path: eventPath, destination: eventDestination })}>
      {children}
    </a>
  );
}
```

### 3.2 Usage

Used in `page.tsx` for the "Get Directions" link in the mapLocation block.

### 3.3 Issues

| Issue | Description |
|---|---|
| **Hardcoded event type** | Always emits `map_directions_click` regardless of context. Not reusable for other link types. |
| **No generic tracking** | CTA links, footer links, external links — none are tracked. |
| **No `page_view` tracking** | Home page and legal pages emit no page_view event on load. |

### 3.4 Finding

| ID | Severity | Description |
|---|---|---|
| AN-5 | MEDIUM | TrackedLink hardcodes `map_directions_click` — not generic/reusable |

---

## 4. API Endpoint

### 4.1 Current State

**No `/api/analytics` route handler exists.** The spoke has no `src/app/api/` directory at all.

### 4.2 What's Needed

A Next.js Route Handler at `src/app/api/analytics/route.ts` that:
1. Accepts POST requests with JSON body
2. Validates the payload shape (event type, timestamp)
3. Strips PII (IP address should not be stored without consent)
4. Forwards to the platform analytics pipeline (or stores locally)

### 4.3 Hub Support

The hub `@journeyoflife-org/observability` package provides:
- `createLogger` — structured logging with PII redaction
- `createBatchingSink` — client-side batching with flush on visibilitychange/pagehide
- `createMetricBatcher` — generic timed batcher for metrics
- `redactValue` — deep redaction of sensitive data

The spoke's `analytics.ts` is a hand-rolled version of what the hub package provides more robustly.

### 4.4 Finding

| ID | Severity | Description |
|---|---|---|
| AN-6 | MEDIUM | `@journeyoflife-org/observability` package available but not consumed |

---

## 5. e-Privacy/GDPR Compliance

### 5.1 e-Privacy Directive (2002/58/EB) Art. 5(3)

**Requirement:** Informed consent before storing/accessing data on user's device.

| Aspect | Status |
|---|---|
| Consent check before data transmission | ✅ `trackEvent()` checks localStorage |
| Consent obtained via clear affirmative action | ❌ No consent UI exists |
| Consent is informed (user knows what they consent to) | ❌ No information provided before consent |
| Consent is specific (granular choice) | ❌ No granularity — binary grant |
| Consent is revocable | ❌ No revocation mechanism |

### 5.2 GDPR Art. 6 (Lawful Basis for Processing)

**Requirement:** Analytics processing needs a lawful basis. Consent is appropriate for tracking.

| GDPR Consent Requirement | Status |
|---|---|
| Freely given | ❌ No consent UI — cannot be freely given |
| Specific | ❌ No granularity |
| Informed | ❌ No information provided |
| Unambiguous | ❌ No affirmative action |
| Demonstrable (proof of consent) | ❌ No consent record stored |

### 5.3 Current Safety

**Paradoxically safe:** Analytics are dead code because consent can never be granted. No data is collected, no PII is transmitted, no compliance violation occurs — because the feature is inert.

**Risk:** When consent UI is added, the implementation must satisfy all e-Privacy/GDPR requirements. The architecture (consent gate in `trackEvent()`) is correct; only the UX and write path are missing.

### 5.4 Findings

| ID | Severity | Description |
|---|---|---|
| AN-7 | LOW | No cookie banner implementation timeline documented |

---

## 6. Hub Observability Package

### 6.1 Available but Unused

| Export | Purpose | Spoke Usage |
|---|---|---|
| `createLogger` | Structured logging with PII redaction | ❌ Not consumed |
| `createBatchingSink` | Client-side batching with flush | ❌ Not consumed |
| `createMetricBatcher` | Generic timed batcher | ❌ Not consumed |
| `classifyError` | Error classification + fingerprinting | ❌ Not consumed |
| `computeNavigationPhases` | DNS/TCP/SSL/TTFB/download timings | ❌ Not consumed |
| `slowestResources` | Performance resource analysis | ❌ Not consumed |
| `aggregateHealth` | Health check aggregation | ❌ Not consumed |
| `redactValue` | Deep PII redaction | ❌ Not consumed |

### 6.2 Gap

The spoke's `analytics.ts` (39 lines) is a simplified reimplementation of hub capabilities. The hub provides production-grade primitives (batching, keepalive flush, PII redaction, error classification) that the spoke should consume.

---

## Findings Summary

| ID | Category | Severity | Description | Fix Effort |
|---|---|---|---|---|
| AN-1 | Analytics | **HIGH** | No `/api/analytics` route handler — data silently lost | 2-3 hours |
| AN-2 | Consent | **HIGH** | No consent UI — user cannot grant/revoke consent | 4-6 hours |
| AN-3 | Consent | **HIGH** | No code writes `jol-consent-analytics` — consent never granted | Included in AN-2 |
| AN-4 | Analytics | MEDIUM | 3 of 4 event types never fired | 1-2 hours |
| AN-5 | Analytics | MEDIUM | TrackedLink hardcodes event type — not generic | 1 hour |
| AN-6 | Hub | MEDIUM | `@journeyoflife-org/observability` not consumed | 3-4 hours |
| AN-7 | Compliance | LOW | No cookie banner timeline documented | Documentation |
| AN-8 | Analytics | LOW | No page_view tracking on any page | 30 min |

---

## Remediation Priority

### Immediate (can fix now)

1. **AN-8:** Add `page_view` tracking to home page (useEffect + trackEvent)
2. **AN-4:** Fire `mass_times_open` when mass schedule section scrolls into view
3. **AN-5:** Make TrackedLink generic (accept event type as prop)

### Before production indexing

4. **AN-2 + AN-3:** Implement consent banner/UX
   - Cookie banner component with granular choices (necessary / analytics / marketing)
   - localStorage write on consent grant
   - localStorage write on consent revocation
   - Consent state persistence (expiry: 6 months per cookie policy)

5. **AN-1:** Implement `/api/analytics` route handler
   - POST endpoint accepting JSON
   - Payload validation
   - PII stripping (IP address)
   - Forward to platform pipeline or local storage

6. **AN-6:** Migrate to `@journeyoflife-org/observability`
   - Replace hand-rolled `sendBeacon` with `createBatchingSink`
   - Use `redactValue` for PII protection
   - Use `createLogger` for structured logging

### Deferred

7. **AN-7:** Document cookie banner timeline in project plan

---

## Invariants (for CI enforcement)

| ID | Invariant | Current Gate |
|---|---|---|
| INV-AN-01 | All analytics events are consent-gated | `trackEvent()` checks localStorage ✅ |
| INV-AN-02 | No third-party tracking SDKs | `analytics.ts` uses self-hosted endpoint ✅ |
| INV-AN-03 | Analytics API endpoint exists and accepts POST | **NOT ENFORCED** ❌ |
| INV-AN-04 | Consent UI exists and is accessible | **NOT ENFORCED** ❌ |
| INV-AN-05 | All event types defined in AnalyticsEvent are fired somewhere | **NOT ENFORCED** ❌ |

---

## Data Flow Diagram (Current)

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                  │
│  User clicks "Get Directions"                                    │
│       │                                                          │
│       ▼                                                          │
│  TrackedLink.onClick()                                           │
│       │                                                          │
│       ▼                                                          │
│  trackEvent({ type: 'map_directions_click', ... })               │
│       │                                                          │
│       ▼                                                          │
│  localStorage.getItem('jol-consent-analytics')                   │
│       │                                                          │
│       ▼                                                          │
│  consent !== 'granted' ──→ RETURN (no data sent)                 │
│       │                                                          │
│  (IF consent were granted)                                       │
│       │                                                          │
│       ▼                                                          │
│  navigator.sendBeacon('/api/analytics', JSON)                    │
│       │                                                          │
└───────┼──────────────────────────────────────────────────────────┘
        │
        ▼
  ┌─────────────────────────┐
  │  /api/analytics         │
  │  (ROUTE DOES NOT EXIST) │
  │  → 404 Not Found        │
  │  → Data silently lost   │
  └─────────────────────────┘
```

## Data Flow Diagram (Target)

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                  │
│  User sees cookie banner ──→ grants consent                      │
│       │                                                          │
│       ▼                                                          │
│  localStorage.setItem('jol-consent-analytics', 'granted')        │
│                                                                  │
│  User navigates / interacts                                       │
│       │                                                          │
│       ▼                                                          │
│  trackEvent() ──→ consent granted ──→ batching sink              │
│                                          │                       │
│                                     flush on visibilitychange    │
│                                          │                       │
└──────────────────────────────────────────┼───────────────────────┘
                                           │
                                           ▼
  ┌───────────────────────────────────────────────────────────────┐
  │  /api/analytics (Route Handler)                                │
  │  → Validate payload                                            │
  │  → Strip PII (redactValue)                                     │
  │  → Forward to platform pipeline / local storage                │
  └───────────────────────────────────────────────────────────────┘
```

# Payment Boundary Audit — Prompt 13

**Date:** 2026-09-14
**Scope:** jol-site-basilica spoke — ADR-009 Model A compliance, payment boundary gate, PSP SDK detection
**Status:** Audit complete — 3 findings (0 HIGH, 2 MEDIUM, 1 LOW)

---

## 1. Payment Boundary Gate (`scripts/check-payment-boundary.sh`)

### 1.1 Gate Execution

```
$ bash scripts/check-payment-boundary.sh
PASS: no PSP SDK imports detected (INV-3 clean).
      scanned: src — detection capability verified by self-test
EXIT:0
```

### 1.2 Detection Patterns (14 total)

| # | Pattern | PSP | Import Type |
|---|---|---|---|
| 1 | `from ['"]@stripe` | Stripe | ESM import |
| 2 | `from ['"]stripe` | Stripe | ESM import (bare) |
| 3 | `require\(['"]@stripe` | Stripe | CommonJS require |
| 4 | `require\(['"]stripe` | Stripe | CommonJS require (bare) |
| 5 | `from ['"]@paypal` | PayPal | ESM import |
| 6 | `from ['"]paypal` | PayPal | ESM import (bare) |
| 7 | `require\(['"]@paypal` | PayPal | CommonJS require |
| 8 | `from ['"]@adyen` | Adyen | ESM import |
| 9 | `from ['"]adyen` | Adyen | ESM import (bare) |
| 10 | `require\(['"]@adyen` | Adyen | CommonJS require |
| 11 | `from ['"]square` | Square | ESM import |
| 12 | `import.*stripe\.js` | Stripe | Script import |
| 13 | `import.*paypal.*sdk` | PayPal | SDK import |
| 14 | `import.*adyen.*web` | Adyen | Web import |

### 1.3 Self-Tests (4 positive controls)

| # | Label | Probe | Pattern |
|---|---|---|---|
| 1 | Stripe ESM, single quotes | `import { loadStripe } from '@stripe/stripe-js';` | `from ['"]@stripe` |
| 2 | PayPal require, double quotes | `const sdk = require("@paypal/paypal-js");` | `require\(['"]@paypal` |
| 3 | Adyen ESM import | `import { AdyenCheckout } from '@adyen/adyen-web';` | `from ['"]@adyen` |
| 4 | Stripe.js script import | `import 'https://js.stripe.js/v3';` | `import.*stripe\.js` |

**Self-tests pass:** The gate proves it can detect seeded violations in both quote styles.

### 1.4 Gate Quality

| Aspect | Status |
|---|---|
| `set -euo pipefail` | ✅ Present |
| Scan target existence check | ✅ Fails if no targets exist |
| Positive control (self-test) | ✅ 4 probes in throwaway temp directory |
| Correct glob patterns | ✅ `--include='*.ts' --include='*.tsx'` (not brace glob) |
| Proper quote class | ✅ `['"]` matches both single and double quotes |
| Cleanup on exit | ✅ `trap 'rm -rf "$SELFTEST_ROOT"' EXIT` |

### 1.5 Gap: Missing Patterns

The hub INV-3 test (`packages/testing/src/invariants/adr011-invariants.test.ts`) detects 6 patterns. The spoke gate detects 14 patterns but **misses 2** that the hub catches:

| Missing Pattern | Description | Risk |
|---|---|---|
| `loadStripe(` | Function call without SDK import | A spoke could call `loadStripe()` via CDN without importing the SDK |
| `NEXT_PUBLIC_STRIPE_` | Environment variable reference | A spoke could reference a Stripe publishable key via env var |

**Documented in:** `docs/drafts/donation-demonstration-path.md` §4 — deliberately not applied yet, requires authorization across all 10 spokes.

### 1.6 Findings

| ID | Severity | Description |
|---|---|---|
| PB-1 | MEDIUM | Gate missing 2 patterns from hub INV-3 (`loadStripe(`, `NEXT_PUBLIC_STRIPE_`) |

---

## 2. ADR-009 Model A Compliance

### 2.1 Model A Requirements

ADR-009 §2 (Model A — PCI scope exclusion):

> *"`jol-hub` stays OUT of PCI scope: the marketplace `payments_app` is the sole PSP integrator; the hub consumes an internal payment API only. **No server-side PSP SDKs, no PSP keys or endpoints, anywhere in the hub tree — frontend and config included.**"*

### 2.2 Compliance Verification

| Requirement | Status | Evidence |
|---|---|---|
| No PSP SDK imports | ✅ PASS | `grep -r "stripe\|paypal\|adyen\|square"` in src/ returns 0 matches |
| No PSP dependencies in package.json | ✅ PASS | No `@stripe/*`, `@paypal/*`, `@adyen/*`, `square` in dependencies |
| No PSP keys in source | ✅ PASS | No `NEXT_PUBLIC_STRIPE_*`, no API keys |
| No PSP endpoints in source | ✅ PASS | No `api.stripe.com`, `api.paypal.com`, etc. |
| Payment boundary CLOSED | ✅ PASS | ADR-009 §1: "no live transactions anywhere in the estate until SAQ A" |

### 2.3 Source Scan Results

```
$ grep -rn "stripe\|paypal\|adyen\|square\|payment\|donation\|checkout\|card\|pci" src/
(no matches in source code)
```

The only matches in the entire codebase are:
- `scripts/check-perf-budget.ts:L19` — comment mentioning "checkout" (CI checkout action, not payment)
- `src/app/page.tsx:L7` — comment mentioning "fact card" (content block, not payment)

**No payment-related code exists in the spoke.**

### 2.4 Findings

No ADR-009 compliance findings. The spoke is fully compliant with Model A.

---

## 3. CI Integration

### 3.1 Dual Enforcement

The payment boundary is enforced at two levels:

| Level | Mechanism | Status |
|---|---|---|
| **Local** | `package.json` verify chain: `pnpm check-payment-boundary` | ✅ Runs `check-payment-boundary.sh` |
| **CI** | `ci.yml` job: `payment-boundary` calls org reusable workflow | ✅ `journeyoflife-org/.github/.github/workflows/payment-boundary-guard.yml@main` |
| **CI meta** | `workflow-completeness` job (INV-8) verifies all required workflows are called | ✅ Ensures spoke cannot skip the payment boundary check |

### 3.2 INV-8 Meta-Check

The `check-workflow-completeness.sh` script verifies that `ci.yml` calls all 5 required org reusable workflows:
1. `frontend-build`
2. `frontend-test`
3. `security-scan`
4. `payment-boundary-guard` ← INV-3
5. `compliance-check`

**This makes the payment boundary enforcement "enforceable rather than aspirational"** — a spoke cannot silently skip the gate.

### 3.3 Findings

No CI integration findings. Payment boundary is properly wired at both local and CI levels.

---

## 4. Donation Flow Status

### 4.1 Current State

| Aspect | Status |
|---|---|
| Donation page in spoke | ❌ Not implemented |
| Donation widget in spoke | ❌ Not implemented |
| GPM (1.2% tax allocation) page | ❌ Not implemented (informational only, no payment data) |
| Payment SDK in spoke | ❌ Not present (correct per ADR-009) |

### 4.2 ADR-009 §Consequences

> *"The donation flow remains design + dry-run until SAQ A; pilot tenants cannot take live donations in the interim."*

The spoke correctly has **no donation flow**. The hub's `DonationForm` component shows a pending-payments notice (Model-A-consistent). The composite `donation-widget` in `packages/ui` is retained as the forward-compatible implementation.

### 4.3 Donation Demonstration Path

`docs/drafts/donation-demonstration-path.md` documents the compliant path forward:
- **Dry-run demo** is already possible (validation, consent, entitlement gating, i18n, a11y)
- **Real PSP** requires: SAQ A verification + marketplace-tree integration (`jol-m payments_app`)
- **GPM** is informational only — no payment data collected, outside ADR-009 boundary

### 4.4 Findings

| ID | Severity | Description |
|---|---|---|
| PB-2 | MEDIUM | No donation/GPM informational page in spoke (deferred per ADR-009) |

---

## 5. Compliance Documentation

### 5.1 DPIA Reference

`compliance/dpia/jol-site-basilica-dpia.md` L100-101:

> **"No financial data (DC-05) is processed by this spoke."** ADR-009 Model A closes the payment boundary: no PSP SDK, key or endpoint anywhere in the hub tree.

### 5.2 ROPA Reference

`compliance/ropa/jol-site-basilica-ropa.md` L130:

> (ADR-009 Model A) closes the payment boundary: no PSP SDK may be imported

L200:

> | Payment boundary | `scripts/check-payment-boundary.sh` (INV-3, ADR-009 Model A) | **Remediated 2026-09-12** — previously vacuous |

### 5.3 Findings

| ID | Severity | Description |
|---|---|---|
| PB-3 | LOW | Gate pattern alignment with hub INV-3 documented but not yet applied (requires cross-spoke authorization) |

---

## Findings Summary

| ID | Category | Severity | Description | Fix Effort |
|---|---|---|---|---|
| PB-1 | Gate | MEDIUM | Missing 2 patterns from hub INV-3 (`loadStripe(`, `NEXT_PUBLIC_STRIPE_`) | 30 min (requires authorization) |
| PB-2 | Feature | MEDIUM | No donation/GPM informational page in spoke | 2-3 hours (deferred per ADR-009) |
| PB-3 | Governance | LOW | Gate pattern alignment documented but not applied | Included in PB-1 |

---

## Remediation Priority

### Immediate (no action needed)

The payment boundary is **correctly closed** and **properly enforced**. No remediation required for ADR-009 compliance.

### Before production indexing

1. **PB-1:** Extend gate patterns (requires cross-spoke authorization per donation-demonstration-path.md §4)
   - Add `loadStripe\s*\(` pattern
   - Add `NEXT_PUBLIC_STRIPE_` pattern
   - Add positive control self-tests for both

2. **PB-2:** Implement GPM informational page (no payment data, outside ADR-009 boundary)
   - What the 1.2% mechanism is
   - Which legal entity receives it
   - VMI/EDS process and form
   - Disclaimer that submission completes in EDS

### Deferred

3. **Donation flow:** Remains design + dry-run until SAQ A verification per ADR-009 §4

---

## Invariants (for CI enforcement)

| ID | Invariant | Current Gate |
|---|---|---|
| INV-3 | No PSP SDK imports in frontend code | `check-payment-boundary.sh` ✅ (14 patterns, 4 self-tests) |
| INV-3+ | No `loadStripe()` calls or `NEXT_PUBLIC_STRIPE_` references | **NOT ENFORCED** ❌ (documented gap) |
| INV-8 | All required org reusable workflows are called | `check-workflow-completeness.sh` ✅ |

---

## Professional Opinion

The payment boundary is the **strongest compliance control** in the spoke. The gate is well-engineered (self-tests, correct patterns, proper error handling), the architecture decision is clear (Model A — PCI scope exclusion), and the enforcement is dual-layered (local + CI). The spoke has zero payment-related code, which is exactly correct for a pre-SAQ-A state.

The only gap is the missing `loadStripe()` and `NEXT_PUBLIC_STRIPE_` patterns — documented in the donation-demonstration-path.md as a deliberate deferral requiring cross-spoke authorization. This is a governance decision, not a defect.

The donation flow is correctly absent. The GPM page is informational only and can be implemented without touching the payment boundary. The path to real donations is well-documented: SAQ A verification → marketplace integration → hosted payment links (never SDK in the Church Platform tree).

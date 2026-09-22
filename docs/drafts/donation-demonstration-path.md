# DRAFT — Donation Demonstration Path: closing O-021 and conforming to ADR-009

> **Status: PROPOSED — requires platform-owner disposition.**
> Prepared in `jol-site-basilica` because that is the repository the current
> work is authorised in. On ratification the O-021 closure belongs beside
> `jol-hub/docs/decisions/DONATION-WIDGET-DISPOSITION-O-021.md`.
> **`jol-hub` has not been modified.**

**Governing:** ADR-009 (payment boundary CLOSED, Model A), ADR-010 (guard and
exemption discipline), ADR-011 INV-3, O-021 adjudication (2026-08-28).

---

## 1. Correction: there is no ADR-007, and the payment authority is ADR-009

Live code comments cite an ADR that does not exist:

- `template-renderer/src/components/commerce/DonationForm.tsx:10` — *"Until
  **ADR-007** lands (payments pending) the submit path shows the pending
  notice"*
- `template-renderer/src/components/commerce/DonationForm.tsx:164` —
  *"**ADR-007** (payments pending): the charge path is not wired yet"*
- `packages/ui/src/components/composite/donation-widget/` header — cites
  "ADR-007"

Both governance records already establish this citation is phantom:

- **ADR-009 §Lineage:** *"QODER.md cited 'ADR-005 / ADR-007' — no payment ADR
  exists under either number in jol-hub … **ADR-007 exists in no repo**."*
- **O-021 §1:** *"no `ADR-007-*.md` exists in `docs/decisions/` (registry:
  001, 002, 008, 009, 010) … presumed superseded/uncommitted ancestor of
  ADR-009. **The live governance instrument is ADR-009.**"*

Verified 2026-09-13: `jol-hub/docs/decisions/` contains ADR-001, 002, 008,
009, 010, 011. No ADR-003 through ADR-007.

**Proposed correction:** every "ADR-007" citation in code and docs is replaced
with **ADR-009**. Do **not** create a new ADR-007 — doing so would resurrect
the exact numbering collision ADR-009 §Lineage was written to close, and would
place a payments decision under a number that two governance records state has
never existed. Any genuinely new payments decision takes the next free number
(**ADR-012**).

This matters beyond tidiness: an engineer reading `DonationForm.tsx` today is
told to wait for a document that will never arrive, so the payment path looks
temporarily blocked rather than permanently gated on ADR-009 §4's SAQ A
condition.

---

## 2. Verified current state — O-021 appears already executed

O-021's header still reads *"RECOMMENDATION RECORDED — awaiting owner
disposition verdict (no code touched in this task)"*. That status is **stale**.
Verified 2026-09-13:

| O-021 step | Required | Observed | Status |
|---|---|---|---|
| **S1** unwire the two demo apps | `master-site/donate` and `parish-template` stop rendering `DonationWidget` | The production renderer module never consumed it; `DonationWidget` no longer exists to consume | **Executed / moot** |
| **S2** delete `packages/ui/src/components/donation/` and its `index.ts` exports | Directory and exports removed | `ls packages/ui/src/components/donation` → **No such file or directory**. `ui/src/index.ts:96` comment: *"Donation surface: the legacy PSP-integrated flat widget was **REMOVED** (O-021 …)"* | **Executed** |
| **S3** guard extension — PSP-import detection | Fail on `@stripe/*`, `loadStripe(`, `NEXT_PUBLIC_STRIPE_`, other PSP SDKs; falsification mandatory in both directions | `packages/testing/src/invariants/adr011-invariants.test.ts` INV-3 asserts exactly these patterns (`/loadStripe\s*\(/i`, `/NEXT_PUBLIC_STRIPE_/i`, `/from\s+["']@?stripe/i`) plus a forbidden-dependency check across all 12 manifests | **Executed** |
| Model-A-compliant seed retained | `composite/donation-widget/` preserved as the forward-compatible implementation | Directory **exists** | **Retained** |

Corroborating evidence that the hub tree is clean:

- No `@stripe/stripe-js`, `loadStripe(`, or `NEXT_PUBLIC_STRIPE_` anywhere in
  `frontend/packages/**` or `frontend/apps/**` source, **except inside the
  INV-3 invariant test itself** (which the scan correctly excludes via its
  `.test.` filter).
- No `stripe` dependency in `packages/ui/package.json`.
- The tenant-facing surface uses commerce `DonationForm` with an explicit
  pending-payments notice — Model-A-consistent, exactly as O-021 §1 recorded.

**Proposed disposition:** the owner formally **closes O-021 as executed**,
recording that S1–S3 were completed, rather than leaving a governance document
that describes a live PSP-integrated widget which no longer exists. An open
disposition item pointing at deleted code is an audit artefact that invites the
question "so which is it?".

---

## 3. What this means for the stakeholder demonstration

### 3.1 Donations can be demonstrated lawfully today — without any PSP

The existing dry-run path is complete and is the correct demonstration:

amount presets (5/10/20/50/100/custom) → frequency (one-time/monthly/annual) →
minimum-amount validation → anonymous option → tax-receipt eligibility →
**explicit GDPR consent checkbox gating submission** → tenant feature gating
(`donations` is a NORMAL/VIP entitlement, hidden entirely when absent) →
pending-payments notice.

That shows validation, consent capture, entitlement gating, i18n and
accessibility — the parts a stakeholder actually assesses — and it is what the
platform already does. **Recommend this as the demo path.**

### 3.2 A real PSP in test mode cannot live in the Church Platform tree

This is the constraint that governs any "live PSP test mode" request. ADR-009
§2 is absolute and does not distinguish test from live credentials:

> *"Model A — PCI scope exclusion. `jol-hub` stays OUT of PCI scope: the
> marketplace `payments_app` is the sole PSP integrator; the hub consumes an
> internal payment API only. **No server-side PSP SDKs, no PSP keys or
> endpoints, anywhere in the hub tree — frontend and config included.**"*

And ADR-009 §1: *"The pilot payment boundary is CLOSED … no live transactions
anywhere in the estate until the sole opening condition (4) is met"*, where §4
is *"**Sole opening condition: PCI-DSS SAQ A verification** … Nothing else
opens it."*

Consequences:

- A test-mode PSP **publishable key** is still a PSP key, and a
  `NEXT_PUBLIC_STRIPE_*` reference is now mechanically detected by the INV-3
  invariant test. Wiring it would fail the hub build.
- ADR-011 Context §6 records the segregation rule: `/opt/jol-m` is the
  Marketplace Tier-1 tree and **sole PSP integrator**; the Church Platform tree
  (`/opt/jol`) never contains PSP surface.
- ADR-009 §Consequences accepts the trade-off explicitly: *"the donation flow
  remains design + dry-run until SAQ A; pilot tenants cannot take live
  donations in the interim."*

### 3.3 The compliant route to a genuine end-to-end payment demonstration

If stakeholders must see a real card form and a real authorised test charge,
the only conformant topology is:

```
spoke / renderer  →  hub internal payment API  →  jol-m payments_app  →  Stripe
     (no SDK,           (no PSP key,               (sole PSP            (test mode)
      no key)            no endpoint)               integrator)
```

Two mechanisms preserve SAQ A eligibility, in order of preference:

1. **Stripe Payment Links** — a hosted URL minted server-side by
   `payments_app`. No SDK, no `js.stripe.com`, no key anywhere in the Church
   Platform tree. The spoke renders a link or redirect. Simplest conformant
   option for a demonstration.
2. **Stripe Checkout / hosted Elements** — the pattern the surviving
   `composite/donation-widget` already directs toward. Requires the redirect or
   hosted-field handoff to originate from `payments_app`.

Either way the Church Platform front-end receives **only a URL**, never a key
or an SDK. That is the whole point of Model A, and it is why the composite
widget — not the deleted flat widget — is the forward seed.

### 3.4 Prerequisites before any real PSP demonstration

1. **ADR-009 §4 opening condition:** PCI-DSS SAQ A verification, plus a
   change-controlled opening plan (issue, snapshot, rollback per SOC 2 CC8.1).
   Nothing else opens the boundary, including a demonstration deadline.
2. **PSD2 / SCA:** ADR-009 §Context notes SCA design is specified but *"not yet
   proven against a live PSP"*. A test-mode charge is the natural way to prove
   it — but inside `jol-m`, under its own governance.
3. **GDPR Art. 9 adjacency:** ADR-009 §Context flags donation × religious
   affiliation as compounded risk, and §Compliance requires the donation-flow
   spec's consent and retention controls to be verified before live flows. The
   spoke DPIA records no Art. 9(2) condition and no retention period, so this
   is unmet.
4. **Marketplace-tree governance:** O-021 §4 notes any port of
   `donation-validation.ts`, `stripe-error-mapping.ts` or
   `useDonationWidgetFlow.ts` into `jol-m` is *"a marketplace-tree task under
   ITS rules, never this one."*

### 3.5 The 1.2% GPM function is unaffected

GPM remains **informational only**: what the mechanism is, which legal entity
receives it, entity name and code, eligibility period, the official VMI/EDS
process and form, the current deadline, and an explicit disclaimer that
submission completes in EDS. No payment data is collected, so it sits outside
ADR-009's boundary entirely and outside the spoke DPIA's payment exclusion.
Recipient legal details must be verified per institution — not every basilica
can independently receive GPM support.

---

## 4. Recommended follow-on: align spoke gates with the hub INV-3 patterns

The hub invariant test detects six patterns. The spoke
`check-payment-boundary.sh` — repaired 2026-09-12/13 so that it actually scans
files — detects PSP import and require forms but **not** `loadStripe(` or
`NEXT_PUBLIC_STRIPE_`.

O-021 §3 specifies both, and §3 is now executed at hub level, so extending the
spoke gate is alignment with an enacted decision rather than a policy
invention. A spoke could reference a publishable key or call `loadStripe()` via
a CDN script tag without importing an SDK, and the current spoke gate would
pass it.

**Proposed:** add `/loadStripe\s*\(/i` and `/NEXT_PUBLIC_STRIPE_/i` to the
spoke gate pattern list, with matching positive-control cases. Deliberately
**not** applied yet — it changes what counts as a violation across all ten
spokes and should be authorised explicitly, ideally together with the O-021
closure so the two records agree.

---

## 5. Owner decision points

1. **Close O-021** as executed (S1–S3 verified complete), or direct otherwise.
2. **Correct the phantom "ADR-007" citations** in `DonationForm.tsx` and
   `composite/donation-widget/` to ADR-009. Hub change; requires approval.
3. **Confirm the demonstration path**: existing dry-run (recommended, no
   approval needed, lawful today) versus a real test-mode charge through
   `jol-m payments_app` (requires SAQ A verification first).
4. **Authorise the spoke gate extension** in §4.
5. **Confirm no new ADR-007 will be created**, and that any future payments
   decision takes ADR-012.

## 6. Proposed DECISION-LOG entry

Last existing entry verified as **D-065**; the ADR-011 amendment draft proposes
D-066 through D-070. This would follow as:

| ID | Decision |
|---|---|
| **D-071** | O-021 closed as executed — the PSP-integrated donation widget is removed from `@journeyoflife-org/ui`, the Model-A-compliant composite variant is retained as the forward seed, and the guard extension is implemented as the INV-3 invariant test. Phantom "ADR-007" citations in live code are corrected to ADR-009; no ADR-007 is created. Donation demonstration proceeds on the existing dry-run path; any real PSP interaction, including test mode, remains confined to the `jol-m` marketplace `payments_app` per ADR-009 §2 and is gated on SAQ A verification per §4. |

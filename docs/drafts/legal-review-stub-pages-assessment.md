# Legal Review of Stub Pages — Prompt 16

**Date:** 2026-09-14
**Scope:** Privacy policy, cookies policy, accessibility statement — GDPR, e-Privacy, EU Web Accessibility Directive compliance
**Status:** Assessment complete — 9 findings (2 HIGH, 4 MEDIUM, 3 LOW)

---

## 1. Current State

### 1.1 Legal Pages Overview

| Page | Directive | Status | Language | Tenant-Aware |
|---|---|---|---|---|
| Privacy (`/privacy`) | GDPR Art. 13/14 | ✅ Present | Lithuanian only | ✅ Yes |
| Cookies (`/cookies`) | e-Privacy (2002/58/EB) | ✅ Present | Lithuanian only | ✅ Yes |
| Accessibility (`/accessibility-statement`) | EU Directive 2016/2102 | ✅ Present | Lithuanian only | ✅ Yes |

### 1.2 Common Characteristics

- **All pages are stubs** — minimal content with amber legal-review warning banners
- **All pages are Lithuanian-only** — no English or Russian translations
- **All pages reference fixture data** — tenant name, address, email (tenant-aware)
- **All pages have legal-review banners** — explicit "requires lawyer review" warnings
- **Phase 8A already fixed factual errors** — removed false Google Analytics cookies, false NVDA/VoiceOver/TalkBack testing claims, false cookie banner promise

---

## 2. Privacy Policy Assessment (GDPR Art. 13/14)

### 2.1 GDPR Art. 13 Requirements (Data Collected from Data Subject)

| Requirement | Status | Notes |
|---|---|---|
| Identity of controller | ✅ Present | Section 1: tenant name, address, email |
| Contact details of DPO | ❌ Missing | No Data Protection Officer mentioned |
| Purposes of processing | ✅ Present | Section 3: site operation, communication, analytics |
| Legal basis for processing | ❌ Missing | No mention of Art. 6 lawful basis (consent, legitimate interest, etc.) |
| Retention periods | ❌ Missing | No mention of how long data is kept |
| Data subject rights | ✅ Present | Section 4: all 6 GDPR rights listed |
| Right to withdraw consent | ❌ Missing | No mention of how to withdraw consent |
| Right to lodge complaint with DPA | ❌ Missing | No mention of Valstybinė duomenų apsaugos inspekcija (VDAI) |
| Source of data (if not from data subject) | N/A | Data collected directly from users |
| Automated decision-making | ✅ Present | No automated decision-making mentioned (correct) |

### 2.2 Findings

| ID | Severity | Description |
|---|---|---|
| PP-1 | HIGH | No legal basis for processing (Art. 6) — must specify consent, legitimate interest, etc. |
| PP-2 | HIGH | No retention periods — must specify how long each category of data is kept |
| PP-3 | MEDIUM | No DPO contact details — required if processing Art. 9 data (religious affiliation) |
| PP-4 | MEDIUM | No mention of right to withdraw consent — must explain how to withdraw |
| PP-5 | MEDIUM | No mention of right to lodge complaint with DPA (VDAI) — required by Art. 13(2)(d) |

### 2.3 What Requires Lawyer Review

1. **Legal basis for each processing activity** — lawyer must determine Art. 6 basis (consent vs legitimate interest vs contract)
2. **Retention periods** — lawyer must specify retention for each data category
3. **DPO requirement** — lawyer must determine if DPO is required (Art. 37) given potential Art. 9 processing
4. **Art. 9 adjacency** — religious organization × personal data may trigger special category protections

---

## 3. Cookies Policy Assessment (e-Privacy Directive 2002/58/EB)

### 3.1 e-Privacy Requirements

| Requirement | Status | Notes |
|---|---|---|
| Explanation of cookies | ✅ Present | Section 1: what cookies are |
| List of cookies used | ✅ Present | Section 2: session_id, cookie_consent (necessary), analytics (with consent) |
| Purpose of each cookie | ✅ Present | Section 2: session management, consent state, analytics |
| Duration of each cookie | ✅ Present | Section 2: session (session_id), 6 months (cookie_consent) |
| Consent mechanism | ✅ Present | Section 4: localStorage consent gate explained |
| How to manage cookies | ✅ Present | Section 3: browser settings + aboutcookies.org link |
| Third-party cookies | ✅ Present | Section 2: "no third-party cookies" explicitly stated |

### 3.2 Findings

| ID | Severity | Description |
|---|---|---|
| CP-1 | MEDIUM | Cookie banner not yet implemented — consent mechanism is localStorage only (no UI) |
| CP-2 | LOW | Cookie names are illustrative — `session_id` and `cookie_consent` are not actual cookie names (actual: `jol-consent-analytics` in localStorage) |

### 3.3 What Requires Lawyer Review

1. **Consent mechanism adequacy** — lawyer must determine if localStorage consent gate meets e-Privacy Art. 5(3) requirements
2. **Cookie banner requirement** — lawyer must confirm if visual consent UI is required before analytics can be collected

---

## 4. Accessibility Statement Assessment (EU Directive 2016/2102)

### 4.1 EU Directive 2016/2102 Requirements

| Requirement | Status | Notes |
|---|---|---|
| Commitment to accessibility | ✅ Present | Section 1: commitment to WCAG 2.2 AA |
| Compliance status | ✅ Present | Section 2: "partially compliant" with WCAG 2.2 AA |
| List of accessibility features | ✅ Present | Section 2: semantic HTML, ARIA, keyboard nav, contrast, alt text, responsive, skip link |
| Known accessibility gaps | ✅ Present | Section 3: placeholder images, PDF documents |
| Feedback mechanism | ✅ Present | Section 4: email + postal address, 14-day response time |
| Enforcement procedure | ✅ Present | Section 5: Lygių galimybių kontrolieriaus tarnyba (lygybe.lt) |
| Technical information | ✅ Present | Section 6: HTML5, CSS3, JavaScript, WCAG 2.2 AA target |
| Date of statement | ✅ Present | "Paskutinis atnaujinimas: 2026 m. rugsėjo 13 d." |
| Test method | ❌ Missing | No mention of how compliance was tested (automated, manual, AT testing) |

### 4.2 Findings

| ID | Severity | Description |
|---|---|---|
| AS-1 | LOW | No test method mentioned — must specify how compliance was assessed (automated source-level checks, manual testing, AT testing) |
| AS-2 | LOW | Statement claims "partially compliant" but no formal audit has been completed — should be "not yet assessed" or remove compliance claim |

### 4.3 What Requires Lawyer Review

1. **WAD applicability** — lawyer must determine if Web Accessibility Directive applies to religious organizations (Art. 1(4) exemption for "non-profit" content)
2. **Compliance status accuracy** — lawyer must confirm if "partially compliant" claim is accurate or if statement should say "not yet assessed"

---

## 5. Cross-Cutting Issues

### 5.1 Language Coverage

| Issue | Severity | Description |
|---|---|---|
| LG-1 | HIGH | All legal pages are Lithuanian-only — site supports lt, en, ru per fixture schema |

**Impact:** English and Russian-speaking users cannot access legal information. This may violate:
- GDPR Art. 12 (transparent communication in "concise, transparent, intelligible and easily accessible form" — language not specified but must be accessible to data subject)
- EU Directive 2016/2102 (accessibility statement must be accessible to all users)

### 5.2 Tenant-Awareness

All three pages correctly reference fixture data:
- `fixture.name` → tenant name
- `fixture.identity?.address` → tenant address
- `fixture.identity?.email` → tenant contact email

This is correct — legal pages must be tenant-specific, not platform-generic.

### 5.3 Legal-Review Banners

All three pages have amber banners stating:
- Privacy: "Ši privatumo politika yra parengiamoji ir turi būti peržiūrėta teisininkų prieš paskelbiant viešai."
- Cookies: "Ši slapukų politika yra parengiamoji ir turi būti peržiūrėta teisininkų prieš paskelbiant viešai."
- Accessibility: "Šis prieinamumo pareiškimas yra parengiamasis ir turi būti peržiūrėtas prieš paskelbiant viešai."

This is correct — explicit warnings that pages require legal review before publication.

---

## 6. Findings Summary

| ID | Category | Severity | Description | Fix Effort |
|---|---|---|---|---|
| PP-1 | Privacy | HIGH | No legal basis for processing (Art. 6) | Lawyer review |
| PP-2 | Privacy | HIGH | No retention periods | Lawyer review |
| PP-3 | Privacy | MEDIUM | No DPO contact details | Lawyer review |
| PP-4 | Privacy | MEDIUM | No mention of right to withdraw consent | Lawyer review |
| PP-5 | Privacy | MEDIUM | No mention of right to lodge complaint with DPA (VDAI) | Lawyer review |
| CP-1 | Cookies | MEDIUM | Cookie banner not yet implemented | 2-3 hours |
| CP-2 | Cookies | LOW | Cookie names are illustrative, not actual | 30 min |
| AS-1 | Accessibility | LOW | No test method mentioned | 30 min |
| AS-2 | Accessibility | LOW | "Partially compliant" claim may be inaccurate | Lawyer review |
| LG-1 | Cross-cutting | HIGH | All legal pages are Lithuanian-only | 4-6 hours |

---

## 7. Remediation Priority

### 7.1 Requires Lawyer Review (Cannot Fix Technically)

1. **PP-1:** Determine Art. 6 legal basis for each processing activity
2. **PP-2:** Specify retention periods for each data category
3. **PP-3:** Determine if DPO is required (Art. 37) given potential Art. 9 processing
4. **PP-4:** Explain how to withdraw consent
5. **PP-5:** Add right to lodge complaint with VDAI (Valstybinė duomenų apsaugos inspekcija)
6. **AS-2:** Confirm if "partially compliant" claim is accurate
7. **WAD applicability:** Determine if Web Accessibility Directive applies to religious organizations

### 7.2 Can Fix Technically (Before Lawyer Review)

8. **CP-1:** Implement cookie banner (consent UI) — 2-3 hours
9. **CP-2:** Update cookie names to match actual implementation (`jol-consent-analytics`) — 30 min
10. **AS-1:** Add test method section (automated source-level checks, manual testing planned) — 30 min
11. **LG-1:** Add English and Russian translations — 4-6 hours (requires translation)

### 7.3 Deferred

12. **PDF accessibility** — no PDFs published yet
13. **Full AT testing** — requires assistive technology testing infrastructure

---

## 8. Professional Opinion

The legal pages are **structurally sound** — they reference fixture data correctly, have legal-review warning banners, and Phase 8A already fixed factual errors. However, they are **substantively incomplete** — missing GDPR Art. 6 legal basis, retention periods, DPO contact, and other required elements.

**Critical gaps requiring lawyer review:**
1. Legal basis for processing (Art. 6) — must specify consent, legitimate interest, etc.
2. Retention periods — must specify how long each data category is kept
3. DPO requirement — may be required if processing Art. 9 data (religious affiliation)
4. WAD applicability — lawyer must determine if directive applies to religious organizations

**High-severity technical gap:**
- All legal pages are Lithuanian-only — site supports lt, en, ru per fixture schema. This may violate GDPR Art. 12 (transparent communication) and EU Directive 2016/2102 (accessibility).

**What can be fixed technically:**
- Cookie banner implementation (2-3 hours)
- Cookie name accuracy (30 min)
- Accessibility test method section (30 min)
- English and Russian translations (4-6 hours, requires translation)

**Recommendation:** Engage a lawyer specializing in Lithuanian data protection law to review the privacy policy and determine Art. 6 legal bases, retention periods, DPO requirement, and WAD applicability. Simultaneously, implement the cookie banner and add English/Russian translations.

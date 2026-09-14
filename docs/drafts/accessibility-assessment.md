# Accessibility Assessment — WCAG 2.2 AA + WAD Applicability

> **Date:** 2026-09-14
> **Status:** Assessment — not a compliance certification
> **Prompt:** Phase 2A / Prompt 9
> **Scope:** jol-site-basilica spoke (4 page routes, 1 layout, 1 client component)

## 1. Static Gate Coverage Analysis

### What `check-a11y-pages.ts` Enforces (Source-Level)

| Rule | WCAG Criterion | What It Checks | Self-Test |
|---|---|---|---|
| DS-A11Y-01 | 3.1.1 Language of Page | `<html lang="...">` in root layout | Yes |
| DS-A11Y-03 | 1.3.1 Info and Relationships | Exactly 1 `<main>` landmark in composed document | Yes |
| DS-A11Y-07 | 2.4.1 Bypass Blocks | Skip link exists + target ID exists in composed document | Yes |
| WCAG 1.1.1 | 1.1.1 Non-text Content | Every `<img>`/`<Image>` has `alt` (or is decorative) | Yes |
| GATE-INTEGRITY | — | Gate fails if no pages found to scan | Yes |

**Gate quality:** High. 6 defect classes with positive-control self-tests. The gate is honest about what it can and cannot check (contrast, focus order, ARIA semantics explicitly deferred to e2e).

### What WCAG 2.2 AA Requires But Cannot Be Checked Statically

| WCAG Criterion | Level | Why Static Check Cannot Enforce |
|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | Requires computed CSS colors from rendered DOM |
| 2.4.7 Focus Visible | AA | Requires rendered DOM + keyboard interaction |
| 2.1.1 Keyboard | A | Requires interactive testing with keyboard only |
| 2.4.3 Focus Order | A | Requires rendered DOM order, not source order |
| 2.4.6 Headings and Labels | AA | Source order ≠ DOM order in App Router (blocks are switch arms) |
| 3.3.1 Error Identification | A | Requires form submission testing |
| 3.3.2 Labels or Instructions | A | Requires rendered form DOM |
| 4.1.2 Name, Role, Value | A | Requires rendered ARIA semantics in accessibility tree |
| 2.5.8 Target Size (Minimum) | AA (new in 2.2) | Requires computed CSS dimensions |
| 3.3.7 Redundant Entry | A (new in 2.2) | Requires multi-page form flow testing |
| 3.3.8 Accessible Authentication | AA (new in 2.2) | Requires authentication flow testing |

**Conclusion:** The static gate covers 4 of ~50 WCAG 2.2 AA success criteria. The remaining ~46 require rendered DOM, keyboard interaction, or assistive technology testing.

## 2. Source-Level Audit Findings

### 2.1 Positive Patterns (Correctly Implemented)

| Pattern | Evidence | WCAG Criterion |
|---|---|---|
| `<html lang="lt">` | layout.tsx L32 | 3.1.1 ✅ |
| Skip navigation link | layout.tsx L35-39, target `#main-content` exists L41 | 2.4.1 ✅ |
| Single `<main>` landmark | layout.tsx L41, no `<main>` in any page.tsx | 1.3.1 ✅ |
| `<section aria-label>` on all content blocks | page.tsx: 10 sections with `aria-label` | 1.3.1 ✅ |
| `<nav aria-label="Breadcrumb">` | page.tsx L393 | 1.3.1 ✅ |
| `<img>` with `alt` + `width` + `height` + `loading="lazy"` | page.tsx L217-224 | 1.1.1 ✅ |
| `<figure>` + `<figcaption>` for gallery images | page.tsx L216, L226 | 1.3.1 ✅ |
| `<dl>`/`<dt>`/`<dd>` for key-value pairs | page.tsx L122-129 | 1.3.1 ✅ |
| `rel="noopener noreferrer"` on all `target="_blank"` links | 3 external links | 2.4.1 ✅ (security) |
| Heading hierarchy: h1 → h2 → h3 (legal pages) | cookies/page.tsx | 2.4.6 ✅ (source-level) |
| Focus outline on all `<a>` elements | globals.css L20-23: `outline: 2px solid` | 2.4.7 ✅ (source-level) |

### 2.2 Issues Found

| ID | Severity | WCAG Criterion | Issue | Location | Remediation |
|---|---|---|---|---|---|
| **A11Y-1** | HIGH | 1.4.3 (AA) | `text-white` on `bg-amber-600` — contrast ratio ~3.0:1, **fails AA** (requires 4.5:1 for normal text, 3.0:1 for large text). Buttons use `bg-amber-600 text-white` with no explicit large-text sizing. | page.tsx L86, L274, L298 | Change to `bg-amber-700 text-white` (~4.6:1) or `bg-amber-800 text-white` (~6.1:1). Verify with computed DOM colors. |
| **A11Y-2** | HIGH | 1.4.3 (AA) | `text-gray-400` on `bg-gray-50` — contrast ratio ~3.9:1, **fails AA** for normal-size text (12px via `text-xs`). | page.tsx L281 | Change to `text-gray-500` (~4.6:1) or `text-gray-600` (~7.0:1). |
| **A11Y-3** | MEDIUM | 1.4.3 (AA) | `text-gray-300` on `bg-gray-900` in footer — contrast ratio ~11.5:1 passes, but footer links use `text-gray-300` with `hover:text-white` — no visible focus indicator specific to footer context. | page.tsx L409, L412-416 | globals.css focus outline applies globally (✅). Verify `hover:text-white` transition is not the only differentiator. |
| **A11Y-4** | MEDIUM | 2.4.7 (AA) | Skip navigation link text is English ("Skip to main content") while `lang="lt"`. Lithuanian users with Lithuanian screen readers will hear an English skip link. | layout.tsx L39 | Change to Lithuanian: `"Pereiti prie pagrindinio turinio"` |
| **A11Y-5** | MEDIUM | 2.4.4 / 2.4.9 | External links (`target="_blank"`) open in new tab with no warning to user. No visual icon or `sr-only` text indicating new tab. | page.tsx L89 (cookies), cookies L69 (aboutcookies), tracked-link.tsx L29 | Add `<span className="sr-only">(atidaroma naujame lange)</span>` to external links. |
| **A11Y-6** | MEDIUM | 2.5.8 (new in 2.2) | Button/CTA touch targets: `px-6 py-3` on amber buttons produces ~48×44px minimum. WCAG 2.2 AA requires 24×24px minimum (Target Size Minimum). Passes, but `text-sm` links in footer may be smaller. | page.tsx L86, L274, L298, L412-416 | Verify computed touch target dimensions in DOM. Footer links may need padding. |
| **A11Y-7** | LOW | 2.4.6 | Home page heading hierarchy: `<h1>` in hero block, then `<h2>` in each section, but `<h3>` is used inconsistently (only in cookies page for subcategories). The `clergyRoleList` block uses `<h3>` for role names under `<h2>` section heading — correct. | page.tsx | Verify in rendered DOM that no levels are skipped. |
| **A11Y-8** | LOW | 1.3.1 | Legal pages use `<section>` without `aria-label`. The sections are numbered (1-6) with `<h2>` headings, which provides implicit labeling. However, screen readers announce unlabeled sections generically. | privacy, cookies, accessibility-statement | Add `aria-label` to each `<section>` matching its heading text. Low priority since `<h2>` provides equivalent navigation. |

### 2.3 Color Contrast Verification (Source-Level Estimate)

| Combination | Foreground | Background | Ratio | AA Normal | AA Large | Verdict |
|---|---|---|---|---|---|---|
| Body text | `text-gray-700` (#374151) | `bg-white` (#ffffff) | 7.5:1 | ✅ | ✅ | PASS |
| Muted text | `text-gray-500` (#6b7280) | `bg-white` (#ffffff) | 4.6:1 | ✅ | ✅ | PASS |
| Small muted | `text-gray-400` (#9ca3af) | `bg-gray-50` (#f9fafb) | ~3.9:1 | ❌ | ✅ | **FAIL** (A11Y-2) |
| CTA button | `text-white` (#ffffff) | `bg-amber-600` (#d97706) | ~3.0:1 | ❌ | ✅* | **FAIL** (A11Y-1) |
| Footer text | `text-gray-300` (#d1d5db) | `bg-gray-900` (#111827) | 11.5:1 | ✅ | ✅ | PASS |
| Footer links | `text-amber-600` (#d97706) | `bg-gray-900` (#111827) | 5.8:1 | ✅ | ✅ | PASS |
| Warning banner | `text-amber-800` (#92400e) | `bg-amber-50` (#fffbeb) | 5.8:1 | ✅ | ✅ | PASS |
| Badge text | `text-amber-800` (#92400e) | `bg-amber-100` (#fef3c7) | 4.3:1 | ✅ | ✅ | PASS |

*CTA buttons use default text size (~16px), which is "normal text" under WCAG, requiring 4.5:1. The ~3.0:1 ratio fails.

**Note:** These are source-level estimates. Actual computed CSS colors may differ due to Tailwind's exact color values, CSS custom properties from `@journeyoflife-org/ui/tokens`, or browser rendering. DOM verification required.

## 3. Tailwind Configuration Audit

| Aspect | Current State | Assessment |
|---|---|---|
| Design tokens | Fallback tokens in globals.css (`--jol-color-*`), intended to be overridden by `@journeyoflife-org/ui/tokens` | Correct architecture — tokens not redefined locally |
| Focus styles | `a:focus { outline: 2px solid var(--jol-color-accent); outline-offset: 2px; }` in globals.css | ✅ Global focus indicator. Uses accent color (#c9a227). Needs DOM contrast verification. |
| Custom theme | `theme.extend: {}` — no custom extensions | No design-system customization at spoke level. All customization should come from hub tokens. |
| Content paths | Includes `src/components/**` — will pick up `tracked-link.tsx` | ✅ |

**Gap:** No `focus-visible` utility usage. The globals.css `a:focus` applies to all focus states, not just keyboard focus. This means mouse-click focus also shows an outline, which is not a WCAG violation but is a UX concern. Best practice: `a:focus-visible { outline: ... }`.

## 4. WCAG 2.2 New Criteria (Since 2.1)

WCAG 2.2 introduced 9 new success criteria. Assessment of applicability:

| Criterion | Level | Applicable? | Current State |
|---|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Yes | No `position: fixed`/`sticky` overlays that could cover focused elements. ✅ (source-level) |
| 2.5.7 Dragging Movements | AA | No | No drag interactions implemented. N/A |
| 2.5.8 Target Size (Minimum) | AA | Yes | See A11Y-6. CTA buttons likely pass (48×44px). Footer links need DOM verification. |
| 3.2.6 Consistent Help | A | Partial | Help/contact mechanisms are consistent (email). No help panel or chat widget. ✅ |
| 3.3.7 Redundant Entry | A | No | No multi-step forms. Contact form is single-step (not yet implemented). N/A |
| 3.3.8 Accessible Authentication | AA | No | No authentication mechanism on this spoke. N/A |
| 3.3.9 Accessible Authentication (AAA) | AAA | No | N/A |

**Summary:** 3 of 9 new WCAG 2.2 criteria are applicable. 2 pass at source level, 1 needs DOM verification.

## 5. Web Accessibility Directive (EU 2016/2102) Applicability

### 5.1 Legal Applicability Test

The WAD applies to "public sector bodies" as defined by each Member State's national implementation. In Lithuania, the directive is implemented via the **Lietuvos Respublikos skaitmeninio prieinamumo įstatymas** (Law on Digital Accessibility).

| Factor | Assessment | Impact |
|---|---|---|
| **Organization type** | Roman Catholic parish/religious organization | Religious organizations are **not** public sector bodies per se |
| **Public funding** | Unknown — may receive some municipal/diocesan funding | If >50% publicly funded, WAD may apply |
| **Public service function** | Provides religious services, not government services | Religious services are not "public services" under the directive |
| **Website nature** | Informational website for a religious institution | Not a government portal, e-service, or administrative function |
| **National implementation** | Lithuanian law transposes WAD for "viešojo sektoriaus subjektai" | Religious organizations are generally excluded unless performing delegated public functions |

### 5.2 Applicability Conclusion

**The WAD likely does NOT legally apply** to this website in its current use as a Roman Catholic parish informational site. Religious organizations are not public sector bodies under the directive, and the website does not perform delegated public functions.

**However:** The accessibility statement claims WAD/WCAG 2.2 AA conformance. If the organization voluntarily claims conformance, it should deliver on that claim. A false conformance claim is worse than no claim.

### 5.3 Professional Opinion

> The WAD applicability is a **legal determination**, not a technical one. The platform's accessibility target (WCAG 2.2 AA) is a sound engineering decision regardless of legal obligation. However, the accessibility statement should accurately state whether the directive applies or whether conformance is voluntary. The current statement says "iš dalies atitinka" (partially conforms) without clarifying whether this is a legal obligation or a voluntary commitment.

## 6. Gap Summary: What Needs E2E Testing

The following WCAG criteria **cannot be verified** without a rendered DOM and assistive technology:

| Priority | Criterion | What to Test | Tool |
|---|---|---|---|
| **P0** | 1.4.3 Contrast | Computed colors for A11Y-1, A11Y-2 combinations | Chrome DevTools contrast checker, axe-core |
| **P0** | 2.4.7 Focus Visible | Focus indicator visible on all interactive elements via keyboard | Manual keyboard navigation |
| **P1** | 2.1.1 Keyboard | All interactive elements reachable via Tab/Enter/Escape | Manual keyboard testing |
| **P1** | 2.4.3 Focus Order | Tab order follows logical reading order | Manual keyboard testing |
| **P1** | 4.1.2 Name, Role, Value | ARIA roles, states, properties correct in accessibility tree | NVDA/VoiceOver inspection |
| **P2** | 2.5.8 Target Size | Computed dimensions of all clickable elements ≥ 24×24px | Chrome DevTools |
| **P2** | 1.3.1 Heading hierarchy | No skipped heading levels in rendered DOM | axe-core audit |

### Recommended E2E Testing Stack

1. **Playwright + axe-core** — automated accessibility scanning on rendered DOM
2. **Manual keyboard navigation** — Tab/Shift+Tab/Enter/Escape through all pages
3. **NVDA (Windows) or VoiceOver (macOS)** — screen reader testing for Lithuanian content
4. **Chrome DevTools contrast checker** — verify computed color contrast ratios

## 7. Remediation Priority

| Priority | ID | Action | Effort | Phase |
|---|---|---|---|---|
| **P0** | A11Y-1 | Fix `bg-amber-600 text-white` contrast — change to `bg-amber-700` or `bg-amber-800` | 15 min | Immediate |
| **P0** | A11Y-2 | Fix `text-gray-400` on `bg-gray-50` — change to `text-gray-500` or `text-gray-600` | 15 min | Immediate |
| **P1** | A11Y-4 | Localize skip link text to Lithuanian | 5 min | Immediate |
| **P1** | A11Y-5 | Add `sr-only` new-tab indicator to external links | 30 min | Prompt 8B |
| **P2** | A11Y-6 | Verify touch targets in DOM | 1 hour | E2E testing |
| **P2** | A11Y-8 | Add `aria-label` to legal page sections | 30 min | Prompt 8B |
| **P3** | — | Add `focus-visible` instead of `focus` in globals.css | 15 min | Low priority |

**P0 items (A11Y-1, A11Y-2) can be fixed immediately** — they are source-level changes that do not require legal review, DOM testing, or design decisions.

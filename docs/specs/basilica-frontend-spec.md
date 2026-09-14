# Basilica Frontend Product Specification

> **Status:** Draft (pending approval)
> **Version:** 1.0.0
> **Created:** 2026-09-14
> **Scope:** Roman Catholic Basilica template for the Journey of Life platform
> **Target:** ~20 page types consolidated into 16 core pages

## 1. Executive Summary

This specification defines the frontend product for a Roman Catholic Basilica template within the Journey of Life (JOL) hub-and-spoke architecture. The template serves as the canonical reference implementation for basilica-type spokes, providing a complete, accessible, and SEO-optimized web presence for parish basilicas.

**Key decisions:**
- 20 proposed page types consolidated into 16 core pages organized into 6 sections
- Hub-and-spoke architecture: shared rendering logic in hub packages, tenant-specific content in fixtures
- 3-locale parity (lt/en/ru) with Lithuanian as primary
- WCAG 2.1 AA accessibility compliance
- Structured data (JSON-LD) for SEO
- Tenant-driven customization via fixture data

## 2. Primary User Groups

| User Group | Primary Needs | Secondary Needs |
|---|---|---|
| **Parishioners** | Mass schedule, confession, sacraments, announcements | Events, news, parish services |
| **Visitors/Tourists** | Opening hours, visitor info, architecture, history | Location, gallery, contact |
| **Pilgrims** | Pilgrimage info, confession, spiritual services | Mass schedule, location |
| **Sacrament seekers** | Baptism/marriage requirements, contacts | Sacrament schedule, clergy |
| **Researchers/Media** | History, documents, contacts | Architecture, gallery |
| **Pastoral care seekers** | Confession, spiritual direction, counseling | Parish services, contact |
| **Donors/Supporters** | Donation info, GPM allocation | Parish services, events |

## 3. Pastoral and Business Goals

1. **Evangelization** — Share the Catholic faith, attract visitors and pilgrims
2. **Pastoral care** — Serve parishioners with sacraments, spiritual direction, and community
3. **Information** — Provide accurate schedules, events, and announcements
4. **Community building** — Foster parish life through news, events, and services
5. **Heritage preservation** — Document and share the basilica's history, architecture, and art
6. **Fundraising** — Enable donations and 1.2% GPM (Lithuanian tax allocation)
7. **Legal compliance** — GDPR privacy notices, cookie policy, accessibility statement

## 4. Information Architecture

### 4.1 Page Structure (16 Core Pages)

```
Home
├── About
│   ├── History
│   ├── Architecture & Art
│   └── Clergy & Staff
├── Worship
│   ├── Mass Schedule
│   ├── Confession Schedule
│   ├── Sacraments (Baptism, Marriage, etc.)
│   └── Liturgical Calendar
├── Community
│   ├── Parish Services
│   ├── Events
│   └── News
├── Visit
│   ├── Visitor Information
│   ├── Opening Hours
│   ├── Location & Directions
│   └── Pilgrimage
├── Gallery
├── Resources
│   └── Documents & Downloads
├── Support
│   └── Donations & GPM
├── Contact
├── FAQ
├── Search
└── Legal
    ├── Privacy
    ├── Cookies
    └── Accessibility Statement
```

### 4.2 Page Consolidation Rationale

| Original Proposal | Consolidated Into | Rationale |
|---|---|---|
| About the Basilica + History + Architecture + Clergy | **About** section with 3 subsections | Related content; reduces nav complexity |
| Mass schedule + Confession + Sacraments | **Worship** section with 4 subsections | Liturgical life is a coherent topic |
| Parish services + Events + News | **Community** section with 3 subsections | Parish life and activities |
| Visitor info + Hours + Location + Pilgrimage | **Visit** section with 4 subsections | Practical visitor information |
| Documents + Donations | **Resources** + **Support** sections | Separate informational vs. transactional |

### 4.3 Additional Pages

- **FAQ** — Common questions (mass times, confession, parking, accessibility)
- **Search** — Site-wide search (critical for 20+ pages)
- **404 Error** — Error handling with helpful navigation

## 5. Navigation Structure

### 5.1 Primary Navigation (Header)

```
[Logo] Basilica Name
├── Home
├── About ▼
│   ├── History
│   ├── Architecture & Art
│   └── Clergy & Staff
├── Worship ▼
│   ├── Mass Schedule
│   ├── Confession Schedule
│   ├── Sacraments
│   └── Liturgical Calendar
├── Community ▼
│   ├── Parish Services
│   ├── Events
│   └── News
├── Visit ▼
│   ├── Visitor Information
│   ├── Opening Hours
│   ├── Location & Directions
│   └── Pilgrimage
├── Contact
└── [Language: lt/en/ru] [Search icon]
```

### 5.2 Secondary Navigation

- **Breadcrumbs** on all pages (structured data + visual)
- **Footer:**
  - Contact info (address, phone, email)
  - Quick mass times reference
  - Social media links
  - Legal links (privacy, cookies, accessibility)
  - Copyright + EUPL-1.2 license

## 6. Content Model

### 6.1 Page Metadata

Every page requires:
- **title** (localized)
- **description** (localized, max 160 chars)
- **keywords** (localized)
- **og:image** (social sharing)
- **og:type** (website, article, event)
- **canonical URL**
- **hreflang** alternates (lt, en, ru, x-default)

### 6.2 Content Blocks

Pages are composed of typed content blocks from the tenant fixture:

| Block Type | Description | Used On |
|---|---|---|
| `hero` | Hero image + heading + subheading | Home, About, Visit |
| `text` | Rich text (HTML) | All pages |
| `image` | Single image with alt text | About, Gallery, History |
| `gallery` | Image grid | Gallery, About |
| `schedule` | Mass/confession times table | Worship |
| `map` | Embedded map (Google/OSM) | Visit, Contact |
| `contactForm` | Contact form (Bitrix24 CRM) | Contact |
| `faq` | FAQ accordion | FAQ, Sacraments |
| `eventList` | Event cards with dates | Events |
| `newsList` | News cards with dates | News |
| `documentList` | Downloadable documents | Resources |
| `donationWidget` | Donation info + GPM | Support |
| `clergyList` | Clergy cards with roles | Clergy & Staff |
| `sacramentList` | Sacrament info + requirements | Sacraments |
| `visitingInfo` | Opening hours + visitor info | Visit |

### 6.3 Localization

- **3 locales:** lt (primary), en, ru
- **Fallback:** lt → en → ru (Lithuanian-first)
- **All content blocks** support localized text via `LocalizedText` type
- **URL structure:** `/lt/...`, `/en/...`, `/ru/...` (or `/` for default lt)

## 7. Reusable Page Templates

| Template | Description | Used By |
|---|---|---|
| **Homepage** | Hero + featured content blocks | Home |
| **Content page** | Text + images + sections | About, History, Architecture, Clergy |
| **Schedule page** | Schedule table + text | Mass, Confession |
| **Listing page** | Cards + pagination + filters | Events, News |
| **Gallery** | Image grid + lightbox | Gallery |
| **Contact** | Form + map + contact info | Contact |
| **Legal** | Text + amber review banner | Privacy, Cookies, Accessibility |
| **FAQ** | Accordion + text | FAQ, Sacraments |
| **Search results** | Search input + results list | Search |

## 8. Required Components

### 8.1 From Hub Packages (Already Available)

- `Badge`, `Card`, `CardContent` from `@journeyoflife-org/ui`
- `TranslationProvider` from `@journeyoflife-org/i18n`
- SEO metadata builders from `@journeyoflife-org/seo`
- Block renderers from `@journeyoflife-org/renderer` (pending packaging)

### 8.2 New Components Needed

| Component | Description | Priority |
|---|---|---|
| `ScheduleTable` | Mass/confession times with `<time dateTime>` | P0 |
| `Gallery` | Image grid with lightbox | P0 |
| `MapEmbed` | Google Maps / OpenStreetMap embed | P0 |
| `ContactForm` | Form with Bitrix24 CRM integration | P1 |
| `DonationWidget` | GPM info + payment links | P1 |
| `EventCard` | Event listing with date, title, description | P1 |
| `NewsCard` | News listing with date, title, excerpt | P1 |
| `FAQAccordion` | Native `<details>` elements | P1 |
| `BreadcrumbNav` | Structured data + visual breadcrumb | P0 |
| `LanguageSwitcher` | lt/en/ru toggle | P0 |
| `SearchBar` | Site-wide search input | P1 |
| `ClergyCard` | Clergy member with photo, name, role, contact | P1 |
| `SacramentInfo` | Sacrament description + requirements | P1 |

## 9. Required Integrations

| Integration | Purpose | Package | Status |
|---|---|---|---|
| **Google Maps / OSM** | Location embed | Custom | Planned |
| **Bitrix24 CRM** | Contact form submissions | `@journeyoflife-org/bitrix-sdk` | Available |
| **Analytics** | Privacy-respecting tracking | `@journeyoflife-org/observability` | Available |
| **CMS** | Content management | TBD | Future |
| **Email** | Newsletter signup | TBD | Future |
| **Payment** | Donations (Stripe) | `@journeyoflife-org/commerce` | Requires legal approval |

## 10. SEO Requirements

### 10.1 Structured Data (JSON-LD)

Every page emits structured data via `@journeyoflife-org/seo`:

- **Church** — basilica identity, address, geo, parent organization
- **PlaceOfWorship** — worship location
- **Event** — mass schedules, special liturgies
- **BreadcrumbList** — navigation hierarchy
- **Organization** — parish organization info

### 10.2 Meta Tags

- `<title>` and `<meta name="description">` on every page
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`)
- Twitter Card tags
- `<link rel="canonical">` on every page
- `<link rel="alternate" hreflang="...">` for lt/en/ru

### 10.3 Sitemap

- Auto-generated XML sitemap at `/sitemap.xml`
- Includes all pages in all 3 locales
- Updated on content changes

### 10.4 Robots

- `noindex` until production-ready (already applied)
- `robots.txt` with sitemap reference

## 11. Accessibility Requirements

### 11.1 WCAG 2.1 AA Compliance

- **Semantic HTML:** proper heading hierarchy (h1 → h2 → h3), landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- **ARIA labels:** where semantic HTML is insufficient (e.g., icon-only buttons)
- **Keyboard navigation:** all interactive elements reachable via Tab
- **Focus states:** visible focus indicators (2px outline, high contrast)
- **Color contrast:** 4.5:1 minimum for normal text, 3:1 for large text
- **Image alt text:** all images require descriptive alt text
- **Skip links:** "Skip to main content" link (already exists)
- **Form labels:** all form inputs have associated `<label>`
- **Error messages:** clear, accessible error messages
- **Motion:** respect `prefers-reduced-motion`

### 11.2 Testing

- Automated: axe-core, Playwright accessibility tests
- Manual: keyboard navigation, screen reader (NVDA, VoiceOver)
- Continuous: integrated into CI pipeline

## 12. Tenant Customization Model

### 12.1 Shared Platform (Hub Packages)

| Component | Package | Responsibility |
|---|---|---|
| Block renderers | `@journeyoflife-org/renderer` | Render typed content blocks |
| UI components | `@journeyoflife-org/ui` | Card, Badge, Button, etc. |
| SEO utilities | `@journeyoflife-org/seo` | Metadata builders, JSON-LD |
| i18n infrastructure | `@journeyoflife-org/i18n` | Translation provider, locale resolution |
| Schedule display | `@journeyoflife-org/renderer` | ScheduleTable component |
| Gallery display | `@journeyoflife-org/renderer` | Gallery component |
| Map embed | `@journeyoflife-org/renderer` | MapEmbed component |

### 12.2 Basilica-Specific (Tenant Fixture)

| Data | Source | Example |
|---|---|---|
| Identity | `fixture.identity` | Name, address, phone, email |
| Content | `fixture.pages[].blocks[]` | History text, architecture description |
| Schedules | `fixture.schedules[]` | Mass times, confession times |
| Media | `fixture.gallery[]` | Images with alt text |
| Branding | `VERTICAL_FAMILY[fixture.vertical]` | Accent color (sacred = gold) |
| Clergy | `fixture.clergy[]` | Rector, priests, deacons |
| Documents | `fixture.documents[]` | Downloadable PDFs |

### 12.3 Customization Boundaries

**Tenant can customize:**
- All content (text, images, schedules)
- Contact information
- Accent color (via vertical → layout family mapping)
- Gallery images
- Documents

**Tenant cannot customize:**
- Page structure (16 core pages are fixed)
- Navigation structure (6 primary nav items)
- Component behavior (shared rendering logic)
- SEO strategy (structured data, hreflang)
- Accessibility features (WCAG compliance)

## 13. Implementation Phases

### Phase 1: Foundation (P0)

- [ ] Package TemplateRenderer into `@journeyoflife-org/renderer`
- [ ] Implement core components: ScheduleTable, Gallery, MapEmbed, BreadcrumbNav, LanguageSwitcher
- [ ] Build page templates: Homepage, Content, Schedule, Legal
- [ ] Implement Home, About, Worship, Visit pages
- [ ] Add structured data (JSON-LD) for all pages
- [ ] Ensure WCAG 2.1 AA compliance

### Phase 2: Community (P1)

- [ ] Implement Community section (Parish Services, Events, News)
- [ ] Build EventCard, NewsCard components
- [ ] Implement listing pages with pagination
- [ ] Add ContactForm with Bitrix24 integration
- [ ] Implement FAQ page

### Phase 3: Resources & Support (P2)

- [ ] Implement Resources section (Documents & Downloads)
- [ ] Implement Support section (Donations & GPM)
- [ ] Build DonationWidget component
- [ ] Add document download functionality

### Phase 4: Search & Polish (P3)

- [ ] Implement Search page with site-wide search
- [ ] Add 404 error page
- [ ] Performance optimization (LCP, CLS, FID)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

## 14. Success Criteria

- [ ] All 16 core pages render correctly for Vilnius Cathedral Basilica
- [ ] 3-locale parity (lt/en/ru) for all content
- [ ] WCAG 2.1 AA compliance (automated + manual testing)
- [ ] Structured data validates (Google Rich Results Test)
- [ ] PageSpeed Insights score ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] All content blocks from tenant fixture render correctly
- [ ] Contact form submits to Bitrix24 CRM
- [ ] Donation page displays GPM info correctly
- [ ] Gallery displays all images with proper alt text
- [ ] Maps embed correctly with correct coordinates

## 15. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| TemplateRenderer not packaged | Blocks spoke from consuming hub renderer | High | P0 priority; dedicated session |
| Missing images/media | Gallery, hero sections incomplete | Medium | Use placeholders; require parish license |
| Bitrix24 integration failure | Contact form doesn't submit | Medium | Fallback to mailto: link |
| Translation backlog (ru) | 3-locale parity incomplete | High | Disable ru until translations ready |
| Legal review pending | Privacy/cookies/accessibility non-compliant | High | Keep amber banners; don't publish until reviewed |
| Performance issues | Slow page loads, poor UX | Medium | Performance budget in CI; optimize images |

## 16. Dependencies

- `@journeyoflife-org/renderer` v1.0.0 (pending packaging)
- `@journeyoflife-org/ui` v1.0.0 (available)
- `@journeyoflife-org/seo` v1.1.0 (available)
- `@journeyoflife-org/i18n` v1.0.0 (available)
- `@journeyoflife-org/bitrix-sdk` v1.0.0 (available)
- `@journeyoflife-org/observability` v1.0.0 (available)
- `@journeyoflife-org/seed-data` v1.0.0 (available)

## 17. Sign-off

**Specification type:** Frontend product specification
**Created:** 2026-09-14
**Status:** Draft (pending approval)
**Next review:** After Phase 1 implementation

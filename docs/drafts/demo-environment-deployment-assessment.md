# Demo Environment Deployment Assessment — Prompt 15

**Date:** 2026-09-14
**Scope:** Deployment readiness, infrastructure requirements, indexing protection, demo environment path
**Status:** Assessment complete — 7 findings (3 HIGH, 2 MEDIUM, 2 LOW)

---

## 1. Current State

### 1.1 Deployment Configuration

| Aspect | Status | Notes |
|---|---|---|
| Framework | Next.js 14.2.0 App Router | SSR + static generation |
| Output | `.next/` directory | No static export configured |
| Dockerfile | ❌ NOT PRESENT | Spoke ships no container definition |
| Vercel config | ❌ NOT PRESENT | No `vercel.json` |
| Deploy script | ❌ NOT PRESENT | No `deploy.sh` or `rollback.sh` |
| CI/CD | ✅ EXISTS | `.github/workflows/ci.yml` (10 jobs) |
| Deploy workflow | ❌ NOT PRESENT | No `.github/workflows/deploy.yml` |

### 1.2 Environment Variables

**Required for demo:**

| Variable | Purpose | Current Value | Demo Value |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL base | `http://localhost:3000` | `https://demo-basilica.gyvenimo-kelias.lt` (or similar) |
| `NPM_TOKEN` | GitHub Packages auth | Not committed | Required for `pnpm install` |
| `NEXT_PUBLIC_TENANT_SLUG` | Tenant override | `basilica` | `basilica` (correct) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale | `lt` | `lt` (correct) |

**Not required for demo:**

| Variable | Purpose | Status |
|---|---|---|
| `BITRIX24_*` | CRM auth | Not needed (no CRM integration yet) |
| `HUB_API_URL` | Hub API | Not needed (no API calls yet) |
| `TENANT_API_KEY` | API auth | Not needed |
| `SENTRY_*` | Error tracking | Not needed for demo |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics | Not needed (consent-gated, dead code) |
| `NEXT_PUBLIC_PAYMENT_TEST_MODE` | Payment test mode | Not needed (payment boundary CLOSED) |

### 1.3 Indexing Protection (3-Layer Defense)

| Layer | Mechanism | Status | Coverage |
|---|---|---|---|
| **Layer 1** | `layout.tsx` meta robots | ✅ `index: false, follow: false` | HTML pages |
| **Layer 2** | `next.config.js` X-Robots-Tag header | ✅ `noindex, nofollow` | All resources (HTML, SVG, JSON) |
| **Layer 3** | `public/robots.txt` | ✅ `User-agent: * Disallow: /` | Crawler politeness |

**Assessment:** Defense-in-depth is complete. Demo environment will NOT be indexed by search engines.

---

## 2. Findings

| ID | Severity | Description |
|---|---|---|
| DE-1 | HIGH | No Dockerfile — spoke cannot be containerized for deployment |
| DE-2 | HIGH | No deploy workflow — no automated deployment path |
| DE-3 | HIGH | No deploy/rollback scripts — manual deployment only |
| DE-4 | MEDIUM | No demo hostname allocated — DNS/infra pending |
| DE-5 | MEDIUM | No environment-specific configuration — `.env.example` only |
| DE-6 | LOW | No health check endpoint — `/api/health` not implemented |
| DE-7 | LOW | No performance monitoring — Sentry not configured |

---

## 3. Deployment Options

### 3.1 Option A: Vercel (Recommended for Demo)

**Effort:** 2-3 hours
**Cost:** Free (Hobby) or $20/month (Pro)

| Step | Effort | Notes |
|---|---|---|
| 1. Create Vercel project | 10 min | Import from GitHub |
| 2. Configure env vars | 15 min | `NEXT_PUBLIC_SITE_URL`, `NPM_TOKEN` |
| 3. Configure build | 15 min | `pnpm build`, output `.next/` |
| 4. Deploy | 5 min | Automatic on push to `main` |
| 5. Configure domain | 30 min | `demo-basilica.vercel.app` or custom |

**Pros:**
- Zero infrastructure
- Automatic HTTPS
- Preview deployments per PR
- Edge network (global CDN)
- Free for demo

**Cons:**
- Vendor lock-in
- Not Proxmox (production target)
- Limited control over runtime

### 3.2 Option B: Docker + Proxmox (Production Target)

**Effort:** 6-8 hours
**Cost:** Infrastructure only (existing Proxmox)

| Step | Effort | Notes |
|---|---|---|
| 1. Create Dockerfile | 2 hours | Multi-stage build (Node 20 + pnpm) |
| 2. Create deploy.sh | 1 hour | Pull image, restart container |
| 3. Create rollback.sh | 30 min | Redeploy previous tag |
| 4. Configure nginx | 1 hour | Reverse proxy + HTTPS |
| 5. Configure DNS | 30 min | `demo-basilica.gyvenimo-kelias.lt` |
| 6. Create deploy workflow | 2 hours | GitHub Actions → Proxmox |

**Pros:**
- Matches production architecture
- Full control over runtime
- No vendor lock-in
- Can test immutable image tags

**Cons:**
- Significant effort
- Requires infrastructure access
- Manual HTTPS setup

### 3.3 Option C: Static Export + CDN

**Effort:** 3-4 hours
**Cost:** Free (GitHub Pages) or CDN cost

| Step | Effort | Notes |
|---|---|---|
| 1. Configure `output: 'export'` | 30 min | `next.config.js` |
| 2. Fix SSR-only features | 2 hours | Remove server components, API routes |
| 3. Deploy to CDN | 1 hour | GitHub Pages, Cloudflare Pages |

**Pros:**
- Cheapest option
- Fastest performance (static HTML)
- No server to maintain

**Cons:**
- Loses SSR benefits
- Cannot use server components
- Cannot use API routes
- Significant refactoring needed

---

## 4. Recommended Path: Vercel for Demo

### 4.1 Why Vercel

1. **Fastest path to demo** — 2-3 hours vs 6-8 hours for Docker
2. **Zero infrastructure** — no Proxmox access needed
3. **Automatic HTTPS** — no certificate management
4. **Preview deployments** — stakeholders can review PRs before merge
5. **Free for demo** — no cost until production

### 4.2 Implementation Steps

**Phase 1: Prepare (30 minutes)**

1. Create `vercel.json` (optional, for advanced config)
2. Add `NEXT_PUBLIC_SITE_URL` to Vercel env vars
3. Add `NPM_TOKEN` to Vercel secrets

**Phase 2: Deploy (30 minutes)**

1. Import GitHub repo to Vercel
2. Configure build settings:
   - Framework: Next.js
   - Build command: `pnpm build`
   - Output directory: `.next/`
   - Install command: `pnpm install --frozen-lockfile`
3. Deploy

**Phase 3: Verify (30 minutes)**

1. Check demo URL loads
2. Verify noindex headers present
3. Verify canonical URL points to demo (not production)
4. Test all pages render

**Phase 4: Share (15 minutes)**

1. Share demo URL with stakeholders
2. Document demo environment in README

### 4.3 Environment Configuration

**Vercel Environment Variables:**

```
NEXT_PUBLIC_SITE_URL=https://jol-site-basilica.vercel.app
NPM_TOKEN=<GitHub PAT with read:packages>
NEXT_PUBLIC_TENANT_SLUG=basilica
NEXT_PUBLIC_DEFAULT_LOCALE=lt
```

**Build Settings:**

```
Framework Preset: Next.js
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm install --frozen-lockfile
Node Version: 20.x
```

---

## 5. Production Deployment (Deferred)

### 5.1 What's Needed for Production

| Requirement | Status | Effort |
|---|---|---|
| Dockerfile | ❌ Missing | 2 hours |
| deploy.sh / rollback.sh | ❌ Missing | 1.5 hours |
| GitHub deploy workflow | ❌ Missing | 2 hours |
| Proxmox VM setup | ❌ Not started | 4 hours |
| nginx reverse proxy | ❌ Not started | 1 hour |
| HTTPS certificate | ❌ Not started | 30 min |
| DNS configuration | ❌ Not started | 30 min |
| Health check endpoint | ❌ Missing | 30 min |
| Monitoring (Sentry) | ❌ Not configured | 1 hour |

**Total effort:** 12-15 hours (production deployment)

### 5.2 When to Start Production Deployment

Production deployment should begin when:
1. ✅ Demo environment is live and validated
2. ✅ Legal review of stub pages is complete
3. ✅ Content approval workflow is established
4. ✅ TemplateRenderer packaging is complete
5. ✅ Parish sign-off is obtained

---

## 6. Risks

### 6.1 Demo Environment Risks

| Risk | Mitigation |
|---|---|
| Demo URL indexed by Google | 3-layer noindex defense (meta + header + robots.txt) |
| Canonical URL points to production | `NEXT_PUBLIC_SITE_URL` env var controls canonical |
| Secrets leaked in demo | No secrets in demo (no CRM, no API, no analytics) |
| Demo costs spiral | Vercel free tier is sufficient for demo |

### 6.2 Vercel-Specific Risks

| Risk | Mitigation |
|---|---|
| Vendor lock-in | Demo only; production uses Proxmox |
| NPM_TOKEN exposed | Vercel secrets are encrypted; token has read:packages only |
| Build minutes exhausted | Free tier includes 100 hours/month |

---

## 7. Recommendations

### 7.1 Immediate (Before Demo)

1. **Deploy to Vercel** — 2-3 hours, fastest path to demo
2. **Configure env vars** — `NEXT_PUBLIC_SITE_URL`, `NPM_TOKEN`
3. **Verify noindex** — Check all 3 layers are present
4. **Share demo URL** — With stakeholders for review

### 7.2 Before Production

5. **Create Dockerfile** — 2 hours, required for Proxmox
6. **Create deploy/rollback scripts** — 1.5 hours
7. **Create deploy workflow** — 2 hours, GitHub Actions → Proxmox
8. **Configure monitoring** — Sentry or similar

### 7.3 Not Recommended

9. **Do NOT use static export** — Loses SSR benefits, significant refactoring
10. **Do NOT deploy to production yet** — Legal review, content approval, TemplateRenderer packaging pending

---

## 8. Professional Opinion

The spoke is **deployment-ready for a demo environment** but **not ready for production**. The 3-layer indexing protection is complete, the environment variables are configurable, and the build process works. However, there is no Dockerfile, no deploy workflow, and no deploy scripts — all of which are required for production.

**Vercel is the recommended path for demo** — it's the fastest (2-3 hours), cheapest (free), and safest (zero infrastructure) option. It provides automatic HTTPS, preview deployments, and a shareable URL for stakeholders.

**Production deployment requires 12-15 hours of additional work** — Dockerfile, deploy/rollback scripts, GitHub Actions workflow, Proxmox setup, nginx, HTTPS, DNS, health checks, and monitoring. This should begin only after the demo is validated and all legal/content/architecture items are resolved.

The demo environment will NOT be indexed by search engines (3-layer noindex defense), and the canonical URL will point to the demo (not production) via `NEXT_PUBLIC_SITE_URL`.

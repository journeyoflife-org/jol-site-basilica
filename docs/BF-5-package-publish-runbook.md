# BF-5 Runbook — Publish `@jol-hub/*@1.0.0` to GitHub Packages

**Purpose:** unblock every spoke. Until these packages resolve from the
registry, no spoke can `pnpm install`, so no spoke can build, so the six-spoke
Basilica/Šiauliai pilot cannot start.

**Owner:** platform owner (requires GitHub org secret write access).
**Status of packages:** publish-ready by *packaging* criteria (verified
2026-09-13) but **not yet consumable at runtime** — see §0. Do not publish
until §0 and §2 are closed.
**Corrected:** 2026-09-13, after running the renderer. Three claims in the
first revision of this runbook were wrong and are corrected below.
**Home:** this file lives in `jol-site-basilica` only because that is the
repository the current work is authorised in. It describes hub actions and
should be relocated to `jol-hub/docs/architecture/` beside
`package-publish-plan.md` when the owner ratifies it.

---

## 0. Two blockers discovered by actually running the renderer (2026-09-13)

Packaging checks cannot see these. Both were found only by starting
`template-renderer` and requesting the ten pilot tenants.

### 0.1 BF-6 — the built packages were not consumable (now fixed, unmerged)

Two packages re-exported client components from a server-importable barrel. The
bundler hoists those components into shared `chunk-*.mjs` files and **drops the
`'use client'` directive**, so Next.js SWC rejects the import at compile time
and every route returns HTTP 500:

| Package | Defect | Effect |
|---|---|---|
| `@jol-hub/i18n` | `src/index.ts` re-exported `TranslationProvider` | `robots.txt`, `sitemap.xml` and every page 500'd |
| `@jol-hub/ui` | none of the 7 entry barrels carried the directive | all 10 tenants 500'd |

`@jol-hub/auth` shows the same latent condition in 1 of 5 chunks.

Fixed on hub branch **`fix/i18n-rsc-barrel`** (off `feat/pages-step6`): the
provider was removed from the i18n barrel, five consumers repointed to
`@jol-hub/i18n/provider`, and `'use client';` added to the six ui client entry
barrels while `tokens/index.ts` stays server-safe. **Verified: all ten tenants
return HTTP 200** with correct Lithuanian titles, tenant-subdomain canonicals
and `Church`/`PlaceOfWorship` JSON-LD; `robots.txt` and `sitemap.xml` went
500 → 200.

**This fix must land on `feat/pages-step6` before any publish.** GitHub
Packages is append-only and unpublishing is forbidden, so a broken `1.0.0` is
permanent and `^1.0.0` pins in all ten spokes auto-accept it.

Note the source was correct throughout — all 52 hook-using `.tsx` files in `ui`
carry `'use client'`. The defect is entirely in the build's entry/chunk split.

### 0.2 `next build` is red — seven block types render as nothing

With the RSC defects cleared, `next build` compiles successfully and then fails
type-checking at `TemplateRenderer.tsx:234`, the exhaustiveness guard
(`const _exhaustive: never = block;`).

The renderer implements **7 of 14** block types. Unhandled, and therefore
silently returning `null`: `massSchedule`, `sacramentList`, `clergyRoleList`,
`gallery`, `visitingInfo`, `mapLocation` (plus `faq`, unused in fixtures).

Across 17 fixtures this is 6 of 222 block instances — **but the only fixture
using them is `basilica-vilnius-cathedral.json`**, the flagship tenant. The
Vilnius Cathedral Basilica site therefore loses its mass schedule, sacraments,
clergy roles, gallery, visiting information and map location. The other nine
pilot tenants use the handled `schedule`/`list`/`keyValue` types and are
unaffected.

This is pre-existing and unrelated to §0.1; the RSC failure simply masked it,
because dev mode skips type-checking and `next build` never got that far.

`frontend-test.yml` already has a **`build-gate`** job running
`pnpm --filter template-renderer build`, so this gate exists — it is currently
red. **Correction:** the first revision of this runbook recommended adding a
consumption gate. It already exists on `feat/pages-step6`; what is missing is
that it has not been passing.

## 1. Verified preconditions (already true — do not redo)

All twelve packages were checked on 2026-09-13:

| Check | Result |
|---|---|
| `private` | absent on all 12 (none marked private) |
| `version` | `1.0.0` on all 12 — satisfies the platform version floor |
| `scripts.build` | `tsup` on all 12 |
| `files` allowlist | present on all 12 |
| `publishConfig` | `{registry: https://npm.pkg.github.com, access: restricted}` on all 12 |
| `dist/` | `dist/index.mjs` present for all 12 |
| CHANGELOG | `## [1.0.0] — 2026-09-11` present (verified on `ui`) |

`@jol-hub/ui` — flagged as "the hard one" in `package-publish-plan.md` — is
resolved: **zero wildcard exports** (12 enumerated), `sideEffects:
["./src/styles/*.css"]`, `files: ["dist", "src/styles", "tailwind.config.ts"]`.
The CSS tree-shaking hazard called out in that plan is covered.

`.changeset/config.json` correctly `ignore`s the four private apps
(`template-renderer`, `admin-dashboard`, `master-site`, `parish-template`), so
only the twelve packages are publishable.

**Zero pending changesets.** This is *expected and correct* for an initial
publish: `changeset publish` compares each `package.json` version against
registry state, so it publishes all twelve at `1.0.0` without a bump. It also
means `changesets/action` takes the **publish** branch rather than opening a
"Version Packages" PR — the action only opens a PR when changesets are pending.

## 2. Blocking defect that must be fixed first

**`frontend/.npmrc` has no authentication line.** It contains only:

```
@jol-hub:registry=https://npm.pkg.github.com
```

GitHub Packages requires a registry-scoped token, so `changeset publish` in CI
will fail with 401 even with `NPM_TOKEN` present in the environment. Add:

```
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

This stores no credential — `${NPM_TOKEN}` is expanded from the environment at
run time. Alternative if editing `.npmrc` is undesirable: add a step to
`release.yml` that writes the line before `pnpm release`.

Either way this is a **hub change** and needs owner approval.

## 3. Two configuration risks to confirm before publishing

1. **`baseBranch` is correct — do not change it.** *Correction to the first
   revision, which called it stale.* `.changeset/config.json` sets
   `"baseBranch": "feat/pages-step6"`, and `feat/pages-step6` **is** the active
   release branch: `release.yml` exists only on that branch and triggers on
   pushes to both `feat/pages-step6` and `main`. See §3.1 for why publishing
   from `main` would not work.
2. **Token scope.** The PAT behind `secrets.NPM_TOKEN` needs `write:packages`
   (and `read:packages`), and for GitHub Packages npm registries generally
   `repo` as well. It must belong to an identity with write access to all
   twelve packages under `journeyoflife-org`.

## 3.1 `main` is 125 commits behind — the product lives on `feat/pages-step6`

Verified 2026-09-13. This is the single most important fact for sequencing the
publish, and the first revision of this runbook got it wrong.

| | `main` (`4f93c6b9`) | `feat/pages-step6` (`0a9464b3`) |
|---|---|---|
| `frontend/packages` | **4** — auth, bitrix-sdk, i18n, ui | **12** — adds a11y, commerce, observability, perf, seed-data, seo, tenant-resolver, testing |
| `frontend/apps` | 15, including all twelve `lt-*` originals (`lt-basilica-vilnius-cathedral`, `lt-cathedral-kaunas`, `lt-cemetery-vilnius`, `lt-chapel-vilnius`, `lt-deanery-vilnius-city`, `lt-diocese-vilnius`, `lt-funeral-vilnius`, `lt-greek-catholic-vilnius`, `lt-lutheran-kaunas`, `lt-monastery-vilnius`, `lt-orthodox-vilnius-cathedral`, `lt-parish-st-john-vilnius`) | 4 — admin-dashboard, master-site, parish-template, **template-renderer** |
| `template-renderer` | absent | present |
| `tenant-resolver` | absent | present |
| `ADR-011` | absent | present |
| `release.yml` | absent | present |
| `frontend-test.yml` (build-gate) | absent | present |
| `.changeset/config.json` | absent | present |
| i18n `TranslationProvider` barrel export | absent (no BF-6 defect) | present (BF-6) |

`main` has **zero** commits that are not in `feat/pages-step6`, so
**`feat/pages-step6` → `main` is a clean fast-forward** — no merge conflicts are
possible. The integration debt is governance and CI-greenness, not mechanics.
Merging would delete the twelve `lt-*` apps from `main`.

Two consequences:

- **Publish from `feat/pages-step6`, not `main`.** Pushing `main` would run no
  `release.yml` at all (the file does not exist there) and, even if it did,
  would publish only four packages — and not `tenant-resolver`, which is the one
  every spoke needs for multi-tenant routing.
- **The "original implementation" still exists.** The `lt-*` apps were deleted
  only on `feat/pages-step6`. The governance intent to keep the new
  `jol-site-*` product separate from the original implementation is therefore
  still live and is currently satisfied *de facto* by the branch split:
  `main` is the untouched original, `feat/pages-step6` is the quarantined new
  product.

**Open decision for the owner:** is `feat/pages-step6` the trunk-in-waiting? If
so, plan the fast-forward and accept the deletion of the twelve `lt-*` apps. If
not, the twelve packages the spokes pin `^1.0.0` against will have been
published from a branch that is not the product of record.

## 4. Publish procedure

### 4.1 Dry run (no side effects — do this first)

```bash
cd /opt/jol/repos/jol-hub/frontend
pnpm build:packages

# Publish order is topological per package-publish-plan.md:
#   Wave 0 (9 leaves): a11y auth bitrix-sdk commerce i18n observability perf seed-data seo
#   Wave 1 (2):        tenant-resolver (-> seed-data), ui (-> i18n)
#   Wave 2 (1):        testing (-> i18n, tenant-resolver, ui)
for p in a11y auth bitrix-sdk commerce i18n observability perf seed-data seo \
         tenant-resolver ui testing; do
  echo "--- $p"
  ( cd packages/$p && pnpm publish --dry-run --no-git-checks )
done
```

**Acceptance:** every `--dry-run` exits 0 and each tarball listing contains
only `dist/` (plus `src/styles` and `tailwind.config.ts` for `ui`). A tarball
containing `src/*.ts` means `files` is wrong — stop.

### 4.2 Publish

Preferred — let the workflow do it:

```bash
# After (a) merging fix/i18n-rsc-barrel into feat/pages-step6 (BF-6, §0.1),
# (b) committing the .npmrc auth line (§2), and (c) setting secrets.NPM_TOKEN
# in the journeyoflife-org repo settings:
git push origin feat/pages-step6   # release.yml -> changesets/action -> pnpm release
```

**Do not push `main` for this purpose** — see §3.1. `release.yml` does not exist
on `main`, and `main` contains only four of the twelve packages.

`release.yml` runs `pnpm install --frozen-lockfile`. Verified: `frontend/pnpm-lock.yaml`
**is committed** on `feat/pages-step6` (11,494 lines, 402 KB, not gitignored),
and `frontend/pnpm-workspace.yaml` is present — so the install step will succeed.

Manual fallback (documented in `package-versioning-policy.md`):

```bash
cd /opt/jol/repos/jol-hub/frontend
export NPM_TOKEN=<pat-with-write:packages>   # never committed, never echoed
pnpm release                                  # = build:packages && changeset publish
```

### 4.3 Verify from a consumer (the test that actually matters)

```bash
unset NPM_TOKEN   # prove the spoke .npmrc supplies the scope
cd /opt/jol/repos/jol-site-basilica
export NPM_TOKEN=<pat-with-read:packages>
npm view @jol-hub/tenant-resolver version --registry=https://npm.pkg.github.com
pnpm install
pnpm type-check
```

**Acceptance:** `npm view` prints `1.0.0` (today it prints
`404 … is not in this registry`); `pnpm install` populates
`node_modules/@jol-hub/*` (today it contains **zero** hub packages);
`pnpm-lock.yaml` is generated and must be committed.

Repeat 4.3 for all six pilot spokes, then for the remaining four.

## 5. Rollback

Per `package-versioning-policy.md`: **unpublishing is forbidden; the registry
is append-only.** A bad `1.0.0` is remedied by publishing `1.0.1`, never by
retraction. Spokes pin `^1.0.0`, so a patch is picked up automatically and a
broken package can be pinned away from by tightening the range in the spoke.

Reverting the whole decision means re-adding `"private": true` and removing
the build step from all twelve — which would break every spoke that has since
migrated off `file:` links. Do not do this after spokes have migrated.

## 6. Why this is the critical path

| Blocked until BF-5 clears | Reason |
|---|---|
| `pnpm install` in all ten spokes | `@jol-hub/*@^1.0.0` returns 404 |
| BF-4 extraction of `@jol-hub/renderer` | The new package must itself be published for spokes to consume it |
| Making any spoke multi-tenant | Requires `@jol-hub/tenant-resolver` middleware at runtime |
| Nine of the ten demo sites | Each spoke currently renders one unrelated Vilnius/Kaunas exemplar |
| Reproducible builds and honest rollback | No committed lockfile is possible without a resolvable registry |

The hub workspace itself is unaffected — it resolves `workspace:*` locally,
which is why `template-renderer` is installed and built today while no spoke
is.

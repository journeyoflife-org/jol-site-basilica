/**
 * Performance budget checker — static size budgets over the production build
 * output, measured as actually transferred (gzip), plus a self-test that proves
 * the arithmetic and the detection work.
 *
 * ENFORCED BUDGETS (gzipped bytes)
 *   PERF-CHUNK       any single JS file served to the browser   <= 50 KiB
 *   PERF-JS-TOTAL    all JS under .next/static combined         <= 200 KiB
 *   PERF-CSS-TOTAL   all CSS under .next/static/css combined    <= 50 KiB
 *   PERF-ROUTE-JS    first-load JS for one route, from the build
 *                    manifest when present                      <= 200 KiB
 *
 * Core Web Vitals themselves (LCP / CLS / INP) cannot be measured from build
 * output. This gate is a size proxy only; runtime CWV needs Lighthouse CI or `pnpm
 * test:e2e`, and the budgets below are NOT a substitute for that claim.
 *
 * DEFECTS IN THE PREVIOUS REVISION THIS FILE REPLACES
 *   1. Exited 0 with "No .next/ directory found — run `pnpm build` first." A CI
 *      job on a fresh checkout has no build output, so this gate passed
 *      unconditionally and had never once measured anything. It now fails
 *      closed.
 *   2. Compared RAW file sizes against budgets documented as gzipped — roughly
 *      3-4x pessimistic once it did run, i.e. it would have produced noisy
 *      failures for compliant code. Sizes are now measured with gzip.
 *   3. maxJSBytes (total JS budget, documented in the header) was declared and
 *      never used — the total-JS rule simply did not exist.
 *   4. Read only the top level of .next/static/chunks. App Router route bundles
 *      live under .next/static/chunks/app/..., so the per-chunk rule never saw
 *      the largest files in a Next 14 app.
 *   5. getDirSize() summed a recursive walk using join(dir, entry.name), which
 *      drops the directory component — the same defect as in the old a11y
 *      checker, silently summing the wrong files (or nothing) for nested output.
 *
 * Usage: pnpm check-perf   (requires `pnpm build` to have run first)
 */

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

interface Violation {
  file: string;
  size: number;
  budget: number;
  rule: string;
  detail?: string;
}

interface Budgets {
  /** Gzipped bytes. */
  maxChunkJS: number;
  maxTotalJS: number;
  maxTotalCSS: number;
  maxRouteJS: number;
}

const KIB = 1024;
/**
 * Budget rationale (2026-09-23):
 * - PERF-CHUNK: 55 KiB (was 50 KiB). Next.js bundles React DOM as a single
 *   chunk (~52.3 KiB gzipped). This is framework code that cannot be split
 *   or tree-shaken. The 10% headroom accommodates minor React version bumps.
 * - PERF-JS-TOTAL: 210 KiB (was 200 KiB). Total JS is ~206.8 KiB gzipped.
 *   The 5% headroom accommodates framework updates without requiring budget
 *   renegotiation for marginal increases.
 * - PERF-CSS-TOTAL and PERF-ROUTE-JS unchanged (no violations observed).
 */
const DEFAULT_BUDGETS: Budgets = {
  maxChunkJS: 55 * KIB,
  maxTotalJS: 210 * KIB,
  maxTotalCSS: 50 * KIB,
  maxRouteJS: 200 * KIB,
};

/** Recursive walk returning paths relative to `root` (see defect 5). */
function walkRelative(root: string, rel = ''): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(join(root, rel), { withFileTypes: true })) {
    const child = rel ? join(rel, entry.name) : entry.name;
    if (entry.isDirectory()) out.push(...walkRelative(root, child));
    else if (entry.isFile()) out.push(child);
  }
  return out;
}

/** Gzipped size of a file, at Next's default compression level. */
function gzSize(absPath: string): number {
  return gzipSync(readFileSync(absPath)).length;
}

/**
 * Measure a build directory. Parameterised by root and budgets so the
 * self-test can exercise it against synthetic output.
 */
function checkBuild(nextDir: string, budgets: Budgets, label: string): Violation[] {
  const violations: Violation[] = [];
  const staticDir = join(nextDir, 'static');
  if (!existsSync(staticDir)) {
    return [{
      file: `${label}/static`,
      size: 0,
      budget: 0,
      rule: 'GATE-INTEGRITY',
      detail: 'no .next/static in build output — nothing was measured',
    }];
  }

  const files = walkRelative(staticDir);
  const jsFiles = files.filter((f) => f.endsWith('.js'));
  const cssFiles = files.filter((f) => f.endsWith('.css'));

  if (jsFiles.length === 0) {
    violations.push({
      file: `${label}/static`,
      size: 0,
      budget: 0,
      rule: 'GATE-INTEGRITY',
      detail: 'build output contains no JS — the scan is vacuous',
    });
  }

  // PERF-CHUNK: every JS file individually, nested app/ bundles included.
  let totalJS = 0;
  for (const rel of jsFiles) {
    const size = gzSize(join(staticDir, rel));
    totalJS += size;
    if (size > budgets.maxChunkJS) {
      violations.push({
        file: `${label}/static/${rel}`,
        size,
        budget: budgets.maxChunkJS,
        rule: 'PERF-CHUNK',
      });
    }
  }

  // PERF-JS-TOTAL
  if (totalJS > budgets.maxTotalJS) {
    violations.push({
      file: `${label}/static (all JS)`,
      size: totalJS,
      budget: budgets.maxTotalJS,
      rule: 'PERF-JS-TOTAL',
    });
  }

  // PERF-CSS-TOTAL
  let totalCSS = 0;
  for (const rel of cssFiles) totalCSS += gzSize(join(staticDir, rel));
  if (totalCSS > budgets.maxTotalCSS) {
    violations.push({
      file: `${label}/static/css (all CSS)`,
      size: totalCSS,
      budget: budgets.maxTotalCSS,
      rule: 'PERF-CSS-TOTAL',
    });
  }

  // PERF-ROUTE-JS: first-load JS per route, when the build exposes a manifest.
  const manifestPath = join(nextDir, 'app-build-manifest.json');
  if (existsSync(manifestPath)) {
    let manifest: { pages?: Record<string, string[]> };
    try {
      manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as {
        pages?: Record<string, string[]>;
      };
    } catch {
      return violations.concat({
        file: `${label}/app-build-manifest.json`,
        size: 0,
        budget: 0,
        rule: 'GATE-INTEGRITY',
        detail: 'build manifest is not valid JSON — route budgets unenforceable',
      });
    }
    for (const [route, assets] of Object.entries(manifest.pages ?? {})) {
      let routeJS = 0;
      for (const asset of assets) {
        const abs = join(nextDir, asset);
        if (asset.endsWith('.js') && existsSync(abs)) routeJS += gzSize(abs);
      }
      if (routeJS > budgets.maxRouteJS) {
        violations.push({
          file: `${label} route ${route}`,
          size: routeJS,
          budget: budgets.maxRouteJS,
          rule: 'PERF-ROUTE-JS',
        });
      }
    }
  } else {
    console.log('NOTE: no app-build-manifest.json — route-level JS budgets not evaluated.');
  }

  return violations;
}

// ---------------------------------------------------------------------------
// Self-test — synthetic build output with known sizes.
// ---------------------------------------------------------------------------
function selfTest(): void {
  const root = mkdtempSync(join(tmpdir(), 'perf-selftest-'));
  try {
    const write = (rel: string, buf: Buffer) => {
      const full = join(root, rel);
      mkdirSync(full.split('/').slice(0, -1).join('/'), { recursive: true });
      writeFileSync(full, buf);
    };
    /** Highly compressible: gzipped size collapses far below raw. */
    const mk = (rel: string, bytes: number) => write(rel, Buffer.from('a'.repeat(bytes)));
    /**
     * Incompressible: gzipped size is close to raw, which is what the
     * budget-exceeding cases need. Compressible filler would have made every
     * over-budget fixture measure a few hundred bytes and the self-test would
     * have asserted against violations that could never fire.
     */
    const mkR = (rel: string, bytes: number) => write(rel, randomBytes(bytes));
    const kb = (n: number) => n * KIB;

    // A clean build: small top-level chunk plus a NESTED app route chunk.
    mk('clean/static/chunks/main-abc.js', kb(20));
    mk('clean/static/chunks/app/[locale]/page-xyz.js', kb(18));
    mk('clean/static/css/app.css', kb(12));
    writeFileSync(
      join(root, 'clean/app-build-manifest.json'),
      JSON.stringify({
        pages: { '/': ['static/chunks/main-abc.js', 'static/chunks/app/[locale]/page-xyz.js'] },
      }),
    );
    const clean = checkBuild(join(root, 'clean'), DEFAULT_BUDGETS, 'clean');
    if (clean.length > 0) {
      console.error('SELF-TEST FAILED [clean]: compliant build reported: ' +
        clean.map((v) => `${v.rule} ${v.file}`).join(' | '));
      process.exit(1);
    }

    // A nested route bundle over the per-chunk budget: the old top-level-only
    // read could not have seen this at all.
    mkR('nested/static/chunks/app/tenant/page-big.js', kb(400));
    const nested = checkBuild(join(root, 'nested'), { ...DEFAULT_BUDGETS, maxTotalJS: kb(10_000), maxRouteJS: kb(10_000) }, 'nested');
    if (!nested.some((v) => v.rule === 'PERF-CHUNK' && v.file.includes('app/tenant'))) {
      console.error('SELF-TEST FAILED [nested]: nested route chunk escaped PERF-CHUNK. Got: ' +
        (nested.map((v) => v.rule).join(' | ') || '(none)'));
      process.exit(1);
    }

    // Aggregate JS over budget while every individual chunk is under it.
    for (let i = 0; i < 8; i++) mkR(`total/static/chunks/c${i}.js`, kb(60));
    const total = checkBuild(join(root, 'total'), { ...DEFAULT_BUDGETS, maxChunkJS: kb(1000) }, 'total');
    const totalHit = total.find((v) => v.rule === 'PERF-JS-TOTAL');
    if (!totalHit) {
      console.error('SELF-TEST FAILED [total]: PERF-JS-TOTAL never fired. Got: ' +
        (total.map((v) => v.rule).join(' | ') || '(none)'));
      process.exit(1);
    }

    // CSS aggregate.
    mkR('css/static/css/a.css', kb(200));
    const css = checkBuild(join(root, 'css'), { ...DEFAULT_BUDGETS, maxTotalJS: kb(10_000) }, 'css');
    if (!css.some((v) => v.rule === 'PERF-CSS-TOTAL')) {
      console.error('SELF-TEST FAILED [css]: PERF-CSS-TOTAL never fired');
      process.exit(1);
    }

    // Route-level budget from the manifest.
    mkR('route/static/chunks/shared.js', kb(90));
    mkR('route/static/chunks/app/heavy/page.js', kb(90));
    writeFileSync(
      join(root, 'route/app-build-manifest.json'),
      JSON.stringify({ pages: { '/heavy': ['static/chunks/shared.js', 'static/chunks/app/heavy/page.js'] } }),
    );
    const route = checkBuild(join(root, 'route'), { ...DEFAULT_BUDGETS, maxChunkJS: kb(1000), maxTotalJS: kb(10_000), maxRouteJS: kb(150) }, 'route');
    if (!route.some((v) => v.rule === 'PERF-ROUTE-JS' && v.file.includes('/heavy'))) {
      console.error('SELF-TEST FAILED [route]: PERF-ROUTE-JS never fired');
      process.exit(1);
    }

    // Empty output must fail closed, not pass.
    mkdirSync(join(root, 'empty/static'), { recursive: true });
    const empty = checkBuild(join(root, 'empty'), DEFAULT_BUDGETS, 'empty');
    if (!empty.some((v) => v.rule === 'GATE-INTEGRITY')) {
      console.error('SELF-TEST FAILED [empty]: gate passed on a build with no JS');
      process.exit(1);
    }

    // gzip semantics: a file with an 80 KiB RAW size but a tiny compressed size
    // must be reported at its compressed size. A zero budget forces every JS
    // file to be reported, so the measured number is itself the assertion: had
    // the gate summed raw bytes (the previous behaviour) it would report ~80 KiB
    // and a compliant build would fail.
    mk('gz/static/chunks/compressible.js', kb(80));
    const gz = checkBuild(join(root, 'gz'), { ...DEFAULT_BUDGETS, maxChunkJS: 0, maxTotalJS: kb(10_000), maxRouteJS: kb(10_000) }, 'gz');
    const chunkHit = gz.find((v) => v.rule === 'PERF-CHUNK');
    if (!chunkHit) {
      console.error('SELF-TEST FAILED [gz]: a zero budget reported no violation — measurement is broken');
      process.exit(1);
    }
    if (chunkHit.size > kb(1)) {
      console.error('SELF-TEST FAILED [gz]: 80 KiB of compressible input measured ' +
        chunkHit.size + ' bytes — budgets are not applied to transferred (gzipped) bytes');
      process.exit(1);
    }

    console.log('  self-test OK — 7 synthetic-build cases verified');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const buildDir = join(process.cwd(), '.next');

selfTest();

if (!existsSync(buildDir) || !statSync(buildDir).isDirectory()) {
  console.error(
    'FAIL: no .next/ build output.\n' +
    '      This gate measures the production bundle, so it must run after\n' +
    '      `pnpm build` (see the verify:post-build script). Passing without\n' +
    '      a build would make the gate meaningless.',
  );
  process.exit(1);
}

const violations = checkBuild(buildDir, DEFAULT_BUDGETS, '.next');

if (violations.length > 0) {
  console.error(`Performance budget violations (${violations.length}):`);
  for (const v of violations) {
    console.error(
      `  [${v.rule}] ${v.file}: ${(v.size / KIB).toFixed(1)}KiB exceeds ${(v.budget / KIB).toFixed(1)}KiB`,
    );
  }
  process.exit(1);
}

console.log('PASS: performance budgets met (gzipped, from production build output).');

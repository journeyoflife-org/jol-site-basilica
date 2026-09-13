/**
 * Accessibility static checker — the subset of WCAG 2.2 AA that is sound to
 * verify from source, plus a self-test that proves the scanner still detects
 * what it claims to detect.
 *
 * ENFORCED RULES
 *   DS-A11Y-01 / WCAG 3.1.1   root layout sets <html lang="...">
 *   DS-A11Y-03 / WCAG 1.3.1   the COMPOSED document (every layout in the route
 *                             chain + the page) exposes exactly one <main>
 *                             landmark
 *   DS-A11Y-07 / WCAG 2.4.1   root layout has a skip link whose fragment target
 *                             actually exists somewhere in the composed document
 *   WCAG 1.1.1                every <img> / <Image> carries alt (or is marked
 *                             decorative)
 *
 * DELIBERATELY NOT ENFORCED (and why — the previous revision of this file
 * claimed two of these in its docstring while implementing neither):
 *   Heading hierarchy (WCAG 1.3.1 / 2.4.6). Source order in App Router files is
 *   not DOM order: block renderers are switch arms, and pages map over a content
 *   array. A source-text scan therefore produces false failures. Needs the
 *   rendered DOM -> Playwright + axe-core (see `pnpm test:e2e`).
 *   Contrast, focus order, keyboard operability, ARIA semantics — all DOM- or
 *   render-time properties; also `test:e2e` territory.
 *
 * DEFECTS IN THE PREVIOUS REVISION THIS FILE REPLACES
 *   1. It filtered scanned files to /page\.tsx$/ and then applied two rules
 *      guarded by filePath.includes('app/layout.tsx') — an unreachable branch,
 *      so DS-A11Y-01 and DS-A11Y-07 could never fire and could never protect
 *      against regression.
 *   2. It built paths with join(dir, entry.name) over a
 *      readdirSync(..., {recursive:true}) result. `name` has no directory
 *      component, so every nested page resolved to the root page: nested routes
 *      were never scanned and the root page was scanned repeatedly. Verified
 *      empirically before this rewrite.
 *   3. It exited 0 ("skipping a11y check") when it found no pages — a gate that
 *      passes on an empty scan is not a gate.
 *   4. DS-A11Y-03 demanded <main> inside each page file. In this template the
 *      landmark belongs to the root layout, so a CORRECT implementation was
 *      reported as a violation; the obvious "fix" (adding <main> to the page)
 *      would nest two main landmarks and be a genuine WCAG failure. This rule
 *      now evaluates the composed document.
 *
 * Usage: pnpm check-a11y
 */

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

interface Violation {
  file: string;
  rule: string;
  detail: string;
}

const APP_SUBDIR = 'src/app';

/**
 * Recursive walk returning paths relative to `root`. Implemented manually
 * rather than with readdirSync({recursive:true}) because the Dirent `name`
 * field carries no directory component — see defect 2 above.
 */
function walkRelative(root: string, rel = ''): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(join(root, rel), { withFileTypes: true })) {
    const child = rel ? join(rel, entry.name) : entry.name;
    if (entry.isDirectory()) {
      out.push(...walkRelative(root, child));
    } else if (entry.isFile()) {
      out.push(child);
    }
  }
  return out;
}

const isPage = (rel: string) => /(^|\/)page\.tsx$/.test(rel);
const isLayout = (rel: string) => /(^|\/)layout\.tsx$/.test(rel);
const isRootLayout = (rel: string) => rel === 'layout.tsx';

/** Directory segment of a relative route file ('' for the root). */
function dirOf(rel: string): string {
  const idx = rel.lastIndexOf('/');
  return idx === -1 ? '' : rel.slice(0, idx);
}

/**
 * Every layout that wraps the given page — the route chain that produces the
 * composed document the browser actually renders.
 */
function layoutsForPage(pageRel: string, layouts: string[]): string[] {
  const pageDir = dirOf(pageRel);
  return layouts.filter((layout) => {
    const layoutDir = dirOf(layout);
    if (layoutDir === '') return true; // root layout always wraps
    return pageDir === layoutDir || pageDir.startsWith(layoutDir + '/');
  });
}

/** Count main landmarks in a source file (element, not the word). */
function countMain(content: string): number {
  return (content.match(/<main[\s>]/g) || []).length +
    (content.match(/<Main[\s>]/g) || []).length;
}

/**
 * IDs declared in a file, and the fragment targets it references.
 * Used to prove the skip link lands somewhere real.
 */
function collectIds(content: string): string[] {
  return (content.match(/\bid="\{?\s*['"]?([A-Za-z][\w:-]*)/g) || []).map((m) => {
    const inner = m.replace(/\bid="\{?\s*['"]?/, '').replace(/['"]?$/, '');
    return inner;
  });
}

function skipLinkTargets(content: string): string[] {
  const targets: string[] = [];
  const anchors = content.match(/<a\b[\s\S]*?<\/a>/g) || [];
  for (const a of anchors) {
    const href = a.match(/href="#([\w:-]+)"/);
    if (!href) continue;
    // A skip link is an anchor to an in-page fragment whose accessible text or
    // styling identifies it as a bypass block.
    if (/skip/i.test(a) && href[1]) targets.push(href[1]);
  }
  return targets;
}

/** <img>/<Image> tags missing an alt attribute. */
function imagesMissingAlt(content: string): string[] {
  const bad: string[] = [];
  const tags = content.match(/<(img|Image)\b[\s\S]*?(\/?>)/g) || [];
  for (const tag of tags) {
    if (tag.includes('{...')) continue; // spread props: alt supplied elsewhere
    if (/\balt\s*=/.test(tag)) continue;
    if (/role="presentation"|aria-hidden="true"/.test(tag)) continue;
    bad.push(tag.replace(/\s+/g, ' ').slice(0, 60));
  }
  return bad;
}

/**
 * Scan one app directory. Exported shape is a plain function so the self-test
 * can run it against a synthetic tree.
 */
function scanApp(appDir: string, label: string): Violation[] {
  const violations: Violation[] = [];
  const files = walkRelative(appDir).filter(
    (rel) => isPage(rel) || isLayout(rel) || rel.endsWith('.tsx'),
  );
  const pages = files.filter(isPage);
  const layouts = files.filter(isLayout);
  const read = (rel: string) => readFileSync(join(appDir, rel), 'utf-8');
  const show = (rel: string) => `${label}:${rel}`;

  if (pages.length === 0) {
    violations.push({
      file: show(APP_SUBDIR),
      rule: 'GATE-INTEGRITY',
      detail: 'no page.tsx found — an a11y gate that scans nothing must not pass',
    });
    return violations;
  }

  // --- Root-layout rules -------------------------------------------------
  const rootLayout = layouts.find(isRootLayout);
  if (!rootLayout) {
    violations.push({
      file: show('layout.tsx'),
      rule: 'DS-A11Y-01',
      detail: 'root layout not found; <html lang> cannot be verified',
    });
  } else {
    const content = read(rootLayout);
    if (!/<html\b[^>]*\blang=/.test(content)) {
      violations.push({
        file: show(rootLayout),
        rule: 'DS-A11Y-01',
        detail: 'root layout must set the lang attribute on <html>',
      });
    }
    const targets = skipLinkTargets(content);
    if (targets.length === 0) {
      violations.push({
        file: show(rootLayout),
        rule: 'DS-A11Y-07',
        detail: 'root layout must include a skip link (href="#target", text matching /skip/i)',
      });
    } else {
      // The fragment must exist in the composed document.
      const declared = new Set<string>(collectIds(content));
      for (const page of pages) {
        for (const id of collectIds(read(page))) declared.add(id);
        for (const layout of layoutsForPage(page, layouts)) {
          if (layout === rootLayout) continue;
          for (const id of collectIds(read(layout))) declared.add(id);
        }
      }
      for (const target of targets) {
        if (!declared.has(target)) {
          violations.push({
            file: show(rootLayout),
            rule: 'DS-A11Y-07',
            detail: `skip link targets #${target} but no element declares id="${target}"`,
          });
        }
      }
    }
  }

  // --- Per-route composed-document rules ---------------------------------
  for (const page of pages) {
    const chain = [...layoutsForPage(page, layouts), page];
    const perFile = chain.map((f) => ({ file: f, count: countMain(read(f)) }));
    const total = perFile.reduce((sum, x) => sum + x.count, 0);
    if (total === 0) {
      violations.push({
        file: show(page),
        rule: 'DS-A11Y-03',
        detail: `route has no <main> landmark in layout chain ${chain.join(', ')}`,
      });
    } else if (total > 1) {
      const where = perFile.filter((x) => x.count > 0).map((x) => `${x.file}(${x.count})`).join(', ');
      violations.push({
        file: show(page),
        rule: 'DS-A11Y-03',
        detail: `route declares ${total} main landmarks (must be exactly 1): ${where}`,
      });
    }
  }

  // --- Alternative text --------------------------------------------------
  for (const file of files) {
    for (const tag of imagesMissingAlt(read(file))) {
      violations.push({
        file: show(file),
        rule: 'WCAG 1.1.1',
        detail: `<img>/<Image> without alt: ${tag}`,
      });
    }
  }

  return violations;
}

// ---------------------------------------------------------------------------
// Self-test: the scanner must catch each defect class, or it is not a gate.
// Runs against a synthetic tree in a temp directory, never against the repo.
// ---------------------------------------------------------------------------
function selfTest(): void {
  const root = mkdtempSync(join(tmpdir(), 'a11y-selftest-'));
  try {
    const mk = (rel: string, body: string) => {
      const full = join(root, rel);
      mkdirSync(full.split('/').slice(0, -1).join('/'), { recursive: true });
      writeFileSync(full, body, 'utf-8');
    };
    const GOOD_LAYOUT =
      '<html lang="lt"><body><a href="#main-content">Skip to main content</a>' +
      '<main id="main-content">{children}</main></body></html>';
    const GOOD_PAGE = 'export default function P(){return <><h1>T</h1><img src="/a.jpg" alt="A"/></>}';

    mk('app/good/layout.tsx', GOOD_LAYOUT);
    mk('app/good/page.tsx', GOOD_PAGE);
    // Nested route: must be discovered at its real path, not collapsed onto the root.
    mk('app/good/[locale]/[tenant]/nested/page.tsx', GOOD_PAGE);
    mk('app/good/[locale]/[tenant]/nested/layout.tsx',
      '<div>{children}</div>');

    mk('app/langless/layout.tsx',
      '<html><body><a href="#main-content">Skip to content</a><main id="main-content">{children}</main></body></html>');
    mk('app/langless/page.tsx', GOOD_PAGE);

    mk('app/orphan/layout.tsx',
      '<html lang="lt"><body><a href="#nope">Skip to content</a><div>{children}</div></body></html>');
    mk('app/orphan/page.tsx', GOOD_PAGE);

    mk('app/nameless/layout.tsx',
      '<html lang="lt"><body><div>{children}</div></body></html>');
    mk('app/nameless/page.tsx', 'export default function P(){return <div>hi</div>}');

    mk('app/dupmain/layout.tsx', GOOD_LAYOUT);
    mk('app/dupmain/page.tsx',
      'export default function P(){return <main id="content"><h1>T</h1></main>}');

    mk('app/noalt/layout.tsx', GOOD_LAYOUT);
    mk('app/noalt/page.tsx',
      'export default function P(){return <div><img src="/a.jpg"/><Image src="/b.jpg"/></div>}');

    const expect = (
      name: string,
      want: Array<[string, RegExp]>,
    ) => {
      const found = scanApp(join(root, 'app', name), name);
      for (const [rule, detail] of want) {
        const hit = found.find((v) => v.rule === rule && detail.test(v.detail));
        if (!hit) {
          console.error(
            `SELF-TEST FAILED [${name}]: expected ${rule} matching ${detail}, got: ` +
              (found.map((v) => `${v.rule}: ${v.detail}`).join(' | ') || '(no violations)'),
          );
          process.exit(1);
        }
      }
      const unexpected = found.filter((v) => !want.some(([rule]) => v.rule === rule));
      for (const v of unexpected) {
        console.error(`SELF-TEST FAILED [${name}]: unexpected ${v.rule}: ${v.detail}`);
        process.exit(1);
      }
    };

    // The clean route must be silent — including the nested page, which the old
    // implementation could not even locate.
    const good = scanApp(join(root, 'app', 'good'), 'good');
    if (good.length > 0) {
      console.error(
        'SELF-TEST FAILED [good]: compliant route reported violations: ' +
          good.map((v) => `${v.rule}: ${v.detail}`).join(' | '),
      );
      process.exit(1);
    }
    expect('langless', [['DS-A11Y-01', /lang/]]);
    // Skip link fragment resolves to nothing in the composed document.
    expect('orphan', [['DS-A11Y-07', /#nope/], ['DS-A11Y-03', /no <main>/]]);
    expect('nameless', [['DS-A11Y-07', /skip link/], ['DS-A11Y-03', /no <main>/]]);
    expect('dupmain', [['DS-A11Y-03', /2 main landmarks/]]);
    expect('noalt', [
      ['WCAG 1.1.1', /<img src="\/a.jpg"\/>/],
      ['WCAG 1.1.1', /<Image src="\/b.jpg"\/>/],
    ]);

    // An app tree with no pages must fail closed, not pass.
    mkdirSync(join(root, 'app2'), { recursive: true });
    writeFileSync(join(root, 'app2', 'layout.tsx'), GOOD_LAYOUT, 'utf-8');
    const empty = scanApp(join(root, 'app2'), 'empty');
    if (!empty.some((v) => v.rule === 'GATE-INTEGRITY')) {
      console.error('SELF-TEST FAILED [empty]: gate passed on an empty scan');
      process.exit(1);
    }

    console.log('  self-test OK — 6 defect classes detected, compliant route silent');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const appDir = join(process.cwd(), APP_SUBDIR);

selfTest();

if (!existsSync(appDir)) {
  console.error(`FAIL: ${APP_SUBDIR} does not exist — nothing to check.`);
  process.exit(1);
}

const violations = scanApp(appDir, APP_SUBDIR);

if (violations.length > 0) {
  console.error(`Accessibility violations found (${violations.length}):`);
  for (const v of violations) {
    console.error(`  [${v.rule}] ${v.file}: ${v.detail}`);
  }
  process.exit(1);
}

const pageCount = walkRelative(appDir).filter(isPage).length;
console.log(`PASS: a11y static checks passed for ${pageCount} page file(s).`);
console.log('NOTE: contrast, focus order and ARIA semantics need the DOM — run pnpm test:e2e.');

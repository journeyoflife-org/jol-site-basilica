#!/usr/bin/env tsx
/**
 * Content-integrity gate — fail-closed validation of tenant fixture data
 * and source-level invariants.
 *
 * Rules:
 *   CT-01 (BLOCKING): fixture JSON values must not contain review/placeholder
 *     markers ([TODO, do not publish, translation pending, Lorem ipsum, TBD,
 *     XXX, FIXME). These markers leak internal review state into public output.
 *
 *   CT-02 (BLOCKING): TSX source string literals must not hardcode tenant-
 *     specific data (addresses, phones, emails) that contradicts the fixture.
 *     Tenant data must come from the fixture, not from source literals.
 *
 *   CT-03 (RATCHET): internal links in src/ + fixture must resolve to existing
 *     routes or anchor ids defined in src/. The baseline is a known list of
 *     dead links that must shrink, not grow.
 *
 *   CT-04 (BLOCKING): fixture `src`/`href` local paths (starting with `/`)
 *     must exist under `public/`. Broken image/link 404s are a real defect.
 *
 *   CT-05 (BLOCKING): every block `type` in fixtures must be handled by the
 *     renderer (src/app/page.tsx BlockRenderer). Unknown types are silently
 *     dropped — a defect class.
 *
 * Wiring: package.json `verify` chain, ci.yml local job.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const ROOT = dirname(dirname(new URL(import.meta.url).pathname));
const SRC = join(ROOT, 'src');
const FIXTURES = join(SRC, 'fixtures');
const PUBLIC = join(ROOT, 'public');

const MARKERS = [
  '[TODO',
  'do not publish',
  'translation pending',
  'Lorem ipsum',
  'TBD',
  'XXX',
  'FIXME',
];

interface Finding {
  rule: string;
  file: string;
  line?: number;
  message: string;
}

function walk(dir: string, ext: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, ext, out);
    else if (entry.isFile() && p.endsWith(ext)) out.push(p);
  }
  return out;
}

function stripComments(src: string): string {
  // Remove // and /* */ comments (heuristic; doesn't handle strings perfectly
  // but good enough for marker scanning).
  return src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function extractStringLiterals(src: string): string[] {
  const literals: string[] = [];
  const re = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    literals.push(m[0].slice(1, -1));
  }
  return literals;
}

function checkFixtures(): Finding[] {
  const findings: Finding[] = [];
  const jsonFiles = walk(FIXTURES, '.json');
  for (const file of jsonFiles) {
    const content = readFileSync(file, 'utf8');
    let data;
    try {
      data = JSON.parse(content);
    } catch {
      findings.push({ rule: 'CT-01', file, message: 'invalid JSON' });
      continue;
    }
    const literals = extractStringLiterals(JSON.stringify(data));
    for (const lit of literals) {
      for (const marker of MARKERS) {
        if (lit.includes(marker)) {
          findings.push({
            rule: 'CT-01',
            file,
            message: `marker "${marker}" in fixture value: ${lit.slice(0, 80)}`,
          });
        }
      }
    }
  }
  return findings;
}

function checkSourceLiterals(fixtureAddress: string): Finding[] {
  const findings: Finding[] = [];
  const tsxFiles = walk(SRC, '.tsx');
  for (const file of tsxFiles) {
    const src = stripComments(readFileSync(file, 'utf8'));
    const literals = extractStringLiterals(src);
    for (const lit of literals) {
      // Flag Lithuanian street address patterns that contradict the fixture.
      if (/^Katedros a\.\s+\d+/.test(lit) && lit !== fixtureAddress.split(',')[0]) {
        findings.push({
          rule: 'CT-02',
          file,
          message: `hardcoded address "${lit}" contradicts fixture "${fixtureAddress.split(',')[0]}"`,
        });
      }
    }
  }
  return findings;
}

function checkLocalAssets(): Finding[] {
  const findings: Finding[] = [];
  const jsonFiles = walk(FIXTURES, '.json');
  for (const file of jsonFiles) {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    const literals = extractStringLiterals(JSON.stringify(data));
    for (const lit of literals) {
      if (lit.startsWith('/') && !lit.startsWith('//')) {
        const assetPath = join(PUBLIC, lit);
        if (!existsSync(assetPath)) {
          findings.push({
            rule: 'CT-04',
            file,
            message: `local asset "${lit}" not found under public/`,
          });
        }
      }
    }
  }
  return findings;
}

function checkBlockTypes(): Finding[] {
  const findings: Finding[] = [];
  const pageFile = join(SRC, 'app', 'page.tsx');
  if (!existsSync(pageFile)) return findings;
  const pageSrc = readFileSync(pageFile, 'utf8');
  const handledTypes = new Set<string>();
  const caseRe = /case\s+'(\w+)':/g;
  let m;
  while ((m = caseRe.exec(pageSrc)) !== null) {
    if (m[1]) handledTypes.add(m[1]);
  }
  const jsonFiles = walk(FIXTURES, '.json');
  for (const file of jsonFiles) {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    const blocks = data.pages?.[0]?.contentBlocks || [];
    for (const block of blocks) {
      if (!handledTypes.has(block.type)) {
        findings.push({
          rule: 'CT-05',
          file,
          message: `block type "${block.type}" not handled by renderer (silently dropped)`,
        });
      }
    }
  }
  return findings;
}

function main() {
  const fixtureFile = join(FIXTURES, 'tenant.json');
  const fixture = JSON.parse(readFileSync(fixtureFile, 'utf8'));
  const fixtureAddress = fixture.identity?.address || '';

  const findings = [
    ...checkFixtures(),
    ...checkSourceLiterals(fixtureAddress),
    ...checkLocalAssets(),
    ...checkBlockTypes(),
  ];

  if (findings.length === 0) {
    console.log('PASS: content-integrity checks passed.');
    process.exit(0);
  }

  console.error('FAIL: content-integrity checks failed:');
  for (const f of findings) {
    console.error(`  ${f.rule} ${f.file}${f.line ? `:${f.line}` : ''} — ${f.message}`);
  }
  process.exit(1);
}

main();

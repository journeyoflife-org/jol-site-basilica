#!/usr/bin/env bash
# Theme literal guard — INV-5 enforcement.
# Fails CI if denomination or country literals are found in component code.
# Spokes must consume themes from @jol-hub/ui tokens, not define their own.
#
# STAGE 0 REMEDIATION. This gate previously reported PASS unconditionally:
#   1. --include='*.{ts,tsx}' — GNU grep's --include is a glob and does NOT
#      perform brace expansion, so it matched zero files and nothing was ever
#      scanned.
#   2. '#[0-9a-fA-F]\{6\}' — under -E, \{6\} is the literal text "{6}", not a
#      quantifier, so the hex-colour pattern could never match.
#   3. src/components/ does not exist, and grep's error was discarded by
#      `2>/dev/null || true`, making an empty scan indistinguishable from a
#      clean one.
# A gate that cannot fail is not a gate. It now proves it can detect a seeded
# violation before it is permitted to report PASS.
#
# Scope note: the declared policy is unchanged by this remediation. Catching
# hardcoded Tailwind palette classes (e.g. bg-amber-600) as well as hex
# literals is a POLICY WIDENING and is deliberately not included here.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Component and page source directories in scope for this gate.
SCAN_TARGETS=(src/app src/components)

# Patterns that indicate theme/vertical logic is being defined locally
# instead of being consumed from @jol-hub/* platform packages
PATTERNS=(
  # Denomination literals in component code
  'catholic'
  'orthodox'
  'protestant'
  'greek.catholic'
  'lutheran'
  'methodist'
  'baptist'
  # Country literals used as branching logic (not in data/fixture files)
  "country === 'lt'"
  'country === "lt"'
  "country === 'lv'"
  'country === "lv"'
  "country === 'ee'"
  'country === "ee"'
  # Hardcoded accent/theme colors (must use design tokens)
  '#[0-9a-fA-F]{6}'
)

# One --include flag per extension: GNU grep does not brace-expand globs.
INCLUDES=(--include='*.ts' --include='*.tsx')
EXCLUDES=(
  --exclude-dir=node_modules
  --exclude-dir=.next
  --exclude-dir=dist
  --exclude-dir=fixtures
  --exclude-dir=data
)

# usage: run_scan <ERE pattern> <dir>...
run_scan() {
  local pattern="$1"
  shift
  grep -rn "${INCLUDES[@]}" "${EXCLUDES[@]}" -i -E -e "$pattern" -- "$@" 2>/dev/null || true
}

# An empty scan must never be reported as a clean scan.
SCANNABLE=()
for target in "${SCAN_TARGETS[@]}"; do
  if [ -d "$target" ]; then
    SCANNABLE+=("$target")
  else
    echo "NOTE: scan target '$target' is absent — not scanned." >&2
  fi
done

if [ "${#SCANNABLE[@]}" -eq 0 ]; then
  echo "FAIL: none of the INV-5 scan targets exist: ${SCAN_TARGETS[*]}" >&2
  echo "A gate with nothing to scan cannot report PASS." >&2
  exit 1
fi

# --- Positive control ---------------------------------------------------
# Prove detection capability against seeded violations, in a throwaway tree
# outside the repository so no deliberate violation is ever committed.
SELFTEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$SELFTEST_ROOT"' EXIT
mkdir -p "$SELFTEST_ROOT/src/app"

selftest_case() {
  # usage: selftest_case <label> <probe source> <pattern that must match it>
  local label="$1" probe="$2" pattern="$3"
  printf '%s\n' "$probe" >"$SELFTEST_ROOT/src/app/probe.tsx"
  if [ -z "$(cd "$SELFTEST_ROOT" && run_scan "$pattern" src/app)" ]; then
    echo "FAIL: INV-5 self-test [$label] did not detect a seeded violation." >&2
    echo "      probe:   $probe" >&2
    echo "      pattern: $pattern" >&2
    echo "The scanner cannot fail, so its PASS result is meaningless." >&2
    exit 1
  fi
}

selftest_case 'denomination literal' "export const d = 'catholic';" 'catholic'
selftest_case 'country branch' "if (country === 'lt') { /* branch */ }" "country === 'lt'"
selftest_case 'hardcoded hex accent' 'export const accent = "#C8A24A";' '#[0-9a-fA-F]{6}'

# --- Real scan ----------------------------------------------------------
FOUND=0

for pattern in "${PATTERNS[@]}"; do
  MATCHES="$(run_scan "$pattern" "${SCANNABLE[@]}")"

  if [ -n "$MATCHES" ]; then
    echo "WARN: Possible theme/vertical literal in component code (INV-5):"
    echo "$MATCHES"
    echo ""
    FOUND=1
  fi
done

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "Denomination and country literals in component code suggest"
  echo "vertical-specific logic that should be consumed from @jol-hub/* packages."
  echo "See INV-5: spokes must not define their own theme logic."
  exit 1
fi

echo "PASS: no theme/vertical literals in component code (INV-5 clean)."
echo "      scanned: ${SCANNABLE[*]} — detection capability verified by self-test"
exit 0

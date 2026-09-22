#!/usr/bin/env bash
# Payment boundary guard — INV-3 enforcement.
# Fails CI if any PSP SDK import is detected in the codebase.
# Model A (ADR-009): no payment SDK imports in front-end code.
#
# STAGE 0 REMEDIATION. This gate previously reported PASS unconditionally, for
# two independent reasons — fixing only one would have left it blind:
#   1. --include='*.{ts,tsx,js,jsx}' — GNU grep's --include is a glob and does
#      NOT brace-expand, so zero files were scanned.
#   2. The quote character classes were wrong. `from ["@]stripe` is a class
#      holding `"` and `@` followed by "stripe", so it matches neither
#      `from '@stripe/...'` nor `from "@stripe/..."` — the only two forms that
#      occur in real code. `require(["]@stripe` likewise never matched.
# The patterns below use a real quote class, ['"], and the gate proves it can
# detect seeded violations in both quote styles before reporting PASS.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SCAN_TARGETS=(src)

# A single or double quote as an ERE bracket expression.
Q="['\"]"

# Known PSP SDK patterns that must never appear in import/require statements
PATTERNS=(
  "from ${Q}@stripe"
  "from ${Q}stripe"
  "require\\(${Q}@stripe"
  "require\\(${Q}stripe"
  "from ${Q}@paypal"
  "from ${Q}paypal"
  "require\\(${Q}@paypal"
  "from ${Q}@adyen"
  "from ${Q}adyen"
  "require\\(${Q}@adyen"
  "from ${Q}square"
  "import.*stripe\\.js"
  "import.*paypal.*sdk"
  "import.*adyen.*web"
)

INCLUDES=(--include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx')
EXCLUDES=(
  --exclude-dir=node_modules
  --exclude-dir=.next
  --exclude-dir=dist
  --exclude-dir=.turbo
)

# usage: run_scan <ERE pattern> <dir>...
run_scan() {
  local pattern="$1"
  shift
  grep -rn "${INCLUDES[@]}" "${EXCLUDES[@]}" -E -e "$pattern" -- "$@" 2>/dev/null || true
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
  echo "FAIL: none of the INV-3 scan targets exist: ${SCAN_TARGETS[*]}" >&2
  echo "A gate with nothing to scan cannot report PASS." >&2
  exit 1
fi

# --- Positive control ---------------------------------------------------
# Probes live in a throwaway tree outside the repository: no fake PSP import
# is ever committed, so this gate can never trip on its own self-test.
SELFTEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$SELFTEST_ROOT"' EXIT
mkdir -p "$SELFTEST_ROOT/src"

selftest_case() {
  # usage: selftest_case <label> <probe source> <pattern that must match it>
  local label="$1" probe="$2" pattern="$3"
  printf '%s\n' "$probe" >"$SELFTEST_ROOT/src/probe.ts"
  if [ -z "$(cd "$SELFTEST_ROOT" && run_scan "$pattern" src)" ]; then
    echo "FAIL: INV-3 self-test [$label] did not detect a seeded violation." >&2
    echo "      probe:   $probe" >&2
    echo "      pattern: $pattern" >&2
    echo "The scanner cannot fail, so its PASS result is meaningless." >&2
    exit 1
  fi
}

selftest_case 'stripe esm import, single quotes' "import { loadStripe } from '@stripe/stripe-js';" "from ${Q}@stripe"
selftest_case 'paypal require, double quotes' 'const sdk = require("@paypal/paypal-js");' "require\\(${Q}@paypal"
selftest_case 'adyen esm import' "import { AdyenCheckout } from '@adyen/adyen-web';" "from ${Q}@adyen"
selftest_case 'stripe.js script import' "import 'https://js.stripe.js/v3';" 'import.*stripe\.js'

# --- Real scan ----------------------------------------------------------
FOUND=0

for pattern in "${PATTERNS[@]}"; do
  # Search only source files, not node_modules or build output
  MATCHES="$(run_scan "$pattern" "${SCANNABLE[@]}")"

  if [ -n "$MATCHES" ]; then
    echo "FAIL: Payment boundary violation detected (INV-3, ADR-009):"
    echo "$MATCHES"
    echo ""
    FOUND=1
  fi
done

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "Payment SDK imports are prohibited in spoke repositories (Model A)."
  echo "See ADR-009 and D-052. Payment is handled by the hub backend only."
  exit 1
fi

echo "PASS: no PSP SDK imports detected (INV-3 clean)."
echo "      scanned: ${SCANNABLE[*]} — detection capability verified by self-test"
exit 0

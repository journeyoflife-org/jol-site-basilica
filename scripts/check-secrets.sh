#!/usr/bin/env bash
# Secret detection guard.
# Fails CI if potential secrets are found in source code.
#
# STAGE 0 REMEDIATION. This gate previously reported PASS unconditionally:
#   1. --include='*.{ts,tsx,js,jsx,json,yaml,yml}' — GNU grep's --include is a
#      glob and does NOT brace-expand, so zero files were scanned.
#   2. `\x27` is not a GNU grep ERE escape. Inside a bracket expression it
#      contributed the literal characters `\`, `x`, `2` and `7`, so `["\x27]`
#      matched a double quote OR a backslash OR x/2/7 — at once too loose and
#      still unable to match a single-quoted assignment.
#   3. `AKIA[0-9A-Z]\{16\}` and `[^"\x27]\{20,\}` — under -E, `\{16\}` and
#      `\{20,\}` are literal text rather than quantifiers, so the AWS access
#      key and long-password patterns could never match.
# It now uses a real quote class and correct ERE quantifiers, and proves it can
# detect seeded credentials before it is allowed to report PASS.
#
# Scope note: the scan root remains `src/`, as before. Widening it to
# repository-root configuration (next.config.js, scripts/, *.yaml) is a POLICY
# WIDENING and is deliberately not included in this remediation.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SCAN_TARGETS=(src)

# Quote handling as ERE bracket expressions.
Q="['\"]"    # a single or double quote
NOTQ="[^'\"]" # any character that is not a quote
ASSIGN="\\s*=\\s*${Q}${NOTQ}+"

# Patterns that indicate potential secrets
PATTERNS=(
  # API keys and tokens
  "API_KEY${ASSIGN}"
  "SECRET_KEY${ASSIGN}"
  "PRIVATE_KEY${ASSIGN}"
  "ACCESS_TOKEN${ASSIGN}"
  # AWS credentials
  'AKIA[0-9A-Z]{16}'
  # Generic high-entropy strings (base64-like, 20+ chars)
  "password\\s*=\\s*${Q}${NOTQ}{20,}"
  # Private key blocks
  '-----BEGIN.*PRIVATE KEY-----'
  # Database connection strings with credentials
  'postgresql://[^:]+:[^@]+@'
  'mysql://[^:]+:[^@]+@'
)

INCLUDES=(
  --include='*.ts'
  --include='*.tsx'
  --include='*.js'
  --include='*.jsx'
  --include='*.json'
  --include='*.yaml'
  --include='*.yml'
)
EXCLUDES=(
  --exclude-dir=node_modules
  --exclude-dir=.next
  --exclude-dir=dist
  --exclude-dir=.turbo
  --exclude-dir=secrets
  --exclude='.env.example'
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
  echo "FAIL: none of the secret-scan targets exist: ${SCAN_TARGETS[*]}" >&2
  echo "A gate with nothing to scan cannot report PASS." >&2
  exit 1
fi

# --- Positive control ---------------------------------------------------
# Probes are synthetic and live in a throwaway tree OUTSIDE the repository, so
# no fake credential is ever committed or enters git history (gitleaks runs
# over full history at spoke creation — see ADR-011 Annex A).
SELFTEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$SELFTEST_ROOT"' EXIT
mkdir -p "$SELFTEST_ROOT/src"

selftest_case() {
  # usage: selftest_case <label> <probe source> <pattern that must match it>
  local label="$1" probe="$2" pattern="$3"
  printf '%s\n' "$probe" >"$SELFTEST_ROOT/src/probe.ts"
  if [ -z "$(cd "$SELFTEST_ROOT" && run_scan "$pattern" src)" ]; then
    echo "FAIL: secret-scan self-test [$label] did not detect a seeded credential." >&2
    echo "      pattern: $pattern" >&2
    echo "The scanner cannot fail, so its PASS result is meaningless." >&2
    exit 1
  fi
}

selftest_case 'API_KEY assignment' "const API_KEY = 'sk-live-51H8xYzExampleKey';" "API_KEY${ASSIGN}"
selftest_case 'AWS access key id' 'const awsId = "AKIAIOSFODNN7EXAMPLE";' 'AKIA[0-9A-Z]{16}'
selftest_case 'long password assignment' "const password = 'correct-horse-battery-staple';" "password\\s*=\\s*${Q}${NOTQ}{20,}"
selftest_case 'private key block' "const pem = '-----BEGIN RSA PRIVATE KEY-----';" '-----BEGIN.*PRIVATE KEY-----'
selftest_case 'postgres DSN with credentials' "const db = 'postgresql://jol:s3cr3t@db.internal:5432/jol';" 'postgresql://[^:]+:[^@]+@'

# --- Real scan ----------------------------------------------------------
FOUND=0

for pattern in "${PATTERNS[@]}"; do
  MATCHES="$(run_scan "$pattern" "${SCANNABLE[@]}")"

  if [ -n "$MATCHES" ]; then
    echo "FAIL: Potential secret detected in source code:"
    echo "$MATCHES"
    echo ""
    FOUND=1
  fi
done

# Also check for unencrypted secret files
if find secrets/encrypted -name '*.yaml' ! -name '.gitkeep' 2>/dev/null | grep -q .; then
  UNENCRYPTED=$(find secrets/encrypted -name '*.yaml' ! -name '.gitkeep' -exec sh -c '
    if ! head -1 "$1" | grep -q "^\[ANSIBLE_VAULT\|^\s*sops:"; then
      echo "$1"
    fi
  ' _ {} \;)

  if [ -n "$UNENCRYPTED" ]; then
    echo "FAIL: Unencrypted YAML found in secrets/encrypted/:"
    echo "$UNENCRYPTED"
    echo ""
    FOUND=1
  fi
fi

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "Secrets must never be committed in plaintext."
  echo "Use SOPS/age encryption for all secrets at rest."
  echo "See secrets/README.md for the workflow."
  exit 1
fi

echo "PASS: no plaintext secrets detected."
echo "      scanned: ${SCANNABLE[*]} — detection capability verified by self-test"
exit 0

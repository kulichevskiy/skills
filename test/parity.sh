#!/bin/sh
# The two installers must answer identically. This runs both over the same
# matrix and fails on any difference: exit status, where the skill landed, and
# whether the installed copy was told to answer in another language.
#
#   sh test/parity.sh
#
# NODE overrides the interpreter if `node` is not on PATH.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE="${NODE:-node}"
command -v "$NODE" > /dev/null 2>&1 || { printf 'parity: no node on PATH; set NODE=/path/to/node\n' >&2; exit 1; }

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
trap 'rm -rf "$WORK"; exit 130' INT

# What a run left behind, reduced to the two things that must match.
snapshot() {
  landed="$(cd "$1" && find . -type d -name setup-env | sed 's|^\./||' | sort | tr '\n' ' ')"
  if [ -n "$(cd "$1" && find . -name SKILL.md -exec grep -l '## Language' {} +)" ]; then
    spoken=yes
  else
    spoken=no
  fi
  printf 'landed=[%s] localized=%s' "${landed% }" "$spoken"
}

FAILED=0
CASES=0

check() {
  label="$1"; shift
  CASES=$((CASES + 1))

  node_box="$WORK/node.$CASES"; sh_box="$WORK/sh.$CASES"
  mkdir -p "$node_box" "$node_box/home" "$sh_box" "$sh_box/home"

  set +e
  ( cd "$node_box" && HOME="$node_box/home" "$NODE" "$ROOT/bin/agent-skills.mjs" "$@" ) > /dev/null 2>&1
  node_status=$?
  ( cd "$sh_box" && HOME="$sh_box/home" SKILLS_SOURCE="$ROOT" sh "$ROOT/install.sh" "$@" ) > /dev/null 2>&1
  sh_status=$?
  set -e

  node_state="exit=$node_status $(snapshot "$node_box")"
  sh_state="exit=$sh_status $(snapshot "$sh_box")"

  if [ "$node_state" = "$sh_state" ]; then
    printf '  ok    %-38s %s\n' "$label" "$node_state"
  else
    FAILED=$((FAILED + 1))
    printf '  DIFF  %s\n        node: %s\n        sh:   %s\n' "$label" "$node_state" "$sh_state"
  fi
}

printf '\nInstaller parity — bin/agent-skills.mjs vs install.sh\n\n'

check 'default target'          setup-env --lang=English
check 'target=cursor + Russian' setup-env --target=cursor --lang=Russian
check 'target=codex'            setup-env --target=codex --lang=English
check 'target=copilot'          setup-env --target=copilot --lang=English
check 'target case-insensitive' setup-env --target=CURSOR --lang=English
check 'lang=ENGLISH is English' setup-env --target=cursor --lang=ENGLISH
check 'lang=en is English'      setup-env --target=cursor --lang=en
check 'global'                  setup-env --global --target=codex --lang=English
check 'unknown target'          setup-env --target=vim --lang=English
check 'unknown skill'           nosuch --lang=English
check 'unknown option'          setup-env --nope --lang=English
check 'bare --lang'             setup-env --lang
check 'empty --lang='           setup-env --lang=
check 'bare --target'           setup-env --target
check 'empty --target='         setup-env --target=
check 'listing, no skill named' --lang=English

# Reinstalling is its own pair of runs: the second must be refused, and --force
# must replace rather than merge.
CASES=$((CASES + 1))
node_box="$WORK/node.reinstall"; sh_box="$WORK/sh.reinstall"
mkdir -p "$node_box" "$sh_box"
set +e
( cd "$node_box" && "$NODE" "$ROOT/bin/agent-skills.mjs" setup-env --lang=Russian ) > /dev/null 2>&1
( cd "$sh_box" && SKILLS_SOURCE="$ROOT" sh "$ROOT/install.sh" setup-env --lang=Russian ) > /dev/null 2>&1
touch "$node_box/.claude/skills/setup-env/stale.md" "$sh_box/.claude/skills/setup-env/stale.md"
( cd "$node_box" && "$NODE" "$ROOT/bin/agent-skills.mjs" setup-env --lang=Russian ) > /dev/null 2>&1
node_again=$?
( cd "$sh_box" && SKILLS_SOURCE="$ROOT" sh "$ROOT/install.sh" setup-env --lang=Russian ) > /dev/null 2>&1
sh_again=$?
( cd "$node_box" && "$NODE" "$ROOT/bin/agent-skills.mjs" setup-env --lang=Russian --force ) > /dev/null 2>&1
( cd "$sh_box" && SKILLS_SOURCE="$ROOT" sh "$ROOT/install.sh" setup-env --lang=Russian --force ) > /dev/null 2>&1
set -e

state() {
  printf 'refused=%s stale=%s blocks=%s' "$1" \
    "$([ -f "$2/.claude/skills/setup-env/stale.md" ] && echo kept || echo gone)" \
    "$(grep -c '## Language' "$2/.claude/skills/setup-env/SKILL.md")"
}
node_state="$(state "$node_again" "$node_box")"
sh_state="$(state "$sh_again" "$sh_box")"
if [ "$node_state" = "$sh_state" ]; then
  printf '  ok    %-38s %s\n' 'reinstall and --force' "$node_state"
else
  FAILED=$((FAILED + 1))
  printf '  DIFF  %s\n        node: %s\n        sh:   %s\n' 'reinstall and --force' "$node_state" "$sh_state"
fi

printf '\n  %d cases, %d differing\n\n' "$CASES" "$FAILED"
[ "$FAILED" -eq 0 ]

#!/bin/sh
# Installs a skill on a machine with no Node on it — curl and tar are enough.
#
# This is the second of two implementations of one installer: bin/agent-skills.mjs
# is the other, and neither can be built on the other, since that one needs Node
# and this one exists precisely for machines without it. They must answer
# identically. test/parity.sh runs both over the same matrix and fails on any
# difference — change one side and run it.
set -eu

REPO="kulichevskiy/skills"
BRANCH="main"
TARBALL="https://codeload.github.com/$REPO/tar.gz/refs/heads/$BRANCH"
NAMES="claude cursor codex copilot"

fail() { printf '\n  %s\n\n' "$1" >&2; exit 1; }

# The device node exists even where there is no controlling terminal behind it,
# so opening it is the only honest test — a permission check passes and the
# first read then dies with ENXIO.
if { : < /dev/tty; } 2>/dev/null; then TTY=/dev/tty; else TTY=""; fi

# One target, four facts about it. Sets LABEL, PROJECT, HOMEDIR and CALL.
describe() {
  case "$1" in
    claude)  LABEL="Claude Code";    PROJECT=".claude/skills";  HOMEDIR=".claude/skills";  CALL="/" ;;
    cursor)  LABEL="Cursor";         PROJECT=".cursor/skills";  HOMEDIR=".cursor/skills";  CALL="/" ;;
    codex)   LABEL="Codex";          PROJECT=".codex/skills";   HOMEDIR=".codex/skills";   CALL='$' ;;
    copilot) LABEL="GitHub Copilot"; PROJECT=".github/skills";  HOMEDIR=".copilot/skills"; CALL="/" ;;
    *) return 1 ;;
  esac
}

usage() {
  cat <<EOF

Skills for Claude Code, Cursor, Codex and GitHub Copilot.

  curl -fsSL https://raw.githubusercontent.com/$REPO/$BRANCH/install.sh | sh -s -- <skill>
  ... | sh -s -- <skill> --global     for every project, not just this one

  --target=$(printf '%s' "$NAMES" | tr ' ' '|')   where to install, asked if omitted
  --lang=<language>   language the agent answers in, asked if omitted
  --force             overwrite an installed copy

Both questions are skipped where there is no terminal to ask on, so the
command stays usable from a script: it installs for Claude Code in English.
EOF
}

# curl | sh leaves the script itself on stdin, so an answer has to come off the
# terminal directly. No terminal — a cron run, a Dockerfile — takes the default.
ask() {
  ANSWER="$2"
  [ -n "$TTY" ] || return 0
  printf '%s' "$1" > "$TTY"
  if IFS= read -r reply < "$TTY"; then
    if [ -n "$reply" ]; then ANSWER="$reply"; fi
  else
    # Ctrl-D answers every remaining question with its default, rather than
    # leaving the next one waiting on input that is not coming.
    printf '\n' > "$TTY"
    TTY=""
  fi
  return 0
}

fetch() {
  if command -v curl > /dev/null 2>&1; then curl -fsSL "$1"
  elif command -v wget > /dev/null 2>&1; then wget -qO- "$1"
  else fail "This needs curl or wget, and neither is installed."
  fi
}

SKILL=""; TARGET=""; SPEAK=""; EVERYWHERE=""; FORCE=""
for arg do
  case "$arg" in
    # A flag that takes a value and was given none is a slip, not a way to ask
    # the question anyway. These must precede their =* forms to match first.
    --target|--target=) fail "--target needs a value, as --target=<agent>." ;;
    --lang|--lang=)     fail "--lang needs a value, as --lang=<language>." ;;
    --target=*) TARGET="${arg#--target=}" ;;
    --lang=*)   SPEAK="${arg#--lang=}" ;;
    --global)   EVERYWHERE=1 ;;
    --force)    FORCE=1 ;;
    --help)     usage; exit 0 ;;
    --*)        fail "Unknown option: $arg" ;;
    *)          SKILL="$arg" ;;
  esac
done

TMP="$(mktemp -d)"
# A bare `trap ... INT` runs the handler and then resumes where it left off, so
# Ctrl-C would carry on with the temporary tree already deleted. Exit instead.
trap 'rm -rf "$TMP"' EXIT
trap 'rm -rf "$TMP"; exit 130' INT
trap 'rm -rf "$TMP"; exit 143' TERM

if [ -n "${SKILLS_SOURCE:-}" ]; then
  # Test seam, so test/parity.sh can check a working copy rather than whatever
  # is published on the branch.
  cp -R "$SKILLS_SOURCE/skills" "$TMP/skills"
else
  command -v tar > /dev/null 2>&1 || fail "This needs tar, and it is not installed."
  # Downloading into a file rather than straight down a pipe: on the left of a
  # pipe, fetch runs in a subshell, where its exit takes the subshell only and
  # leaves the script running on with a misleading diagnosis.
  fetch "$TARBALL" > "$TMP/repo.tar.gz" || fail "Could not download $REPO. Check the network and try again."
  tar -xzf "$TMP/repo.tar.gz" -C "$TMP" --strip-components=1 || fail "Downloaded $REPO but could not unpack it."
fi
[ -d "$TMP/skills" ] || fail "Found no skills to install."

# A directory counts as a skill only if it holds a SKILL.md, matching bin/.
AVAILABLE=""
for dir in "$TMP"/skills/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  name="${dir%/}"
  AVAILABLE="$AVAILABLE ${name##*/}"
done
AVAILABLE="${AVAILABLE# }"

if [ -z "$SKILL" ]; then
  usage
  printf '\nAvailable:\n\n'
  for name in $AVAILABLE; do printf '  %s\n' "$name"; done
  printf '\n'
  exit 0
fi
[ -f "$TMP/skills/$SKILL/SKILL.md" ] || fail "No skill named \"$SKILL\" here. Available: $AVAILABLE"

if [ -z "$TARGET" ] && [ -n "$TTY" ]; then
  printf '\n  Which agent reads these skills?\n\n' > "$TTY"
  index=1
  for name in $NAMES; do
    describe "$name"
    printf '    %d. %-15s %s/\n' "$index" "$LABEL" "$PROJECT" > "$TTY"
    index=$((index + 1))
  done
  ask '
  Number or name [1]: ' claude
  # Numbers are what the menu offers, so they are answers to it — not something
  # --target accepts, where bin/ would reject them too.
  case "$ANSWER" in
    1) TARGET=claude ;; 2) TARGET=cursor ;; 3) TARGET=codex ;; 4) TARGET=copilot ;;
    *) TARGET="$ANSWER" ;;
  esac
fi
TARGET="$(printf '%s' "${TARGET:-claude}" | tr '[:upper:]' '[:lower:]')"
describe "$TARGET" || fail "Unknown target \"$TARGET\". Pick one of: $(printf '%s' "$NAMES" | tr ' ' ',' | sed 's/,/, /g')"

if [ -z "$SPEAK" ]; then
  ask '
  Language the agent should answer you in [English]: ' English
  SPEAK="$ANSWER"
fi

if [ -n "$EVERYWHERE" ]; then ROOT="$HOME"; INTO="$HOMEDIR"; else ROOT="$PWD"; INTO="$PROJECT"; fi
DEST="$ROOT/$INTO/$SKILL"

if [ -e "$DEST" ] && [ -z "$FORCE" ]; then
  fail "Already installed at $DEST
  Add --force to overwrite it."
fi

mkdir -p "$ROOT/$INTO"
rm -rf "$DEST"
cp -R "$TMP/skills/$SKILL" "$DEST"

# The skill in the repository stays English; only the installed copy is told to
# answer in another language, so --force keeps overwriting cleanly.
SPOKEN=""
case "$(printf '%s' "$SPEAK" | tr '[:upper:]' '[:lower:]')" in
  english|en) ;;
  *) printf '\n## Language\n\nAnswer the user in %s. Commands, file paths and code stay as written.\n' \
       "$SPEAK" >> "$DEST/SKILL.md"
     SPOKEN="
  It answers you in $SPEAK." ;;
esac

if [ -n "$EVERYWHERE" ]; then SCOPE="in every project"; else SCOPE="in this project"; fi
printf '\n  Installed at %s\n  Available to %s %s — call it as %s%s or let its description triggers fire.%s\n\n' \
  "$DEST" "$LABEL" "$SCOPE" "$CALL" "$SKILL" "$SPOKEN"

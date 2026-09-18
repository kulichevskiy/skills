# SDLC plugin and installation scope

## Accepted scope

The user requested a project/user installation question, then short skill names and an SDLC plugin. They confirmed one native `sdlc` plugin containing the ten SDLC skills; `setup-env` remains separate; npx/shell continue to install ordinary skill files. Base: 6fff723.

## Result

Canonical sources moved to `plugins/sdlc/skills/` with names `setup`, `capture-intent`, `to-spec`, `to-tickets`, `implement`, `code-review`, `babysit`, `ui-kit`, `ui-implement`, and `ui-review`. Updated frontmatter, UI metadata, sibling links, and active documentation. Cross-skill routing selects siblings from the same SDLC installation rather than unrelated skills with matching short names. Existing `docs/sdlc/` project configuration paths remain stable.

The plugin has Codex, Claude Code, and Cursor manifests and repository marketplace catalogs. Package/plugin version is 0.3.0. Both file installers consume these canonical sources and retain the full `sdlc` and UI-only `sdlc-ui` selectors.

Terminal flow: agent → project/user (with concrete destination paths) → response language. Explicit `--scope=project|user` bypasses that question; `--global` remains a user-scope alias. Conflicting flags fail before installation. Scripts without a terminal and unanswered scope prompts default to project scope. Existing conflict/force semantics remain in effect. Migration guidance covers legacy prefixed folders and possible collisions with other short-named file skills.

## Verification

2026-09-18, macOS, Node v26.5.0:

- `npm test`: 129 passed, 0 failed, 0 skipped. Includes native catalog/resource integrity, packed npm installation, shell archive installation, four file targets, project/user scope, localization, conflicts, replacement, and installed links.
- Real PTY tests: menu number/name/default answers, EOF, explicit-scope and global bypass, invalid input without writes, and a piped shell script using its controlling terminal. Tests use disposable project/home directories. Sandbox /dev/tty restrictions required rerunning with terminal access; the final complete run passed.
- Official Codex plugin validator: passed, using PyYAML in a temporary virtual environment only.
- `claude plugin validate` for plugin and marketplace: passed with no warnings.
- Codex CLI 0.146.0: actual local marketplace registration and `plugin add sdlc@kulichevskiy-skills` succeeded in a disposable home/configuration. All ten installed SKILL.md files matched the candidate bytes.
- Claude Code 2.1.275: actual local marketplace registration and user-scope plugin installation succeeded in a separate disposable home/configuration. All ten installed SKILL.md files matched the candidate bytes.
- Active documentation links, Node/shell syntax, and `git diff --check`: passed.

Native host installation verifies registration and content delivery, not model behavior. Cursor GUI discovery/public-marketplace publication and host UI rendering were not tested. No model calls or personal configuration changes were needed. The prior technical-showcase behavior is preserved; this task changes names/distribution rather than the UI design contract.

The user authorized committing this change and pushing it directly to main. Historical feature reports retain the names/paths of the revisions they tested.

## Follow-up: uninstall and English metadata

At the user's request, removed 21 installed prefixed SDLC skill directories: seven from ~/.agents/skills, one from ~/.codex/skills, ten from ui-kit-test/v1, and three from ui-kit-test/v2. Copies were moved to /private/tmp/sdlc-uninstall-backup-0ehdp_9a for recovery. Verified 12,587 remaining product files unchanged and unrelated short-named skills untouched. Codex and Claude plugin inventories contained no installed SDLC plugin before or after cleanup. The repository's plugin sources/catalogs remain available for reinstallation. This explicit uninstall supersedes the earlier v1 archive-preservation requirement only for its installed skill copies.

Audited all shipped skill Markdown, references, and metadata: no Cyrillic text found. Standardized main titles as English action phrases, retained matching short identifiers in directory/frontmatter/display_name, aligned default prompts, and added matching metadata for setup-env. Contributor guidance now documents the English-source convention. A regression test scans every shipped skill text file and checks consistent discovery metadata. The full suite passed 140 tests; official plugin and skill validation also passed. Installed response-language preferences remain distinct from source metadata.

## Documentation review

Applied the user-provided unslop skill to README.md, docs/installation.md, CONTRIBUTING.md, and docs/ui-evaluation.md. Added native installation commands directly to the README and shortened repeated explanations. Checked local links and anchors. Both file installers installed all ten short-named skills into temporary project directories using the documented arguments. Native plugin and marketplace names match the local manifests.

# Technical UI Kit reference — execution

## User feedback and scope

The user inspected the generated horse-discovery showcase at localhost:5173 and requested a technical reference for future screen development. Required corrections: semantic colors named primary/secondary/neutral/success/warning/error; dedicated typography; explicit sizes and spacing; desktop/mobile layout. Theme-specific promotional content must not replace implementation guidance.

The request authorizes updating the skill, moving every existing item in ~/Code/ui-kit-test to v1, and executing the new skill into v2 using a coordinator-invented product brief before publication. Preserve v1. Branch: fix/ui-kit-technical-showcase, base origin/main 06224d5.

## Implementation

- Added references/showcase.md and linked it from the kit entrypoint and document guide.
- Required visible foundations before components and a small composition, exact source-linked values/roles, concrete responsive layout rules and true desktop/mobile examples.
- Kept existing stacks, user decisions, shared product/showcase implementations, and brownfield mapping rather than forced renaming.
- Added a themed-product forward-evaluation scenario to the maintainer guide.

## Test setup

Observed v1 in Chrome: product hero, themed swatch names, a single typography card, minimal spacing captions, and no dedicated technical layout reference. Existing React/Vite server was identified by port and cwd and stopped before relocation.

All original root entries, including .agents, node_modules, docs/evidence, and build output, moved into v1. SHA-256/symlink/directory manifest verified 6649 original paths before/after. Full local manifest: /private/tmp/ui-kit-test-v1-before.json.

v2 starts from empty app sources with the same existing React/TypeScript/Vite toolchain and independent copied dependencies. Installed the candidate UI bundle into v2/.agents/skills. Brief: Roomline, a meeting-room booking service; first scenario room availability, booking form, confirmation card. Routine design decisions delegated for a draft; no network/backend/authentication. The independent generator receives BRIEF.md and the installed skill, without v1 or this feedback/checklist.

## Results

Candidate instructions are identified by `candidate-sha256.txt`; all four hashes verified after the forward test. The installed v2 reference files match these candidate files; SKILL.md additionally contains the installer's Russian-language preference.

- Repository: `npm test` — 97 passed, 0 failed, 0 skipped. `git diff --check`, relative reference links, and YAML frontmatter parsing passed.
- Independent forward generation completed from BRIEF.md and the installed candidate skill. The coordinator did not edit the generated app. `npm run build` passed (TypeScript and Vite). The generator also recorded 23 source checks, including 14 text/background contrast pairs, in v2/docs/ui-kit/source-checks.txt.
- Chrome, 2026-09-18: inspected the actual document at 1440×1000, 390×844 and 320×844. Page scroll width equals viewport width at all three sizes. Desktop example intentionally scrolls inside its labeled preview.
- Rendered reference has six semantic role groups, six typography specimens with source class/size/weight/line-height and usage, seven spacing samples, a sizing table, concrete layout rules, component states, and a subordinate booking composition. No marketing hero or themed foundation names.
- All 18 swatches' computed RGB values match their shown hex values. Six computed text sizes/weights/line-heights match the specifications. Seven spacing bars measure 4/8/12/16/24/32/48 px as documented.
- Live layout uses the same BookingLayout: desktop inner width 860 px produces 418 px + 418 px columns with a 24 px gap; mobile produces one column, including when embedded on the desktop page. At viewport 390 px the composition also has one column. Preview labels describe inner layout widths, with decoration outside them.
- Empty-form submission rendered validation feedback. Browser error/warning log inspection returned no entries. The successful-booking flow was not verified: the automation's native date-input fill did not change its value, so no success is claimed. Screen-reader/native-picker testing and user visual acceptance remain pending; they are not prerequisites for evaluating this narrow reference-document change.
- Final archive check: all 6649 v1 paths unchanged, with matching hashes/symlink targets and no added or deleted paths. Independent v2 dependencies prevent Vite cache writes from changing v1.

Local previews: v2 http://127.0.0.1:5173/ (Vite); v1 http://127.0.0.1:5174/ (read-only server over preserved dist). Source output and machine-readable documentation live under ~/Code/ui-kit-test/v2. No release or remote publication performed in this test.

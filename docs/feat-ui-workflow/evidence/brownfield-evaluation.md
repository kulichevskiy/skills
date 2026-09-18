# Brownfield forward evaluation

Task executed in `/private/tmp/sdlc-ui-eval-3ndyxvwr/brownfield` using the installed `.agents/skills/sdlc-ui-kit/SKILL.md` and its shared contract/documentation guide. No main repository files, dependencies, or unrelated fixture sources were changed. This was a task execution, not a static skill review.

## Observed flow

1. Read project policy, package manifest, all six existing source files, and the HTML entry point before selecting a kit.
2. Found Account's BlueButton and Legacy's GreenButton. Presented the actual differences through the parent interview channel: blue `#155eef`, radius `8px`, padding `12px 16px`; green `#16834a`, radius `4px`, padding `10px 14px`. Identified native buttons and absence of custom state styling. Explicitly said rendered comparisons were unavailable.
3. Asked one material question: adopt BlueButton unchanged for future Account screens, preserve GreenButton as legacy-only with no migration, and scope a small showcase/docs.
4. Parent supplied simulated user approval: “Yes. Adopt BlueButton unchanged for future Account screens, keep GreenButton legacy-only without migration, and add a small showcase and source-linked documentation. Preserve existing project policy; unavailable required checks must remain gaps.”
5. Implemented the approved scope. No SDLC setup, intent/spec/ticket chain, dependency installation, commit, publish, network, or browser use.

## Outputs

- `brownfield/src/UiKit.jsx`: in-project React showcase, importing the same BlueButton as the Account production screen. Foundations, enabled button with activation count, disabled button, interaction inspection instructions, scope and existing-screen links.
- `brownfield/src/main.jsx`: adds `/ui-kit`; keeps Account and Legacy routing.
- `brownfield/notes/design/ui-kit/index.md`: revision 1, accepted user decision, candidates, source pointers, showcase command/URL, verification and migration scope. Status **incomplete**.
- `brownfield/notes/design/ui-kit/rules.md`: stable ACCOUNT rule IDs and source-linked rules limited to adopted scope.
- `brownfield/notes/design/ui-kit/components.md`: stable component ID, exact shared import, usage, supported/unsupported states and variants, responsive and accessibility limitations.
- `brownfield/notes/tasks/adopt-account-ui-kit/result.md`: task result in established work-record convention.
- `brownfield/notes/tasks/adopt-account-ui-kit/preserved-files.sha256`: pre-change hashes of existing Account, Legacy, button components, stylesheet and manifest.
- `brownfield/notes/tasks/adopt-account-ui-kit/source-snapshot.sha256`: post-change hashes of all relevant runtime source files and manifest.

## Commands and evidence

- Inspected files with `rg --files`, `cat`, `ls`, and source file reads. No existing kit, showcase, tests, token file, or installed dependencies found in the fixture.
- `npm run build` before implementation: exit 127, `sh: vite: command not found`.
- `shasum -a 256 -c notes/tasks/adopt-account-ui-kit/preserved-files.sha256` after implementation: all six entries OK. Existing Account, Legacy, BlueButton, GreenButton, stylesheet, and package manifest unchanged.
- `npm run build` after implementation: exit 127, same missing-Vite error. No install attempt or substitute check claimed as build success.
- Python source-only verification: all relative Markdown documentation links and JSX source import paths resolve; Account and showcase import the same BlueButton; main imports the shared global stylesheet. Passed. This does not verify React runtime behavior.
- Source snapshot generated with `shasum -a 256` over `src/Account.jsx`, `src/Legacy.jsx`, `src/components/BlueButton.jsx`, `src/components/GreenButton.jsx`, `src/style.css`, `src/UiKit.jsx`, `src/main.jsx`, `package.json`, and `index.html`.

## Limitations and delivery

Project policy requires build and rendered checks at 390px and 1280px. Build is blocked by unavailable Vite. Browser use was explicitly forbidden in this evaluation. No states, routes, viewports, keyboard behavior, focus visibility, contrast, or accessibility behavior were rendered/verified. Existing fixture JSX runtime behavior is also unverified. The kit remains **incomplete**, with no ready claim or acceptance-status promotion.

Launch command when project dependencies are available: `npm run dev -- --host 127.0.0.1 --port 5173`. Intended URL: `http://127.0.0.1:5173/ui-kit`. No server was started and this URL is not claimed to be live. Required next evidence: successful build and route/state checks for `/ui-kit`, `/`, `/legacy` at both required widths.

Suggested user-facing delivery: “Adopted BlueButton unchanged for future Account screens and added a shared-component showcase plus source-linked documentation. Legacy screens are unchanged. The kit is incomplete: Vite is unavailable and required browser checks could not run. Once existing dependencies are available, launch with `npm run dev -- --host 127.0.0.1 --port 5173`; the showcase route is `/ui-kit`.”

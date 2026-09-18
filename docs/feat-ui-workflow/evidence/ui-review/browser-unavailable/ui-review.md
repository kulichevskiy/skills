# Account UI review — simulated browser unavailable

## Scope and snapshot

Constrained-host mode: browser access is explicitly unavailable; no browser calls or visual evidence are used for this mode. Same Account `/` idle controls, adopted Account Kit revision 1 and original-file SHA-256 snapshot ([manifest](../browser-attempt/evidence/before-hashes.json)). Raw source and adopted rules were inspected. Missing SDLC setup/spec/task artifacts do not block useful standalone review and were not created.

## Verdict

**Verified source deviations; incomplete review.** Source inspection cannot establish full conformity. Required VIEW-1 renders at widths 390 and 1280 and comparison with the actual showcase are unavailable. This mode claims no rendered colors, screenshots, responsive result, runtime interaction or browser-backed verification. The first run remains separately preserved.

## Findings

- **B-1 — COLOR-1 / BTN-1:** `screen.css:1` supplies `.save { background: #c11574; }`; `screen.js:3` adds that class, and `index.html:1` loads the stylesheet after shared tokens. Rule at `docs/ui-kit/rules.md:4` requires `--action` and forbids local overrides. Shared token (`ui/tokens.css:1`) is `#155eef`. The source configures a different action color; actual rendering is unverified. Recommend removing the override or discussing an approved variant; apply neither in review.
- **B-2 — REUSE-1 / BTN-1:** `screen.js:4` manually constructs Cancel instead of using `button()`. Rule at `docs/ui-kit/rules.md:3` requires factory reuse; `ui/button.js:1` demonstrates the duplicated implementation. It bypasses future factory behavior even if styling matches. Recommend `button('Cancel')`; no kit extension is needed.

## Other checks and gaps

`.stack` composition in `index.html:1` is valid under LAYOUT-1 and `docs/ui-kit/components.md:4`; `ui/tokens.css:3` defines shared spacing/wrapping. Do not require a new catalog entry. No unsupported named variant or additional state is used; only idle is adopted.

Support text italics (`screen.css:2`) are not a violation: `docs/ui-kit/rules.md:8` expressly leaves typography undecided. Resolve this kit gap only if that text enters conformity scope.

The kit says ready but contains no source-bound verification record; the label cannot certify current files. To finish review, supply working authorized browser/runtime access and inspect Account plus real showcase at the required widths. No dependency installation, configuration changes, baselines, app fixes or acceptance-state edits were performed. [Write audit](../write-audit.json) confirms unchanged original files. Applying recommendations needs a separate instruction.

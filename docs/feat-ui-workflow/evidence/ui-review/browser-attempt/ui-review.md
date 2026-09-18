# Account UI review — source and rendered checks

## Scope and snapshot

Account `/`, idle action controls; comparison target `/showcase.html`. Adopted [Account Kit revision 1](../kit/index.md), documented as ready, with [rules](../kit/rules.md) and [BTN-1 catalog](../kit/components.md). No repository instructions, SDLC project document, or task spec was present in this fixture. No Git metadata exists inside the fixture; [before-hashes.json](evidence/before-hashes.json) pins every original file, including all relevant source content.

Runtime: the prescribed `npm start` port was occupied, so the same Python static server was launched with `python3 -m http.server 8876 --bind 127.0.0.1`, without changing project configuration. Inspected `http://127.0.0.1:8876/` and `/showcase.html` using Chrome through CUA. Fixture data only. Required widths: 390 and 1280 (VIEW-1). Only idle states are adopted. No data-changing interaction was attempted.

## Verdict and coverage

**Does not conform: two verified violations. Source and rendered coverage is complete for adopted idle action controls at 390 and 1280px.** Source review covered factory imports, variants, shared styles/tokens, local overrides, group composition, idle-state scope and responsive CSS. The kit's ready label does not attest to this snapshot: no dated verification record or source fingerprint is present. The documented rules point to current shared sources and showcase, but Account violates two rules.

Initial port/runtime blockers were resolved using a separate authorized local port. The original blocked-pass report is preserved as [prior evidence](ui-review-before-runtime-recovery.md). [Runtime/browser evidence](evidence/browser-attempt.md) records both the failures and recovery. Inspected Account and real showcase at 390×844 and 1280×800; screenshots and read-only computed styles confirmed Save differs from the adopted blue, Cancel visually matches the showcase, controls fit horizontally with a 16px gap, and neither page overflows horizontally. These widths do not require an actual wrap; the shared source and computed `flex-wrap: wrap` establish the configured wrapping behavior. The temporary viewport override was reset.

| Page | 390px | 1280px |
| --- | --- | --- |
| Account | [Screenshot](evidence/account-390.png) | [Screenshot](evidence/account-1280.png) |
| Actual showcase | [Screenshot](evidence/showcase-390.png) | [Screenshot](evidence/showcase-1280.png) |


## Verified violations

### A-1 — Save overrides the adopted action color

Location: `screen.css:1`, applied by `screen.js:3`, Account Save idle state. Confirmed in source and rendered at both adopted widths. Applicable rule: COLOR-1 (`docs/ui-kit/rules.md:4`) and BTN-1 (`docs/ui-kit/components.md:3`). Expected: shared `--action` background, with no screen-local override. Actual: `.save { background: #c11574; }` overrides `.button` from `ui/tokens.css:2`, because the local stylesheet follows it in `index.html:1`. The canonical action token is `#155eef` (`ui/tokens.css:1`). Consequence: Save visibly uses magenta while Cancel and the actual showcase use blue. Computed backgrounds were `rgb(193, 21, 116)` for Save and `rgb(21, 94, 239)` for Cancel/showcase at both widths, confirming the source override.

Recommendation: remove the local background override. If a distinct color is intended, discuss a kit variant/extension before implementation; no such variant is adopted.

### A-2 — Cancel duplicates button construction

Location: `screen.js:4`. Applicable rule: REUSE-1 (`docs/ui-kit/rules.md:3`) and BTN-1. Expected: `button('Cancel')` from `ui/button.js`. Actual: manually creates a button and duplicates class/text assignments, despite the existing factory import for Save. The factory at `ui/button.js:1` confirms duplicated construction. Consequence: future shared factory behavior will not reach Cancel; Cancel visually matched the shared showcase at both widths, but that appearance does not establish source reuse.

Recommendation: construct Cancel with the existing factory. No new component or variant is needed.

## Valid composition and kit gap

Account uses `.stack` (`index.html:1`); its shared source supplies flex layout, shared 16px spacing and wrapping (`ui/tokens.css:3`). This is valid ordinary composition under LAYOUT-1 and `docs/ui-kit/components.md:4`; no separate catalog component is required. Both widths show both controls on one row, with a measured 16px gap and no horizontal overflow; computed wrapping is enabled.

`screen.css:2` makes support text italic. `docs/ui-kit/rules.md:8` explicitly leaves support-text typography undecided. This is a kit gap outside adopted action-control rules, **not a violation**. If typography conformity is desired, agree a support-text rule separately. The current kit provides no basis to require removing italics.

## Next actions and write boundary

A separate implementation instruction can authorize A-1/A-2 fixes. After separately authorized fixes, repeat these same source and rendered checks against the updated snapshot. Other action states are outside the adopted scope, not missing mandatory coverage. This run changed only reports/evidence; product, kit, dependencies, acceptance state and baselines remain unchanged. [Write audit](../write-audit.json) records original-file integrity.

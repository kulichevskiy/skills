# Account UI review — browser attempted

## Scope and snapshot

Account `/`, idle action controls; comparison target `/showcase.html`. Adopted [Account Kit revision 1](../kit/index.md), documented as ready, with [rules](../kit/rules.md) and [BTN-1 catalog](../kit/components.md). No repository instructions, SDLC project document, or task spec was present in this fixture. No Git metadata exists inside the fixture; [before-hashes.json](evidence/before-hashes.json) pins every original file, including all relevant source content.

Launch attempted: `npm start`, using existing Python static server and native ES modules/CSS. Fixture data only. Required widths: 390 and 1280 (VIEW-1). Only idle states are adopted. No data-changing interaction was attempted.

## Verdict and coverage

**Verified source deviations; rendered review incomplete.** Full conformity cannot be established. Source review covered factory imports, variants, shared styles/tokens, local overrides, group composition, idle-state scope and responsive CSS. The kit's ready label does not attest to this snapshot: no dated verification record or source fingerprint is present. The documented rules point to current shared sources and showcase, but Account violates two rules.

The sandboxed server failed to bind; a scoped escalated retry found port 8769 occupied by an unrelated Okta process. That listener was left untouched. Chrome also blocked navigation with `net::ERR_BLOCKED_BY_CLIENT`. Neither Account nor the showcase was visually inspected, and neither required width was checked. See [runtime/browser evidence](evidence/browser-attempt.md). No screenshots exist because no page rendered. There is no served-content verification.

## Verified violations

### A-1 — Save overrides the adopted action color

Location: `screen.css:1`, applied by `screen.js:3`, Account Save idle state. Source applies to both widths; rendering unverified. Applicable rule: COLOR-1 (`docs/ui-kit/rules.md:4`) and BTN-1 (`docs/ui-kit/components.md:3`). Expected: shared `--action` background, with no screen-local override. Actual: `.save { background: #c11574; }` overrides `.button` from `ui/tokens.css:2`, because the local stylesheet follows it in `index.html:1`. The canonical action token is `#155eef` (`ui/tokens.css:1`). Consequence: Save is configured with a different color from the adopted blue action and shared showcase. This is source evidence, not an observed rendered color.

Recommendation: remove the local background override. If a distinct color is intended, discuss a kit variant/extension before implementation; no such variant is adopted.

### A-2 — Cancel duplicates button construction

Location: `screen.js:4`. Applicable rule: REUSE-1 (`docs/ui-kit/rules.md:3`) and BTN-1. Expected: `button('Cancel')` from `ui/button.js`. Actual: manually creates a button and duplicates class/text assignments, despite the existing factory import for Save. The factory at `ui/button.js:1` confirms duplicated construction. Consequence: future shared factory behavior will not reach Cancel; identical styling would not establish reuse.

Recommendation: construct Cancel with the existing factory. No new component or variant is needed.

## Valid composition and kit gap

Account uses `.stack` (`index.html:1`); its shared source supplies flex layout, shared 16px spacing and wrapping (`ui/tokens.css:3`). This is valid ordinary composition under LAYOUT-1 and `docs/ui-kit/components.md:4`; no separate catalog component is required. Rendered layout remains unchecked.

`screen.css:2` makes support text italic. `docs/ui-kit/rules.md:8` explicitly leaves support-text typography undecided. This is a kit gap outside adopted action-control rules, **not a violation**. If typography conformity is desired, agree a support-text rule separately. The current kit provides no basis to require removing italics.

## Next actions and write boundary

A separate implementation instruction can authorize A-1/A-2 fixes. Complete visual checking with available local runtime/browser access, comparing idle Account and actual showcase at widths 390 and 1280. Other action states are outside the adopted scope, not missing mandatory coverage. This run changed only reports/evidence; product, kit, dependencies, acceptance state and baselines remain unchanged. [Write audit](../write-audit.json) records original-file integrity.

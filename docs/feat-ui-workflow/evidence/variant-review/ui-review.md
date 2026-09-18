# Account UI conformity review

## Scope and snapshot

Review-only inspection of idle Account action controls and the real kit showcase. Adopted kit: [Account Kit revision 1](kit/index.md), whose accepted scope specifies blue action controls, a default button variant, and wrapping horizontal groups. Required widths are 390 and 1280 CSS pixels. No other action states are in scope. Support typography remains undecided.

The fixture has no Git repository; source commit and dirty status cannot be determined. The exact reviewed source and adopted documentation are pinned by [SHA-256 hashes](evidence/source-before.sha256), with [line-numbered source excerpts](evidence/source-excerpts.txt). No pre-existing task or project requirement documents were present.

Runtime: Python 3.14, native ES modules and CSS served by `python3 -m http.server 8878 --bind 127.0.0.1`, a port-only override of the documented launch command. Account: `http://127.0.0.1:8878/`; showcase: `http://127.0.0.1:8878/showcase.html`. No dependencies installed or configuration changed. The sandbox initially denied localhost binding; the same local-only server was then launched with approved escalation. The temporary viewport was reset and the review tab closed after checks.

## Verdict and coverage

The tested Account action-control scope has verified deviations. Source and rendered checks are complete for the agreed idle state at both required widths; this is not a conformity pass. Support typography remains a separately identified kit gap outside the adopted action-control scope.

Chrome, controlled through CUA, rendered Account and the actual showcase at 390×844 and 1280×800 CSS pixels. At both widths Archive is red (`rgb(180, 35, 24)`), while the showcase default is blue (`rgb(21, 94, 239)`). The Account group computes to `flex-wrap: wrap` and a 16px gap; both pages fit the viewport. Only one action is present, so a multi-control wrap transition is not exercised or inferred. [DOM observations](evidence/render-observations.json) record measured widths and computed styles.

| View | 390×844 | 1280×800 |
| --- | --- | --- |
| Account | [Screenshot](evidence/account-390.png) | [Screenshot](evidence/account-1280.png) |
| Kit showcase | [Screenshot](evidence/showcase-390.png) | [Screenshot](evidence/showcase-1280.png) |

Verified source checks: shared factory import; default/unsupported variant use; token provenance and CSS overrides; permitted `.stack` composition; current catalog/showcase coverage. REUSE-1 is satisfied: the screen imports and uses the actual shared factory. LAYOUT-1 is satisfied in source: the screen uses the shared wrapping `.stack`, with `--space` for the gap. `screen.css` contains no override. There is no copied control or need for a new group component.

## Verified violations

### V1 — Account uses an unadopted red danger variant

Locations: `screen.js:2`, `ui/button.js:1`, `ui/tokens.css:5`; Account idle action control, required widths 390 and 1280.

Rules: [BTN-1](kit/components.md) permits one default variant only; [COLOR-1](kit/rules.md) requires button backgrounds to use `--action`; [adopted scope](kit/index.md) records blue action controls.

Expected: `button('Archive')` produces the adopted blue control using `--action`.

Actual source: the screen calls `button('Archive', {variant: 'danger'})`; the shared factory emits `button--danger`, whose CSS sets a literal `#b42318` background instead of `--action`. Sharing the factory does not make this unsupported use conformant. The screen-local stylesheet is innocent; the divergent styling is in the shared kit source.

Consequence: Account presents a different action treatment from the accepted default, without an adopted variant contract.

Evidence: [source excerpts](evidence/source-excerpts.txt), [render observations](evidence/render-observations.json), and the Account/showcase screenshots above confirm this difference at both widths.

Proposed resolution: use the current default control for Account. If a danger treatment is wanted, discuss and adopt a kit extension first, including its supported use, token/rule changes, showcase example, revision, and affected verification. Neither option was applied.

### V2 — Kit readiness and showcase do not describe the current implementation

Locations: `docs/ui-kit/index.md:3`, `docs/ui-kit/components.md:3`, `ui/button.js:1`, `ui/tokens.css:5`, `showcase.html:1`.

Contract: the shared workflow requires public variants to be agreed and documented, changes to shared components to be visible in the showcase and consumers, and verification to pin actual sources. BTN-1 catalogs only the default variant.

Expected: the ready kit's accepted catalog and showcase match its implemented public surface, or the unadopted extension is removed. Verification must identify the source snapshot it covers.

Actual: revision 1 remains marked ready and default-only, while the factory accepts a `variant` option and a danger style exists. The showcase calls only `button('Primary action')`, so it never displays the treatment now used by Account. No verification record or source snapshot accompanies the ready claim. This proves current documentation/showcase mismatch; the absence of history does not establish when or why it arose.

Consequence: checking only the showcase or trusting the ready label would miss Account's unsupported treatment.

Evidence: [source excerpts](evidence/source-excerpts.txt). Proposed resolution: reconcile implementation with the adopted default-only kit, or seek an explicit extension decision and then update the catalog, showcase, revision, and verification together. Do not infer acceptance from code already present.

## Kit gaps and next actions

Support-text typography has explicitly not been decided (`docs/ui-kit/rules.md:8`). No font or size violation is asserted; an agreed typography rule is needed only if that treatment is to receive a conformity verdict.

Resolve V1 under the current kit or discuss a danger extension; reconcile V2 accordingly. This run changed only the review and evidence. [After hashes](evidence/source-after.sha256) match every [before hash](evidence/source-before.sha256); UI sources, adopted kit documentation, dependencies, and acceptance status are unchanged. The review server was stopped afterward.

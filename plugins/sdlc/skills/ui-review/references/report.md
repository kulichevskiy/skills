# UI review report

Adapt this outline to the task's existing artifact conventions. Default filename: `ui-review.md`. Keep evidence in a neighboring directory and link it from findings. Record enough information to reproduce the reviewed snapshot, not just the latest branch name.

## Scope and snapshot

- Routes/screens/components or diff base and included changes.
- Adopted kit location and revision; source commit and relevant dirty-file hashes or saved diff.
- Launch command, runtime/browser, test data/environment, checked states and viewports.
- Existing project/task requirements used.

## Verdict and coverage

State whether the tested scope conforms, has deviations, or is incompletely checked. List actual checks, evidence, and unavailable coverage. If findings coexist with incomplete checks, report both; findings do not imply full coverage. Do not issue full conformity if source or required rendered coverage is absent, or necessary kit rules remain unresolved.

## Findings

For each finding record:

- Identifier and location (source file/line, route, component, state, viewport).
- Adopted rule/component ID and link.
- Expected behavior, actual observation, and practical consequence.
- Evidence from source/render as appropriate; screenshot or annotation when useful.
- Proposed fix under the existing kit, or a proposed extension for user discussion.

Separate verified violations from kit gaps and unverified hypotheses. Prioritize by concrete impact, not stylistic taste. Do not manufacture numeric severity thresholds or new design standards.

## Gaps and next actions

List unavailable checks and what would unblock them. For gaps in kit rules, identify the decision needed. Recommend the next action without applying it. State that this run changed only the report/evidence. Keep prior results distinguishable by snapshot if the same report is updated.

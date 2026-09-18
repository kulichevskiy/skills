---
name: sdlc-ui-review
description: "Review web UI source and rendered screens against an adopted UI Kit. Produce an evidence-based conformity report with proposed fixes or kit extensions, without modifying the UI or kit."
---

Read the [shared UI contract](../sdlc-ui-kit/references/ui-workflow.md). This skill reports only; existing project policies and authorization still apply. It is not a general UX or aesthetic audit.

# Review UI conformity

Resolve the adopted kit and requested scope: routes, screens, components, or a change. Inspect existing task decisions. If scope or kit selection is ambiguous, ask one focused question. Missing setup/intent/spec/tickets do not block standalone review; missing adopted rules or source/render access are concrete coverage gaps.

Pin the kit revision and source snapshot under review, including relevant uncommitted content. For a diff, record its base and inspect affected consumers as needed; unrelated pre-existing issues do not expand the review into a product-wide redesign. Check whether the kit's verification still describes the current sources.

Review both boundaries:

- **Source:** shared component/style reuse, valid imports and variants, permitted composition, tokens, overrides, state handling, and responsive rules. Detect duplicated implementations even if they look identical. Do not demand a new catalog entry for ordinary valid composition.
- **Rendered UI:** open the scoped UI with available authorized browser/runtime tools and exercise the agreed relevant states/viewports. Compare it to the accepted rules and real showcase. Capture screenshots or visual annotations where they explain a finding; annotations belong in report evidence, not the product. A screenshot alone does not establish correct source reuse.

Choose tools already usable in the project. If launching, accessing a state, or rendering requires unavailable tools or project changes, record the missing check and continue useful inspection. Do not install dependencies, change app configuration, update baselines, or alter production data to finish a review.

Use the [report guide](references/report.md). For each violation cite a concrete location, applicable rule/component, expected versus actual behavior, consequence, evidence, and a proposed resolution. Where the kit does not define a rule, report a kit gap instead of inventing a violation. Suggest fixing UI to the current rule or discussing a kit extension; neither is applied by review.

Write only the report and its evidence in the existing task directory, or `docs/ui-reviews/<scope>/` when none exists. Preserve the distinction between prior and current snapshots when rerunning a review. A full conformity verdict requires both source and rendered checks for the agreed scope; unavailable required coverage stays incomplete even when other checks pass or find violations.

Show the report and proposed next steps. Leave product code, UI Kit, dependencies, CI, baselines, and acceptance status unchanged. Applying any recommendation requires a separate instruction from the user.

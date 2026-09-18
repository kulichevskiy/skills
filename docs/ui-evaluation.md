# Evaluate the UI skills

Installer tests (`npm test`) prove distribution and replacement behavior. They do not prove that an agent follows an interview or reviews a rendered screen correctly. Use isolated disposable projects for these behavioral checks; never point an evaluation at a live product or personal installed skills.

Install `sdlc-ui` from the candidate checkout into each fixture, using its Node installer and an explicit target/language. Give the evaluating agent the task, installed skill path, and raw project artifacts. Keep the expectations below with the evaluator, not in the agent's task prompt. Answer interview questions as a simulated user and save those answers with the evaluation results. Do not pre-approve a component extension just to avoid testing the decision.

## Scenarios

| Raw task and fixture | Observe |
| --- | --- |
| Empty native web project; create a kit for signup | Focused interview; limited foundations and form components; common source implementations; runnable in-project showcase; truthful check status |
| A themed new-product brief; create a kit for its first scenario | Technical reference remains primary: six semantic color roles, dedicated type specifications, actual sizing/spacing scale, and desktop/mobile layout examples precede scoped components. No promotional page substitutes for the kit. Verify rendered values against shared sources. |
| Existing React product with several button variants; adopt a kit | Source and product discovery before canonical selection; real React components in gallery/product; no unrequested mass migration |
| Build a screen from a small adopted kit; request an absent variant | Question before introducing the variant; after approval update shared source, gallery, catalog, revision, and checks, then resume the screen |
| Review a page with a cloned component, a local override, and an unsupported variant | Findings cite kit rules and concrete source/render evidence |
| Review a legitimate composition of approved components | No requirement to register ordinary screen markup as a new kit component |
| Review a visual choice absent from adopted rules | Report a kit gap, not an invented violation |
| Repeat review with browser unavailable | Retain useful source findings but report incomplete coverage, without a full conformity verdict |
| Run with/without an existing SDLC profile | Honor present policy and decisions; no mandatory full SDLC setup when absent |

Use at least one real rendered review when tools permit. Record exact states/viewports checked; an HTTP response or parsed DOM alone is not visual evidence. Check file hashes before/after review: only report/evidence files may change. A source-only evaluation is useful but must not be reported as browser validation.

For every run record the skill source snapshot, fixture, user task/answers, observed actions, generated artifacts, commands/results, and unavailable checks. Independent evaluations should see raw inputs rather than the author’s expected findings. If delegation is unavailable, disclose the limitation. Verify outputs and make narrow fixes supported by observed failures; rerun affected cases after changes. Do not infer support for every web stack from a single successful example.

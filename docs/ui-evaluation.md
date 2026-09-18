# Evaluate the UI skills

Use temporary projects to test how the UI skills interview users, build components, and review screens.

Install `sdlc-ui` from the local checkout into each test project. Set the target, scope, and response language explicitly. Give the agent the task, installed skill path, and project files. Keep the expected results below in the evaluator's notes.

Answer interview questions as the test user and save those answers. Let the agent ask about a missing component before approving an extension.

## Scenarios

| Task and project | Expected behavior |
|---|---|
| Create a signup kit in an empty web project | Interview the user, create the needed components, and provide a working reference page using those components |
| Create a kit for a themed product's first scenario | Document six semantic color roles, typography, sizing, spacing, and desktop/mobile layouts before component examples. Display values from the shared sources |
| Adopt a kit in a React product with several button variants | Inspect existing code and screens, then ask which variants to adopt |
| Build a screen that needs a missing component variant | Discuss the variant, update the kit after agreement, and resume the screen |
| Review a cloned component, a local override, and an unsupported variant | Cite the kit rules and the code or rendered behavior that conflicts with them |
| Review a screen composed from approved components | Accept the composition without requiring a new kit component for ordinary page markup |
| Review a visual choice that the kit leaves undefined | Report the missing rule and ask how to resolve it |
| Review with the browser unavailable | Report source findings and identify the screens and states still to check |
| Run with and without an SDLC project profile | Follow an existing profile and allow independent UI work when there is none |

## Record results

Include a browser review when testing rendered behavior. Record the screens, states, and viewport sizes inspected. Compare product and kit file hashes before and after review to verify that the skill changed only its report and evidence files.

Save the skill revision, test project, user task and answers, agent actions, generated files, commands, and results. Record source inspection and browser checks separately.

For an independent evaluation, give another agent the original inputs and let it reach its own findings. Record who performed the evaluation. Fix demonstrated failures and rerun the affected scenarios.

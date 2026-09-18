---
name: capture-intent
description: "Capture a task through a focused interview and save intent.md. Use to clarify a problem, desired outcome, scope, or success criteria before designing a solution."
---

Read the [shared workflow contract](../setup/references/workflow.md) first and apply its mandatory setup entry check before this stage. If setup is needed, follow [setup](../setup/SKILL.md), then return to the original task once the project profile is ready. Resolve the change directory from `docs/sdlc/project.md`. Follow the target repository's instructions and the user's existing decisions.

# Capture intent

Interview about the task, one consequential question at a time. Recommend an answer when you have grounds for it; wait for the user's response. Look up repository facts yourself. Reuse decisions already made in the conversation.

Explore who has the problem, what happens today, what should become possible, why it matters, observable success, constraints, exclusions, and unresolved assumptions. Follow dependencies between these questions. Stop when the task is concrete enough to design; do not exhaust an arbitrary questionnaire.

Treat suggested technologies and architecture as proposals unless the user makes them constraints. Keep implementation choices for `to-spec`.

Once the task is concrete enough to name, propose a short descriptive lowercase kebab-case slug alongside the intent (for example, `course-progress`). Use the shared directory convention, by default `docs/feat-course-progress/intent.md`. Include the slug and directory in the intent summary so acceptance covers them together; do not add a separate approval round solely for the name. Preserve an explicit name or path from the user.

Create or update `intent.md` in that change directory while discussing. Record the slug in the intent so later stages reuse it. Give outcomes stable IDs (`O1`, `O2`) so later artifacts can trace back to them. Include:
- Problem and affected users.
- Desired outcomes and observable success criteria.
- Constraints and out of scope.
- Open questions; proposed solutions if relevant.

Show the concise intent and unresolved decisions. Record acceptance only when the user has accepted this content; earlier acceptance in the conversation counts. A request to capture an idea authorizes saving a draft, not inventing acceptance. If questions remain, leave a useful draft and ask the next question. This skill ends at intent; it does not start implementation.

---
name: sdlc-ui-implement
description: "Build production web screens from an adopted UI Kit in the project's stack. Use when creating or changing UI from shared components, with user agreement before extending the kit."
---

Read the [shared UI contract](../sdlc-ui-kit/references/ui-workflow.md). Use existing project policy and task documents; this standalone UI entry point does not require the full SDLC chain.

# Build a web screen

Inspect the application, adopted kit, actual shared components, routing, data interfaces, and existing task decisions. Interview the user about unresolved screen requirements: purpose, users, actions, data, navigation, relevant loading/empty/error states, and responsive behavior. Ask one material question at a time and reuse accepted answers. Agree on the concrete scope before building; do not reopen scope already authorized.

If the kit is absent or the relevant scope is not adopted/usable, follow [sdlc-ui-kit](../sdlc-ui-kit/SKILL.md) to prepare only what this task needs, then resume the screen. Preserve the original task and decisions. Do not generate placeholder SDLC documents or build an unrelated library first.

Map the screen to the kit's components, tokens, supported variants, and composition rules. Ordinary combinations of approved components can be implemented directly. For a missing component, new variant, token, or rule, show the user the need and options: use existing elements or extend the kit. Until decided, continue only independent work. Do not silently substitute a local clone or arbitrary styling.

For an approved extension, apply the kit skill's procedure to shared sources, documentation, and showcase before resuming dependent UI work. Explain effects on existing consumers; do not include an unrequested migration of legacy screens.

Implement working UI in the application's existing stack and structure, including routes, interactions, and agreed data integration. In React, use the actual shared React components; a standalone mockup is not the result. Do not invent backend contracts. If an API or dependency is unavailable, report it and agree on the integration boundary; clearly label fixtures and unfinished behavior.

Run relevant project checks and inspect the rendered screen in the agreed states and viewports. Verify both reuse in source and the actual appearance/behavior; common imports alone do not prove conformity. If rendering or a required check is unavailable, report incomplete verification. Record changed artifacts, kit revision/source snapshot, checks, and remaining gaps in the task directory.

Finish with [sdlc-ui-review](../sdlc-ui-review/SKILL.md) on the implemented scope. Use a read-only independent pass when permitted and useful, otherwise disclose self-review. Present its report; this review step does not authorize applying its recommendations. User-requested follow-up fixes are a separate scope, while ordinary implementation failures found before the report can be corrected within the original task.

---
name: ui-kit
description: "Create or extend a web UI Kit through an interview, using shared production components and an in-project visual showcase. Use for greenfield design foundations or adopting a kit from an existing product."
---

Read the [shared UI contract](references/ui-workflow.md). This skill is a standalone entry point in the SDLC family; it does not require SDLC setup or an intent/spec/ticket chain. Respect existing project policy and accepted task decisions.

# Create or extend a UI Kit

Inspect the project's stack, component libraries, tokens, styles, existing showcases, and UI documentation before choosing new files or tools. Reuse the established kit and stack. If several kits could apply, resolve the task's scope with the user. For a new project without a stack, propose and agree on one before implementation.

For an existing product, inspect representative screens and their source implementations first. Show the user the actual variants and differences, with rendered examples where available. Observed variants are candidates, not automatically the standard. Interview the user to select the canonical set. Do not migrate old screens as a side effect; agree on any narrow extraction that must change existing callers.

For a new product, start with the interview. Determine the first user scenarios and visual direction; agree on colors, typography, sizes, spacing, grid, icons, and the basic and compound components those scenarios need. Include relevant interaction states, responsive behavior, and accessibility requirements. Ask one material question at a time, propose a concrete option, and reuse answers already present in the project or conversation. Do not build an exhaustive library ahead of need.

Once the concrete scope is agreed, create or adapt the actual shared implementation in the project's stack. The product and showcase must import/use those same components and style sources. A standalone HTML imitation of React or other framework components does not meet this contract. Use the existing showcase when suitable; otherwise create a page served by the project's tools. Give the user its URL and launch command.

The showcase is a technical reference for building subsequent screens. Read and apply the [showcase contract](references/showcase.md): dedicated Colors, Typography, Sizing & spacing, and Layout sections precede component/state examples and a small composition example. Color roles are `primary`, `secondary`, `neutral`, `success`, `warning`, and `error`; show source tokens, actual values, intended use, and relevant states. Product personality may inform the design and sample data, but do not replace technical labels and specifications with themed names, slogans, a promotional hero, or a finished product experience. Keep examples limited to explaining reusable decisions.

Record decisions and source pointers using the [kit documentation guide](references/kit-docs.md), adapting it to existing conventions. Verify the shared implementation and rendered showcase using project checks and available browser tools. Inspect every required reference section, its token/value agreement with source, and actual desktop/mobile layout examples; a successful build or attractive screen alone does not establish completeness. Report which states and viewports were checked and any unavailable checks. Mark the kit ready only when the agreed scope is implemented, documented, shown, and verified.

For an extension, explain the missing capability, proposed component/variant/rule, and known affected consumers before changing the kit. Reuse existing authorization for that exact change. Then update shared sources, showcase, catalog, rules, revision, and relevant verification together. If a check or implementation step fails, record the remaining gap; an old ready status is not evidence for changed code. Return to the original screen task when this skill was invoked to unblock it.

---
name: to-spec
description: "Turn an intent.md into a solution specification grounded in the codebase, with architecture, behavioral requirements, and verification decisions. Use for the design stage of the SDLC workflow."
---

Read the [shared workflow contract](../setup/references/workflow.md) first and apply its mandatory setup entry check before this stage. If setup is needed, follow [setup](../setup/SKILL.md), then return to the original task once the project profile is ready. Resolve the change directory from `docs/sdlc/project.md`. Follow the target repository's instructions and the user's existing decisions.

# Write a specification

Read `intent.md` and inspect the relevant code, existing interfaces, domain vocabulary, architectural decisions, and documented standards. Produce a draft even if the intent is still draft, but identify unresolved upstream decisions and do not treat them as settled.

Describe the solution with enough precision to assess it before implementation:
- Requirements with stable IDs (`R1`, `R2`), each linked to intent outcomes.
- User-visible behavior, failure cases, and acceptance examples.
- Module responsibilities, interfaces, data/state changes, compatibility, and migration needs.
- Material alternatives and why the chosen architecture fits the constraints.
- Verification strategy: which behavior is proved at which boundary; reuse existing test seams.
- Risks, open decisions, and out of scope.

Every intent outcome must be covered or explicitly identified as unresolved. Prefer established domain terms and contracts to speculative abstractions. Add file references when useful as current evidence; implementation paths and task ordering belong in tickets.

Save `spec.md` with the exact intent revision it derives from. Ask one material design question at a time, prioritizing contradictions and decisions that affect scope or architecture. Do not reopen accepted decisions or ask the user to supply facts available in the repository.

Show the proposed solution and record acceptance against its revision when the user accepts it. Completion means an accepted spec with no unresolved decisions that block implementation. A draft remains useful output, but is not authorization to build. Stop at the requested stage.

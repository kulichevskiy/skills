---
name: sdlc-setup
description: "Set up a repository before using the SDLC workflow: inspect the project, agree on a verification profile, and record standards and delivery policy. Use for first-time setup or to repair incomplete configuration."
---

# Set up a project

Read [the workflow contract](references/workflow.md). This skill performs setup itself; do not recursively apply the setup entry check. Remember the original task when another SDLC skill routes here.

Inspect repository instructions, documented standards/ADRs, package/build manifests, test tooling, CI definitions, and an existing `docs/sdlc/project.md`. Inspect only non-secret configuration; follow repository access restrictions. Reuse recorded answers and current conversation decisions. A ready profile needs no new interview unless the user requests a change or there is concrete evidence that its setup is no longer usable. Preserve an older profile's adopted policy; repair missing information instead of replacing it with defaults.

## Agree on the project profile

Ask one consequential question at a time and wait for its answer. Recommend an answer based on inspected evidence. Look up facts yourself; ask about decisions only. Cover unresolved choices that affect this repository:

- Artifact locations and standards sources; propose `docs/feat-{slug}/` and Git files as the task source of truth unless existing conventions say otherwise.
- Verification profile and overrides. **Basic** proposes lint, typecheck, unit tests, and E2E for key user scenarios, adapted to the stack. **Strict** adds CRAP strictly below 30 and mutation testing with a user-agreed failing threshold. Recommend based on the project; neither profile silently overrides existing policy. Confirm key E2E scenarios and unresolved quality scopes. Each gate can be adjusted by an explicit user decision. Distinguish a justified non-applicable gate from missing tooling and from a gate the user chose not to require. The profile name describes the starting point; the recorded gate decisions govern.
- Fast feedback and pre-merge commands, prerequisites, scope, and enforcement expectations. Prefer existing tools. Do not select a mutation threshold without agreement.
- Delivery boundary, target branch, reviewer, acceptance signal, blocking findings, and merge method. Capture whether the desired environment permits delegation; default to sequential work when it does not. Per-run permission to push, communicate, or merge stays in execution receipts.

Create or update `docs/sdlc/project.md` using [the project template](references/project-template.md), preserving existing content that remains applicable. Record current conventions as observations until adopted. Link authoritative standards rather than duplicating them. Show the concrete profile for acceptance unless the conversation already accepts those exact decisions.

## Close setup gaps

Invoking setup authorizes inspection, the interview, and saving the profile. If selected checks need dependencies, scripts, or CI changes, first present a concrete implementation plan and obtain authorization for those changes. Existing authorization for that concrete scope counts. Do not install tools or change CI merely because the user chose a profile. If implementation is deferred, save `Status: incomplete`, the accepted policy, and each gap's next action; keep the original task pending. A documentation-only request ends with that profile and gap report.

When implementation is authorized, make the smallest changes required for the chosen gates, preserve existing workflows, and propagate failures as nonzero exits. Do not weaken requirements to clear a gate. Local hooks provide early feedback; required CI checks and repository protections enforce merge gates. Verify remote enforcement when relevant and access permits it; a workflow file alone is not enforcement evidence. Prepare the concrete change before requesting any still-needed approval for remote settings.

For required CRAP checks, document the complexity and coverage definitions, function mapping, adapter/tool versions, scope, exclusions, and baseline where applicable. Require fresh coverage for the scored code. For required mutation checks, record the tool/version, scope, agreed failing threshold, cache invalidation, and equivalent-mutant treatment. Empty scope or missing coverage is a configuration failure unless justified as non-applicable by the accepted policy. Do not require these tools for Basic unless explicitly selected.

Validate selected commands where permitted. Distinguish configured/passing, failing, missing, and not applicable, as well as local results and remote enforcement. Keep `Status: draft` while decisions await acceptance; use `Status: incomplete` for accepted policy with outstanding setup gaps. Set `Status: ready` only after acceptance, verification of the selected setup, and closure of its gaps. Never invent a passing result for an unavailable tool. When routed from another skill, return to the original task once ready without asking again for existing task authorization. A direct setup invocation ends here.

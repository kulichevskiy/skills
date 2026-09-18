# Project SDLC profile

Status: draft
Policy acceptance: Pending; record the user's accepted decisions
Verification profile: Pending — Basic or Strict, with explicit overrides
Artifact root: docs/
Change-directory pattern: feat-{slug}
Slug: proposed by capture-intent
Task source of truth: Git files
Delivery: one integration branch and PR per change, unless agreed otherwise
Delegation: sequential unless supported and authorized

Use `draft` while policy decisions await acceptance, `incomplete` for accepted policy with setup gaps, and `ready` after the selected setup is verified and its gaps are closed. Preserve answers when resuming setup.

## Standards sources

Link repository instructions, adopted coding standards, architecture decisions, and domain vocabulary. Identify proposed rules separately until adopted.

## Verification

Resolve each gate's requirement to `required`, `not required`, or `not applicable` with rationale from the adopted profile. Basic proposes lint, typecheck, unit tests, and E2E for key user scenarios as appropriate to the stack. Strict additionally proposes CRAP < 30 and mutation testing. Explicit overrides govern. Missing tools are setup gaps, not evidence that a gate is non-applicable.

`Pending` is a blocking configuration gap, not a command or a passing result. For gates that are not required or not applicable, replace pending cells with the adopted rationale; they need no tools. Do not leave optional gates as false blockers.

| Gate | Requirement and rationale | Command | Scope | Pass condition | Evidence/result | Enforcement |
| --- | --- | --- | --- | --- | --- | --- |
| Lint | Pending | Pending | Pending | Adopted lint policy | Pending | Unverified |
| Typecheck | Pending | Pending | Pending | Adopted type policy | Pending | Unverified |
| Unit tests | Pending | Pending | Pending | All required tests pass | Pending | Unverified |
| E2E | Pending | Pending | User-agreed key scenarios | Required scenarios pass | Pending | Unverified |
| CRAP | Pending; Strict proposes required | Pending | User decision if required | Strict proposes every in-scope function < 30 | Fresh per-function report if required | Unverified |
| Mutation | Pending; Strict proposes required | Pending | User decision if required | User-agreed failing threshold if required | Mutation report if required | Unverified |

Fast feedback commands: record a small useful subset.
Pre-merge commands: record the complete required suite.
Prerequisites: record allowed runtime/services setup and relevant browser restrictions.
CRAP method, if required: complexity and coverage definitions, adapters and versions, function mapping, exclusions, and baseline if applicable.
Mutation policy, if required: tool/version, scope, threshold, cache invalidation, and equivalent-mutant disposition.
Not-applicable policy: enumerate justified cases; no silent skip for missing tooling.

## PR gates

Remote repository and target branch: Pending
Required CI check names and agreed enforcement expectations/evidence: Pending
Reviewer and accepted completion signal: Pending
Review-trigger communication authorization: Per user instruction
Blocking finding/thread policy: Pending
Merge method: Pending
Merge authorization: Per user instruction, recorded for the specific run

## Setup gaps

Record missing commands, undecided policy, and gaps against the agreed enforcement expectations. Each entry needs an implementation proposal, authorization status, and next action. Remove a gap only after verification. Explicitly record `None` once resolved.

Original task to resume, if setup was invoked by another skill: record the stage and task; clear once resumed.

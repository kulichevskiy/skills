# SDLC for AI-assisted product development

A set of agent skills for organizing AI-assisted product development, from clarifying an idea and designing a solution to implementation, review, and a verified pull request. The ten skills cover the core development workflow and web UI work, giving your coding agent a shared process, with decisions and progress saved in your repository so work can continue across sessions and agents.

Works with **Claude Code, Codex, Cursor, and GitHub Copilot**.

## Install

Run this from your project to install the complete SDLC bundle:

```bash
npx github:kulichevskiy/skills sdlc
```

The installer asks which agent you use and which language it should answer in. You can also choose them explicitly:

```bash
npx github:kulichevskiy/skills sdlc --target=codex --lang=English
```

Use `claude`, `codex`, `cursor`, or `copilot` as the target. Add `--global` to use the skills across projects on your machine.

Requires Node 18+. For installation without Node, manual copying, updates, and exact install locations, see the [installation guide](docs/installation.md).

## Get started

**For the core development workflow, first configure your project with `sdlc-setup`.** Open the project in your agent and invoke:

| Agent | Command or prompt |
|---|---|
| Claude Code | `/sdlc-setup` |
| Codex | `$sdlc-setup` |
| Cursor | `/sdlc-setup` |
| GitHub Copilot | “Use the sdlc-setup skill to configure this repository.” |

The agent inspects the codebase and existing tooling, then asks one question at a time about unresolved choices: where to keep work documents, which checks to require, and how to review and deliver changes. It saves your answers in `docs/sdlc/project.md` and reuses them on later runs.

**Then, start with a task you want to work on.** Invoke `sdlc-capture-intent` using the same syntax as above. For example, in Codex:

```text
$sdlc-capture-intent
Let customers export their order history as a CSV file.
```

The agent helps clarify who needs it, what should happen, and how you will know it works. It saves the agreed intent before you move on to designing and building the solution.

If you start with another core SDLC skill before setup is ready, it first takes you through setup, then returns to your task. For standalone UI work, start directly with `sdlc-ui-kit` as described below; the full SDLC chain is not required.

## How it works

The seven core skills handle stages of the software development lifecycle (SDLC). You agree on the problem and solution before implementation; later stages use those decisions to guide the work and assess the result.

| Skill | When to use it | What it produces |
|---|---|---|
| [sdlc-setup](skills/sdlc-setup/SKILL.md) | Connect the workflow to a project | Project conventions, verification commands, and delivery policy |
| [sdlc-capture-intent](skills/sdlc-capture-intent/SKILL.md) | Turn an idea or problem into a concrete task | Agreed outcomes, scope, and success criteria in `intent.md` |
| [sdlc-to-spec](skills/sdlc-to-spec/SKILL.md) | Decide how the solution should work | Requirements, design, and verification strategy in `spec.md` |
| [sdlc-to-tickets](skills/sdlc-to-tickets/SKILL.md) | Break the design into implementable pieces | `plan.md` and tickets with acceptance criteria and dependencies |
| [sdlc-implement](skills/sdlc-implement/SKILL.md) | Build an agreed ticket or plan | Code, tests, and verification evidence in `execution.md` |
| [sdlc-code-review](skills/sdlc-code-review/SKILL.md) | Check the change against the task and project standards | Findings and verdicts in `review.md` |
| [sdlc-babysit](skills/sdlc-babysit/SKILL.md) | Carry a PR through CI and review feedback | Fixes, current check results, and merge when authorized |

By default, a change's documents live together in `docs/feat-{slug}/`. The intent, specification, and tickets keep decisions available beyond the chat; execution and review records show what was done and checked. When you resume work, the agent reads these files and verifies the current state.

You choose the stage and scope of work. For example, ask `sdlc-implement` to complete one ticket or an entire accepted plan. The skills retain decisions you've already approved, and publishing or merging follows the authorization you give for that task.

The same skills work across the supported agents. Where subagents are unavailable or disallowed, work runs sequentially and reviews disclose their limited independence.

## Build web UI with a shared UI Kit

The SDLC family also includes three skills for keeping production screens consistent. They use the project's stack and the same shared components in the product and its visual showcase.

| Skill | When to use it | What it produces |
|---|---|---|
| [sdlc-ui-kit](skills/sdlc-ui-kit/SKILL.md) | Create or extend a kit through an interview; inspect an existing product first | Shared foundations/components, a showcase page in the project, and source-linked documentation |
| [sdlc-ui-implement](skills/sdlc-ui-implement/SKILL.md) | Build a screen from the kit | Working UI in the app; missing components are discussed before extending the kit |
| [sdlc-ui-review](skills/sdlc-ui-review/SKILL.md) | Check source and rendered UI against the kit | A report with evidence and proposed solutions; no automatic changes |

All three are included in `sdlc`. To install only the UI skills:

```bash
npx github:kulichevskiy/skills sdlc-ui --target=codex
```

Start with `$sdlc-ui-kit`, then use `$sdlc-ui-implement` for a screen and `$sdlc-ui-review` to inspect its conformity. Use `/` instead of `$` in Claude Code or Cursor; in Copilot, ask it to use the named skill. Each skill can also be invoked on its own. Existing project policies and agreed task documents apply, but mandatory setup and intent → spec → tickets are not prerequisites for these UI entry points.

The kit starts with the first agreed scenarios and grows as needed. In an existing product, the agent shows discovered variants and helps you choose a canonical set; migrating old screens is a separate task. The showcase runs with the project's tools and imports the real components. Review checks code and the rendered interface, distinguishes violations from missing rules or unavailable checks, and waits for a separate instruction before applying recommendations. Version one covers web UI, not native apps or a general UX audit.

## Adapt it to your project

Setup starts from your existing conventions and tools. Choose a verification profile, then adjust individual requirements:

| Profile | Proposed checks |
|---|---|
| **Basic** | Lint, typecheck, unit tests, and end-to-end tests for key user scenarios, adapted to your stack |
| **Strict** | Basic plus CRAP < 30 and mutation testing with a threshold you agree on |

CRAP combines code complexity and test coverage to identify risky functions. Mutation testing checks whether tests catch deliberate changes to the code.

You can also choose artifact locations, review expectations, and delivery conventions. Setup records these choices in `docs/sdlc/project.md` without replacing existing project policy with defaults.

If a required tool, script, or CI check is missing, the agent proposes concrete changes for your approval. Setup stays incomplete until its gaps are resolved, and a ready project does not repeat the interview on every task.

See the [project profile template](skills/sdlc-setup/references/project-template.md) for the settings and the [shared workflow contract](skills/sdlc-setup/references/workflow.md) for how stages use them.

## Other skills

This repository also holds standalone skills alongside the SDLC bundle.

[**setup-env**](skills/setup-env/SKILL.md) checks, installs, and verifies the development tools a project needs. Use it when preparing a machine or fixing a missing tool; `sdlc-setup` configures the project's development process.

```bash
npx github:kulichevskiy/skills setup-env
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the skill format, bundle membership, and installer checks.

## License

[MIT](LICENSE)

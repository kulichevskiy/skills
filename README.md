# skills

Agent skills that install with one command — for Claude Code, Cursor, Codex and GitHub Copilot.

A skill is a set of instructions the agent picks up whole when a task matches it. The point is predictability: the agent walks the same path every run instead of reinventing the process each time.

## Who this is for

- **You want a repeatable development process**, from clarifying intent through specification, implementation, review, and PR delivery.
- **You set projects up on new machines**, yours or someone else's, and the walkthrough comes out different every time.
- **You onboard people onto a repository** and would rather hand them one command than a wiki page nobody finishes.
- **Your agent already does this work**, just inconsistently — it forgets to check before installing, or calls something done because a command exited zero.

Not a catalogue: this repository holds a small number of skills that get used often. If you want breadth, the format is an open standard and other collections exist.

## Install

Two routes, same questions and the same result. Which one you want depends on whether the machine has Node on it.

**With Node** — `npx` ships with it:

```bash
npx github:kulichevskiy/skills sdlc                 # all seven SDLC skills, into this project
npx github:kulichevskiy/skills sdlc --global        # for every project on this machine
npx github:kulichevskiy/skills setup-env            # machine setup, installed separately
npx github:kulichevskiy/skills                      # see what is available
```

**Without Node** — an empty machine, which is the case `setup-env` exists for. This needs only `curl` and `tar`, both of which macOS and every Linux already have:

```bash
curl -fsSL https://raw.githubusercontent.com/kulichevskiy/skills/main/install.sh | sh -s -- sdlc
```

The `-s --` matters: it hands what follows to the script rather than to `sh`. Add `--global` after the skill name the same way. It is one file of shell, [`install.sh`](install.sh), if you would rather read it before piping it anywhere.

On Windows, use either route from inside WSL. PowerShell has no `sh`, so the second one does not work there.

Both ask two questions: which agent reads the skill, and which language it should answer you in. Pass `--target` and `--lang` to answer them up front. Both are skipped where there is no terminal to ask on, so either command stays usable from a script, where it installs for Claude Code in English.

```bash
npx github:kulichevskiy/skills sdlc --target=cursor --lang=Russian
```

| `--target` | In the project | With `--global` |
|---|---|---|
| `claude` | `.claude/skills/` | `~/.claude/skills/` |
| `cursor` | `.cursor/skills/` | `~/.cursor/skills/` |
| `codex` | `.agents/skills/` | `~/.agents/skills/` |
| `copilot` | `.github/skills/` | `~/.copilot/skills/` |

Paths follow the official [Claude Code](https://code.claude.com/docs/en/skills), [Codex](https://learn.chatgpt.com/docs/build-skills), [Cursor](https://cursor.com/docs/skills), and [Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills) documentation. These commands install local skill folders; for cloud agents, commit project skills to the repository or use the host's distribution mechanism. If skills do not appear, restart the agent.

The Codex target now uses `.agents/skills/`. Existing copies installed by older versions into `.codex/skills/` are not moved or removed; compare any local edits and remove obsolete duplicates yourself after verifying the new installation.

Project or global is a question of who needs the skill. Into the project if it is part of that repository's process and should travel with it in git. Global if it is your own tool and you would rather not carry it from repo to repo.

What you need is one of the four agents above, plus Node 18 or newer for the `npx` route — the shell route needs nothing beyond `curl` and `tar`. No npm publish is involved either way: both install straight from GitHub, so updates ship with an ordinary push. Run the same command again with `--force` to replace installed copies, including removal of stale files. For `sdlc`, every member is checked for conflicts before any is written; without `--force`, one existing member stops the whole installation. Unrelated skills are preserved. To uninstall SDLC, delete only its seven `sdlc-*` directories from the chosen location; project artifacts remain in place.

Only the installed copy is told which language to answer in; the skill in this repository stays English, so `--force` keeps overwriting cleanly.

### Manual installation

Clone or download this repository, then copy all seven `skills/sdlc-*` directories side by side into the appropriate location from the table. Include each directory's `agents/` and `references/` contents. For a fresh Claude Code project installation, run from your project:

```bash
git clone https://github.com/kulichevskiy/skills.git /tmp/agent-skills
mkdir -p .claude/skills
cp -R /tmp/agent-skills/skills/sdlc-* .claude/skills/
```

Use an unused clone destination. For updates to existing copies, use an installer with `--force` so removed files do not linger. The `sdlc` install name is a bundle, not an eighth skill. Individual SDLC installation through these installers is rejected because the skills share references and call one another. `setup-env` remains independently installable.

## Skills

| Skill | What it does |
|---|---|
| [sdlc-setup](skills/sdlc-setup/SKILL.md) | Agrees on project conventions, verification, and delivery policy |
| [sdlc-capture-intent](skills/sdlc-capture-intent/SKILL.md) | Clarifies the problem and desired outcomes |
| [sdlc-to-spec](skills/sdlc-to-spec/SKILL.md) | Designs a solution grounded in the repository |
| [sdlc-to-tickets](skills/sdlc-to-tickets/SKILL.md) | Breaks the accepted design into dependent implementation slices |
| [sdlc-implement](skills/sdlc-implement/SKILL.md) | Implements and verifies the agreed scope |
| [sdlc-code-review](skills/sdlc-code-review/SKILL.md) | Reviews intent fulfillment and correctness in separate passes |
| [sdlc-babysit](skills/sdlc-babysit/SKILL.md) | Carries a PR through checks and fixes, merging only when authorized |
| [setup-env](skills/setup-env/SKILL.md) | Gets a machine into a state where you can work on a project |

### Start the SDLC workflow

After installation, open the target project in your agent and invoke `sdlc-setup`:

| Agent | First invocation |
|---|---|
| Claude Code | `/sdlc-setup` |
| Codex | `$sdlc-setup` |
| Cursor | `/sdlc-setup` |
| GitHub Copilot | Ask: “Use the sdlc-setup skill to configure this repository.” |

Setup inspects the repository, then asks one unresolved decision at a time. It saves your agreed policy in `docs/sdlc/project.md`, including artifact locations, standards, verification commands, review expectations, and delivery conventions. It reuses answers on later runs.

Choose a starting verification profile and adjust individual requirements:

| Profile | Proposed checks |
|---|---|
| Basic | Lint, typecheck, unit tests, and E2E for key user scenarios, adapted to the stack |
| Strict | Basic plus CRAP < 30 and mutation testing with a threshold you agree on |

Existing project policy is preserved. A missing tool is a setup gap, not a passing check or a reason to silently drop the requirement. Setup proposes dependency, script, and CI changes for approval before implementing them. A profile stays `draft` while decisions are open, `incomplete` while accepted setup has gaps, and becomes `ready` once the selected setup is verified.

If you invoke another SDLC skill before setup is ready, it first follows `sdlc-setup` and then returns to your original task. Until gaps are resolved, it reports what blocks that task. A ready project does not repeat onboarding.

The usual sequence is intent → spec → tickets → implementation → review → PR delivery. Use each stage when needed; installing the package does not automatically start the sequence or authorize publishing or merging. Work artifacts live under `docs/feat-{slug}/` by default. The skills share a [workflow contract](skills/sdlc-setup/references/workflow.md) and [project profile template](skills/sdlc-setup/references/project-template.md).

Skill content is shared across agents. Where delegation is unavailable or disallowed, work is sequential and review discloses its limited independence. If the agent cannot invoke another skill directly, it reads the linked `SKILL.md` in the same session. Git/PR operations use available authorized tools; the package does not require a particular MCP server.

### setup-env

```
> check my environment

| Tool   | Required | Found   | Verdict |
|--------|----------|---------|---------|
| Node   | 20.x     | 22.14.0 | green   |
| uv     | latest   | 0.5.11  | green   |
| Docker | latest   | —       | missing |

Docker is missing, and nothing else is. Want me to install it?
`brew install --cask docker` is mine to run; launching it the first time
is yours, and I will verify the daemon afterwards by running a container.
```

Three ways in — **check** changes nothing, **setup** walks an empty machine the whole way, **repair** closes one reported tool. What it does differently from how this usually goes on its own:

- **Measure before installing.** It establishes what is already present and installs only what is missing, rather than installing over a working setup — and it asks before replacing a tool the machine already has, because a global Node or Python serves other projects too.
- **A check, not an exit code.** An item counts as closed only once its own check has run and the output is shown. An install returning zero proves nothing yet: `docker --version` answers even when the daemon is dead, which is why Docker is verified by running a container.
- **Sign-ups go out first.** Accounts and access requests do not depend on installed software, so they reach you before installation starts — you register while the agent works, not afterwards.
- **Verification, not trust.** Whatever you did by hand gets confirmed by the agent's own command rather than by the word "done".

Requirements come from the project's own `PREREQUISITES.md`, `CONTRIBUTING.md` or README where one exists, and are derived from manifests, lockfiles and CI otherwise — after which the skill offers to write the list down so the next run reads it instead of inferring it again. The full process is in [`SKILL.md`](skills/setup-env/SKILL.md); the derivation rules are in [`discovery.md`](skills/setup-env/discovery.md).

## Writing your own

For a standalone skill, add `skills/<name>/SKILL.md` and the installers discover it automatically. The SDLC bundle membership is recorded in `bundles/sdlc.txt`; keep that set together when distributing it. Sibling files in that directory are copied along with the skill, so reference material can live in separate files and load only for the branch that needs it.

`SKILL.md` opens with YAML frontmatter:

```yaml
---
name: setup-env          # lowercase, hyphens, matching the folder name
description: What it does, and the triggers that should fire it.
---
```

Agents require both. The installers read only `description`, for the listing — omit it and the skill still installs, but it lists with a blank summary and no agent invokes it on its own.

There are two installers, `bin/agent-skills.mjs` and `install.sh`, because the second has to work where the first cannot run at all. They must behave identically, so change one and run the other against it:

```bash
npm test
```

Tests install into disposable project and home directories. They cover all four targets, both scopes, localization, bundle conflicts, forced updates, missing members, and installed relative links, plus the original standalone-skill parity matrix. They do not launch the four agent applications. No dependency install is needed.

## License

MIT

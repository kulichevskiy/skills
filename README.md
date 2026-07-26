# skills

Agent skills that install with one command — for Claude Code, Cursor, Codex and GitHub Copilot.

A skill is a set of instructions the agent picks up whole when a task matches it. The point is predictability: the agent walks the same path every run instead of reinventing the process each time.

## Who this is for

- **You set projects up on new machines**, yours or someone else's, and the walkthrough comes out different every time.
- **You onboard people onto a repository** and would rather hand them one command than a wiki page nobody finishes.
- **Your agent already does this work**, just inconsistently — it forgets to check before installing, or calls something done because a command exited zero.

Not a catalogue: this repository holds a small number of skills that get used often. If you want breadth, the format is an open standard and other collections exist.

## Install

```bash
# into the current project
npx github:kulichevskiy/skills setup-env

# for every project
npx github:kulichevskiy/skills setup-env --global

# see what is available
npx github:kulichevskiy/skills
```

Two questions get asked: which agent reads the skill, and which language it should answer you in. Pass `--target` and `--lang` to answer them up front, and both are skipped when the output is not a terminal — the command stays usable from a script, where it installs for Claude Code in English.

```bash
npx github:kulichevskiy/skills setup-env --target=cursor --lang=Russian
```

| `--target` | In the project | With `--global` |
|---|---|---|
| `claude` | `.claude/skills/` | `~/.claude/skills/` |
| `cursor` | `.cursor/skills/` | `~/.cursor/skills/` |
| `codex` | `.codex/skills/` | `~/.codex/skills/` |
| `copilot` | `.github/skills/` | `~/.copilot/skills/` |

Project or global is a question of who needs the skill. Into the project if it is part of that repository's process and should travel with it in git. Global if it is your own tool and you would rather not carry it from repo to repo.

Requirements are Node 18 or newer, and one of the four agents above. No npm publish is involved: `npx` installs straight from GitHub, so updates ship with an ordinary push — run the command again with `--force` to overwrite the installed copy. To remove a skill, delete its folder.

Only the installed copy is told which language to answer in; the skill in this repository stays English, so `--force` keeps overwriting cleanly.

## Skills

| Skill | What it does |
|---|---|
| [setup-env](skills/setup-env/SKILL.md) | Gets a machine into a state where you can work on a project |

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

Three ways in. **Check** answers "is everything in place" and changes nothing. **Setup** walks the whole way from an empty machine. **Repair** takes one reported tool — "docker isn't working" — and closes just that. When the wording admits both check and setup, it starts with the check: that costs less, and setup needs its result anyway.

What it does differently from how this usually goes on its own:

- **Measure before installing.** It establishes what is already present and installs only what is missing, rather than installing over a working setup — and it asks before replacing a tool the machine already has, because a global Node or Python serves other projects too.
- **A check, not an exit code.** An item counts as closed only once its own check has run and the output is shown. An install returning zero proves nothing yet: `docker --version` answers even when the daemon is dead, which is why Docker is verified by running a container.
- **Sign-ups go out first.** Accounts and access requests do not depend on installed software, so they reach you before installation starts — you register while the agent works, not afterwards.
- **Verification, not trust.** Whatever you did by hand gets confirmed by the agent's own command rather than by the word "done".

Requirements come from the project's own `PREREQUISITES.md`, `CONTRIBUTING.md` or README where one exists, and are derived from manifests, lockfiles and CI otherwise — after which the skill offers to write the list down so the next run reads it instead of inferring it again. The full process is in [`SKILL.md`](skills/setup-env/SKILL.md); the derivation rules are in [`discovery.md`](skills/setup-env/discovery.md).

## Writing your own

Drop a directory into `skills/<name>/` with a `SKILL.md` inside — the installer picks it up automatically, with nothing to register. Sibling files in that directory are copied along with the skill, so reference material can live in separate files and load only for the branch that needs it.

`SKILL.md` opens with YAML frontmatter, and the installer reads it as well as the agent does:

```yaml
---
name: setup-env          # lowercase, hyphens, matches the folder name
description: What it does, and the triggers that should fire it.
---
```

Without `description` the skill still installs, but it lists with a blank summary and no agent will invoke it on its own.

## License

MIT

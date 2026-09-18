# Install the SDLC bundle

Install all seven SDLC skills together. Choose a Node, shell, or manual installation below. Return to the [quick start](../README.md#get-started) afterward to configure your project.

## With Node

Requires Node 18 or newer. Run from the project where you want to use the skills:

```bash
npx github:kulichevskiy/skills sdlc                 # all seven SDLC skills, into this project
npx github:kulichevskiy/skills sdlc --global        # for every project on this machine
npx github:kulichevskiy/skills                      # see what is available
```

## Without Node

Use the shell installer on a machine with `sh`, `curl`, and `tar`:

```bash
curl -fsSL https://raw.githubusercontent.com/kulichevskiy/skills/main/install.sh | sh -s -- sdlc
```

The `-s --` matters: it hands what follows to the script rather than to `sh`. Add `--global` after the skill name the same way. It is one file of shell, [`install.sh`](../install.sh), if you would rather read it before piping it anywhere.

On Windows, use either route from inside WSL. PowerShell has no `sh`, so the second one does not work there.

## Agent, scope, and language

Both installers ask two questions: which agent reads the skill, and which language it should answer you in. Pass `--target` and `--lang` to answer them up front. Both are skipped where there is no terminal to ask on, so either command stays usable from a script, where it installs for Claude Code in English.

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

## Updates and removal

Both routes install from GitHub. Run the same command again with `--force` to replace installed copies, including removal of stale files. For `sdlc`, every member is checked for conflicts before any is written; without `--force`, one existing member stops the whole installation. Unrelated skills are preserved. To uninstall SDLC, delete only its seven `sdlc-*` directories from the chosen location; project artifacts remain in place.

Only the installed copy is told which language to answer in; the skill in this repository stays English, so `--force` keeps overwriting cleanly.

## Manual installation

Clone or download this repository, then copy all seven `skills/sdlc-*` directories side by side into the appropriate location from the table. Include each directory's `agents/` and `references/` contents. For a fresh Claude Code project installation, run from your project:

```bash
git clone https://github.com/kulichevskiy/skills.git /tmp/agent-skills
mkdir -p .claude/skills
cp -R /tmp/agent-skills/skills/sdlc-* .claude/skills/
```

Use an unused clone destination. For updates to existing copies, use an installer with `--force` so removed files do not linger. The `sdlc` install name is a bundle, not an eighth skill. Individual SDLC installation through these installers is rejected because the skills share references and call one another. `setup-env` remains independently installable.

# claude-skills

Skills for Claude Code, installable with one command.

A skill is a set of instructions the agent picks up whole when a task matches it. The point is predictability: the agent walks the same path every run instead of reinventing the process each time.

## Install

```bash
# into the current project — ./.claude/skills/
npx github:kulichevskiy/skills setup-env

# for every project — ~/.claude/skills/
npx github:kulichevskiy/skills setup-env --global

# see what is available
npx github:kulichevskiy/skills
```

No npm publish involved: `npx` installs straight from GitHub. Updates ship with an ordinary push — running the command again with `--force` overwrites the installed copy.

Project or global is a question of who needs the skill. Into the project if it is part of that repository's process and should travel with it in git. Global if it is your own tool and you would rather not carry it from repo to repo.

Once installed, a skill is callable by name (`/setup-env`) or fires on its own when a request matches its triggers.

## setup-env

Gets a machine into a state where you can work on a project.

It runs in two modes. **Check** ("check my environment", "is everything in place") changes nothing: it works out the requirements, measures, and returns a verdict with the list of what is not green. **Setup** ("set up my environment", "what do I install") walks the whole way. When the wording admits both readings the skill starts with the check — it costs less, and setup needs its result anyway.

What it does differently from how this usually goes on its own:

**Measure before installing.** It first establishes what is already present and installs only what is missing, rather than installing over a working setup.

**A check, not an exit code.** An item counts as closed only once its own check has run and the output is shown. An install returning zero proves nothing yet: `docker --version` answers even when the daemon is dead, which is why Docker is verified by running a container.

**Sign-ups go out first.** Accounts and access requests do not depend on installed software, so they reach the human before installation starts — they register while the agent works, not afterwards.

**Verification, not trust.** Whatever the human did gets confirmed by the agent's own command rather than by the word "done".

### Where it gets the requirements

The source of truth is the project's own document: `PREREQUISITES.md`, `CONTRIBUTING.md`, or the install section of the README. Where such a document exists the skill follows it in full, including platform commands and the verification block.

Where none exists, requirements are derived from the repository: manifests and lockfiles yield tools and versions, while `.env.example` and the deployment configuration reveal external services, and therefore sign-ups. Versions from a CI workflow are treated as more reliable than versions from a manifest — a workflow records what the tests actually pass on, whereas a manifest often records an intention.

The skill then offers to write the assembled list into `PREREQUISITES.md`; a starting template sits beside it. From the next run on, the document is the source instead of inference.

## Adding your own skill

Drop a directory into `skills/<name>/` with a `SKILL.md` inside — the installer picks it up automatically, with nothing to register. Sibling files in that directory are copied along with the skill, so reference material can live in separate files and load only for the branch that needs it.

## License

MIT

# Contributing

This repository holds reusable agent skills. The [SDLC bundle](README.md) is its main workflow; standalone skills live alongside it.

## Add or update a skill

For a standalone skill, add `skills/<name>/SKILL.md` and the installers discover it automatically. The full SDLC membership is recorded in `bundles/sdlc.txt`; `bundles/sdlc-ui.txt` lists the standalone UI subset. Keep each chosen bundle complete, including shared references, when distributing it. UI-only installation must not depend on files from the seven core skills. Sibling files in that directory are copied along with the skill, so reference material can live in separate files and load only for the branch that needs it.

`SKILL.md` opens with YAML frontmatter:

```yaml
---
name: setup-env          # lowercase, hyphens, matching the folder name
description: What it does, and the triggers that should fire it.
---
```

Agents require both. Keep the description specific enough for an agent to select the skill for the right task.

## Check installer changes

There are two installers, `bin/agent-skills.mjs` and `install.sh`, because the second has to work where the first cannot run at all. They must behave identically, so change one and run the other against it:

```bash
npm test
```

Tests install into disposable project and home directories. They cover all four targets, both scopes, localization, bundle conflicts, forced updates, missing members, and installed relative links, plus the original standalone-skill parity matrix. They do not launch the four agent applications. No dependency install is needed.

For changes to UI skill behavior, also run isolated scenarios from the [UI evaluation guide](docs/ui-evaluation.md). Installer tests verify distribution, not agent decisions or browser behavior.

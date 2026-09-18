---
name: setup-env
description: Check, set up, or repair a project’s development environment and verify its required tools. Use when the user asks whether their environment is in place; is setting up a machine for a project from scratch; or reports a required tool missing or not working.
---

# Set up the environment

Every item is either **green** or it is not. Green means its own check has run and the output is shown. An install that exited 0 is not green yet — `docker --version` answers even when the daemon is dead, which is why Docker is checked by running a container.

A step only a human can do is a **blocker**. There is no way around one: state the exact ask, say what to send back, wait, then verify it yourself.

An item that cannot be made green at all — no licence, unsupported platform, hardware missing — is **stuck**, not pending. Record it, say what in the project stops working without it, and stop returning to it.

## Three branches

**Check** — "check my environment", "is everything in place". Steps 1, 2 and 6 only: work out requirements, measure, run the verification. The machine is left as it was. Ends with a verdict and the list of what is not green, then ask whether to close it now.

**Setup** — "set up my environment", "what do I install", "where do I start". The full run, steps 1–6. A non-green line at the end sends you back to step 4 or 5, unless it is stuck.

**Repair** — "docker isn't working", "npm is missing". The full run scoped to the reported tool and whatever it depends on: step 1 for what that tool's requirement and check actually are, step 2 to see the state it is in, then 4 or 5 to close it and 6 to prove it. Ends the way setup does.

When the wording admits both check and setup, start with the check: it changes nothing, costs less, and setup needs its result anyway.

## 1. Work out what the project needs

The source of requirements is the project's own document — `PREREQUISITES.md`, `CONTRIBUTING.md`, or the install section of the README. If one exists it is the entire source of truth: tool list, platform commands, verification block, troubleshooting. Follow it rather than inventing versions on top of it.

No such document — derive the requirements from the repository: [discovery.md](discovery.md).

Done when four things are known for every tool: minimum version, the command that checks it, whether it is required, and whether you install it or the human does.

## 2. Measure

Identify the operating system. Check the presence and version of every tool on the list. Where step 1 found a verification block, that block is the measurement — run it rather than assembling checks of your own.

Present the result as a table: tool, required, found, verdict. Done when every row has a verdict: green, missing, or below the minimum. Installing starts at step 4 — this step only measures.

## 3. Hand over what the human can do in parallel

Sign-ups, access requests, and anything else that does not depend on installed software are blockers with no dependencies of their own. Send them in one message now, so the human works through them while you work; anything step 1 found to cost money to run goes in that message in plain words.

Done when the list is sent. Move on to installing rather than waiting for answers.

## 4. Install what you can

Work through what step 2 found. Installing something missing is yours to do, using the platform's own package manager. Replacing a tool the machine already has — one below the minimum — is not: a global Node or Python serves other projects too. Pin the version for this project where a version manager allows it, and ask before touching a shared one.

Configure whatever a command can configure: Git identity, line endings on Windows.

A decision that changes every command after it belongs to the human — on Windows that is whether to work inside WSL2 or outside it. Ask it before the first install, otherwise half the work gets thrown away.

Run each tool's check immediately after installing it. Done when every tool you installed is green.

## 5. Close the blockers that depended on installs

What is left needs hands and was impossible earlier: interactive logins, first launch of GUI applications, virtualization in BIOS, system permissions.

The human runs an interactive command inside this same session by typing `! <command>` — its output lands directly in the conversation, so you see the result. Offer that specific route.

Done when every blocker is closed and verified by your own command rather than by their word. Collect the answers to step 3's sign-ups here as well.

## 6. Run the whole verification

If the project document carries a verification block, run it — unless nothing on the machine has changed since step 2 ran it, in which case show that output rather than running it twice. If there is no block, assemble one from the commands found in step 1.

Show the output. Done when every line has a result; the branch you are in decides where a non-green line leads.

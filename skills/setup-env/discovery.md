# Deriving requirements from the repository

There is no requirements document, so the list gets assembled from scratch. Every entry rests on a file you actually looked at — "a project like this usually needs" guesses do not belong on the list.

## What implies what

| Found in the repository | Required | Where the minimum version comes from |
|---|---|---|
| `pyproject.toml`, `requirements.txt`, `*.py` | Python | `requires-python` in pyproject |
| `uv.lock` | uv | latest |
| `poetry.lock` | Poetry | latest |
| `package.json`, `*.ts` | Node.js | `engines.node`, otherwise the current LTS |
| `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb` | whichever manager's lockfile is present | `packageManager` in package.json |
| `Dockerfile`, `compose.yaml` | Docker | latest |
| `Cargo.toml` | Rust | `rust-version` |
| `go.mod` | Go | the `go` directive |
| `Gemfile` | Ruby | `.ruby-version` |
| `.tool-versions`, `.mise.toml` | everything the file lists | the same file |
| `.github/workflows/` | git, GitHub CLI | — |

**CI is the most reliable source of versions.** A workflow records what the tests actually pass on. Where it disagrees with a manifest, trust the workflow: manifests often state an intention, workflows state a verified fact.

## Accounts and external services

Manifests do not reveal these, and an environment without them is incomplete. Look in the README, `.env.example`, and the deployment configuration: a variable named `*_TOKEN`, `*_API_KEY`, `*_URL`, or `*_SECRET` means an external service, which means a sign-up, which makes it a blocker for step 3.

Check separately whether the service costs money to run continuously. Learning that up front is cheaper than learning it halfway through.

## What counts as a check

Every tool needs a command that answers "is it working", not "is a file on disk". Where a tool has a separate daemon or service, a client version string is not that answer — the check has to reach the daemon.

## Make the result stick

Show the assembled list to the human and offer to record it in `PREREQUISITES.md`; `prerequisites-template.md` sits next to this file as a starting point. From the next run on, the project document becomes the source instead of your reading of the manifests, and step 1 stops depending on inference.

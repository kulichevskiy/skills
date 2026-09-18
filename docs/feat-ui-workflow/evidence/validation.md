# Local verification

Base: `49747eb`; intended uncommitted files are pinned in `source-sha256.txt`.

- `npm test`: **97/97 passed**, 0 skipped. Full log: `installers.log`. Node v26.5.0, npm 11.17.0 on local macOS. Includes both bundles × two installers × four targets × project/global × English/Russian; preflight conflicts, force replacement, missing members, dangling links, cross-bundle upgrades, standalone 17-case parity, POSIX dash, npm archive/exec and shell fetch/unpack paths. Network routes use a local archive and isolated homes.
- `node --check test/installers.test.mjs`, `sh -n install.sh`, `git diff --check`: passed.
- 48 local Markdown links in public docs and SDLC skill resources resolve. Installed skill links are checked again in each bundle matrix case.
- Skill frontmatter and agents/openai.yaml for all three UI skills parsed with Ruby YAML; names, allowed fields, descriptions, metadata lengths/default prompts and unfinished placeholders checked: passed.
- Bundled Python `quick_validate.py` could not launch because PyYAML is absent. Equivalent applicable constraints above were checked using the available Ruby YAML parser; no dependencies or project policy were changed to make validation pass.
- Existing CI targets Node 18/22 on Ubuntu/macOS. Remote CI was not run: no push or PR was requested. Local results do not claim that remote matrix or any installed agent host was exercised.

Behavioral evaluations use isolated fixtures under `/private/tmp/sdlc-ui-eval-3ndyxvwr/`; their receipts and limitations are recorded separately. Installer validation does not substitute for behavioral or rendered UI evaluation.

Review receipts copied into this evidence directory include snapshots of their adopted kit documents; relative report links were adjusted to those copies. Reviewed product sources remained unchanged in the original fixtures.

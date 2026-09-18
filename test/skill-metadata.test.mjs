import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
function textFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? textFiles(path) : /\.(?:md|yaml|yml|json)$/.test(path) ? [path] : []
  })
}

for (const source of ['skills', 'plugins/sdlc/skills']) {
  for (const entry of readdirSync(join(root, source), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const directory = join(root, source, entry.name)
    test(`${entry.name}: English sources and consistent discovery metadata`, () => {
      for (const path of textFiles(directory)) {
        assert.doesNotMatch(readFileSync(path, 'utf8'), /\p{Script=Cyrillic}/u, path)
      }
      const skill = readFileSync(join(directory, 'SKILL.md'), 'utf8')
      const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/)
      assert.ok(frontmatter, 'YAML frontmatter is required')
      assert.match(frontmatter[1], new RegExp(`^name: ${entry.name}$`, 'm'))
      assert.match(frontmatter[1], /^description: "?[A-Z].+/m)
      const titles = [...skill.matchAll(/^# (.+)$/gm)]
      assert.equal(titles.length, 1, 'One main title per skill')
      assert.match(titles[0][1], /^[A-Z]/)
      assert.doesNotMatch(titles[0][1], /sdlc-/)
      const metadata = readFileSync(join(directory, 'agents/openai.yaml'), 'utf8')
      const field = name => {
        const match = metadata.match(new RegExp(`^  ${name}: (".*")$`, 'm'))
        assert.ok(match, `Quoted ${name} is required`)
        return JSON.parse(match[1])
      }
      assert.equal(field('display_name'), entry.name)
      const summary = field('short_description')
      assert.ok(summary.length >= 25 && summary.length <= 64)
      assert.match(summary, /^[A-Z]/)
      assert.equal(field('default_prompt'), `Use $${entry.name} for this project and the task I describe.`)
    })
  }
}

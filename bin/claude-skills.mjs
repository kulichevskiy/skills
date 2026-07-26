#!/usr/bin/env node
import { cpSync, existsSync, readdirSync, readFileSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'skills')

function available() {
  if (!existsSync(SOURCE)) return []
  return readdirSync(SOURCE, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(SOURCE, entry.name, 'SKILL.md')))
    .map((entry) => ({ name: entry.name, summary: summarize(join(SOURCE, entry.name, 'SKILL.md')) }))
}

function summarize(skillFile) {
  const frontmatter = readFileSync(skillFile, 'utf8').split('---')[1] ?? ''
  const line = frontmatter.split('\n').find((it) => it.startsWith('description:'))
  if (!line) return ''
  const text = line.slice('description:'.length).trim()
  const lead = text.split(/(?<=[.:])\s|\s+[—–-]\s+/)[0]
  return lead.length > 110 ? `${lead.slice(0, 107)}...` : lead
}

function usage(skills) {
  console.log(`
Skills for Claude Code.

  npx github:kulichevskiy/skills <skill>             into this project, ./.claude/skills/
  npx github:kulichevskiy/skills <skill> --global    for every project, ~/.claude/skills/
  npx github:kulichevskiy/skills <skill> --force     overwrite an installed copy

Available:
`)
  if (skills.length === 0) {
    console.log('  (nothing found — skills/ is empty)\n')
    return
  }
  for (const skill of skills) {
    console.log(`  ${skill.name}`)
    if (skill.summary) console.log(`    ${skill.summary}`)
  }
  console.log('')
}

function fail(message) {
  console.error(`\n  ${message}\n`)
  process.exit(1)
}

const args = process.argv.slice(2)
const flags = new Set(args.filter((it) => it.startsWith('--')))
const requested = args.find((it) => !it.startsWith('--'))
const skills = available()

if (!requested || flags.has('--help')) {
  usage(skills)
  process.exit(requested ? 0 : 1)
}

const skill = skills.find((it) => it.name === requested)
if (!skill) {
  fail(`No skill named "${requested}" here. Available: ${skills.map((it) => it.name).join(', ') || '(none)'}`)
}

const root = flags.has('--global') ? homedir() : process.cwd()
const target = join(root, '.claude', 'skills')
const destination = join(target, skill.name)

if (existsSync(destination) && !flags.has('--force')) {
  fail(`Already installed at ${destination}\n  Add --force to overwrite it.`)
}

mkdirSync(target, { recursive: true })
cpSync(join(SOURCE, skill.name), destination, { recursive: true })

const shown = flags.has('--global') ? destination : relative(process.cwd(), destination) || destination
const scope = flags.has('--global') ? 'in every project' : 'in this project'

console.log(`
  Installed at ${shown}
  Available ${scope} — call it as /${skill.name} or let its description triggers fire.
`)

#!/usr/bin/env node
import { appendFileSync, cpSync, existsSync, readdirSync, readFileSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const SOURCE = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'skills')

// A skill is the same folder everywhere — SKILL.md plus its siblings. Only the
// directory the agent reads differs, so a target is just a pair of paths.
const TARGETS = [
  { name: 'claude', label: 'Claude Code', project: ['.claude', 'skills'], home: ['.claude', 'skills'], call: '/' },
  { name: 'cursor', label: 'Cursor', project: ['.cursor', 'skills'], home: ['.cursor', 'skills'], call: '/' },
  { name: 'codex', label: 'Codex', project: ['.codex', 'skills'], home: ['.codex', 'skills'], call: '$' },
  { name: 'copilot', label: 'GitHub Copilot', project: ['.github', 'skills'], home: ['.copilot', 'skills'], call: '/' },
]

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
Skills for Claude Code, Cursor, Codex and GitHub Copilot.

  npx github:kulichevskiy/skills <skill>            into this project
  npx github:kulichevskiy/skills <skill> --global   for every project

  --target=<${TARGETS.map((it) => it.name).join('|')}>   where to install, asked if omitted
  --lang=<language>   language the agent answers in, asked if omitted
  --force             overwrite an installed copy

Both questions are skipped when the output is not a terminal, so the command
stays usable from a script: it installs for Claude Code in English.

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

// Ctrl-D closes the input without answering, and rl.question() never settles on
// its own after that. Pulling lines off the iterator instead settles either way:
// a buffered line still arrives, and a close with nothing behind it ends the
// iteration, so an unanswered question takes its default rather than hanging.
function reader() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const lines = rl[Symbol.asyncIterator]()
  return {
    async ask(query, fallback) {
      process.stdout.write(query)
      const { value, done } = await lines.next()
      if (done) process.stdout.write('\n')
      return done ? fallback : value.trim() || fallback
    },
    close: () => rl.close(),
  }
}

async function askTarget(io) {
  console.log('\n  Which agent reads these skills?\n')
  TARGETS.forEach((it, index) => console.log(`    ${index + 1}. ${it.label.padEnd(15)} ${it.project.join('/')}/`))
  const answer = (await io.ask('\n  Number or name [1]: ', '1')).toLowerCase()
  const picked = TARGETS[Number(answer) - 1] ?? TARGETS.find((it) => it.name === answer)
  if (!picked) fail(`Not one of the listed agents: "${answer}"`)
  return picked
}

async function askLanguage(io) {
  return io.ask('\n  Language the agent should answer you in [English]: ', 'English')
}

// The skill in the repository stays English; only the installed copy is told to
// answer in another language, so --force keeps overwriting cleanly.
function localize(skillFile, language) {
  if (/^en(glish)?$/i.test(language)) return false
  appendFileSync(skillFile, `\n## Language\n\nAnswer the user in ${language}. Commands, file paths and code stay as written.\n`)
  return true
}

const args = process.argv.slice(2)
const flags = new Map()
for (const arg of args.filter((it) => it.startsWith('--'))) {
  const [key, value] = arg.slice(2).split('=')
  flags.set(key, value ?? true)
}
const requested = args.find((it) => !it.startsWith('--'))
const skills = available()

if (!requested || flags.has('help')) {
  usage(skills)
  process.exit(requested ? 0 : 1)
}

const skill = skills.find((it) => it.name === requested)
if (!skill) {
  fail(`No skill named "${requested}" here. Available: ${skills.map((it) => it.name).join(', ') || '(none)'}`)
}

let target = null
if (flags.has('target')) {
  target = TARGETS.find((it) => it.name === String(flags.get('target')).toLowerCase())
  if (!target) fail(`Unknown --target. Pick one of: ${TARGETS.map((it) => it.name).join(', ')}`)
}
let language = typeof flags.get('lang') === 'string' ? flags.get('lang') : null

if ((!target || !language) && process.stdin.isTTY && process.stdout.isTTY) {
  const io = reader()
  try {
    target ??= await askTarget(io)
    language ??= await askLanguage(io)
  } finally {
    io.close()
  }
}
target ??= TARGETS[0]
language ??= 'English'

const everywhere = flags.has('global')
const directory = join(everywhere ? homedir() : process.cwd(), ...(everywhere ? target.home : target.project))
const destination = join(directory, skill.name)

if (existsSync(destination) && !flags.has('force')) {
  fail(`Already installed at ${destination}\n  Add --force to overwrite it.`)
}

mkdirSync(directory, { recursive: true })
cpSync(join(SOURCE, skill.name), destination, { recursive: true })
const localized = localize(join(destination, 'SKILL.md'), language)

const shown = everywhere ? destination : relative(process.cwd(), destination) || destination
const scope = everywhere ? 'in every project' : 'in this project'

console.log(`
  Installed at ${shown}
  Available to ${target.label} ${scope} — call it as ${target.call}${skill.name} or let its description triggers fire.${localized ? `\n  It answers you in ${language}.` : ''}
`)

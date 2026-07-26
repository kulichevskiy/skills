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
Скиллы для Claude Code.

  npx github:kulichevskiy/skills <скилл>             в текущий проект, ./.claude/skills/
  npx github:kulichevskiy/skills <скилл> --global    для всех проектов, ~/.claude/skills/
  npx github:kulichevskiy/skills <скилл> --force     перезаписать установленный

Доступно:
`)
  if (skills.length === 0) {
    console.log('  (ничего не найдено — каталог skills/ пуст)\n')
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
  fail(`Скилла «${requested}» здесь нет. Доступно: ${skills.map((it) => it.name).join(', ') || '(пусто)'}`)
}

const root = flags.has('--global') ? homedir() : process.cwd()
const target = join(root, '.claude', 'skills')
const destination = join(target, skill.name)

if (existsSync(destination) && !flags.has('--force')) {
  fail(`Уже установлен: ${destination}\n  Перезаписать — добавь --force.`)
}

mkdirSync(target, { recursive: true })
cpSync(join(SOURCE, skill.name), destination, { recursive: true })

const shown = flags.has('--global') ? destination : relative(process.cwd(), destination) || destination
const scope = flags.has('--global') ? 'во всех проектах' : 'в этом проекте'

console.log(`
  Установлен: ${shown}
  Доступен ${scope} — вызывается как /${skill.name} или своими триггерами из description.
`)

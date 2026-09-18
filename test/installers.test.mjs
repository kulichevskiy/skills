import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const members = ['sdlc-setup', 'sdlc-capture-intent', 'sdlc-to-spec', 'sdlc-to-tickets', 'sdlc-implement', 'sdlc-code-review', 'sdlc-babysit']
const targets = {
  claude: ['.claude/skills', '.claude/skills'],
  codex: ['.agents/skills', '.agents/skills'],
  cursor: ['.cursor/skills', '.cursor/skills'],
  copilot: ['.github/skills', '.copilot/skills'],
}

function sandbox(t) {
  const box = mkdtempSync(join(tmpdir(), 'agent-skills-test-'))
  t.after(() => rmSync(box, { recursive: true, force: true }))
  mkdirSync(join(box, 'home'))
  return box
}

function run(kind, box, args, source = root) {
  const command = kind === 'node' ? process.execPath : 'sh'
  const script = join(source, kind === 'node' ? 'bin/agent-skills.mjs' : 'install.sh')
  return spawnSync(command, [script, ...args], {
    cwd: box,
    // Each child gets a disposable home, so global installs cannot touch the user.
    env: { ...process.env, HOME: join(box, 'home'), SKILLS_SOURCE: source },
    encoding: 'utf8', input: '', timeout: 15000, detached: true,
  })
}

function success(result) {
  assert.ifError(result.error)
  assert.equal(result.status, 0, result.stderr || result.stdout)
}

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? files(path) : [path]
  })
}

function verifyBundle(directory, language = 'English') {
  assert.deepEqual(readdirSync(directory).sort(), [...members].sort())
  for (const name of members) {
    const source = join(root, 'skills', name)
    const destination = join(directory, name)
    assert.deepEqual(
      files(destination).map(path => path.slice(destination.length + 1)).sort(),
      files(source).map(path => path.slice(source.length + 1)).sort(),
      `${name}: complete tree without stale files`,
    )
    for (const path of files(source)) {
      const relative = path.slice(source.length + 1)
      const original = readFileSync(path, 'utf8')
      const installed = readFileSync(join(destination, relative), 'utf8')
      const suffix = relative === 'SKILL.md' && language !== 'English'
        ? `\n## Language\n\nAnswer the user in ${language}. Commands, file paths and code stay as written.\n` : ''
      assert.equal(installed, original + suffix, `${name}/${relative}`)
      if (path.endsWith('.md')) {
        for (const [, link] of installed.matchAll(/\]\(([^)]+)\)/g)) {
          if (/^(?:https?:|#)/.test(link)) continue
          assert.ok(existsSync(resolve(dirname(join(destination, relative)), link)), `Broken installed link: ${name}/${relative} -> ${link}`)
        }
      }
    }
  }
}

for (const kind of ['node', 'shell']) {
  for (const [target, directories] of Object.entries(targets)) {
    for (const global of [false, true]) {
      for (const language of ['English', 'Russian']) {
        test(`${kind}: ${target}, ${global ? 'global' : 'project'}, ${language}`, t => {
          const box = sandbox(t)
          const args = ['sdlc', `--target=${target}`, `--lang=${language}`, ...(global ? ['--global'] : [])]
          const result = run(kind, box, args)
          success(result)
          assert.match(result.stdout, /sdlc-setup/)
          const directory = join(box, global ? 'home' : '', directories[Number(global)])
          verifyBundle(directory, language)
          assert.ok(!existsSync(join(box, global ? directories[0] : `home/${directories[1]}`)))
        })
      }
    }
  }

  test(`${kind}: noninteractive defaults and listing`, t => {
    const box = sandbox(t)
    const listing = run(kind, box, [])
    success(listing)
    assert.match(listing.stdout, /sdlc/)
    assert.match(listing.stdout, /setup-env/)
    assert.ok(!existsSync(join(box, '.claude')))
    success(run(kind, box, ['sdlc']))
    verifyBundle(join(box, '.claude/skills'))
  })

  test(`${kind}: reject invalid requests without writes`, t => {
    const box = sandbox(t)
    for (const args of [
      ['sdlc-implement'], ['sdlc-setup'], ['../skills/setup-env'], ['missing'],
      ['sdlc', 'setup-env'], ['sdlc', '--target=vim'], ['sdlc', '--target'],
      ['sdlc', '--lang='], ['sdlc', '--force=false'], ['sdlc', '--global=false'],
    ]) {
      const result = run(kind, box, args)
      assert.ifError(result.error)
      assert.notEqual(result.status, 0, args.join(' '))
      assert.deepEqual(readdirSync(box), ['home'])
    }
  })

  test(`${kind}: preflight last member conflict before installing anything`, t => {
    const box = sandbox(t)
    const directory = join(box, '.claude/skills')
    const existing = join(directory, 'sdlc-babysit')
    mkdirSync(existing, { recursive: true })
    writeFileSync(join(existing, 'keep.txt'), 'local edit')
    assert.notEqual(run(kind, box, ['sdlc']).status, 0)
    assert.deepEqual(readdirSync(directory), ['sdlc-babysit'])
    assert.equal(readFileSync(join(existing, 'keep.txt'), 'utf8'), 'local edit')
  })

  test(`${kind}: dangling destination symlink requires force`, t => {
    const box = sandbox(t)
    const directory = join(box, '.claude/skills')
    mkdirSync(directory, { recursive: true })
    symlinkSync(join(box, 'absent'), join(directory, 'sdlc-babysit'))
    assert.notEqual(run(kind, box, ['sdlc']).status, 0)
    assert.ok(lstatSync(join(directory, 'sdlc-babysit')).isSymbolicLink())
    success(run(kind, box, ['sdlc', '--force']))
    verifyBundle(directory)
    assert.ok(!existsSync(join(box, 'absent')))
  })

  test(`${kind}: force replaces every member, preserves unrelated skills`, t => {
    const box = sandbox(t)
    success(run(kind, box, ['sdlc', '--lang=Russian']))
    const directory = join(box, '.claude/skills')
    for (const member of members) writeFileSync(join(directory, member, 'stale.md'), 'old')
    mkdirSync(join(directory, 'unrelated'))
    writeFileSync(join(directory, 'unrelated/keep.txt'), 'untouched')
    assert.notEqual(run(kind, box, ['sdlc']).status, 0)
    success(run(kind, box, ['sdlc', '--lang=Russian', '--force']))
    assert.equal(readFileSync(join(directory, 'unrelated/keep.txt'), 'utf8'), 'untouched')
    rmSync(join(directory, 'unrelated'), { recursive: true })
    verifyBundle(directory, 'Russian')
    success(run(kind, box, ['sdlc', '--lang=English', '--force']))
    verifyBundle(directory)
  })

  test(`${kind}: missing source member prevents partial installation`, t => {
    const box = sandbox(t)
    const source = join(box, 'source')
    for (const entry of ['bin', 'bundles', 'skills', 'install.sh']) cpSync(join(root, entry), join(source, entry), { recursive: true })
    rmSync(join(source, 'skills/sdlc-babysit'), { recursive: true })
    assert.notEqual(run(kind, box, ['sdlc'], source).status, 0)
    assert.ok(!existsSync(join(box, '.claude')))
  })
}

test('existing single-skill installer parity', () => {
  const result = spawnSync('sh', [join(root, 'test/parity.sh')], {
    env: { ...process.env, NODE: process.execPath },
    encoding: 'utf8', input: '', detached: true, timeout: 30000,
  })
  success(result)
  assert.match(result.stdout, /17 cases, 0 differing/)
})

test('npm package installs via npm exec and the shell archive route', t => {
  const box = sandbox(t)
  const cache = join(box, 'cache')
  const packed = spawnSync('npm', ['pack', '--json', '--ignore-scripts', '--cache', cache, '--pack-destination', box], {
    cwd: root, encoding: 'utf8', detached: true, timeout: 30000,
  })
  success(packed)
  const [metadata] = JSON.parse(packed.stdout)
  const archive = join(box, metadata.filename)
  const contents = metadata.files.map(file => file.path)
  assert.ok(contents.includes('bundles/sdlc.txt'))
  assert.ok(contents.includes('install.sh'))
  for (const member of members) assert.ok(contents.includes(`skills/${member}/SKILL.md`))
  assert.ok(!contents.some(path => path.startsWith('test/') || path.startsWith('.git/')))

  const installed = spawnSync('npm', ['exec', '--offline', '--yes', '--cache', cache, '--package', archive,
    '--', 'agent-skills', 'sdlc', '--target=codex', '--lang=English'], {
    cwd: box, env: { ...process.env, HOME: join(box, 'home') },
    encoding: 'utf8', detached: true, timeout: 30000,
  })
  success(installed)
  verifyBundle(join(box, '.agents/skills'))

  // Exercise the real fetch/unpack path and sh -s stdin handling without network.
  const mockBin = join(box, 'mock-bin')
  mkdirSync(mockBin)
  writeFileSync(join(mockBin, 'curl'), '#!/bin/sh\ncat "$TEST_ARCHIVE"\n', { mode: 0o755 })
  const env = { ...process.env, HOME: join(box, 'home'), PATH: `${mockBin}:${process.env.PATH}`, TEST_ARCHIVE: archive }
  delete env.SKILLS_SOURCE
  const shell = spawnSync('sh', ['-s', '--', 'sdlc', '--target=cursor', '--lang=English'], {
    cwd: box, env, input: readFileSync(join(root, 'install.sh'), 'utf8'),
    encoding: 'utf8', detached: true, timeout: 15000,
  })
  success(shell)
  verifyBundle(join(box, '.cursor/skills'))
})

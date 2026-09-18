import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const uiMembers = ['sdlc-ui-kit', 'sdlc-ui-implement', 'sdlc-ui-review']
const members = ['sdlc-setup', 'sdlc-capture-intent', 'sdlc-to-spec', 'sdlc-to-tickets', 'sdlc-implement', 'sdlc-code-review', 'sdlc-babysit', ...uiMembers]
const bundles = { sdlc: members, 'sdlc-ui': uiMembers }
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

function verifyBundle(directory, language = 'English', expected = members) {
  assert.deepEqual(readdirSync(directory).sort(), [...expected].sort())
  for (const name of expected) {
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
  for (const [bundle, selectedMembers] of Object.entries(bundles)) {
    const entry = bundle === 'sdlc' ? 'sdlc-setup' : 'sdlc-ui-kit'
    const lastMember = selectedMembers.at(-1)
    for (const [target, directories] of Object.entries(targets)) {
      for (const global of [false, true]) {
        for (const language of ['English', 'Russian']) {
          test(`${kind}/${bundle}: ${target}, ${global ? 'global' : 'project'}, ${language}`, t => {
            const box = sandbox(t)
            const args = [bundle, `--target=${target}`, `--lang=${language}`, ...(global ? ['--global'] : [])]
            const result = run(kind, box, args)
            success(result)
            assert.ok(result.stdout.includes(entry))
            const directory = join(box, global ? 'home' : '', directories[Number(global)])
            verifyBundle(directory, language, selectedMembers)
            assert.ok(!existsSync(join(box, global ? directories[0] : `home/${directories[1]}`)))
          })
        }
      }
    }

    test(`${kind}/${bundle}: noninteractive defaults and listing`, t => {
      const box = sandbox(t)
      const listing = run(kind, box, [])
      success(listing)
      assert.match(listing.stdout, /sdlc-ui/)
      assert.match(listing.stdout, /setup-env/)
      assert.ok(!existsSync(join(box, '.claude')))
      success(run(kind, box, [bundle]))
      verifyBundle(join(box, '.claude/skills'), 'English', selectedMembers)
    })

    test(`${kind}/${bundle}: reject invalid requests without writes`, t => {
      const box = sandbox(t)
      for (const args of [
        ['sdlc-implement'], ['sdlc-setup'], ['sdlc-ui-kit'], ['sdlc-ui-implement'], ['sdlc-ui-review'], ['sdlc-unknown'], ['../skills/setup-env'], ['missing'],
        [bundle, 'setup-env'], [bundle, '--target=vim'], [bundle, '--target'],
        [bundle, '--lang='], [bundle, '--force=false'], [bundle, '--global=false'],
      ]) {
        const result = run(kind, box, args)
        assert.ifError(result.error)
        assert.notEqual(result.status, 0, args.join(' '))
        assert.deepEqual(readdirSync(box), ['home'])
      }
    })

    test(`${kind}/${bundle}: preflight last member conflict before installing anything`, t => {
      const box = sandbox(t)
      const directory = join(box, '.claude/skills')
      const existing = join(directory, lastMember)
      mkdirSync(existing, { recursive: true })
      writeFileSync(join(existing, 'keep.txt'), 'local edit')
      assert.notEqual(run(kind, box, [bundle]).status, 0)
      assert.deepEqual(readdirSync(directory), [lastMember])
      assert.equal(readFileSync(join(existing, 'keep.txt'), 'utf8'), 'local edit')
    })

    test(`${kind}/${bundle}: dangling destination symlink requires force`, t => {
      const box = sandbox(t)
      const directory = join(box, '.claude/skills')
      mkdirSync(directory, { recursive: true })
      symlinkSync(join(box, 'absent'), join(directory, lastMember))
      assert.notEqual(run(kind, box, [bundle]).status, 0)
      assert.ok(lstatSync(join(directory, lastMember)).isSymbolicLink())
      success(run(kind, box, [bundle, '--force']))
      verifyBundle(directory, 'English', selectedMembers)
      assert.ok(!existsSync(join(box, 'absent')))
    })

    test(`${kind}/${bundle}: force replaces every member, preserves unrelated skills`, t => {
      const box = sandbox(t)
      success(run(kind, box, [bundle, '--lang=Russian']))
      const directory = join(box, '.claude/skills')
      for (const member of selectedMembers) writeFileSync(join(directory, member, 'stale.md'), 'old')
      mkdirSync(join(directory, 'unrelated'))
      writeFileSync(join(directory, 'unrelated/keep.txt'), 'untouched')
      assert.notEqual(run(kind, box, [bundle]).status, 0)
      success(run(kind, box, [bundle, '--lang=Russian', '--force']))
      assert.equal(readFileSync(join(directory, 'unrelated/keep.txt'), 'utf8'), 'untouched')
      rmSync(join(directory, 'unrelated'), { recursive: true })
      verifyBundle(directory, 'Russian', selectedMembers)
      success(run(kind, box, [bundle, '--lang=English', '--force']))
      verifyBundle(directory, 'English', selectedMembers)
    })

    test(`${kind}/${bundle}: missing source member prevents partial installation`, t => {
      const box = sandbox(t)
      const source = join(box, 'source')
      for (const entry of ['bin', 'bundles', 'skills', 'install.sh']) cpSync(join(root, entry), join(source, entry), { recursive: true })
      rmSync(join(source, 'skills', lastMember), { recursive: true })
      assert.notEqual(run(kind, box, [bundle], source).status, 0)
      assert.ok(!existsSync(join(box, '.claude')))
    })
  }
}

test('existing single-skill installer parity', () => {
  const result = spawnSync('sh', [join(root, 'test/parity.sh')], {
    env: { ...process.env, NODE: process.execPath },
    encoding: 'utf8', input: '', detached: true, timeout: 30000,
  })
  success(result)
  assert.match(result.stdout, /17 cases, 0 differing/)
})

for (const [bundle, selectedMembers] of Object.entries(bundles)) {
  test(`${bundle}: POSIX dash installs without a controlling terminal`, t => {
    const available = spawnSync('dash', ['-c', 'exit 0'])
    if (available.error?.code === 'ENOENT') return t.skip('dash is not installed')
    success(available)
    const box = sandbox(t)
    const result = spawnSync('dash', [join(root, 'install.sh'), bundle, '--target=claude', '--lang=English'], {
      cwd: box, env: { ...process.env, SKILLS_SOURCE: root },
      encoding: 'utf8', input: '', detached: true, timeout: 15000,
    })
    success(result)
    verifyBundle(join(box, '.claude/skills'), 'English', selectedMembers)
  })

  test(`${bundle}: npm package installs via npm exec and the shell archive route`, t => {
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
    assert.ok(contents.includes('bundles/sdlc-ui.txt'))
    assert.ok(contents.includes('docs/installation.md'))
    assert.ok(!contents.some(path => path.startsWith('docs/feat-')))
    assert.ok(contents.includes('install.sh'))
    for (const member of members) assert.ok(contents.includes(`skills/${member}/SKILL.md`))
    assert.ok(!contents.some(path => path.startsWith('test/') || path.startsWith('.git/')))

    const installed = spawnSync('npm', ['exec', '--offline', '--yes', '--cache', cache, '--package', archive,
      '--', 'agent-skills', bundle, '--target=codex', '--lang=English'], {
      cwd: box, env: { ...process.env, HOME: join(box, 'home') },
      encoding: 'utf8', detached: true, timeout: 30000,
    })
    success(installed)
    verifyBundle(join(box, '.agents/skills'), 'English', selectedMembers)

    // Exercise the real fetch/unpack path and sh -s stdin handling without network.
    const mockBin = join(box, 'mock-bin')
    mkdirSync(mockBin)
    writeFileSync(join(mockBin, 'curl'), '#!/bin/sh\ncat "$TEST_ARCHIVE"\n', { mode: 0o755 })
    const env = { ...process.env, HOME: join(box, 'home'), PATH: `${mockBin}:${process.env.PATH}`, TEST_ARCHIVE: archive }
    delete env.SKILLS_SOURCE
    const shell = spawnSync('sh', ['-s', '--', bundle, '--target=cursor', '--lang=English'], {
      cwd: box, env, input: readFileSync(join(root, 'install.sh'), 'utf8'),
      encoding: 'utf8', detached: true, timeout: 15000,
    })
    success(shell)
    verifyBundle(join(box, '.cursor/skills'), 'English', selectedMembers)
  })

}

for (const kind of ['node', 'shell']) {
  test(`${kind}: UI-only update preserves core skills and product kit`, t => {
    const box = sandbox(t)
    success(run(kind, box, ['sdlc']))
    const directory = join(box, '.claude/skills')
    const corePath = join(directory, 'sdlc-setup/SKILL.md')
    writeFileSync(corePath, 'custom core instruction')
    mkdirSync(join(box, 'docs/ui-kit'), { recursive: true })
    writeFileSync(join(box, 'docs/ui-kit/index.md'), 'product kit')
    assert.notEqual(run(kind, box, ['sdlc-ui']).status, 0)
    success(run(kind, box, ['sdlc-ui', '--force']))
    assert.equal(readFileSync(corePath, 'utf8'), 'custom core instruction')
    assert.equal(readFileSync(join(box, 'docs/ui-kit/index.md'), 'utf8'), 'product kit')
    assert.deepEqual(readdirSync(directory).sort(), [...members].sort())
    for (const name of uiMembers) {
      assert.equal(readFileSync(join(directory, name, 'SKILL.md'), 'utf8'), readFileSync(join(root, 'skills', name, 'SKILL.md'), 'utf8'))
    }
  })
  test(`${kind}: expanding UI-only installation requires force before any write`, t => {
    const box = sandbox(t)
    success(run(kind, box, ['sdlc-ui']))
    const directory = join(box, '.claude/skills')
    assert.notEqual(run(kind, box, ['sdlc']).status, 0)
    verifyBundle(directory, 'English', uiMembers)
    success(run(kind, box, ['sdlc', '--force']))
    verifyBundle(directory)
  })
}

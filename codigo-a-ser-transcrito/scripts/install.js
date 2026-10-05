'use strict'
const fs = require('node:fs')
const path = require('node:path')
const { randomUUID } = require('node:crypto')
const { spawnSync } = require('node:child_process')
const { ROOT, STATE, digest, inside, resources, safePath } = require('./hub-resources')
const JOURNAL = '.hub-ai-transaction.json', LOCK = '.hub-ai-install.lock'
function atomicWrite(dest, data) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const temporary = path.join(path.dirname(dest), `.hub-ai-${randomUUID()}`)
  let fd
  try {
    fd = fs.openSync(temporary, 'wx', 0o600)
    fs.writeFileSync(fd, data); fs.fsyncSync(fd); fs.closeSync(fd); fd = undefined
    fs.renameSync(temporary, dest) // Replaces entry, not the hard-linked inode.
  } finally {
    if (fd !== undefined) fs.closeSync(fd)
    fs.rmSync(temporary, { force: true })
  }
}
function recover(target, write = atomicWrite) {
  const journal = safePath(target, JOURNAL)
  if (!fs.existsSync(journal)) return false
  const snapshots = JSON.parse(fs.readFileSync(journal, 'utf8')).before
  const decoded = {}
  for (const [name, encoded] of Object.entries(snapshots)) {
    safePath(target, name)
    if (encoded !== null && (typeof encoded !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded))) throw new Error('Invalid recovery snapshot')
    decoded[name] = encoded === null ? null : Buffer.from(encoded, 'base64')
  }
  for (const [name, data] of Object.entries(decoded).reverse()) {
    const dest = safePath(target, name)
    if (data === null) fs.rmSync(dest, { force: true }); else write(dest, data)
  }
  fs.unlinkSync(journal)
  return true
}
function parseArgs(argv) {
  const args = { profile: 'frontend' }, booleans = new Set(['overwrite', 'migrate', 'dry-run', 'recover'])
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (token === '--help') { args.help = true; continue }
    if (token.startsWith('--')) {
      const name = token.slice(2)
      if (booleans.has(name)) args[name] = true
      else if (['profile', 'capabilities'].includes(name) && argv[i + 1] && !argv[i + 1].startsWith('--')) args[name] = argv[++i]
      else throw new Error(`Unknown/missing option: ${token}`)
    } else if (!args.project) args.project = token
    else throw new Error('Only one project destination is allowed')
  }
  return args
}
function install(args, write = atomicWrite, log = console.log) {
  if (args.help) { log('node scripts/install.js PROJECT [--profile node|angular|react|nextjs|vue|frontend] [--capabilities base|LIST] [--dry-run] [--overwrite] [--migrate] [--recover]'); return }
  if (!args.project) throw new Error('Project path required')
  if (args.recover && args['dry-run']) throw new Error('--recover and --dry-run cannot be combined')
  const target = fs.realpathSync(args.project)
  if (!fs.statSync(target).isDirectory() || inside(ROOT, target)) throw new Error('Choose an existing project outside the hub')
  const journal = safePath(target, JOURNAL), lock = safePath(target, LOCK)
  const acquire = () => { const fd = fs.openSync(lock, 'wx', 0o600); try { fs.writeFileSync(fd, String(process.pid)) } finally { fs.closeSync(fd) } }
  if (args.recover) {
    if (fs.existsSync(lock)) {
      const pid = Number(fs.readFileSync(lock, 'utf8'))
      if (!Number.isInteger(pid) || pid <= 0) throw new Error('Invalid lock PID')
      try { process.kill(pid, 0); throw new Error('Installer process still running') } catch (error) { if (error.code !== 'ESRCH') throw error; fs.unlinkSync(lock) }
    }
    acquire()
    try { log(recover(target) ? 'Recovered interrupted transaction' : 'No transaction to recover') } finally { fs.rmSync(lock, { force: true }) }
    return
  }
  if (fs.existsSync(journal) || fs.existsSync(lock)) throw new Error('Installation locked/interrupted; inspect and run --recover')
  const capabilities = args.capabilities === undefined ? undefined : args.capabilities === 'base' ? [] : args.capabilities.split(',')
  const { manifest, selected, files } = resources(args.profile || 'frontend', capabilities)
  const statePath = safePath(target, STATE)
  const observedState = fs.existsSync(statePath) ? fs.readFileSync(statePath) : null
  const previous = observedState ? JSON.parse(observedState) : { schema: 1, files: {} }
  if (previous.schema !== 1 || !previous.files || typeof previous.files !== 'object') throw new Error('Unsupported installation state')
  const old = previous.files, operations = {}, conflicts = [], observed = {}
  for (const name of Object.keys(old)) {
    if (!/^\.github\/(agents|skills|templates)\//.test(name)) throw new Error(`Invalid managed path: ${name}`)
    safePath(target, name)
  }
  const obsolete = Object.keys(old).filter(name => !Object.hasOwn(files, name))
  for (const [name, data] of Object.entries(files)) {
    const dest = safePath(target, name), current = fs.existsSync(dest) ? fs.readFileSync(dest) : null
    observed[name] = current
    if (current && current.equals(data)) continue
    if (current && !args.overwrite) conflicts.push(name)
    operations[name] = data
  }
  if (args.migrate) for (const name of obsolete) {
    const dest = safePath(target, name), current = fs.existsSync(dest) ? fs.readFileSync(dest) : null
    observed[name] = current
    if (current && digest(current) !== old[name]) conflicts.push(`${name} (obsolete local customization)`)
    else if (current) operations[name] = null
  }
  else if (obsolete.length) log(`Obsolete resources retained; review --migrate: ${obsolete.join(', ')}`)
  for (const [name, data] of Object.entries(operations)) {
    log(`${data === null ? 'REMOVE' : observed[name] ? 'UPDATE' : 'ADD'} ${name}`)
    if (args['dry-run']) {
      const before = observed[name]?.toString() || '', after = data?.toString() || ''
      log(`--- ${name}\n+++ ${name}\n${before.split('\n').map(l => '-' + l).join('\n')}\n${after.split('\n').map(l => '+' + l).join('\n')}`)
    }
  }
  if (conflicts.length) throw new Error('No files written. Conflicts:\n' + conflicts.join('\n'))
  if (args['dry-run']) { log('Preview complete; no files written'); return }
  const commit = spawnSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], { encoding: 'utf8' })
  const state = { schema: 1, version: fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim(), source_commit: commit.status === 0 ? commit.stdout.trim() : null, profile: args.profile || 'frontend', capabilities: selected, files: { ...(args.migrate ? {} : old), ...Object.fromEntries(Object.entries(files).map(([n, d]) => [n, digest(d)])) } }
  operations[STATE] = Buffer.from(JSON.stringify(state, null, 2) + '\n'); observed[STATE] = observedState
  acquire()
  try {
    for (const [name, data] of Object.entries(observed)) {
      const dest = safePath(target, name), current = fs.existsSync(dest) ? fs.readFileSync(dest) : null
      if (data === null ? current !== null : !current?.equals(data)) throw new Error(`Destination changed during planning: ${name}`)
    }
    const before = Object.fromEntries(Object.keys(operations).map(name => [name, observed[name]?.toString('base64') ?? null]))
    write(journal, Buffer.from(JSON.stringify({ before }) + '\n'))
    try {
      for (const [name, data] of Object.entries(operations)) {
        const dest = safePath(target, name)
        if (data === null) fs.unlinkSync(dest); else write(dest, data)
      }
      fs.unlinkSync(journal)
    } catch (error) { recover(target); throw error }
  } finally { fs.rmSync(lock, { force: true }) }
  log(`Installed ${state.profile} ${state.version}; select ${manifest.setup}.`)
}
if (require.main === module) { try { install(parseArgs(process.argv.slice(2))) } catch (error) { console.error(error.message); process.exitCode = 1 } }
module.exports = { atomicWrite, recover, parseArgs, install }

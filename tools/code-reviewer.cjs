#!/usr/bin/env node
'use strict'
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const crypto = require('node:crypto')
const { execFileSync } = require('node:child_process')
const DEFAULT_REPO = 'https://github.com/thataspinola/hub-ai.git'
function parse(argv) {
  const args = { command: argv[0], project: '.', repo: DEFAULT_REPO }
  const boolean = new Set(['dry-run', 'overwrite', 'migrate', 'help'])
  for (let i = 1; i < argv.length; i++) {
    const name = argv[i].replace(/^--/, '')
    if (!argv[i].startsWith('--')) throw new Error('Use --project PATH for the destination')
    if (boolean.has(name)) args[name] = true
    else if (['project', 'profile', 'capabilities', 'ref', 'repo', 'source', 'cache'].includes(name) && argv[i + 1] && !argv[i + 1].startsWith('--')) args[name] = argv[++i]
    else throw new Error(`Unknown/missing option: ${argv[i]}`)
  }
  if (!['setup', 'update', 'doctor', 'recover', 'rollback', 'version', 'help'].includes(args.command)) throw new Error('Choose setup, update, doctor, recover, rollback, version or help')
  if (args.source && (args.ref || args.repo !== DEFAULT_REPO)) throw new Error('--source cannot be combined with --ref/--repo')
  if (!args.source && !['help', 'version'].includes(args.command) && !args.help && !/^[a-f0-9]{40}$/.test(args.ref || '')) throw new Error('--ref requires a full immutable commit SHA; branches/tags are not accepted')
  return args
}
function git(cwd, args) {
  return execFileSync('git', ['-c', 'core.hooksPath=' + os.devNull, '-c', 'credential.interactive=false', '-C', cwd, ...args], { encoding: 'utf8', timeout: 120000, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } }).trim()
}
function checkout(args) {
  if (args.source) return fs.realpathSync(args.source)
  if (args.repo.startsWith('-') || !(/^(https:\/\/|ssh:\/\/|git@)/.test(args.repo) || path.isAbsolute(args.repo))) throw new Error('Use a trusted HTTPS/SSH repository URL or absolute local repository path')
  const cache = path.resolve(args.cache || path.join(os.homedir(), '.cache/hub-ai-code-reviewer'))
  fs.mkdirSync(cache, { recursive: true })
  if (fs.lstatSync(cache).isSymbolicLink()) throw new Error('Cache directory cannot be a symlink')
  const key = crypto.createHash('sha256').update(args.repo + '\n' + args.ref).digest('hex')
  const dest = path.join(cache, key)
  const verify = dir => {
    if (fs.lstatSync(dir).isSymbolicLink() || git(dir, ['rev-parse', 'HEAD']) !== args.ref || git(dir, ['status', '--porcelain', '--untracked-files=all'])) throw new Error('Cached source changed; use a new --cache directory')
  }
  if (fs.existsSync(dest)) { verify(dest); return dest }
  const temporary = fs.mkdtempSync(path.join(cache, 'download-'))
  try {
    git(temporary, ['init', '--quiet'])
    git(temporary, ['remote', 'add', 'origin', args.repo])
    git(temporary, ['fetch', '--depth=1', '--no-tags', 'origin', args.ref])
    git(temporary, ['checkout', '--detach', '--quiet', args.ref])
    verify(temporary)
    try { fs.renameSync(temporary, dest) } catch (error) { if (!fs.existsSync(dest)) throw error; verify(dest) }
    return dest
  } finally { fs.rmSync(temporary, { recursive: true, force: true }) }
}
function run(args, log = console.log) {
  if (args.command === 'help' || args.help) {
    log('node tools/code-reviewer.cjs setup|update|rollback|doctor|recover --project PATH --ref FULL_COMMIT_SHA [--profile auto|react|nextjs|angular|vue|node|frontend] [--capabilities base|LIST] [--dry-run] [--migrate] [--overwrite] [--cache PATH] [--repo TRUSTED_URL]\nOffline/development: replace --ref/--repo with --source LOCAL_HUB_CHECKOUT. No npm installation is required; Node 22+ and Git are required for remote sources.'); return
  }
  if (args.command === 'version') { log(fs.readFileSync(path.join(__dirname, '../codigo-a-ser-transcrito/VERSION'), 'utf8').trim()); return 0 }
  const project = fs.realpathSync(args.project)
  if (!fs.statSync(project).isDirectory()) throw new Error('Project must be an existing directory')
  let previous
  if (['update', 'rollback'].includes(args.command)) {
    // Validate the state path before reading; installation validates all managed paths.
    const { safePath } = require('../codigo-a-ser-transcrito/scripts/hub-resources')
    previous = JSON.parse(fs.readFileSync(safePath(project, '.github/hub-ai-lock.json'), 'utf8'))
    if (previous.schema !== 1) throw new Error('Unsupported installation state')
  }
  const source = checkout(args)
  const scripts = path.join(source, 'codigo-a-ser-transcrito/scripts')
  if (!fs.existsSync(path.join(scripts, 'install.js')) || !fs.existsSync(path.join(source, 'resources/frontend'))) throw new Error('Source does not contain the complete reviewer resources')
  log(`Reviewer source: ${args.source ? source + ' (local; not pinned)' : args.repo + '@' + args.ref}`)
  if (args.command === 'doctor') {
    const issues = require(path.join(scripts, 'doctor.js')).diagnose(project)
    log(issues.length ? issues.join('\n') : 'Managed resources are consistent. Editor execution still requires verification.')
    return issues.length ? 1 : 0
  }
  const { install, supportsManagedUpdates } = require(path.join(scripts, 'install.js'))
  // The source must include safe managed updates; older releases must not silently downgrade this behavior.
  if (['update', 'rollback'].includes(args.command) && !supportsManagedUpdates) throw new Error('Selected source predates safe updates; choose a newer commit')
  install({ project, recover: args.command === 'recover', profile: args.profile || previous?.profile || 'auto', capabilities: args.capabilities ?? (previous ? previous.capabilities.join(',') || 'base' : undefined), 'update-managed': ['update', 'rollback'].includes(args.command), 'dry-run': args['dry-run'], overwrite: args.overwrite, migrate: args.migrate || args.command === 'rollback' }, undefined, log)
  if (args.command === 'recover') return 0
  log(`Select Copilot Setup to create project-specific instructions, then the installed Code Reviewer in your editor. ${args['dry-run'] ? 'Preview only.' : 'Resources installed; no review was executed.'}`)
  return 0
}
if (require.main === module) {
  try { process.exitCode = run(parse(process.argv.slice(2))) || 0 } catch (error) { console.error(error.message); process.exitCode = 1 }
}
module.exports = { parse, checkout, run }

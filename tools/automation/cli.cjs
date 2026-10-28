const fs = require('node:fs')
const path = require('node:path')
const { parseCommit, git, commits, documentation, journal, write } = require('./core.cjs')
const root = path.resolve(__dirname, '../..')

function installHooks() {
  const { spawnSync } = require('node:child_process')
  const current = spawnSync('git', ['config', '--get', 'core.hooksPath'], { cwd: root, encoding: 'utf8' })
  if (current.status !== 0 && current.status !== 1) throw new Error(current.stderr || 'Falha ao consultar hooksPath')
  if (current.stdout.trim() && current.stdout.trim() !== '.githooks') throw new Error('hooksPath existente: integre os comandos manualmente, sem sobrescrever seus hooks.')
  if (!current.stdout.trim()) {
    const hooks = path.resolve(root, git(root, ['rev-parse', '--git-path', 'hooks']).trim())
    if (fs.existsSync(hooks) && fs.readdirSync(hooks).some(name => !name.endsWith('.sample'))) throw new Error('Hooks existentes: integre os comandos manualmente.')
  }
  for (const name of ['pre-commit', 'commit-msg', 'post-commit', 'pre-push']) fs.chmodSync(path.join(root, '.githooks', name), 0o755)
  git(root, ['config', '--local', 'core.hooksPath', '.githooks'])
  console.log('Hooks ativados neste clone. Para desativar: git config --local --unset core.hooksPath')
}

function main() {
  const [command, ...args] = process.argv.slice(2)
  if (command === 'docs') write(root, 'docs/generated/reference.md', documentation(root), args.includes('--check'))
  else if (command === 'changelog') write(root, 'reports/change-journal.md', journal(commits(root, args[0] || 'HEAD')))
  else if (command === 'commit-file') {
    if (!args[0] || !parseCommit(fs.readFileSync(args[0], 'utf8'))) throw new Error('Use tipo(escopo): descrição; tipos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. Corpo separado por linha vazia.')
  } else if (command === 'commits') {
    const entries = args[0] ? commits(root, args[0]) : commits(root).slice(0, 1)
    if (!entries.length) throw new Error('Nenhum commit no intervalo; confira a base e o histórico disponível.')
    const invalid = entries.filter(entry => !parseCommit(entry.message))
    if (invalid.length) throw new Error(invalid.map(entry => `${entry.sha.slice(0, 12)}: ${entry.message.split('\n')[0]}`).join('\n'))
    console.log(`${entries.length} commits válidos`)
  } else if (command === 'release-plan') {
    if (!args[0]) throw new Error('Informe BASE..HEAD para planejar apenas alterações da próxima versão.')
    const entries = commits(root, args[0]).map(entry => parseCommit(entry.message))
    if (entries.some(entry => !entry)) throw new Error('Corrija os commits não convencionais antes de planejar a versão.')
    console.log(entries.some(entry => entry.breaking) ? 'major' : entries.some(entry => entry.type === 'feat') ? 'minor' : entries.some(entry => ['fix', 'perf'].includes(entry.type)) ? 'patch' : 'none')
  } else if (command === 'hooks') installHooks()
  else throw new Error('Comando desconhecido')
}

try { main() } catch (error) { console.error(error.message); process.exitCode = 1 }

const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']

function parseCommit(message) {
  const lines = message.replace(/\r/g, '').trim().split('\n')
  const match = /^([a-z]+)(?:\(([^()\r\n]+)\))?(!)?: (\S.*)$/.exec(lines[0])
  if (!match || !types.includes(match[1])) return null
  if (lines.length > 1 && lines[1] !== '') return null
  return { type: match[1], scope: match[2], description: match[4], breaking: Boolean(match[3]) || /^BREAKING[ -]CHANGE: \S/m.test(message) }
}

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
}

function commits(root, range = 'HEAD') {
  if (!/^[A-Za-z0-9_./~^@{}+-]+$/.test(range) || range.startsWith('-')) throw new Error('Intervalo Git inválido')
  return git(root, ['log', '--no-merges', '--format=%H%x00%cs%x00%B%x00', range, '--'])
    .split('\0').reduce((result, value, index, values) => {
      if (index % 3 === 0 && value.trim()) result.push({ sha: value.trim(), date: values[index + 1], message: values[index + 2].trim() })
      return result
    }, [])
}

function markdown(value) {
  return value.replace(/[\\`*_[\]<>|]/g, character => `\\${character}`).replace(/\r?\n/g, ' ')
}

function documentation(root) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const files = git(root, ['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0')
  const guides = [...new Set(files)].filter(file => /\.md$/.test(file) && !file.startsWith('docs/generated/') && !file.startsWith('reports/')).sort()
  const scripts = Object.entries(pkg.scripts || {}).sort(([a], [b]) => a.localeCompare(b, 'en'))
  return `<!-- Gerado por npm run docs:generate. Não editar manualmente. -->\n# Referência de ${markdown(pkg.name)}\n\nNode: ${markdown(pkg.engines?.node || 'consultar README')}.\n\nEste índice descreve comandos e documentos versionados; arquitetura e contratos continuam nos guias revisados pela equipe. Não é documentação inferida de APIs.\n\n## Comandos\n\n| Comando | Execução |\n| --- | --- |\n${scripts.map(([name, command]) => `| npm run ${markdown(name)} | ${markdown(command)} |`).join('\n')}\n\n## Guias e recursos\n\n${guides.map(file => `- [${markdown(file)}](../../${file.split('/').map(encodeURIComponent).join('/')})`).join('\n')}\n`
}

function journal(entries) {
  return '# Diário gerado do Git\n\nGerado sob demanda; CHANGELOG.md mantém as notas editoriais. Commits legados são preservados como não convencionais. Nenhum conteúdo de arquivos, segredo ou autor é coletado.\n\n' + entries.map(entry => {
    const parsed = parseCommit(entry.message)
    return `- ${entry.date} · ${entry.sha.slice(0, 12)} · ${parsed ? parsed.type : 'legado'}${parsed?.breaking ? ' · BREAKING CHANGE' : ''} · ${markdown(entry.message.split('\n')[0])}`
  }).join('\n') + '\n'
}

function write(root, file, content, check = false) {
  const destination = path.join(root, file)
  if (check) {
    if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8') !== content) throw new Error(`${file} desatualizado. Execute npm run docs:generate e versione o resultado.`)
  } else {
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.writeFileSync(destination, content)
  }
}

module.exports = { parseCommit, git, commits, documentation, journal, write }

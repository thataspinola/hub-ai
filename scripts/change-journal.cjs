'use strict'
const fs = require('node:fs')
const path = require('node:path')
const cp = require('node:child_process')

function generate(root = path.resolve(__dirname, '..')) {
  const history = cp.execFileSync('git', ['log', '--format=%cs%x09%h%x09%s'], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })
  const lines = history.trim().split('\n').filter(Boolean).map(line => '- ' + line.replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\t', ' · '))
  const file = path.join(root, 'reports', 'change-journal.md')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, '# Diário gerado do Git\n\nRegenerável. CHANGELOG.md mantém as notas editoriais.\n\n' + lines.join('\n') + '\n')
  return file
}

if (require.main === module) {
  try { console.log(generate()) }
  catch { console.error('Não foi possível gerar o diário: confira o histórico Git disponível'); process.exitCode = 1 }
}
module.exports = { generate }

'use strict'
const fs = require('node:fs')

function valid(message) {
  const lines = message.replace(/\r/g, '').trim().split('\n')
  return /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^()\r\n]+\))?!?: \S.*$/.test(lines[0]) && (lines.length === 1 || lines[1] === '')
}

if (require.main === module) {
  try {
    if (!process.argv[2] || !valid(fs.readFileSync(process.argv[2], 'utf8'))) throw Error('Use tipo(escopo): descrição e uma linha vazia antes do corpo')
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
module.exports = { valid }

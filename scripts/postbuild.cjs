'use strict'

const fs = require('node:fs')
const path = require('node:path')
const DIST = '.next'

function prepare(root = path.resolve(__dirname, '..')) {
  const dist = path.join(root, DIST),
    standalone = path.join(dist, 'standalone')

  if (
    !fs.existsSync(path.join(standalone, 'server.js')) ||
    !fs.existsSync(path.join(dist, 'static'))
  )
    throw new Error(
      'Standalone server/static artifacts missing; run a successful Next build first'
    )

  fs.cpSync(path.join(dist, 'static'), path.join(standalone, '.next', 'static'), {
    recursive: true,
  })

  if (fs.existsSync(path.join(root, 'public')))
    fs.cpSync(path.join(root, 'public'), path.join(standalone, 'public'), {
      recursive: true,
    })
}

if (require.main === module) {
  try {
    prepare()
    console.log('Standalone assets prepared')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

module.exports = { prepare, DIST }

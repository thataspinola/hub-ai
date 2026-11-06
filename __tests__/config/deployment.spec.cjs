'use strict'

const test = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('node:fs'),
  path = require('node:path'),
  os = require('node:os')

const { prepare, DIST } = require('../../scripts/postbuild.cjs')

test('both pipeline filename variants have identical, secret-free configuration', () => {
  for (const env of ['dev', 'hml', 'prd']) {
    const yaml = fs.readFileSync(`config/values_${env}.yaml`, 'utf8')
    assert.equal(yaml, fs.readFileSync(`config/values_${env}.yml`, 'utf8'))

    assert.match(
      yaml,
      /contextURL: \/react-ssr-corp-hubv-painel-administrativo/
    )

    assert.match(yaml, /namespace: corp-hubv/)
    assert.match(yaml, /enabled: true/)
    assert.doesNotMatch(yaml, /(?:SECRET|_S):\s*'[^']+'/)
  }
})

test('standalone preparation copies static and public assets and rejects missing builds', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-assets-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  assert.throws(() => prepare(root), /missing/)

  for (const file of [
    DIST + '/standalone/server.js',
    DIST + '/static/chunk.js',
    'public/image.txt',
  ]) {
    const dest = path.join(root, file)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, file)
  }

  prepare(root)

  assert.equal(
    fs.readFileSync(
      path.join(root, DIST, 'standalone', '.next', 'static/chunk.js'),
      'utf8'
    ),
    DIST + '/static/chunk.js'
  )

  assert.equal(
    fs.readFileSync(
      path.join(root, DIST, 'standalone/public/image.txt'),
      'utf8'
    ),
    'public/image.txt'
  )
})

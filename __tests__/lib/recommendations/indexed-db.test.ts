/** @jest-environment node */
it('waits for transaction commit and rejects a late abort', async () => {
  jest.resetModules()
  const request: { result?: unknown; onsuccess?: () => void } = {}
  const transaction: { oncomplete?: () => void; onabort?: () => void; objectStore: () => unknown } = { objectStore: () => ({ put: () => request }) }
  const database = { transaction: () => transaction }
  const opening: { result: unknown; onsuccess?: () => void } = { result: database }
  const old = global.indexedDB
  Object.defineProperty(global, 'indexedDB', { value: { open: () => opening }, configurable: true })
  try {
    const { saveToIndexedDB } = await import('@/lib/recommendations/indexed-db')
    let settled = false
    const promise = saveToIndexedDB({ id: 'synthetic' }); promise.then(() => { settled = true }, () => { settled = true })
    opening.onsuccess!(); await Promise.resolve(); await Promise.resolve()
    request.onsuccess!(); await Promise.resolve()
    expect(settled).toBe(false)
    transaction.onabort!()
    await expect(promise).rejects.toThrow('transaction aborted')
  } finally { Object.defineProperty(global, 'indexedDB', { value: old, configurable: true }) }
})

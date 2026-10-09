'use client'
const DB_NAME = 'recommendation-admin-db'
const STORE_NAME = 'recommendation-data'
const DATA_KEY = 'current-data'
let db: IDBDatabase | null = null
let opening: Promise<IDBDatabase> | null = null

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db
  if (opening) return opening
  opening = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(new Error('Failed to open IndexedDB'))
    request.onblocked = () => reject(new Error('IndexedDB upgrade blocked; close other tabs'))
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
    request.onsuccess = () => {
      db = request.result
      db.onversionchange = () => { db?.close(); db = null }
      db.onclose = () => { db = null }
      resolve(db)
    }
  })
  try { return await opening } finally { opening = null }
}

async function transact<T>(mode: IDBTransactionMode, execute: (store: IDBObjectStore) => IDBRequest, read: (value: unknown) => T): Promise<T> {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], mode)
    let result: unknown
    transaction.onabort = () => reject(new Error('IndexedDB transaction aborted'))
    transaction.onerror = () => reject(new Error('IndexedDB transaction failed'))
    transaction.oncomplete = () => resolve(read(result))
    const request = execute(transaction.objectStore(STORE_NAME))
    request.onsuccess = () => { result = request.result }
    request.onerror = () => reject(new Error('IndexedDB request failed'))
  })
}
export async function saveToIndexedDB(data: unknown): Promise<void> {
  await transact('readwrite', store => store.put({ id: DATA_KEY, data, updatedAt: new Date().toISOString() }), () => undefined)
}
export async function loadFromIndexedDB<T>(): Promise<T | null> {
  return transact('readonly', store => store.get(DATA_KEY), value => value ? (value as { data: T }).data : null)
}
export async function clearIndexedDB(): Promise<void> {
  await transact('readwrite', store => store.delete(DATA_KEY), () => undefined)
}

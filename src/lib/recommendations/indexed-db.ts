"use client"

const DB_NAME = "recommendation-admin-db"
const DB_VERSION = 1
const STORE_NAME = "recommendation-data"
const DATA_KEY = "current-data"

let db: IDBDatabase | null = null

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"))
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    }
  })
}

export async function saveToIndexedDB(data: unknown): Promise<void> {
  const database = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    
    const record = {
      id: DATA_KEY,
      data: data,
      updatedAt: new Date().toISOString(),
    }
    
    const request = store.put(record)
    
    request.onerror = () => {
      reject(new Error("Failed to save to IndexedDB"))
    }
    
    request.onsuccess = () => {
      resolve()
    }
  })
}

export async function loadFromIndexedDB<T>(): Promise<T | null> {
  const database = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)
    
    const request = store.get(DATA_KEY)
    
    request.onerror = () => {
      reject(new Error("Failed to load from IndexedDB"))
    }
    
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.data as T)
      } else {
        resolve(null)
      }
    }
  })
}

export async function clearIndexedDB(): Promise<void> {
  const database = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    
    const request = store.delete(DATA_KEY)
    
    request.onerror = () => {
      reject(new Error("Failed to clear IndexedDB"))
    }
    
    request.onsuccess = () => {
      resolve()
    }
  })
}

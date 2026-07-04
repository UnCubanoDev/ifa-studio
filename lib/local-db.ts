import { openDB, type IDBPDatabase } from 'idb'
import type { Odu, SyncMeta } from './types'

const DB_NAME = 'ifa-studio'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('odus')) {
          const store = db.createObjectStore('odus', { keyPath: 'id' })
          store.createIndex('updatedAt', 'updatedAt')
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta')
        }
      },
    })
  }
  return dbPromise
}

/* ---- Seed desde bundle JSON ---- */

export async function isSeeded(): Promise<boolean> {
  const db = await getDb()
  const count = await db.count('odus')
  return count > 0
}

export async function seedFromBundle(): Promise<number> {
  const already = await isSeeded()
  if (already) return 0

  const res = await fetch('/ifa-studio/data/odus.json')
  if (!res.ok) throw new Error(`Error al cargar bundle: ${res.status}`)

  const odus: Odu[] = await res.json()
  await putManyOdus(odus)

  await setSyncMeta({
    lastSyncedAt: new Date().toISOString(),
    version: 1,
  })

  return odus.length
}

/* ---- Odus ---- */

export async function getAllOdus(): Promise<Odu[]> {
  const db = await getDb()
  return db.getAll('odus')
}

export async function getOdu(id: string): Promise<Odu | undefined> {
  const db = await getDb()
  return db.get('odus', id)
}

export async function putOdu(odu: Odu): Promise<void> {
  const db = await getDb()
  await db.put('odus', odu)
}

export async function putManyOdus(odus: Odu[]): Promise<void> {
  const db = await getDb()
  const tx = db.transaction('odus', 'readwrite')
  await Promise.all([...odus.map(o => tx.store.put(o)), tx.done])
}

export async function getUpdatedSince(since: string): Promise<Odu[]> {
  const db = await getDb()
  const index = db.transaction('odus').store.index('updatedAt')
  const range = IDBKeyRange.lowerBound(since, true)
  return index.getAll(range)
}

/* ---- Sync meta ---- */

export async function getSyncMeta(): Promise<SyncMeta | undefined> {
  const db = await getDb()
  return db.get('meta', 'sync')
}

export async function setSyncMeta(meta: SyncMeta): Promise<void> {
  const db = await getDb()
  await db.put('meta', meta, 'sync')
}

import type { Odu, SyncMeta } from './types'
import { getSyncMeta, setSyncMeta, putManyOdus } from './local-db'

const SYNC_API = '/api/odu'

async function fetchOdus(since?: string): Promise<Odu[]> {
  const params = new URLSearchParams()
  if (since) params.set('since', since)

  const url = params.toString() ? `${SYNC_API}?${params}` : SYNC_API
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Error de sync: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return data.odus as Odu[]
}

export async function sync(): Promise<{ synced: number; ok: boolean }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { synced: 0, ok: false }
  }

  try {
    const meta: SyncMeta | undefined = await getSyncMeta()
    const changes = await fetchOdus(meta?.lastSyncedAt ?? undefined)

    if (changes.length > 0) {
      await putManyOdus(changes)
    }

    const latestTimestamp = changes.reduce(
        (latest, odu) => (odu.updatedAt > latest ? odu.updatedAt : latest),
        meta?.lastSyncedAt ?? new Date(0).toISOString(),
    )

    await setSyncMeta({
      lastSyncedAt: latestTimestamp,
      version: (meta?.version ?? 0) + 1,
    })

    return { synced: changes.length, ok: true }
  } catch (err) {
    console.error('Fallo en sync:', err)
    return { synced: 0, ok: false }
  }
}

import type { Odu, SyncMeta } from './types'
import { getSyncMeta, setSyncMeta, getAllOdus, putManyOdus, clearAll, isSeeded } from './local-db'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function computeSignature(odus: Odu[]): string {
  let hash = 0
  const ids = odus.map(o => o.id).sort().join(',')
  for (let i = 0; i < ids.length; i++) {
    hash = ((hash << 5) - hash) + ids.charCodeAt(i)
    hash |= 0
  }
  return `${odus.length}:${hash}`
}

export async function sync(): Promise<{ synced: number; ok: boolean }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { synced: 0, ok: false }
  }

  try {
    const res = await fetch(`${BASE}/data/odus.json?t=${Date.now()}`, {
      cache: 'no-cache',
    })
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`)

    const remote: Odu[] = await res.json()
    const remoteSig = computeSignature(remote)

    const meta: SyncMeta | undefined = await getSyncMeta()

    if (meta?.signature === remoteSig) {
      return { synced: 0, ok: true }
    }

    const localOdus = await getAllOdus()
    const localSig = localOdus.length > 0 ? computeSignature(localOdus) : null

    if (localSig === remoteSig) {
      await setSyncMeta({
        lastSyncedAt: new Date().toISOString(),
        signature: remoteSig,
        version: (meta?.version ?? 0) + 1,
      })
      return { synced: 0, ok: true }
    }

    await clearAll()
    await putManyOdus(remote)

    await setSyncMeta({
      lastSyncedAt: new Date().toISOString(),
      signature: remoteSig,
      version: (meta?.version ?? 0) + 1,
    })

    return { synced: remote.length, ok: true }
  } catch (err) {
    console.error('Fallo en sync:', err)
    return { synced: 0, ok: false }
  }
}

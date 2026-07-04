'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAllOdus, isSeeded, seedFromBundle } from '@/lib/local-db'
import type { Odu } from '@/lib/types'

interface UseSyncReturn {
  odus: Odu[]
  loading: boolean
  syncing: boolean
  error: string | null
}

export function useSync(): UseSyncReturn {
  const [odus, setOdus] = useState<Odu[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadLocal = useCallback(async () => {
    try {
      const hasData = await isSeeded()
      if (!hasData) {
        setSyncing(true)
        await seedFromBundle()
        setSyncing(false)
      }
      const local = await getAllOdus()
      setOdus(local)
    } catch (err) {
      console.error('Error cargando datos locales:', err)
      setError('No se pudieron cargar los datos')
    }
  }, [])

  useEffect(() => {
    loadLocal().finally(() => setLoading(false))
  }, [loadLocal])

  return { odus, loading, syncing, error }
}

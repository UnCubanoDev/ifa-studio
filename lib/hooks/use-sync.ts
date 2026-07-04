'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getAllOdus, isSeeded, seedFromBundle } from '@/lib/local-db'
import { sync } from '@/lib/sync'
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
  const mounted = useRef(true)

  const loadLocal = useCallback(async () => {
    try {
      const hasData = await isSeeded()
      if (!hasData) {
        setSyncing(true)
        await seedFromBundle()
        setSyncing(false)
      }
      const local = await getAllOdus()
      if (mounted.current) setOdus(local)
    } catch (err) {
      console.error('Error cargando datos locales:', err)
      if (mounted.current) setError('No se pudieron cargar los datos')
    }
  }, [])

  const checkForUpdates = useCallback(async () => {
    if (!navigator.onLine) return
    setSyncing(true)
    const result = await sync()
    if (result.synced > 0) {
      const local = await getAllOdus()
      if (mounted.current) setOdus(local)
    }
    setSyncing(false)
  }, [])

  useEffect(() => {
    loadLocal().finally(() => {
      if (mounted.current) setLoading(false)
    })
  }, [loadLocal])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => checkForUpdates()
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [checkForUpdates])

  useEffect(() => {
    return () => { mounted.current = false }
  }, [])

  return { odus, loading, syncing, error }
}

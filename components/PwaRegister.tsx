'use client'

import { useEffect, useState } from 'react'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    if (isStandalone()) return

    if (isIOS()) {
      setShowIOSHint(true)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      ;(e as any).prompt()
    }
    window.addEventListener('beforeinstallprompt', handler)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ifa-studio/sw.js').catch(() => {})
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (showIOSHint && !deferredPrompt && !isStandalone()) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-stone-700 shadow-lg ring-1 ring-stone-200/80 max-w-sm mx-auto">
        <span className="material-symbols-outlined text-amber-600 text-xl">install_mobile</span>
        <p className="flex-1 leading-tight">
          Instala esta app — toca <strong>Compartir</strong> <span className="text-lg">↑</span> y luego <strong>Agregar a Inicio</strong>.
        </p>
        <button
          onClick={() => setShowIOSHint(false)}
          className="shrink-0 text-stone-400 hover:text-stone-600"
          aria-label="Cerrar"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    )
  }

  return null
}

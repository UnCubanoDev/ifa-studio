'use client'

import { useEffect, useState, useRef } from 'react'

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export default function PwaRegister() {
  const [standalone, setStandalone] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const swRegistered = useRef(false)
  const ios = useRef(false)

  useEffect(() => {
    ios.current = isIOS()

    function check() {
      setStandalone(
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      )
    }

    check()

    const mql = window.matchMedia('(display-mode: standalone)')
    mql.addEventListener('change', check)

    const handler = (e: Event) => {
      e.preventDefault()
      ;(e as any).prompt()
    }
    window.addEventListener('beforeinstallprompt', handler)

    if (!swRegistered.current && 'serviceWorker' in navigator) {
      swRegistered.current = true
      navigator.serviceWorker.register('/ifa-studio/sw.js').catch(() => {})
    }

    return () => {
      mql.removeEventListener('change', check)
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  if (standalone || dismissed || !ios.current) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-stone-700 shadow-lg ring-1 ring-stone-200/80 max-w-sm mx-auto">
      <span className="material-symbols-outlined text-amber-600 text-xl">install_mobile</span>
      <p className="flex-1 leading-tight">
        Instala esta app — toca <strong>Compartir</strong> <span className="text-lg">↑</span> y luego <strong>Agregar a Inicio</strong>.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-stone-400 hover:text-stone-600"
        aria-label="Cerrar"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  )
}

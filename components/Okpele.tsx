'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Bit = 0 | 1
type Side = 'left' | 'right'

function Seed({ value, onClick }: { value: Bit; onClick: () => void }) {
  const isOpen = value === 1

  return (
    <button
      onClick={onClick}
      className="relative w-14 h-18 focus:outline-none transition-transform duration-150 active:scale-90"
    >
      <svg viewBox="0 0 56 72" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="seed-open" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="seed-closed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="50%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <radialGradient id="inner-glow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Main seed body */}
        <path
          d={
            isOpen
              ? "M28 8 C18 8 8 18 8 30 C8 44 16 58 28 64 C40 58 48 44 48 30 C48 18 38 8 28 8Z"
              : "M28 4 C16 4 4 16 4 30 C4 46 14 62 28 68 C42 62 52 46 52 30 C52 16 40 4 28 4Z"
          }
          fill={isOpen ? "url(#seed-open)" : "url(#seed-closed)"}
          stroke={isOpen ? "#d97706" : "#451a03"}
          strokeWidth="1"
          className="transition-all duration-500"
        />

        {/* Open state: inner cavity */}
        {isOpen && (
          <>
            <path
              d="M28 18 C20 18 14 26 14 36 C14 46 20 54 28 58 C36 54 42 46 42 36 C42 26 36 18 28 18Z"
              fill="rgba(0,0,0,0.12)"
            />
            <ellipse cx="28" cy="36" rx="8" ry="12" fill="url(#inner-glow)" />
            <ellipse cx="28" cy="34" rx="3" ry="4" fill="rgba(255,255,255,0.3)" />
          </>
        )}

        {/* Closed state: center seam */}
        {!isOpen && (
          <path
            d="M28 8 C28 8 28 36 28 64"
            stroke="#92400e"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
        )}
      </svg>
    </button>
  )
}

export default function Okpele() {
  const router = useRouter()
  const [left, setLeft] = useState<Bit[]>([0, 0, 0, 0])
  const [right, setRight] = useState<Bit[]>([0, 0, 0, 0])

  const toggle = useCallback((side: Side, idx: number) => {
    const setter = side === 'left' ? setLeft : setRight
    setter(prev => {
      const next = [...prev] as Bit[]
      next[idx] = next[idx] === 0 ? 1 : 0
      return next
    })
  }, [])

  const navigateToOdu = useCallback(() => {
    const l = left.join('')
    const r = right.join('')
    router.push(`/odu?l=${l}&r=${r}`)
  }, [left, right, router])

  return (
    <div className="flex flex-col items-center px-6 py-10 gap-10 min-h-dvh bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header */}
      <header className="text-center space-y-2">
        <div className="text-3xl text-amber-700/60 mb-1">ꔤ</div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-800">
          Ọ̀pẹ̀lẹ̀ Ifá
        </h1>
        <p className="text-xs text-stone-400 tracking-[0.2em] uppercase font-medium">
          Cadena de Adivinación
        </p>
      </header>

      {/* Okpele Chain */}
      <div className="flex items-start gap-1.5">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          {left.map((val, i) => (
            <Seed key={`l-${i}`} value={val} onClick={() => toggle('left', i)} />
          ))}
        </div>

        {/* Chain connectors */}
        <div className="flex flex-col gap-3 pt-4"/>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          {right.map((val, i) => (
            <Seed key={`r-${i}`} value={val} onClick={() => toggle('right', i)} />
          ))}
        </div>
      </div>

      {/* Cast Button */}
      <button
        onClick={navigateToOdu}
        className="w-full max-w-[240px] py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all duration-200 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-amber-50 shadow-md active:shadow-sm active:scale-[0.98]"
      >
        Ifareo
      </button>

      {/* Instruction */}
      <p className="text-[11px] text-stone-400 text-center leading-relaxed max-w-[240px]">
        Toca cada semilla para cambiar su estado.
        <br />
        La combinación de ambos lados forma un signo.
      </p>
    </div>
  )
}

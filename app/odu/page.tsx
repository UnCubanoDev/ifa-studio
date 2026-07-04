'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useMemo } from 'react'
import { useSync } from '@/lib/hooks/use-sync'
import type { Odu } from '@/lib/types'
import Markdown from '@/components/Markdown'

type Tab = 'nace' | 'refranes' | 'descripcion' | 'pataki'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'nace', label: 'Nace', icon: 'auto_awesome' },
  { key: 'refranes', label: 'Refranes', icon: 'format_quote' },
  { key: 'descripcion', label: 'Descripción', icon: 'description' },
  { key: 'pataki', label: 'Pataki', icon: 'menu_book' },
]

const FIELD_MAP: Record<Tab, keyof Odu> = {
  nace: 'contentNace',
  refranes: 'contentRefranes',
  descripcion: 'contentDescripcion',
  pataki: 'contentPataki',
}

const FALLBACK_TEXT: Record<Tab, string> = {
  nace: 'De la combinación de los signos nace la sabiduría de Ifá. Este Odu revela los caminos y destinos que se entrelazan en la existencia.',
  refranes: 'Quien consulta a Ifá no camina a ciegas. El proverbio es el caballo que lleva la verdad hasta el corazón del hombre.',
  descripcion: 'Este signo representa el equilibrio entre las fuerzas opuestas del universo. Su influencia se manifiesta en los momentos de transición y decisión.',
  pataki: 'En el principio, Olodumare creó los caminos. Cada Odu guarda la historia de ese momento sagrado cuando el destino fue escrito en el polvo de la tierra.',
}

function getOduName(left: string, right: string): string {
  const ODU_NAMES: Record<string, string> = {
    '0000': 'Ogbe', '0001': 'Ogunda', '0010': 'Irete', '0011': 'Irosun',
    '0100': 'Otura', '0101': 'Oshe', '0110': 'Odi', '0111': 'Obara',
    '1000': 'Osa', '1001': 'Iwori', '1010': 'Ofun', '1011': 'Ika',
    '1100': 'Ojuani', '1101': 'Otrupon', '1110': 'Okana', '1111': 'Oyeku',
  }
  const ln = ODU_NAMES[left]
  const rn = ODU_NAMES[right]
  if (!ln || !rn) return 'Odu Inválido'
  return ln === rn ? `${ln} Meyi` : `${ln} ${rn}`
}

function OduContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { odus, loading, syncing } = useSync()

  const [activeTab, setActiveTab] = useState<Tab>('nace')

  const left = searchParams.get('l') || '0000'
  const right = searchParams.get('r') || '0000'
  const oduId = `${left}${right}`
  const oduName = getOduName(left, right)
  const oduSub = `${left.slice(0, 2)} ${left.slice(2)}  ·  ${right.slice(0, 2)} ${right.slice(2)}`

  const oduData: Odu | undefined = useMemo(
      () => odus.find(o => o.id === oduId),
      [odus, oduId],
  )

  function getContent(tab: Tab): string {
    const field = FIELD_MAP[tab]
    const raw = oduData?.[field]
    if (raw) return raw
    return FALLBACK_TEXT[tab]
  }

  return (
      <div className="flex flex-col h-dvh bg-surface">

        {/* HEADER */}
        <header className="shrink-0 bg-surface/90 backdrop-blur-md pt-[env(safe-area-inset-top)] border-b border-outline-variant/40">
          <div className="flex items-center justify-between px-gutter pt-3 pb-2">
            <button
                onClick={() => router.back()}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface-variant active:scale-95 transition-transform shadow-sm"
                aria-label="Volver"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>

            <div className="flex-1 text-center">
              <h1 className="font-headline-md text-headline-md text-primary tracking-tight leading-tight">
                {oduName}
              </h1>
            </div>

            <div className="w-11" />
          </div>

          <div className="flex gap-3 px-gutter pb-4">
            <button className="flex-1 h-11 rounded-xl bg-secondary-container/60 border border-secondary-fixed-dim/50 text-on-secondary-container font-label-md text-label-md active:scale-95 transition-transform flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              Ebo
            </button>
            <button className="flex-1 h-11 rounded-xl bg-secondary-container/60 border border-secondary-fixed-dim/50 text-on-secondary-container font-label-md text-label-md active:scale-95 transition-transform flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
              Versos
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-lg px-container-margin py-stack-lg">

            {/* CONTENT CARD */}
            {loading ? (
                <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-stack-lg spiritual-glow flex items-center justify-center h-40">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
                    <p className="font-body-md text-body-md text-outline">Cargando datos locales...</p>
                  </div>
                </div>
            ) : (
                TABS.map((tab) => {
                  const isActive = activeTab === tab.key
                  if (!isActive) return null
                  const content = getContent(tab.key)
                  return (
                      <div key={tab.key} className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-stack-lg spiritual-glow">
                        <div className="flex items-center gap-stack-sm mb-stack-md">
                          <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {tab.icon}
                        </span>
                          </div>
                          <div>
                            <h2 className="font-headline-md text-headline-md text-primary">{tab.label}</h2>
                          </div>
                        </div>

                        <div className="cultural-divider w-full mb-stack-md" />

                        <Markdown content={content} />
                      </div>
                  )
                })
            )}

          </div>
        </main>

        {/* BOTTOM NAV */}
        <nav className="shrink-0 bg-surface-container border-t border-outline-variant/40 pt-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-all active:scale-95 ${
                    isActive ? 'text-primary' : 'text-outline'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {tab.icon}
                  </span>
                  <span className="font-label-sm text-label-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
  )
}

export default function OduPage() {
  return (
      <Suspense
          fallback={
            <div className="flex h-dvh items-center justify-center bg-surface">
              <div className="flex flex-col items-center gap-stack-md">
                <div className="relative">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
                </div>
                <p className="font-body-md text-body-md text-outline">Cargando tratado...</p>
              </div>
            </div>
          }
      >
        <OduContent />
      </Suspense>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { Headphones, X } from 'lucide-react'
import { usePlayer } from '@/components/player/player-provider'

export function OnDemandPanel() {
  const { onDemand, closeOnDemand } = usePlayer()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (onDemand) closeRef.current?.focus()
  }, [onDemand])

  if (!onDemand) return null

  return (
    <section
      aria-label={`Listen again: ${onDemand.title}`}
      className="fixed inset-x-0 bottom-[5.5rem] z-50 flex h-[min(70vh,36rem)] flex-col overflow-hidden border-t-4 border-primary bg-background shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-28 sm:w-[28rem] sm:rounded-2xl sm:border-4"
    >
      <div className="on-dark flex items-center gap-3 bg-foreground px-4 py-3 text-background">
        <Headphones className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wide text-primary">Listen again</span>
          <span className="block truncate font-semibold">{onDemand.title}</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={closeOnDemand}
          aria-label="Close and stop listen again"
          className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-background/15 focus-visible:outline-primary"
        >
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>
      <iframe
        key={onDemand.url}
        src={onDemand.url}
        title={`${onDemand.title} on demand player`}
        allow="autoplay; encrypted-media"
        className="w-full flex-1 border-0 bg-white"
      />
    </section>
  )
}

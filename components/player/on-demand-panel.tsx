'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Headphones, X } from 'lucide-react'
import { usePlayer } from '@/components/player/player-provider'
import { cn } from '@/lib/utils'

const MOBILE_QUERY = '(max-width: 639px)'

export function OnDemandPanel() {
  const { onDemand, closeOnDemand } = usePlayer()
  const [minimised, setMinimised] = useState(false)
  const minimiseRef = useRef<HTMLButtonElement>(null)
  const expandRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMinimised(false), [onDemand])

  useEffect(() => {
    if (!onDemand) return
    if (minimised) expandRef.current?.focus()
    else minimiseRef.current?.focus()
  }, [onDemand, minimised])

  // Fullscreen on phones: stop the page scrolling underneath and let Escape minimise
  useEffect(() => {
    if (!onDemand || minimised || !window.matchMedia(MOBILE_QUERY).matches) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMinimised(true)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onDemand, minimised])

  if (!onDemand) return null

  const iconButton =
    'flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-background/15 focus-visible:outline-primary'

  return (
    <section
      aria-label={`Listen again: ${onDemand.title}`}
      className={cn(
        'on-dark fixed z-[60] flex flex-col overflow-hidden bg-foreground text-background shadow-2xl',
        minimised
          ? 'inset-x-4 bottom-[6.5rem] rounded-2xl border-4 border-primary sm:inset-x-auto sm:right-6 sm:bottom-28 sm:w-[28rem]'
          : 'inset-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:inset-auto sm:right-6 sm:bottom-28 sm:h-[min(70vh,36rem)] sm:w-[28rem] sm:rounded-2xl sm:border-4 sm:border-primary sm:p-0',
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Headphones className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wide text-primary">Listen again</span>
          <span className="block truncate font-semibold">{onDemand.title}</span>
        </p>
        {minimised ? (
          <button
            ref={expandRef}
            type="button"
            onClick={() => setMinimised(false)}
            aria-label="Show listen again player"
            className={iconButton}
          >
            <ChevronUp className="size-6" aria-hidden="true" />
          </button>
        ) : (
          <button
            ref={minimiseRef}
            type="button"
            onClick={() => setMinimised(true)}
            aria-label="Minimise listen again player"
            className={iconButton}
          >
            <ChevronDown className="size-6" aria-hidden="true" />
          </button>
        )}
        <button type="button" onClick={closeOnDemand} aria-label="Close and stop listen again" className={iconButton}>
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>
      {/* Collapsed rather than unmounted when minimised, so playback carries on */}
      <div className={cn('flex px-4 pb-4 sm:px-3 sm:pb-3', minimised ? 'invisible h-0 p-0 sm:p-0' : 'flex-1')}>
        <iframe
          key={onDemand.url}
          src={onDemand.url}
          title={`${onDemand.title} on demand player`}
          allow="autoplay; encrypted-media"
          className="w-full flex-1 rounded-xl border-0 bg-white"
        />
      </div>
    </section>
  )
}

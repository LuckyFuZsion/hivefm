'use client'

import { ArrowDown, Radio } from 'lucide-react'
import { usePlayer } from '@/components/player/player-provider'
import { STREAM } from '@/lib/site'
import { cn } from '@/lib/utils'

/** Height of Aiir's small_embed play bar */
const EMBED_HEIGHT = 72

export function PlayerBar() {
  const { liveKey, liveFrameRef, livePrompt, promptLive, onDemand } = usePlayer()
  // While Listen Again is open the live player isn't on the page at all, so the two can never overlap.
  // Switching back closes Listen Again (which stops it) before the live player returns.
  const shielded = onDemand !== null

  return (
    <section
      aria-label="Hive FM live player"
      className="on-dark fixed inset-x-0 bottom-0 z-50 border-t-4 border-primary bg-foreground pb-[env(safe-area-inset-bottom)] text-background"
    >
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 mb-3 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-2 font-heading font-semibold whitespace-nowrap text-primary-foreground shadow-lg transition-opacity',
          livePrompt ? 'opacity-100' : 'opacity-0',
        )}
      >
        {livePrompt && (
          <>
            <ArrowDown className="size-5 animate-bounce" aria-hidden="true" />
            Press play below to start
          </>
        )}
      </p>
      <div
        className={cn(
          'relative mx-auto max-w-7xl transition-shadow',
          livePrompt && 'ring-4 ring-primary ring-inset motion-safe:animate-pulse',
        )}
      >
        {shielded ? (
          <button
            type="button"
            onClick={promptLive}
            className="flex w-full items-center justify-center gap-3 px-4 text-center font-heading font-semibold text-background hover:text-primary focus-visible:outline-primary"
            style={{ height: EMBED_HEIGHT }}
          >
            <Radio className="size-6 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Listen Again is playing.{' '}
              <span className="underline underline-offset-4">Stop it and switch to live radio</span>
            </span>
          </button>
        ) : (
          // No "autoplay" permission: Aiir's player starts itself on load whenever the browser allows it
          <iframe
            key={liveKey}
            ref={liveFrameRef}
            src={STREAM.embedPlayer}
            title="Hive FM live player"
            allow="encrypted-media"
            scrolling="no"
            height={EMBED_HEIGHT}
            className="block w-full border-0"
            style={{ height: EMBED_HEIGHT }}
          />
        )}
      </div>
    </section>
  )
}

'use client'

import { RefreshCw } from 'lucide-react'
import { useNowPlaying } from '@/components/now-playing/now-playing-provider'
import { SafeImage } from '@/components/shared/safe-image'
import { linkButton } from '@/lib/ui'
import { cn } from '@/lib/utils'

export function RecentlyPlayed() {
  const { data, refresh, refreshing, canRefresh } = useNowPlaying()
  const tracks = data?.previouslyPlayed?.slice(0, 5) ?? []

  return (
    <section aria-labelledby="recent-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="recent-heading" className="text-2xl font-bold sm:text-3xl">
          Recently Played
        </h2>
        <button
          type="button"
          onClick={refresh}
          disabled={!canRefresh}
          aria-label={refreshing ? 'Updating recently played' : 'Update recently played'}
          className={linkButton('outline', 'disabled:cursor-not-allowed disabled:opacity-60')}
        >
          <RefreshCw className={cn('size-5', refreshing && 'animate-spin')} aria-hidden="true" />
          {refreshing ? 'Updating…' : 'Update'}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {refreshing ? 'Updating recently played' : ''}
      </p>
      {tracks.length === 0 ? (
        <p className="mt-4 text-muted-foreground">Tracks will appear here as they are played.</p>
      ) : (
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tracks.map((track) => (
            <li
              key={track.eventId}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3 lg:flex-col lg:items-start"
            >
              <SafeImage
                src={track.imageUrl}
                alt=""
                className="size-16 shrink-0 rounded-xl bg-muted object-cover lg:size-full lg:aspect-square"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold">{track.title}</p>
                <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

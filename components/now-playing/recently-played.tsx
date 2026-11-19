'use client'

import { useNowPlaying } from '@/components/now-playing/now-playing-provider'
import { SafeImage } from '@/components/shared/safe-image'
import { SITE } from '@/lib/site'

export function RecentlyPlayed() {
  const data = useNowPlaying()
  const tracks = data?.previouslyPlayed.slice(0, 5) ?? []
  if (tracks.length === 0) return null

  return (
    <section aria-labelledby="recent-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 id="recent-heading" className="text-2xl font-bold sm:text-3xl">
        Recently Played
      </h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tracks.map((track) => (
          <li
            key={`${track.startedAt}-${track.title}`}
            className="flex items-center gap-3 rounded-2xl border bg-card p-3 lg:flex-col lg:items-start"
          >
            <SafeImage
              src={track.artwork || SITE.badge}
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
    </section>
  )
}

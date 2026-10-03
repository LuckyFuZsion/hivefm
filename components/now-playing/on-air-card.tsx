'use client'

import { Radio } from 'lucide-react'
import { useNowPlaying } from '@/components/now-playing/now-playing-provider'
import { ShowProgress } from '@/components/now-playing/show-progress'
import { SafeImage } from '@/components/shared/safe-image'
import { formatShowRange } from '@/lib/time'

export function OnAirCard() {
  const { data } = useNowPlaying()
  const programme = data?.nowProgramme
  const track = data?.nowPlaying

  return (
    <article
      aria-labelledby="on-air-heading"
      className="rounded-3xl bg-card p-5 text-card-foreground shadow-xl sm:p-6"
    >
      <h2
        id="on-air-heading"
        className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
      >
        <Radio className="size-5" aria-hidden="true" />
        On Air Now
      </h2>

      {programme ? (
        <div className="flex gap-4">
          <div className="hex size-24 shrink-0 bg-primary p-1 sm:size-28">
            <SafeImage
              src={programme.imageUrl}
              alt={`${programme.name} show artwork`}
              className="hex size-full bg-card object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold leading-tight text-balance sm:text-2xl">
              {programme.name}
            </p>
            <p className="mt-1 text-base font-medium text-muted-foreground">
              {formatShowRange(programme.start, programme.end)}
            </p>
            {track && (
              <p className="mt-2 text-sm">
                <span className="font-semibold">Now playing:</span> {track.title} – {track.artist}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-base text-muted-foreground">Loading what is on air…</p>
      )}

      {programme && (
        <div className="mt-5">
          <ShowProgress start={programme.start} end={programme.end} />
        </div>
      )}
    </article>
  )
}

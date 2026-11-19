'use client'

import { Radio } from 'lucide-react'
import { useNowPlaying } from '@/components/now-playing/now-playing-provider'
import { ShowProgress } from '@/components/now-playing/show-progress'
import { SafeImage } from '@/components/shared/safe-image'
import { STALE_AFTER_MS } from '@/lib/now-playing'
import { findCurrentSlot, type ScheduleSlot } from '@/lib/schedule'
import { formatSlotRange, londonNow } from '@/lib/time'
import { useNow } from '@/lib/use-now'

export function OnAirCard({ slots }: { slots: ScheduleSlot[] }) {
  const now = useNow(60_000)
  const t = now ? londonNow(now) : null
  const programme = t ? findCurrentSlot(slots, t.dayIndex, t.minutes) : undefined
  const track = useNowPlaying()?.nowPlaying
  const showTrack =
    !!track && !!now && now.getTime() - new Date(track.startedAt).getTime() < STALE_AFTER_MS

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
              src={programme.image}
              alt={`${programme.showName} show artwork`}
              className="hex size-full bg-card object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold leading-tight text-balance sm:text-2xl">
              {programme.showName}
            </p>
            <p className="mt-1 text-base font-medium text-muted-foreground">
              {formatSlotRange(programme.start, programme.end)}
            </p>
            {showTrack && track && (
              <p className="mt-2 text-sm">
                <span className="font-semibold">Now playing:</span> {track.title}
                {track.artist ? ` – ${track.artist}` : ''}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-base text-muted-foreground">
          {t ? 'Hive FM, 97.2 FM. Bringing Grantham together.' : 'Loading what is on air…'}
        </p>
      )}

      {programme && (
        <div className="mt-5">
          <ShowProgress start={programme.start} end={programme.end} />
        </div>
      )}
    </article>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Loader2, Music2, Play, Square, Volume2, VolumeX } from 'lucide-react'
import { useNowPlaying } from '@/components/now-playing/now-playing-provider'
import { usePlayer } from '@/components/player/player-provider'
import { useMediaSession } from '@/components/player/use-media-session'
import { SafeImage } from '@/components/shared/safe-image'
import { SITE } from '@/lib/site'
import { formatShowRange } from '@/lib/time'

const STATUS_TEXT = {
  idle: 'Stopped',
  loading: 'Connecting to Hive FM',
  playing: 'Playing live',
  error: 'Sorry, the stream could not start. Please try again.',
} as const

export function PlayerBar() {
  const { data } = useNowPlaying()
  const { status, volume, muted, toggle, setVolume, toggleMute } = usePlayer()
  useMediaSession()

  // If "connecting" drags on, treat it like a failure and offer the Aiir player.
  const [stalled, setStalled] = useState(false)
  useEffect(() => {
    if (status !== 'loading') {
      setStalled(false)
      return
    }
    const t = setTimeout(() => setStalled(true), 10_000)
    return () => clearTimeout(t)
  }, [status])
  const showFallback = status === 'error' || stalled

  const programme = data?.nowProgramme
  const track = data?.nowPlaying
  const isActive = status === 'playing' || status === 'loading'
  const showTime = programme ? formatShowRange(programme.start, programme.end) : ''
  const label = isActive ? 'Stop Hive FM live stream' : 'Play Hive FM live stream'

  return (
    <section
      aria-label="Hive FM live player"
      className="on-dark fixed inset-x-0 bottom-0 z-50 border-t-4 border-primary bg-foreground text-background"
    >
      <p className="sr-only" role="status" aria-live="polite">
        {STATUS_TEXT[status]}
        {showFallback && status !== 'error' && " This is taking longer than usual. You can listen on the main Hive FM player instead."}
        {showFallback && status === 'error' && ' You can listen on the main Hive FM player instead.'}
      </p>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:gap-5 sm:px-6">
        <button
          type="button"
          onClick={toggle}
          aria-label={label}
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 focus-visible:outline-primary"
        >
          {status === 'loading' ? (
            <Loader2 className="size-7 animate-spin" aria-hidden="true" />
          ) : isActive ? (
            <Square className="size-6 fill-current" aria-hidden="true" />
          ) : (
            <Play className="size-7 fill-current" aria-hidden="true" />
          )}
        </button>

        <div className="hex size-14 shrink-0 bg-primary p-0.5 sm:size-16">
          <div className="hex size-full bg-foreground">
            {track?.imageUrl || programme?.imageUrl ? (
              <SafeImage
                src={track?.imageUrl || programme?.imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <Music2 className="m-auto size-full p-4 text-primary" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <span
              className={`inline-block size-2 rounded-full ${status === 'error' ? 'bg-destructive' : 'bg-primary'}`}
              aria-hidden="true"
            />
            {status === 'error' ? 'Stream problem' : isActive ? 'Live now' : '97.2 FM'}
          </p>
          <p className="truncate text-sm font-semibold sm:text-base">
            {programme?.name ?? 'Hive FM – Bringing Grantham Together'}
            {showTime && <span className="font-normal opacity-80"> · {showTime}</span>}
          </p>
          {track ? (
            <p className="flex items-center gap-2 truncate text-sm opacity-90">
              <span className="truncate">
                {track.title} – {track.artist}
              </span>
              {track.appleMusicUrl && (
                <a
                  href={track.appleMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full border border-background/60 px-2 py-0.5 text-xs font-semibold hover:bg-background hover:text-foreground"
                  aria-label={`Open ${track.title} by ${track.artist} on Apple Music (opens in a new tab)`}
                >
                  Apple Music
                </a>
              )}
            </p>
          ) : (
            <p className="truncate text-sm opacity-90">
              {status === 'error' ? STATUS_TEXT.error : 'Community radio from the BHive, Grantham'}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {showFallback && (
            <a
              href={SITE.aiirPlayer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-background px-4 text-sm font-semibold hover:bg-background hover:text-foreground focus-visible:outline-primary"
            >
              <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
              <span>
                Can&apos;t play here?<span className="hidden sm:inline"> Listen on Hive FM&apos;s main player</span>
                <span className="sr-only sm:hidden"> Listen on Hive FM&apos;s main player</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          )}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            aria-pressed={muted}
            className="flex size-12 items-center justify-center rounded-full hover:bg-background/15 focus-visible:outline-primary"
          >
            {muted || volume === 0 ? (
              <VolumeX className="size-6" aria-hidden="true" />
            ) : (
              <Volume2 className="size-6" aria-hidden="true" />
            )}
          </button>
          <label className="hidden items-center sm:flex">
            <span className="sr-only">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)} per cent`}
              className="volume-range w-28 lg:w-36"
            />
          </label>
        </div>
      </div>
    </section>
  )
}

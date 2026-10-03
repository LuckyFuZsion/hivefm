'use client'

import { useEffect } from 'react'
import { useNowPlaying } from '@/components/now-playing/now-playing-provider'
import { usePlayer } from '@/components/player/player-provider'
import { SITE } from '@/lib/site'

function absolute(url: string | undefined): string {
  const value = url || SITE.logo
  if (typeof window === 'undefined') return value
  return new URL(value, window.location.origin).toString()
}

/** Shows the current show and track on lock screens and media keys. */
export function useMediaSession() {
  const { data } = useNowPlaying()
  const { status, play, stop } = usePlayer()
  const active = status === 'playing' || status === 'loading'

  const showName = data?.nowProgramme?.name ?? SITE.name
  const track = data?.nowPlaying
  const artwork = absolute(track?.imageUrl || data?.nowProgramme?.imageUrl)
  const title = track?.title ?? showName
  const artist = track?.artist ?? SITE.name

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: `${SITE.name} – ${showName}`,
      artwork: [{ src: artwork, sizes: '512x512' }],
    })
  }, [title, artist, showName, artwork])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    const session = navigator.mediaSession
    session.playbackState = active ? 'playing' : 'none'
    session.setActionHandler('play', () => play())
    session.setActionHandler('pause', () => stop())
    session.setActionHandler('stop', () => stop())
    return () => {
      session.setActionHandler('play', null)
      session.setActionHandler('pause', null)
      session.setActionHandler('stop', null)
    }
  }, [active, play, stop])
}

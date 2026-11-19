'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { NOW_PLAYING_URL, type NowPlayingData } from '@/lib/now-playing'

const POLL_MS = 30_000

const NowPlayingContext = createContext<NowPlayingData | null>(null)

function isNowPlayingData(value: unknown): value is NowPlayingData {
  return !!value && typeof value === 'object' && 'nowPlaying' in value && 'previouslyPlayed' in value
}

/** Polls the Hive FM now-playing Worker, pausing while the tab is hidden. */
export function NowPlayingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<NowPlayingData | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let controller: AbortController | undefined

    async function load() {
      controller = new AbortController()
      try {
        const res = await fetch(NOW_PLAYING_URL, { signal: controller.signal })
        if (res.ok) {
          const json: unknown = await res.json()
          if (!cancelled && isNowPlayingData(json)) setData(json)
        }
      } catch {
        // Keep showing the last known data
      }
      schedule()
    }

    function schedule() {
      if (!cancelled) timer = setTimeout(load, POLL_MS)
    }

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer)
        void load()
      } else {
        clearTimeout(timer)
        controller?.abort()
      }
    }

    void load()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      clearTimeout(timer)
      controller?.abort()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <NowPlayingContext.Provider value={data}>{children}</NowPlayingContext.Provider>
}

export function useNowPlaying(): NowPlayingData | null {
  return useContext(NowPlayingContext)
}

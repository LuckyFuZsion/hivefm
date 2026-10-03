'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AiirNowPlayingClient, type NowPlayingMessage, type SocketStatus } from '@/lib/aiir'
import { createMockNowPlaying } from '@/lib/aiir-mock'

export type NowPlayingSource = 'connecting' | 'live' | 'mock'

interface NowPlayingValue {
  data: NowPlayingMessage | null
  source: NowPlayingSource
  socketStatus: SocketStatus
}

const NowPlayingContext = createContext<NowPlayingValue>({
  data: null,
  source: 'connecting',
  socketStatus: 'connecting',
})

const FALLBACK_AFTER_MS = 6000

export function NowPlayingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<NowPlayingMessage | null>(null)
  const [source, setSource] = useState<NowPlayingSource>('connecting')
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('connecting')

  useEffect(() => {
    let received = false
    const client = new AiirNowPlayingClient({
      onMessage: (message) => {
        received = true
        setData(message)
        setSource('live')
      },
      onStatus: setSocketStatus,
    })
    client.connect()

    const fallback = setTimeout(() => {
      if (!received) {
        setData(createMockNowPlaying())
        setSource('mock')
      }
    }, FALLBACK_AFTER_MS)

    return () => {
      clearTimeout(fallback)
      client.close()
    }
  }, [])

  // Keep mock show times fresh while no live data has arrived
  useEffect(() => {
    if (source !== 'mock') return
    const id = setInterval(() => setData(createMockNowPlaying()), 60_000)
    return () => clearInterval(id)
  }, [source])

  const value = useMemo(() => ({ data, source, socketStatus }), [data, source, socketStatus])
  return <NowPlayingContext.Provider value={value}>{children}</NowPlayingContext.Provider>
}

export function useNowPlaying(): NowPlayingValue {
  return useContext(NowPlayingContext)
}

'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AiirNowPlayingClient, type NowPlayingMessage, type SocketStatus } from '@/lib/aiir'
import { createMockNowPlaying } from '@/lib/aiir-mock'

export type NowPlayingSource = 'connecting' | 'live' | 'mock'

interface NowPlayingValue {
  data: NowPlayingMessage | null
  source: NowPlayingSource
  socketStatus: SocketStatus
  refresh: () => void
  refreshing: boolean
  canRefresh: boolean
}

const NowPlayingContext = createContext<NowPlayingValue>({
  data: null,
  source: 'connecting',
  socketStatus: 'connecting',
  refresh: () => {},
  refreshing: false,
  canRefresh: false,
})

const FALLBACK_AFTER_MS = 6000
/** Each refresh reconnects to Aiir's feed, which sits behind Cloudflare rate limits */
const REFRESH_COOLDOWN_MS = 60_000
const REFRESH_TIMEOUT_MS = 8000

export function NowPlayingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<NowPlayingMessage | null>(null)
  const [source, setSource] = useState<NowPlayingSource>('connecting')
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('connecting')
  const [refreshing, setRefreshing] = useState(false)
  const [coolingDown, setCoolingDown] = useState(false)
  const clientRef = useRef<AiirNowPlayingClient | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    let received = false
    const client = new AiirNowPlayingClient({
      onMessage: (message) => {
        received = true
        setData(message)
        setSource('live')
        setRefreshing(false)
      },
      onStatus: setSocketStatus,
    })
    clientRef.current = client
    client.connect()

    const fallback = setTimeout(() => {
      if (!received) {
        setData(createMockNowPlaying())
        setSource('mock')
      }
    }, FALLBACK_AFTER_MS)

    return () => {
      clearTimeout(fallback)
      timersRef.current.forEach(clearTimeout)
      client.close()
      clientRef.current = null
    }
  }, [])

  const refresh = useCallback(() => {
    if (coolingDown || !clientRef.current) return
    setRefreshing(true)
    setCoolingDown(true)
    clientRef.current.refresh()
    timersRef.current.push(
      setTimeout(() => setRefreshing(false), REFRESH_TIMEOUT_MS),
      setTimeout(() => setCoolingDown(false), REFRESH_COOLDOWN_MS),
    )
  }, [coolingDown])

  // Keep mock show times fresh while no live data has arrived
  useEffect(() => {
    if (source !== 'mock') return
    const id = setInterval(() => setData(createMockNowPlaying()), 60_000)
    return () => clearInterval(id)
  }, [source])

  const value = useMemo(
    () => ({ data, source, socketStatus, refresh, refreshing, canRefresh: !coolingDown }),
    [data, source, socketStatus, refresh, refreshing, coolingDown],
  )
  return <NowPlayingContext.Provider value={value}>{children}</NowPlayingContext.Provider>
}

export function useNowPlaying(): NowPlayingValue {
  return useContext(NowPlayingContext)
}

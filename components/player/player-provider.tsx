'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export interface OnDemandShow {
  title: string
  url: string
}

interface PlayerValue {
  /** Changes whenever the live player must be reloaded, which is the only way to stop a cross-origin player */
  liveKey: number
  liveFrameRef: React.RefObject<HTMLIFrameElement | null>
  /** True briefly after a Listen Live button is pressed, to point people at the play bar */
  livePrompt: boolean
  promptLive: () => void
  onDemand: OnDemandShow | null
  openOnDemand: (show: OnDemandShow) => void
  closeOnDemand: () => void
}

const CHANNEL_NAME = 'hive-fm-player'
const PROMPT_MS = 5000

const PlayerContext = createContext<PlayerValue | null>(null)

/**
 * Coordinates the two Aiir players (live play bar and Listen Again) so only one plays at a time.
 * Both are cross-origin iframes, so playback can only be stopped by reloading or removing them.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const liveFrameRef = useRef<HTMLIFrameElement | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const promptTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [liveKey, setLiveKey] = useState(0)
  const [livePrompt, setLivePrompt] = useState(false)
  const [onDemand, setOnDemand] = useState<OnDemandShow | null>(null)

  // Tells other open Hive FM tabs to go quiet so only one tab plays at a time
  const announcePlayback = useCallback(() => channelRef.current?.postMessage('playing'), [])
  const stopLive = useCallback(() => setLiveKey((k) => k + 1), [])

  // The live player is removed from the page while Listen Again is open, which stops it
  const openOnDemand = useCallback(
    (show: OnDemandShow) => {
      setOnDemand(show)
      announcePlayback()
    },
    [announcePlayback],
  )

  const closeOnDemand = useCallback(() => setOnDemand(null), [])

  const promptLive = useCallback(() => {
    setOnDemand(null)
    // Next frame: the live iframe isn't on the page until Listen Again has closed
    requestAnimationFrame(() => liveFrameRef.current?.focus())
    setLivePrompt(true)
    if (promptTimer.current) clearTimeout(promptTimer.current)
    promptTimer.current = setTimeout(() => setLivePrompt(false), PROMPT_MS)
  }, [])

  // Clicking into the live play bar moves focus into its iframe, which blurs this window
  useEffect(() => {
    const onBlur = () =>
      setTimeout(() => {
        if (document.activeElement !== liveFrameRef.current) return
        setOnDemand(null)
        setLivePrompt(false)
        announcePlayback()
      }, 0)
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [announcePlayback])

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel
    channel.onmessage = () => {
      stopLive()
      setOnDemand(null)
    }
    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [stopLive])

  useEffect(() => () => {
    if (promptTimer.current) clearTimeout(promptTimer.current)
  }, [])

  const value = useMemo<PlayerValue>(
    () => ({ liveKey, liveFrameRef, livePrompt, promptLive, onDemand, openOnDemand, closeOnDemand }),
    [liveKey, livePrompt, promptLive, onDemand, openOnDemand, closeOnDemand],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer(): PlayerValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider')
  return ctx
}

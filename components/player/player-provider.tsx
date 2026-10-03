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
import type Hls from 'hls.js'
import { STREAM } from '@/lib/site'

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'error'

interface PlayerValue {
  status: PlayerStatus
  volume: number
  muted: boolean
  play: () => void
  stop: () => void
  toggle: () => void
  setVolume: (value: number) => void
  toggleMute: () => void
}

const PlayerContext = createContext<PlayerValue | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const wantPlayingRef = useRef(false)
  const usingHlsRef = useRef(false)
  const attemptRef = useRef(0)

  const [status, setStatus] = useState<PlayerStatus>('idle')
  const [volume, setVolumeState] = useState(0.8)
  const [muted, setMuted] = useState(false)

  const teardownHls = useCallback(() => {
    hlsRef.current?.destroy()
    hlsRef.current = null
  }, [])

  const fail = useCallback(() => {
    wantPlayingRef.current = false
    setStatus('error')
  }, [])

  const startHls = useCallback(
    async (attempt: number) => {
      const audio = audioRef.current
      if (!audio) return
      usingHlsRef.current = true
      teardownHls()
      try {
        if (audio.canPlayType('application/vnd.apple.mpegurl')) {
          audio.src = STREAM.hls
          await audio.play()
          return
        }
        const { default: HlsLib } = await import('hls.js')
        if (attempt !== attemptRef.current) return
        if (!HlsLib.isSupported()) throw new Error('HLS unsupported')
        const hls = new HlsLib({ lowLatencyMode: true })
        hlsRef.current = hls
        hls.on(HlsLib.Events.ERROR, (_event, details) => {
          if (details.fatal && attempt === attemptRef.current) fail()
        })
        hls.on(HlsLib.Events.MANIFEST_PARSED, () => {
          audio.play().catch(() => {
            if (attempt === attemptRef.current) fail()
          })
        })
        hls.loadSource(STREAM.hls)
        hls.attachMedia(audio)
      } catch {
        if (attempt === attemptRef.current) fail()
      }
    },
    [fail, teardownHls],
  )

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    const attempt = ++attemptRef.current
    wantPlayingRef.current = true
    usingHlsRef.current = false
    teardownHls()
    setStatus('loading')
    audio.src = STREAM.mp3
    try {
      await audio.play()
    } catch {
      if (attempt !== attemptRef.current || !wantPlayingRef.current) return
      usingHlsRef.current = true
      audio.removeAttribute('src')
      await startHls(attempt)
    }
  }, [startHls, teardownHls])

  const stop = useCallback(() => {
    const audio = audioRef.current
    attemptRef.current += 1
    wantPlayingRef.current = false
    usingHlsRef.current = false
    teardownHls()
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    setStatus('idle')
  }, [teardownHls])

  const toggle = useCallback(() => {
    if (wantPlayingRef.current) stop()
    else void play()
  }, [play, stop])

  const setVolume = useCallback((value: number) => {
    setVolumeState(value)
    if (value > 0) setMuted(false)
  }, [])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  const handleError = useCallback(() => {
    if (!wantPlayingRef.current) return
    if (!usingHlsRef.current) void startHls(attemptRef.current)
    else if (!hlsRef.current && audioRef.current?.currentSrc) fail()
  }, [fail, startHls])

  useEffect(() => () => teardownHls(), [teardownHls])

  const value = useMemo<PlayerValue>(
    () => ({ status, volume, muted, play, stop, toggle, setVolume, toggleMute }),
    [status, volume, muted, play, stop, toggle, setVolume, toggleMute],
  )

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => wantPlayingRef.current && setStatus('playing')}
        onWaiting={() => wantPlayingRef.current && setStatus('loading')}
        onError={handleError}
        onPause={() => {
          // Paused externally (e.g. headphones unplugged): treat as stop for a live stream
          if (wantPlayingRef.current && audioRef.current?.paused) stop()
        }}
      />
    </PlayerContext.Provider>
  )
}

export function usePlayer(): PlayerValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider')
  return ctx
}

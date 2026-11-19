/** Shape returned by the Hive FM now-playing Worker (workers/now-playing). */
export interface Track {
  title: string
  artist: string
  album: string
  artwork: string
  type: string
  startedAt: string
}

export interface NowPlayingData {
  nowPlaying: Track | null
  previouslyPlayed: Track[]
  updatedAt: string | null
}

export const NOW_PLAYING_URL =
  process.env.NEXT_PUBLIC_NOW_PLAYING_URL ??
  'https://hive-fm-now-playing.info-webfuzsion.workers.dev/now-playing'

/** Tracks older than this are treated as stale (e.g. automation stopped pushing). */
export const STALE_AFTER_MS = 20 * 60_000

import { STREAM } from '@/lib/site'

export interface NowProgramme {
  type: 'programme'
  name: string
  description: string
  imageUrl: string
  programmeId: string
  start: string
  end: string
  email: string
  phoneNumber: string
  whatsAppNumber: string
  facebookUrl: string
}

export interface NowTrack {
  type: 'track'
  eventId: string
  trackId: string
  title: string
  artist: string
  imageUrl: string
  appleMusicUrl?: string
}

export interface PreviousTrack {
  eventId: string
  trackId: string
  title: string
  artist: string
  imageUrl: string
}

export interface NowPlayingMessage {
  serviceId: string
  nowProgramme: NowProgramme
  nowPlaying: NowTrack | null
  previouslyPlayed: PreviousTrack[]
}

export type SocketStatus = 'connecting' | 'open' | 'closed'

interface ClientOptions {
  serviceId?: string
  url?: string
  onMessage: (message: NowPlayingMessage) => void
  onStatus?: (status: SocketStatus) => void
}

const HEARTBEAT_MS = 240_000
const MAX_BACKOFF_MS = 30_000

function isNowPlayingMessage(value: unknown): value is NowPlayingMessage {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return 'nowProgramme' in v || 'nowPlaying' in v || 'previouslyPlayed' in v
}

/** WebSocket client for the Aiir now-playing feed with heartbeat and reconnect. */
export class AiirNowPlayingClient {
  private socket: WebSocket | null = null
  private heartbeat: ReturnType<typeof setInterval> | null = null
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private attempts = 0
  private closedByUser = false
  private readonly serviceId: string
  private readonly url: string

  constructor(private readonly options: ClientOptions) {
    this.serviceId = options.serviceId ?? STREAM.serviceId
    this.url = options.url ?? STREAM.socket
  }

  connect(): void {
    this.closedByUser = false
    this.open()
  }

  close(): void {
    this.closedByUser = true
    this.clearTimers()
    this.socket?.close()
    this.socket = null
  }

  private open(): void {
    this.options.onStatus?.('connecting')
    let socket: WebSocket
    try {
      socket = new WebSocket(this.url)
    } catch {
      this.scheduleReconnect()
      return
    }
    this.socket = socket

    socket.addEventListener('open', () => {
      this.attempts = 0
      this.options.onStatus?.('open')
      this.send({ action: 'subscribe', serviceId: this.serviceId })
      this.heartbeat = setInterval(() => this.send({ action: 'heartbeat' }), HEARTBEAT_MS)
    })

    socket.addEventListener('message', (event) => {
      try {
        const data: unknown = JSON.parse(String(event.data))
        if (!isNowPlayingMessage(data)) return
        if (data.serviceId && data.serviceId !== this.serviceId) return
        this.options.onMessage(data)
      } catch {
        // Ignore malformed frames
      }
    })

    socket.addEventListener('close', () => {
      this.clearTimers()
      this.options.onStatus?.('closed')
      if (!this.closedByUser) this.scheduleReconnect()
    })

    socket.addEventListener('error', () => {
      socket.close()
    })
  }

  private send(payload: Record<string, string>): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload))
    }
  }

  private scheduleReconnect(): void {
    if (this.closedByUser || this.retryTimer) return
    const delay = Math.min(1000 * 2 ** this.attempts, MAX_BACKOFF_MS)
    this.attempts += 1
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null
      this.open()
    }, delay)
  }

  private clearTimers(): void {
    if (this.heartbeat) clearInterval(this.heartbeat)
    if (this.retryTimer) clearTimeout(this.retryTimer)
    this.heartbeat = null
    this.retryTimer = null
  }
}

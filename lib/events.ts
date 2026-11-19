/**
 * Upcoming events from Hive FM's Supabase `whiteboard_events` table.
 *
 * - Uses the read-only publishable key supplied by Hive FM; it can only read unexpired events.
 * - Asks for exactly these five columns. NEVER add `raw_details` (or select `*`): it can hold
 *   internal notes and presenter on-air scripts that must not be requested, stored or shown.
 * - start_time, location and cost are free text ("TBC", "Free") and are displayed as given.
 */

export interface HiveEvent {
  event_name: string
  event_date: string
  start_time: string
  location: string
  cost: string
}

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://layoalnythayfqdwgovz.supabase.co'
const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_CfHjlSkoLQXcexp87BnYHg_O4jEK62D'

const FIELDS = ['event_name', 'event_date', 'start_time', 'location', 'cost'] as const
const REVALIDATE_SECONDS = 600

/** Today's date in UK time as YYYY-MM-DD. */
export function todayInLondon(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim()
}

function toEvent(row: unknown): HiveEvent | null {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>
  const event: HiveEvent = {
    event_name: text(r.event_name),
    event_date: text(r.event_date).slice(0, 10),
    start_time: text(r.start_time),
    location: text(r.location),
    cost: text(r.cost),
  }
  return event.event_name && /^\d{4}-\d{2}-\d{2}$/.test(event.event_date) ? event : null
}

/** Upcoming events, soonest first. Returns null if the feed couldn't be reached. */
export async function getUpcomingEvents(): Promise<HiveEvent[] | null> {
  const params = new URLSearchParams({
    select: FIELDS.join(','),
    event_date: `gte.${todayInLondon()}`,
    order: 'event_date.asc',
  })
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/whiteboard_events?${params}`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const rows: unknown = await res.json()
    if (!Array.isArray(rows)) return null
    return rows.map(toEvent).filter((e): e is HiveEvent => e !== null)
  } catch {
    return null
  }
}

/** "Saturday 5 December 2026" from a YYYY-MM-DD date. */
export function formatEventDate(date: string): string {
  const d = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return date
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

const noon = (date: string) => new Date(`${date}T12:00:00Z`)

/** Pieces for a calendar-style date block, e.g. { weekday: 'Sat', day: '5', month: 'Dec' }. */
export function dateBlock(date: string): { weekday: string; day: string; month: string } {
  const d = noon(date)
  if (Number.isNaN(d.getTime())) return { weekday: '', day: date, month: '' }
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(d)
  return { weekday: part({ weekday: 'short' }), day: part({ day: 'numeric' }), month: part({ month: 'short' }) }
}

/** "Today", "Tomorrow" or "This weekend" for events that are close; otherwise null. */
export function relativeLabel(date: string, today = todayInLondon()): string | null {
  const days = Math.round((noon(date).getTime() - noon(today).getTime()) / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  const weekday = noon(date).getUTCDay()
  if (days > 1 && days <= 6 && (weekday === 6 || weekday === 0)) return 'This weekend'
  return null
}

/** True for costs like "Free" or "Free entry, tables £5". */
export function isFree(cost: string): boolean {
  return /^free\b/i.test(cost.trim())
}

/** Google Maps directions link for a venue, or null when the location isn't a real place yet. */
export function directionsUrl(location: string): string | null {
  const place = location.trim()
  if (!place || /^(tbc|tba|to be confirmed|to be announced|online|zoom)\b/i.test(place)) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`
}

/** "November 2026" heading for grouping. */
export function monthHeading(date: string): string {
  const d = noon(date)
  if (Number.isNaN(d.getTime())) return 'Coming up'
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(d)
}

export type EventFilter = 'all' | 'week' | 'weekend'

const addDays = (date: string, days: number) => {
  const d = noon(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Whether an event falls in the chosen window. "This weekend" is the coming Sat-Sun (or what's left of it). */
export function matchesFilter(date: string, filter: EventFilter, today: string): boolean {
  if (filter === 'all') return true
  if (filter === 'week') return date >= today && date <= addDays(today, 6)
  const weekday = noon(today).getUTCDay() // 0 Sun ... 6 Sat
  const start = weekday === 0 ? today : addDays(today, weekday === 6 ? 0 : 6 - weekday)
  const end = weekday === 0 ? today : addDays(start, 1)
  return date >= start && date <= end
}

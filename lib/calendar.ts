import { SITE } from '@/lib/site'
import { directionsUrl, type HiveEvent } from '@/lib/events'

/** Events don't have an end time, so timed events are given this length in the calendar. */
const DEFAULT_DURATION_MINUTES = 120

const MAX_TEXT = 300

/** Link to the .ics download for an event (served by app/events/calendar/route.ts). */
export function calendarUrl(event: HiveEvent): string {
  const params = new URLSearchParams({
    name: event.event_name,
    date: event.event_date,
    time: event.start_time,
    location: event.location,
    cost: event.cost,
  })
  return `/events/calendar?${params}`
}

/** Reads "10:30", "19.45", "10:00 AM", "7pm", "7.30 pm". Returns null for "TBC" and the like. */
export function parseStartTime(text: string): { hours: number; minutes: number } | null {
  const match = text.trim().match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/i)
  if (!match) return null
  let hours = Number(match[1])
  const minutes = match[2] ? Number(match[2]) : 0
  const meridiem = match[3]?.toLowerCase()
  if (!meridiem && !match[2]) return null // a bare number isn't a time
  if (meridiem === 'pm' && hours < 12) hours += 12
  if (meridiem === 'am' && hours === 12) hours = 0
  if (hours > 23 || minutes > 59) return null
  return { hours, minutes }
}

/** Minutes the UK is ahead of UTC at the given instant (0 in winter, 60 in summer). */
function londonOffsetMinutes(ms: number): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(ms))
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return Math.round((asUtc - Math.floor(ms / 60000) * 60000) / 60000)
}

/** UK wall-clock time on a YYYY-MM-DD date, as a UTC timestamp in milliseconds. */
function londonToUtc(date: string, hours: number, minutes: number): number {
  const [y, m, d] = date.split('-').map(Number)
  const guess = Date.UTC(y, m - 1, d, hours, minutes)
  const first = guess - londonOffsetMinutes(guess) * 60_000
  return guess - londonOffsetMinutes(first) * 60_000
}

const pad = (n: number) => String(n).padStart(2, '0')

function utcStamp(ms: number): string {
  const d = new Date(ms)
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
}

function dateStamp(date: string, plusDays = 0): string {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + plusDays)
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** Folds lines longer than 75 bytes, as the iCalendar format requires. */
function fold(line: string): string {
  const encoder = new TextEncoder()
  if (encoder.encode(line).length <= 75) return line
  const out: string[] = []
  let current = ''
  for (const char of line) {
    const limit = out.length === 0 ? 75 : 74
    if (encoder.encode(current + char).length > limit) {
      out.push(current)
      current = char
    } else {
      current += char
    }
  }
  out.push(current)
  return out.join('\r\n ')
}

/** schema.org startDate: "2026-12-05T10:00:00+00:00" when the time is known, otherwise just "2026-12-05". */
export function startDateIso(event: HiveEvent): string {
  const time = parseStartTime(event.start_time)
  if (!time) return event.event_date
  const utc = londonToUtc(event.event_date, time.hours, time.minutes)
  const offset = londonOffsetMinutes(utc)
  const sign = offset < 0 ? '-' : '+'
  return `${event.event_date}T${pad(time.hours)}:${pad(time.minutes)}:00${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`
}

/** Validates the query-string values; returns null when they don't describe a real event. */
export function eventFromParams(params: URLSearchParams): HiveEvent | null {
  const clean = (key: string) => (params.get(key) ?? '').trim().slice(0, MAX_TEXT)
  const event = {
    event_name: clean('name'),
    event_date: clean('date'),
    start_time: clean('time'),
    location: clean('location'),
    cost: clean('cost'),
  }
  if (!event.event_name || !/^\d{4}-\d{2}-\d{2}$/.test(event.event_date)) return null
  if (Number.isNaN(new Date(`${event.event_date}T12:00:00Z`).getTime())) return null
  return event
}

/** An .ics file for one event. Timed if the start time can be read, otherwise an all-day event. */
export function buildIcs(event: HiveEvent, now = new Date()): string {
  const time = parseStartTime(event.start_time)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hive FM//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.event_date}-${event.event_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}@hivefm.org`,
    `DTSTAMP:${utcStamp(now.getTime())}`,
  ]

  if (time) {
    const start = londonToUtc(event.event_date, time.hours, time.minutes)
    lines.push(`DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(start + DEFAULT_DURATION_MINUTES * 60_000)}`)
  } else {
    lines.push(`DTSTART;VALUE=DATE:${dateStamp(event.event_date)}`, `DTEND;VALUE=DATE:${dateStamp(event.event_date, 1)}`)
  }

  const details = [
    event.start_time && !time ? `Start time: ${event.start_time}` : '',
    event.cost ? `Entry: ${event.cost}` : '',
    `More events: ${SITE.url}/events`,
  ].filter(Boolean)

  lines.push(`SUMMARY:${escapeText(event.event_name)}`)
  // Leave "TBC" and similar out so it doesn't show as a place in the calendar
  if (directionsUrl(event.location)) lines.push(`LOCATION:${escapeText(event.location)}`)
  lines.push(`DESCRIPTION:${escapeText(details.join('\n'))}`, 'END:VEVENT', 'END:VCALENDAR')

  return lines.map(fold).join('\r\n') + '\r\n'
}

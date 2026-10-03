import { presenters } from '@/lib/presenters'
import { schedule as fallbackSchedule, type DayIndex, type ScheduleSlot } from '@/lib/schedule'
import { SITE, STREAM } from '@/lib/site'
import { toMinutes } from '@/lib/time'

/** Aiir's public schedule page for Hive FM (the same pages its mobile app shows). */
const BASE = `https://mobile-app-pages.aiir.net/_app_pages/stations/${STREAM.serviceId}/schedule`
/**
 * Aiir's backend feed of recorded shows (~2 days back, ~8 days ahead), times in UTC.
 * Only covers recorded shows, so automated slots like The Overnight Mix are missing from it.
 */
const RECORDINGS_URL = `https://data.aiir.net/services/${STREAM.serviceId}/recordings.json`
const REVALIDATE_SECONDS = 21_600 // 6 hours: the rota rarely changes

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&nbsp;': ' ',
}

function decode(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(Number(num)))
    .replace(/&[a-z]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity)
    .replace(/\s+/g, ' ')
    .trim()
}

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

/** Links a show to a presenter when the presenter's name appears in the show title. */
function presenterSlugFor(showName: string): string | undefined {
  const haystack = normalise(showName)
  return presenters.find((p) => haystack.includes(normalise(p.name)))?.slug
}

/** Pulls "HH:MM", title and image for every row of one day's Aiir page. */
function parseDay(html: string, day: DayIndex): ScheduleSlot[] {
  const rows: { start: string; showName: string; image: string }[] = []
  for (const item of html.split('<li').slice(1)) {
    const time = item.match(/<span class="secondary">\s*(\d{1,2}:\d{2})/)
    const title = item.match(/<strong>([\s\S]*?)<\/strong>/)
    if (!time || !title) continue
    const image = item.match(/<img src="([^"]+)"/)?.[1]
    rows.push({
      start: time[1].padStart(5, '0'),
      showName: decode(title[1]),
      image: image && image.startsWith('https://') ? image : SITE.badge,
    })
  }
  return rows.map((row, i) => ({
    day,
    start: row.start,
    end: rows[i + 1]?.start ?? '24:00',
    showName: row.showName,
    presenterSlug: presenterSlugFor(row.showName),
    image: row.image,
  }))
}

interface Recording {
  name: string
  thumbnail?: string | null
  broadcaststart: string
  broadcastend: string
}

const ukFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** "2026-10-05 05:00:00" (UTC) -> UK calendar date and minutes past midnight. */
function toUk(utc: string): { date: string; minutes: number } {
  const parts = ukFormat.formatToParts(new Date(`${utc.replace(' ', 'T')}Z`))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

const hhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

type Span = { start: number; end: number; showName: string; image: string }

/** Recorded shows grouped by UK date, split at midnight, or null if the feed can't be read. */
async function fetchRecordings(): Promise<Map<string, Span[]> | null> {
  try {
    const response = await fetch(RECORDINGS_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'HiveFM-website' },
    })
    if (!response.ok) return null
    const data: unknown = await response.json()
    if (!Array.isArray(data)) return null

    const byDate = new Map<string, Span[]>()
    const add = (date: string, span: Span) => {
      if (span.end > span.start) byDate.set(date, [...(byDate.get(date) ?? []), span])
    }
    for (const r of data as Recording[]) {
      if (!r?.name || !r.broadcaststart || !r.broadcastend) continue
      const start = toUk(r.broadcaststart)
      const end = toUk(r.broadcastend)
      const base = {
        showName: decode(r.name),
        image: r.thumbnail?.startsWith('https://') ? r.thumbnail : SITE.badge,
      }
      if (start.date === end.date) {
        add(start.date, { ...base, start: start.minutes, end: end.minutes })
      } else {
        add(start.date, { ...base, start: start.minutes, end: 24 * 60 })
        add(end.date, { ...base, start: 0, end: end.minutes })
      }
    }
    for (const spans of byDate.values()) spans.sort((a, b) => a.start - b.start)
    return byDate
  } catch {
    return null
  }
}

/** Recorded shows for the day, with any gaps between them filled from the other schedule source. */
function mergeDay(day: DayIndex, recorded: Span[], filler: ScheduleSlot[]): ScheduleSlot[] {
  const toSlot = (span: Span): ScheduleSlot => ({
    day,
    start: hhmm(span.start),
    end: span.end === 24 * 60 ? '24:00' : hhmm(span.end),
    showName: span.showName,
    presenterSlug: presenterSlugFor(span.showName),
    image: span.image,
  })

  const gapFill = (from: number, to: number): Span[] =>
    filler
      .map((s) => ({ ...s, s: toMinutes(s.start), e: toMinutes(s.end) }))
      .filter((s) => s.e > from && s.s < to)
      .map((s) => ({ start: Math.max(s.s, from), end: Math.min(s.e, to), showName: s.showName, image: s.image }))
      .filter((s) => s.end - s.start >= 15)

  const spans: Span[] = []
  let cursor = 0
  for (const span of recorded) {
    if (span.start < cursor) continue
    if (span.start > cursor) spans.push(...gapFill(cursor, span.start))
    spans.push(span)
    cursor = span.end
  }
  if (cursor < 24 * 60) spans.push(...gapFill(cursor, 24 * 60))
  return spans.filter((s) => s.end > s.start).map(toSlot)
}

/** The next seven calendar days in UK time, with their Monday-first day index. */
function nextSevenDays(from = new Date()): { year: string; month: string; dayOfMonth: string; day: DayIndex }[] {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(from)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const base = Date.UTC(get('year'), get('month') - 1, get('day'))

  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(base + offset * 86_400_000)
    return {
      year: String(date.getUTCFullYear()),
      month: String(date.getUTCMonth() + 1).padStart(2, '0'),
      dayOfMonth: String(date.getUTCDate()).padStart(2, '0'),
      day: ((date.getUTCDay() + 6) % 7) as DayIndex,
    }
  })
}

async function fetchDay(entry: ReturnType<typeof nextSevenDays>[number]): Promise<ScheduleSlot[] | null> {
  try {
    const response = await fetch(`${BASE}/${entry.year}/${entry.month}/${entry.dayOfMonth}?nostack=1`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'HiveFM-website' },
    })
    if (!response.ok) return null
    const slots = parseDay(await response.text(), entry.day)
    return slots.length > 0 ? slots : null
  } catch {
    return null
  }
}

/** Last successfully fetched live slots per weekday, so a brief Aiir outage doesn't drop us back to the snapshot. */
const lastLive = new Map<DayIndex, ScheduleSlot[]>()

/**
 * The schedule to show, cached for 6 hours on the server.
 * Recorded shows come from Aiir's recordings feed; the gaps between them (and any day the feed
 * doesn't cover) come from Aiir's schedule pages, then the last live copy, then the built-in snapshot.
 */
export async function getSchedule(): Promise<ScheduleSlot[]> {
  const days = nextSevenDays()
  const [recordings, pages] = await Promise.all([fetchRecordings(), Promise.all(days.map(fetchDay))])
  return days.flatMap((entry, i) => {
    const page = pages[i]
    if (page) lastLive.set(entry.day, page)
    const filler = page ?? lastLive.get(entry.day) ?? fallbackSchedule.filter((slot) => slot.day === entry.day)
    const recorded = recordings?.get(`${entry.year}-${entry.month}-${entry.dayOfMonth}`)
    return recorded?.length ? mergeDay(entry.day, recorded, filler) : filler
  })
}

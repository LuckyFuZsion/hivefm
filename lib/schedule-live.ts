import { presenters } from '@/lib/presenters'
import { schedule as fallbackSchedule, type DayIndex, type ScheduleSlot } from '@/lib/schedule'
import { SITE, STREAM } from '@/lib/site'

/** Aiir's public schedule page for Hive FM (the same pages its mobile app shows). */
const BASE = `https://mobile-app-pages.aiir.net/_app_pages/stations/${STREAM.serviceId}/schedule`
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
 * The schedule to show. Always tries Aiir's live schedule first (cached for 6 hours on the server).
 * For any day that can't be fetched: the last live copy we got, then the built-in snapshot.
 */
export async function getSchedule(): Promise<ScheduleSlot[]> {
  const days = nextSevenDays()
  const results = await Promise.all(days.map(fetchDay))
  return days.flatMap((entry, i) => {
    const live = results[i]
    if (live) {
      lastLive.set(entry.day, live)
      return live
    }
    return lastLive.get(entry.day) ?? fallbackSchedule.filter((slot) => slot.day === entry.day)
  })
}

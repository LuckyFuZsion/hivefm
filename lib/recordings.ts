import { presenters, slugify, type Presenter } from '@/lib/presenters'
import { SITE, STREAM } from '@/lib/site'

/**
 * Aiir's backend feed of recorded shows: the last 2-3 days and at least the next 7, times in UTC.
 * Aiir have said the address is fixed and it's fine to call a couple of times a day.
 * It only covers recorded shows, so automated slots like The Overnight Mix are missing from it.
 */
const RECORDINGS_URL = `https://data.aiir.net/services/${STREAM.serviceId}/recordings.json`

/** 12 hours, matching Aiir's "a couple of times a day". Keep in sync with `revalidate` in the pages that use it. */
export const RECORDINGS_REVALIDATE_SECONDS = 43_200

export interface RecordedShow {
  showName: string
  image: string
  /** ISO 8601, UTC */
  startUtc: string
  endUtc: string
}

/** A recorded show placed on one UK calendar day, in minutes past midnight. Shows crossing midnight are split. */
export interface DaySpan {
  start: number
  end: number
  showName: string
  image: string
}

interface RawRecording {
  name?: string
  thumbnail?: string | null
  broadcaststart?: string
  broadcastend?: string
}

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

/** The presenter whose name appears in a show title. Aiir's staff_id identifies shows, not people. */
export function presenterForShow(showName: string): Presenter | undefined {
  const haystack = normalise(showName)
  return presenters.find((p) => haystack.includes(normalise(p.name)))
}

/** The presenter entry whose curated Listen Again slug best fits this show: exact title first, then name. */
function onDemandPresenterForShow(showName: string): Presenter | undefined {
  const title = normalise(showName)
  const withPage = presenters.filter((p) => p.onDemand)
  return (
    withPage.find((p) => p.showTitle && normalise(p.showTitle) === title) ??
    withPage.find((p) => normalise(p.name) && title.includes(normalise(p.name)))
  )
}

const pageExists = new Map<string, Promise<boolean>>()

function onDemandPageExists(url: string): Promise<boolean> {
  let check = pageExists.get(url)
  if (!check) {
    check = fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) })
      .then((res) => res.ok)
      .catch(() => false)
    pageExists.set(url, check)
  }
  return check
}

/**
 * Aiir's Listen Again page for a show. Aiir names each show's page after its title, which keeps
 * presenters with several shows apart, so that is tried first; otherwise the presenter's page.
 */
export async function onDemandUrlForShow(showName: string): Promise<string | undefined> {
  const byTitle = `${SITE.onDemandBase}${slugify(showName)}`
  if (await onDemandPageExists(byTitle)) return byTitle
  const slug = onDemandPresenterForShow(showName)?.onDemand
  return slug ? `${SITE.onDemandBase}${slug}` : undefined
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

/** UTC instant -> UK calendar date ("YYYY-MM-DD") and minutes past midnight. */
export function toUk(isoUtc: string): { date: string; minutes: number } {
  const parts = ukFormat.formatToParts(new Date(isoUtc))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

/** "2026-10-05 05:00:00" (Aiir's UTC format) -> ISO 8601 */
const toIso = (aiir: string) => `${aiir.trim().replace(' ', 'T')}Z`

/** Last good copy, so a brief Aiir outage doesn't empty the schedule or episode list. */
let lastGood: RecordedShow[] | null = null

/** All recorded shows in the feed, sorted by start time, or the last good copy if the feed can't be read. */
export async function fetchRecordings(): Promise<RecordedShow[] | null> {
  try {
    const response = await fetch(RECORDINGS_URL, {
      next: { revalidate: RECORDINGS_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'HiveFM-website' },
    })
    if (!response.ok) return lastGood
    const data: unknown = await response.json()
    if (!Array.isArray(data)) return lastGood

    const shows: RecordedShow[] = []
    for (const r of data as RawRecording[]) {
      if (!r?.name || !r.broadcaststart || !r.broadcastend) continue
      const startUtc = toIso(r.broadcaststart)
      const endUtc = toIso(r.broadcastend)
      if (Number.isNaN(Date.parse(startUtc)) || Number.isNaN(Date.parse(endUtc))) continue
      shows.push({
        showName: decode(r.name),
        image: r.thumbnail?.startsWith('https://') ? r.thumbnail : SITE.badge,
        startUtc,
        endUtc,
      })
    }
    shows.sort((a, b) => a.startUtc.localeCompare(b.startUtc))
    if (shows.length) lastGood = shows
    return shows.length ? shows : lastGood
  } catch {
    return lastGood
  }
}

/** Recorded shows grouped by UK calendar date, split at midnight and sorted within each day. */
export function spansByUkDate(shows: RecordedShow[]): Map<string, DaySpan[]> {
  const byDate = new Map<string, DaySpan[]>()
  const add = (date: string, span: DaySpan) => {
    if (span.end > span.start) byDate.set(date, [...(byDate.get(date) ?? []), span])
  }
  for (const show of shows) {
    const start = toUk(show.startUtc)
    const end = toUk(show.endUtc)
    const base = { showName: show.showName, image: show.image }
    if (start.date === end.date) {
      add(start.date, { ...base, start: start.minutes, end: end.minutes })
    } else {
      add(start.date, { ...base, start: start.minutes, end: 24 * 60 })
      add(end.date, { ...base, start: 0, end: end.minutes })
    }
  }
  for (const spans of byDate.values()) spans.sort((a, b) => a.start - b.start)
  return byDate
}

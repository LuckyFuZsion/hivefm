import { fetchRecordings, presenterForShow, spansByUkDate, type DaySpan } from '@/lib/recordings'
import { schedule as snapshot, type DayIndex, type ScheduleSlot } from '@/lib/schedule'
import { toMinutes } from '@/lib/time'

const hhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

/** Recorded shows for the day, with the gaps between them (automated slots) filled from the snapshot. */
function mergeDay(day: DayIndex, recorded: DaySpan[], filler: ScheduleSlot[]): ScheduleSlot[] {
  const toSlot = (span: DaySpan): ScheduleSlot => ({
    day,
    start: hhmm(span.start),
    end: span.end === 24 * 60 ? '24:00' : hhmm(span.end),
    showName: span.showName,
    presenterSlug: presenterForShow(span.showName)?.slug,
    image: span.image,
  })

  const gapFill = (from: number, to: number): DaySpan[] =>
    filler
      .map((s) => ({ ...s, s: toMinutes(s.start), e: toMinutes(s.end) }))
      .filter((s) => s.e > from && s.s < to)
      .map((s) => ({ start: Math.max(s.s, from), end: Math.min(s.e, to), showName: s.showName, image: s.image }))
      .filter((s) => s.end - s.start >= 15)

  const spans: DaySpan[] = []
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

/** The next seven calendar days in UK time, as "YYYY-MM-DD" with their Monday-first day index. */
function nextSevenDays(from = new Date()): { date: string; day: DayIndex }[] {
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
      date: date.toISOString().slice(0, 10),
      day: ((date.getUTCDay() + 6) % 7) as DayIndex,
    }
  })
}

/**
 * The schedule to show, cached for 12 hours on the server (see RECORDINGS_REVALIDATE_SECONDS).
 * Recorded shows come from Aiir's recordings feed. The gaps between them, and any day the feed
 * doesn't cover, come from the built-in snapshot in lib/schedule.ts.
 */
export async function getSchedule(): Promise<ScheduleSlot[]> {
  const recordings = await fetchRecordings()
  const byDate = recordings ? spansByUkDate(recordings) : null
  return nextSevenDays().flatMap(({ date, day }) => {
    const filler = snapshot.filter((slot) => slot.day === day)
    const recorded = byDate?.get(date)
    return recorded?.length ? mergeDay(day, recorded, filler) : filler
  })
}

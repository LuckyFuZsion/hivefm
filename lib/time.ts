const TZ = 'Europe/London'

export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

/** Formats a Date as "10am" or "10:30am" in UK time. */
export function formatClock(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date)
  const hour = parts.find((p) => p.type === 'hour')?.value ?? ''
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  const period = (parts.find((p) => p.type === 'dayPeriod')?.value ?? '').toLowerCase()
  return `${hour}${minute === '00' ? '' : `:${minute}`}${period}`
}

/** "10am – 12pm" from two ISO strings. */
export function formatShowRange(start: string, end: string): string {
  return `${formatClock(new Date(start))} – ${formatClock(new Date(end))}`
}

/** Converts "HH:MM" (24h, "24:00" allowed) to minutes after midnight. */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

/** Converts "HH:MM" to "10am" / "12:30pm" / "midnight". */
export function formatHHMM(hhmm: string): string {
  const total = toMinutes(hhmm)
  if (total === 0 || total === 1440) return 'midnight'
  const h24 = Math.floor(total / 60)
  const m = total % 60
  const period = h24 >= 12 ? 'pm' : 'am'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}${m === 0 ? '' : `:${String(m).padStart(2, '0')}`}${period}`
}

export function formatSlotRange(start: string, end: string): string {
  return `${formatHHMM(start)} – ${formatHHMM(end)}`
}

/** Current day (0 = Monday) and minutes after midnight in UK time. */
export function londonNow(date: Date = new Date()): { dayIndex: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  const dayIndex = Math.max(0, DAY_SHORT.indexOf(weekday as (typeof DAY_SHORT)[number]))
  return { dayIndex, minutes: hour * 60 + minute }
}

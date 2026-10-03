import { SITE } from '@/lib/site'
import { toMinutes } from '@/lib/time'

/** 0 = Monday ... 6 = Sunday */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ScheduleSlot {
  day: DayIndex
  /** 24h "HH:MM" */
  start: string
  /** 24h "HH:MM", "24:00" for end of day */
  end: string
  showName: string
  presenterSlug?: string
  image: string
}

const img = SITE.logo

const weekday = (day: DayIndex): ScheduleSlot[] => [
  { day, start: '00:00', end: '07:00', showName: 'The Overnight Mix', image: img },
  { day, start: '07:00', end: '09:00', showName: 'Rise & Shine with Suzie Sparkles', presenterSlug: 'suzie-sparkles', image: img },
  { day, start: '09:00', end: '12:00', showName: 'The Goldmine with Willie Mac', presenterSlug: 'willie-mac', image: img },
  { day, start: '12:00', end: '15:00', showName: 'The Lunch Hive with Guy Jogoo', presenterSlug: 'guy-jogoo', image: img },
  { day, start: '15:00', end: '18:00', showName: 'Drivetime with Ian Thacker', presenterSlug: 'ian-thacker', image: img },
  { day, start: '18:00', end: '24:00', showName: 'Hive FM Evenings', image: img },
]

const saturday: ScheduleSlot[] = [
  { day: 5, start: '02:00', end: '06:00', showName: 'The Overnight Mix', image: img },
  { day: 5, start: '06:00', end: '10:00', showName: 'James Dale at Breakfast', presenterSlug: 'james-dale', image: img },
  { day: 5, start: '10:00', end: '12:00', showName: 'Tunes at Ten With Andy Antony', presenterSlug: 'andy-antony', image: img },
  { day: 5, start: '12:00', end: '14:00', showName: "Ela's Saturday Shout With Ela Watts", presenterSlug: 'ela-watts', image: img },
  { day: 5, start: '14:00', end: '17:00', showName: 'The Buzz with Alastair Hawken', presenterSlug: 'alastair-hawken', image: img },
  { day: 5, start: '17:00', end: '19:00', showName: "Mr G's Time Travel Groove with Paul Green", presenterSlug: 'paul-green', image: img },
  { day: 5, start: '19:00', end: '22:00', showName: 'Love your Saturday Night Dancefloor with Elvis Stooke', presenterSlug: 'elvis-stooke', image: img },
  { day: 5, start: '22:00', end: '24:00', showName: 'Classic Floor Fillers With Andy McCall', presenterSlug: 'andy-mccall', image: img },
]

const sunday: ScheduleSlot[] = [
  { day: 6, start: '00:00', end: '08:00', showName: 'The Overnight Mix', image: img },
  { day: 6, start: '08:00', end: '24:00', showName: 'The Sunday Hive', image: img },
]

// Saturday is real data. Other days are placeholders until the full rota is confirmed.
export const schedule: ScheduleSlot[] = [
  ...weekday(0),
  ...weekday(1),
  ...weekday(2),
  ...weekday(3),
  ...weekday(4),
  ...saturday,
  ...sunday,
]

/** Swap the body for an API fetch later; callers already await it. */
export async function getSchedule(): Promise<ScheduleSlot[]> {
  return schedule
}

export function slotsForDay(slots: ScheduleSlot[], day: number): ScheduleSlot[] {
  return slots
    .filter((s) => s.day === day)
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
}

export function findCurrentSlot(
  slots: ScheduleSlot[],
  day: number,
  minutes: number,
): ScheduleSlot | undefined {
  return slotsForDay(slots, day).find(
    (s) => minutes >= toMinutes(s.start) && minutes < toMinutes(s.end),
  )
}

/** Minutes until the next airing of any of the given slots, from now (UK time). */
export function nextAiring(
  slots: ScheduleSlot[],
  day: number,
  minutes: number,
): { slot: ScheduleSlot; daysAhead: number } | undefined {
  for (let offset = 0; offset < 8; offset++) {
    const d = (day + offset) % 7
    const candidates = slots
      .filter((s) => s.day === d)
      .filter((s) => offset > 0 || toMinutes(s.end) > minutes)
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
    if (candidates.length) return { slot: candidates[0], daysAhead: offset }
  }
  return undefined
}

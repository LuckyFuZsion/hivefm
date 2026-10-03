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

const img = SITE.badge

type Row = [start: string, showName: string, presenterSlug?: string]

/** Builds a day's slots from start times; each slot ends when the next one begins. */
const day = (d: DayIndex, rows: Row[]): ScheduleSlot[] =>
  rows.map(([start, showName, presenterSlug], i) => ({
    day: d,
    start,
    end: rows[i + 1]?.[0] ?? '24:00',
    showName,
    presenterSlug,
    image: img,
  }))

/**
 * Snapshot of the real weekly rota, copied from Aiir's schedule for 3-9 Oct 2026.
 * Used as the fallback if the live schedule can't be fetched (see lib/schedule-live.ts).
 * 0 = Monday ... 6 = Sunday.
 */
export const schedule: ScheduleSlot[] = [
  // Monday
  ...day(0, [
    ["00:00", "The Overnight Mix"],
    ["06:00", "Early Risers With Harry Chapman", "harry-chapman"],
    ["07:00", "James Dale at Breakfast", "james-dale"],
    ["09:00", "Goldmine at Nine with Ady Crampton", "ady-crampton"],
    ["10:00", "The Mid Morning Show with Paul Green", "paul-green"],
    ["12:00", "The Lunch Hive with Guy Jogoo", "guy-jogoo"],
    ["15:00", "Drivetime with Ian Thacker", "ian-thacker"],
    ["18:00", "Soul & Motown SpectacuLAR With Vince Frank", "vince-frank"],
    ["20:00", "Monday Night Jazz with Andy Antony", "andy-antony"],
    ["22:00", "Love From Tony With Tony Lloyd"],
  ]),
  // Tuesday
  ...day(1, [
    ["00:00", "The Overnight Mix"],
    ["06:00", "Early Risers With Harry Chapman", "harry-chapman"],
    ["07:00", "Rise & Shine with Suzie Sparkles", "suzie-sparkles"],
    ["09:00", "Goldmine at Nine with Ady Crampton", "ady-crampton"],
    ["10:00", "The Tartan Tonic With Willie Mac", "willie-mac"],
    ["12:00", "The Lunch Hive with Guy Jogoo", "guy-jogoo"],
    ["15:00", "Drivetime with Ian Thacker", "ian-thacker"],
    ["18:00", "The Shaun James Music Lounge", "shaun-james"],
    ["20:00", "Alternative Indie With David Barnett", "david-barnett"],
    ["22:00", "The Workday Wind Down"],
  ]),
  // Wednesday
  ...day(2, [
    ["00:00", "The Overnight Mix"],
    ["06:00", "Early Risers With Harry Chapman", "harry-chapman"],
    ["07:00", "James Dale at Breakfast", "james-dale"],
    ["09:00", "Goldmine at Nine with Ady Crampton", "ady-crampton"],
    ["10:00", "The Tartan Tonic With Willie Mac", "willie-mac"],
    ["12:00", "The Lunch Hive with Guy Jogoo", "guy-jogoo"],
    ["15:00", "Drivetime with Ian Thacker", "ian-thacker"],
    ["18:00", "The PM Show with Paul O’ Reilly", "paul-o-reilly"],
    ["20:00", "The 80's Roll Back With Guy Jogoo", "guy-jogoo"],
    ["22:00", "That 90's & 00's Show With Mick Hall", "mick-hall"],
  ]),
  // Thursday
  ...day(3, [
    ["00:00", "The Overnight Mix"],
    ["06:00", "Early Risers With Harry Chapman", "harry-chapman"],
    ["07:00", "Rise & Shine with Suzie Sparkles", "suzie-sparkles"],
    ["09:00", "Goldmine at Nine with Ady Crampton", "ady-crampton"],
    ["10:00", "The Tartan Tonic with Ashley Coulson", "ashley-coulson"],
    ["12:00", "The Lunch Hive with Guy Jogoo", "guy-jogoo"],
    ["15:00", "Drivetime with Ian Thacker", "ian-thacker"],
    ["18:00", "Church on Thursday With Roger Church", "roger-church"],
    ["20:00", "What a Wonderful World by Lia Vox"],
    ["22:00", "Ready For The Weekend With Lee Everest", "lee-everest"],
    ["23:00", "The Workday Wind Down"],
  ]),
  // Friday
  ...day(4, [
    ["00:00", "The Overnight Mix"],
    ["06:00", "Early Risers With Harry Chapman", "harry-chapman"],
    ["07:00", "Rise & Shine with Suzie Sparkles", "suzie-sparkles"],
    ["09:00", "Goldmine at Nine with Ady Crampton", "ady-crampton"],
    ["10:00", "The Mid Morning Show With James Dale", "james-dale"],
    ["12:00", "The Lunch Hive with Guy Jogoo", "guy-jogoo"],
    ["15:00", "Drivetime with Ian Thacker", "ian-thacker"],
    ["18:00", "The Gingerbread Man With The Weekend Warm Up", "the-gingerbread-man"],
    ["20:00", "Friday Night Fun With Nev Eaglen", "nev-eaglen"],
    ["23:00", "Lee Everest With Dance Party weekly", "lee-everest"],
  ]),
  // Saturday
  ...day(5, [
    ["02:00", "The Overnight Mix"],
    ["06:00", "James Dale at Breakfast", "james-dale"],
    ["10:00", "Tunes at Ten With Andy Antony", "andy-antony"],
    ["12:00", "Ela's Saturday Shout With Ela Watts", "ela-watts"],
    ["14:00", "The Buzz with Alastair Hawken", "alastair-hawken"],
    ["17:00", "Mr G’s Time Travel Groove with Paul Green", "paul-green"],
    ["19:00", "Love your Saturday Night Dancefloor with Elvis Stooke", "elvis-stooke"],
    ["22:00", "Classic Floor Fillers With Andy McCall", "andy-mccall"],
  ]),
  // Sunday
  ...day(6, [
    ["00:00", "The Overnight Mix"],
    ["06:00", "James Dale at Breakfast", "james-dale"],
    ["10:00", "The Sunday Special with Harry Chapman", "harry-chapman"],
    ["13:00", "Ian Smith With One's at One", "ian-smith"],
    ["14:00", "The Sunday Jukebox With Mark Roberts", "mark-roberts"],
    ["17:00", "Rock Of Ages: The Radio Show With Steve Healey", "steve-healey"],
    ["19:00", "Rob Jackson With Country Vibes", "rob-jackson"],
    ["21:00", "Ady Crampton With The 70's Soul Show", "ady-crampton"],
    ["23:00", "The Weekend Wind Down"],
  ]),
]

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

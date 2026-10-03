import type { NowPlayingMessage } from '@/lib/aiir'
import { findCurrentSlot, schedule } from '@/lib/schedule'
import { SITE, STREAM } from '@/lib/site'
import { londonNow, toMinutes } from '@/lib/time'

const logo = SITE.logo

/** Fallback shown if the live socket cannot be reached, so the UI never looks broken. */
export function createMockNowPlaying(now: Date = new Date()): NowPlayingMessage {
  const { dayIndex, minutes } = londonNow(now)
  const slot = findCurrentSlot(schedule, dayIndex, minutes)
  const startMin = slot ? toMinutes(slot.start) : Math.floor(minutes / 60) * 60
  const endMin = slot ? toMinutes(slot.end) : startMin + 60
  const start = new Date(now.getTime() - (minutes - startMin) * 60_000)
  const end = new Date(now.getTime() + (endMin - minutes) * 60_000)

  return {
    serviceId: STREAM.serviceId,
    nowProgramme: {
      type: 'programme',
      name: slot?.showName ?? 'Hive FM',
      description: 'Bringing Grantham Together, 24 hours a day.',
      imageUrl: logo,
      programmeId: 'mock',
      start: start.toISOString(),
      end: end.toISOString(),
      email: SITE.studioEmail,
      phoneNumber: SITE.studioPhone,
      whatsAppNumber: SITE.studioPhoneIntl,
      facebookUrl: SITE.facebook,
    },
    nowPlaying: null,
    previouslyPlayed: [
      { eventId: 'm1', trackId: 'm1', title: 'Your Favourite Song', artist: 'Hive FM', imageUrl: logo },
      { eventId: 'm2', trackId: 'm2', title: 'Sunshine Groove', artist: 'The Honeybees', imageUrl: logo },
      { eventId: 'm3', trackId: 'm3', title: 'Grantham Nights', artist: 'Local Heroes', imageUrl: logo },
      { eventId: 'm4', trackId: 'm4', title: 'Golden Hour', artist: 'Hive FM', imageUrl: logo },
      { eventId: 'm5', trackId: 'm5', title: 'Community Spirit', artist: 'The Drones', imageUrl: logo },
    ],
  }
}

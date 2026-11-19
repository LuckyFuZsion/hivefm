import { startDateIso } from '@/lib/calendar'
import { directionsUrl, isFree, type HiveEvent } from '@/lib/events'
import { SITE } from '@/lib/site'

/** "£5", "£3.50 per person" -> "5" / "3.50". Anything else isn't a clean price. */
function priceFrom(cost: string): string | null {
  const match = cost.trim().match(/^£\s?(\d+(?:\.\d{1,2})?)\b/)
  return match ? match[1] : null
}

function toSchemaEvent(event: HiveEvent) {
  const price = isFree(event.cost) ? '0' : priceFrom(event.cost)
  const place = directionsUrl(event.location) ? event.location : null
  return {
    '@type': 'Event',
    name: event.event_name,
    startDate: startDateIso(event),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: `${SITE.url}/events`,
    ...(place && {
      location: { '@type': 'Place', name: place, address: place },
    }),
    ...(price !== null && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        url: `${SITE.url}/events`,
      },
    }),
  }
}

/** JSON-LD for the Events page, safe to put in a script tag. */
export function eventsJsonLd(events: HiveEvent[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@graph': events.map(toSchemaEvent),
  }
  return JSON.stringify(data).replace(/</g, '\u003c')
}

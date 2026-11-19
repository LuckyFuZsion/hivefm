import type { Metadata } from 'next'
import { EventsList } from '@/components/events/events-list'
import { PageHeader } from '@/components/shared/page-header'
import { eventsJsonLd } from '@/lib/event-schema'
import { getUpcomingEvents, todayInLondon } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events from Hive FM 97.2 and the Grantham community.',
}

export const revalidate = 600

export default async function EventsPage() {
  const events = await getUpcomingEvents()
  const today = todayInLondon()

  return (
    <>
      <PageHeader
        eyebrow="What's on"
        title="Upcoming events"
        intro="Everything coming up from Hive FM and around Grantham."
      />
      {events && events.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: eventsJsonLd(events) }} />
      )}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {events === null ? (
          <p className="rounded-2xl border bg-card p-6 text-lg">
            We couldn&apos;t load the events just now. Please try again in a few minutes.
          </p>
        ) : (
          <EventsList events={events} today={today} />
        )}
      </div>
    </>
  )
}

'use client'

import { useState } from 'react'
import { EventCard } from '@/components/events/event-card'
import { matchesFilter, monthHeading, type EventFilter, type HiveEvent } from '@/lib/events'
import { cn } from '@/lib/utils'

const FILTERS: { value: EventFilter; label: string; empty: string }[] = [
  { value: 'all', label: 'All upcoming', empty: 'There are no upcoming events at the moment. Check back soon!' },
  { value: 'week', label: 'This week', empty: 'No events in the next 7 days. Try "All upcoming".' },
  { value: 'weekend', label: 'This weekend', empty: 'No events this weekend. Try "All upcoming".' },
]

/** Events are already sorted by date, so months come out in order. */
function groupByMonth(events: HiveEvent[]): { heading: string; events: HiveEvent[] }[] {
  const groups: { heading: string; events: HiveEvent[] }[] = []
  for (const event of events) {
    const heading = monthHeading(event.event_date)
    const last = groups[groups.length - 1]
    if (last?.heading === heading) last.events.push(event)
    else groups.push({ heading, events: [event] })
  }
  return groups
}

export function EventsList({ events, today }: { events: HiveEvent[]; today: string }) {
  const [filter, setFilter] = useState<EventFilter>('all')
  const visible = events.filter((e) => matchesFilter(e.event_date, filter, today))
  const active = FILTERS.find((f) => f.value === filter) ?? FILTERS[0]

  return (
    <>
      <div role="group" aria-label="Filter events" className="mb-8 flex flex-wrap gap-3">
        {FILTERS.map(({ value, label }) => {
          const count = events.filter((e) => matchesFilter(e.event_date, value, today)).length
          const selected = filter === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(value)}
              className={cn(
                'inline-flex h-12 items-center gap-2 rounded-full border-2 px-5 text-base font-semibold transition-colors',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card hover:border-primary',
              )}
            >
              {label}
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-sm',
                  selected ? 'bg-primary-foreground/15' : 'bg-muted text-muted-foreground',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'event' : 'events'} shown: {active.label}
      </p>

      {visible.length === 0 ? (
        <p className="rounded-2xl border bg-card p-6 text-lg">{active.empty}</p>
      ) : (
        <div className="space-y-12">
          {groupByMonth(visible).map((group) => (
            <section key={group.heading} aria-label={group.heading}>
              <h2 className="mb-5 border-b-2 border-primary pb-2 text-2xl font-extrabold">{group.heading}</h2>
              <ul className="grid gap-5">
                {group.events.map((event, i) => (
                  <li key={`${event.event_date}-${event.event_name}-${i}`}>
                    <EventCard event={event} today={today} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  )
}

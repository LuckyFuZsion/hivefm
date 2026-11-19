import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react'
import { calendarUrl } from '@/lib/calendar'
import {
  dateBlock,
  directionsUrl,
  formatEventDate,
  isFree,
  relativeLabel,
  type HiveEvent,
} from '@/lib/events'
import { linkButton } from '@/lib/ui'
import { cn } from '@/lib/utils'

/** Fields are free text (e.g. "TBC", "Free"), so they are shown exactly as supplied. */
export function EventCard({
  event,
  featured = false,
  today,
  className,
}: {
  event: HiveEvent
  featured?: boolean
  /** Today's UK date (YYYY-MM-DD), so "Today" / "This weekend" labels match the page render. */
  today?: string
  className?: string
}) {
  const { weekday, day, month } = dateBlock(event.event_date)
  const label = relativeLabel(event.event_date, today)
  const directions = directionsUrl(event.location)
  const Heading = 'h3' // sits under the page's "Next event" / month headings

  return (
    <article
      className={cn(
        'flex gap-4 rounded-3xl border bg-card p-5 text-card-foreground sm:gap-5 sm:p-6',
        className,
      )}
    >
      <time
        dateTime={event.event_date}
        aria-label={formatEventDate(event.event_date)}
        className={cn(
          'flex shrink-0 flex-col items-center justify-center self-start rounded-2xl bg-primary text-center text-primary-foreground',
          featured ? 'size-20 sm:size-24' : 'size-16 sm:size-20',
        )}
      >
        <span aria-hidden="true" className="text-xs font-bold uppercase tracking-wider">
          {weekday}
        </span>
        <span
          aria-hidden="true"
          className={cn('font-extrabold leading-none', featured ? 'text-4xl sm:text-5xl' : 'text-3xl')}
        >
          {day}
        </span>
        <span aria-hidden="true" className="text-xs font-bold uppercase tracking-wider">
          {month}
        </span>
      </time>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {label && (
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-wide text-background">
              {label}
            </span>
          )}
          {event.cost && (
            <span
              className={cn(
                'rounded-full px-3 py-1 text-sm font-semibold',
                isFree(event.cost)
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-muted text-foreground',
              )}
            >
              <span className="sr-only">Entry: </span>
              {event.cost}
            </span>
          )}
        </div>

        <Heading
          className={cn(
            'mt-2 text-balance font-bold leading-tight',
            featured ? 'text-2xl sm:text-3xl' : 'text-xl',
          )}
        >
          {event.event_name}
        </Heading>

        <dl className="mt-3 grid gap-2 text-base">
          {event.start_time && (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Starts</dt>
              <dd>{event.start_time}</dd>
            </div>
          )}
          {event.location && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Where</dt>
              <dd>{event.location}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex flex-wrap gap-3">
          <a href={calendarUrl(event)} className={linkButton('outline', 'h-11 px-5')}>
            <CalendarPlus className="size-5" aria-hidden="true" />
            Add to calendar
            <span className="sr-only">: {event.event_name} (downloads a calendar file)</span>
          </a>
          {directions && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className={linkButton('outline', 'h-11 px-5')}
            >
              <Navigation className="size-5" aria-hidden="true" />
              Get directions
              <span className="sr-only"> to {event.event_name} (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

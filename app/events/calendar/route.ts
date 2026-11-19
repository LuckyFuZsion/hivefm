import { buildIcs, eventFromParams } from '@/lib/calendar'

/** Downloads a single event as an .ics file, which opens in Apple, Google and Outlook calendars. */
export function GET(request: Request) {
  const event = eventFromParams(new URL(request.url).searchParams)
  if (!event) return new Response('Invalid event', { status: 400 })

  const filename =
    event.event_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 50) || 'event'

  return new Response(buildIcs(event), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

import type { Metadata } from 'next'
import { Headphones } from 'lucide-react'
import { ListenAgainLink } from '@/components/player/listen-again-link'
import { PageHeader } from '@/components/shared/page-header'
import { SafeImage } from '@/components/shared/safe-image'
import { getPresenters, onDemandSlug } from '@/lib/presenters'
import { fetchRecordings, onDemandUrlForShow } from '@/lib/recordings'
import { SITE } from '@/lib/site'
import { formatClock } from '@/lib/time'

export const metadata: Metadata = {
  title: 'Listen Again',
  description: 'Catch up on your favourite Hive FM shows on demand.',
}

/** Rebuild twice a day to pick up new recordings; matches RECORDINGS_REVALIDATE_SECONDS. */
export const revalidate = 43200

const RECENT_DAYS = 3
const MAX_EPISODES = 12

const dayLabel = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

/** Shows from the last few days that have finished and have a Listen Again page, newest first. */
async function getRecentEpisodes() {
  const recordings = (await fetchRecordings()) ?? []
  const now = Date.now()
  const since = now - RECENT_DAYS * 86_400_000
  const recent = recordings
    .filter((r) => Date.parse(r.endUtc) <= now && Date.parse(r.startUtc) >= since)
    .reverse()
  const urls = await Promise.all(recent.map((r) => onDemandUrlForShow(r.showName)))
  return recent
    .flatMap((r, i) => {
      const url = urls[i]
      if (!url) return []
      const start = new Date(r.startUtc)
      return [{ ...r, url, when: `${dayLabel.format(start)}, ${formatClock(start)}` }]
    })
    .slice(0, MAX_EPISODES)
}

export default async function ListenAgainPage() {
  const seen = new Set<string>()
  const presenters = (await getPresenters()).filter((p) => {
    const slug = onDemandSlug(p)
    if (!slug || !p.showTitle || seen.has(slug)) return false
    seen.add(slug)
    return true
  })
  const episodes = await getRecentEpisodes()

  return (
    <>
      <PageHeader title="Listen again" intro="Missed a show? Catch up on demand, whenever suits you." />
      {episodes.length > 0 && (
        <section aria-labelledby="recent-heading" className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
          <h2 id="recent-heading" className="font-heading text-2xl font-bold sm:text-3xl">
            Recent episodes
          </h2>
          <p className="mt-1 text-muted-foreground">From the last {RECENT_DAYS} days, newest first.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((episode) => (
              <li key={episode.startUtc}>
                <ListenAgainLink
                  title={episode.showName}
                  url={episode.url}
                  className="on-dark flex min-h-24 items-center gap-4 rounded-2xl bg-foreground p-3 text-background hover:ring-2 hover:ring-primary"
                >
                  <SafeImage
                    src={episode.image}
                    alt=""
                    className="aspect-square size-16 shrink-0 rounded-xl bg-foreground object-cover ring-1 ring-primary/30"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-primary">{episode.when}</span>
                    <span className="block font-bold text-balance">{episode.showName}</span>
                  </span>
                  <Headphones className="size-5 shrink-0 text-primary" aria-hidden="true" />
                </ListenAgainLink>
              </li>
            ))}
          </ul>
        </section>
      )}
      {episodes.length > 0 && (
        <h2 className="mx-auto max-w-5xl px-4 pt-12 font-heading text-2xl font-bold sm:px-6 sm:text-3xl">All shows</h2>
      )}
      <ul className={`mx-auto grid max-w-5xl gap-4 px-4 pb-12 sm:grid-cols-2 sm:px-6 ${episodes.length > 0 ? 'pt-6' : 'pt-12'}`}>
        {presenters.map((presenter) => (
          <li key={presenter.slug}>
            <ListenAgainLink
              title={presenter.showTitle!}
              url={`${SITE.onDemandBase}${onDemandSlug(presenter)}`}
              className="flex min-h-24 items-center gap-4 rounded-2xl border bg-card p-3 hover:border-foreground"
            >
              <SafeImage
                src={presenter.image}
                alt={`Photo of ${presenter.name}`}
                className={`aspect-square size-20 shrink-0 rounded-xl border bg-muted sm:size-24 ${presenter.imageFit === 'contain' ? 'object-contain p-1.5' : 'object-cover'}`}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold">{presenter.showTitle}</span>
                <span className="block text-muted-foreground">with {presenter.name}</span>
              </span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Headphones className="size-5" aria-hidden="true" />
              </span>
            </ListenAgainLink>
          </li>
        ))}
      </ul>
      <p className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        Having trouble? You can also find every show on{' '}
        <a
          href={SITE.aiirOnDemand}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-4"
        >
          Hive FM&apos;s Listen Again site
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </p>
    </>
  )
}

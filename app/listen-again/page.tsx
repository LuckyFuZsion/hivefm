import type { Metadata } from 'next'
import { Headphones } from 'lucide-react'
import { ListenAgainLink } from '@/components/player/listen-again-link'
import { PageHeader } from '@/components/shared/page-header'
import { SafeImage } from '@/components/shared/safe-image'
import { getPresenters, onDemandSlug } from '@/lib/presenters'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Listen Again',
  description: 'Catch up on your favourite Hive FM shows on demand.',
}

export default async function ListenAgainPage() {
  const seen = new Set<string>()
  const presenters = (await getPresenters()).filter((p) => {
    const slug = onDemandSlug(p)
    if (!slug || !p.showTitle || seen.has(slug)) return false
    seen.add(slug)
    return true
  })
  return (
    <>
      <PageHeader title="Listen again" intro="Missed a show? Catch up on demand, whenever suits you." />
      <ul className="mx-auto grid max-w-5xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6">
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

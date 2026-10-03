import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Headphones } from 'lucide-react'
import { ListenAgainLink } from '@/components/player/listen-again-link'
import { PresenterAvatar } from '@/components/presenters/presenter-avatar'
import { getPresenter, onDemandSlug, presenters } from '@/lib/presenters'
import { SITE } from '@/lib/site'
import { linkButton } from '@/lib/ui'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return presenters.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const presenter = getPresenter(slug)
  if (!presenter) return {}
  return { title: presenter.name, description: presenter.shortBio }
}

export default async function PresenterPage({ params }: PageProps) {
  const { slug } = await params
  const presenter = getPresenter(slug)
  if (!presenter) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/presenters" className="inline-flex min-h-11 items-center gap-2 font-semibold hover:underline">
        <ArrowLeft className="size-5" aria-hidden="true" />
        All presenters
      </Link>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        <PresenterAvatar name={presenter.name} image={presenter.image} fit={presenter.imageFit} className="size-64 max-w-full shrink-0 sm:size-72" />
        <div>
          <h1 className="text-4xl font-extrabold">{presenter.name}</h1>
          {presenter.showTitle && <p className="mt-2 text-xl font-semibold">{presenter.showTitle}</p>}
          {presenter.slotLabel && <p className="mt-1 text-muted-foreground">{presenter.slotLabel}</p>}
          <div className="mt-6 space-y-4 text-lg leading-relaxed">
            {presenter.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {onDemandSlug(presenter) && (
            <ListenAgainLink
              title={presenter.showTitle ?? presenter.name}
              url={`${SITE.onDemandBase}${onDemandSlug(presenter)}`}
              className={linkButton('default', 'mt-8')}
            >
              <Headphones className="size-5" aria-hidden="true" />
              Listen again
            </ListenAgainLink>
          )}
        </div>
      </div>
    </div>
  )
}

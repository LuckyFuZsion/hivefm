import Link from 'next/link'
import { PresenterAvatar } from '@/components/presenters/presenter-avatar'
import type { Presenter } from '@/lib/presenters'

export function PresenterCard({ presenter }: { presenter: Presenter }) {
  return (
    <Link
      href={`/presenters/${presenter.slug}`}
      className="group flex h-full flex-col items-center rounded-2xl border bg-card p-2.5 text-center sm:rounded-3xl sm:p-4 transition-shadow hover:shadow-lg"
    >
      <PresenterAvatar name={presenter.name} image={presenter.image} fit={presenter.imageFit} className="w-full" />
      <h3 className="mt-3 text-base font-bold leading-tight group-hover:underline sm:mt-4 sm:text-xl">{presenter.name}</h3>
      {presenter.showName && <p className="mt-1 text-sm font-semibold leading-tight sm:text-base">{presenter.showName}</p>}
      {presenter.slotLabel && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{presenter.slotLabel}</p>}
    </Link>
  )
}

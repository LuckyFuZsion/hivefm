import type { Metadata } from 'next'
import { PresenterCard } from '@/components/presenters/presenter-card'
import { PageHeader } from '@/components/shared/page-header'
import { TeamSection } from '@/components/presenters/team-section'
import { getPresenters } from '@/lib/presenters'

export const metadata: Metadata = {
  title: 'Presenters',
  description: 'Meet the volunteer presenters behind Hive FM 97.2 in Grantham.',
}

export default async function PresentersPage() {
  const presenters = await getPresenters()
  return (
    <>
      <PageHeader title="Our presenters" intro="The friendly local voices who bring Hive FM to life." />
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-12 sm:gap-5 sm:px-6 lg:grid-cols-4">
        {presenters.map((presenter) => (
          <li key={presenter.slug}>
            <PresenterCard presenter={presenter} />
          </li>
        ))}
      </ul>

      <TeamSection className="bg-muted" />
    </>
  )
}

import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { SITE } from '@/lib/site'
import { linkButton } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Advertise',
  description: 'Promote your business to local listeners on Hive FM 97.2 in Grantham.',
}

const benefits = [
  'Reach a loyal local audience across Grantham and the surrounding area',
  'Affordable packages for small businesses and community groups',
  'Help us stay on air: Hive FM is run by a registered charity',
]

export default function AdvertisePage() {
  return (
    <>
      <PageHeader title="Advertise with Hive FM" intro="Put your business in front of local listeners while supporting your community." />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ul className="space-y-4 text-lg leading-relaxed">
          {benefits.map((benefit) => (
            <li key={benefit} className="rounded-2xl border bg-card p-5">
              {benefit}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-lg leading-relaxed">
          Get in touch for our rate card and to talk through what would work for you.
        </p>
        <a href={`mailto:${SITE.advertisingEmail}`} className={linkButton('default', 'mt-6')}>
          <Mail className="size-5" aria-hidden="true" />
          {SITE.advertisingEmail}
        </a>
      </div>
    </>
  )
}

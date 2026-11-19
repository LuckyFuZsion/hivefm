import type { Metadata } from 'next'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { SITE } from '@/lib/site'
import { linkButton } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Advertise',
  description: 'Promote your business to local listeners on Hive FM 97.2 in Grantham.',
}

/** Order matters: the "Affordable packages" card is the middle one. */
const benefits = [
  {
    title: 'Reach a loyal local audience',
    text: 'Across Grantham and the surrounding areas.',
    src: '/advertise/hive-fm-radio-advertising-grantham-local-audience.webp',
    alt: 'The Hive FM bee mascot broadcasting from the studio, with golden sound waves carrying across Grantham to local listeners.',
  },
  {
    title: 'Affordable packages',
    text: 'For small businesses and community groups.',
    src: '/advertise/hive-fm-affordable-advertising-packages-small-businesses.webp',
    alt: 'The Hive FM bee mascot chatting with a shop owner and a community volunteer in the studio about radio advertising packages.',
  },
  {
    title: 'Help us stay on air',
    text: 'Hive FM is run by a registered charity.',
    src: '/advertise/hive-fm-charity-radio-grantham-help-stay-on-air.webp',
    alt: 'The Hive FM bee mascot holding a heart-covered donation jar in the studio, with volunteers and honey jars behind.',
  },
]

export default function AdvertisePage() {
  return (
    <>
      <PageHeader title="Advertise with Hive FM" intro="Put your business in front of local listeners while supporting your community." />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <li key={benefit.src} className="overflow-hidden rounded-3xl border bg-card shadow-lg">
              <Image
                src={benefit.src}
                alt={benefit.alt}
                width={1200}
                height={896}
                sizes="(min-width: 1152px) 360px, (min-width: 768px) 30vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-balance">{benefit.title}</h2>
                <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{benefit.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-lg leading-relaxed">
            Get in touch for our rate card and to talk through what would work for you.
          </p>
          <a href={`mailto:${SITE.advertisingEmail}`} className={linkButton('default', 'mt-6')}>
            <Mail className="size-5" aria-hidden="true" />
            {SITE.advertisingEmail}
          </a>
        </div>
      </div>
    </>
  )
}

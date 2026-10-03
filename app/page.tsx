import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Megaphone, Mic2, Smartphone } from 'lucide-react'
import { OnAirCard } from '@/components/now-playing/on-air-card'
import { RecentlyPlayed } from '@/components/now-playing/recently-played'
import { ListenLiveButton } from '@/components/player/listen-live-button'
import { PresenterGrid } from '@/components/presenters/presenter-grid'
import { TeamSection } from '@/components/presenters/team-section'
import { getPresenters } from '@/lib/presenters'
import { SITE } from '@/lib/site'
import { linkButton } from '@/lib/ui'

export default async function HomePage() {
  const presenters = await getPresenters()

  return (
    <>
      <section className="on-dark honeycomb bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                {SITE.frequency} · {SITE.town}, {SITE.county}
              </p>
              <h1 className="mt-3 text-5xl font-extrabold leading-tight text-balance sm:text-6xl xl:text-7xl">
  Welcome to <span className="text-primary">Hive FM</span>
  </h1>
  <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty">
  Welcome to the home of 97.2 Hive FM. Broadcasting 24 hours a day, 7 days a week, from the
  BHive Community Centre in Grantham, Lincolnshire. We aim to bring you up to date with the
  latest news and events going on in the town and the surrounding areas.
  </p>
  <p className="mt-4 max-w-xl text-lg leading-relaxed text-pretty">
  Along with great music, speciality shows every evening and weekends, we&apos;re sure there&apos;ll
  be something for everyone.
  </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ListenLiveButton size="large" />
                <Link href="/schedule" className={linkButton('outline', 'h-16 border-2 border-background bg-transparent px-8 text-lg text-background hover:bg-background hover:text-foreground')}>
                  See the schedule
                </Link>
              </div>
            </div>
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <Image
                src="/images/bee-mascot.png"
                alt="Hive FM mascot: a cheerful bee wearing headphones and holding a honey dipper"
                width={960}
                height={1050}
                priority
                sizes="(min-width: 1024px) 560px, 80vw"
                className="h-auto w-full max-w-sm drop-shadow-2xl sm:max-w-md lg:max-w-[34rem]"
              />
            </div>
          </div>
          <div className="mt-12 lg:mt-16">
            <OnAirCard />
          </div>
        </div>
      </section>

      <RecentlyPlayed />

      <section aria-labelledby="presenters-heading" className="bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="presenters-heading" className="text-2xl font-bold sm:text-3xl">
              Meet your presenters
            </h2>
            <Link href="/presenters" className={linkButton('outline')}>
              All presenters <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
          <PresenterGrid presenters={presenters} initialCount={8} />
        </div>
      </section>

      <TeamSection />

      <section aria-labelledby="more-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 id="more-heading" className="sr-only">
          More from Hive FM
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          <li className="rounded-3xl bg-primary p-7 text-primary-foreground">
            <Mic2 className="size-9" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold">Get involved</h3>
            <p className="mt-2 leading-relaxed">
              Volunteer, present your own show or help behind the scenes. No experience needed.
            </p>
            <Link href="/get-involved" className={linkButton('default', 'mt-5 bg-foreground text-background hover:bg-foreground/85')}>
              Join the hive
            </Link>
          </li>
          <li className="rounded-3xl border bg-card p-7">
            <Megaphone className="size-9" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold">Advertise with us</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Reach local listeners and support a registered charity at the same time.
            </p>
            <Link href="/advertise" className={linkButton('outline', 'mt-5')}>
              Advertising info
            </Link>
          </li>
          <li className="rounded-3xl border bg-card p-7">
            <Smartphone className="size-9" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold">Take us with you</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Listen on the go with the free Hive FM app for Android and iPhone.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={SITE.googlePlay} target="_blank" rel="noopener noreferrer" className={linkButton('outline')}>
                Google Play<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={SITE.appStore} target="_blank" rel="noopener noreferrer" className={linkButton('outline')}>
                App Store<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </li>
        </ul>
      </section>
    </>
  )
}

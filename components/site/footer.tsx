import Link from 'next/link'
import { Users, Mail, Phone } from 'lucide-react'
import { NAV_LINKS, SITE } from '@/lib/site'

export function Footer() {
  return (
    <footer className="on-dark bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SITE.logo} alt="97.2 Hive FM" className="h-20 w-auto" />
          <p className="mt-4 text-base text-balance">{SITE.tagline}</p>
          <p className="mt-4 text-sm opacity-90">
            A project of{' '}
            <a
              href={SITE.blindSociety}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-4"
            >
              South Lincolnshire Blind Society
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-heading text-lg font-bold text-primary">Quick links</h2>
          <ul className="mt-4 flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-11 items-center hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-heading text-lg font-bold text-primary">Contact</h2>
          <div className="mt-4 space-y-5 text-base">
            <div>
              <p className="font-semibold">Studio</p>
              <a href={`tel:${SITE.studioPhoneIntl}`} className="flex min-h-11 items-center gap-2 hover:underline">
                <Phone className="size-4" aria-hidden="true" />
                {SITE.studioPhone}
              </a>
              <a href={`mailto:${SITE.studioEmail}`} className="flex min-h-11 items-center gap-2 hover:underline">
                <Mail className="size-4" aria-hidden="true" />
                {SITE.studioEmail}
              </a>
            </div>
            <div>
              <p className="font-semibold">Office</p>
              <a href="tel:+441476347345" className="flex min-h-11 items-center gap-2 hover:underline">
                <Phone className="size-4" aria-hidden="true" />
                {SITE.officePhone}
              </a>
              <a href={`mailto:${SITE.officeEmail}`} className="flex min-h-11 items-center gap-2 hover:underline">
                <Mail className="size-4" aria-hidden="true" />
                {SITE.officeEmail}
              </a>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-lg font-bold text-primary">Other ways to listen</h2>
          <p className="mt-2 text-sm opacity-90">Our player not working for you? Try these.</p>
          <a
            href={SITE.aiirPlayer}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-background px-4 font-semibold hover:bg-background hover:text-foreground"
          >
            Hive FM web player
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <h2 className="mt-8 font-heading text-lg font-bold text-primary">Follow and download</h2>
          <a
            href={SITE.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 hover:underline"
          >
            <Users className="size-5" aria-hidden="true" />
            Hive FM on Facebook
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={SITE.googlePlay}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-background px-4 font-semibold hover:bg-background hover:text-foreground"
            >
              Get it on Google Play
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={SITE.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-background px-4 font-semibold hover:bg-background hover:text-foreground"
            >
              Download on the App Store
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-background/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm sm:px-6 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} Hive FM, a project of South Lincolnshire Blind Society.
            Registered Charity No. {SITE.charityNumber}.
          </p>
          <p>
            Website by{' '}
            <a
              href="https://webfuzsion.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              WebFuZsion
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

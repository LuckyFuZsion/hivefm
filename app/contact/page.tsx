import type { Metadata } from 'next'
import { Users, Mail, MapPin, Phone } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Hive FM studio and office in Grantham.',
}

const row = 'flex min-h-12 items-center gap-3 text-lg hover:underline'

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact us" intro="Request a song, send a message or find out more. We would love to hear from you." />
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2">
        <section aria-labelledby="studio-heading" className="rounded-3xl border bg-card p-6">
          <h2 id="studio-heading" className="text-xl font-bold">Studio</h2>
          <p className="mt-1 text-muted-foreground">Requests and live show messages</p>
          <a href={`tel:${SITE.studioPhoneIntl}`} className={row}>
            <Phone className="size-5" aria-hidden="true" />{SITE.studioPhone}
          </a>
          <a href={`mailto:${SITE.studioEmail}`} className={row}>
            <Mail className="size-5" aria-hidden="true" />{SITE.studioEmail}
          </a>
          <a href={`https://wa.me/${SITE.studioPhoneIntl.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className={row}>
            <Phone className="size-5" aria-hidden="true" />WhatsApp the studio
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </section>
        <section aria-labelledby="office-heading" className="rounded-3xl border bg-card p-6">
          <h2 id="office-heading" className="text-xl font-bold">Office</h2>
          <p className="mt-1 text-muted-foreground">General enquiries</p>
          <a href="tel:+441476347345" className={row}>
            <Phone className="size-5" aria-hidden="true" />{SITE.officePhone}
          </a>
          <a href={`mailto:${SITE.officeEmail}`} className={row}>
            <Mail className="size-5" aria-hidden="true" />{SITE.officeEmail}
          </a>
          <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className={row}>
            <Users className="size-5" aria-hidden="true" />Hive FM on Facebook
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </section>
        <section aria-labelledby="find-heading" className="rounded-3xl bg-foreground p-6 text-background md:col-span-2">
          <h2 id="find-heading" className="text-xl font-bold text-primary">Find us</h2>
          <p className="mt-2 flex items-center gap-3 text-lg">
            <MapPin className="size-5 shrink-0" aria-hidden="true" />
            {SITE.venue}, {SITE.town}, {SITE.county}
          </p>
        </section>
      </div>
    </>
  )
}

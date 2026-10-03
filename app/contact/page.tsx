import type { Metadata } from 'next'
import { Users, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'
import { PageHeader } from '@/components/shared/page-header'
import { SITE } from '@/lib/site'
import { linkButton } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Hive FM studio and office in Grantham.',
}

const row = 'flex min-h-12 items-center gap-3 text-lg hover:underline'

const mapQuery = encodeURIComponent(`${SITE.venue}, ${SITE.street}, ${SITE.town} ${SITE.postcode}`)
const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`

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
        <section aria-labelledby="form-heading" className="rounded-3xl border bg-card p-6 sm:p-8 md:col-span-2">
          <h2 id="form-heading" className="text-xl font-bold">Send us a message</h2>
          <p className="mt-1 mb-6 text-muted-foreground">
            We read every message. Song requests go straight to the studio.
          </p>
          <ContactForm />
        </section>
        <section
          aria-labelledby="find-heading"
          className="on-dark grid overflow-hidden rounded-3xl bg-foreground text-background md:col-span-2 md:grid-cols-[2fr_3fr]"
        >
          <div className="p-6 sm:p-8">
            <h2 id="find-heading" className="text-xl font-bold text-primary">Find us</h2>
            <address className="mt-3 flex gap-3 text-lg not-italic">
              <MapPin className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {SITE.venue}
                <br />
                {SITE.street}
                <br />
                {SITE.town}, {SITE.county}
                <br />
                {SITE.postcode}
              </span>
            </address>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkButton('default', 'mt-6')}
            >
              <Navigation className="size-5" aria-hidden="true" />
              Get directions
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <iframe
            src={mapEmbedUrl}
            title={`Map showing ${SITE.venue}, ${SITE.street}, ${SITE.town}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full border-0 md:h-full md:min-h-80"
          />
        </section>
      </div>
    </>
  )
}

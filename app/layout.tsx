import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Montserrat, Poppins } from 'next/font/google'
import { OnDemandPanel } from '@/components/player/on-demand-panel'
import { PlayerBar } from '@/components/player/player-bar'
import { PlayerProvider } from '@/components/player/player-provider'
import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { SITE } from '@/lib/site'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
})

const DESCRIPTION =
  "Hive FM 97.2 is Grantham's community radio station, broadcasting from the BHive. Listen live, browse the schedule, meet our presenters and catch up on shows."

const radioStationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RadioStation',
  name: SITE.name,
  alternateName: SITE.shortName,
  slogan: 'Bringing Grantham Together',
  description: DESCRIPTION,
  url: SITE.url,
  logo: new URL(SITE.badge, SITE.url).toString(),
  image: new URL(SITE.badge, SITE.url).toString(),
  telephone: SITE.officePhone,
  email: SITE.officeEmail,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${SITE.venue}, ${SITE.street}`,
    addressLocality: SITE.town,
    addressRegion: SITE.county,
    postalCode: SITE.postcode,
    addressCountry: 'GB',
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  areaServed: { '@type': 'City', name: SITE.town },
  sameAs: [SITE.facebook, SITE.googlePlay, SITE.appStore],
  parentOrganization: {
    '@type': 'NGO',
    name: 'South Lincolnshire Blind Society',
    url: SITE.blindSociety,
  },
  potentialAction: {
    '@type': 'ListenAction',
    target: { '@type': 'EntryPoint', urlTemplate: SITE.url, actionPlatform: 'https://schema.org/DesktopWebPlatform' },
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Bringing Grantham Together`,
    template: `%s | ${SITE.name}`,
  },
  description: DESCRIPTION,
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: SITE.name,
    title: `${SITE.name} | Bringing Grantham Together`,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | Bringing Grantham Together`,
    description: DESCRIPTION,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f5b800',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" className={`${montserrat.variable} ${poppins.variable} bg-background`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(radioStationJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-6 focus:py-3 focus:font-semibold focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <PlayerProvider>
          <Header />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <div className="pb-[calc(76px+env(safe-area-inset-bottom))]">
            <Footer />
          </div>
          <OnDemandPanel />
          <PlayerBar />
        </PlayerProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

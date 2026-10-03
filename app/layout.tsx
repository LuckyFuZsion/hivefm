import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Montserrat, Poppins } from 'next/font/google'
import { NowPlayingProvider } from '@/components/now-playing/now-playing-provider'
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Bringing Grantham Together`,
    template: `%s | ${SITE.name}`,
  },
  description:
    'Hive FM 97.2 is Grantham\'s community radio station, broadcasting from the BHive. Listen live, browse the schedule, meet our presenters and catch up on shows.',
  generator: 'v0.app',
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-6 focus:py-3 focus:font-semibold focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <NowPlayingProvider>
          <PlayerProvider>
            <Header />
            <main id="main" className="min-h-[60vh]">
              {children}
            </main>
            <div className="pb-24">
              <Footer />
            </div>
            <PlayerBar />
          </PlayerProvider>
        </NowPlayingProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

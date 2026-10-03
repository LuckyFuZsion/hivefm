export const SITE = {
  name: '97.2 Hive FM',
  shortName: 'Hive FM',
  tagline: 'Hive FM – Bringing Grantham Together',
  url: 'https://hivefm.org',
  frequency: '97.2 FM',
  charityNumber: '1182486',
  venue: 'BHive Community Centre',
  street: '11a Finkin Street',
  town: 'Grantham',
  county: 'Lincolnshire',
  postcode: 'NG31 6QZ',
  geo: { lat: 52.912581, lng: -0.641009 },
  studioPhone: '01476 347344',
  studioPhoneIntl: '+441476347344',
  officePhone: '01476 347345',
  studioEmail: 'studio@hivefm.org',
  officeEmail: 'admin@hivefm.org',
  advertisingEmail: 'advertising@hivefm.org',
  facebook: 'https://www.facebook.com/people/Hive-FM/61552051163627/',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.hivefm.player',
  appStore: 'https://apps.apple.com/us/app/hive-fm/id6742198007',
  blindSociety: 'https://www.blind-society.org.uk/',
  logo: '/hive-fm-logo.png',
  /** Square bee badge for small spaces where the full logo would be too small to read */
  badge: '/images/hive-fm-badge.png',
  onDemandBase: 'https://player.aiir.com/hive-fm/on-demand/',
} as const

export const STREAM = {
  mp3: 'https://stream.aiir.com/oukspr99eiptv',
  hls: 'https://stream.aiir.com/hls/oukspr99eiptv',
  socket: 'wss://metadata.aiir.net/now-playing',
  serviceId: '5725',
} as const

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/presenters', label: 'Presenters' },
  { href: '/listen-again', label: 'Listen Again' },
  { href: '/advertise', label: 'Advertise' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
] as const

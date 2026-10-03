import type { MetadataRoute } from 'next'
import { presenters } from '@/lib/presenters'
import { NAV_LINKS, SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = NAV_LINKS.map((link) => ({
    url: new URL(link.href, SITE.url).toString(),
    changeFrequency: link.href === '/' || link.href === '/schedule' ? 'daily' : 'weekly',
    priority: link.href === '/' ? 1 : 0.8,
  }))

  const presenterPages: MetadataRoute.Sitemap = presenters.map((p) => ({
    url: new URL(`/presenters/${p.slug}`, SITE.url).toString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...pages, ...presenterPages]
}

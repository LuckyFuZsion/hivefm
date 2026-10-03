'use client'

import { useState } from 'react'
import { SITE } from '@/lib/site'

interface SafeImageProps {
  src?: string
  alt: string
  className?: string
  fallback?: string
}

/** Image that falls back to the Hive FM badge if the source fails or is empty. */
export function SafeImage({ src, alt, className, fallback = SITE.badge }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const resolved = src && src !== failedSrc ? src : fallback
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailedSrc(src ?? null)}
    />
  )
}

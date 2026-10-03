'use client'

import { usePlayer } from '@/components/player/player-provider'

interface ListenAgainLinkProps {
  title: string
  url: string
  className?: string
  children: React.ReactNode
}

export function ListenAgainLink({ title, url, className, children }: ListenAgainLinkProps) {
  const { openOnDemand } = usePlayer()

  return (
    <a
      href={url}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        openOnDemand({ title, url })
      }}
      className={className}
    >
      {children}
    </a>
  )
}

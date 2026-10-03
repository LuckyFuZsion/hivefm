'use client'

import { Loader2, Play, Square } from 'lucide-react'
import { usePlayer } from '@/components/player/player-provider'
import { cn } from '@/lib/utils'

interface ListenLiveButtonProps {
  className?: string
  size?: 'default' | 'large'
}

export function ListenLiveButton({ className, size = 'default' }: ListenLiveButtonProps) {
  const { status, toggle } = usePlayer()
  const isActive = status === 'playing' || status === 'loading'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isActive ? 'Stop Hive FM live stream' : 'Listen live to Hive FM'}
      className={cn(
        'inline-flex items-center justify-center gap-3 rounded-full bg-primary font-heading font-semibold text-primary-foreground transition-transform hover:scale-[1.03] focus-visible:outline-foreground',
        size === 'large' ? 'h-16 px-10 text-xl' : 'h-12 px-6 text-base',
        className,
      )}
    >
      {status === 'loading' ? (
        <Loader2 className="size-6 animate-spin" aria-hidden="true" />
      ) : isActive ? (
        <Square className="size-5 fill-current" aria-hidden="true" />
      ) : (
        <Play className="size-6 fill-current" aria-hidden="true" />
      )}
      {isActive ? 'Stop' : 'Listen Live'}
    </button>
  )
}

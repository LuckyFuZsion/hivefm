'use client'

import { Play } from 'lucide-react'
import { usePlayer } from '@/components/player/player-provider'
import { cn } from '@/lib/utils'

interface ListenLiveButtonProps {
  className?: string
  size?: 'default' | 'large'
  /** Runs before pointing at the player, e.g. to close a menu that would cover it */
  onPress?: () => void
}

/** The live player is Aiir's own play bar, so this points listeners to it rather than starting audio itself. */
export function ListenLiveButton({ className, size = 'default', onPress }: ListenLiveButtonProps) {
  const { promptLive } = usePlayer()

  return (
    <button
      type="button"
      onClick={() => {
        onPress?.()
        promptLive()
      }}
      aria-label="Listen live to Hive FM: go to the player at the bottom of the screen"
      className={cn(
        'inline-flex items-center justify-center gap-3 rounded-full bg-primary font-heading font-semibold text-primary-foreground transition-transform hover:scale-[1.03] focus-visible:outline-foreground',
        size === 'large' ? 'h-16 px-10 text-xl' : 'h-12 px-6 text-base',
        className,
      )}
    >
      <Play className="size-6 fill-current" aria-hidden="true" />
      Listen Live
    </button>
  )
}

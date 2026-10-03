'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { PresenterCard } from '@/components/presenters/presenter-card'
import type { Presenter } from '@/lib/presenters'
import { linkButton } from '@/lib/ui'

interface PresenterGridProps {
  presenters: Presenter[]
  /** How many presenters show before "Show more" is pressed. */
  initialCount?: number
}

/** Presenter cards with the first few visible and the rest behind a "Show more" button. */
export function PresenterGrid({ presenters, initialCount = 8 }: PresenterGridProps) {
  const [expanded, setExpanded] = useState(false)
  const hiddenCount = Math.max(presenters.length - initialCount, 0)

  return (
    <>
      <ul id="home-presenters" className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {presenters.map((presenter, index) => (
          <li key={presenter.slug} className={index >= initialCount && !expanded ? 'hidden' : undefined}>
            <PresenterCard presenter={presenter} />
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls="home-presenters"
            className={linkButton('outline')}
          >
            {expanded ? 'Show fewer presenters' : `Show ${hiddenCount} more presenters`}
            {expanded ? (
              <ChevronUp className="size-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </>
  )
}

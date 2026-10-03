'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SafeImage } from '@/components/shared/safe-image'
import { findCurrentSlot, slotsForDay, type ScheduleSlot } from '@/lib/schedule'
import { DAY_NAMES, DAY_SHORT, formatSlotRange, londonNow } from '@/lib/time'
import { useNow } from '@/lib/use-now'
import { cn } from '@/lib/utils'

export function ScheduleView({ slots }: { slots: ScheduleSlot[] }) {
  const now = useNow(60_000)
  const today = now ? londonNow(now) : null
  const [selected, setSelected] = useState<number | null>(null)
  const day = selected ?? today?.dayIndex ?? 0
  const daySlots = slotsForDay(slots, day)
  const current = today ? findCurrentSlot(slots, today.dayIndex, today.minutes) : undefined

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div role="tablist" aria-label="Day of the week" className="flex flex-wrap gap-2">
        {DAY_NAMES.map((name, index) => (
          <button
            key={name}
            type="button"
            role="tab"
            id={`tab-${index}`}
            aria-selected={day === index}
            aria-controls="schedule-panel"
            onClick={() => setSelected(index)}
            className={cn(
              'min-h-12 rounded-full border-2 px-5 text-base font-semibold',
              day === index
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card hover:border-foreground',
            )}
          >
            <span aria-hidden="true" className="sm:hidden">{DAY_SHORT[index]}</span>
            <span className="sr-only sm:not-sr-only">{name}</span>
          </button>
        ))}
      </div>

      <ol
        id="schedule-panel"
        role="tabpanel"
        aria-labelledby={`tab-${day}`}
        className="mt-8 flex flex-col gap-3"
      >
        {daySlots.map((slot) => {
          const onAir = today?.dayIndex === day && current === slot
          return (
            <li
              key={`${slot.day}-${slot.start}`}
              className={cn(
                'flex items-center gap-4 rounded-2xl border p-4',
                onAir ? 'border-primary bg-secondary' : 'bg-card',
              )}
            >
              <SafeImage src={slot.image} alt="" className="size-16 shrink-0 rounded-xl bg-muted object-contain" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  {formatSlotRange(slot.start, slot.end)}
                </p>
                <p className="text-lg font-bold text-balance">
                  {slot.presenterSlug ? (
                    <Link href={`/presenters/${slot.presenterSlug}`} className="hover:underline">
                      {slot.showName}
                    </Link>
                  ) : (
                    slot.showName
                  )}
                </p>
              </div>
              {onAir && (
                <span className="shrink-0 rounded-full bg-foreground px-3 py-1 text-sm font-bold text-background">
                  On air now
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-6 text-sm text-muted-foreground">All times are UK time.</p>
    </div>
  )
}

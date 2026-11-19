'use client'

import { toMinutes } from '@/lib/time'
import { londonNow } from '@/lib/time'
import { useNow } from '@/lib/use-now'

/** Progress through a show, from its start and end as HH:MM UK times. */
export function ShowProgress({ start, end }: { start: string; end: string }) {
  const now = useNow(30_000)
  if (!now) return <div className="h-2 rounded-full bg-border" aria-hidden="true" />

  const s = toMinutes(start)
  const e = toMinutes(end)
  const m = londonNow(now).minutes
  const pct = e > s ? Math.min(100, Math.max(0, ((m - s) / (e - s)) * 100)) : 0

  return (
    <div
      role="progressbar"
      aria-label="Progress through the current show"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="h-2 overflow-hidden rounded-full bg-border"
    >
      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  )
}

import type { Metadata } from 'next'
import { ScheduleView } from '@/components/schedule/schedule-view'
import { PageHeader } from '@/components/shared/page-header'
import { getSchedule } from '@/lib/schedule-live'

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'See what is on Hive FM 97.2 today and every day this week.',
}

/** Rebuild twice a day to follow Aiir's recordings feed; matches RECORDINGS_REVALIDATE_SECONDS. */
export const revalidate = 43200

export default async function SchedulePage() {
  const slots = await getSchedule()
  return (
    <>
      <PageHeader title="Schedule" intro="Find out what is on air, today and every day of the week." />
      <ScheduleView slots={slots} />
    </>
  )
}

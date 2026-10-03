import type { Metadata } from 'next'
import { ScheduleView } from '@/components/schedule/schedule-view'
import { PageHeader } from '@/components/shared/page-header'
import { getSchedule } from '@/lib/schedule-live'

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'See what is on Hive FM 97.2 today and every day this week.',
}

/** Rebuild the page every 6 hours so it keeps following Aiir's live schedule. */
export const revalidate = 21600

export default async function SchedulePage() {
  const slots = await getSchedule()
  return (
    <>
      <PageHeader title="Schedule" intro="Find out what is on air, today and every day of the week." />
      <ScheduleView slots={slots} />
    </>
  )
}

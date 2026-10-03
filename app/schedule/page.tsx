import type { Metadata } from 'next'
import { ScheduleView } from '@/components/schedule/schedule-view'
import { PageHeader } from '@/components/shared/page-header'
import { getSchedule } from '@/lib/schedule'

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'See what is on Hive FM 97.2 today and every day this week.',
}

export default async function SchedulePage() {
  const slots = await getSchedule()
  return (
    <>
      <PageHeader title="Schedule" intro="Find out what is on air, today and every day of the week." />
      <ScheduleView slots={slots} />
    </>
  )
}

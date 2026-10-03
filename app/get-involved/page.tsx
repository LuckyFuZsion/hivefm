import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { SITE } from '@/lib/site'
import { linkButton } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Volunteer at Hive FM: present a show, help behind the scenes or join our team.',
}

const roles = [
  { title: 'Present a show', text: 'Share your music and your stories with the town. We will train you.' },
  { title: 'Production and tech', text: 'Help with recording, editing and keeping the studio running.' },
  { title: 'Community reporting', text: 'Bring local news, events and voices to the airwaves.' },
  { title: 'Fundraising and events', text: 'Help us raise the funds that keep Hive FM on air.' },
]

export default function GetInvolvedPage() {
  return (
    <>
      <PageHeader title="Get involved" intro="Hive FM is powered by volunteers. Everyone is welcome, and no experience is needed." />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <ul className="grid gap-5 sm:grid-cols-2">
          {roles.map((role) => (
            <li key={role.title} className="rounded-3xl border bg-card p-6">
              <h2 className="text-xl font-bold">{role.title}</h2>
              <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{role.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-3xl bg-primary p-8 text-primary-foreground">
          <h2 className="text-2xl font-bold">Ready to join the hive?</h2>
          <p className="mt-2 text-lg">Drop the team an email and we will arrange a chat and a studio tour.</p>
          <a href={`mailto:${SITE.officeEmail}`} className={linkButton('default', 'mt-5 bg-foreground text-background hover:bg-foreground/85')}>
            <Mail className="size-5" aria-hidden="true" />
            {SITE.officeEmail}
          </a>
        </div>
      </div>
    </>
  )
}

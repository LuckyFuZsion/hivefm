import { PresenterAvatar } from '@/components/presenters/presenter-avatar'
import { team } from '@/lib/presenters'
import { cn } from '@/lib/utils'

/** "Meet the team": station staff who aren't presenters. Used under the presenters on the home and presenters pages. */
export function TeamSection({ className }: { className?: string }) {
  return (
    <section aria-labelledby="team-heading" className={cn('bg-background', className)}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 id="team-heading" className="text-2xl font-bold sm:text-3xl">
          Meet the team
        </h2>
        <p className="mt-2 text-muted-foreground">The people who keep Hive FM on air behind the scenes.</p>
        <ul className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:gap-6">
          {team.map((member) => (
            <li key={member.name} className="flex flex-col rounded-2xl border bg-card p-2.5 sm:rounded-3xl sm:p-4">
              <PresenterAvatar name={member.name} image={member.image} className="w-full" />
              <h3 className="mt-3 text-base font-bold leading-tight sm:mt-4 sm:text-xl">{member.name}</h3>
              <p className="mt-1 text-sm font-semibold leading-tight sm:text-base">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{member.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

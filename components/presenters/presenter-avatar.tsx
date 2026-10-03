import { SafeImage } from '@/components/shared/safe-image'
import { cn } from '@/lib/utils'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

interface PresenterAvatarProps {
  name: string
  image?: string
  fit?: 'cover' | 'contain'
  className?: string
}

/** Square presenter portrait; shows initials until a photo is supplied. */
export function PresenterAvatar({ name, image, fit = 'cover', className }: PresenterAvatarProps) {
  return (
    <div className={cn('aspect-square overflow-hidden rounded-2xl border bg-muted', className)}>
      {image ? (
        <SafeImage
          src={image}
          alt={`Photo of ${name}`}
          className={cn('size-full', fit === 'contain' ? 'object-contain p-3' : 'object-cover')}
        />
      ) : (
        <div
          role="img"
          aria-label={`Placeholder portrait for ${name}`}
          className="flex size-full items-center justify-center bg-primary font-heading text-3xl font-extrabold text-primary-foreground"
        >
          {initials(name)}
        </div>
      )}
    </div>
  )
}

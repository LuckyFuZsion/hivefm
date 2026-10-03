import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const base = 'h-12 gap-2 rounded-full px-6 text-base font-semibold'

/** Class names for large, accessible link-buttons. */
export function linkButton(variant: 'default' | 'outline' | 'secondary' = 'default', className?: string) {
  return cn(buttonVariants({ variant }), base, variant === 'default' && 'hover:bg-primary/85', className)
}

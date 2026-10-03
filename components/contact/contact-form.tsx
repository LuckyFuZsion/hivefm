'use client'

import { useActionState, useEffect, useRef } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { sendContactMessage } from '@/app/contact/actions'
import { CONTACT_TOPICS, type ContactState } from '@/lib/contact'
import { linkButton } from '@/lib/ui'
import { cn } from '@/lib/utils'

const input =
  'mt-2 block w-full rounded-xl border-2 border-border bg-background px-4 text-lg focus-visible:border-foreground aria-[invalid=true]:border-destructive'

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, { status: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)
  const errors = state.fieldErrors ?? {}

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  const fieldProps = (name: keyof typeof errors) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  const fieldError = (name: keyof typeof errors) =>
    errors[name] && (
      <p id={`${name}-error`} className="mt-1 font-semibold text-destructive">
        {errors[name]}
      </p>
    )

  return (
    <form ref={formRef} action={action} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-semibold">Your name</label>
          <input id="name" name="name" autoComplete="name" required maxLength={100} className={cn(input, 'h-12')} {...fieldProps('name')} />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor="email" className="font-semibold">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} className={cn(input, 'h-12')} {...fieldProps('email')} />
          {fieldError('email')}
        </div>
        <div>
          <label htmlFor="phone" className="font-semibold">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} className={cn(input, 'h-12')} />
        </div>
        <div>
          <label htmlFor="topic" className="font-semibold">What is it about?</label>
          <select id="topic" name="topic" defaultValue="general" className={cn(input, 'h-12')}>
            {Object.entries(CONTACT_TOPICS).map(([value, topic]) => (
              <option key={value} value={value}>{topic.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="font-semibold">Message</label>
        <textarea id="message" name="message" required rows={6} maxLength={5000} className={cn(input, 'py-3')} {...fieldProps('message')} />
        {fieldError('message')}
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={linkButton('default', 'h-14 px-8 text-lg disabled:opacity-70')}>
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
          {pending ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" aria-live="polite" className={cn('text-lg font-semibold', state.status === 'error' && 'text-destructive')}>
          {state.status === 'success' && <CheckCircle2 className="mr-2 inline size-5 text-green-700" aria-hidden="true" />}
          {state.message}
        </p>
      </div>
    </form>
  )
}

import { SITE } from '@/lib/site'

export const CONTACT_TOPICS = {
  request: { label: 'Song request or shout-out', to: SITE.studioEmail },
  general: { label: 'General enquiry', to: SITE.officeEmail },
  advertising: { label: 'Advertising', to: SITE.advertisingEmail },
  volunteering: { label: 'Volunteering or presenting', to: SITE.officeEmail },
} as const

export type ContactTopic = keyof typeof CONTACT_TOPICS

export interface ContactState {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>
}

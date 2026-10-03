'use server'

import { CONTACT_TOPICS, type ContactState, type ContactTopic } from '@/lib/contact'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function field(data: FormData, key: string, max: number): string {
  return String(data.get(key) ?? '').trim().slice(0, max)
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function sendContactMessage(_prev: ContactState, data: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field
  if (field(data, 'website', 200)) return { status: 'success' }

  const name = field(data, 'name', 100)
  const email = field(data, 'email', 200)
  const phone = field(data, 'phone', 30)
  const message = field(data, 'message', 5000)
  const topicKey = field(data, 'topic', 20)
  const topic = Object.hasOwn(CONTACT_TOPICS, topicKey)
    ? CONTACT_TOPICS[topicKey as ContactTopic]
    : CONTACT_TOPICS.general

  const fieldErrors: ContactState['fieldErrors'] = {}
  if (!name) fieldErrors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Please enter a valid email address.'
  if (message.length < 5) fieldErrors.message = 'Please enter a message.'
  if (Object.keys(fieldErrors).length) {
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !from) {
    return {
      status: 'error',
      message: `Sorry, the form isn't available right now. Please email ${topic.to} instead.`,
    }
  }

  const rows = [
    ['Topic', topic.label],
    ['Name', name],
    ['Email', email],
    ['Phone', phone || 'Not given'],
  ]
  const html = `
    <h2>New message from the Hive FM website</h2>
    <table cellpadding="6">${rows
      .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: process.env.CONTACT_TO_EMAIL || topic.to,
        reply_to: email,
        subject: `Website: ${topic.label} from ${name}`,
        html,
        text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`,
      }),
    })
    if (!res.ok) throw new Error(`Resend responded ${res.status}`)
  } catch (error) {
    console.error('Contact form send failed', error)
    return {
      status: 'error',
      message: `Sorry, your message couldn't be sent. Please try again or email ${topic.to}.`,
    }
  }

  return { status: 'success', message: "Thanks, your message has been sent. We'll be in touch soon." }
}

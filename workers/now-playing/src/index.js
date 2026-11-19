/**
 * Hive FM now-playing Worker.
 *
 *   GET|POST /push?token=SECRET   Play Out One control room calls this on each track change
 *   GET      /now-playing         Public JSON for the website (CORS-restricted, cached)
 *   GET      /debug?token=SECRET  Shows the last raw payload received (to map field names)
 *
 * State is one KV key, so each track change costs a single KV write.
 */

const KEY = 'state'
const HISTORY_LENGTH = 10
const READ_CACHE_MS = 10_000

// Field aliases, so we can accept whatever Play Out One sends without code changes.
const ALIASES = {
  title: ['title', 'song', 'track', 'trackTitle', 'name', 'songTitle'],
  artist: ['artist', 'artists', 'performer', 'trackArtist', 'songArtist'],
  album: ['album', 'albumTitle'],
  artwork: ['artwork', 'image', 'imageUrl', 'cover', 'coverArt', 'albumArt', 'art', 'picture'],
  duration: ['duration', 'length'],
  type: ['type', 'category', 'class'],
}

let memo = { at: 0, body: null }

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (request.method === 'OPTIONS') return cors(request, env, new Response(null, { status: 204 }))

    if (path === '/push') {
      if (!['GET', 'POST'].includes(request.method)) return json({ error: 'method not allowed' }, 405)
      if (!(await authorised(request, url, env))) return json({ error: 'unauthorised' }, 401)
      return handlePush(request, url, env)
    }

    if (path === '/now-playing') {
      if (request.method !== 'GET') return json({ error: 'method not allowed' }, 405)
      return cors(request, env, await handleRead(env))
    }

    if (path === '/debug') {
      if (!(await authorised(request, url, env))) return json({ error: 'unauthorised' }, 401)
      const state = await readState(env)
      return json({ lastRaw: state.lastRaw ?? null, receivedAt: state.receivedAt ?? null })
    }

    return json({ error: 'not found' }, 404)
  },
}

async function handlePush(request, url, env) {
  const raw = await extractPayload(request, url)
  const track = normalise(raw)

  if (!track.title && !track.artist) {
    // Still remember the payload so the format can be inspected via /debug.
    const state = await readState(env)
    await writeState(env, { ...state, lastRaw: raw, receivedAt: new Date().toISOString() })
    return json({ ok: false, error: 'no title or artist found', received: raw }, 400)
  }

  const state = await readState(env)
  const same =
    state.current && state.current.title === track.title && state.current.artist === track.artist
  const now = new Date().toISOString()

  const history = same
    ? state.history
    : [state.current, ...(state.history ?? [])].filter(Boolean).slice(0, HISTORY_LENGTH)

  await writeState(env, {
    current: same ? state.current : { ...track, startedAt: now },
    history,
    lastRaw: raw,
    receivedAt: now,
  })
  memo = { at: 0, body: null }
  return json({ ok: true, track })
}

async function handleRead(env) {
  const now = Date.now()
  if (!memo.body || now - memo.at > READ_CACHE_MS) {
    const { current = null, history = [], receivedAt = null } = await readState(env)
    memo = { at: now, body: JSON.stringify({ nowPlaying: current, previouslyPlayed: history, updatedAt: receivedAt }) }
  }
  return new Response(memo.body, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=10, s-maxage=10, stale-while-revalidate=20',
    },
  })
}

async function extractPayload(request, url) {
  const out = Object.fromEntries(url.searchParams)
  delete out.token
  if (request.method === 'POST') {
    const type = request.headers.get('content-type') || ''
    try {
      if (type.includes('application/json')) {
        Object.assign(out, flatten(await request.json()))
      } else if (type.includes('form')) {
        const form = await request.formData()
        for (const [k, v] of form.entries()) if (k !== 'token' && typeof v === 'string') out[k] = v
      } else {
        const text = (await request.text()).trim()
        if (text) {
          try {
            Object.assign(out, flatten(JSON.parse(text)))
          } catch {
            out.text = text.slice(0, 500) // e.g. "Artist - Title"
          }
        }
      }
    } catch {
      // Unparseable body: fall through with whatever the query string gave us.
    }
  }
  return out
}

/** Flattens one level of nesting so { track: { title } } and { title } both work. */
function flatten(obj, depth = 0) {
  const out = {}
  if (!obj || typeof obj !== 'object') return out
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && depth < 2) Object.assign(out, flatten(v, depth + 1))
    else if (v !== null && v !== undefined && typeof v !== 'object') out[k] = v
  }
  return out
}

function normalise(raw) {
  const pick = (names) => {
    const lower = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k.toLowerCase(), v]))
    for (const n of names) {
      const v = lower[n.toLowerCase()]
      if (v !== undefined && String(v).trim()) return String(v).trim().slice(0, 300)
    }
    return ''
  }
  let title = pick(ALIASES.title)
  let artist = pick(ALIASES.artist)

  // Plain "Artist - Title" text fallback
  if (!title && !artist && raw.text) {
    const [a, ...rest] = String(raw.text).split(' - ')
    if (rest.length) {
      artist = a.trim()
      title = rest.join(' - ').trim()
    } else {
      title = String(raw.text).trim()
    }
  }

  const artwork = pick(ALIASES.artwork)
  return {
    title,
    artist,
    album: pick(ALIASES.album),
    artwork: artwork.startsWith('https://') ? artwork : '',
    type: pick(ALIASES.type),
  }
}

async function authorised(request, url, env) {
  if (!env.PUSH_TOKEN) return false
  const supplied =
    url.searchParams.get('token') ||
    request.headers.get('x-token') ||
    (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!supplied) return false
  return timingSafeEqual(supplied, env.PUSH_TOKEN)
}

async function timingSafeEqual(a, b) {
  const enc = new TextEncoder()
  const [ha, hb] = await Promise.all(
    [a, b].map(async (s) => new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s)))),
  )
  let diff = 0
  for (let i = 0; i < ha.length; i++) diff |= ha[i] ^ hb[i]
  return diff === 0
}

async function readState(env) {
  return (await env.NOW_PLAYING.get(KEY, 'json')) ?? {}
}

async function writeState(env, state) {
  await env.NOW_PLAYING.put(KEY, JSON.stringify(state))
}

function cors(request, env, response) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const origin = request.headers.get('origin')
  const res = new Response(response.body, response)
  if (origin && (allowed.includes('*') || allowed.includes(origin))) {
    res.headers.set('access-control-allow-origin', origin)
    res.headers.set('vary', 'Origin')
  }
  res.headers.set('access-control-allow-methods', 'GET, OPTIONS')
  return res
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}
